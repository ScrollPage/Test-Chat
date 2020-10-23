from rest_framework.routers import DefaultRouter
from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path

from .views import ChatModelPermissionViewSet, ChatRefViewset

urlpatterns = [
    
]

read_message = ChatModelPermissionViewSet.as_view({
    'put': 'read'
})

add_user = ChatModelPermissionViewSet.as_view({
    'post': 'add'
})

remove_user = ChatModelPermissionViewSet.as_view({
    'post': 'remove'
})

urlpatterns += format_suffix_patterns([
    path('chat/add/<int:pk>/', add_user, name='add-user'),
    path('chat/remove/<int:pk>/', remove_user, name='remove-user'),
    path('chat/read/<int:pk>/', read_message, name='read-messages'),
])

r = DefaultRouter()
r.register(r'chat', ChatModelPermissionViewSet, basename='chat')
r.register(r'ref/chat', ChatRefViewset, basename='chat-ref')
urlpatterns += r.urls