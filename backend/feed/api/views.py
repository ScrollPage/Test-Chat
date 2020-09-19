from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Count, Q, Min
from django.shortcuts import get_object_or_404

from .service import (
    PermisisonSerializerModelViewset, 
    PermissionSerializerExcludeListViewset,
    PermissionSerializerCreateViewset,
    CreateViewset,
)
from feed.models import Post, Comment, Like, RePost
from .serializers import (
    PostSerializer, 
    UpdatePostSerializer, 
    CommentSerializer, 
    UpdateCommentSerializer,
    LikeCreateSerializer,
    LikeRemoveSerializer,
)
from .permissions import IsCurrentUser, IsNotLiked
from .exceptions import BadRequestError

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
        ).annotate(
            is_liked=Count('likes', filter=Q(likes__user=self.request.user))
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
    }
    permission_classes = [IsCurrentUser, ]
    permission_classes_by_action = {
        'create': [permissions.IsAuthenticated, ],
        'retrieve': [permissions.IsAuthenticated, ]
    }


class LikesCustomViewset(PermissionSerializerCreateViewset):
    '''Создание и удаление лайков'''
    queryset = Like.objects.all()
    model = Like
    serializer_class = LikeCreateSerializer
    serializer_class_by_action = {
        'remove': LikeRemoveSerializer,
    }
    permission_classes = [permissions.IsAuthenticated, IsNotLiked]
    permission_classes_by_action = {
        'remove': [permissions.IsAuthenticated, ],
    }

    @action(detail=False, methods=['post'])
    def remove(self, request, *args, **kwargs):
        user = request.user
        try:
            post_id = int(request.data['post_id'])
        except ValueError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        try:
            like = Like.objects.filter(Q(user=user)&Q(post_id=post_id)).first()    
            like.delete()
        except AttributeError:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)

class RePostMechanicsCustomViewset(CreateViewset):
    '''Создание репоста'''
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated, ]
            
    def perform_create(self, serializer):
        print('asdasdasd')
        user = self.request.user
        parent = serializer.validated_data['parent']
        if not bool(parent):
            raise BadRequestError('You need parent.')
        parent = parent['id']
        try:
            post = Post.objects.get(id=parent)
        except Post.DoesNotExist:
            raise BadRequestError('No such post already')
        try:
            RePost.objects.filter(post_id=parent).get(user=user)
        except RePost.DoesNotExist:
            RePost.objects.create(
                post_id=post,
                user=user
            )
        super().perform_create(serializer)