from django.test import TestCase
from django.urls import reverse, resolve

class TestUrls(TestCase):

    def test_email_activation_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('email-activation')
        self.assertEqual(resolve(path).view_name, 'email-activation')

    def test_phone_activation_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('phone-activation')
        self.assertEqual(resolve(path).view_name, 'phone-activation')

    def test_avatar_change_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('avatar-change')
        self.assertEqual(resolve(path).view_name, 'avatar-change')

    def test_me_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('me')
        self.assertEqual(resolve(path).view_name, 'me')

    def test_registration_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('register')
        self.assertEqual(resolve(path).view_name, 'register')

