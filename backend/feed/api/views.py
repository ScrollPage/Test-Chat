from rest_framework import permissions
from django.db.models import Count

from .service import (
    PermisisonSerializerModelViewset, 
    PermissionUpdateDestroyCreateViewset
)
from feed.models import Post, Comment
from .serializers import PostSerializer, UpdatePostSerializer, CommentSerializer

class PostsCustomViewset(PermisisonSerializerModelViewset):
    '''Все про посты'''
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    permission_classes_by_action = {}
    serializer_class_by_method = {
        'PUT': UpdatePostSerializer,
        'PATCH': UpdatePostSerializer,
    }

    def get_queryset(self):
        queryset = Post.objects.all().annotate(
            num_likes=Count('likes')
        ).annotate(
            num_reposts=Count('reposts')
        )
        return queryset

class CommentCustomViewset(PermissionUpdateDestroyCreateViewset):
    '''Все про комменты'''
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    permission_classes_by_action = {}