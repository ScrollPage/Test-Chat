from mixer.backend.django import mixer
from django.test import TestCase

from contact.models import ContactCounter

class TestSignals(TestCase):

    def setUp(self):
        ContactCounter.objects.create()

    def test_counter_inc(self):
        '''Увеличивается ли счетчик'''
        contact = mixer.blend('contact.Contact')
        self.assertEqual(ContactCounter.objects.get(id=1).counter, 1)
