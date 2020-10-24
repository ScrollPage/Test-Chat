from rest_framework import permissions
from django.db.models import Q, Count

from .service import ListRetrieveCreateDestroyViewset
from photos.models import Photo
from .serializers import PhotoSerializer
from .permissions import NotInBlacklist, IsRightUser

class PhotoViewset(ListRetrieveCreateDestroyViewset):
    '''Все про фотографии'''
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
    permission_classes = [IsRightUser]
    permission_classes_by_action = {
        'list': [NotInBlacklist],
        'retrieve': [NotInBlacklist],
        'create': []
    }
    mass_permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user.my_page)

    def get_queryset(self):
        if self.action != 'list':
            return super().get_queryset()
        id = self.request.query_params.get('id', None)
        if id:
            try:
                id = int(id)
            except ValueError:
                queryset = Photo.objects.filter(owner__user=self.request.user)
            queryset = Photo.objects.filter(owner__user__id=id)
        else:
            queryset = Photo.objects.filter(owner__user=self.request.user)
        queryset = queryset.annotate(
            num_likes=Count('likes', distinct=True)
        ).annotate(
            num_comments=Count('comments', distinct=True)
        )
        return queryset.order_by('-timestamp')

