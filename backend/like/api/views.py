from rest_framework.viewsets import GenericViewSet
from rest_framework import permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q

from parties.api.serializers import IntegerFieldSerializer
from feed.models import Post
from comments.models import Comment
from like.models import Like
from photos.models import Photo
from backend.exceptions import ForbiddenError, NotFoundError
from notifications.service import send_like_notification 
from .service import liked, not_liked, not_in_blacklist, is_published

class LikesCustomViewset(GenericViewSet):
    '''Создание и удаление лайков'''
    serializer_class = IntegerFieldSerializer
    permission_classes = [permissions.IsAuthenticated]

    def validate(self, inst, add_like=True):
        not_in_blacklist(self.request.user, inst)
        is_published(inst)
        if add_like:
            not_liked(self.request.user, inst)
        else:
            liked(self.request.user, inst)

    def like_add(self, instance):
        serializer = self.get_serializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        id = serializer.data['some_id']
        inst = get_object_or_404(instance, id=id)
        self.validate(inst)
        like = Like.objects.create(user=self.request.user)
        inst.likes.add(like)
        try:
            owner = inst.user
        except AttributeError:
            owner = inst.owner.user
        send_like_notification(owner, self.request.user, inst.get_type(), id)
        return Response(status=status.HTTP_200_OK)

    def like_remove(self, instance):
        serializer = self.get_serializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        id = serializer.data['some_id']
        inst = get_object_or_404(instance, id=id)
        self.validate(inst, False)
        like = inst.likes.get(user=self.request.user)
        like.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['post'])
    def post_like_add(self, request, *args, **kwargs):
        return self.like_add(Post)

    @action(detail=False, methods=['post'])
    def post_like_remove(self, request, *args, **kwargs):
        return self.like_remove(Post)

    @action(detail=False, methods=['post'])
    def comment_like_add(self, request, *args, **kwargs):
        return self.like_add(Comment)

    @action(detail=False, methods=['post'])
    def comment_like_remove(self, request, *args, **kwargs):
        return self.like_remove(Comment)

    @action(detail=False, methods=['post'])
    def photo_like_add(self, request, *args, **kwargs):
        return self.like_add(Photo)

    @action(detail=False, methods=['post'])
    def photo_like_remove(self, request, *args, **kwargs):
        return self.like_remove(Photo)
