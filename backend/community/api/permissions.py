from rest_framework.permissions import BasePermission
from django.shortcuts import get_object_or_404

from contact.models import Contact
from community.models import AddRequest

class IsCurrentUser(BasePermission):
    '''Тот ли пользователь?'''
    def has_permission(self, request, view):
        print('дерьмо')
        contact = get_object_or_404(Contact, pk=view.kwargs['pk'])
        return any([
            (request.user.slug==contact.slug),
            (request.user.is_superuser)
        ])

class IsUsersInvites(BasePermission):
    '''Имеет ли право видеть приглашения?'''
    def has_permission(self, request, view):
        slug = request.query_params.get('slug', None)
        return any([
            (request.user.slug==slug),
            (request.user.is_superuser)
        ])

class NotCurrentAndNotFriends(BasePermission):
    '''Не тот же самый, и не друг ли уже?'''
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
            (sender_contact!=receiver_contact),
            (receiver_contact not in sender_contact.friends.all()),
            (sender_contact not in receiver_contact.friends.all()),
        ])

class IsSender(BasePermission):
    '''Отправитель ли'''
    def has_permission(self, request, view):
        data = request.data
        try:
            sender_id = data['sender']
        except KeyError:
            return True
        sender_contact = get_object_or_404(Contact, id=sender_id)
        return bool(request.user==sender_contact)

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

class IsReceiver(BasePermission):
    '''Получатель ли?'''
    def has_permission(self, request, view):
        data = request.data
        try:
            receiver_id = data['receiver']
        except KeyError:
            return True
        receiver = get_object_or_404(Contact, id=receiver_id)
        return bool(request.user and (request.user==receiver))

class IsFriends(BasePermission):
    '''Друзья ли?'''
    def has_permission(self, request, view):
        data = request.data
        try:
            sender_id = data['sender']
            receiver_id = data['receiver']
        except KeyError:
            return True
        sender = get_object_or_404(Contact, id=sender_id)
        receiver = get_object_or_404(Contact, id=receiver_id)
        return all([
            (request.user),
            (receiver in sender.friends.all()),
            (sender in receiver.friends.all())
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
        sender = get_object_or_404(Contact, id=sender_id)
        receiver = get_object_or_404(Contact, id=receiver_id)
        return any([
            (request.user==sender),
            (request.user==receiver)
        ])