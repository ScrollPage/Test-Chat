from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework import mixins
from rest_framework.response import Response
from django.db.models import Q

from backend.service import PermissionMixin

class RetrieveUpdateDestroyPermissionViewset(PermissionMixin, 
                                             GenericViewSet,
                                             mixins.UpdateModelMixin,
                                             mixins.DestroyModelMixin,
                                             mixins.RetrieveModelMixin
                                            ):
    '''Обзор, кастомизцая, удаление'''
    pass

class CustomListModelMixin(mixins.ListModelMixin):
    '''Фильтрация запросовв зависимости от пользователя'''

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(receiver=request.user)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class ListCreatePermissionViewset(PermissionMixin,
                                  GenericViewSet,
                                  mixins.CreateModelMixin,
                                  CustomListModelMixin,
                                  ):
    '''Глобальный обзорб создание'''
    pass
    
class ModelViewSetPermission(PermissionMixin, ModelViewSet):
    '''ModelViewSet and PermissionMixin'''
    pass

def filter_by_query_name(query_name, queryset):
    if query_name:
        for term in query_name.split('_')[:2]:
            queryset = queryset.filter(
                Q(first_name__icontains=term) | Q(last_name__icontains=term)
            )
    return queryset