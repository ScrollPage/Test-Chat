from rest_framework import serializers, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from feed.models import Post, Like, RePost, Comment
from backend.service import LowContactSerializer
from .service import (
    BaseFeedSerializer, 
    LowReadContactSerializer, 
    AbstractPostSerializer, 
    post_create,
    LowReadContactSerializer
)
from contact.models import Contact
from .exceptions import BadRequestError
from backend.service import UserValidationSerializer
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
        fields = ['id', 'user', 'parent', 'text', 'image', 'timestamp']

class RecursiveCommentSerialzier(serializers.Serializer):
    '''Рекурсивный вывод детей'''
    def to_representation(self, value):
        serializer = CommentchildSerializer(value, context=self.context)
        return serializer.data

class CommentChildSerializer(AbstractPostSerializer, serializers.ModelSerializer):
    '''Вывод детей комментария'''
    children = RecursiveCommentSerialzier(many=True, read_only=True)
    class Meta:
        model = Post
        fields = ['id', 'user', 'children', 'text', 'image', 'timestamp']

class CommentSerializer(AbstractPostSerializer, serializers.ModelSerializer, UserValidationSerializer):
    '''Сериализация коммента к посту'''
    post_id = serializers.IntegerField(write_only=True, required=True)
    children = CommentChildSerializer(many=True, read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'

    def create(self, validated_data):
        return comment_create(self, validated_data)

class BasePostSerialzier(AbstractPostSerializer, serializers.ModelSerializer, UserValidationSerializer):
    '''Базовый класс сeриализации постов и репостов'''
    num_reposts = serializers.IntegerField(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    is_liked = serializers.BooleanField(read_only=True)

    class Meta:
        model = Post
        fields = '__all__'

class PostSerializer(BasePostSerialzier):
    '''Сериализация поста'''
    class Meta:
        model = Post
        exclude = ['parent']

    def create(self, validated_data):
        return post_create(self, validated_data)

class PostListSerializer(BasePostSerialzier):
    '''Сериализация списка постов'''
    user = LowReadContactSerializer(read_only=True)
    parent = RecursivePostSerialzier(read_only=True)
    is_watched = serializers.BooleanField(read_only=True)
    num_reviews = serializers.IntegerField(read_only=True)
    
class RePostSerializer(BasePostSerialzier, UserValidationSerializer):
    '''Сериализация репоста'''
    def create(self, validated_data):
        return post_create(self, validated_data, False)

class LikeSerializer(serializers.ModelSerializer, UserValidationSerializer):
    '''Сериализация лайка'''
    class Meta:
        model = Like
        fields = '__all__'

    def create(self, validated_data):
        user = validated_data.get('user', None)
        post = validated_data.get('post_id', None)
        send_like_notification(post.user, user, post.id)
        return super().create(validated_data)
