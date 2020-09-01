from rest_framework.test import (
    APITestCase, 
    force_authenticate, 
    APIRequestFactory
)
from rest_framework import status
import requests
from django.conf import settings
from chat.tests.service import get_header
from django.contrib.auth.models import User

from community.api.views import ContactCustomViewSet

class TestViews(APITestCase):

    def test_detail_contact_auth_view(self):
        '''Убедиться, что обзор аккаунта доступен всем зарегестрированным'''
        url = f'{settings.DJANGO_DOMEN}/api/v1/contact/1/'
        headers = get_header(
            f'{settings.DJANGO_DOMEN}/auth/jwt/create/'
        )
        response = requests.get(url, headers=headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_detail_destroy_update_unauth(self):
        '''Проверка работы прав доступа'''
        url = f'{settings.DJANGO_DOMEN}/api/v1/contact/1/'
        retrieve_response = requests.get(url)
        destroy_response = requests.delete(url)
        update_response = requests.put(url)
        self.assertEqual(retrieve_response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(destroy_response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(update_response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_destroy_update_incorrect_user(self):
        '''Проверка работы прав доступа'''
        url = f'{settings.DJANGO_DOMEN}/api/v1/contact/1/'
        headers = get_header(
            f'{settings.DJANGO_DOMEN}/auth/jwt/create/',
            'test',
            'test'
        )
        destroy_response = requests.delete(url, headers=headers)
        update_response = requests.put(url, headers=headers)
        self.assertEqual(destroy_response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(update_response.status_code, status.HTTP_403_FORBIDDEN)

    def test_contact_id_view_unauth(self):
        '''Проверка работы прав доступа'''
        url = f'{settings.DJANGO_DOMEN}/api/v1/contact/id/?username=admin'
        response = requests.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_contact_id_view_unauth(self):
        '''Проверка работы прав доступа'''
        url = f'{settings.DJANGO_DOMEN}/api/v1/contact/id/?username=admin'
        headers = get_header(
            f'{settings.DJANGO_DOMEN}/auth/jwt/create/'
        )
        response = requests.get(url, headers=headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['id'], 1)

    def test_friends_unauth(self):
        url = f'{settings.DJANGO_DOMEN}/api/v1/friends/?id=1'
        response = requests.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_friends_auth(self):
        url = f'{settings.DJANGO_DOMEN}/api/v1/friends/?id=1'
        headers = get_header(
            f'{settings.DJANGO_DOMEN}/auth/jwt/create/'
        )
        response = requests.get(url, headers=headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    

    
        