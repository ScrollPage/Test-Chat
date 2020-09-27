from django.db import models

from contact.models import Contact

class Notice(models.Model):
    '''Модель уведомления'''
    NEW_MESSAGE = 1
    NEW_FRIEND_REQUEST = 2
    NEW_FRIEND_ADDED = 3
    NEW_LIKE = 4
    NEW_REPOST = 5

    CHOICES = (
        (NEW_MESSAGE, 'message'),
        (NEW_FRIEND_REQUEST, 'new_friend'),
        (NEW_FRIEND_ADDED, 'added_friend'),
        (NEW_LIKE, 'like'),
        (NEW_REPOST, 'repost'),
    )

    receiver = models.ForeignKey(Contact, on_delete = models.CASCADE, related_name='notifications')
    sender = models.ForeignKey(Contact, on_delete=models.CASCADE)
    event = models.CharField(max_length=10, choices=CHOICES)
    seen = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.sender} sends to {self.receiver}. event: {self.event}'

    class Meta:
        verbose_name = 'Уведомление'
        verbose_name_plural = 'Уведомления'

