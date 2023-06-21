from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Administrador, Socio
""" 
@receiver(post_migrate, dispatch_uid="create_socio_signal")
def create_users(sender, **kwargs):
    if sender.name == "users":
        if not User.objects.filter(username="admin").exists():
            user = User.objects.create(username="admin", password="pbkdf2_sha256$600000$b4ckjzBqHrUGaw09zlNfMQ$448zsspuINgP5A4y1e4YJVyW3uioIN8RsHUAEQDTcP0=", is_staff=True)
            administrador = Administrador.objects.create(user=user)
            administrador.save()
            
        if not Socio.objects.filter(user__username="testing").exists():
            user = User.objects.create(username="testing", password="pbkdf2_sha256$600000$r4p7KCcHwijA92uh9Cb5wX$IvQsMewXoX+fQHmr2J6vyqitij8wjLxm3K9StOZK/f8=", first_name="Socio", last_name="Cuenta Test", email="prueba@correo.com")
            socio = Socio.objects.create(user=user, tel="612345789", dni="97125755K", address="Calle Malasmañanas 5")
            socio.save()
 """