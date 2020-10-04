from rest_framework.test import APITestCase
from rest_framework import status

from contact.models import MyToken, Contact, Code
from backend.service import get_response

class RegisrationTestCase(APITestCase):

    def setUp(self):
        self.user1 = Contact.objects.create(
            email='test@case.test1',
            first_name='Test',
            last_name='Case',
            phone_number=0,
            slug='test_case',
            password='very_strong_psw',
            activation_type='phone'
        )

        self.user2 = Contact.objects.create(
            email='test@case.test2',
            first_name='Test',
            last_name='Case',
            phone_number=0,
            slug='test_case',
            password='very_strong_psw',
            activation_type='email'
        )

    def test_registration_view(self):
        '''Создается ли пользователь'''
        url = '/api/v1/register/'
        data = {
            "email": 'test@case.test',
            "password": 'very_strong_pass',
            "first_name": 'Test',
            "last_name": 'Case',
            "phone_number": 90909090,
            'activation_type': 'email'
        }
        response = get_response('register', 'post', data=data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_email_activation_view(self):
        token = MyToken.objects.get(user=self.user2).token
        response = get_response('email-activation', 'post', data={'token': token})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_phone_activation_view(self):
        code = Code.objects.get(user=self.user1).code
        response = get_response('phone-activation', 'post', data={'code': code})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_email_activation_view_wrong(self):
        token = MyToken.objects.get(user=self.user2).token
        response = get_response('email-activation', 'post', data={'token': token[1:]})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_phone_activation_view_wrong(self):
        code = Code.objects.get(user=self.user1).code
        response = get_response('phone-activation', 'post', data={'code': str(code)[1:]})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_me_view_unauth(self):
        response = get_response('me', 'get')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_view_auth(self):
        response = get_response('me', 'get', self.user1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'test@case.test1')