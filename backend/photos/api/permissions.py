from rest_framework.permissions import BasePermission
from django.shortcuts import get_object_or_404

from contact.models import Contact

class NotInBlacklist(BasePermission):
    '''Не в черном списке'''
    def has_permission(self, request, view):
        id = request.query_params.get('user_id')
        if id:
            try:
                id = int(id)
            except ValueError:
                return True
            user = get_object_or_404(Contact, id=id)
            return request.user not in user.my_page.blacklist.all()
        else:
            return True
    
    def has_object_permission(self, request, view, obj):
        return request.user not in obj.owner.blacklist.all()

class IsRightUser(BasePermission):
    '''Тот ли пользователь?'''
    def has_object_permission(self, request, view, obj):
        return request.user==obj.owner.user