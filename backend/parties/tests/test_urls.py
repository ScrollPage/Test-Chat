from django.test import TestCase
from django.urls import reverse, resolve

class TestUrls(TestCase):

    def test_group_join_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('group-join', kwargs={'pk': 1})
        self.assertEqual(resolve(path).view_name, 'group-join')

    def test_group_leave_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('group-leave', kwargs={'pk': 1})
        self.assertEqual(resolve(path).view_name, 'group-leave')

    def test_group_staff_add_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('group-staff-add', kwargs={'pk': 1})
        self.assertEqual(resolve(path).view_name, 'group-staff-add')

    def test_group_staff_remove_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('group-staff-remove',kwargs={'pk': 1})
        self.assertEqual(resolve(path).view_name, 'group-staff-remove')

    def test_group_blacklist_remove_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('group-blacklist-add', kwargs={'pk': 1})
        self.assertEqual(resolve(path).view_name, 'group-blacklist-add')

    def test_group_blacklist_add_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('group-blacklist-remove', kwargs={'pk': 1})
        self.assertEqual(resolve(path).view_name, 'group-blacklist-remove')

    def test_group_offer_post_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('group-offer-post', kwargs={'pk': 1})
        self.assertEqual(resolve(path).view_name, 'group-offer-post')

    def test_group_accept_post_url(self):
        '''Убедиться, что ссылка и вью связаны правильно'''
        path = reverse('group-offer-post', kwargs={'pk': 1})
        self.assertEqual(resolve(path).view_name, 'group-offer-post')

    def test_group_list_url(self):
        '''Убедиться, что ссылка и вью связаны правльно'''
        path = reverse('group-list')
        self.assertEqual(resolve(path).view_name, 'group-list')

    def test_group_retrieve_url(self):
        '''Убедиться, что ссылка и вью связаны правльно'''
        path = reverse('group-detail', kwargs={'pk': 1})
        self.assertEqual(resolve(path).view_name, 'group-detail')