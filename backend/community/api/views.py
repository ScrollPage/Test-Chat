from rest_framework import permissions, generics
from django.db.models import Count, Q, Exists
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action

from chat.models import Contact
from .service import (
    RetrieveUpdateDestroyPermissionViewset, 
    ListCreatePermissionViewset,
    ModelViewSetPermission,
)
from .serializers import (
    ContactDetailSerializer, 
    AddRequestSerializer, 
    FriendActionsSerializer
)
from .permissions import (
    IsCurrentUser, 
    IsUsersInvites, 
    OneOfUsers,
    IsReceiver,
    IsFriends,
    IsSenderNotCurrentAndNotFriends,
    IsNotSent,
)
from community.models import AddRequest
from justchat.service import get_user_contact

class ContactCustomViewSet(RetrieveUpdateDestroyPermissionViewset):
    '''Обзор, обновление и удаление контакта'''
    serializer_class = ContactDetailSerializer
    permission_classes = [IsCurrentUser, ]
    permission_classes_by_action = {
        'retrieve': [permissions.IsAuthenticated, ]
    }

    def get_queryset(self):
        pk = self.kwargs['pk']
        user = get_object_or_404(Contact, id=pk).user
        queryset = Contact.objects.all().annotate(
            is_friend=Count('friends', filter=Q(friends__user=self.request.user))
        ).annotate(
            num_friends=Count('friends')
        ).annotate(
            current_user=Count('user', filter=Q(user=self.request.user))
        ).annotate(
            is_sent=Exists(
                AddRequest.objects.filter(
                    sender__user=self.request.user,
                    receiver__user=user,
                )
            )
        ).annotate(
            is_sent_to_you=Exists(
                AddRequest.objects.filter(
                    sender__user=user,
                    receiver__user=self.request.user
                )
            )
        )
        return queryset

class AddRequestCustomViewset(ListCreatePermissionViewset):
    '''Создание запроса на добавление'''
    serializer_class = AddRequestSerializer
    permission_classes = [permissions.IsAuthenticated, ]
    permission_classes_by_action = {
        'list': [IsUsersInvites, ],
        'create': [IsSenderNotCurrentAndNotFriends, IsNotSent]
    }

    def get_queryset(self):
        username = self.request.query_params.get('username', None)
        contact = get_user_contact(username)
        return AddRequest.objects.filter(receiver=contact)

class FriendPermissionViewset(ModelViewSetPermission):
    '''Добавление и удаление друзей'''
    serializer_class = FriendActionsSerializer
    permission_classes = []
    permission_classes_by_action = {
        'add': [IsReceiver, ],
        'remove': [IsFriends, OneOfUsers, ],
    }

    @action(detail=False, methods=['post'])
    def add(self, request, *args, **kwargs):
        data = request.data
        sender_id = data['sender']
        receiver_id = data['receiver']
        sender_contact = get_object_or_404(Contact, id=sender_id)
        receiver_contact = get_object_or_404(Contact, id=receiver_id)
        add_request = get_object_or_404(
            AddRequest,
            sender=sender_contact, 
            receiver=receiver_contact
        )
        add_request.delete()
        sender_contact.friends.add(receiver_contact)
        receiver_contact.friends.add(sender_contact)
        sender_contact.save()
        receiver_contact.save()
        return Response(status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def remove(self, request, *args, **kwargs):
        data = request.data
        sender_id = data['sender']
        receiver_id = data['receiver']
        sender_contact = get_object_or_404(Contact, id=sender_id)
        receiver_contact = get_object_or_404(Contact, id=receiver_id)
        sender_contact.friends.remove(receiver_contact)
        receiver_contact.friends.remove(sender_contact)
        sender_contact.save()
        receiver_contact.save()
        return Response(status=status.HTTP_200_OK)
