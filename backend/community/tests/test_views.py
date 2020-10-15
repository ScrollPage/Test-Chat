from rest_framework.test import APITestCase
from rest_framework import status
import json

from contact.models import Contact
from community.models import AddRequest, UserInfo
from backend.service import get_response

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
            first_name='staff',
            last_name='staff',
            phone_number=0,
            slug='test_case',
            password='very_strong_psw',
        )

        self.user4 = Contact.objects.create_user(
            email='test4@case.test',
            first_name='staff',
            last_name='staff',
            phone_number=0,
            slug='test_case',
            password='very_strong_psw',
        )
        self.user1.my_page.blacklist.add(self.user4)

        UserInfo.objects.create(user=self.user1)

        Contact.objects.update(is_active=True)


    def test_retrieve_unauth(self):
        response = get_response('contact-detail', 'get', kwargs={'pk': 1})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_retrieve_auth(self):
        response = get_response('contact-detail', 'get', self.user1, kwargs={'pk': 1})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'test1@case.test')

    # def test_retrieve_blacklist(self):
    #     response = get_response('contact-detail', 'get', self.user4, kwargs={'pk': 1})
    #     self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_by_owner(self):
        response = get_response('contact-detail', 'patch', self.user1, {'phone_number': 234980}, {'pk': 1})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json.loads(response.content)['phone_number'], str(234980))

    def test_delete_by_owner(self):
        response = get_response('/api/v1/contact/1/', 'delete', self.user1, is_url=True)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_add_add_request_unauth(self):
        response = get_response('request-add', 'post', data={'receiver': 2})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_add_request_perm_himself(self):
        response = get_response('request-add', 'post', self.user1, data={'receiver': 1})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_add_request_perm_not_sent(self):
        AddRequest.objects.create(sender=self.user1, receiver=self.user2)
        response = get_response('request-add', 'post', self.user1, data={'receiver': 2})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_add_request_in_blacklist(self):
        self.user1.my_page.blacklist.add(self.user2)
        response = get_response('request-add', 'post', self.user2, data={'receiver': 1})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_add_request_perm_already_friends(self):
        self.user1.my_page.friends.add(self.user2)
        self.user2.my_page.friends.add(self.user1)
        response = get_response('request-add', 'post', self.user1, data = {'sender': 1, 'receiver': 2})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_remove_request_perm_no_request(self):
        response = get_response('request-remove', 'post', self.user1, data = {'sender': 1, 'receiver': 2})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_remove_request(self):
        AddRequest.objects.create(sender=self.user1, receiver=self.user2)
        response = get_response('request-remove', 'post', self.user1, data = {'sender': 1, 'receiver': 2})
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_add_friend(self):
        AddRequest.objects.create(sender=self.user1, receiver=self.user2)
        response = get_response('friends-add', 'post', self.user2, data = {'sender': 1, 'receiver': 2})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_add_friend_wrong_user(self):
        AddRequest.objects.create(sender=self.user1, receiver=self.user2)
        response = get_response('friends-add', 'post', self.user3, data = {'sender': 1, 'receiver': 2})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_remove_friend(self):
        self.user1.my_page.friends.add(self.user2)
        self.user2.my_page.friends.add(self.user1)
        response = get_response('friends-remove', 'post', self.user1, data = {'sender': 1, 'receiver': 2})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_remove_friend_wrong_user(self):
        self.user1.my_page.friends.add(self.user2)
        self.user2.my_page.friends.add(self.user1)
        response = get_response('friends-remove', 'post', self.user3, data = {'sender': 1, 'receiver': 2})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_remove_friend_not_friends(self):
        response = get_response('friends-remove', 'post', self.user1, data = {'sender': 1, 'receiver': 2})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_friends_list_unauth(self):
        response = get_response('contact-friends', 'get')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_friends_list_auth(self):
        self.user3.my_page.friends.add(self.user1)
        self.user3.my_page.friends.add(self.user2)
        response = get_response('contact-friends', 'get', self.user3)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_friends_list_auth_query(self):
        self.user3.my_page.friends.add(self.user1)
        self.user3.my_page.friends.add(self.user2)
        response = get_response('/api/v1/friends/?query_name=admin', 'get', self.user3, is_url=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_people_list_auth(self):
        response = get_response('people', 'get', self.user3)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)

    def test_people_list_auth_query(self):
        response = get_response('/api/v1/people/?query_name=user', 'get', self.user3, is_url=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_update_info_unauth(self):
        response = get_response('update-info', 'patch', kwargs={'pk': 1}, data={'city': 'Moscow'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_update_info_auth(self):
        response = get_response('update-info', 'put', self.user1, {'city': 'Moscow'}, {'pk': 1})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json.loads(response.content)['city'], 'Moscow')
    
    def test_update_info_wrong_user(self):
        response = get_response('update-info', 'put', self.user2, {'city': 'Moscow'}, {'pk': 1})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_info_create(self):
        response = get_response('create-info', 'post', data={'user': 1})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_info_create(self):
        response = get_response('create-info', 'post', data={'user': 2})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)