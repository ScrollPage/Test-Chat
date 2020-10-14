from rest_framework.test import APITestCase
from rest_framework import status

from backend.service import get_response
from feed.models import Post
from contact.models import Contact
from score.models import Score

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

    def test_score_create_already_created(self):
        Score.objects.create(
            user=self.user,
            post_id=self.post
        )
        response = get_response('score-create', 'post', self.user, {'post_id': self.post.id})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)