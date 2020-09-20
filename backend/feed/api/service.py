from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework import mixins, serializers
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from backend.service import (
    PermissionMixin, 
    LowContactSerializer, 
    LowContactSerializer, 
    SerializerMixin
)
from .exceptions import BadRequestError
from feed.models import Post
from contact.models import Contact

class UsersPostsListMixin(mixins.ListModelMixin):
    '''Посты только текущего пользователя'''
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(user=request.user)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class PermissionSerializerMixin(PermissionMixin, SerializerMixin):
    '''Доп классы'''
    pass

class PermisisonSerializerModelViewset(PermissionSerializerMixin, 
                                       ModelViewSet, 
                                       UsersPostsListMixin):
    '''
    Измененны методы определения прав доступа, класса сериализатора
    А также измененный метод лист
    '''
    pass

class PermissionSerializerExcludeListViewset(PermissionSerializerMixin,
                                             mixins.UpdateModelMixin,
                                             mixins.DestroyModelMixin,
                                             mixins.CreateModelMixin,
                                             mixins.RetrieveModelMixin,
                                             GenericViewSet,
                                            ):
    '''Создание, редактирование и удаление с доп классами'''
    pass

class PermissionCreateViewset(PermissionMixin,
                                        mixins.CreateModelMixin,
                                        GenericViewSet,
                                    ):
    '''Создание с доп классами'''
    pass

class CreateViewset(mixins.CreateModelMixin,
                    GenericViewSet,
                ):
    '''Создание с доп классами'''
    pass
    

class LowReadContactSerializer(LowContactSerializer):
    '''Все поля для чтения, кроме slug'''
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    avatar = serializers.ImageField(read_only=True)


class BaseFeedSerializer(serializers.Serializer):
    '''Базовый класс для сериализаторов'''
    user = LowContactSerializer(read_only=True)

class AbstractPostSerializer(serializers.Serializer):
    '''Базовый сериализатор для поста и коммента'''
    num_likes = serializers.IntegerField(read_only=True)
    timestamp = serializers.DateTimeField(read_only=True)

def post_create(self,validated_data, is_post=True):
    '''
    is_post = True - создание поста
    is_post = False - создание репоста
    '''
    text = validated_data.get('text', None)
    image = validated_data.get('image', None)
    if text or image:
        user = validated_data.get('user', None)
        if is_post:
            parent = None
        else:
            parent = validated_data.get('parent', None)
        post = Post.objects.create(**validated_data)
    else:
        raise BadRequestError('You need either image or text.')
    return post

def comment_create(self, validated_data):
    text = validated_data.pop('text', None)
    image = validated_data.pop('image', None)
    if text or image:
        try:
            slug = validated_data.pop('user', None)['slug']
        except KeyError:
            slug = None
        parent = validated_data.pop('parent', None)
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