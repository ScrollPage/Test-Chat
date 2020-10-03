from rest_framework.routers import DefaultRouter
from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path

from .views import GroupViewSet, GroupPostsViewset

urlpatterns = [
    
]

group_join = GroupViewSet.as_view({
    'post': 'join'
})

group_leave = GroupViewSet.as_view({
    'post': 'leave'
})

add_staff = GroupViewSet.as_view({
    'post': 'add_staff'
})

remove_staff = GroupViewSet.as_view({
    'post': 'remove_staff'
})

add_blacklist = GroupViewSet.as_view({
    'post': 'add_blacklist'
})

remove_blacklist = GroupViewSet.as_view({
    'post': 'remove_blacklist'
})

offer_post = GroupPostsViewset.as_view({
    'post': 'offer_post',
    'get': 'offer_list',
})

accept_post = GroupPostsViewset.as_view({
    'put': 'accept_post',
    'get': 'published_list',
})


urlpatterns += format_suffix_patterns([
    path('group/join/<int:pk>/', group_join, name='group-join'),
    path('group/leave/<int:pk>/', group_leave, name='group-leave'),
    path('group/staff/add/<int:pk>/', add_staff, name='group-staff-add'),
    path('group/staff/remove/<int:pk>/', remove_staff, name='group-staff-remove'),
    path('group/blacklist/add/<int:pk>/', add_blacklist, name='group-staff-add'),
    path('group/blacklist/remove/<int:pk>/', remove_blacklist, name='group-staff-remove'),
    path('group/offer/<int:pk>/', offer_post, name='group-offer-post'),
    path('group/accept/<int:pk>/', accept_post, name='group-accept-post')
])

r = DefaultRouter()
r.register(r'group', GroupViewSet, basename='group')
urlpatterns += r.urls