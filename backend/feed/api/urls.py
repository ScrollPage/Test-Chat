from rest_framework.routers import DefaultRouter
from django.urls import path

from .views import PostsCustomViewset, CommentCustomViewset

urlpatterns = [
    
]

r = DefaultRouter()
r.register(r'post', PostsCustomViewset, basename='post')
r.register(r'comment', CommentCustomViewset, basename='comment')
urlpatterns += r.urls