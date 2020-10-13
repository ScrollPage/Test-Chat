from django.test import TestCase

from django.urls import reverse, resolve

class TestUrls(TestCase):

    def test_post_comment(self):
        path = reverse('comment-post')
        self.assertEqual(resolve(path).view_name, 'comment-post')

    def test_photo_comment(self):
        path = reverse('comment-photo')
        self.assertEqual(resolve(path).view_name, 'comment-photo')