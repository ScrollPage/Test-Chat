from rest_framework.routers import DefaultRouter
from django.urls import path

from .views import PostsCustomViewset

urlpatterns = [
    
]

r = DefaultRouter()
r.register(r'post', PostsCustomViewset, basename='post')
urlpatterns += r.urls