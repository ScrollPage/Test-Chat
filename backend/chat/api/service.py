from rest_framework.viewsets import GenericViewSet
from rest_framework import mixins
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count

from chat.models import Chat
from contact.models import Contact
from backend.service import PermissionMixin

class CustomListModelMixin(mixins.ListModelMixin):
    '''Custom list mixin'''

    def get_queryset(self):
        id = self.request.query_params.get('id', None)
        if id:
            contact = get_object_or_404(Contact, id=id)
            try:
                query_name = self.request.query_params.get('query_name', None)
                # if query_name:
                #     for term in query_name.split('_')[:1]:
                #         queryset = contact.chats.all().annotate(
                #             inside=Count(
                #                 'participants', 
                #                 filter=Q(participants__first_name__in=term)|Q(participants__last_name__in=term)
                #             )
                #         ) 
                queryset = contact.chats.all()
                queryset1 = []
                if query_name:
                    query_name = query_name.split('_')[:2]
                    for chat in queryset:
                        for part in chat.participants.all():
                            if part != self.request.user:
                                for term in query_name:
                                    if (term in part.first_name.lower() or term in part.last_name.lower()):
                                        queryset1.append(chat)
                                        break
                    queryset = queryset1
            except AttributeError:
                queryset = []
        else:
            queryset = Chat.objects.all()
            
        return queryset

class PermissionModelCustomViewSet(mixins.CreateModelMixin, 
                                   mixins.DestroyModelMixin,
                                   mixins.RetrieveModelMixin,
                                   mixins.UpdateModelMixin,
                                   PermissionMixin,
                                   CustomListModelMixin,
                                   GenericViewSet):
    '''Model viewset с переделанный list методом'''