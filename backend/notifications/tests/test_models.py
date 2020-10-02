from mixer.backend.django import mixer
from django.test import TestCase

from contact.models import Contact

class TestMOdels(TestCase):

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


    def test_note_str(self):
        note = mixer.blend(
            'notifications.Notice',
            receiver = self.user2,
            sender = self.user1,
            event = 1
        )
        self.assertEqual(str(note), '1 sends to 2. event: 1')