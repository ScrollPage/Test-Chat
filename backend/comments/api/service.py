from rest_framework.viewsets import GenericViewSet
from rest_framework import mixins

from backend.service import PermissionSerializerMixin

class PermissionSerializerCommentModelViewset(PermissionSerializerMixin,
                                              mixins.ListModelMixin,
                                              mixins.RetrieveModelMixin,
                                              mixins.UpdateModelMixin,
                                              mixins.DestroyModelMixin,
                                              GenericViewSet):
    '''Создание, редактирование и удаление с доп классами'''
    pass