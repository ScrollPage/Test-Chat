from django.test import TestCase
from django.urls import reverse, resolve

class TestUrls(TestCase):

    def test_score_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('score-create')
        self.assertEqual(resolve(path).view_name, 'score-create')