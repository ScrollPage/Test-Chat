from rest_framework import permissions, generics, status
from rest_framework.response import Response
from rest_framework.decorators import action

from chat.models import Chat, ChatRef
from contact.models import Contact
from .serializers import (
    ChatCreateSerializer, 
    ChatOverviewSerializer, 
    ChatRefSerializer,
    ChatRefCreateSerializer
)
from .service import PermissionCreateRetrieveUpdate, ListDestroyCreateViewset
from .permissions import IsMember, YourChatRef, NoRef

class ChatModelPermissionViewSet(PermissionCreateRetrieveUpdate):
    '''Все, что связано с чатами'''
    queryset = Chat.objects.all()
    serializer_class = ChatCreateSerializer
    permission_classes = [IsMember]
    permission_classes_by_action = {
        'create': [],
    }
    serializer_class_by_action = {
        'retrieve': ChatOverviewSerializer,
    }
    mass_permission_classes = [permissions.IsAuthenticated]

class ChatRefViewset(ListDestroyCreateViewset):
    '''Ссылки на чаты'''
    permission_classes = [YourChatRef]
    permission_classes_by_action = {
        'create': [IsMember, NoRef],
        'list': []
    }
    mass_permission_classes = [permissions.IsAuthenticated]
    serializer_class = ChatRefCreateSerializer
    serializer_class_by_action = {
        'list': ChatRefSerializer
    }

    def get_queryset(self):
        return ChatRef.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

