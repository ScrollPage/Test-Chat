from rest_framework import serializers, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from community.models import Page
from feed.models import Post, RePost
from backend.service import (
    LowContactSerializer,  
    LowReadContactSerializer,
    PartyShortSerializer,
    AbstractPostSerializer
)
from .exceptions import BadRequestError
from notifications.service import send_like_notification
from parties.api.service import PageSerializer


class UpdatePostSerializer(serializers.ModelSerializer):
    '''Сериализатор для метода put'''
    class Meta:
        model = Post
        fields = ['text']

class RecursivePostSerialzier(serializers.Serializer):
    '''Рекурсивный вывод родителей'''

    def to_representation(self, value):
        serializer = PostParentSerializer(value, context=self.context)
        return serializer.data

class PostParentSerializer(AbstractPostSerializer, serializers.ModelSerializer):
    '''Вывод родителя поста'''
    parent = RecursivePostSerialzier(read_only=True)
    user = LowReadContactSerializer(read_only=True)
    compressed_image = serializers.ImageField(read_only=True)
    class Meta:
        model = Post
        fields = [
            'id', 
            'user', 
            'owner', 
            'parent', 
            'text', 
            'image', 
            'timestamp',
            'compressed_image'
        ]

class BasePostSerialzier(AbstractPostSerializer, serializers.ModelSerializer):
    '''Базовый класс сeриализации постов и репостов'''
    num_reposts = serializers.IntegerField(read_only=True)
    is_liked = serializers.BooleanField(read_only=True)

    class Meta:
        model = Post
        exclude = ['published', 'likes', 'comments']

class PostSerializer(BasePostSerialzier):
    '''Сериализация поста'''
    class Meta:
        model = Post
        exclude = ['parent', 'group_owner', 'published', 'compressed_image', 'user', 'likes', 'comments']    

    def validate(self, attrs):
        data = self.context['request'].data
        if data.get('text', None) or data.get('image', None):
            return super().validate(attrs)
        raise BadRequestError('You need either image or text.')

    def create(self, validated_data):
        post = super().create(validated_data)
        if validated_data.get('image', None):
            post.image_save()
        return post

class PostListSerializer(BasePostSerialzier):
    '''Сериализация списка постов'''
    user = LowReadContactSerializer(read_only=True)
    parent = RecursivePostSerialzier(read_only=True)
    is_watched = serializers.BooleanField(read_only=True)
    num_reviews = serializers.IntegerField(read_only=True)
    group_owner = PartyShortSerializer(read_only=True)
    num_comments = serializers.IntegerField(read_only=True)
    owner = PageSerializer(read_only=True)

class RePostSerializer(BasePostSerialzier):
    '''Сериализация репоста'''
    
    class Meta:
        model = Post
        exclude = ['group_owner', 'compressed_image', 'published', 'user', 'likes', 'comments']

    def validate(self, attrs):
        data = self.context['request'].data
        if data.get('parent', None) and data.get('owner', None):
            return super().validate(attrs)
        else:
            raise BadRequestError('You need a parent and owner.')

    def create(self, validated_data):
        post = super().create(validated_data)
        if validated_data.get('image', None):
            post.image_save()
        return post