from rest_framework import serializers

from chat.models import Chat, Contact, Message
from chat.service import get_user_contact

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
        chat = Chat()
        chat.save()
        for username in self.data.get('participants', None):
            contact = get_user_contact(username)
            chat.participants.add(contact)
        chat.save()
        return chat
