from rest_framework import permissions, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Exists, Q, OuterRef, Subquery, Avg, Sum, IntegerField
from django.shortcuts import get_object_or_404
from django.db import models

from .serializers import (
    ContactDetailSerializer, 
    AddRequestSerializer,
    FriendActionsSerializer,
    ContactFriendsSerializer,
)
from .permissions import (
    IsCurrentUser, 
    NotCurrentAndNotFriends, 
    IsNotSent,
    IsReceiver,
    IsFriends,
    OneOfUsers,
    IsSender,
)
from .service import (
    RetrieveUpdateDestroyPermissionViewset,
    ListCreatePermissionViewset,
    ModelViewSetPermission,
    filter_by_query_name
)
from contact.models import Contact
from chat.models import Chat
from community.models import AddRequest

class ContactCustomViewSet(RetrieveUpdateDestroyPermissionViewset):
    '''Обзор, обновление и удаление контакта'''
    serializer_class = ContactDetailSerializer
    permission_classes = [permissions.IsAuthenticated, IsCurrentUser, ]
    permission_classes_by_action = {
        'retrieve': [permissions.IsAuthenticated, ]
    }

    def get_queryset(self):
        pk = int(self.kwargs['pk'])
        queryset = Contact.objects.filter(id=pk).annotate(
            is_friend=Count('friends', filter=Q(friends=self.request.user))
        ).annotate(
            num_friends=Avg('friends')
        ).annotate(
            current_user=Count('slug', filter=Q(slug=self.request.user.slug))
        ).annotate(
            is_sent=Exists(
                AddRequest.objects.filter(
                    sender__id=self.request.user.id, 
                    receiver__id=pk
                )
            )
        ).annotate(
            is_sent_to_you=Exists(
                AddRequest.objects.filter(
                    sender__id=pk, 
                    receiver__id=self.request.user.id
                )
            )
        ).annotate(
            chat_id=Avg('chats__id', filter=Q(chats__participants=self.request.user))
        )
        return queryset

class AddRequestCustomViewset(ListCreatePermissionViewset):
    '''Создание и удаление запроса на добавление'''
    queryset = AddRequest.objects.all()
    serializer_class = AddRequestSerializer
    permission_classes = [permissions.IsAuthenticated, ]
    permission_classes_by_action = {
        'create': [
            permissions.IsAuthenticated, 
            IsSender, 
            NotCurrentAndNotFriends, 
            IsNotSent, 
        ],
        'destroy': [permissions.IsAuthenticated, IsSender, ]
    }

    @action(detail=False, methods=['post'])
    def remove(self, request, *args, **kwargs):
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
        return Response(status=status.HTTP_204_NO_CONTENT)

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

class ContactFriendsView(generics.ListAPIView):
    '''Выводит список друзей контакта'''
    serializer_class = ContactFriendsSerializer
    permission_classes = [permissions.IsAuthenticated, ]

    def get_queryset(self):
        user = self.request.user
        queryset = user.friends.all()
        query_name = self.request.query_params.get('query_name', None)
        queryset = filter_by_query_name(query_name, queryset).annotate(
            chat_id=Sum('chats__id', filter=Q(chats__participants=self.request.user))
        )
        return queryset

class SearchPeopleView(generics.ListAPIView):
    '''Вывод контактов для поиска людей'''
    serializer_class = ContactFriendsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Contact.objects.all()
        query_name = self.request.query_params.get('query_name', None)
        queryset = filter_by_query_name(query_name, queryset)
        return queryset