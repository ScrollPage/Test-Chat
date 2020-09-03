from django.test import TestCase
from django.urls import resolve, reverse

class TestUrls(TestCase):

    def test_contact_friends_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('contact-friends', kwargs={'pk': 1})
        self.assertEqual(resolve(path).view_name, 'contact-friends')

    def test_friends_add_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('friends-add')
        self.assertEqual(resolve(path).view_name, 'friends-add')

    def test_friends_remove_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('friends-remove')
        self.assertEqual(resolve(path).view_name, 'friends-remove')
    
    def test_request_list_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('request-list')
        self.assertEqual(resolve(path).view_name, 'request-list')

    def test_contact_detail_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('contact-detail', kwargs={'pk': 1})
        self.assertEqual(resolve(path).view_name, 'contact-detail')

    