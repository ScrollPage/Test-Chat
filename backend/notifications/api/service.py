from rest_framework import mixins
from rest_framework.viewsets import GenericViewSet

from backend.service import SerializerMixin

class NotificationView(SerializerMixin,
                       mixins.ListModelMixin,
                       mixins.UpdateModelMixin,
                       GenericViewSet,
                       ):
    '''Список и обновление'''
    pass