from django.contrib import admin

from .models import Chat, ChatRef

admin.site.register(Chat)
admin.site.register(ChatRef)
