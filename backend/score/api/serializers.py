from rest_framework import serializers, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from contact.models import Contact
from score.models import Score
from feed.models import Post
from backend.exceptions import ForbiddenError

class ScoreCreateSerializer(serializers.ModelSerializer):
    '''Сериализация просмотра'''
    class Meta:
        model = Score
        exclude = ['user']

    def create(self, validated_data):
        try:
            Score.objects.get(**validated_data)
            raise ForbiddenError("You've already seen this one.")
        except Score.DoesNotExist:
            score = Score.objects.create(**validated_data)
        return score
