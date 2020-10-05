from rest_framework.test import APITestCase
from rest_framework import status
import json

from contact.models import Contact
from backend.service import get_response
from feed.models import Post, Comment, Like, RePost 
from parties.models import Party

class ContactTestCase(APITestCase):

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

        Contact.objects.all().update(is_active=True)

        self.user4 = Contact.objects.create_user(
            email='test4@case.test',
            first_name='user',
            last_name='user',
            phone_number=0,
            slug='test_case',
            password='very_strong_psw',
        )

        self.group = Party.objects.create(
            name='123',
            slug='123',
            info='123',
            admin=self.user1,
        )

        self.group.members.add(self.user3.my_page)
        self.group.blacklist.add(self.user4)

        self.post = Post.objects.create(
            user=self.user1,
            text='123',
            owner=self.user1.my_page,
        )

        self.comment = Comment.objects.create(
            user=self.user1,
            text='123',
            post_id=self.post
        )

        self.group_post = Post.objects.create(
            text='123',
            user=self.user2,
            group_owner=self.group,
        )

        self.user1.my_page.blacklist.add(self.user4)

    def test_post_create_unauth(self):
        response = get_response('/api/v1/post/', 'post', data={'text': '123'}, is_url=True)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post_create_auth(self):
        response = get_response('/api/v1/post/', 'post', self.user1, {'text': '123'}, is_url=True)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(json.loads(response.content)['text'], '123')

    def test_post_update_in_blacklist(self):
        self.group.blacklist.add(self.user1)
        response = get_response('post-detail', 'patch', self.user1, {'text': '123'}, {'pk': 2})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_post_delete_in_blacklist(self):
        self.group.blacklist.add(self.user1)
        response = get_response('post-detail', 'delete', self.user1, kwargs={'pk': 2})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_post_delete_right_user(self):
        response = get_response('post-detail', 'delete', self.user1, kwargs={'pk': 1})
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_post_delete_wrong_user(self):
        response = get_response('post-detail', 'delete', self.user2, kwargs={'pk': 1})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_post_update_right_user(self):
        response = get_response('post-detail', 'patch', self.user1, {'text': 1234}, {'pk': 1})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json.loads(response.content)['text'], '1234')

    def post_delete_by_owner(self):
        response = get_rsponse('post-detail', 'delete', self.user3, kwargs={'pk': 1})
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_comment_create_unauth(self):
        response = get_response('/api/v1/comment/', 'post', is_url=True)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_comment_create_auth(self):
        response = get_response(
            '/api/v1/comment/', 
            'post', 
            self.user1, 
            {'post_id': 1, 'text': '123'}, 
            is_url=True
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_comment_update_by_owner(self):
        response = get_response('comment-detail', 'patch', self.user1, {'text': '1234'}, {'pk': 1})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json.loads(response.content)['text'], '1234')

    def test_comment_update_not_by_owner(self):
        response = get_response('comment-detail', 'patch', self.user2, {'text': '1234'}, {'pk': 1})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_comment_create_in_blacklist(self):
        response = get_response('comment-list', 'post', self.user4, data={'text': '123', 'post_id': 1})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_comment_update_after_blacklisted(self):
        Comment.objects.create(user=self.user2, text='123', post_id=self.post)
        self.user1.my_page.blacklist.add(self.user2)
        response = get_response('comment-detail', 'patch', self.user2, {'text':'1234'}, {'pk': 2})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_comment_delete_after_blacklisted(self):
        Comment.objects.create(user=self.user2, text='123', post_id=self.post)
        self.user1.my_page.blacklist.add(self.user2)
        response = get_response('comment-detail', 'delete', self.user2, kwargs={'pk': 2})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_like_create(self):
        response = get_response('like-add', 'post', self.user1, {'post_id': 1})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_like_create_already_created(self):
        Like.objects.create(user=self.user1, post_id=self.post)
        response = get_response('like-add', 'post', self.user1, {'post_id': 1})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_like_create_in_blacklist(self):
        response = get_response('like-add', 'post', self.user4, {'post_id': 1})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_like_create_in_group_blacklist(self):
        response = get_response('like-add', 'post', self.user4, {'post_id': self.group_post.id})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_like_remove(self):
        Like.objects.create(user=self.user1, post_id=self.post)
        response = get_response('like-remove', 'post', self.user1, {'post_id': 1})
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_like_remove_not_created(self):
        response = get_response('like-remove', 'post', self.user1, {'post_id': 1})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_like_remove_in_blacklist(self):
        Like.objects.create(user=self.user2, post_id=self.post)
        self.user1.my_page.blacklist.add(self.user2)
        response = get_response('like-remove', 'post', self.user2, {'post_id': 1})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_repost_unauth(self):
        response = get_response('/api/v1/repost/', 'post', data={'parent': 1, 'owner': 1}, is_url=True)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_repost_group_blacklist(self):
        reponse = get_response('/api/v1/repost/', 'post', self.user4, {'parent': 2, 'owner': 4}, is_url=True)
        self.assertEqual(reponse.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_repost_owner_blacklist(self):
        reponse = get_response('/api/v1/repost/', 'post', self.user4, {'parent': 1, 'owner': 4}, is_url=True)
        self.assertEqual(reponse.status_code, status.HTTP_403_FORBIDDEN)

    def test_feed_unauth(self):
        response = get_response('feed', 'get')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_feed_auth(self):
        response = get_response('feed', 'get', self.user1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)