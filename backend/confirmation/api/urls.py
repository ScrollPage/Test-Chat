from django.urls import path

from . import views

urlpatterns = [
    path('register/', views.RegistrationView.as_view()),
    path('confirm/', views.UserConfirmationView.as_view()),
]