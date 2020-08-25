from django.test import TestCase
from django.urls import reverse, resolve

class TestUrls(TestCase):

    def test_registration_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('register')
        self.assertEqual(resolve(path).view_name, 'register')
    
    def test_activation_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('activate')
        self.assertEqual(resolve(path).view_name, 'activate')