from rest_framework import generics, permissions, mixins
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404

from .serializers import CreateContactSerializer, TokenSerializer, CodeSerializer
from contact.models import Contact, MyToken, ContactCounter, Code
from community.models import Page
from feed.api.exceptions import BadRequestError
from .service import SerializerViewset, make_active

class RegistrationView(generics.CreateAPIView):
    '''Создание пользователя'''
    queryset = Contact.objects.all()
    serializer_class = CreateContactSerializer
    permission_classes = [permissions.AllowAny]


class ContactActivationView(SerializerViewset):
    '''Подтверждение аккаунта пользователя'''
    serializer_class = TokenSerializer
    serializer_class_by_action = {
        'phone_activation0': CodeSerializer
    }
    permission_classes = [permissions.AllowAny]

    def email_activation(self, request):
        token = request.data['token']
        token = get_object_or_404(MyToken, token=token)
        return make_active(token)

    def phone_activation(self, request):
        code = request.data['code']
        code = get_object_or_404(Code, code=code)
        return make_active(code)