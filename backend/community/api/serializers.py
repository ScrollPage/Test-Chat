from rest_framework import serializers
from django.shortcuts import get_object_or_404

from chat.models import Chat
from contact.models import Contact
from backend.service import ContactSerializer, LowContactSerializer
from community.models import AddRequest
from notifications.service import send_addrequest_notification
from feed.api.exceptions import BadRequestError
from parties.api.serializers import PartyShortSerializer

class ContactFriendsSerializer(serializers.ModelSerializer):
    '''Менее развернутый контакт'''
    chat_id = serializers.IntegerField(read_only=True)
    class Meta:
        model = Contact 
        fields = fields = ['id', 'first_name', 'last_name', 'slug', 'avatar', 'chat_id']

class PageSerializer(serializers.ModelSerializer):
    '''Сериализация страницы пользователя'''
    friends = ContactFriendsSerializer(many=True, read_only=True)
    parties = PartyShortSerializer(many=True, read_only=True)
    class Meta:
        model = Page
        exclude = ['user']
        ref_name = 'community'

class ContactDetailSerializer(ContactFriendsSerializer):
    '''Выводит профиль пользователя'''
    is_friend = serializers.BooleanField(read_only=True)
    num_friends = serializers.IntegerField(read_only=True)
    current_user = serializers.BooleanField(read_only=True)
    is_sent = serializers.BooleanField(read_only=True)
    is_sent_to_you = serializers.BooleanField(read_only=True)
    friends = LowContactSerializer(many=True, read_only=True)

    class Meta:
        model = Contact
        exclude = [
            'groups', 
            'password', 
            'user_permissions', 
            'is_admin', 
            'is_staff', 
            'is_superuser',
            'is_active',
        ]

class FriendActionsSerializer(serializers.Serializer):
    sender = serializers.IntegerField()
    receiver = serializers.IntegerField()

class AddRequestSerializer(serializers.ModelSerializer):
    '''Создает запрос на добавление'''
    timestamp = serializers.DateTimeField(read_only=True)
    class Meta:
        model = AddRequest
        exclude = ['id']

    def create(self, validated_data):
        receiver = validated_data.get('receiver', None)
        sender = validated_data.get('sender', None)
        if sender and receiver:
            send_addrequest_notification(sender, receiver)
            return super().create(validated_data)
        raise BadRequestError('You need sender and receiver.')
