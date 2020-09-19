from rest_framework import permissions
from django.db.models import Count

from .service import (
    PermisisonSerializerModelViewset, 
    PermissionSerializerExcludeListViewset
)
from feed.models import Post, Comment
from .serializers import (
    PostSerializer, 
    UpdatePostSerializer, 
    CommentSerializer, 
    UpdateCommentSerializer
)
from .permissions import IsCurrentUser

class PostsCustomViewset(PermisisonSerializerModelViewset):
    '''Все про посты'''
    model = Post
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated, ]
    permission_classes_by_action = {
        'update': [IsCurrentUser, ],
        'partial_update': [IsCurrentUser, ],
    }
    serializer_class_by_action = {
        'update': UpdatePostSerializer,
        'partial_update': UpdatePostSerializer,
    }

    def get_queryset(self):
        queryset = Post.objects.all().annotate(
            num_likes=Count('likes')
        ).annotate(
            num_reposts=Count('reposts')
        )
        return queryset

class CommentCustomViewset(PermissionSerializerExcludeListViewset):
    '''Все про комменты'''
    queryset = Comment.objects.all()
    model = Comment
    serializer_class = CommentSerializer
    permission_classes = [IsCurrentUser, ]
    permission_classes_by_action = {
        'create': [permissions.IsAuthenticated, ],
        'retrieve': [permissions.IsAuthenticated, ]
    }
    serializer_class_by_action = {
        'update': UpdateCommentSerializer,
        'partial_update': UpdateCommentSerializer,
    }