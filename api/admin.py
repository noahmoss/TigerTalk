from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from api.models import Post, Comment, User

# Register your models here.
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(User, UserAdmin)
