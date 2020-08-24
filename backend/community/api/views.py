from rest_framework import permissions, generics
from django.db.models import Count, Q
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status

from .service import (
    RetrieveUpdateDestroyPermissionViewset, 
    ListCreatePermissionViewset
)
from chat.models import Contact
from .serializers import ContactDetailSerializer, AddRequestSerializer
from .permissions import IsCurrentUser, IsUsersInvites
from community.models import AddRequest
from justchat.service import get_user_contact

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

class AddRequestCustomViewset(ListCreatePermissionViewset):
    '''Создание запроса на добавление'''
    serializer_class = AddRequestSerializer
    permission_classes = [permissions.IsAuthenticated, ]
    permission_classes_by_action = {
        'list': [IsUsersInvites, ]
    }

    def get_queryset(self):
        username = self.request.query_params.get('username', None)
        contact = get_user_contact(username)
        return AddRequest.objects.filter(r_to=contact)

class FriendsView(generics.GenericAPIView):
    '''Добавление или удаление друзей'''
    def post(self, request):
        data = request.data
        sender_id = data['sender']
        receiver_id = data['receiver']
        sender_contact = get_object_or_404(Contact, id=sender_id)
        receiver_contact = get_object_or_404(Contact, id=receiver_id)
        sender_contact.friends.add(receiver_contact)
        receiver_contact.friends.add(sender_contact)
        sender_contact.save()
        receiver_contact.save()
        return Response(status=status.HTTP_200_OK)


    def delete(self, request):
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