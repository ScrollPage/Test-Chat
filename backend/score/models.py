from django.db import models

from feed.models import Post
from contact.models import Contact 

class Score(models.Model):
    '''Модель просмотра'''
    user = models.ForeignKey(Contact, on_delete=models.CASCADE)
    post_id = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='reviews')

    def __str__(self):
        return f'{self.user} watched post {self.post_id}'

    class Meta:
        verbose_name = 'Просмотр'
        verbose_name_plural = 'Просмотры'