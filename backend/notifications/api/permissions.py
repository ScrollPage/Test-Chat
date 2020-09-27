from rest_framework.permissions import BasePermission

class UsersNotes(BasePermission):
    '''Может ли просматривать уведомления?'''
    def has_permission(self, request, view):
        pk = view.kwargs['pk']
        return request.user.id == pk
