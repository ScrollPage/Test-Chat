from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.models import (
    AbstractBaseUser, 
    BaseUserManager, 
    PermissionsMixin
)
from random import randint
import requests

from .service import generate_token

class ContactManager(BaseUserManager):
    '''Мэнэджер кастомного пользователя'''

    def create_user(
        self,
        email,
        first_name,
        last_name, 
        phone_number, 
        slug, 
        password = None
    ):
        user = self.model(
            email=self.normalize_email(email),
            first_name=first_name.capitalize(),
            last_name=last_name.capitalize(),
            phone_number=phone_number,
            slug=slug
        )

        user.set_password(password)
        user.save(using = self._db)

        return user

    def create_superuser(
        self, 
        email, 
        first_name, 
        last_name, 
        phone_number, 
        slug, 
        password = None
    ):
        user = self.model(
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name,
            phone_number=phone_number,
            slug=slug
        )

        user.set_password(password)

        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True

        user.save(using = self._db)
        return user

class Contact(AbstractBaseUser, PermissionsMixin):
    '''Кастомная модель пользователя'''
    email = models.EmailField(verbose_name='email', max_length = 60, unique = True)
    slug = models.SlugField(default='')
    first_name = models.CharField(max_length=30, default = '')
    last_name = models.CharField(max_length=30, default = '')
    phone_number = models.CharField(max_length=11)
    date_joined = models.DateTimeField(verbose_name='date joined', auto_now_add = True)
    last_login = models.DateTimeField(verbose_name='last login', auto_now = True)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    avatar_id = models.PositiveIntegerField(default=None, null=True, blank=True)
    is_active = models.BooleanField(default=False)
    activation_type = models.CharField(default='', max_length=10, null=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'phone_number', 'slug']

    objects = ContactManager()

    def delete(self):
        self.chat_refs.all().delete()
        super().delete()

    def __str__(self):
        return str(self.id)

    def get_full_name(self):
        return f'{self.first_name} {self.last_name}'

    class Meta:
        verbose_name = 'Контакт'
        verbose_name_plural = 'Контакты'
        ordering = ['-date_joined']

class Code(models.Model):
    '''Код активации'''
    user = models.OneToOneField(Contact, on_delete=models.CASCADE, default=None, null=True)
    code = models.PositiveSmallIntegerField(default=0)
    created = models.DateTimeField(auto_now_add=True)

class MyToken(models.Model):
    '''Токены для подтвреждения почты'''
    user = models.OneToOneField(Contact, on_delete=models.CASCADE, default=None, null=True)
    token = models.CharField(max_length=100, default='')
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.token

    class Meta:
        verbose_name = 'Токен подтверждения'
        verbose_name_plural = 'Токены подтверждения'
        ordering = ['-created']

class ContactCounter(models.Model):
    '''Счетчик юзеров'''
    counter = models.PositiveIntegerField(default=0)

    def __str__(self):
        return str(self.counter)

    class Meta:
        verbose_name = 'Счетчик пользователей'
        verbose_name_plural = 'Счетчики пользователей'

@receiver(post_save, sender=Contact)
def increase_counter(sender, instance=None, created=False, **kwargs):
    '''Увеличние счетчика'''
    if created:
        try:
            counter = ContactCounter.objects.get(id=1)
        except ContactCounter.DoesNotExist:
            counter = ContactCounter.objects.create()
        counter.counter += 1
        counter.save()

@receiver(post_save, sender=Contact)
def send_conf_mail(sender, instance=None, created=False, **kwargs):
    '''Отправляет письмо с подтверждением'''
    if created:
        if not instance.is_superuser:
            if instance.activation_type == 'email':
                m = MyToken.objects.create(
                    user=instance, 
                    token=generate_token(instance.email)
                )
                send_mail(
                    'Подтверждение регистрации',
                    f"Перейдите по ссылке, чтобы завершить регистрацию: {settings.REACT_DOMEN}/account-activation?token={m.token}",
                    settings.EMAIL_HOST_USER, 
                    [instance.email],
                    fail_silently=False
                )
            else:
                code = Code.objects.create(
                    user=instance,
                    code=randint(100000, 999999)
                )

                url = 'http://api.sms-prosto.ru/?'
                method = 'push_msg'
                email = settings.SMS_EMAIL
                password = settings.SMS_PASSWORD
                phone = f'{instance.phone_number}'
                text = f'Ваш код подтверждения: {code.code}'
                sender_name = 'ScrollNet'
                url = f'{url}method={method}&email={email}&password={password}&text={text}&phone={phone}&sender_name={sender_name}'
                r = requests.get(url)