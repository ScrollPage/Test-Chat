from rest_framework.viewsets import GenericViewSet
from rest_framework import mixins
from django.shortcuts import get_object_or_404

from chat.models import Chat
from contact.models import Contact
from backend.service import PermissionMixin

class CustomListModelMixin(mixins.ListModelMixin):
    '''Custom list mixin'''

    def get_queryset(self):
        queryset = Chat.objects.all()
        id = self.request.query_params.get('id', None)

        if id:
            contact = get_object_or_404(Contact, id=id)
            try:
                queryset = contact.chats.all()
            except AttributeError:
                queryset = []
            
        return queryset

class PermissionModelCustomViewSet(mixins.CreateModelMixin, 
                                   mixins.DestroyModelMixin,
                                   mixins.RetrieveModelMixin,
                                   mixins.UpdateModelMixin,
                                   PermissionMixin,
                                   CustomListModelMixin,
                                   GenericViewSet):
    '''Model viewset с переделанный list методом'''