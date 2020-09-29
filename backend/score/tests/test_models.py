from mixer.backend.django import mixer
from django.test import TestCase

class TestModels(TestCase):
    
    def test_score_str(self):
        user = mixer.blend('contact.Contact', id=1)
        post = mixer.blend('feed.Post', id=1)
        score = mixer.blend('score.Score', user=user, post_id=post)
        self.assertEqual(str(score), '1 watched post 1')