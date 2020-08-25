from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework import mixins

from justchat.service import PermissionMixin

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
                                  mixins.ListModelMixin
                                  ):
    '''Глобальный обзорб создание'''
    pass
    
class ModelViewSetPermission(PermissionMixin, ModelViewSet):
    '''ModelViewSet and PermissionMixin'''
    pass