from rest_framework import serializers

from contact.models import Contact
from .exceptions import ForbiddenError
from parties.models import Party

class PermissionMixin:
    '''Mixin permission для action'''
    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_classes_by_action[self.action] 
                + self.mass_permission_classes
            ] 
        except KeyError:
            return [permission() for permission in self.permission_classes 
                + self.mass_permission_classes
            ]

class SerializerMixin:
    '''Класс сериализатора в зависимости от action'''
    def get_serializer_class(self):
        try:
            return self.serializer_class_by_action[self.action]
        except KeyError:
            return self.serializer_class

class PermissionSerializerMixin(PermissionMixin, SerializerMixin):
    '''Доп классы'''
    pass

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

class UserValidationSerializer(serializers.Serializer):
    '''Проверка соответствия пользователей'''

    def validate(self, attrs):
        user = self.context['request'].user
        if attrs['user'] !=  user:
            raise ForbiddenError('You are the wrong user.')
        return attrs


class LowReadContactSerializer(LowContactSerializer):
    '''Все поля для чтения, кроме slug'''
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    avatar = serializers.ImageField(read_only=True)

class PartyShortSerializer(serializers.ModelSerializer):
    '''Коротенькая сериализация групп'''
    class Meta:
        model = Party
        fields = ['id', 'name', 'image', 'slug']