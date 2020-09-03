from rest_framework import serializers
from django.db import models

from contact.models import Contact, MyToken, ContactCounter

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
        ]

    def create(self, validated_data):
        email = validated_data.get('email', None)
        password = validated_data.get('password', None)
        first_name = validated_data.get('first_name', None)
        last_name = validated_data.get('last_name', None)
        phone_number = validated_data.get('phone_number', None)
        try:
            slug = ContactCounter.objects.get(id=1).counter + 1
        except ContactCounter.DoesNotExist:
            counter = ContactCounter.objects.create()
            slug = 1

        user = Contact.objects.create_user(
            email=email,
            first_name=first_name,
            last_name=last_name,
            phone_number=phone_number,
            slug=f'id{slug}'
        )
        return user

class TokenSerializer(serializers.ModelSerializer):
    '''Сериализация токена'''
    class Meta:
        model = MyToken
        fields = ['token']