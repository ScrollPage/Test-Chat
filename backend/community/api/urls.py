from rest_framework.routers import DefaultRouter
from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path

from .views import (
    ContactCustomViewSet, 
    AddRequestCustomViewset, 
    FriendPermissionViewset, 
    ContactFriendsView,
    SearchPeopleView,
    UserInfoViewset,
    BlacklistViewset,
)

urlpatterns = [
    path('friends/', ContactFriendsView.as_view(), name='contact-friends'),
    path('people/', SearchPeopleView.as_view(), name='people'),
]

update_info = UserInfoViewset.as_view({
    'put': 'update',
    'patch': 'partial_update'
})

create_info = UserInfoViewset.as_view({
    'post': 'create'
})

friends_add = FriendPermissionViewset.as_view({
    'post': 'add',
})

friends_remove = FriendPermissionViewset.as_view({
    'post': 'remove',
})

blacklist_add = BlacklistViewset.as_view({
    'post': 'add'
})

blacklist_remove = BlacklistViewset.as_view({
    'post': 'remove'
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
    path('create_info/', create_info, name='create-info'),
    path('update_info/<int:pk>/', update_info, name='update-info'),
    path('friends/add/', friends_add, name='friends-add'),
    path('friends/remove/', friends_remove, name='friends-remove'),
    path('blacklist/add/', blacklist_add, name='blacklist-add'),
    path('blacklist/remove/', blacklist_remove, name='blacklist-remove'),
    path('request/list/', request_list, name='request-list'),
    path('request/add/', request_add, name='request-add'),
    path('request/remove/', request_remove, name='request-remove'),
])

r = DefaultRouter()
# r.register(r'request', AddRequestCustomViewset, basename='request')
r.register(r'contact', ContactCustomViewSet, basename='contact')
urlpatterns += r.urls