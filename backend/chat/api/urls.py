from rest_framework.routers import DefaultRouter
from django.urls import path

from .views import ChatModelPermissionViewSet, ChatRefViewset

urlpatterns = [
    
]

r = DefaultRouter()
r.register(r'chat', ChatModelPermissionViewSet, basename='chat')
r.register(r'ref/chat', ChatRefViewset, basename='chat-ref')
urlpatterns += r.urls