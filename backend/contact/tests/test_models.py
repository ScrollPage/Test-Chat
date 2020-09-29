from mixer.backend.django import mixer
from django.test import TestCase

from contact.models import ContactCounter, Contact

class TestModels(TestCase):

    def test_contact_str(self):
        contact = mixer.blend('contact.Contact')
        self.assertEqual(str(contact), '1')

    def test_token_str(self):
        token = mixer.blend('contact.MyToken', token='testtoken')
        self.assertEqual(str(token), 'testtoken')

    def test_contact_counter_str(self):
        counter = mixer.blend('contact.ContactCounter')
        self.assertEqual(str(counter), '0')