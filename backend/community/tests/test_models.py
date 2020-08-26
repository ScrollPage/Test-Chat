from mixer.backend.django import mixer
from django.test import TestCase

from chat.tests.service import create_user
from community.models import AddRequest

class TestModels(TestCase):

    def test_request_str(self):
        user_1 = create_user(self, 'test1')
        user_2 = create_user(self, 'test2')
        contact_1 = mixer.blend('chat.Contact', user=user_1)
        contact_2 = mixer.blend('chat.Contact', user=user_2)
        request = mixer.blend(
            'community.AddRequest', 
            sender=contact_1, 
            receiver=contact_2
        )
        self.assertEqual(str(request), 'test1 -> test2')