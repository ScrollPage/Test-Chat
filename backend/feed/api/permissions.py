from rest_framework.permissions import BasePermission
from django.shortcuts import get_object_or_404

from feed.models import Comment

class IsCurrentUser(BasePermission):
    '''Тот ли пользователь?'''
    def has_permission(self, request, view):
        model = get_object_or_404(view.model, pk=view.kwargs['pk'])
        return bool(request.user==model.user)