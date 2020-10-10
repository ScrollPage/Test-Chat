from django.test import TestCase
from django.urls import resolve, reverse

class TestUrls(TestCase):

    def test_post_list_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('post-list')
        self.assertEqual(resolve(path).view_name, 'post-list')
    
    def test_post_detail_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('post-detail', kwargs={'pk': 1})
        self.assertEqual(resolve(path).view_name, 'post-detail')

    def test_feed_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('feed')
        self.assertEqual(resolve(path).view_name, 'feed')

    def test_repost_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('repost-list')
        self.assertEqual(resolve(path).view_name, 'repost-list')