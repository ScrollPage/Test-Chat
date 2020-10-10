from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path

from .views import LikesCustomViewset

urlpatterns = [
    
]

post_like_add = LikesCustomViewset.as_view({
    'post': 'post_like_add'
})

post_like_remove = LikesCustomViewset.as_view({
    'post': 'post_like_remove'
})

comment_like_add = LikesCustomViewset.as_view({
    'post': 'comment_like_add'
})

comment_like_remove = LikesCustomViewset.as_view({
    'post': 'comment_like_remove'
})

photo_like_add = LikesCustomViewset.as_view({
    'post': 'photo_like_add'
})

photo_like_remove = LikesCustomViewset.as_view({
    'post': 'photo_like_remove'
})

urlpatterns += format_suffix_patterns([
    path('like/post/add/', post_like_add, name='post-like-add'),
    path('like/post/remove/', post_like_remove, name='post-like-remove'),
    path('like/comment/add/', comment_like_add, name='comment-like-add'),
    path('like/comment/remove/', comment_like_remove, name='comment-like-remove'),
    path('like/photo/add/', photo_like_add, name='photo-like-add'),
    path('like/photo/remove/', photo_like_remove, name='photo-like-remove'),
])