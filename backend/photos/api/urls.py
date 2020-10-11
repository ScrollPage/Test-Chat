from rest_framework.routers import DefaultRouter
from django.urls import path

from .views import PhotoViewset

urlpatterns = [
    
]

r = DefaultRouter()
r.register('photo', PhotoViewset, basename='photo')
urlpatterns += r.urls
