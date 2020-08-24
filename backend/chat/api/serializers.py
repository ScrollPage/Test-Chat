from rest_framework import serializers

from chat.models import Chat, Contact, Message
from chat.service import get_user_contact

class UserSerializer(serializers.StringRelatedField):
    '''Returns a username of the user'''
    def to_internal_value(self, value):
        return value

class ContactSerializer(serializers.ModelSerializer):
    '''Сериализует пользователя'''
    user = UserSerializer()
    class Meta:
        model = Contact
        exclude = ['friends']

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
