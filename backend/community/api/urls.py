from rest_framework.routers import DefaultRouter
from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path

from .views import (
    ContactCustomViewSet, 
    AddRequestCustomViewset, 
    FriendPermissionViewset, 
    ContactFriendsView
)

urlpatterns = [
    path('friends/<int:pk>', ContactFriendsView.as_view(), name='contact-friends'),
]

friends_add = FriendPermissionViewset.as_view({
    'post': 'add',
})

friends_remove = FriendPermissionViewset.as_view({
    'post': 'remove',
})

urlpatterns += format_suffix_patterns([
    path('friends/add/', friends_add, name='friends-add'),
    path('friends/remove/', friends_remove, name='friends-remove')
])

r = DefaultRouter()
r.register(r'request', AddRequestCustomViewset, basename='request')
r.register(r'contact', ContactCustomViewSet, basename='contact')
urlpatterns += r.urls