from django.db.models import Q, Count

from backend.exceptions import ForbiddenError, NotFoundError
from comments.models import Comment
from feed.models import Post

def not_liked(user, inst):
        if not inst.likes.aggregate(like=Count('user', filter=Q(user=user)))['like']:
            return
        raise ForbiddenError("You've already liked this.")

def liked(user, inst):
    if inst.likes.aggregate(like=Count('user', filter=Q(user=user)))['like']:
        return
    raise ForbiddenError("You did not like this yet.")

def not_in_blacklist(user, inst):
    if type(inst) != Comment:
        if inst.owner:
            if user not in inst.owner.blacklist.all():
                return
        else:
            if user not in inst.group_owner.blacklist.all():
                return
    else:
        return
    raise ForbiddenError('You are in blacklist')

def is_published(inst):
    if type(inst) == Post:
        if not inst.published:
            raise NotFoundError('Maybe this post is not published yet.')
    return