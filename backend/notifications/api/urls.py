from django.urls import path

from .views import NoificationsListView

urlpatterns = [
    path('notifications/<int:pk>/', NoificationsListView.as_view(), name='notifications')
]