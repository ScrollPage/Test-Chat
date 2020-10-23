from rest_framework import permissions, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Exists, Q, OuterRef, Subquery, Avg, Sum
from django.shortcuts import get_object_or_404
from django.db import models

from .serializers import (
    ContactDetailSerializer, 
    AddRequestSerializer,
    FriendActionsSerializer,
    ContactFriendsSerializer,
    UserInfoUpdateSerializer,
    UserInfoCreateSerializer,
    IntegerFieldSerializer
)
from .permissions import (
    NotCurrentUser,
    NotFriends, 
    IsNotSent,
    IsReceiver,
    IsFriends,
    OneOfUsers,
    IsRightUser,
    InBlackList,
    NotInBlackList,
    NotInBlacklistFriends
)
from .service import (
    RetrieveUpdateDestroyPermissionViewset,
    ListCreatePermissionViewset,
    ViewSetPermission,
    friend_manipulation,
    UpdateCreatePermissionViewset,
    get_chat
)
from contact.models import Contact
from chat.models import Chat, ChatRef
from community.models import AddRequest, UserInfo
from notifications.service import new_friend_notification

class ContactCustomViewSet(RetrieveUpdateDestroyPermissionViewset):
    '''Обзор, обновление и удаление контакта'''
    serializer_class = ContactDetailSerializer
    permission_classes = [IsRightUser]
    permission_classes_by_action = {
        'retrieve': [NotInBlackList]
    }
    mass_permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        pk = int(self.kwargs['pk'])
        queryset = Contact.objects.filter(id=pk).annotate(
            is_friend=Count('my_page__friends', filter=Q(my_page__friends=self.request.user))
        ).annotate(
            num_friends=Count('my_page__friends', distinct=True)
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
            chat_id=Sum('chats__id', filter=Q(chats__participants=self.request.user) &
                                            Q(chats__is_chat=True))
        ).annotate(
            exists_ref=Exists(
                ChatRef.objects.filter(
                    user=self.request.user,
                    chat=get_chat(self.request.user.id, pk)
                )
            )
        )
        if self.request.user.id == pk:
            queryset = queryset.annotate(
                num_notes=Count('notifications', filter=Q(notifications__seen=False))
            )
        return queryset

class AddRequestCustomViewset(ListCreatePermissionViewset):
    '''Создание и удаление запроса на добавление'''
    queryset = AddRequest.objects.all()
    serializer_class = AddRequestSerializer
    permission_classes = []
    permission_classes_by_action = {
        'create': [
            NotCurrentUser,
            NotInBlacklistFriends,
            NotFriends, 
            IsNotSent, 
        ],
        'destroy': []
    }
    mass_permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

    @action(detail=False, methods=['post'])
    def remove(self, request, *args, **kwargs):
        data = request.data
        sender_contact = request.user
        receiver_id = data['receiver']
        receiver_contact = get_object_or_404(Contact, id=receiver_id)
        add_request = get_object_or_404(
            AddRequest,
            sender=sender_contact, 
            receiver=receiver_contact
        )
        add_request.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class FriendPermissionViewset(ViewSetPermission):
    '''Добавление и удаление друзей'''
    serializer_class = FriendActionsSerializer
    permission_classes = []
    permission_classes_by_action = {
        'add': [IsReceiver],
        'remove': [IsFriends, OneOfUsers],
    }
    mass_permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'])
    def add(self, request, *args, **kwargs):
        data = request.data
        sender_id = data['sender']
        receiver_id = data['receiver']
        add_request = get_object_or_404(
            AddRequest,
            sender=sender_id, 
            receiver=receiver_id
        )
        add_request.delete()
        friend_manipulation(sender_id, receiver_id)
        new_friend_notification(sender_id, receiver_id)
        return Response(status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def remove(self, request, *args, **kwargs):
        data = request.data
        sender_id = data['sender']
        receiver_id = data['receiver']
        friend_manipulation(sender_id, receiver_id, add=False)
        return Response(status=status.HTTP_200_OK)

class BlacklistViewset(ViewSetPermission):
    '''Добавление в черный список и удаление из него'''
    serializer_class = IntegerFieldSerializer
    permission_classes = [NotInBlackList]
    permission_classes_by_action = {
        'remove': [InBlackList]
    }
    mass_permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'])
    def add(self, request, *args, **kwargs):
        id = request.data.get('user_id', None)
        user = get_object_or_404(Contact, id=int(id))
        request.user.my_page.blacklist.add(user)
        user.my_page.friends.remove(request.user)
        request.user.my_page.blacklist.remove(user)
        return Response(status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def remove(self, request, *args, **kwargs):
        id = request.data.get('user_id', None)
        user = get_object_or_404(Contact, id=id)
        request.user.my_page.blacklist.remove(user)
        return Response(status=status.HTTP_200_OK)


class ContactFriendsView(generics.ListAPIView):
    '''Выводит список друзей контакта'''
    serializer_class = ContactFriendsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        id = self.request.query_params.get('id', None)
        if id:
            try:
                id = int(id)
            except ValueError:
                user = self.request.user
            else:
                user = Contact.objects.get(id=id)
        else:
            user = self.request.user
        queryset = user.my_page.friends.all().annotate(
            exists_ref=Exists(
                ChatRef.objects.filter(
                    user=self.request.user,
                    chat=get_chat(self.request.user.id, OuterRef('id'))
                )
            )
        )

        if id == self.request.user.id or not id:
            queryset = queryset.annotate(
                chat_id=Sum('chats__id', filter=Q(chats__participants=self.request.user) & 
                                                Q(chats__is_chat=True))
            )
        return queryset

class SearchPeopleView(generics.ListAPIView):
    '''Вывод контактов для поиска людей'''
    serializer_class = ContactFriendsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Contact.objects.exclude(id=self.request.user.id).annotate(
            chat_id=Sum('chats__id', filter=Q(chats__participants=self.request.user))
        ).annotate(
            exists_ref=Exists(
                ChatRef.objects.filter(
                    user=self.request.user,
                    chat=get_chat(self.request.user.id, OuterRef('id'))
                )
            )
        )
        return queryset.filter(is_active=True)

class UserInfoViewset(UpdateCreatePermissionViewset):
    '''Обнвление и создание информации о пользователе'''
    queryset = UserInfo.objects.all()
    serializer_class = UserInfoUpdateSerializer
    serializer_class_by_action = {
        'create': UserInfoCreateSerializer
    }
    permission_classes = [permissions.IsAuthenticated, IsRightUser]
    permission_classes_by_action = {
        'create': [permissions.AllowAny]
    }
    mass_permission_classes = []