from rest_framework import permissions, generics, status
from rest_framework.response import Response

from chat.models import Chat
from contact.models import Contact
from .serializers import ChatSerializer
from .service import PermissionModelCustomViewSet
from .permissions import IsOwner

class ChatModelPermissionViewSet(PermissionModelCustomViewSet):
    '''Все, что связано с чатами'''
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = [permissions.IsAuthenticated]
    permission_classes_by_action = {
        'list': [permissions.IsAuthenticated, IsOwner],
        'retrieve': [permissions.IsAuthenticated],
    }
