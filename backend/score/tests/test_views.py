from rest_framework.test import APITestCase
from rest_framework import status

from backend.service import get_response
from feed.models import Post
from contact.models import Contact

class TestViews(APITestCase):

    def setUp(self):
        self.user = Contact.objects.create_user(
            email='test@case.test1',
            first_name='Test',
            last_name='Case',
            phone_number=0,
            slug='test_case',
            password='very_strong_psw'
        )
        self.post = Post.objects.create(
            text='123',
            user=self.user,
            owner=self.user.my_page,
        )

    def test_score_create_auth(self):
        response = get_response('score-create', 'post', self.user, {'user': self.user, 'post_id': self.post})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_score_create_unauth(self):
        response = get_response('score-create', 'post')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_score_create_auth_bad_request(self):
        response1 = get_response('score-create', 'post', self.user, {'user': self.user})
        response2 = get_response('score-create', 'post', self.user, {'post_id': self.post})
        self.assertEqual(response1.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)