from rest_framework.permissions import BasePermission
from django.shortcuts import get_object_or_404

from chat.models import Contact

class IsCurrentUser(BasePermission):
    '''Тот ли пользователь?'''
    def has_permission(self, request, view):
        contact = get_object_or_404(Contact, pk=view.kwargs["pk"])
        return any(
            [(request.user and (request.user.username == contact.user.username)),
            (view.request.user.is_superuser)]
        )