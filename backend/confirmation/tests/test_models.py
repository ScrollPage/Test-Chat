from mixer.backend.django import mixer
from django.test import TestCase

class TestModels(TestCase):

    def test_token_str(self):
        '''Убедиться, что токен создается и выводится правильно'''
        token = mixer.blend('confirmation.MyToken', token='token')
        self.assertEqual(str(token), 'token')