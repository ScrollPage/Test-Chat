from rest_framework.permissions import BasePermission


class IsGroupAdminOrStaff(BasePermission):
    '''Админ или стаф'''
    def has_object_permission(self, request, view, obj):
        return any([
            request.user == obj.admin,
            request.user in obj.staff.all()
        ])

class IsGroupAdmin(BasePermission):
    '''Админ?'''
    def has_object_permission(self, request, view, obj):
        return request.user == obj.admin