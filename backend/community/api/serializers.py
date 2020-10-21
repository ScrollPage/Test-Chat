from rest_framework import serializers
from django.shortcuts import get_object_or_404

from chat.models import Chat
from contact.models import Contact
from backend.service import ContactSerializer, LowReadContactSerializer
from backend.exceptions import ForbiddenError
from community.models import AddRequest, Page, UserInfo
from notifications.service import send_addrequest_notification
from feed.api.exceptions import BadRequestError
from parties.api.serializers import PartyShortSerializer
from photos.models import Photo
from feed.models import Post
from contact.models import Contact

class UserInfoUpdateSerializer(serializers.ModelSerializer):
    '''Сериализация информациио пользователе'''
    class Meta:
        model = UserInfo
        exclude = ['user']

    def update(self, validated_data, instance):
        return super().update(validated_data, instance)

class UserInfoCreateSerializer(serializers.ModelSerializer):
    '''Сериализация информациио пользователе'''
    class Meta:
        model = UserInfo
        fields = '__all__'

    def create(self, validated_data):
        user = validated_data.get('user')
        info = UserInfo.objects.create(**validated_data, id=user.id)
        return info

class ContactFriendsSerializer(LowReadContactSerializer):
    '''Менее развернутый контакт'''
    chat_id = serializers.IntegerField(read_only=True)
    class Meta:
        model = Contact 
        fields = ['id', 'first_name', 'last_name', 'slug', 'chat_id']

class PageSerializer(serializers.ModelSerializer):
    '''Сериализация страницы пользователя'''
    friends = ContactFriendsSerializer(many=True, read_only=True)
    parties = PartyShortSerializer(many=True, read_only=True)
    class Meta:
        model = Page
        exclude = ['id', 'user', 'blacklist']
        ref_name = 'community'

class ContactDetailSerializer(serializers.ModelSerializer):
    '''Выводит профиль пользователя'''
    is_friend = serializers.BooleanField(read_only=True)
    num_friends = serializers.IntegerField(read_only=True)
    num_notes = serializers.IntegerField(read_only=True)
    current_user = serializers.BooleanField(read_only=True)
    is_sent = serializers.BooleanField(read_only=True)
    is_sent_to_you = serializers.BooleanField(read_only=True)
    my_page = PageSerializer(read_only=True)
    info = UserInfoUpdateSerializer(read_only=True)
    avatar_id = serializers.IntegerField(read_only=True)
    chat_id = serializers.IntegerField(read_only=True)

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

    def to_representation(self, value):
        photo_id = value.avatar_id
        if photo_id:
            photo = Photo.objects.get(id=photo_id)
            d = {
                'avatar': photo.picture.url,
                'small_avatar': photo.small_picture.url,
                'compressed_avatar': photo.compressed_picture.url
            }
        else:
            d = {
                'avatar': None,
                'small_avatar': None,
                'compressed_avatar': None
            }
        res = super().to_representation(value)
        res.update(d)
        return res

class FriendActionsSerializer(serializers.Serializer):
    sender = serializers.IntegerField()
    receiver = serializers.IntegerField()

class AddRequestSerializer(serializers.ModelSerializer):
    '''Создает запрос на добавление'''
    timestamp = serializers.DateTimeField(read_only=True)
    class Meta:
        model = AddRequest
        exclude = ['id', 'sender']

    def create(self, validated_data):
        send_addrequest_notification(self.context['request'].user, validated_data['receiver'])
        return super().create(validated_data)

class IntegerFieldSerializer(serializers.Serializer):
    user_id = serializers.IntegerField(required=True)

    class Meta:
        ref_name = 'community_int_serializer'
        
