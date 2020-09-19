from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Count, Q

from .service import (
    PermisisonSerializerModelViewset, 
    PermissionSerializerExcludeListViewset,
    PermissionCreateViewset,
)
from feed.models import Post, Comment, Like
from .serializers import (
    PostSerializer, 
    UpdatePostSerializer, 
    CommentSerializer, 
    UpdateCommentSerializer,
    LikeBigSerializer
)
from .permissions import IsCurrentUser

class PostsCustomViewset(PermisisonSerializerModelViewset):
    '''Все про посты'''
    model = Post
    serializer_class = PostSerializer
    serializer_class_by_action = {
        'update': UpdatePostSerializer,
        'partial_update': UpdatePostSerializer,
    }

    permission_classes = [permissions.IsAuthenticated, ]
    permission_classes_by_action = {
        'update': [IsCurrentUser, ],
        'partial_update': [IsCurrentUser, ],
        'destroy': [IsCurrentUser, ],
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
    serializer_class_by_action = {
        'update': UpdateCommentSerializer,
        'partial_update': UpdateCommentSerializer,
    }
    permission_classes = [IsCurrentUser, ]
    permission_classes_by_action = {
        'create': [permissions.IsAuthenticated, ],
        'retrieve': [permissions.IsAuthenticated, ]
    }


class LikesCustomViewset(PermissionCreateViewset):
    '''Создание и удаление лайков'''
    queryset = Like.objects.all()
    model = Like
    serializer_class = LikeBigSerializer
    permission_classes = [permissions.IsAuthenticated]
    permission_classes_by_action = {}

    @action(detail=False, methods=['post'])
    def remove(self, request, *args, **kwargs):
        data = request.data
        user = int(data['user'])
        post_id = int(data['post_id'])
        like = Like.objects.filter(Q(user=user)&Q(post_id=post_id)).first()    
        try:
            like.delete()
        except Like.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)