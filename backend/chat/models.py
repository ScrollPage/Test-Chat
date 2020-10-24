from django.db import models

from contact.models import Contact

class Message(models.Model):
    contact = models.ForeignKey(Contact, related_name='messages', on_delete=models.CASCADE, null=True)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return self.contact.slug

    class Meta:
        verbose_name = 'Сообщение'
        verbose_name_plural = 'Сообщения'


class Chat(models.Model):
    participants = models.ManyToManyField(Contact, related_name='chats')
    messages = models.ManyToManyField(Message, blank=True)
    is_chat = models.BooleanField(default=True)
    creator = models.ForeignKey(Contact, null=True, on_delete=models.DO_NOTHING)
    name = models.CharField(max_length=30, null=True)

    def __str__(self):
        return f'{self.pk}'

    def make_refs(self):
        for participant in self.participants:
            ChatRef.objects.get_or_create(
                chat=self,
                user=participant
            )

    class Meta:
        verbose_name = 'Чат'
        verbose_name_plural = 'Чаты'

class ChatRef(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    user = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name='chat_refs')

    @classmethod
    def is_one_left(cls, chat):
        refs = cls.objects.filter(chat=chat)
        if not refs:
            chat.delete()

    def delete(self):
        chat = self.chat
        super().delete()
        ChatRef.is_one_left(chat)

    def __str__(self):
        return f'reference to chat {self.chat} from {self.user}'

    class Meta:
        verbose_name = 'Ссылка на чат'
        verbose_name_plural = 'Ссылки на чаты'