from rest_framework import serializers
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from chat.models import Contact

def get_user_contact(username):
    user = get_object_or_404(User, username=username)
    return get_object_or_404(Contact, user=user)

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


class ContactSerializer(serializers.ModelSerializer):
    '''Сериализует пользователя'''
    user = UserSerializer()
    class Meta:
        model = Contact
        exclude = ['friends']
