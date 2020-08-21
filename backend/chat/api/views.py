from rest_framework import permissions

from chat.models import Chat, Contact
from .serializers import ChatSerializer
from .service import PermissionModelCustomViewSet

class ChatModelPermissionViewSet(PermissionModelCustomViewSet):
    '''Все, что связано с чатами'''
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_class = [permissions.IsAuthenticated, ]
    permission_classes_by_action = {
        'list': [permissions.AllowAny, ],
        'rerieve': [permissions.AllowAny, ],
    }


