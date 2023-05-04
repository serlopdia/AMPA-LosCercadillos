from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Administrador

@receiver(post_migrate)
def create_admin(sender, **kwargs):
    if sender.name == "users":
        if not User.objects.filter(username="admin").exists():
            user = User.objects.create(username="admin", password="pbkdf2_sha256$600000$b4ckjzBqHrUGaw09zlNfMQ$448zsspuINgP5A4y1e4YJVyW3uioIN8RsHUAEQDTcP0=", is_staff=True)
            administrador = Administrador.objects.create(user=user)
            administrador.save()
