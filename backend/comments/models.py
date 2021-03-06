from django.db import models

from comments.service import AbstractPost

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

    class Meta:
        verbose_name = 'Комментарий'
        verbose_name_plural = 'Комментарии'

    def get_type(self):
        return 'comment'