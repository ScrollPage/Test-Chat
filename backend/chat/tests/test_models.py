from mixer.backend.django import mixer
from django.test import TestCase

class TestModels(TestCase):

    def test_message_str(self):
        'Убедиться, что сообщение создается и выводится правильно'
        contact = mixer.blend('contact.Contact', slug='test')
        message = mixer.blend('chat.Message', contact=contact) 
        self.assertEqual(str(message), 'test')

    def test_chat_str(self):
        '''Убедиться, что контакт создается и выводится правильно'''
        chat = mixer.blend('chat.Chat')
        self.assertEqual(str(chat), '1')