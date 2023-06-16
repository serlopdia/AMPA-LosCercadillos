from django.forms import ValidationError
from rest_framework import serializers
from .models import Administrador, Socio
from django.contrib.auth.models import User
from django.core.validators import validate_email
from django.contrib.auth import password_validation
import re

class SocioSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    password = serializers.CharField(source='user.password')
    email = serializers.EmailField(source='user.email')
    tel = serializers.CharField()

    class Meta:
        model = Socio
        fields = ('id', 'username', 'first_name', 'last_name', 'password', 'email', 'tel', 'dni', 'address', 'created_at', 'deleted')
        read_only_fields = ('created_at', )

    def validate_password(self, value):
        if len(value) < 8:
            raise ValidationError("La contraseña debe tener al menos 8 caracteres.")

        has_letter = False
        has_number = False

        for char in value:
            if char.isalpha():
                has_letter = True
            elif char.isdigit():
                has_number = True

            if has_letter and has_number:
                return value

        raise ValidationError("La contraseña debe contener al menos una letra y un número.")

    def validate_username(self, value):
        if len(value) < 4:
            raise serializers.ValidationError("El nombre de usuario debe tener al menos 4 caracteres.")
        return value

    def validate_email(self, value):
        validate_email(value)
        return value

    def validate_tel(self, value):
        if not re.match(r'^\d{9}$', value):
            raise serializers.ValidationError("El número de teléfono debe tener 9 cifras.")
        return value

    def validate_dni(self, value):
        dni_pattern = r'^\d{8}[A-Z]$'
        nie_pattern = r'^[XYZ]\d{7}[A-Z]$'
        if not re.match(dni_pattern, value) and not re.match(nie_pattern, value):
            raise serializers.ValidationError("El documento de identidad debe seguir un formato correcto, recuerda las letras en mayúsculas.")
        dni_letters = 'TRWAGMYFPDXBNJZSQVHLCKE'
        if re.match(dni_pattern, value):
            number = int(value[:-1])
            letter = value[-1]
            if not letter.isupper():
                raise serializers.ValidationError("La letra del DNI debe estar en mayúsculas.")
            index = number % 23
            if letter != dni_letters[index]:
                raise serializers.ValidationError("El DNI es incorrecto.")
        return value

    def validate(self, attrs):
        password = attrs.get('user', {}).get('password')
        username = attrs.get('user', {}).get('username')

        if password:
            user = self.instance.user if self.instance else None
            password_validation.validate_password(password, user=user)

        if username and len(username) < 4:
            raise serializers.ValidationError("El nombre de usuario debe tener al menos 4 caracteres.")

        return attrs

    def create(self, validated_data):
        user_data = validated_data.pop('user', {})
        email = user_data.get('email')
        username = user_data.get('username')

        if User.objects.filter(email=email).exists():
            raise ValidationError('El correo electrónico ya está en uso.')
        if User.objects.filter(username=username).exists():
            raise ValidationError('El nombre de usuario ya está en uso.')
        
        password = user_data.pop('password', None)
        user = User.objects.create(**user_data)
        if password:
            user.set_password(password)
            user.save()
        socio = Socio.objects.create(user=user, **validated_data)
        return socio

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        email = user_data.get('email')
        username = user_data.get('username')

        if email and User.objects.exclude(pk=instance.user.pk).filter(email=email).exists():
            raise ValidationError('El correo electrónico ya está en uso.')
        if username and User.objects.exclude(pk=instance.user.pk).filter(username=username).exists():
            raise ValidationError('El nombre de usuario ya está en uso.')
        
        password = user_data.pop('password', None)
        user = instance.user
        for attr, value in user_data.items():
            setattr(user, attr, value)
        if password:
            user.set_password(password)
        user.save()
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance

class AdministradorSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    password = serializers.CharField(source='user.password')
    is_staff = serializers.BooleanField(source='user.is_staff', read_only=True, default=True)

    class Meta:
        model = Administrador
        fields = ('id', 'username', 'password', 'is_staff', 'created_at')
        read_only_fields = ('created_at',)

    def create(self, validated_data):
        user_data = validated_data.pop('user', {})
        password = user_data.pop('password', None)
        user_data['is_staff'] = True  # Establecer el valor predeterminado de is_staff como True
        user = User.objects.create(**user_data)
        if password:
            user.set_password(password)
            user.save()
        administrador = Administrador.objects.create(user=user, **validated_data)
        return administrador

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        password = user_data.pop('password', None)
        user = instance.user
        for attr, value in user_data.items():
            setattr(user, attr, value)
        if password:
            user.set_password(password)
        user.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance
