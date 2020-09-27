from rest_framework import generics

from .permissions import UsersNotes
from notifications.models import Notice
from .serializers import NotificationSerializer

class NoificationsListView(generics.ListAPIView):
    '''Уведомления контакта'''
    serializer_class = NotificationSerializer
    permission_classes = [UsersNotes, ]

    def get_queryset(self):
        pk = self.kwargs['pk']
        return Notice.objects.filter(receiver__id=pk).order_by('timestamp')