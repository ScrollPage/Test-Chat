from rest_framework.test import APIClient
from django.shortcuts import reverse

def get_response(url, method, user=None, data=None, kwargs=None, is_url=False, format=None):
    client = APIClient()

    if user:
        client.force_authenticate(user)

    if not is_url:
        url = reverse(url, kwargs=kwargs)

    method_dict = {
        'post': client.post,
        'get': client.get,
        'patch': client.patch,
        'delete': client.delete
    }

    return method_dict[method](url, data, format=format)
