from rest_framework import generics, permissions, mixins, viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.forms.models import model_to_dict
from django.db.models import Q, Count

from .serializers import (
    CreateContactSerializer, 
    TokenSerializer, 
    CodeSerializer, 
    MeSerializer, 
    AvatarSerializer
)
from contact.models import Contact, MyToken, ContactCounter, Code
from community.models import Page
from feed.api.exceptions import BadRequestError
from .service import SerializerViewset, make_active
from photos.models import Photo

class AvatarChangeView(generics.CreateAPIView):
    '''Смена аватарки'''
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AvatarSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user.my_page)

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
        serializer = self.get_serializer()
        queryset = Contact.objects.filter(id=request.user.id).annotate(
            num_notifications=Count(
                'notifications', 
                filter=Q(
                    notifications__receiver=request.user, 
                    notifications__seen=False
                ), 
                distinct=True
            )
        ).annotate(
            unread=Count('chats', filter=Q(chats__messages__is_read=False), distinct=True)
        )
        return Response(data=serializer.to_representation(queryset.first()), status=status.HTTP_200_OK)

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