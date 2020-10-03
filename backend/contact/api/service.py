from rest_framework.viewsets import GenericViewSet
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from datetime import timedelta

from backend.service import SerializerMixin

class SerializerViewset(SerializerMixin, GenericViewSet):
    '''Пустой вью-сет '''
    pass

def make_active(instance):
    user = instance.user
    if instance.created + timedelta(hours=2) < timezone.now():
        user.delete()
        return Response(status=status.HTTP_404_NOT_FOUND)
    else:
        user.is_active = True
        user.save()
        instance.delete()
        return Response(status=status.HTTP_200_OK)
