from rest_framework.permissions import BasePermission
from django.shortcuts import get_object_or_404

from parties.models import Party
from feed.models import Post

class IsGroupAdminOrStaff(BasePermission):
    '''Админ или стаф'''
    def has_object_permission(self, request, view, obj):
        return any([
            request.user == obj.admin,
            request.user in obj.staff.all()
        ])
    
    def has_permission(self, request, view):
        print(request.method)
        if request.method == 'POST':
            group = get_object_or_404(Party, id=view.kwargs['pk'])
            return any([
                request.user == group.admin,
                request.user in group.staff.all()
            ])
        return True

class IsGroupAdmin(BasePermission):
    '''Админ?'''
    def has_object_permission(self, request, view, obj):
        return request.user == obj.admin

    def has_permission(self, request, view):
        print(view.action)
        if request.method == 'POST':
            group = get_object_or_404(Party, id=view.kwargs['pk'])
            return request.user == group.admin
        return True

class NotInBlacklist(BasePermission):
    '''Не в черном списке?'''
    def has_permission(self, request, view):
        group = get_object_or_404(Party, id=view.kwargs['pk'])
        return request.user not in group.blacklist.all()

class RightPostGroupOwner(BasePermission):
    '''Владеет ли группа данным постом?'''
    def has_permission(self, request, view):
        if request.method == 'POST':
            group = get_object_or_404(Party, id=view.kwargs['pk'])
            post = get_object_or_404(Post, id=request.data['some_id'])
            return post.group_owner == group
        return True