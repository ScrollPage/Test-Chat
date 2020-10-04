from rest_framework import serializers, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from community.models import Page
from feed.models import Post, Like, RePost, Comment
from backend.service import (
    LowContactSerializer,  
    LowReadContactSerializer,
    PartyShortSerializer,
)
from .service import (
    AbstractPostSerializer, 
)
from .exceptions import BadRequestError
from notifications.service import send_like_notification
from parties.api.service import PageSerializer


class UpdatePostSerializer(serializers.ModelSerializer):
    '''Сериализатор для метода put'''
    class Meta:
        model = Post
        fields = ['text']

class UpdateCommentSerializer(serializers.ModelSerializer):
    '''Сериализатор для обновления сообщения'''
    class Meta:
        model = Comment
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

class RecursiveCommentSerialzier(serializers.Serializer):
    '''Рекурсивный вывод детей'''
    def to_representation(self, value):
        serializer = CommentSerializer(value, context=self.context)
        return serializer.data

class FilterCommentSerializer(serializers.ListSerializer):
    '''Фильтр комментариев, только с parent'''
    def to_representation(self, data):
        data = data.filter(parent = None)
        return super().to_representation(data)

class CreateCommentSerializer(AbstractPostSerializer, serializers.ModelSerializer):
    '''Сериализатор создания комментария'''

    class Meta:
        model = Comment
        exclude = ['compressed_image', 'user']

    def validate(self, attrs):
        data = self.context['request'].data
        if data.get('text', None) or data.get('image', None):
            if data.get('post_id', None):  
                return super().validate(attrs)
            else:
                raise BadRequestError('You need post id.')
        else:
            raise BadRequestError('You need either image or text.')

class CommentSerializer(AbstractPostSerializer, serializers.ModelSerializer):
    '''Сериализация коммента к посту'''
    user = LowReadContactSerializer(read_only=True)
    children = RecursiveCommentSerialzier(many=True, read_only=True)

    class Meta:
        list_serializer_class = FilterCommentSerializer
        model = Comment
        fields = '__all__'

class BasePostSerialzier(AbstractPostSerializer, serializers.ModelSerializer):
    '''Базовый класс сeриализации постов и репостов'''
    num_reposts = serializers.IntegerField(read_only=True)
    is_liked = serializers.BooleanField(read_only=True)

    class Meta:
        model = Post
        exclude = ['published']

class PostSerializer(BasePostSerialzier):
    '''Сериализация поста'''
    class Meta:
        model = Post
        exclude = ['parent', 'group_owner', 'published', 'compressed_image', 'user']    

    def validate(self, attrs):
        data = self.context['request'].data
        if data.get('text', None) or data.get('image', None):
            return super().validate(attrs)
        raise BadRequestError('You need either image or text.')

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
        exclude = ['group_owner', 'compressed_image', 'published', 'user']

    def validate(self, attrs):
        data = self.context['request'].data
        if data.get('parent', None) and data.get('owner', None):
            return super().validate(attrs)
        else:
            raise BadRequestError('You need a parent and owner.')

class LikeSerializer(serializers.ModelSerializer):
    '''Сериализация лайка'''
    class Meta:
        model = Like
        exclude = ['user']

    def create(self, validated_data):
        user = validated_data.get('user', None)
        post = validated_data.get('post_id', None)
        send_like_notification(post.user, user, post.id)
        return super().create(validated_data)