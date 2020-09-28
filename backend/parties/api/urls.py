from rest_framework.routers import DefaultRouter
from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path

from .views import PartyViewSet

urlpatterns = [
    
]

group_join = PartyViewSet.as_view({
    'post': 'join'
})

group_leave = PartyViewSet.as_view({
    'post': 'leave'
})

urlpatterns += format_suffix_patterns([
    path('group/join/', group_join, name='group-join'),
    path('group/leave/', group_leave, name='group-leave'),
])

r = DefaultRouter()
r.register(r'group', PartyViewSet, basename='group')
urlpatterns += r.urls