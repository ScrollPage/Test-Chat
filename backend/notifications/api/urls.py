from django.urls import path

from .views import NoificationsListView

notifications = NoificationsListView.as_view({
    'get': 'list',
    'put': 'update',
    'patch': 'partial_update'
})

urlpatterns = [
    path('notifications/<int:pk>/', notifications, name='notifications')
]