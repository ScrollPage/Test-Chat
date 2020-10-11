from rest_framework import serializers

from photos.models import Photo
from parties.api.service import PageSerializer

class PhotoSerializer(serializers.ModelSerializer):
    '''Сериализация фотографии'''
    timestamp = serializers.DateTimeField(read_only=True)
    small_picture = serializers.ImageField(read_only=True)
    compressed_picture = serializers.ImageField(read_only=True)
    picture = serializers.ImageField(required=True)
    owner = PageSerializer(read_only=True)

    def create(self, validated_data):
        photo = super().create(validated_data)
        photo.image_save()
        return photo

    class Meta:
        model = Photo
        exclude = ['likes', 'comments']

    