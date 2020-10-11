from rest_framework import generics, permissions, mixins, viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.forms.models import model_to_dict

from .serializers import CreateContactSerializer, TokenSerializer, CodeSerializer, MeSerializer
from contact.models import Contact, MyToken, ContactCounter, Code
from community.models import Page
from feed.api.exceptions import BadRequestError
from .service import SerializerViewset, make_active

class RegistrationView(generics.CreateAPIView):
    '''Создание пользователя'''
    queryset = Contact.objects.all()
    serializer_class = CreateContactSerializer
    permission_classes = [permissions.AllowAny]

class MeViewset(viewsets.GenericViewSet):
    '''Обзор самого себя по токену'''
    serializer_class = MeSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['get'])
    def me(self, request, *args, **kwargs):
        user = model_to_dict(request.user)
        if not user['avatar']:
            user['avatar'] = None
            user['compressed_avatar'] = None
            user['small_avatar'] = None
        else:
            user['avatar'] = request.user.avatar.url
            user['compressed_avatar'] = request.user.compressed_avatar.url
            user['small_avatar'] = request.user.small_avatar.url
        serializer = self.get_serializer(data=user)
        serializer.is_valid()
        return Response(data=serializer.data, status=status.HTTP_200_OK)

class ContactActivationView(SerializerViewset):
    '''Подтверждение аккаунта пользователя'''
    serializer_class = TokenSerializer
    serializer_class_by_action = {
        'phone_activation': CodeSerializer
    }
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def email_activation(self, request):
        token = request.data['token']
        token = get_object_or_404(MyToken, token=token)
        return make_active(token)

    @action(detail=False, methods=['post'])
    def phone_activation(self, request):
        code = request.data['code']
        code = get_object_or_404(Code, code=code)
        return make_active(code)