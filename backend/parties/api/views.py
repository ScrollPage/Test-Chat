from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Count, Q
from django.shortcuts import get_object_or_404

from .service import (
    PartyPermissionSerializerModelViewset, 
    PartyPermissionSerializerEmptyViewset,
    get_user_and_group
)
from .serializers import (
    PartyDetailSerializer, 
    PartyCreateSerializer, 
    PartyShortSerializer,
    IntegerFieldSerializer,
    OfferedPostSerializer,
    PostListSerializer,
    EmptySerializer
)
from parties.models import Party
from .permissions import IsGroupAdminOrStaff, IsGroupAdmin, NotInBlacklist, RightPostGroupOwner
from contact.models import Contact
from feed.models import Post
from backend.service import ForbiddenError

class GroupViewSet(PartyPermissionSerializerModelViewset):
    '''Все о группах'''
    serializer_class = IntegerFieldSerializer
    serializer_class_by_action = {
        'create': PartyCreateSerializer,
        'update': PartyShortSerializer,
        'partial_update': PartyShortSerializer,
        'list': PartyShortSerializer,
        'retrieve': PartyDetailSerializer,
        'join': EmptySerializer,
        'leave': EmptySerializer,
    }
    permission_classes = [IsGroupAdminOrStaff]
    permission_classes_by_action = {
        'add_staff': [IsGroupAdmin],
        'remove_staff': [IsGroupAdmin],
        'destroy': [IsGroupAdmin],
        'join': [NotInBlacklist],
        'leave': []
    }
    mass_permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'])
    def add_blacklist(self, request, *args, **kwargs):
        self.get_serializer(data=request.data).is_valid(raise_exception=True)
        user, group = get_user_and_group(request, kwargs)
        if user in group.staff.all():
            group.staff.remove(user)
        elif user == group.admin:
            raise ForbiddenError('This is an admin.')
        group.members.remove(user.my_page)
        group.blacklist.add(user)
        return Response(status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def remove_blacklist(self, request, *args, **kwargs):
        self.get_serializer(data=request.data).is_valid(raise_exception=True)
        user, group = get_user_and_group(request, kwargs)
        group.blacklist.add(user)
        return Response(status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def add_staff(self, request, *args, **kwargs):
        self.get_serializer(data=request.data).is_valid(raise_exception=True)
        user, group = get_user_and_group(request, kwargs)
        if user == group.admin:
            raise ForbiddenError('You are an admin.')
        group.staff.add(user)
        return Response(status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def remove_staff(self, request, *args, **kwargs):
        self.get_serializer(data=request.data).is_valid(raise_exception=True)
        user, group = get_user_and_group(request, kwargs)
        group.staff.remove(user)
        return Response(status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def join(self, request, *args, **kwargs):
        '''Вступление в группу'''
        self.get_serializer(data=request.data).is_valid(raise_exception=True)
        group_id = kwargs['pk']
        group = get_object_or_404(Party, id=group_id)
        user = request.user
        user.my_page.parties.add(group)
        return Response(status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def leave(self, request, *args, **kwargs):
        '''Выход из группы'''
        self.get_serializer(data=request.data).is_valid(raise_exception=True)
        group_id = kwargs['pk']
        group = get_object_or_404(Party, id=group_id)
        user = request.user
        user.my_page.parties.remove(group)
        return Response(status=status.HTTP_200_OK)

    def get_queryset(self):
        queryset = Party.objects.all().annotate(
            num_members=Count('members')
        ).annotate(
            joined=Count('members', filter=Q(members__user=self.request.user))
        )
        return queryset

class GroupPostsViewset(PartyPermissionSerializerEmptyViewset):
    '''
    Предложение, отклонение постов
    Сама предложка и стенка группы
    '''
    queryset = Post.objects.all()
    serializer_class = PostListSerializer
    serializer_class_by_action = {
        'accept_post': IntegerFieldSerializer,
        'offer_post': OfferedPostSerializer
    }
    permission_classes = [NotInBlacklist]
    permission_classes_by_action = {
        'accept_post': [
            IsGroupAdminOrStaff, 
            RightPostGroupOwner,
        ],
        'offer_list': [IsGroupAdminOrStaff]
    }
    mass_permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def offer_list(self, request, *args, **kwargs):
        pk = kwargs['pk']
        group = get_object_or_404(Party, id=pk)
        queryset = self.get_queryset().filter(
            published=False, 
            group_owner=group
        ).order_by('-timestamp')
        serializer = self.get_serializer(queryset, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def published_list(self, request, *args, **kwargs):
        pk = kwargs['pk']
        group = get_object_or_404(Party, id=pk)
        queryset = self.get_queryset().filter(
            published=True, 
            group_owner=group
        ).order_by('-timestamp')
        serializer = self.get_serializer(queryset, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'])
    def offer_post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.data
        data['group_owner'] = Party.objects.get(id=kwargs['pk'])
        data['published'] = False
        data['user'] = request.user
        post = Post.objects.create(**data)
        return Response(data=serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['put'])
    def accept_post(self, request, *args, **kwargs):
        self.get_serializer(data=request.data).is_valid(raise_exception=True)
        post_id = request.data['some_id']
        post = Post.objects.filter(id=post_id).update(published=True)
        return Response(status=status.HTTP_200_OK)