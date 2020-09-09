from rest_framework.permissions import BasePermission

class IsOwner(BasePermission):
    '''Может ли просматривать лист текущих чатов?'''
    def has_permission(self, request, view):
        id = request.query_params.get('id', None)
        if id:
            return bool(int(id)==request.user.id)
        return True
        
