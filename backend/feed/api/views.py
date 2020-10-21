from rest_framework import permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.db.models import Q
from itertools import chain
from operator import attrgetter

from .service import (
    PermisisonSerializerPostModelViewset, 
    CreateViewset,
    post_annotations,
)
from feed.models import Post, Comment, Like, RePost
from .serializers import (
    PostSerializer, 
    UpdatePostSerializer, 
    RePostSerializer,
    PostListSerializer,
)
from .permissions import (
    IsRightOwnerOrUser, 
    IsRightUser, 
    NotInOwnersBlacklist, 
    NotInBlacklistByQuery
)
from .exceptions import BadRequestError
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
    permission_classes = [IsRightUser, NotInOwnersBlacklist]
    permission_classes_by_action = {
        'create': [],
        'destroy': [IsRightOwnerOrUser, NotInOwnersBlacklist],
        'retrieve': [NotInOwnersBlacklist],
        'list': [NotInBlacklistByQuery]
    }
    mass_permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        queryset = Post.objects.all()
        queryset = post_annotations(self.request.user, queryset)
        return queryset.order_by('-timestamp')


class RePostMechanicsCustomViewset(CreateViewset):
    '''Создание репоста'''
    queryset = Post.objects.all()
    serializer_class = RePostSerializer
    permission_classes = [permissions.IsAuthenticated, NotInOwnersBlacklist]
            
    def perform_create(self, serializer):
        user = self.request.user
        parent = serializer.validated_data.get('parent', None)
        _, fl = RePost.objects.get_or_create(
            post_id=parent, 
            user=user
        )
        print(fl)
        if fl:
            send_repost_notification(parent.user, user, parent)

        serializer.save(user=self.request.user)

class ContactFeedView(generics.ListAPIView):
    '''Новости конкретного контакта'''
    serializer_class = PostListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        friends_plus_you = [friend.my_page for friend in user.my_page.friends.all()] + [user.my_page]
        queryset_friends = Post.objects.filter(
            owner__in=friends_plus_you
        )
        queryset_groups = Post.objects.filter(
            group_owner__in=[group for group in user.my_page.parties.all()]
        )
        queryset_friends = post_annotations(user, queryset_friends)
        queryset_groups = post_annotations(user, queryset_groups)
        queryset = reversed(sorted(
            chain(queryset_friends, queryset_groups),
            key=attrgetter('timestamp')
        ))
        return queryset