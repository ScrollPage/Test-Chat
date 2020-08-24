from rest_framework import permissions

from .service import RetrieveUpdateDestroyPermissionViewset
from chat.models import Contact
from .serializers import ContactDetailSerializer
from .permissions import IsCurrentUser

class ContactCustomViewSet(RetrieveUpdateDestroyPermissionViewset):
    queryset = Contact.objects.all()
    serializer_class = ContactDetailSerializer
    permission_classes = [IsCurrentUser, ]
    permission_classes_by_action = {
        'retrieve': [permissions.IsAuthenticated]
    }
