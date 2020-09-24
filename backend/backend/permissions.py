from rest_framework.permissions import BasePermission

class IsRightUser(BasePermission):
    '''Создатель ли?'''
    def has_object_permission(self, request, view, obj):
        return request.user==obj.user