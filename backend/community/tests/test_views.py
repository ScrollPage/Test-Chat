from rest_framework.test import APITestCase
from rest_framework import status
import requests
from django.conf import settings
from chat.tests.service import get_header

class TestViews(APITestCase):
    
    def test_detail_contact_unauth_view(self):
        '''Убедиться, что обзор аккаунта недоступен всем незарегестрированным'''
        url = f'{settings.DJANGO_DOMEN}/api/v1/contact/1/'
        response = requests.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_detail_contact_auth_view(self):
        '''Убедиться, что обзор аккаунта доступен всем зарегестрированным'''
        url = f'{settings.DJANGO_DOMEN}/api/v1/contact/1/'
        headers = get_header(
            f'{settings.DJANGO_DOMEN}/auth/jwt/create/'
        )
        response = requests.get(url, headers=headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)