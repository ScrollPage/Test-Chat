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

    def test_chat_ref_retrieve_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('chat-ref-detail', kwargs={'pk': 1})
        self.assertEqual(resolve(path).view_name, 'chat-ref-detail')

    def test_chat_ref_list_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('chat-ref-list')
        self.assertEqual(resolve(path).view_name, 'chat-ref-list')

    def test_chat_add_user_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('add-user', kwargs={'pk': 1})
        self.assertEqual(resolve(path).view_name, 'add-user')

    def test_read_messages_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('read-messages', kwargs={'pk': 1})
        self.assertEqual(resolve(path).view_name, 'read-messages')

    def test_chat_remove_user_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('remove-user', kwargs={'pk': 1})
        self.assertEqual(resolve(path).view_name, 'remove-user')