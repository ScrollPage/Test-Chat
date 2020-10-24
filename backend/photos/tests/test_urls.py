from django.test import TestCase
from django.urls import reverse, resolve

class TestUrls(TestCase):

    def test_photo_list(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('photo-list')
        self.assertEqual(resolve(path).view_name, 'photo-list')

    def test_photo_detail(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('photo-detail', kwargs={'pk': 1})
        self.assertEqual(resolve(path).view_name, 'photo-detail')