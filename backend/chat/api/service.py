from rest_framework.viewsets import GenericViewSet
from rest_framework import mixins, serializers
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count

from chat.models import Chat
from contact.models import Contact
from backend.service import PermissionMixin, SerializerMixin

class CustomListModelMixin(mixins.ListModelMixin):
    '''Custom list mixin'''

    def get_queryset(self):
        contact = self.request.user
        query_name = self.request.query_params.get('query_name', None)
        queryset = contact.chats.all()
        if query_name:
            query_name = query_name.split('_')[:2]
            queryset1 = []
            for chat in queryset:
                for part in chat.participants.all():
                    if part != self.request.user:
                        for term in query_name:
                            if (term in part.first_name.lower() or term in part.last_name.lower()):
                                queryset1.append(chat)
                                break
            queryset = queryset1
            
        return queryset

class PermissionModelCustomViewSet(SerializerMixin,
                                   mixins.CreateModelMixin, 
                                   mixins.DestroyModelMixin,
                                   mixins.RetrieveModelMixin,
                                   mixins.UpdateModelMixin,
                                   PermissionMixin,
                                   CustomListModelMixin,
                                   GenericViewSet, 
                                ):
    '''Model viewset с переделанный list методом'''