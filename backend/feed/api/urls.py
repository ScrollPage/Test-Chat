from rest_framework.routers import DefaultRouter
from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path

from .views import (
    PostsCustomViewset, 
    CommentCustomViewset, 
    LikesCustomViewset, 
    RePostMechanicsCustomViewset
)

urlpatterns = [
    
]

like_add = LikesCustomViewset.as_view({
    'post': 'create'
})

like_remove = LikesCustomViewset.as_view({
    'post': 'remove'
})

urlpatterns += [
    path('like/add/', like_add, name='like-add'),
    path('like/remove/', like_remove, name='like-remove'),
]

r = DefaultRouter()
r.register(r'post', PostsCustomViewset, basename='post')
r.register(r'comment', CommentCustomViewset, basename='comment')
r.register(r'repost', RePostMechanicsCustomViewset, basename='repost')
urlpatterns += r.urls