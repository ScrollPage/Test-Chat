from rest_framework import serializers
from django.shortcuts import get_object_or_404

from chat.models import Chat, Message
from contact.models import Contact

class ContactSerializer(serializers.ModelSerializer):
    '''Сериализация контакта'''
    class Meta:
        model = Contact
        fields = ['id', 'first_name', 'last_name', 'slug', 'small_avatar']

class ContactIDSerializer(serializers.StringRelatedField):
    '''Сериализация id контакта'''
    def to_internal_value(self, value):
        return value

class MessageSerializer(serializers.ModelSerializer):
    '''Message serializer'''
    contact = ContactSerializer(read_only=True)
    class Meta:
        model = Message
        fields = '__all__'

class ChatSerializer(serializers.ModelSerializer):
    '''Базовый сериализатор для чатов'''
    messages = MessageSerializer(read_only=True, many=True)
    class Meta:
        model = Chat
        fields = '__all__'

class ChatOverviewSerializer(ChatSerializer):
    '''Сериализация контакта при обзоре'''
    participants = ContactSerializer(many=True)

    def to_representation(self, value):
        user = self.context['request'].user
        for participant in value.participants.all():
            if participant != user:
                full_name = participant.get_full_name()
                break
        response = super().to_representation(value).update({'companion_name': full_name})
        return response

class ChatCreateSerializer(ChatSerializer):
    '''Сериализация контакта при создании'''
    participants = ContactIDSerializer(many=True)
    id = serializers.IntegerField(read_only=True)
    
    def create(self, validated_data):
        participants = validated_data.pop('participants', None)
        chat = Chat()
        chat.save()
        for id in participants:
            chat.participants.add(get_object_or_404(Contact, id=id))
        chat.save()
        return chat