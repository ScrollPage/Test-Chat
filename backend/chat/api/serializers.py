from rest_framework import serializers
from django.shortcuts import get_object_or_404

from chat.models import Chat, Message
from contact.models import Contact
from photos.models import Photo
from backend.service import LowReadContactSerializer

class ContactIDSerializer(serializers.StringRelatedField):
    '''Сериализация id контакта'''
    def to_internal_value(self, value):
        return value

class MessageSerializer(serializers.ModelSerializer):
    '''Message serializer'''
    contact = LowReadContactSerializer(read_only=True)
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
    participants = LowReadContactSerializer(many=True)

    def to_representation(self, value):
        companion = user = self.context['request'].user
        for participant in value.participants.all():
            if participant != user:
                companion = participant
                break
        
        if companion.avatar_id:
            small_avatar = Photo.objects.get(id=companion.avatar_id).small_picture.url
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