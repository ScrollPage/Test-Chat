from rest_framework.permissions import BasePermission
from django.shortcuts import get_object_or_404

class IsCurrentUser(BasePermission):
    '''Тот ли пользователь?'''
    def has_permission(self, request, view):
        model = get_object_or_404(view.model, pk=view.kwargs['pk'])
        return bool(request.user==model.user)

class IsNotLiked(BasePermission):
    '''Нет ли лайка?'''
    def has_permission(self, request, view):
        data = request.data
        try:
            user = data['user']
            post_id = data['post_id']
        except KeyError:
            return True
        try:
            like = view.model.objects.filter(post_id=post_id).get(user=user)
        except view.model.DoesNotExist:
            return True
        return False