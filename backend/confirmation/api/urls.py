from django.urls import path

from . import views

urlpatterns = [
    path('register/', views.RegistrationView.as_view()),
    path('activate/', views.UserActivationView.as_view()),
]