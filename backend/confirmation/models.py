from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings

from .service import generate_token

class MyToken(models.Model):
    '''Токены для подтвреждения почты'''
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None)
    token = models.CharField(max_length=100, default='')
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.token

    class Meta:
        verbose_name = 'Токен подтверждения'
        verbose_name_plural = 'Токены подтверждения'
        ordering = ['-created']

@receiver(post_save, sender=User)
def send_conf_mail(sender, instance=None, created=False, **kwargs):
    '''Отправляет письмо с подтверждением'''
    if created:
        if not instance.is_superuser:
            m = MyToken.objects.create(
                user=instance, 
                token=generate_token(instance.email)
            )
            send_mail(
                "Подтверждение регистрации",
                f"Перейдите по ссылке, чтобы завершить регистрацию: http://{settings.REACT_DOMEN}/account-activation/?token={m.token}",
                settings.EMAIL_HOST_USER, 
                [instance.email, ], 
                fail_silently=False
            )