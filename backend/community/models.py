from django.db import models

from chat.models import Contact

class AddRequest(models.Model):
    r_from = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name='sender')
    r_to = models.ForeignKey(Contact, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.r_from.user.username

    class Meta:
        verbose_name = 'Запрос на добавление'
        verbose_name_plural = 'Запросы на добавление'
