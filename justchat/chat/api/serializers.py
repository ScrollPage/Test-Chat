from rest_framework import serializers
from django.contrib.auth.models import User

from chat.models import Chat, Contact

class UserSeralizer(serializers.ModelSerializer):
    '''User serializer'''
    class Meta:
        model = User
        fields = ['username', 'email', 'is_superuser', 'is_staff', 'last_login']

class UserFriendSerializer(serializers.ModelSerializer):
    '''Serializes a friend user'''
    class Meta:
        model = User
        fields = ['username', 'email', 'last_login']

class FriendSerializer(serializers.ModelSerializer):
    '''Вывод друзей'''
    user = UserFriendSerializer(read_only=True)
    class Meta:
        model = Contact
        fields = ['user']

class ContactDetailSerializer(serializers.ModelSerializer):
    '''Contact serialzier'''
    user = UserSeralizer(read_only=True)
    friends = FriendSerializer(read_only=True, many=True)
    class Meta:
        model = Contact
        fields = '__all__'

class ChatSerializer(serializers.ModelSerializer):
    '''Chat serializer'''
    participants = ContactDetailSerializer(read_only=True, many=True)
    class Meta:
        model = Chat
        fields = '__all__'
