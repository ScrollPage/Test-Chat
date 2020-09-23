from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Count, Q, Min, Subquery, OuterRef
from django.shortcuts import get_object_or_404

from .service import (
    PermisisonSerializerModelViewset, 
    PermissionSerializerExcludeListViewset,
    PermissionCreateViewset,
    CreateViewset,
)
from feed.models import Post, Comment, Like, RePost
from .serializers import (
    PostSerializer, 
    UpdatePostSerializer, 
    CommentSerializer, 
    UpdateCommentSerializer,
    LikeSerializer,
    RePostSerializer,
    PostListSerializer,
    CreateCommentSerializer,
)
from .permissions import IsCurrentUser, IsNotLiked
from .exceptions import BadRequestError, NotFoundError

class PostsCustomViewset(PermisisonSerializerModelViewset):
    '''Все про посты'''
    model = Post
    serializer_class = PostListSerializer
    serializer_class_by_action = {
        'update': UpdatePostSerializer,
        'partial_update': UpdatePostSerializer,
        'create': PostSerializer,
    }
    permission_classes = [permissions.IsAuthenticated, ]
    permission_classes_by_action = {
        'update': [IsCurrentUser, ],
        'partial_update': [IsCurrentUser, ],
        'destroy': [IsCurrentUser, ],
    }

    def get_queryset(self):
        queryset = Post.objects.all().annotate(
            num_likes=Count('likes', distinct=True)
        ).annotate(
            num_reposts=Count('reposts', distinct=True)
        ).annotate(
            is_liked=Count('likes', filter=Q(likes__user=self.request.user))
        ).annotate(
            is_watched=Count('reviews', filter=Q(reviews__user=self.request.user))
        ).annotate(
            num_reviews=Count('reviews', distinct=True)
        )
        return queryset

class CommentCustomViewset(PermissionSerializerExcludeListViewset):
    '''Все про комменты, кроме метода list'''
    queryset = Comment.objects.all()
    model = Comment
    serializer_class = CommentSerializer
    serializer_class_by_action = {
        'update': UpdateCommentSerializer,
        'partial_update': UpdateCommentSerializer,
        'create': CreateCommentSerializer,
    }
    permission_classes = [permissions.IsAuthenticated, ]
    permission_classes_by_action = {
        'update': [IsCurrentUser, ],
        'partial_update': [IsCurrentUser, ]
    }


class LikesCustomViewset(PermissionCreateViewset):
    '''Создание и удаление лайков'''
    queryset = Like.objects.all()
    model = Like
    serializer_class = LikeSerializer
    permission_classes = [permissions.IsAuthenticated, IsNotLiked]
    permission_classes_by_action = {
        'remove': [permissions.IsAuthenticated, ],
    }

    @action(detail=False, methods=['post'])
    def remove(self, request, *args, **kwargs):
        user = request.data.get('user', None)
        post_id = request.data.get('post_id', None)
        if not user or not post_id:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        post_id = int(post_id)
        like = Like.objects.filter(Q(user=user)&Q(post_id=post_id)).first()
        try:
            like.delete()
        except AttributeError:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)

class RePostMechanicsCustomViewset(CreateViewset):
    '''Создание репоста'''
    queryset = Post.objects.all()
    serializer_class = RePostSerializer
    permission_classes = [permissions.IsAuthenticated, ]
            
    def perform_create(self, serializer):
        user = self.request.user
        parent = serializer.validated_data.get('parent', None)
        try:
            RePost.objects.filter(post_id=parent).get(user=user)
        except RePost.DoesNotExist:
            RePost.objects.create(
                post_id=parent,
                user=user
            )
        super().perform_create(serializer)