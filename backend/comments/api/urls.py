from rest_framework.routers import DefaultRouter
from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path

from .views import CommentCustomViewset

urlpatterns = [
    
]

comment_post = CommentCustomViewset.as_view({
    'post': 'comment_post'
})

comment_photo = CommentCustomViewset.as_view({
    'post': 'comment_photo'
})

urlpatterns += format_suffix_patterns([
    path('comment/post/', comment_post, name='comment-post'),
    path('comment/photo/', comment_photo, name='comment-photo'),
])

r = DefaultRouter()
r.register(r'comment', CommentCustomViewset, basename='comment')
urlpatterns += r.urls