from rest_framework import status
from rest_framework.test import APITestCase
import requests
from django.conf import settings

from .service import get_header

class TestViews(APITestCase):

    def test_chat_creation_authenticated(self):
        '''Убедиться, что авторизоанные пользователи могут создавать чаты'''
        url = f'{settings.DJANGO_DOMEN}/api/v1/chat/'
        data = {"participants": ['admin']}
        headers = get_header(
            f'{settings.DJANGO_DOMEN}/auth/jwt/create/'
        )
        r = requests.post(url, data=data, headers=headers)

        self.assertEqual(r.status_code, status.HTTP_201_CREATED)

    def test_chat_creation_unauthenticated(self):
        '''Убедиться, что неавторизоанные пользователи не могут создавать чаты'''
        url = f'{settings.DJANGO_DOMEN}/api/v1/chat/'
        data = {'participants': []}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_chat_list(self):
        '''Убедиться, что чаты доступны для просмотра всем'''
        url = '/api/v1/chat/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_chat_detail(self):
        '''Убедиться, что опредленный чат доступен для просмотра всем'''
        url = f'{settings.DJANGO_DOMEN}/api/v1/chat/1/'
        r = requests.get(url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)