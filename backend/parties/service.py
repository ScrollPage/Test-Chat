from django.core.files.uploadedfile import InMemoryUploadedFile
import sys

def save_image(output, name, format):
    return InMemoryUploadedFile(
            output, 
            'ImageField', 
            "%s.jpg" % name.split('.')[0], 
            f'image/{format}',
            sys.getsizeof(output), 
            None
        )