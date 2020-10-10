from mixer.backend.django import mixer
from django.test import TestCase

from feed.models import Post
from contact.models import Contact

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
        self.post = Post.objects.create(user=self.user, text='123')

    def test_post_str(self):
        self.assertEqual(str(self.post), '1')

    def test_repost_str(self):
        repost = mixer.blend('feed.RePost', user=self.user, post_id=self.post)
        self.assertEqual(str(repost), '1 user reposts 1 post')