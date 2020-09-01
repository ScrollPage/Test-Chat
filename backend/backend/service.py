from rest_framework import serializers

from contact.models import Contact

class PermissionMixin:
    '''Mixin permission для action'''
    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_classes]

class ContactSerializer(serializers.ModelSerializer):
    '''Сериализует пользователя'''
    class Meta:
        model = Contact
        exclude = ['friends']