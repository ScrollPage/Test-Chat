from rest_framework.viewsets import GenericViewSet
from rest_framework import mixins 
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

from chat.models import Chat, Contact

class PermissionMixin:
    '''Mixin permission для action'''
    def get_permission(self):
        try:
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_class]

def get_user_contact(username):
    user = get_object_or_404(User, username=username)
    contact = get_object_or_404(Contact, user=user)
    return contact

class CustomListModelMixin(mixins.ListModelMixin):
    '''Custom list mixin'''

    def get_queryset(self):
        queryset = Chat.objects.all()
        username = self.request.query_params.get('username')

        if username:
            contact = get_user_contact(username)
            queryset = contact.chats.all()
        return queryset

class PermissionModelCusomViewSet(mixins.CreateModelMixin, 
                                  mixins.DestroyModelMixin,
                                  mixins.RetrieveModelMixin,
                                  mixins.UpdateModelMixin,
                                  PermissionMixin,
                                  CustomListModelMixin,
                                  GenericViewSet):
    '''Model viewset с переделанный list методом'''