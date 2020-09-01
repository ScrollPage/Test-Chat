from rest_framework.test import APITestCase
from rest_framework import status

class RegisrationTestCase(APITestCase):

    def test_registration(self):
        '''Создается ли пользователь'''
        url = '/api/v1/register/'
        data = {
            "email": 'test@case.test',
            "password": 'very_strong_pass',
            "first_name": 'Test',
            "last_name": 'Case',
            "phone_number": 90909090
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)