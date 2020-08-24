from rest_framework import serializers
from django.contrib.auth.models import User

from chat.models import Contact
from justchat.service import UserSerializer

class UserDetailSerializer(serializers.ModelSerializer):
    '''Сериализует пользователя'''
    class Meta:
        model = User
        fields = ['username', 'email', 'last_login']

class ContactFriendsSerializer(serializers.ModelSerializer):
    '''Менее развернутый контакт'''
    user = UserSerializer()
    class Meta:
        model = Contact
        fields = ['id', 'user']

class ContactDetailSerializer(serializers.ModelSerializer):
    '''Выводит профиль пользователя'''
    user = UserDetailSerializer()
    is_friend = serializers.BooleanField()
    num_friends = serializers.IntegerField()
    current_user = serializers.BooleanField()
    friends = ContactFriendsSerializer(many=True)
    class Meta:
        model = Contact
        fields = '__all__'