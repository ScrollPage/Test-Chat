from rest_framework import permissions, generics, status
from rest_framework.response import Response

from chat.models import Chat
from contact.models import Contact
from .serializers import ChatCreateSerializer, ChatOverviewSerializer
from .service import PermissionModelCustomViewSet
from .permissions import IsOwner

class ChatModelPermissionViewSet(PermissionModelCustomViewSet):
    '''Все, что связано с чатами'''
    queryset = Chat.objects.all()
    serializer_class = ChatCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    permission_classes_by_action = {
        'list': [permissions.IsAuthenticated, IsOwner, ],
        'retrieve': [permissions.IsAuthenticated, IsOwner, ],
    }
    serializer_class_by_action = {
        'list': ChatOverviewSerializer,
        'retrieve': ChatOverviewSerializer
    }
