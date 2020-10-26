from django.shortcuts import render, get_object_or_404

from .models import Chat, ChatRef

def get_last_10_messages(chat_id):
    chat = get_object_or_404(Chat, id=chat_id)
    return chat.messages.all().order_by('-timestamp')[:10]

def get_chat_and_user(data):
    chat_id = data['chatId']
    user_id = data['userId']
    chat = get_object_or_404(Chat, id=chat_id)
    user = get_object_or_404(Contact, id=user_id)
    return chat, user