from backend.settings import pusher_client as pusher

def send_message_notifications(chat, sender):
    for user in chat.participant.all():
        if user != sender:
            pusher.trigger(
                f'notifications/{user.id}', 
                'message_send', 
                {'sender': sender.id, 'chat_id': chat.id, 'name': sender.get_full_name()}
            )

def send_addrequest_notification(sender, receiver):
    pusher.trigger(
        f'notifications/{receiver.id}', 
        'friend_add', 
        {'sender': sender.id, 'name': sender.get_full_name()}
    )

def send_like_notification():
    pass