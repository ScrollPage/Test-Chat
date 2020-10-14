from mixer.backend.django import mixer
from django.test import TestCase

from comments.models import Comment

class TestModels(TestCase):

    def setUp(self):
        self.comment = mixer.blend('comments.Comment')

    def test_comment_str(self):
        self.assertEqual(str(self.comment), '1')
    
    def test_comment_get_type(self):
        self.assertEqual(self.comment.get_type(), 'comment')