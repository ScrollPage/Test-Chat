from django.db import models

from contact.models import Contact

class Party(models.Model):
    '''Стандартная группа'''
    blacklist = models.ManyToManyField(Contact)
    image = models.ImageField(upload_to='group_avatars/%Y/%m/%d', blank=True)
    name = models.CharField(max_length=30)
    slug = models.SlugField(max_length=20)
    info = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    staff = models.ManyToManyField(Contact, related_name='some_related_name')
    admin = models.ForeignKey(Contact, related_name='some_related_name_2', on_delete=models.CASCADE)

    def __str__(self):
        return f'group {self.name}'

    class Meta:
        verbose_name = 'Группа'
        verbose_name_plural = 'Группы'