from mixer.backend.django import mixer
from django.test import TestCase

class TestModels(TestCase):

    def test_contact_str(self):
        contact = mixer.blend('contact.Contact', email='test@case.test')
        self.assertEqual(str(contact), 'test@case.test')

    def test_token_str(self):
        token = mixer.blend('contact.MyToken', token='testtoken')
        self.assertEqual(str(token), 'testtoken')

    def test_contact_counter_str(self):
        counter = mixer.blend('contact.ContactCounter')
        self.assertEqual(str(counter), '0')