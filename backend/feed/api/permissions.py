from rest_framework.permissions import BasePermission
from django.shortcuts import get_object_or_404

from .exceptions import BadRequestError
from backend.exceptions import ForbiddenError
from feed.models import Post

class IsRightUser(BasePermission):
    '''ТОт ли пользователь?'''
    def has_object_permission(self, request, view, obj):
        return request.user==obj.user

class IsRightOwnerOrUser(BasePermission):
    '''Создатель или владелец?'''
    def has_object_permission(self, request, view, obj):
        return any([
            request.user==obj.user,
            request.user.my_page==obj.owner,
        ])

class IsNotLiked(BasePermission):
    '''Нет ли лайка?'''
    def has_permission(self, request, view):
        user = request.user
        data = request.data
        try:
            post_id = data['post_id']
        except KeyError:
            return True
        if post_id:
            try:
                like = view.model.objects.get(user=user, post_id=post_id)
            except view.model.DoesNotExist:
                return True
        else:
            raise BadRequestError('You need post id to  add like.')
        return False

class NotInOwnersBlacklist(BasePermission):
    '''Не находится ли пост в той групее, в которой данный пользователь находится в черном списке?'''
    def has_permission(self, request, view):
        if request.method == 'POST':
            post_id = request.data.get('post_id', None) or request.data.get('parent', None)
            try:
                post_id = int(post_id)
            except TypeError:
                return True
            post = Post.objects.get(id=post_id)
            if post.group_owner:
                return request.user not in post.group_owner.blacklist.all()
        return True

    def has_object_permission(self, request, view, obj):
        if obj.post_id.group_owner:
            return request.user not in obj.post_id.group_owner.blacklist.all()
        return True