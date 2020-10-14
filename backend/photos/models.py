from django.db import models
from PIL import Image
from io import BytesIO

from community.models import Page
from like.models import Like
from comments.models import Comment
from .service import save_image
from feed.models import Post

class Photo(models.Model):
    '''Фотография'''
    owner = models.ForeignKey(Page, related_name='photos', on_delete=models.CASCADE)
    picture = models.ImageField(upload_to='picture/%Y/%m/%d')
    compressed_picture = models.ImageField(upload_to='compressed_picture/%Y/%m/%d')
    small_picture = models.ImageField(upload_to='small_picture/%Y/%m/%d')
    likes = models.ManyToManyField(Like)
    comments = models.ManyToManyField(Comment)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.owner} owner's picture"

    def get_type(self):
        return 'photo'

    def image_save(self, *args, **kwargs):
        im1 = im2 = Image.open(self.picture)
        output = BytesIO()
        try:
            im1.save(output, format='JPEG', quality=0)
            format = 'jpeg'
        except OSError:
            im1.save(output, format='PNG', quality=0)
            format = 'png'
        output.seek(0)
        self.compressed_picture = save_image(output, self.picture.name, format)

        output = BytesIO()
        im2 = im2.resize((150, 150))
        try:
            im2.save(output, format='JPEG', quality=100)
            format = 'jpeg'
        except OSError:
            im2.save(output, format='PNG', quality=100)
            format = 'png'
        output.seek(0)
        self.small_picture = save_image(output, self.picture.name, format)

        super().save()

    def delete_images(self):
        self.picture.delete(save=False)
        self.compressed_picture.delete(save=False)
        self.small_picture.delete(save=False)

    def delete(self):
        user = self.owner.user
        if user.avatar_id == self.id:
            user.avatar_id = None
            user.save()
            post = Post.objects.filter(user=user, image=self.picture).delete()
        self.delete_images()
        super().delete()


        class Meta:
            verbose_name = 'Фотография'
            verbose_name_plural = 'Фотографии'
