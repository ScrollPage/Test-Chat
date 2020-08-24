from rest_framework.routers import DefaultRouter

from .views import ContactCustomViewSet

urlpatterns = [
    
]

r = DefaultRouter()
r.register(r'contact', ContactCustomViewSet, basename='contact')
urlpatterns += r.urls