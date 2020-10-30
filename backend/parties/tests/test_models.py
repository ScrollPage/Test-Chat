from django.test import TestCase
from mixer.backend.django import mixer

from contact.models import Contact
from community.models import UserInfo

class TestModels(TestCase):

    def test_party_str(self):
        group = mixer.blend('parties.Party', name='123')
        self.assertEqual(str(group),'group 123')