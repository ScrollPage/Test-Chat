from rest_framework.permissions import BasePermission
from django.shortcuts import get_object_or_404

from contact.models import Contact
from community.models import AddRequest, UserInfo

from rest_framework.permissions import BasePermission

class IsRightUser(BasePermission):
    '''Создатель ли?'''
    def has_object_permission(self, request, view, obj):
        if type(obj) == Contact:
            return request.user == obj
        elif type(obj) == UserInfo:
            return request.user == obj.user

class NotCurrentAndNotFriends(BasePermission):
    '''Не тот же самый, и не друг ли уже?'''
    def has_permission(self, request, view):
        data = request.data
        try:
            sender_id = data['sender']
            receiver_id = data['receiver']
        except KeyError:
            return True
        sender_page = get_object_or_404(Contact, id=sender_id).my_page
        receiver_page = get_object_or_404(Contact, id=receiver_id).my_page
        return all([
            (sender_page!=receiver_page),
            (receiver_page.user not in sender_page.friends.all()),
            (sender_page.user not in receiver_page.friends.all()),
        ])

class IsSender(BasePermission):
    '''Отправитель ли'''
    def has_permission(self, request, view):
        if request.method == 'POST':
            view.get_serializer(data=request.data).is_valid(raise_exception=True)
            data = request.data
            sender_id = data['sender']
            sender_contact = get_object_or_404(Contact, id=sender_id)
            return request.user==sender_contact
        return True

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
            (receiver in sender.my_page.friends.all()),
            (sender in receiver.my_page.friends.all())
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