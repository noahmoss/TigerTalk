from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model
from api.models import Post, Comment, User

admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(User, UserAdmin)
