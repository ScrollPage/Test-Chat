from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework import serializers
from django.shortcuts import get_object_or_404
from django.core.files.uploadedfile import InMemoryUploadedFile

from backend.service import PermissionSerializerMixin, LowReadContactSerializer
from community.models import Page
from contact.models import Contact
from parties.models import Party

class PartyPermissionSerializerModelViewset(PermissionSerializerMixin,
                                            ModelViewSet):
    '''Всевозможные действия с группами'''
    pass

class PartyPermissionSerializerEmptyViewset(PermissionSerializerMixin,
                                            GenericViewSet):
    '''Пустой вью-сет'''
    pass

class PageSerializer(serializers.ModelSerializer):
    '''Сериалазиация странички'''
    user = LowReadContactSerializer()
    
    class Meta:
        model = Page
        fields = ['user']

def get_user_and_group(request, kwargs):
    user_id = request.data['some_id']
    group_id = kwargs['pk']
    group = Party.objects.filter(id=group_id).prefetch_related('blacklist').first()
    user = get_object_or_404(Contact, id=user_id)
    return (user, group)