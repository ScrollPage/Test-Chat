from mixer.backend.django import mixer
from django.test import TestCase

from contact.models import Contact

class TestModels(TestCase):

    def setUp(self):
        self.user = Contact.objects.create_user(
            email='test@case.test1',
            first_name='Test',
            last_name='Case',
            phone_number=0,
            slug='test_case',
            password='very_strong_psw'
        )

    def test_photo_str(self):
        photo = mixer.blend('photos.Photo', user=self.user.my_page)
        self.assertEqual(str(photo), "1 owner's picture")