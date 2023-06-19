from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Administrador, Socio

""" @receiver(post_migrate, dispatch_uid="create_socio_signal")
def create_users(sender, **kwargs):
    if sender.name == "users":
        if not User.objects.filter(username="admin").exists():
            user = User.objects.create(username="admin", password="pbkdf2_sha256$600000$b4ckjzBqHrUGaw09zlNfMQ$448zsspuINgP5A4y1e4YJVyW3uioIN8RsHUAEQDTcP0=", is_staff=True)
            administrador = Administrador.objects.create(user=user)
            administrador.save()
            
        if not Socio.objects.filter(user__username="sergiolopdia").exists():
            user = User.objects.create(username="sergiolopdia", password="pbkdf2_sha256$600000$H3TZxE62VucjaWxx8kXAMq$O9DEe2Fjb5AS++n9azdH4MT/vhLK260HehYAzMPC7jc=", first_name="Sergio", last_name="López Díaz", email="serlopdia@alum.us.es")
            socio = Socio.objects.create(user=user, tel="601027857", dni="15412769D", address="Avenida De La Constitución 7")
            socio.save()
 """