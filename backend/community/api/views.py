from rest_framework import permissions
from django.db.models import Count, Q

from .service import RetrieveUpdateDestroyPermissionViewset
from chat.models import Contact
from .serializers import ContactDetailSerializer
from .permissions import IsCurrentUser

class ContactCustomViewSet(RetrieveUpdateDestroyPermissionViewset):
    serializer_class = ContactDetailSerializer
    permission_classes = [IsCurrentUser, ]
    permission_classes_by_action = {
        'retrieve': [permissions.IsAuthenticated, ]
    }

    def get_queryset(self):
        pk = self.kwargs['pk']
        contact = Contact.objects.filter(id=pk)
        queryset = Contact.objects.all().annotate(
            is_friend=Count('friends', filter=Q(friends__user=self.request.user))
        ).annotate(
            num_friends=Count('friends')
        ).annotate(
            current_user=Count('user', filter=Q(user=self.request.user))
        )
        return queryset
