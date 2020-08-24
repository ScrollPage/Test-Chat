from rest_framework.viewsets import GenericViewSet
from rest_framework import mixins 
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

from chat.models import Chat, Contact
from chat.service import get_user_contact

class PermissionMixin:
    '''Mixin permission для action'''
    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_classes]

class CustomListModelMixin(mixins.ListModelMixin):
    '''Custom list mixin'''

    def get_queryset(self):
        queryset = Chat.objects.all()
        username = self.request.query_params.get('username', None)

        if username:
            contact = get_user_contact(username)
            try:
                queryset = contact.chats.all()
            except AttributeError:
                queryset = []
            
        return queryset

class PermissionModelCustomViewSet(mixins.CreateModelMixin, 
                                   mixins.DestroyModelMixin,
                                   mixins.RetrieveModelMixin,
                                   mixins.UpdateModelMixin,
                                   PermissionMixin,
                                   CustomListModelMixin,
                                   GenericViewSet):
    '''Model viewset с переделанный list методом'''