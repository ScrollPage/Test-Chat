from django.db import models
from django.utils import timezone

from contact.models import Contact

class Notice(models.Model):
    '''Модель уведомления'''
    NEW_FRIEND_REQUEST = 1
    NEW_FRIEND_ADDED = 2
    NEW_LIKE = 3
    NEW_REPOST = 4

    CHOICES = (
        (NEW_FRIEND_REQUEST, 'new_friend'),
        (NEW_FRIEND_ADDED, 'added_friend'),
        (NEW_LIKE, 'like'),
        (NEW_REPOST, 'repost'),
    )

    receiver = models.ForeignKey(Contact, on_delete = models.CASCADE, related_name='notifications')
    sender = models.ForeignKey(Contact, on_delete=models.CASCADE)
    event = models.CharField(max_length=20, choices=CHOICES)
    seen = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.sender} sends to {self.receiver}. event: {self.event}'

    class Meta:
        verbose_name = 'Уведомление'
        verbose_name_plural = 'Уведомления'

