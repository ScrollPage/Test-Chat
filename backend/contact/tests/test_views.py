from rest_framework.test import APITestCase
from rest_framework import status

from contact.models import MyToken, Contact
from backend.service import get_response

class RegisrationTestCase(APITestCase):

    def setUp(self):
        self.user1 = Contact.objects.create_user(
            email='test@case.test1',
            first_name='Test',
            last_name='Case',
            phone_number=0,
            slug='test_case',
            password='very_strong_psw'
        )

        self.user2 = Contact.objects.create_user(
            email='test@case.test2',
            first_name='Test',
            last_name='Case',
            phone_number=0,
            slug='test_case',
            password='very_strong_psw'
        )

    def test_registration_view(self):
        '''Создается ли пользователь'''
        url = '/api/v1/register/'
        data = {
            "email": 'test@case.test',
            "password": 'very_strong_pass',
            "first_name": 'Test',
            "last_name": 'Case',
            "phone_number": 90909090
        }
        response = get_response('register', 'post', data=data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_activation_view(self):
        token = MyToken.objects.get(user=self.user1).token
        response = get_response('activate', 'post', data={'token': token})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_wrong_activation_view(self):
        token = MyToken.objects.get(user=self.user2).token
        response = get_response('activate', 'post', data={'token': token[:-1]})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)