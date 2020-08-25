from rest_framework.routers import DefaultRouter

from .views import ChatModelPermissionViewSet

urlpatterns = [
    
]

r = DefaultRouter()
r.register(r'chat', ChatModelPermissionViewSet, basename='chat')
urlpatterns += r.urls