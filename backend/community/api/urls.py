from rest_framework.routers import DefaultRouter
from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path

from .views import (
    ContactCustomViewSet, 
    AddRequestCustomViewset, 
    FriendPermissionViewset, 
    ContactFriendsView,
    SearchPeopleView,
)

urlpatterns = [
    path('friends/', ContactFriendsView.as_view(), name='contact-friends'),
    path('people/', SearchPeopleView.as_view(), name='people'),
]

friends_add = FriendPermissionViewset.as_view({
    'post': 'add',
})

friends_remove = FriendPermissionViewset.as_view({
    'post': 'remove',
})

request_add = AddRequestCustomViewset.as_view({
    'post': 'create'
})

request_list = AddRequestCustomViewset.as_view({
    'get': 'list'
})

request_remove = AddRequestCustomViewset.as_view({
    'post': 'remove'
})

urlpatterns += format_suffix_patterns([
    path('friends/add/', friends_add, name='friends-add'),
    path('friends/remove/', friends_remove, name='friends-remove'),
    path('request/list/', request_list, name='request-list'),
    path('request/add/', request_add, name='request-add'),
    path('request/remove/', request_remove, name='request-remove'),
])

r = DefaultRouter()
# r.register(r'request', AddRequestCustomViewset, basename='request')
r.register(r'contact', ContactCustomViewSet, basename='contact')
urlpatterns += r.urls