from rest_framework import serializers
from django.db import models

from contact.models import Contact, MyToken, ContactCounter, Code
from feed.api.exceptions import BadRequestError

class MeSerializer(serializers.ModelSerializer):
    '''Обзор самого себя'''
    id = serializers.IntegerField()

    class Meta:
        model = Contact
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'phone_number',
            'slug',
            'avatar',
            'compressed_avatar',
            'small_avatar'
        ]

class CreateContactSerializer(serializers.ModelSerializer):
    '''Создание пользоватля'''
    class Meta:
        model = Contact
        fields = [
            'email', 
            'password', 
            'first_name', 
            'last_name',
            'phone_number',
            'activation_type',
        ]

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        activation_type = validated_data.get('activation_type', None)
        if activation_type != 'email' and activation_type != 'phone':
            raise BadRequestError('Wrong activation type.')
        try:
            slug = ContactCounter.objects.get(id=1).counter + 1
        except ContactCounter.DoesNotExist:
            counter = ContactCounter.objects.create()
            slug = 1
    
        user = Contact.objects.create(
            slug=f'id{slug}',
            **validated_data,
        )
        user.set_password(password)
        user.save()
        return user

class TokenSerializer(serializers.ModelSerializer):
    '''Сериализация токена'''
    class Meta:
        model = MyToken
        fields = ['token']
    
    def validate(self, data):
        if data.get('token', None):
            return super().validate(data)
        return BadRequestError('You need a token.')

class CodeSerializer(serializers.ModelSerializer):
    '''Сериализация токена'''
    class Meta:
        model = Code
        fields = ['code']
    
    def validate(self, data):
        if data.get('code', None):
            return super().validate(data)
        return BadRequestError('You need a code.')