from django.contrib import admin

from .models import Like, RePost, Post 

admin.site.register(Like)
admin.site.register(RePost)
admin.site.register(Post)