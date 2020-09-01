from rest_framework.permissions import BasePermission
from django.shortcuts import get_object_or_404

from chat.models import Contact
from community.models import AddRequest

class IsCurrentUser(BasePermission):
    '''Тот ли пользователь?'''
    def has_permission(self, request, view):
        contact = get_object_or_404(Contact, pk=view.kwargs['pk'])
        return any([
            (request.user and (request.user.username==contact.user.username)),
            (request.user and request.user.is_superuser)
        ])

class IsUsersInvites(BasePermission):
    '''Имеет ли право видеть приглашения?'''
    def has_permission(self, request, view):
        username = request.query_params.get('username', None)
        return any([
            (request.user and request.user.username==username),
            (request.user and request.user.is_superuser)
        ])

class OneOfUsers(BasePermission):
    '''Либо получатель, либо отправитель'''
    def has_permission(self, request, view):
        data = request.data
        try:
            sender_id = data['sender']
            receiver_id = data['receiver']
        except KeyError:
            return True
        sender_user = get_object_or_404(Contact, id=sender_id).user
        receiver_user = get_object_or_404(Contact, id=receiver_id).user
        return any([
            (request.user==sender_user),
            (request.user==receiver_user)
        ])

class IsReceiver(BasePermission):
    '''Получатель ли?'''
    def has_permission(self, request, view):
        data = request.data
        try:
            receiver_id = data['receiver']
        except KeyError:
            return True
        receiver_user = get_object_or_404(Contact, id=receiver_id).user
        return bool(request.user and (request.user==receiver_user))

class IsSenderNotCurrentAndNotFriends(BasePermission):
    '''Отправитель, не тот же самый, и не друг ли уже?'''
    def has_permission(self, request, view):
        data = request.data
        try:
            sender_id = data['sender']
            receiver_id = data['receiver']
        except KeyError:
            return True
        sender_contact = get_object_or_404(Contact, id=sender_id)
        receiver_contact = get_object_or_404(Contact, id=receiver_id)
        sender_user = sender_contact.user
        receiver_user = receiver_contact.user
        return all([
            (request.user),
            (request.user==sender_user),
            (sender_user!=receiver_user),
            (receiver_contact not in sender_contact.friends.all()),
            (sender_contact not in receiver_contact.friends.all()),
        ])

class IsNotSent(BasePermission):
    '''Запрос еще не был отправлен'''
    def has_permission(self, request, view):
        data = request.data
        try:
            sender_id = data['sender']
            receiver_id = data['receiver']
        except KeyError:
            return True
        try:
            add_request = AddRequest.objects.get(
                sender=sender_id, 
                receiver=receiver_id
            )
        except AddRequest.DoesNotExist:
            return True
        return False

class IsFriends(BasePermission):
    '''Друзья ли?'''
    def has_permission(self, request, view):
        data = request.data
        try:
            sender_id = data['sender']
            receiver_id = data['receiver']
        except KeyError:
            return True
        sender_contact = get_object_or_404(Contact, id=sender_id)
        receiver_contact = get_object_or_404(Contact, id=receiver_id)
        return all([
            (request.user),
            (receiver_contact in sender_contact.friends.all()),
            (sender_contact in receiver_contact.friends.all())
        ])
        