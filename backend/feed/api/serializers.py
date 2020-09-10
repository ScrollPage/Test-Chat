from rest_framework import serializers
from django.shortcuts import get_object_or_404

from feed.models import Post, Like, RePost
from backend.service import LowContactSerializer
from .service import BaseFeedSerializer, LowReadContactSerializer
from contact.models import Contact

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
    user = LowReadContactSerializer()
    class Meta:
        model = Post
        fields = ['id', 'user']

class UpdatePostSerializer(serializers.ModelSerializer):
    '''Сериализатор для метода put'''
    class Meta:
        model = Post
        fields = ['text', 'image']

class PostSerializer(serializers.ModelSerializer, BaseFeedSerializer):
    '''Сериализация поста'''
    user = LowReadContactSerializer()
    parent = ShortPostSerializer()
    likes = LikeSerializer(many=True, read_only=True)
    reposts = LikeSerializer(many=True, read_only=True)
    class Meta:
        model = Post
        fields = '__all__'

    def create(self, validated_data):
        text = validated_data.get('text', None)
        image = validated_data.get('image', None)
        try:
            slug = validated_data.get('user', None)['slug']
        except KeyError:
            slug = None
        try:
            parent = validated_data.get('parent', None)['user']['slug']
        except KeyError:
            parent = None
        post = Post.objects.create(
            text=text,
            image=image,
            user=get_object_or_404(Contact, slug=slug),
            parent=parent
        )
        return post