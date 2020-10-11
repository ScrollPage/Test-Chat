from mixer.backend.django import mixer
from django.test import TestCase

from contact.models import Contact
from feed.models import Post

class TestModels(TestCase):

    def setUp(self):
        self.user = Contact.objects.create_user(
            email='test@case.test1',
            first_name='Test',
            last_name='Case',
            phone_number=0,
            slug='test_case',
            password='very_strong_psw'
        )

    def test_like_str(self):
        like = mixer.blend('like.Like', user=self.user)
        self.assertEqual(str(like), '1 user likes something')