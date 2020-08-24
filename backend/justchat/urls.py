from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from django.conf.urls.static import static
from django.conf import settings

from .yasg import urlpatterns as doc_urls

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/v1/', include('chat.api.urls')),
    path('api/v1/', include('confirmation.api.urls')),
    path('api/v1/', include('community.api.urls')),

    path('api-auth/', include('rest_framework.urls')),

    # path('rest-auth/', include('rest_auth.urls')),
    # path('rest-auth/registration/', include('rest_auth.registration.urls')),
    # path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
]

urlpatterns += doc_urls
urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)