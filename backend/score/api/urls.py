from django.urls import path

from .views import ScoreCreateView

urlpatterns = [
    path('score/', ScoreCreateView.as_view(), name='score-create')
]