from rest_framework import serializers, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from feed.models import Post, Like, RePost, Comment
from backend.service import LowContactSerializer
from .service import BaseFeedSerializer, LowReadContactSerializer, AbstractPostSerializer
from contact.models import Contact
from .exceptions import BadRequestError

class LikeSerializer(serializers.ModelSerializer, BaseFeedSerializer):
    '''Вывод пользователя лайка'''
    class Meta:
        model = Like
        exclude = ['id']

class RepostSerializer(serializers.ModelSerializer, BaseFeedSerializer):
    '''Вывод репоста лайка'''
    class Meta:
        model = RePost
        fields = ['id']

class ShortPostSerializer(serializers.ModelSerializer, BaseFeedSerializer):
    '''Вывод поста без доп информации'''
    id = serializers.IntegerField(required=False)
    class Meta:
        model = Post
        fields = ['id']

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

class CommentSerializer(AbstractPostSerializer, serializers.ModelSerializer):
    '''Сериализация коммента к посту'''
    post_id = serializers.IntegerField(write_only=True, required=True)

    class Meta:
        model = Comment
        fields = '__all__'

    def create(self, validated_data):
        text = validated_data.get('text', None)
        image = validated_data.get('image', None)
        if text or image:
            try:
                slug = validated_data.get('user', None)['slug']
            except KeyError:
                slug = None
            parent = validated_data.get('parent', None)
            comment = Comment.objects.create(
                text=text,
                image=image,
                user=get_object_or_404(Contact, slug=slug),
                parent=parent
            )
            post_id = validated_data.get('post_id', None)
            if post_id:
                post = get_object_or_404(Post, id=post_id)
                post.comments.add(comment)
                post.save()
            else:
                BadRequestError('You need post id.')
        else:
            raise BadRequestError('You need either image or text.')
        return comment

class PostSerializer(AbstractPostSerializer, serializers.ModelSerializer):
    '''Сериализация поста'''
    parent = ShortPostSerializer(required=False)
    num_reposts = serializers.IntegerField(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    is_liked = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Post
        fields = '__all__'

    def create(self, validated_data):
        text = validated_data.get('text', None)
        image = validated_data.get('image', None)
        if text or image:
            try:
                slug = validated_data.get('user', None)['slug']
            except KeyError:
                slug = None
            try:
                parent = validated_data.get('parent', None)['id']
            except KeyError:
                parent = None
            post = Post.objects.create(
                text=text,
                image=image,
                user=get_object_or_404(Contact, slug=slug),
                parent=parent
            )
        else:
            raise BadRequestError('You need either image or text.')
        return post

class LikeCreateSerializer(serializers.ModelSerializer):
    '''Сериализация лайка'''
    class Meta:
        model = Like
        fields = '__all__'

class LikeRemoveSerializer(serializers.ModelSerializer):
    '''Сериализация лайка'''
    class Meta:
        model = Like
        exclude = ['user']