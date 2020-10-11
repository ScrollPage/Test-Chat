from django.test import TestCase
from django.urls import reverse, resolve

class TestUrls(TestCase):

    def test_post_like_add(self):
        path = reverse('post-like-add')
        self.assertEqual(resolve(path).view_name, 'post-like-add')

    def test_post_like_remove(self):
        path = reverse('post-like-remove')
        self.assertEqual(resolve(path).view_name, 'post-like-remove')

    def test_comment_like_add(self):
        path = reverse('comment-like-add')
        self.assertEqual(resolve(path).view_name, 'comment-like-add')

    def test_comment_like_remove(self):
        path = reverse('comment-like-remove')
        self.assertEqual(resolve(path).view_name, 'comment-like-remove')

    def test_photo_like_add(self):
        path = reverse('photo-like-add')
        self.assertEqual(resolve(path).view_name, 'photo-like-add')

    def test_photo_like_remove(self):
        path = reverse('photo-like-remove')
        self.assertEqual(resolve(path).view_name, 'photo-like-remove')