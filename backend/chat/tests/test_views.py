from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
import requests
from django.conf import settings
import json

from contact.models import Contact
from chat.models import Chat, ChatRef
from backend.service import get_response

class ChatCreationTestCase(APITestCase):

    def setUp(self):
        self.user1 = Contact.objects.create_user(
            email='test@case1.test',
            first_name='admin',
            last_name='admin',
            phone_number=0,
            slug='test_case',
            password='very_strong_psw'
        )

        self.user2 = Contact.objects.create_user(
            email='test@case2.test',
            first_name='user',
            last_name='user',
            phone_number=0,
            slug='test_case',
            password='very_strong_psw'
        )

        self.user3 = Contact.objects.create_user(
            email='test@case3.test',
            first_name='user',
            last_name='user',
            phone_number=0,
            slug='test_case',
            password='very_strong_psw'
        )

        self.user4 = Contact.objects.create_user(
            email='test@case4.test',
            first_name='user',
            last_name='user',
            phone_number=0,
            slug='test_case',
            password='very_strong_psw'
        )

        self.chat1 = Chat.objects.create()
        self.chat1.participants.add(self.user1)
        self.chat1.participants.add(self.user2)
        ChatRef.objects.create(user=self.user2, chat=self.chat1)
        self.chat2 = Chat.objects.create(is_chat=False, creator=self.user1, name='123')
        self.chat2.participants.add(self.user1)
        self.user1.my_page.friends.add(self.user4)
        self.user1.my_page.blacklist.add(self.user3)


    def test_chat_creation_unauthenticated(self):
        '''Убедиться, что неавторизованные пользователи не могут создавать чаты'''
        response = get_response('/api/v1/chat/', 'post', data={"participants": []}, is_url=True) 
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_chat_list_unauthenticated(self):
        response = get_response('/api/v1/chat/', 'get', is_url=True) 
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_chat_update_by_creator(self):
        response = get_response('chat-detail', 'put', self.user1, {'name': '1234'}, {'pk': 2})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json.loads(response.content)['name'], '1234')

    def test_chat_add_user_not_by_owner(self):
        response = get_response('add-user', 'post', self.user2, kwargs={'pk': 2})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_chat_add_chat(self):
        response = get_response('add-user', 'post', self.user2, kwargs={'pk': 1})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_chat_add_user_not_friend(self):
        response = get_response('add-user', 'post', self.user1, {'participants': [2]}, {'pk': 2})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_chat_add_user_blacklisted(self):
        response = get_response('add-user', 'post', self.user1, {'participants': [3]}, {'pk': 2})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_chat_add(self):
        response = get_response('add-user', 'post', self.user1, {'participants': [4]}, {'pk': 2})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_chat_update_not_by_creator(self):
        self.chat2.participants.add(self.user2)
        response = get_response('chat-detail', 'put', self.user2, {'name': '1234'}, {'pk': 2})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_chat_update_not_by_random_user(self):
        response = get_response('chat-detail', 'put', self.user4, {'name': '1234'}, {'pk': 2})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_chat_ref_delete_wrong_user(self):
        response = get_response('chat-ref-detail', 'delete', self.user1, kwargs={'pk': 1})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_chat_ref_delete_by_owner(self):
        response = get_response('chat-ref-detail', 'delete', self.user2, kwargs={'pk': 1})
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_chat_ref_extra(self):
        response = get_response('chat-ref-list', 'post', self.user2, {'chat': 1})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_chat_ref_not_member(self):
        response = get_response('chat-ref-list', 'post', self.user3, {'chat': 1})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_chat_ref_list_authenticated(self):
        response = get_response('chat-ref-list', 'get', self.user2)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)