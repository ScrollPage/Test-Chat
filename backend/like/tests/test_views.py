from rest_framework.test import APITestCase
from rest_framework import status

from backend.service import get_response
from contact.models import Contact
from feed.models import Post
from comments.models import Comment
from parties.models import Party
from like.models import Like

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
        self.user1.my_page.blacklist.add(self.user3)

        self.post = Post.objects.create(
            user=self.user1,
            owner=self.user1.my_page,
            text='123'
        )
        like = Like.objects.create(
            user=self.user2
        )
        self.post.likes.add(like)

        self.comment = Comment.objects.create(
            user=self.user2,
            text='123'
        )
        self.post.comments.add(self.comment)

        self.group = Party.objects.create(
            admin=self.user1,
            name='123',
            info='123',
        )

        self.group.blacklist.add(self.user2)

        self.group_post = Post.objects.create(
            group_owner=self.group,
            user=self.user1,
            text='123'
        )

    def test_post_like_add_unauth(self):
        response = get_response('post-like-add', 'post', data={'some_id': 1})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post_like_add_auth(self):
        response = get_response('post-like-add', 'post', self.user1, {'some_id': 1})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_post_like_add_blacklist_group(self):
        response = get_response('post-like-add', 'post', self.user2, {'some_id': 2})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_post_like_add_blacklist(self):
        response = get_response('post-like-add', 'post', self.user3, {'some_id': 1})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_comment_like_add(self):
        response = get_response('comment-like-add', 'post', self.user2, {'some_id': 1})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_comment_like_remove(self):
        like = Like.objects.create(
            user=self.user2
        )
        self.comment.likes.add(like)
        response = get_response('comment-like-remove', 'post', self.user2, {'some_id': 1})
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    