from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from .yasg import urlpatterns as doc_urls

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/v1/', include('contact.api.urls')),
    path('api/v1/', include('chat.api.urls')),
    path('api/v1/', include('community.api.urls')),

    path('api-auth/', include('rest_framework.urls')),

    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
]

urlpatterns += doc_urls
urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)