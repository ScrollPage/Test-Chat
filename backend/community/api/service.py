from rest_framework.viewsets import GenericViewSet
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