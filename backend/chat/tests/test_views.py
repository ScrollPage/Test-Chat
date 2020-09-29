from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
import requests
from django.conf import settings

from contact.models import Contact
from chat.models import Chat

class ChatCreationTestCase(APITestCase):

    def setUp(self):
        self.admin = Contact.objects.create_user(
            email='test@case1.test',
            first_name='admin',
            last_name='admin',
            phone_number=0,
            slug='test_case',
            password='very_strong_psw'
        )

        self.user = Contact.objects.create_user(
            email='test@case2.test',
            first_name='user',
            last_name='user',
            phone_number=0,
            slug='test_case',
            password='very_strong_psw'
        )

        self.chat1 = Chat.objects.create()
        self.chat1.participants.add(self.admin)
        self.chat1.participants.add(self.user)
        self.chat2 = Chat.objects.create()
        self.chat2.participants.add(self.admin)

    def api_authentication(self, user):
        self.client.force_authenticate(user=user)

    def test_chat_creation_unauthenticated(self):
        '''Убедиться, что неавторизованные пользователи не могут создавать чаты'''
        url = '/api/v1/chat/'
        data = {"participants": []}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_chat_creation_authenticated(self):
        self.api_authentication(self.admin)
        url = '/api/v1/chat/'
        data = {"participants": []}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_chat_list_authenticated(self):
        self.api_authentication(self.admin)
        url = '/api/v1/chat/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
    
    def test_chat_list_unauthenticated(self):
        url = '/api/v1/chat/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_chat_list_query_authenticated(self):
        self.api_authentication(self.admin)
        url = '/api/v1/chat/?query_name=user'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_chat_list_query_authenticated_other_user(self):
        self.api_authentication(self.user)
        url = '/api/v1/chat/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)