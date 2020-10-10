from rest_framework import permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count
from django.shortcuts import get_object_or_404

from .service import PermissionSerializerCommentModelViewset
from .serializers import (
    UpdateCommentSerializer, 
    CreateCommentSerializer,
    CommentSerializer
)
from feed.api.permissions import IsRightUser, NotInOwnersBlacklist
from backend.exceptions import ForbiddenError
from comments.models import Comment
from feed.models import Post
from photos.models import Photo

class CommentCustomViewset(PermissionSerializerCommentModelViewset):
    '''Все про комменты, кроме метода list'''
    queryset = Comment.objects.all()
    model = Comment
    serializer_class = CommentSerializer
    serializer_class_by_action = {
        'update': UpdateCommentSerializer,
        'partial_update': UpdateCommentSerializer,
        'comment_post': CreateCommentSerializer,
        'comment_photo': CreateCommentSerializer,
    }
    permission_classes = []
    permission_classes_by_action = {
        'update': [IsRightUser],
        'partial_update': [IsRightUser],
        'destroy': [IsRightUser],
    }
    mass_permission_classes = [permissions.IsAuthenticated]

    def not_in_blacklist(self, inst):
        if inst.owner:
            if self.request.user not in inst.owner.blacklist.all():
                return
        else:
            if self.request.user not in inst.group_owner.blacklist.all():
                return
        raise ForbiddenError('You are in blacklist.')

    def parent_is_here(self, inst, data):
        parent = data.get('parent', None)
        if parent:
            if inst.comments.aggregate(comment=Count('id', filter=Q(id=parent)))['comment']:
                return
            raise ForbiddenError('Wrong parent.')
        return None

    def validate(self, inst, data):
        self.not_in_blacklist(inst)
        self.parent_is_here(inst, data)

    def create_comment(self, instance):
        serializer = self.get_serializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        id = self.request.data['id']
        inst = get_object_or_404(instance, id=id)
        self.validate(inst, self.request.data)
        comment = serializer.save(user=self.request.user)
        inst.comments.add(comment)
        return Response(data=serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def comment_post(self, request, *args, **kwargs):
        return self.create_comment(Post)

    @action(detail=False, methods=['post'])
    def comment_photo(self, request, *args, **kwargs):
        return self.create_comment(Photo)

    def get_queryset(self):
        if self.action == 'list':
            post_id = self.request.query_params.get('post_id', None)
            if post_id:
                post = get_object_or_404(Post, id=post_id)
                return post.comments
            elif photo_id:
                photo = get_object_or_404(Photo, id=photo_id)
                return photo.comments
            else:
                raise BadRequestError('You need to input a query parameter post id in your request.')
        return super().get_queryset()