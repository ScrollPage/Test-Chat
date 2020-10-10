from django.db import models

from contact.models import Contact

class Like(models.Model):
    '''Стандартный лайк'''
    user = models.ForeignKey(Contact, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.user} user likes something'

    class Meta:
        verbose_name = 'Лайк'
        verbose_name_plural = 'Лайки'