from rest_framework.viewsets import ModelViewSet
from rest_framework import serializers

from backend.service import PermissionSerializerMixin, LowReadContactSerializer
from community.models import Page

class PartyPermissionSerializerModelViewset(PermissionSerializerMixin,
                                            ModelViewSet):
    '''Всевозможные действия с группами'''
    pass

class PageSerializer(serializers.ModelSerializer):
    '''Сериалазиация странички'''
    user = LowReadContactSerializer()
    
    class Meta:
        model = Page
        fields = ['id', 'user']