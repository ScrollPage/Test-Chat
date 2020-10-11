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
    class Meta:
        model = Chat
        exclude = ['messages']

class ChatOverviewSerializer(ChatSerializer):
    '''Сериализация контакта при обзоре'''
    participants = ContactSerializer(many=True)

    def to_representation(self, value):
        companion = user = self.context['request'].user
        for participant in value.participants.all():
            if participant != user:
                companion = participant
                break
        
        if companion.small_avatar:
            small_avatar = companion.small_avatar.url
        else:
            small_avatar = None
        
        d = {
            'id': companion.id,
            'first_name': companion.first_name,
            'last_name': companion.last_name,
            'phone_number': companion.phone_number,
            'slug': companion.slug,
            'small_avatar': small_avatar,
        }

        response = super().to_representation(value)
        response.update({'companion': d})
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