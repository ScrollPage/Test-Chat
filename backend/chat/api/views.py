from rest_framework import permissions, generics, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count

from chat.models import Chat, ChatRef
from contact.models import Contact
from .serializers import (
    ChatCreateSerializer, 
    ChatOverviewSerializer, 
    ChatRefSerializer,
    ChatRefCreateSerializer,
    ChatUpdateSerializer,
    ListSerializer
)
from .service import (
    PermissionCreateRetrieveUpdate, 
    ListDestroyCreateViewset, 
    is_friend,
    not_in_blacklist, 
    make_refs
)
from .permissions import IsMember, YourChatRef, NoRef, IsCreator, IsSelfOrCreator
from parties.api.serializers import IntegerFieldSerializer, EmptySerializer

class ChatModelPermissionViewSet(PermissionCreateRetrieveUpdate):
    '''Все, что связано с чатами'''
    serializer_class = ChatUpdateSerializer
    permission_classes = [IsCreator]
    permission_classes_by_action = {
        'create': [],
        'retrieve': [],
        'remove': [IsSelfOrCreator],
        'read': [IsMember],

    }
    serializer_class_by_action = {
        'retrieve': ChatOverviewSerializer,
        'create': ChatCreateSerializer,
        'add': ListSerializer,
        'remove': IntegerFieldSerializer,
        'read': EmptySerializer
    }
    mass_permission_classes = [permissions.IsAuthenticated]

    def validate(self, participants):
        not_in_blacklist(self.request.user, participants)
        is_friend(self.request.user, participants)

    @action(detail=False, methods=['post'])
    def add(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        pk = kwargs['pk']
        chat = get_object_or_404(Chat, id=pk)
        participants = serializer.data['participants']
        participants = [get_object_or_404(Contact, id=id) for id in participants]
        self.validate(participants)
        make_refs(chat, participants)
        return Response(status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def remove(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        pk = kwargs['pk']
        chat = get_object_or_404(Chat, id=pk)
        id = serializer.data['some_id']
        user = get_object_or_404(Contact, id=id)
        chat.participants.remove(user)
        ChatRef.objects.filter(chat=chat, user=user).delete()
        return Response(status=status.HTTP_200_OK)

    @action(detail=False, methods=['put'])
    def read(self, request, *args, **kwargs):
        pk = kwargs['pk']
        chat = get_object_or_404(Chat, id=pk)
        chat.messages.all().update(is_read=True)
        return Response(status=status.HTTP_200_OK)

    def get_queryset(self):
        return Chat.objects.filter(participants__in=[self.request.user])

class ChatRefViewset(ListDestroyCreateViewset):
    '''Ссылки на чаты'''
    permission_classes = []
    permission_classes_by_action = {
        'create': [IsMember, NoRef],
    }
    mass_permission_classes = [permissions.IsAuthenticated]
    serializer_class = ChatRefCreateSerializer
    serializer_class_by_action = {
        'list': ChatRefSerializer
    }

    def get_queryset(self):
        return ChatRef.objects.filter(user=self.request.user).annotate(
            unread=Count('chat__messages', filter=Q(chat__messages__is_read=False)&
                                                ~Q(chat__messages__contact=self.request.user))
        ).order_by('chat__messages__timestamp')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)