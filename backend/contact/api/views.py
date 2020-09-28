from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from datetime import timedelta
from django.utils import timezone

from .serializers import CreateContactSerializer, TokenSerializer
from contact.models import Contact, MyToken, ContactCounter

class RegistrationView(generics.CreateAPIView):
    '''Создание пользователя'''
    queryset = Contact.objects.all()
    serializer_class = CreateContactSerializer
    permission_classes = [permissions.AllowAny]

class ContactActivationView(generics.GenericAPIView):
    '''Подтверждение аккаунта пользователя'''
    serializer_class = TokenSerializer
    permission_classes = [permissions.AllowAny,]

    def post(self, request):
        try:
            token = request.data['token']
        except KeyError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        token = get_object_or_404(MyToken, token=token)
        user = token.user
        if token.created + timedelta(hours=2) < timezone.now():
            del user
            return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            user.is_active = True
            user.save()
            return Response(status=status.HTTP_200_OK)