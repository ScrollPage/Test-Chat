from django.db import models

from chat.models import Contact

class AddRequest(models.Model):
    sender = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name = 'invited', null=True)
    receiver = models.ForeignKey(Contact, on_delete=models.CASCADE, null=True, related_name='invites')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.sender.user.username} -> {self.receiver.user.username}'

    class Meta:
        verbose_name = 'Запрос на добавление'
        verbose_name_plural = 'Запросы на добавление'
