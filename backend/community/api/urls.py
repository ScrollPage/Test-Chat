from rest_framework.routers import DefaultRouter
from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path

from .views import (
    ContactCustomViewSet, 
    AddRequestCustomViewset, 
    FriendPermissionViewset
)

friends_add = FriendPermissionViewset.as_view({
    'post': 'add',
})

friends_remove = FriendPermissionViewset.as_view({
    'post': 'remove',
})

urlpatterns = [
    
] 

urlpatterns += format_suffix_patterns([
    path('friends/add/', friends_add, name='friends_remove'),
    path('friends/remove/', friends_remove, name='friends_add')
])

r = DefaultRouter()
r.register(r'request', AddRequestCustomViewset, basename='request')
r.register(r'contact', ContactCustomViewSet, basename='contact')
urlpatterns += r.urls