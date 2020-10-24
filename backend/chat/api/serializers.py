from rest_framework import serializers
from django.shortcuts import get_object_or_404

from chat.models import Chat, Message, ChatRef
from contact.models import Contact
from photos.models import Photo
from backend.service import LowReadContactSerializer
from feed.api.exceptions import BadRequestError
from .service import make_refs
from backend.exceptions import ForbiddenError

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
        response = super().to_representation(value)
        if value.is_chat:
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

            response.update({'companion': d})
        else:
            name = ''
            if not value.name:
                for participant in value.participants.all():
                    name += f'{participant.first_name},'
            response.update({'name': name[:-1]})
        return response

class ChatUpdateSerializer(serializers.ModelSerializer):
    '''Обновление чата'''
    class Meta:
        model = Chat
        fields = ['name']

class ChatRefSerializer(serializers.ModelSerializer):
    chat = ChatOverviewSerializer(read_only=True)
    num_unread = serializers.IntegerField(read_only=True)
    class Meta:
        model = ChatRef
        fields = ['id', 'num_unread', 'chat']

class ChatRefCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRef
        fields = ['chat']

class ChatCreateSerializer(ChatSerializer):
    '''Сериализация контакта при создании'''
    participants = ContactIDSerializer(many=True)
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Chat
        exclude = ['messages', 'creator', 'name']

    def check_participant_blacklist(self, participants):
        user = self.context['request'].user
        arr = []
        for id in participants:
            part = get_object_or_404(Contact, id=id)
            if user in part.my_page.blacklist.all():
                raise ForbiddenError('You are in blacklist.')
            else:
                arr.append(part)

        return arr

    def validate(self, data):
        participants = data.get('participants', None)
        print(participants)
        if data.get('is_chat'):
            if len(participants) != 2:
                raise BadRequestError('Number of participants must be equal 2.')
        else:
            if len(participants) < 2:
                raise BadRequestError('Number of participants must be greater then 2.')
        return super().validate(data)

    def create(self, validated_data):
        participants = validated_data.get('participants')
        participants = self.check_participant_blacklist(participants)
        chat = Chat()
        if validated_data.get('is_chat'):
            chat.save()
        else:
            chat.save(
                is_chat=False, 
                creator=self.context['request'].user
            )
        return chat

class ListSerializer(serializers.Serializer):
    participants = serializers.ListField()