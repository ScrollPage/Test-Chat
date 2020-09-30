from rest_framework import serializers

from backend.service import LowReadContactSerializer, PartyShortSerializer
from parties.models import Party
from .service import PageSerializer
from feed.api.exceptions import BadRequestError
from feed.api.serializers import PostSerializer, PostListSerializer
from feed.models import Post

class PartyDetailSerializer(serializers.ModelSerializer):
    '''Сериализация списка групп'''
    staff = LowReadContactSerializer(many=True, read_only=True)
    members = PageSerializer(many=True, read_only=True)
    admin = LowReadContactSerializer(read_only=True)
    num_members = serializers.IntegerField(read_only=True)
    joined = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Party
        exclude = ['blacklist']

class PartyCreateSerializer(serializers.ModelSerializer):
    '''Сериализация создания групп'''
    class Meta:
        model = Party
        exclude = ['blacklist', 'staff']

class IntegerFieldSerializer(serializers.Serializer):
    '''Вход и выход из группы'''
    some_id = serializers.IntegerField(required=True)

class EmptySerializer(serializers.Serializer):
    '''Пустой сериализатор'''
    pass

class OfferedPostSerializer(PostSerializer):
    '''Сериализация поста в предложжку'''
    published = serializers.BooleanField(read_only=True)
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Post
        exclude = ['parent', 'owner', 'group_owner', 'compressed_image']

class PostListSerializer(PostListSerializer):
    '''Сериализция списка постов без группы-владельца'''
    owner = None
    published = None
    parent = None
    class Meta:
        model = Post
        exclude = ['parent', 'published', 'owner']
        ref_name = 'group_post_list_serialzier'