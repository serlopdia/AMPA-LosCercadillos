from django.db import models
from django.contrib.auth.models import User
import re
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.validators import validate_email

# Create your models here.
#User: username, password, email, first_name, last_name...
class Socio(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    tel = models.CharField(max_length=20)
    dni = models.CharField(max_length=10)
    address = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    deleted = models.BooleanField(default=False)

    class Meta:
        app_label = "users"

    def clean(self):
        super().clean()

        if not re.match(r'^\d{9}$', self.tel):
            raise ValidationError("El número de teléfono debe tener 9 cifras.")

        dni_pattern = r'^\d{8}[A-Z]$'
        nie_pattern = r'^[XYZ]\d{7}[A-Z]$'
        if not re.match(dni_pattern, self.dni) and not re.match(nie_pattern, self.dni):
            raise ValidationError("El documento de identidad debe seguir un formato correcto.")

        dni_letters = 'TRWAGMYFPDXBNJZSQVHLCKE'
        if re.match(dni_pattern, self.dni):
            number = int(self.dni[:-1])
            letter = self.dni[-1]
            if not letter.isupper():
                raise ValidationError("La letra del DNI debe estar en mayúsculas.")
            index = number % 23
            if letter != dni_letters[index]:
                raise ValidationError("El DNI es incorrecto.")

        if len(self.user.username) < 4:
            raise ValidationError("El nombre de usuario debe tener al menos 4 caracteres.")

        validate_email(self.user.email)

        password = self.user.password
        if len(password) < 8 or not any(char.isalpha() for char in password) or not any(char.isdigit() for char in password):
            raise ValidationError("La contraseña debe tener al menos 8 caracteres y contener al menos una letra y un número.")

        if User.objects.exclude(pk=self.user.pk).filter(email=self.user.email).exists():
            raise ValidationError('El correo electrónico ya está en uso.')
        if User.objects.exclude(pk=self.user.pk).filter(username=self.user.username).exists():
            raise ValidationError('El nombre de usuario ya está en uso.')
        
class Administrador(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = "users"

    def clean(self):
        if not self.user:
            raise ValidationError("El campo user es obligatorio.")

        if not self.created_at:
            raise ValidationError("El campo created_at es obligatorio.")

        if not self.user.username:
            raise ValidationError("El campo username es obligatorio.")

        if self.user.password and len(self.user.password) < 8:
            raise ValidationError("La contraseña debe tener al menos 8 caracteres.")

        if not self.user.is_staff:
            raise ValidationError("El campo is_staff debe ser True.")
        super().clean()