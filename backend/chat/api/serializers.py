from rest_framework import serializers
from django.shortcuts import get_object_or_404

from chat.models import Chat, Message
from contact.models import Contact

class ContactSerializer(serializers.ModelSerializer):
    '''Сериализация контакта'''
    class Meta:
        model = Contact
        fields = ['id', 'first_name', 'last_name', 'slug']

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
    inside = serializers.BooleanField(read_only=True)
    class Meta:
        model = Chat
        fields = '__all__'
    
    def create(self, validated_data):
        participants = self.data.get('participants', None)
        chat = Chat()
        chat.save()
        for id in participants:
            chat.participants.add(get_object_or_404(Contact, id=id))
        chat.save()
        return chat