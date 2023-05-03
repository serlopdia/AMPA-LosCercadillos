from django.db import models
from django.contrib.auth.models import User

# Create your models here.

#User: username, password, email, first_name, last_name...
class Socio(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    tel = models.CharField(max_length=20)
    dni = models.CharField(max_length=10)
    address = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label="users"