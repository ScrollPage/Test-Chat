from rest_framework import serializers, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from community.models import Page
from feed.models import Post, Like, RePost, Comment
from backend.service import LowContactSerializer, UserValidationSerializer, LowReadContactSerializer
from .service import (
    BaseFeedSerializer, 
    AbstractPostSerializer, 
)
from .exceptions import BadRequestError
from notifications.service import send_like_notification


class UpdatePostSerializer(serializers.ModelSerializer):
    '''Сериализатор для метода put'''
    class Meta:
        model = Post
        fields = ['text', 'image']

class UpdateCommentSerializer(serializers.ModelSerializer):
    '''Сериализатор для обновления сообщения'''
    class Meta:
        model = Comment
        fields = ['text', 'image']

class RecursivePostSerialzier(serializers.Serializer):
    '''Рекурсивный вывод родителей'''

    def to_representation(self, value):
        serializer = PostParentSerializer(value, context=self.context)
        return serializer.data

class PostParentSerializer(AbstractPostSerializer, serializers.ModelSerializer):
    '''Вывод родителя поста'''
    parent = RecursivePostSerialzier(read_only=True)
    user = LowReadContactSerializer(read_only=True)
    class Meta:
        model = Post
        fields = ['id', 'user', 'owner', 'parent', 'text', 'image', 'timestamp']

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

class CreateCommentSerializer(AbstractPostSerializer, serializers.ModelSerializer, UserValidationSerializer):
    '''Сериализатор создания комментария'''

    class Meta:
        model = Comment
        fields = '__all__'

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

class BasePostSerialzier(AbstractPostSerializer, serializers.ModelSerializer, UserValidationSerializer):
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
        exclude = ['parent', 'group_owner', 'published']    

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

    
class RePostSerializer(BasePostSerialzier, UserValidationSerializer):
    '''Сериализация репоста'''

    def validate(self, attrs):
        data = self.context['request'].data
        if data.get('parent', None):
            return super().validate(attrs)
        else:
            raise BadRequestError('You need a parent.')

class LikeSerializer(serializers.ModelSerializer):
    '''Сериализация лайка'''
    class Meta:
        model = Like
        fields = '__all__'

    def create(self, validated_data):
        user = validated_data.get('user', None)
        post = validated_data.get('post_id', None)
        send_like_notification(post.user, user, post.id)
        return super().create(validated_data)