from rest_framework import permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.db.models import Q
from itertools import chain
from operator import attrgetter

from .service import (
    PermisisonSerializerPostModelViewset, 
    PermissionSerializerCommentModelViewset,
    PermissionCreateViewset,
    CreateViewset,
    post_annotations,
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
from .permissions import IsRightOwnerOrUser, IsNotLiked, IsRightUser, NotInOwnersBlacklist
from .exceptions import BadRequestError, NotFoundError
from notifications.service import send_repost_notification

class PostsCustomViewset(PermisisonSerializerPostModelViewset):
    '''Все про посты'''
    model = Post
    serializer_class = PostListSerializer
    serializer_class_by_action = {
        'update': UpdatePostSerializer,
        'partial_update': UpdatePostSerializer,
        'create': PostSerializer,
    }
    permission_classes = []
    permission_classes_by_action = {
        'update': [IsRightUser],
        'partial_update': [IsRightUser],
        'destroy': [IsRightOwnerOrUser],
    }
    mass_permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        res = super().create(request, args, kwargs)
        if res.data.get('image', None):
            id = int(res.data.get('id'))
            post = get_object_or_404(Post, id=id)
            post.image_save()
        return res

    def get_queryset(self):
        queryset = Post.objects.all()
        return post_annotations(self, queryset).filter(published=True).order_by('-timestamp')

class CommentCustomViewset(PermissionSerializerCommentModelViewset):
    '''Все про комменты, кроме метода list'''
    queryset = Comment.objects.all()
    model = Comment
    serializer_class = CommentSerializer
    serializer_class_by_action = {
        'update': UpdateCommentSerializer,
        'partial_update': UpdateCommentSerializer,
        'create': CreateCommentSerializer,
    }
    permission_classes = []
    permission_classes_by_action = {
        'update': [IsRightUser],
        'partial_update': [IsRightUser],
        'destroy': [IsRightUser],
    }
    mass_permission_classes = [permissions.IsAuthenticated, NotInOwnersBlacklist]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        if self.action == 'list':
            post_id = self.request.query_params.get('post_id', None)
            if not post_id:
                raise BadRequestError('You need to input a query parameter post id in your request.')
            return Post.objects.get(id=post_id).comments
        return super().get_queryset()

class LikesCustomViewset(PermissionCreateViewset):
    '''Создание и удаление лайков'''
    queryset = Like.objects.all()
    model = Like
    serializer_class = LikeSerializer
    permission_classes = [IsNotLiked]
    permission_classes_by_action = {
        'remove': [],
    }
    mass_permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

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
    permission_classes = [permissions.IsAuthenticated, NotInOwnersBlacklist]
            
    def perform_create(self, serializer):
        user = self.request.user
        parent = serializer.validated_data.get('parent', None)
        try:
            RePost.objects.get(
                post_id=parent, 
                user=user
            )
        except RePost.DoesNotExist:
            RePost.objects.create(
                post_id=parent,
                user=user
            )
            send_repost_notification(parent.user, user, parent)
        serializer.save(user=self.request.user)

class ContactFeedView(generics.ListAPIView):
    '''Новости конкретного конатка'''
    serializer_class = PostListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset_friends = Post.objects.filter(
            owner__in=[friend.my_page for friend in user.my_page.friends.all()]
        ).exclude(user=self.request.user)
        queryset_groups = Post.objects.filter(
            group_owner__in=[group for group in user.my_page.parties.all()]
        )
        queryset_friends = post_annotations(self, queryset_friends)
        queryset_groups = post_annotations(self, queryset_groups)
        queryset = reversed(sorted(
            chain(queryset_friends, queryset_groups),
            key=attrgetter('timestamp')
        ))
        return queryset