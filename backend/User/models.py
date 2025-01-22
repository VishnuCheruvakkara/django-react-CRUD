from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.admin.models import LogEntry

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)

    USERNAME_FIELD = 'email'  # Correct the typo here from 'USERNANE_FIELD' to 'USERNAME_FIELD'
    REQUIRED_FIELDS = ['username']

 # Added related_name to avoid reverse accessor clashes
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_groups',  # Change the related_name
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_permissions',  # Change the related_name
        blank=True
    )

   