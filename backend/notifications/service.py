from backend.settings import pusher_client as pusher

from .models import Notice

def create_notification(sender, receiver, event):
    '''Создание уведомления'''
    try:
        Notice.objects.get(
            sender=sender,
            receiver=receiver, 
            event=event
        )
    except Notice.DoesNotExist:
        Notice.objects.create(
            sender=sender,
            receiver=receiver,
            event=event
        )

def send_message_notifications(chat, sender):
    for user in chat.participants.all():
        if user != sender:
            pusher.trigger(
                f'notifications{user.id}', 
                'new_message', 
                {'sender': sender.id, 'chat_id': chat.id, 'name': sender.get_full_name()}
            )
            create_notification(sender, user, 1)

def send_addrequest_notification(sender, receiver):
    pusher.trigger(
        f'notifications{receiver.id}', 
        'new_request', 
        {'sender': sender.id, 'name': sender.get_full_name()}
    )
    create_notification(sender, receiver, 2)

def new_friend_notification(sender, receiver):
    pusher.trigger(
        f'notifications{sender.id}', 
        'new_friend', 
        {'sender': receiver.id, 'name': receiver.get_full_name()}
    )
    create_notification(sender, receiver, 3)

def send_like_notification(owner, liker, post_id):
    if owner != liker:
        pusher.trigger(
            f'notifications{owner.id}', 
            'new_like', 
            {'liker': liker.id, 'post': post_id, 'name': liker.get_full_name()}
        )
        create_notification(liker, owner, 4)

def send_repost_notification(owner, reposter, post_id):
    if owner != reposter:
        pusher.trigger(
            f'notifications{owner.id}', 
            'new_repost', 
            {'reposter': reposter.id, 'post': post_id, 'name': reposter.get_full_name()}
        )
        create_notification(reposter, owner, 5)