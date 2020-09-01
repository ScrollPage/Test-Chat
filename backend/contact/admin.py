from django.contrib import admin

from .models import Contact, ContactCounter, MyToken

admin.site.register(Contact)
admin.site.register(ContactCounter)
admin.site.register(MyToken)