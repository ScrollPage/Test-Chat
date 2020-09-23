from django.db import models
from django.utils import timezone

from contact.models import Contact

class AbstractPost(models.Model):
    '''Абстрактный пост'''
    user = models.ForeignKey(Contact, on_delete=models.DO_NOTHING)
    text = models.TextField(max_length=1000, blank=True, default='')
    image = models.ImageField(upload_to='user_posts/%Y/%m/%d', blank=True, null=True)
    timestamp = models.DateTimeField(default=timezone.now())

    def __str__(self):
        return str(self.id)

    class Meta:
        abstract = True


class Post(AbstractPost):
    '''Обычный пост на стенку или коммент к другому посту'''
    parent = models.ForeignKey(
        'self', 
        verbose_name = 'Родитель', 
        on_delete = models.SET_NULL, 
        null = True, 
        blank = True,
        related_name = 'children'
    )

    class Meta:
        verbose_name = 'Пост'
        verbose_name_plural = 'Посты'

class Comment(AbstractPost):
    '''Комментарий куда угодно'''
    parent = models.ForeignKey(
        'self', 
        verbose_name = 'Родитель', 
        on_delete = models.SET_NULL, 
        null = True, 
        blank = True,
        related_name = 'children'
    )
    post_id = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')

    class Meta:
        verbose_name = 'Комментарий'
        verbose_name_plural = 'Комментарии'

class Like(models.Model):
    '''Стандартный лайк'''
    user = models.ForeignKey(Contact, on_delete=models.CASCADE)
    post_id = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes', null=True)

    def __str__(self):
        return f'{self.user} user likes {self.post_id} post'

    class Meta:
        verbose_name = 'Лайк'
        verbose_name_plural = 'Лайки'

class RePost(models.Model):
    '''Стндартный репост'''
    user = models.ForeignKey(Contact, on_delete=models.CASCADE)
    post_id = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='reposts', null=True)

    def __str__(self):
        return f'{self.user} user reposts {self.post_id} post'

    class Meta:
        verbose_name = 'Репост'
        verbose_name_plural = 'Репосты'


