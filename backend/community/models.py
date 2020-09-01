from django.db import models

from contact.models import Contact

class AddRequest(models.Model):
    sender = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name = 'invited', null=True)
    receiver = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name='invites', null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.sender} -> {self.receiver}'

    class Meta:
        verbose_name = 'Запрос на добавление'
        verbose_name_plural = 'Запросы на добавление'