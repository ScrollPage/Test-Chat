from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from contact.models import Contact
from parties.models import Party

class AddRequest(models.Model):
    sender = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name = 'invited', null=True)
    receiver = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name='invites', null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.sender} -> {self.receiver}'

    class Meta:
        verbose_name = 'Запрос на добавление'
        verbose_name_plural = 'Запросы на добавление'

class Page(models.Model):
    '''Страница пользователя'''
    friends = models.ManyToManyField(Contact, blank=True)
    blacklist = models.ManyToManyField(Contact, blank=True, related_name='blacklisted')
    parties = models.ManyToManyField(Party, blank=True, related_name='members')
    user = models.OneToOneField(Contact, related_name='my_page', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user}'s page"

    class Meta:
        verbose_name = 'Страница пользователя'
        verbose_name_plural = 'Страницы пользователей'

class UserInfo(models.Model):
    '''Информация о пользователе'''
    status = models.CharField(max_length=100, default='', blank=True)
    birth_date = models.DateField(null=True)
    country = models.CharField(max_length=100, default='', blank=True)
    city = models.CharField(max_length=100, default='', blank=True)
    user = models.OneToOneField(Contact, on_delete=models.CASCADE, related_name='info')

    def __str__(self):
        return f'info about {self.user}'

    class Meta:
        verbose_name = 'Инфрмация о пользователе'
        verbose_name_plural = 'Информация о пользователях'

@receiver(post_save, sender=Contact)
def user_instances_create(sender, instance=None, created=False, **kwargs):
    '''Создает страницу пользователя'''
    if created:
        Page.objects.create(user=instance)