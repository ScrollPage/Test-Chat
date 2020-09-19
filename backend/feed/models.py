from django.db import models

from contact.models import Contact

class AbstractPost(models.Model):
    '''Абстрактный пост'''
    user = models.ForeignKey(Contact, on_delete=models.DO_NOTHING)
    text = models.TextField(max_length=1000, blank=True, default='')
    image = models.ImageField(upload_to='user_posts/%Y/%m/%d', blank=True, null=True)

    def __str__(self):
        return str(self.id)

    class Meta:
        abstract = True

class Comment(AbstractPost):
    '''Комментарий куда угодно'''
    parent = models.ForeignKey(
        Contact, 
        verbose_name = 'Родитель', 
        on_delete = models.SET_NULL, 
        null = True, 
        blank = True,
        related_name = 'child'
    )

    class Meta:
        verbose_name = 'Комментарий'
        verbose_name_plural = 'Комментарии'

class Post(AbstractPost):
    '''Обычный пост на стенку или коммент к другому посту'''
    parent = models.ForeignKey(
        'self', 
        verbose_name = 'Родитель', 
        on_delete = models.SET_NULL, 
        null = True, 
        blank = True,
        related_name = 'child'
    )
    comments = models.ManyToManyField(Comment)

    class Meta:
        verbose_name = 'Пост'
        verbose_name_plural = 'Посты'

class Like(models.Model):
    '''Стандартный лайк'''
    user = models.ForeignKey(Contact, on_delete=models.CASCADE)
    post_id = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes', null=True)

    def __str__(self):
        return f'{self.user} {self.post_id}'

    class Meta:
        verbose_name = 'Лайк'
        verbose_name_plural = 'Лайки'

class RePost(models.Model):
    '''Стндартный репост'''
    user = models.ForeignKey(Contact, on_delete=models.CASCADE)
    post_id = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='reposts', null=True)

    def __str__(self):
        return f'{self.user} {self.post_id}'

    class Meta:
        verbose_name = 'Репост'
        verbose_name_plural = 'Репосты'


