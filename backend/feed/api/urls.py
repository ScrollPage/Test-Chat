from rest_framework.routers import DefaultRouter
from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path

from .views import (
    PostsCustomViewset, 
    RePostMechanicsCustomViewset,
    ContactFeedView,
)

urlpatterns = [
    path('feed/', ContactFeedView.as_view(), name='feed')
]

r = DefaultRouter()
r.register(r'post', PostsCustomViewset, basename='post')
r.register(r'repost', RePostMechanicsCustomViewset, basename='repost')
urlpatterns += r.urls