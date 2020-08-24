from rest_framework import serializers
from django.contrib.auth.models import User

from chat.models import Contact

class UserSerializer(serializers.ModelSerializer):
    '''Сериализует пользователя'''
    class Meta:
        model = User
        fields = ['username', 'email', 'last_login']

class ContactDetailSerializer(serializers.ModelSerializer):
    '''Выводит профиль пользователя'''
    user = UserSerializer()
    class Meta:
        model = Contact
        fields = '__all__'