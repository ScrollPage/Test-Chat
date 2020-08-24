from mixer.backend.django import mixer
from django.test import TestCase

from .service import create_user

class TestModels(TestCase):

    def test_contact_str(self):
        '''Убедиться, что контакт создается и выводится правильно'''
        user = create_user(self)
        contact = mixer.blend('chat.Contact', user=user)
        self.assertEqual(str(contact), 'test')

    def test_message_url(self):
        user = create_user(self)
        contact = mixer.blend('chat.Contact', user=user)
        message = mixer.blend('chat.Message', contact=contact) 
        self.assertEqual(str(message), 'test')      

    def test_chat_str(self):
        '''Убедиться, что контакт создается и выводится правильно'''
        chat = mixer.blend('chat.Chat')
        self.assertEqual(str(chat), '1')