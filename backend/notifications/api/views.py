from rest_framework import generics, permissions, status
from rest_framework.response import Response

from notifications.models import Notice
from .serializers import NotificationSerializer
from .service import NotificationView
from parties.api.serializers import EmptySerializer

class NoificationsListView(NotificationView):
    '''Уведомления контакта'''
    serializer_class = EmptySerializer
    serializer_class_by_action = {
        'list': NotificationSerializer
    }
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notice.objects.filter(receiver=self.request.user).order_by('timestamp')

    def update(self, request, *args, **kwargs):
        self.get_queryset().update(seen=True)
        return Response(status=status.HTTP_200_OK)