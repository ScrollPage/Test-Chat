from rest_framework import serializers

class PermissionMixin:
    '''Mixin permission для action'''
    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_classes]

class UserSerializer(serializers.StringRelatedField):
    '''Returns a username of the user'''
    def to_internal_value(self, value):
        return value