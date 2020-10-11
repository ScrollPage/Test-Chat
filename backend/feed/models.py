from django.db import models
from django.utils import timezone
from PIL import Image
from io import BytesIO

from contact.models import Contact
from community.models import Page
from parties.models import Party
from backend.service import save_image, AbstractPost
from like.models import Like
from comments.models import Comment

class Post(AbstractPost):
    '''Обычный пост на стенку'''
    parent = models.ForeignKey(
        'self', 
        verbose_name = 'Родитель', 
        on_delete = models.DO_NOTHING, 
        null = True, 
        blank = True,
        related_name = 'children'
    )
    owner = models.ForeignKey(
        Page, 
        on_delete=models.CASCADE, 
        null=True, 
        default=None, 
        related_name='my_board_posts'
    )
    group_owner = models.ForeignKey(Party, null=True, default=None, on_delete=models.CASCADE)
    published = models.BooleanField(default=True)
    comments = models.ManyToManyField(Comment, related_name='post_owner')

    class Meta:
        verbose_name = 'Пост'
        verbose_name_plural = 'Посты'

class RePost(models.Model):
    '''Стандартный репост'''
    user = models.ForeignKey(Contact, on_delete=models.CASCADE)
    post_id = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='reposts', null=True)

    def __str__(self):
        return f'{self.user} user reposts {self.post_id} post'

    class Meta:
        verbose_name = 'Репост'
        verbose_name_plural = 'Репосты'