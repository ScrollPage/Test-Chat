from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework import mixins
from rest_framework.response import Response
from django.db.models import Q
from django.db.models import Prefetch

from backend.service import PermissionMixin, PermissionSerializerMixin
from feed.api.exceptions import BadRequestError
from contact.models import Contact

class RetrieveUpdateDestroyPermissionViewset(PermissionMixin, 
                                     GenericViewSet,
                                     mixins.UpdateModelMixin,
                                     mixins.RetrieveModelMixin,
                                     mixins.DestroyModelMixin,
                                    ):
    '''Обзор, кастомизцая, удаление'''
    pass

class UpdateCreatePermissionViewset(PermissionSerializerMixin, 
                                    GenericViewSet,
                                    mixins.UpdateModelMixin,
                                    mixins.CreateModelMixin,
                                ):
    '''Создание, обновление'''
    pass


class CustomListModelMixin(mixins.ListModelMixin):
    '''Фильтрация запросов зависимости от пользователя'''

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(receiver=request.user)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class ListCreatePermissionViewset(PermissionMixin,
                                  GenericViewSet,
                                  mixins.CreateModelMixin,
                                  CustomListModelMixin,
                                  ):
    '''Глобальный обзорб создание'''
    pass
    
class ViewSetPermission(PermissionMixin, GenericViewSet):
    '''ModelViewSet and PermissionMixin'''
    pass

def filter_by_query_name(query_name, queryset):
    if query_name:
        for term in query_name.split('_')[:2]:
            queryset = queryset.filter(
                Q(first_name__icontains=term) | Q(last_name__icontains=term)
            )
    return queryset

def friend_manipulation(sender_id, receiver_id, add=True):
    try:
        sender_contact = Contact.objects.prefetch_related(
            Prefetch('my_page', to_attr='sender_page')
        ).get(id=sender_id)
        receiver_contact = Contact.objects.prefetch_related(
            Prefetch('my_page', to_attr='receiver_page')
        ).get(id=receiver_id)
    except Contact.DoesNotExist:
        raise BadRequestError('User not found.')
    if add:
        sender_contact.sender_page.friends.add(receiver_contact)
        receiver_contact.receiver_page.friends.add(sender_contact)
    else:
        sender_contact.sender_page.friends.remove(receiver_contact)
        receiver_contact.receiver_page.friends.remove(sender_contact)
    sender_contact.sender_page.save()
    receiver_contact.receiver_page.save()