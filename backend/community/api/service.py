from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework import mixins
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

class ListCreatePermissionViewset(PermissionMixin,
                                  GenericViewSet,
                                  mixins.CreateModelMixin,
                                  mixins.ListModelMixin,
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