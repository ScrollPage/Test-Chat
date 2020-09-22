from backend.settings import pusher_client as pusher

def send_message_notifications(chat, sender):
    for user in chat.participant.all():
        if user != sender:
            pusher.trigger(
                f'notifications{user.id}', 
                'new_message', 
                {'sender': sender.id, 'chat_id': chat.id, 'name': sender.get_full_name()}
            )

def send_addrequest_notification(sender, receiver):
    pusher.trigger(
        f'notifications{receiver.id}', 
        'new_request', 
        {'sender': sender.id, 'name': sender.get_full_name()}
    )

def new_friend_notification(sender, receiver):
    pusher.trigger(
        f'notifications{sender.id}', 
        'new_friend', 
        {'sender': receiver.id, 'name': receiver.get_full_name()}
    )

def send_like_notification(owner, liker, post_id):
    # print(owner)
    # print(post_id)
    # print(liker)
    pusher.trigger(
        f'notifications{owner.id}', 
        'new_like', 
        {'liker': liker.id, 'post': post_id, 'name': liker.get_full_name()}
    )