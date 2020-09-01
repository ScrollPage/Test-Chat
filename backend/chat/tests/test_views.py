from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
import requests
from django.conf import settings

from contact.models import Contact
from chat.models import Chat

class ChatCreationTestCase(APITestCase):

    def setUp(self):
        self.user = Contact.objects.create_user(
            email='test@case.test',
            first_name='Test',
            last_name='Case',
            phone_number=0,
            slug='test_case',
            password='very_strong_psw'
        )

    def api_authentication(self):
        self.client.force_authenticate(user=self.user)

    def test_chat_creation_unauthenticated(self):
        '''Убедиться, что неавторизованные пользователи не могут создавать чаты'''
        url = '/api/v1/chat/'
        data = {"participants": []}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_chat_creation_authenticated(self):
        self.api_authentication()
        url = '/api/v1/chat/'
        data = {"participants": []}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_chat_createion_bad_request(self):
        self.api_authentication()
        url = '/api/v1/chat/'
        data = {"participants": []}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

