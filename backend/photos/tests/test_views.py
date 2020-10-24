from rest_framework.test import APITestCase
from rest_framework import status

from backend.service import get_response
from photos.models import Photo
from contact.models import Contact

class TestViews(APITestCase):

    def setUp(self):
        self.user1 = Contact.objects.create_user(
            email='test@case.test1',
            first_name='Test',
            last_name='Case',
            phone_number=0,
            slug='test_case',
            password='very_strong_psw'
        )

        self.user2 = Contact.objects.create_user(
            email='test@case.test2',
            first_name='Test',
            last_name='Case',
            phone_number=0,
            slug='test_case',
            password='very_strong_psw'
        )

        self.user3 = Contact.objects.create_user(
            email='test@case.test3',
            first_name='Test',
            last_name='Case',
            phone_number=0,
            slug='test_case',
            password='very_strong_psw'
        )

        Contact.objects.all().update(is_active=True)

        Photo.objects.create(owner=self.user1.my_page)
        self.user1.my_page.blacklist.add(self.user2)

    def test_list_unauth(self):
        response = get_response('photo-list', 'get')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_auth(self):
        response = get_response('photo-list', 'get', self.user1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_list_in_blacklist(self):
        response = get_response('/api/v1/photo/?user_id=1', 'get', self.user2, is_url=True)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_in_blacklist(self):
        response = get_response('photo-detail', 'get', self.user2, kwargs={'pk': 1})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)