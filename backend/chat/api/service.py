from rest_framework.viewsets import GenericViewSet
from rest_framework import mixins, serializers
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count

from chat.models import Chat, ChatRef
from contact.models import Contact
from backend.exceptions import ForbiddenError
from backend.service import PermissionSerializerMixin, SerializerMixin

class PermissionCreateRetrieveUpdate(PermissionSerializerMixin,
                                     mixins.CreateModelMixin, 
                                     mixins.RetrieveModelMixin,
                                     mixins.UpdateModelMixin,
                                     GenericViewSet, 
                                    ):
    '''Создание, обзор, обновление'''

class ListDestroyCreateViewset(PermissionSerializerMixin,
                               GenericViewSet, 
                               mixins.ListModelMixin,
                               mixins.DestroyModelMixin,
                               mixins.CreateModelMixin,
                            ):
    '''Список, удаление'''
    pass

def make_refs(chat, participants):
    for participant in participants:
        chat.participants.add(participant)
        ChatRef.objects.create(chat=chat, user=participant)
    chat.save()

def not_in_blacklist(user, participants):
    for participant in participants:
        if participant in user.my_page.blacklist.all():
            raise ForbiddenError('This user in your blacklist.')
    return

def is_friend(user, participants):
    for participant in participants:
        if participant not in user.my_page.friends.all():
            raise ForbiddenError('Its not your friend.')
    return

