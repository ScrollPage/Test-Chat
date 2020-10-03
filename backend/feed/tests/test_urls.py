from django.test import TestCase
from django.urls import resolve, reverse

class TestUrls(TestCase):

    def test_like_add_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('like-add')
        self.assertEqual(resolve(path).view_name, 'like-add')

    def test_like_remove_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('like-remove')
        self.assertEqual(resolve(path).view_name, 'like-remove')

    def test_post_list_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('post-list')
        self.assertEqual(resolve(path).view_name, 'post-list')
    
    def test_post_detail_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('post-detail', kwargs={'pk': 1})
        self.assertEqual(resolve(path).view_name, 'post-detail')

    def test_comment_list_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('comment-list')
        self.assertEqual(resolve(path).view_name, 'comment-list')
    
    def test_comment_detail_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('comment-detail', kwargs={'pk': 1})
        self.assertEqual(resolve(path).view_name, 'comment-detail')

    def test_feed_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('feed')
        self.assertEqual(resolve(path).view_name, 'feed')