from django.db import models

from contact.models import Contact

class Like(models.Model):
    '''Стандартный лайк'''
    user = models.ForeignKey(Contact, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.user)

    class Meta:
        verbose_name = 'Лайк'
        verbose_name_plural = 'Лайки'

class RePost(models.Model):
    '''Стндартный репост'''
    user = models.ForeignKey(Contact, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.user)

    class Meta:
        verbose_name = 'Репост'
        verbose_name_plural = 'Репосты'

class Post(models.Model):
    '''Обычный пост на стенку'''
    parent = models.ForeignKey(
        'self', 
        verbose_name = 'Родитель', 
        on_delete = models.SET_NULL, 
        null = True, 
        blank = True,
        related_name = 'children'
    )
    user = models.ForeignKey(Contact, on_delete=models.DO_NOTHING)
    text = models.TextField(max_length=1000, blank=True, default='')
    image = models.ImageField(upload_to='user_posts/%Y/%m/%d', blank=True, null=True)
    likes = models.ManyToManyField(Like, blank=True)
    reposts = models.ManyToManyField(RePost, blank=True)

    def __str__(self):
        return str(self.user)

    class Meta:
        verbose_name = 'Пост'
        verbose_name_plural = 'Посты'

