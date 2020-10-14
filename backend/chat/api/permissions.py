from rest_framework.permissions import BasePermission

class IsOwner(BasePermission):
    '''Может ли просматривать лист текущих чатов?'''
    def has_object_permission(self, request, view, obj):
        print(obj.participants.all())
        return request.user in obj.participants.all()
        
