from rest_framework import generics, permissions

from .serializers import ScoreCreateSerializer

class ScoreCreateView(generics.CreateAPIView):
    '''Создание просмотра'''
    serializer_class = ScoreCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

