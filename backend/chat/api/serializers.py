from rest_framework import serializers

from chat.models import Chat, Contact, Message
from justchat.service import (
    UserSerializer, 
    ContactSerializer, 
    get_user_contact
)

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
        print(participants)
        chat = Chat()
        chat.save()
        for username in participants:
            contact = get_user_contact(username)
            chat.participants.add(contact.id)
        chat.save()
        return chat
