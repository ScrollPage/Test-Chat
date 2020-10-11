from rest_framework import serializers
from django.shortcuts import get_object_or_404

from chat.models import Chat
from contact.models import Contact
from backend.service import ContactSerializer, LowContactSerializer
from community.models import AddRequest, Page, UserInfo
from notifications.service import send_addrequest_notification
from feed.api.exceptions import BadRequestError
from parties.api.serializers import PartyShortSerializer
from photos.models import Photo
from feed.models import Post

class UserInfoSerializer(serializers.ModelSerializer):
    '''Сериализация информациио пользователе'''
    class Meta:
        model = UserInfo
        exclude = ['user']

class ContactFriendsSerializer(serializers.ModelSerializer):
    '''Менее развернутый контакт'''
    chat_id = serializers.IntegerField(read_only=True)
    class Meta:
        model = Contact 
        fields = ['id', 'first_name', 'last_name', 'slug', 'small_avatar', 'chat_id']

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
    num_notes = serializers.IntegerField(read_only=True)
    current_user = serializers.BooleanField(read_only=True)
    is_sent = serializers.BooleanField(read_only=True)
    is_sent_to_you = serializers.BooleanField(read_only=True)
    my_page = PageSerializer(read_only=True)
    info = UserInfoSerializer(read_only=True)
    compressed_avatar = serializers.ImageField(read_only=True)
    small_avatar = serializers.ImageField(read_only=True)

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
            'activation_type',
        ]

    def update(self, instance, validated_data):
        user = super().update(instance, validated_data)
        if validated_data.get('avatar', None):
            user.image_save()
            photo = Photo.objects.create(
                picture=user.avatar.url,
                small_picture=user.small_avatar.url,
                compressed_picture=user.compressed_avatar.url,
                owner = user.my_page
            )
            post = Post.objects.create(
                image=user.avatar.url,
                compressed_image=user.compressed_avatar.url,
                owner = user.my_page,
                text=f'{user.get_full_name()} изменил аватарку!',
                user=user,
            )

        return user

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
        send_addrequest_notification(sender, receiver)
        return super().create(validated_data)

    def validate(self, data):
        if data.get('receiver', None) and data.get('sender', None):
            return super().validate(data)
        raise BadRequestError('You need sender and receiver.')

class IntegerFieldSerializer(serializers.Serializer):
    user_id = serializers.IntegerField(required=True)

    class Meta:
        ref_name = 'community_int_serializer'
        
