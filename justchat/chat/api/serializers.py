from rest_framework import serializers
from django.contrib.auth.models import User

from chat.models import Chat, Contact, Message
from chat.service import get_user_contact

class UserSeralizer(serializers.ModelSerializer):
    '''User serializer'''
    class Meta:
        model = User
        fields = ['username', 'email', 'is_superuser', 'is_staff', 'last_login']

# class UserFriendSerializer(serializers.ModelSerializer):
#     '''Serializes a friend user'''
#     class Meta:
#         model = User
#         fields = ['username', 'email', 'last_login']

# class FriendSerializer(serializers.ModelSerializer):
#     '''Вывод друзей'''
#     user = UserFriendSerializer(read_only=True)
#     class Meta:
#         model = Contact
#         fields = ['user']

class ContactDetailSerializer(serializers.ModelSerializer):
    '''Contact serialzier'''
    user = UserSeralizer(read_only=True)
    # friends = FriendSerializer(read_only=True, many=True)
    class Meta:
        model = Contact
        exclude = ['friends']

# class ContactUsernameSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['username']

# class MessageContactSerializer(serializers.ModelSerializer):
    
#     user = ContactUsernameSerializer(read_only=True)
#     class Meta:
#         model = Contact
#         fields = ['user']

class ContactSerializer(serializers.StringRelatedField):
    '''Returns a username of the contact'''
    def to_internal_value(self, value):
        return value

class MessageSerializer(serializers.ModelSerializer):
    '''Message serializer'''
    contact = ContactSerializer(read_only=True)
    class Meta:
        model = Message
        fields = '__all__'

class ChatSerializer(serializers.ModelSerializer):
    '''Chat serializer'''
    participants = ContactSerializer(many=True)
    messages = MessageSerializer(read_only=True, many=True)
    class Meta:
        model = Chat
        fields = '__all__'
    
    def create(self, validated_data):
        participants = self.data.get('participants', None)
        chat = Chat()
        chat.save()
        for username in participants:
            contact = get_user_contact(username)
            chat.participants.add(contact)
        chat.save()
        return chat
