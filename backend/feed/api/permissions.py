from rest_framework.permissions import BasePermission
from django.shortcuts import get_object_or_404

from .exceptions import BadRequestError

class IsCurrentUser(BasePermission):
    '''Тот ли пользователь?'''
    def has_permission(self, request, view):
        model = get_object_or_404(view.model, pk=view.kwargs['pk'])
        return bool(request.user==model.user)

class IsNotLiked(BasePermission):
    '''Нет ли лайка?'''
    def has_permission(self, request, view):
        data = request.data
        user = data.get('user', None)
        post_id = data.get('post_id', None)
        if user and post_id:
            try:
                like = get_object_or_404(view.model, user=user, post_id=post_id)
            except view.model.DoesNotExist:
                return True
        else:
            raise BadRequestError('You need post id to delete like.')
        return False