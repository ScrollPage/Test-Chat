from django.db import models
from PIL import Image
from io import BytesIO

from contact.models import Contact
from like.models import Like
from parties.service import save_image 

class AbstractPost(models.Model):
    '''Абстрактный пост'''
    user = models.ForeignKey(Contact, on_delete=models.CASCADE)
    text = models.TextField(max_length=1000, blank=True, default='')
    image = models.ImageField(upload_to='user_posts/%Y/%m/%d', blank=True, null=True)
    compressed_image = models.ImageField(upload_to='compressed_user_posts/%Y/%m/%d', blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(Like)

    def image_save(self, *args, **kwargs):
        im = Image.open(self.image)
        output = BytesIO()
        try:
            im.save(output, format='JPEG', quality=0)
            format = 'jpeg'
        except OSError:
            im.save(output, format='PNG', quality=0)
            format = 'png'

        print('asd')
        output.seek(0)
        self.compressed_image = save_image(output, self.image.name, format)

        super().save()

    def __str__(self):
        return str(self.id)

    def delete_images(self):
        self.image.delete(save=False)
        self.compressed_image.delete(save=False)

    def delete(self):
        self.delete_images()
        super().delete()

    class Meta:
        abstract = True