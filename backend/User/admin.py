from django.contrib import admin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ['id','email', 'username', 'profile_image', 'is_active', 'date_joined','password']
    search_fields = ['email', 'username']
