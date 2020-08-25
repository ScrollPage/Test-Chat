from rest_framework import serializers
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from chat.models import Contact
from justchat.service import UserSerializer, ContactSerializer
from community.models import AddRequest

class UserDetailSerializer(serializers.ModelSerializer):
    '''Сериализует пользователя'''
    class Meta:
        model = User
        fields = ['username', 'email', 'last_login']

class ContactFriendsSerializer(serializers.ModelSerializer):
    '''Менее развернутый контакт'''
    user = UserSerializer()
    class Meta:
        model = Contact
        fields = ['id', 'user']

class ContactDetailSerializer(serializers.ModelSerializer):
    '''Выводит профиль пользователя'''
    user = UserDetailSerializer()
    is_friend = serializers.BooleanField()
    num_friends = serializers.IntegerField()
    current_user = serializers.BooleanField()
    # is_sent = serializers.BooleanField()
    friends = ContactFriendsSerializer(many=True)
    class Meta:
        model = Contact
        fields = '__all__'

class FriendActionsSerializer(serializers.Serializer):
    sender = serializers.IntegerField()
    receiver = serializers.IntegerField()

class AddRequestSerializer(serializers.ModelSerializer):
    '''Создает запрос на добавление'''
    class Meta:
        model = AddRequest
        fields = '__all__'

    def create(self, validated_data):
        data = self.data
        sender_id = data.get('sender', None)
        receiver_id = data.get('receiver', None)
        sender_contact = get_object_or_404(Contact, id=sender_id)
        receiver_contact = get_object_or_404(Contact, id=receiver_id)
        AddRequest.objects.create(
            sender = sender_contact,
            receiver = receiver_contact
        )

        return AddRequest
