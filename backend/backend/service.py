from rest_framework import serializers

from contact.models import Contact

class PermissionMixin:
    '''Mixin permission для action'''
    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_classes]

class SerializerMixin:
    '''Класс сериализатора в зависимости от action'''
    def get_serializer_class(self):
        try:
            return self.serializer_class_by_method[self.request.method]
        except KeyError:
            return self.serializer_class

class ContactSerializer(serializers.ModelSerializer):
    '''Сериализует пользователя'''
    class Meta:
        model = Contact
        exclude = ['friends']

class LowContactSerializer(serializers.ModelSerializer):
    '''Базовая сриализация контакта'''
    class Meta:
        model = Contact
        fields = ['id', 'first_name', 'last_name', 'slug', 'avatar',]