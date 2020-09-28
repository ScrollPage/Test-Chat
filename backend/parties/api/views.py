from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Count, Q
from django.shortcuts import get_object_or_404

from .service import PartyPermissionSerializerModelViewset
from .serializers import (
    PartyDetailSerializer, 
    PartyCreateSerializer, 
    PartyShortSerializer,
    IntegerFieldSerializer
)
from parties.models import Party
from .permissions import IsGroupAdminOrStaff, IsGroupAdmin
from contact.models import Contact

class PartyViewSet(PartyPermissionSerializerModelViewset):
    '''Все о группах'''
    serializer_class = IntegerFieldSerializer
    serializer_class_by_action = {
        'create': PartyCreateSerializer,
        'update': PartyShortSerializer,
        'partial_update': PartyShortSerializer,
        'list': PartyShortSerializer,
        'retrieve': PartyDetailSerializer,
    }
    permission_classes = [permissions.IsAuthenticated]
    permission_classes_by_action = {
        'update': [permissions.IsAuthenticated, IsGroupAdminOrStaff],
        'partial_update': [permissions.IsAuthenticated, IsGroupAdminOrStaff],
        'add_staff': [permissions.IsAuthenticated, IsGroupAdminOrStaff],
        'remove_staff': [permissions.IsAuthenticated, IsGroupAdminOrStaff],
        'destroy': [permissions.IsAuthenticated, IsGroupAdmin]
    }

    @action(detail=False, methods=['post'])
    def add_staff(self, request, *args, **kwargs):
        self.get_serializer(data=request.data).is_valid(raise_exception=True)
        user_id = request.data['some_id']
        group_id = kwargs['pk']
        group = get_object_or_404(Party, id=group_id)
        user = get_object_or_404(Contact, id=user_id)
        group.staff.add(user)
        return Response(status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def remove_staff(self, request, *args, **kwargs):
        self.get_serializer(data=request.data).is_valid(raise_exception=True)
        user_id = request.data['some_id']
        group_id = kwargs['pk']
        group = get_object_or_404(Party, id=group_id)
        user = get_object_or_404(Contact, id=user_id)
        group.staff.remove(user)
        return Response(status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def join(self, request, *args, **kwargs):
        '''Вступление в группу'''
        self.get_serializer(data=request.data).is_valid(raise_exception=True)
        group_id = request.data['some_id']
        group = get_object_or_404(Party, id=group_id)
        user = request.user
        user.my_page.parties.add(group)
        return Response(status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def leave(self, request, *args, **kwargs):
        '''Выход из группы'''
        self.get_serializer(data=request.data).is_valid(raise_exception=True)
        group_id = request.data['some_id']
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