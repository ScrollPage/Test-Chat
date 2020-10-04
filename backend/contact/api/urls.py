from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path

from .views import RegistrationView, ContactActivationView, MeViewset

urlpatterns = [
    path('register/', RegistrationView.as_view(), name='register'),
]

me = MeViewset.as_view({
    'get': 'me'
})

email_activation = ContactActivationView.as_view({
    'post': 'email_activation'
})

phone_activation = ContactActivationView.as_view({
    'post': 'phone_activation'
})

urlpatterns += format_suffix_patterns([
    path('activation/email/', email_activation, name='email-activation'),
    path('activation/phone/', phone_activation, name='phone-activation'),
    path('me/', me, name='me'),
])