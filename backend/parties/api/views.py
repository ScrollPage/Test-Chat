from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Count, Q
from django.shortcuts import get_object_or_404

from .service import PartyPermissionSerializerModelViewset
from .serializers import (
    PartyListSerializer, 
    PartyCreateSerializer, 
    PartyShortSerializer,
    JoinAndLeaveSerializer
)
from parties.models import Party
from .permissions import IsGroupAdminOrStaff, IsGroupAdmin

class PartyViewSet(PartyPermissionSerializerModelViewset):
    '''Все о группах'''
    serializer_class = PartyListSerializer
    serializer_class_by_action = {
        'create': PartyCreateSerializer,
        'update': PartyShortSerializer,
        'partial_update': PartyShortSerializer,
        'join': JoinAndLeaveSerializer,
        'leave': JoinAndLeaveSerializer,
    }
    permission_classes = [permissions.IsAuthenticated]
    permission_classes_by_action = {
        'update': [permissions.IsAuthenticated, IsGroupAdminOrStaff],
        'partial_update': [permissions.IsAuthenticated, IsGroupAdminOrStaff],
        'destroy': [permissions.IsAuthenticated, IsGroupAdmin]
    }

    @action(detail=False, methods=['post'])
    def join(self, request, *args, **kwargs):
        '''Вступление в группу'''
        self.get_serializer(data=request.data).is_valid(raise_exception=True)
        group_id = request.data['group_id']
        group = get_object_or_404(Party, id=group_id)
        user = request.user
        user.my_page.parties.add(group)
        return Response(status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def leave(self, request, *args, **kwargs):
        '''Выход из группы'''
        self.get_serializer(data=request.data).is_valid(raise_exception=True)
        group_id = request.data['group_id']
        group = get_object_or_404(Party, id=group_id)
        user = request.user
        user.my_page.parties.remove(group)
        return Response(status=status.HTTP_200_OK)

    def get_queryset(self):
        queryset = Party.objects.all().annotate(
            num_members=Count('members')
        ).annotate(
            joined=Count('members', filter=Q(members__user=self.request.user))
        )
        return queryset