from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework import mixins, serializers
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q, Min, Subquery, OuterRef
from collections import OrderedDict

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
        id = request.query_params.get('id', None)
        if not id:
            raise BadRequestError('You need to input a query parameter id in your request.')
        queryset = self.get_queryset().filter(owner__id=id)

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

def post_annotations(self, queryset):
    return queryset.annotate(
            num_likes=Count('likes', distinct=True)
        ).annotate(
            num_reposts=Count('reposts', distinct=True)
        ).annotate(
            is_liked=Count('likes', filter=Q(likes__user=self.request.user))
        ).annotate(
            is_watched=Count('reviews', filter=Q(reviews__user=self.request.user))
        ).annotate(
            num_reviews=Count('reviews', distinct=True)
        )

class RepresentationUsernameAdd(serializers.Serializer):
    '''Добавляет в вывод user_name'''

    def to_representation(self, instance):
        extra = OrderedDict([('user_name', instance.user.get_full_name())])
        base = super().to_representation(instance)
        return OrderedDict(list(extra.items()) + list(base.items()))