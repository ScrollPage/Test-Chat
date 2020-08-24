from django.test import TestCase
from django.urls import reverse, resolve

class TestUrls(TestCase):

    def test_chat_list_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('chat-list')
        self.assertEqual(resolve(path).view_name, 'chat-list')

    def test_chat_retrieve_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('chat-detail', kwargs={'pk': 1})
        self.assertEqual(resolve(path).view_name, 'chat-detail')
