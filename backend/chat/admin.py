from django.contrib import admin

from .models import Chat, ChatRef, Message

admin.site.register(Chat)
admin.site.register(ChatRef)
admin.site.register(Message)