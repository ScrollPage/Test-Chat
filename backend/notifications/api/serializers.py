from rest_framework import serializers

from notifications.models import Notice
from backend.service import LowContactSerializer

class NotificationSerializer(serializers.ModelSerializer):
    '''Сериализация уведомлений'''
    sender = LowContactSerializer(read_only=True)
    class Meta:
        model = Notice
        fields = ['sender', 'event', 'seen']