from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework import mixins, serializers
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q, Min, Subquery, OuterRef

from backend.service import (
    PermissionMixin, 
    LowContactSerializer, 
    SerializerMixin,
    PermissionMixin,
    PermissionSerializerMixin
)
from .exceptions import BadRequestError
from feed.models import Post
from contact.models import Contact

class UsersPostsListMixin(mixins.ListModelMixin):
    '''Посты только текущего пользователя'''
    def list(self, request, *args, **kwargs):
        id = request.query_params.get('id', None)
        queryset = self.get_queryset().filter(owner__user__id=id)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class PermisisonSerializerPostModelViewset(PermissionSerializerMixin, 
                                       ModelViewSet, 
                                       UsersPostsListMixin):
    '''
    Измененны методы определения прав доступа, класса сериализатора
    А также измененный метод лист
    '''
    pass

class CreateViewset(mixins.CreateModelMixin,
                    GenericViewSet):
    '''Создание с доп классами'''
    pass

class BaseFeedSerializer(serializers.Serializer):
    '''Базовый класс для сериализаторов'''
    user = LowContactSerializer(read_only=True)

def post_annotations(user, queryset):
    return queryset.annotate(
            num_likes=Count('likes', distinct=True)
        ).annotate(
            num_reposts=Count('reposts', distinct=True)
        ).annotate(
            is_liked=Count('likes', filter=Q(likes__user=user))
        ).annotate(
            is_watched=Count('reviews', filter=Q(reviews__user=user))
        ).annotate(
            num_reviews=Count('reviews', distinct=True)
        ).annotate(
            num_comments=Count('comments', distinct=True)
        )
