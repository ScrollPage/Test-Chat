from rest_framework import serializers

class LikeSerializer(serializers.ModelSerializer):
    '''Сериализация лайка'''
    class Meta:
        model = Like
        exclude = ['user']

    def create(self, validated_data):
        user = validated_data.get('user', None)
        post = validated_data.get('post_id', None)
        send_like_notification(post.user, user, post.id)
        return super().create(validated_data)