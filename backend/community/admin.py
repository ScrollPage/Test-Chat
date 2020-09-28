from django.contrib import admin

from .models import AddRequest, Page, UserInfo

admin.site.register(AddRequest)
admin.site.register(Page)
admin.site.register(UserInfo)