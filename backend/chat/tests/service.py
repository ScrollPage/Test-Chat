from django.contrib.auth.models import User
from django.urls import reverse
import requests

def create_user(self, username='test'):
    url = reverse('register')
    data = {'username': username, 'email': '', 'password': 'qwerasdfzxcv1234'}
    response = self.client.post(url, data, format='json')
    return User.objects.last()

def get_header(url):
    '''Необходимо создать своего супер-пользователя'''
    data = {'username': 'admin', 'password': 'admin'}
    r = requests.post(url, data)
    return {'Authorization': f"Token {r.json()['access']}"}