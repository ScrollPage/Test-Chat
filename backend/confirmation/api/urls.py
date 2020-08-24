from django.urls import path

from . import views

urlpatterns = [
    path('register/', views.RegistrationView.as_view(), name='register'),
    path('activate/', views.UserActivationView.as_view(), name='activate'),
]