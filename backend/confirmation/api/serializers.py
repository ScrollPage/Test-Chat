from rest_framework import serializers
from django.contrib.auth.models import User

class CreateUserSerializer(serializers.ModelSerializer):
    '''Создание пользоватля'''
    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        username = validated_data.get('username', None)
        email = validated_data.get('email', None)
        password = validated_data.get('password', None)
        user = User(
            username=username,
            email=email,
            is_active=False
        )
        user.set_password(password)
        user.save()
        return user