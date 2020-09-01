from django.test import TestCase
from mixer.backend.django import mixer

class TestModels(TestCase):

    def test_add_request_str(self):
        sender = mixer.blend('contact.Contact', email='sender@test.case')
        receiver = mixer.blend('contact.Contact', email='receiver@test.case')
        request = mixer.blend(
            'community.AddREquest', 
            sender=sender, 
            receiver=receiver
        )
        self.assertEqual(str(request), 'sender@test.case -> receiver@test.case')
