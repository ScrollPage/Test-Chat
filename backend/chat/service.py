from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User

from .models import Chat, Contact

def get_last_10_messages(chat_id):
    chat = get_object_or_404(Chat, id=chat_id)
    return chat.messages.all().order_by('-timestamp')[:10]

def get_current_chat(chat_id):
    return get_object_or_404(Chat, id=chat_id)