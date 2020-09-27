from django.db import models

from contact.models import Contact
from feed.models import Post

class Party(models.Model):
    '''Стандартная группа'''
    members = models.ManyToManyField(Contact, related_name='parties')
    blacklist = models.ManyToManyField(Contact)
    image = models.ImageField(upload_to='group_avatars/%Y/%m/%d', blank=True)
    name = models.CharField(max_length=50)
    slug = models.CharField(max_length=20)
    info = models.TextField()
    posts = models.ManyToManyField(Post)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Группа'
        verbose_name_plural = 'Группы'