from django.db import models
from PIL import Image
from io import BytesIO

from contact.models import Contact
from .service import save_image

class Party(models.Model):
    '''Стандартная группа'''
    blacklist = models.ManyToManyField(Contact)
    image = models.ImageField(upload_to='group_avatars/%Y/%m/%d', blank=True)
    compressed_image = models.ImageField(upload_to='compressed_group_avatars/%Y/%m/%d', blank=True)
    small_image = models.ImageField(upload_to='small_group_avatars/%Y/%m/%d', blank=True)
    name = models.CharField(max_length=30, unique=True)
    slug = models.SlugField(max_length=20)
    info = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    staff = models.ManyToManyField(Contact, related_name='some_related_name')
    admin = models.ForeignKey(Contact, related_name='some_related_name_2', on_delete=models.CASCADE)

    def image_save(self, *args, **kwargs):
        im1 = im2 = Image.open(self.image)
        output = BytesIO()
        try:
            im1.save(output, format='JPEG', quality=0)
            format = 'jpeg'
        except OSError:
            im1.save(output, format='PNG', quality=0)
            format = 'png'
        output.seek(0)
        self.compressed_image = save_image(output, self.image.name, format)

        output = BytesIO()
        im2 = im2.resize((50, 50))
        try:
            im2.save(output, format='JPEG', quality=100)
            format = 'jpeg'
        except OSError:
            im2.save(output, format='PNG', quality=100)
            format = 'png'
        output.seek(0)
        self.small_image = save_image(output, self.image.name, format)

        super().save()

    def __str__(self):
        return f'group {self.name}'

    def delete_images(self):
        self.image.delete(save=False)
        self.compressed_image.delete(save=False)
        self.small_image.delete(save=False)

    def delete(self):
        self.delete_images()
        super().delete()

    class Meta:
        verbose_name = 'Группа'
        verbose_name_plural = 'Группы'