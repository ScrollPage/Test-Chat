from rest_framework import serializers
from rest_framework.test import APIClient
from django.shortcuts import reverse
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db import models
from PIL import Image
from io import BytesIO
import sys

from contact.models import Contact
from .exceptions import ForbiddenError
from parties.models import Party
from like.models import Like

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
        fields = ['id', 'first_name', 'last_name', 'slug', 'small_avatar',]

class LowReadContactSerializer(LowContactSerializer):
    '''Все поля для чтения, кроме slug'''
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    small_avatar = serializers.ImageField(read_only=True)

class PartyShortSerializer(serializers.ModelSerializer):
    '''Коротенькая сериализация групп'''
    class Meta:
        model = Party
        fields = ['id', 'name', 'image', 'slug']

class AbstractPost(models.Model):
    '''Абстрактный пост'''
    user = models.ForeignKey(Contact, on_delete=models.CASCADE)
    text = models.TextField(max_length=1000, blank=True, default='')
    image = models.ImageField(upload_to='user_posts/%Y/%m/%d', blank=True, null=True)
    compressed_image = models.ImageField(upload_to='compressed_user_posts/%Y/%m/%d', blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(Like)

    def image_save(self, *args, **kwargs):
        im = Image.open(self.image)
        output = BytesIO()
        try:
            im.save(output, format='JPEG', quality=0)
            format = 'jpeg'
        except OSError:
            im.save(output, format='PNG', quality=0)
            format = 'png'

        print('asd')
        output.seek(0)
        self.compressed_image = save_image(output, self.image.name, format)

        super().save()

    def __str__(self):
        return str(self.id)

    def delete_images(self):
        self.image.delete(save=False)
        self.compressed_image.delete(save=False)

    def delete(self):
        self.delete_images()
        super().delete()

    class Meta:
        abstract = True

class AbstractPostSerializer(serializers.Serializer):
    '''Базовый сериализатор для поста и коммента'''
    num_likes = serializers.IntegerField(read_only=True)
    timestamp = serializers.DateTimeField(read_only=True)