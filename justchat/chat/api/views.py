from rest_framework import permissions

from chat.models import Chat, Contact
from .serializers import ChatSerializer
from .service import PermissionModelCusomViewSet

class ChatModelPermissionViewSet(PermissionModelCusomViewSet):
    '''Все, что связано с чатами'''
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_class = [permissions.IsAuthenticated, ]
    permission_classes_by_action = {
        'list': [permissions.AllowAny, ],
        'rerieve': [permissions.AllowAny, ],
    }


