from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from datetime import timedelta
from django.utils import timezone

from .serializers import CreateUserSerializer, TokenSerializer
from confirmation.models import MyToken
from chat.models import Contact

class RegistrationView(generics.CreateAPIView):
    '''Создание пользователя'''
    queryset = User.objects.all()
    serializer_class = CreateUserSerializer
    permission_classes = [permissions.AllowAny, ]

class UserActivationView(generics.GenericAPIView):
    '''Подтверждение аккаунта пользователя'''
    serializer_class = TokenSerializer
    permission_classes = [permissions.AllowAny, ]

    def post(self, request):
        token = request.data['token']
        token = get_object_or_404(MyToken, token=token)
        user = token.user
        if token.created + timedelta(hours=2) < timezone.now():
            del user
            return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            user.is_active = True
            Contact.objects.create(user=user)
            user.save()
            return Response(status=status.HTTP_200_OK)