import uuid, hashlib
from django.core.files.uploadedfile import InMemoryUploadedFile
import sys


def generate_token(identifier):
    salt = uuid.uuid4().hex + identifier
    return hashlib.sha256(salt.encode('utf-8')).hexdigest()

def save_image(output, name):
    return InMemoryUploadedFile(
            output, 
            'ImageField', 
            "%s.jpg" % name.split('.')[0], 
            'image/jpeg',
            sys.getsizeof(output), 
            None
        )
