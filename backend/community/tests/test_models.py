from django.test import TestCase
from mixer.backend.django import mixer

from contact.models import Contact
from community.models import UserInfo

class TestModels(TestCase):

    def setUp(self):
        self.admin = Contact.objects.create_user(
            email='test@case1.test',
            first_name='admin',
            last_name='admin',
            phone_number=0,
            slug='test_case',
            password='very_strong_psw'
        )

        self.user = Contact.objects.create_user(
            email='test@case2.test',
            first_name='user',
            last_name='user',
            phone_number=0,
            slug='test_case',
            password='very_strong_psw'
        )

    def test_add_request_str(self):
        request = mixer.blend(
            'community.AddRequest', 
            sender=self.admin, 
            receiver=self.user
        )
        self.assertEqual(str(request), '1 -> 2')

    def test_page_str(self):
        self.assertEqual(str(self.user.my_page), "2's page")

    def test_user_info_str(self):
        info = mixer.blend('community.UserInfo', user=self.admin)
        self.assertEqual(str(info), 'info about 1')