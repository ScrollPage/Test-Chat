import uuid, hashlib
from django.core.files.uploadedfile import InMemoryUploadedFile
import sys


def generate_token(identifier):
    salt = uuid.uuid4().hex + identifier
    return hashlib.sha256(salt.encode('utf-8')).hexdigest()