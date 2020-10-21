from django.test import TestCase
from django.urls import reverse, resolve

class TestUrls(TestCase):

    def test_notifications_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('notifications')
        self.assertEqual(resolve(path).view_name, 'notifications')