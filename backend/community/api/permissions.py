from rest_framework.permissions import BasePermission
from django.shortcuts import get_object_or_404

from contact.models import Contact
from community.models import AddRequest, UserInfo
from parties.models import Party

from rest_framework.permissions import BasePermission

class IsRightUser(BasePermission):
    '''Создатель ли?'''
    def has_object_permission(self, request, view, obj):
        if type(obj) == Contact:
            return request.user == obj
        elif type(obj) == UserInfo:
            return request.user == obj.user
        elif type(obj) == Party:
            return request. user == obj.admin

class NotInBlacklistFriends(BasePermission):
    '''Не в черном списке'''
    def has_permission(self, request, view):
        sender = request.user
        serializer = view.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        receiver = get_object_or_404(Contact, id=serializer.data['receiver'])
        return all([
            sender not in receiver.my_page.blacklist.all(),
            receiver not in sender.my_page.blacklist.all(),
        ])

class NotFriends(BasePermission):
    '''Не друг ли уже?'''
    def has_permission(self, request, view):
        sender = request.user
        serializer = view.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        receiver = get_object_or_404(Contact, id=serializer.data['receiver'])
        return all([
            sender not in receiver.my_page.friends.all(),
            receiver not in sender.my_page.friends.all(),
        ])

class NotCurrentUser(BasePermission):
    def has_permission(self, request, view):
        sender = request.user
        serializer = view.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return sender.id != serializer.data['receiver']

class IsNotSent(BasePermission):
    '''Запрос еще не был отправлен'''
    def has_permission(self, request, view):
        sender = request.user
        serializer = view.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        receiver_id = serializer.data['receiver']
        try:
            add_request = AddRequest.objects.get(
                sender=sender.id, 
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

class InBlackList(BasePermission):
    '''В черном ли списке?'''
    def has_permission(self, request, view):
        try:
            id = request.data['user_id']
        except KeyError:
            return True
        else:
            id=int(id)
            user = get_object_or_404(Contact, id=id)
            return user in request.user.my_page.blacklist.all()

class NotInBlackList(InBlackList):
    '''Не в черном списке'''
    def has_permission(self, request, view):
        try:
            id = request.data['user_id']
        except KeyError:
            return True
        else:
            id=int(id)
            user = get_object_or_404(Contact, id=id)
            return bool(user not in request.user.my_page.blacklist.all())

    def has_object_permission(self, request, view, obj):
        return request.user not in obj.my_page.blacklist.all()