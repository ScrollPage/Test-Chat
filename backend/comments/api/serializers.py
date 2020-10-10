from rest_framework import serializers

from backend.service import AbstractPostSerializer, LowReadContactSerializer
from comments.models import Comment
from feed.api.exceptions import BadRequestError

class UpdateCommentSerializer(serializers.ModelSerializer):
    '''Сериализатор для обновления сообщения'''
    class Meta:
        model = Comment
        fields = ['text']

class RecursiveCommentSerialzier(serializers.Serializer):
    '''Рекурсивный вывод детей'''
    def to_representation(self, value):
        serializer = CommentSerializer(value, context=self.context)
        return serializer.data

class FilterCommentSerializer(serializers.ListSerializer):
    '''Фильтр комментариев, только с parent'''
    def to_representation(self, data):
        data = data.filter(parent = None)
        return super().to_representation(data)

class CreateCommentSerializer(AbstractPostSerializer, serializers.ModelSerializer):
    '''Сериализатор создания комментария'''
    id = serializers.IntegerField(write_only=True, required=True)
    class Meta:
        model = Comment
        exclude = ['compressed_image', 'user', 'likes']

    def validate(self, attrs):
        data = self.context['request'].data
        if data.get('text', None) or data.get('image', None):
            return super().validate(attrs)
        else:
            raise BadRequestError('You need either image or text.')

    def create(self, validated_data):
        validated_data.pop('id')
        comment = Comment.objects.create(**validated_data)
        if validated_data.get('image', None):
            comment.image_save()
        return comment

class CommentSerializer(AbstractPostSerializer, serializers.ModelSerializer):
    '''Сериализация коммента к посту'''
    user = LowReadContactSerializer(read_only=True)
    children = RecursiveCommentSerialzier(many=True, read_only=True)

    class Meta:
        list_serializer_class = FilterCommentSerializer
        model = Comment
        exclude = ['likes']