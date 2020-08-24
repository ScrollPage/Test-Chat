from rest_framework.routers import DefaultRouter
from django.urls import path

from .views import ContactCustomViewSet, AddRequestCustomViewset

urlpatterns = [
    # path('friends/send/', AddRequestCreateView.as_view())
]

r = DefaultRouter()
r.register(r'request', AddRequestCustomViewset, basename='request')
r.register(r'contact', ContactCustomViewSet, basename='contact')
urlpatterns += r.urls