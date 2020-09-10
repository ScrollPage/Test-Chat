from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework import mixins, serializers
from rest_framework.response import Response

from backend.service import PermissionMixin, LowContactSerializer, LowContactSerializer

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

class PermisisonModelViewset(PermissionMixin, ModelViewSet, UsersPostsListMixin):
    '''Все про посты'''
    pass

class LowReadContactSerializer(LowContactSerializer):
    '''Все поля для чтения, кроме slug'''
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    avatar = serializers.ImageField(read_only=True)


class BaseFeedSerializer(serializers.Serializer):
    user = LowContactSerializer()