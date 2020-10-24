from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json
from django.shortcuts import get_object_or_404

from .models import Message
from .service import get_last_10_messages
from contact.models import Contact
from notifications.service import send_message_notifications
from photos.models import Photo
from chat.models import Chat, ChatRef

class ChatConsumer(WebsocketConsumer):

    def fetch_messages(self, data):
        messages = get_last_10_messages(data['chatId'])
        content = {
            'command': 'messages',
            'messages': self.messages_to_json(messages)
        }
        self.send_message(content)

    def new_message(self, data):
        user_contact = get_object_or_404(Contact, id=data['from'])
        message = Message.objects.create(
            contact=user_contact,
            content=data['message']
        )
        current_chat = get_object_or_404(Chat, id=data['chatId'])
        current_chat.messages.add(message)
        current_chat.make_refs()
        content = {
            'command': 'new_message',
            'message': self.message_to_json(message)
        }
        send_message_notifications(current_chat, user_contact)
        return self.send_chat_message(content)

    def messages_to_json(self, messages):
        return [self.message_to_json(message) for message in messages]

    def message_to_json(self, message):
        user = message.contact
        if user.avatar_id:
            small_avatar = Photo.objects.get(id=user.avatar_id).small_picture.url
        else:
            small_avatar = None
        return {
            'id': message.id,
            'author': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'content': message.content,
            'timestamp': str(message.timestamp),
            'small_avatar': small_avatar,
        }

    commands = {
        'fetch_messages': fetch_messages,
        'new_message': new_message
    }

    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        data = json.loads(text_data)
        self.commands[data['command']](self, data)
        
    def send_chat_message(self, message):    
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    def send_message(self, message):
        self.send(text_data=json.dumps(message))

    def chat_message(self, event):
        message = event['message']
        self.send(text_data=json.dumps(message))