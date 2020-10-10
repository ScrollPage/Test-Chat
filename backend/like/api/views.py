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
from backend.exceptions import ForbiddenError

class LikesCustomViewset(GenericViewSet):
    '''Создание и удаление лайков'''
    serializer_class = IntegerFieldSerializer
    permission_classes = [permissions.IsAuthenticated]

    def not_liked(self, inst):
        if not inst.likes.aggregate(like=Count('user', filter=Q(user=self.request.user)))['like']:
            return
        raise ForbiddenError("You've already liked this.")

    def liked(self, inst):
        if inst.likes.aggregate(like=Count('user', filter=Q(user=self.request.user)))['like']:
            return
        raise ForbiddenError("You did not like this yet.")

    def like_add(self, instance):
        serializer = self.get_serializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        id = serializer.data['some_id']
        inst = get_object_or_404(instance, id=id)
        self.not_liked(inst)
        like = Like.objects.create(user=self.request.user)
        inst.likes.add(like)
        return Response(status=status.HTTP_200_OK)

    def like_remove(self, instance):
        serializer = self.get_serializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        id = serializer.data['some_id']
        inst = get_object_or_404(instance, id=id)
        self.liked(inst)
        like = inst.likes.get(user=self.request.user)
        like.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['post'])
    def post_like_add(self, request, *arags, **kwargs):
        return self.like_add(Post)

    @action(detail=False, methods=['post'])
    def post_like_remove(self, request, *arags, **kwargs):
        return self.like_remove(Post)

    @action(detail=False, methods=['post'])
    def comment_like_add(self, request, *arags, **kwargs):
        return self.like_add(Comment)

    @action(detail=False, methods=['post'])
    def comment_like_remove(self, request, *arags, **kwargs):
        return self.like_remove(Comment)

    @action(detail=False, methods=['post'])
    def photo_like_add(self, request, *arags, **kwargs):
        return self.like_add(Photo)

    @action(detail=False, methods=['post'])
    def photo_like_remove(self, request, *arags, **kwargs):
        return self.like_remove(Photo)
