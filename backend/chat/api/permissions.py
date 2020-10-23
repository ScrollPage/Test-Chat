from rest_framework.permissions import BasePermission
from django.shortcuts import get_object_or_404

from chat.models import Chat, ChatRef

class IsMember(BasePermission):
    '''Назодится ли он в участниках'''
    def has_permission(self, request, view):
        if request.data.get('chat', None):
            pk = request.data['chat']
        elif view.kwargs.get('pk', None):
            pk = view.kwargs['pk']
        else:
            return False
        chat = get_object_or_404(Chat, id=pk)
        return request.user in chat.participants.all()


class IsCreator(BasePermission):
    '''Создатель ли'''
    def has_permission(self, request, view):
        pk = view.kwargs['pk']
        chat = get_object_or_404(Chat, id=pk)
        return request.user == chat.creator and not chat.is_chat

    def has_object_permission(self, request, view, obj):
        return request.user == obj.creator and not obj.is_chat

class IsSelfOrCreator(BasePermission):
    '''Сам ли пользователь'''
    def has_permission(self, request, view):
        pk = view.kwargs['pk']
        chat = get_object_or_404(Chat, id=pk)
        if request.data.get('some_id', None):
            user_id = request.data['some_id']
            return any([
                str(request.user.id) == user_id, 
                request.user == chat.creator
            ]) and not chat.is_chat and \
                request.user in chat.participants.all()
        return False

class NoRef(BasePermission):
    '''Ссылки на чат езе нет'''
    def has_permission(self, request, view):
        chat_id = request.data.get('chat')
        chat = get_object_or_404(Chat, id=chat_id)
        user = request.user
        return not bool(ChatRef.objects.filter(user=user, chat=chat))

class YourChatRef(BasePermission):
    '''Твоя ссылка на чат'''
    def has_object_permission(self, request, view, obj):
        return request.user == obj.user
