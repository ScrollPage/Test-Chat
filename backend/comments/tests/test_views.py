from rest_framework.test import APITestCase
from rest_framework import status

from feed.models import Post
from comments.models import Comment
from contact.models import Contact
from backend.service import get_response
from photos.models import Photo

class TestViews(APITestCase):

    def setUp(self):

        self.user1 = Contact.objects.create_user(
            email='test1@case.test',
            first_name='admin',
            last_name='admin',
            phone_number=0,
            slug='test_case',
            password='very_strong_psw',
        )

        self.user2 = Contact.objects.create_user(
            email='test2@case.test',
            first_name='user',
            last_name='user',
            phone_number=0,
            slug='test_case',
            password='very_strong_psw',
        )

        self.user3 = Contact.objects.create_user(
            email='test3@case.test',
            first_name='user',
            last_name='user',
            phone_number=0,
            slug='test_case',
            password='very_strong_psw',
        )

        self.user1.my_page.blacklist.add(self.user2)

        Contact.objects.all().update(is_active=True)

        self.post1 = Post.objects.create(
            user=self.user1, 
            owner=self.user1.my_page,
            text='123'
        )

        self.post2 = Post.objects.create(
            user=self.user1, 
            owner=self.user1.my_page,
            text='123',
            published=False
        )

        self.comment = Comment.objects.create(
            user=self.user1,
            text='123'
        )
        self.post1.comments.add(self.comment)

        self.photo = Photo.objects.create(
            owner=self.user1.my_page,
        )

    def test_comment_post_create_unauth(self):
        response = get_response('comment-post', 'post', data={'id': 1, 'text': '123'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_comment_post_create_auth(self):
        response = get_response('comment-post', 'post', self.user1, {'id': 1, 'text': '123'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_comment_post_create_blacklist(self):
        response = get_response('comment-post', 'post', self.user2, {'id': 1, 'text': '123'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_comment_post_create_wrong_parent(self):
        response = get_response('comment-post', 'post', self.user3, {'id': 2, 'text': '123', 'parent': 1})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_comment_post_create_parent(self):
        response = get_response('comment-post', 'post', self.user3, {'id': 1, 'text': '123', 'parent': 1})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_comment_delete_wrong_user(self):
        response = get_response('comment-detail', 'delete', self.user3, kwargs={'pk': 1})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_comment_delete(self):
        response = get_response('comment-detail', 'delete', self.user1, kwargs={'pk': 1})
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_comment_post_create_unpublished(self):
        response = get_response('comment-post', 'post', self.user1, {'id': 2, 'text': '123'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_comment_photo_create(self):
        response = get_response('comment-photo','post', self.user3, {'id': 1, 'text': '123'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_comment_photo_blacklist(self):
        response = get_response('comment-photo','post', self.user2, {'id': 1, 'text': '123'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)