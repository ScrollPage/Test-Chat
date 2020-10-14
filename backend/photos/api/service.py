from rest_framework.viewsets import GenericViewSet
from rest_framework import mixins

from backend.service import PermissionMixin

class ListRetrieveCreateDestroyViewset(PermissionMixin,
                                 mixins.ListModelMixin,
                                 mixins.DestroyModelMixin,
                                 mixins.RetrieveModelMixin,
                                 mixins.CreateModelMixin,
                                 GenericViewSet):
    '''Обзор списка, обзор конкретной сущности, удаление'''
    pass