from rest_framework import permissions

from .service import ListRetrieveCreateDestroyViewset
from photos.models import Photo
from .serializers import PhotoSerializer

class PhotoViewset(ListRetrieveCreateDestroyViewset):
    '''Все про фотографии'''
    serializer_class = PhotoSerializer
    permission_classes = []
    permission_classes_by_action = {

    }
    mass_permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user.my_page)

    def get_queryset(self):
        id = self.request.query_params.get('user_id', None)
        queryset = Photo.objects.filter(owner__user=self.request.user)
        if id:
            try:
                id = int(id)
            except ValueError:
                queryset = Photo.objects.filter(owner__user__id=id)
            else:
                queryset = Photo.objects.filter(owner__user=self.request.user)
        else:
            queryset = Photo.objects.filter(owner__user=self.request.user)
        return queryset.order_by('-timestamp')

