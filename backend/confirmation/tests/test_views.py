from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User

from confirmation.models import MyToken

class TestViews(APITestCase):

    def test_create_account(self):
        '''Убедиться, что мы можем создавать пользователей'''
        url = reverse('register')
        data = {'username': 'DabApps', 'email': '', 'password': 'qwerasdfzxcv1234'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.last().username, 'DabApps')

    def test_activation(self):
        '''Убедиться, что мы можем активировать аккаунты'''
        url = reverse('register')
        data = {'username': 'DabApps', 'email': '', 'password': 'qwerasdfzxcv1234'}
        response = self.client.post(url, data, format='json')
        url = reverse('activate')
        user = User.objects.get(id=1)
        token = MyToken.objects.get(user=user).token
        data = {'token': token}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)