from rest_framework import serializers
from rest_framework.test import APIClient
from django.shortcuts import reverse
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db import models
from django.shortcuts import get_object_or_404
import sys

from contact.models import Contact
from .exceptions import ForbiddenError
from parties.models import Party
from like.models import Like
from photos.models import Photo

def save_image(output, name, format):
    return InMemoryUploadedFile(
            output, 
            'ImageField', 
            "%s.jpg" % name.split('.')[0], 
            f'image/{format}',
            sys.getsizeof(output), 
            None
        )

def get_response(url, method, user=None, data=None, kwargs=None, is_url=False, format=None):
    client = APIClient()

    if user:
        client.force_authenticate(user)

    if not is_url:
        url = reverse(url, kwargs=kwargs)

    method_dict = {
        'post': client.post,
        'get': client.get,
        'patch': client.patch,
        'delete': client.delete
    }

    return method_dict[method](url, data, format=format)

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
        fields = ['id', 'first_name', 'last_name', 'slug']

class LowReadContactSerializer(LowContactSerializer):
    '''Все поля для чтения, кроме slug'''
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)

    def to_representation(self, value):
        photo_id = value.avatar_id
        if photo_id:
            photo = Photo.objects.get(id=photo_id)
            d = {
                'small_avatar': photo.small_picture.url
            }
        else:
            d = {
                'small_avatar': None
            }
        res = super().to_representation(value)
        res.update(d)
        return res

class PartyShortSerializer(serializers.ModelSerializer):
    '''Коротенькая сериализация групп'''
    class Meta:
        model = Party
        fields = ['id', 'name', 'image', 'slug']



class AbstractPostSerializer(serializers.Serializer):
    '''Базовый сериализатор для поста и коммента'''
    num_likes = serializers.IntegerField(read_only=True)
    timestamp = serializers.DateTimeField(read_only=True)