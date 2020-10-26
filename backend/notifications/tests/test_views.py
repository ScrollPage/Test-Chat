from rest_framework import status
from rest_framework.test import APITestCase
import json

from notifications.models import Notice
from contact.models import Contact
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
            first_name='admin',
            last_name='admin',
            phone_number=0,
            slug='test_case',
            password='very_strong_psw'
        )

        Notice.objects.create(receiver=self.user1, sender=self.user2, seen=False)

    def test_notes_unauth(self):
        response = get_response('notifications', 'get')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_notes_auth(self):
        response = get_response('notifications', 'get', self.user1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_notes_update(self):
        response = get_response('notifications', 'put', self.user1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
