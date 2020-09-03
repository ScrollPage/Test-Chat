from rest_framework import permissions, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Exists, Q, Sum, Avg
from django.shortcuts import get_object_or_404
from django.db import models

from .serializers import (
    ContactDetailSerializer, 
    AddRequestSerializer,
    FriendActionsSerializer,
    ContactFriendsSerializer
)
from .permissions import (
    IsCurrentUser, 
    IsUsersInvites, 
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
    ModelViewSetPermission
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
        pk = self.kwargs['pk']
        contact = get_object_or_404(Contact, id=pk)
        queryset = Contact.objects.all().annotate(
            is_friend=Count('friends', filter=Q(friends=self.request.user))
        ).annotate(
            num_friends=Count('friends')
        ).annotate(
            current_user=Count('slug', filter=Q(slug=self.request.user.slug))
        ).annotate(
            is_sent=Exists(
                AddRequest.objects.filter(
                    sender=self.request.user,
                    receiver=contact,
                )
            )
        ).annotate(
            is_sent_to_you=Exists(
                AddRequest.objects.filter(
                    sender=contact,
                    receiver=self.request.user
                )
            )
        )

        return queryset

class AddRequestCustomViewset(ListCreatePermissionViewset):
    '''Создание запроса на добавление'''
    serializer_class = AddRequestSerializer
    permission_classes = [permissions.IsAuthenticated, IsUsersInvites, ]
    permission_classes_by_action = {
        'create': [
            permissions.IsAuthenticated, 
            IsSender, 
            NotCurrentAndNotFriends, 
            IsNotSent, 
        ],
        'destroy': [permissions.IsAuthenticated, IsSender, ]
    }

    def get_queryset(self):
        slug = self.request.query_params.get('slug', None)
        contact = get_object_or_404(Contact, slug=slug)
        return AddRequest.objects.filter(receiver=contact)

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
    '''
        Выводит список друзей контакта

        Необходим аргумент pk в параметрах строки 
        для отображния друзей текущего пользователя
    '''
    serializer_class = ContactFriendsSerializer
    permission_classes = [permissions.IsAuthenticated, IsCurrentUser, ]

    def get_queryset(self):
        pk = self.kwargs['pk']
        contact = get_object_or_404(Contact, id=pk)
        queryset = contact.friends.all()
        for friend in queryset:
            queryset = queryset.annotate(
                chat_id=Sum('chats__id', filter=Q(chats__participants=friend))
            )
        return queryset

class SearchFriendsView(generics.ListAPIView):
    '''Вывод контактов для поиска людей'''
    serializer_class = ContactFriendsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        query_name = self.request.query_params.get('query_name', None)
        if not query_name:
            query_name = ''
        queryset = Contact.objects.all()
        for term in query_name.split('_')[:2]:
            queryset = queryset.filter(
                Q(first_name__icontains = term) | Q(last_name__icontains = term)
            )
        return queryset
