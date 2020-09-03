from rest_framework import serializers
from django.shortcuts import get_object_or_404

from chat.models import Contact
from backend.service import ContactSerializer
from community.models import AddRequest

class ContactFriendsSerializer(serializers.ModelSerializer):
    '''Менее развернутый контакт'''
    class Meta:
        model = Contact
        fields = ['id', 'first_name', 'last_name', 'slug', 'avatar']

class ContactDetailSerializer(serializers.ModelSerializer):
    '''Выводит профиль пользователя'''
    is_friend = serializers.BooleanField(read_only=True)
    num_friends = serializers.IntegerField(read_only=True)
    current_user = serializers.BooleanField(read_only=True)
    is_sent = serializers.BooleanField(read_only=True)
    is_sent_to_you = serializers.BooleanField(read_only=True)
    friends = ContactFriendsSerializer(many=True, read_only=True)

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
    class Meta:
        model = AddRequest
        fields = '__all__'

    def create(self, validated_data):
        data = self.data
        sender_id = data.get('sender', None)
        receiver_id = data.get('receiver', None)
        sender_contact = get_object_or_404(Contact, id=sender_id)
        receiver_contact = get_object_or_404(Contact, id=receiver_id)
        add_request = AddRequest.objects.create(
            sender = sender_contact,
            receiver = receiver_contact
        )
        print(add_request.id)
        return add_request