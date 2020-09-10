from rest_framework import permissions

from .service import PermisisonModelViewset
from feed.models import Post
from .serializers import PostSerializer

class PostsCustomViewset(PermisisonModelViewset):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    permission_classes_by_action = {}