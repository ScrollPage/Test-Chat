from rest_framework import serializers

from backend.service import LowReadContactSerializer
from parties.models import Party
from .service import PageSerializer
from feed.api.exceptions import BadRequestError

class PartyListSerializer(serializers.ModelSerializer):
    '''Сериализация списка групп'''
    staff = LowReadContactSerializer(many=True, read_only=True)
    members = PageSerializer(many=True, read_only=True)
    admin = LowReadContactSerializer(read_only=True)
    num_members = serializers.IntegerField(read_only=True)
    joined = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Party
        exclude = ['blacklist']

class PartyCreateSerializer(serializers.ModelSerializer):
    '''Сериализация создания групп'''
    class Meta:
        model = Party
        exclude = ['blacklist', 'staff']

class PartyShortSerializer(serializers.ModelSerializer):
    '''Коротенькая сериализация групп'''
    class Meta:
        model = Party
        fields = ['name', 'image', 'slug', 'info']

class JoinAndLeaveSerializer(serializers.Serializer):
    '''Вход и выход из группы'''
    group_id = serializers.IntegerField(required=True)