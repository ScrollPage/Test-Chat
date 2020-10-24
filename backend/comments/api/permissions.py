from rest_framework.permissions import BasePermission

class NotInBlacklistComments(BasePermission):
    '''Не в черном ли списке у владельца сущности?'''
    def has_object_permission(self, request, view, obj):
        try:
            owner = obj.photo_owner.first().owner
        except AttributeError:
            comment_owner = obj.post_owner.first()
            if comment_owner.owner:
                owner = comment_owner.owner
            else:
                owner = comment_owner.group_owner
        return request.user not in owner.blacklist.all()