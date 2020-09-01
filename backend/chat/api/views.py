from rest_framework import permissions, generics

from chat.models import Chat
from contact.models import Contact
from .serializers import ChatSerializer
from .service import PermissionModelCustomViewSet

class ChatModelPermissionViewSet(PermissionModelCustomViewSet):
    '''Все, что связано с чатами'''
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = [permissions.IsAuthenticated]
    permission_classes_by_action = {
        'list': [permissions.AllowAny],
        'retrieve': [permissions.AllowAny],
    }