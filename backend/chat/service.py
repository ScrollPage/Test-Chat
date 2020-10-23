from django.shortcuts import render, get_object_or_404

from .models import Chat, ChatRef

def get_last_10_messages(chat_id):
    chat = get_object_or_404(Chat, id=chat_id)
    return chat.messages.all().order_by('-timestamp')[:10]