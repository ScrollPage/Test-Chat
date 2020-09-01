from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
import json

from contact.models import Contact

class ContactTestCase(APITestCase):

    def setUp(self):
        self.user1 = Contact.objects.create_user(
            email='test1@case.test',
            first_name='Test',
            last_name='Case',
            phone_number=0,
            slug='test_case',
            password='very_strong_psw'
        )
        self.user2 = Contact.objects.create_user(
            email='test2@case.test',
            first_name='Test',
            last_name='Case',
            phone_number=0,
            slug='test_case',
            password='very_strong_psw'
        )

    def test_retrieve_unauth(self):
        url = '/api/v1/contact/1/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_retrieve_auth(self):
        self.client.force_authenticate(user=self.user1)
        url = reverse('contact-detail', kwargs={'pk': 1})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'test1@case.test')

    def test_update_by_owner(self):
        self.client.force_authenticate(user=self.user1)
        url = reverse('contact-detail', kwargs={'pk': 1})
        data = {
            'email': 'test1@case.test', 
            'slug': 'idNone', 
            'first_name': 'NewTest', 
            'last_name': 'NewCase',
            'phone_number': 234980,
            'avatar': '',
            'status': ''
        }
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json.loads(response.content)['first_name'], 'NewTest')

    # def test_update_by_random_user(self):
    #     self.client.force_authenticate(user=self.user2)
    #     url = reverse('contact-detail', kwargs={'pk': 2})
    #     data = {
    #         'email': 'test1@case.test',
    #         'slug': 'idNone',
    #         'first_name': 'NewTest', 
    #         'last_name': 'NewCase',
    #         'phone_number': 234980,
    #         'avatar': '',
    #         'status': ''
    #     }
    #     response = self.client.put(url, data)
    #     self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

