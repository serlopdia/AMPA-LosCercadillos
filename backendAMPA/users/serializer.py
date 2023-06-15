from django.forms import ValidationError
from rest_framework import serializers
from .models import Administrador, Socio
from django.contrib.auth.models import User

class SocioSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    password = serializers.CharField(source='user.password')
    email = serializers.EmailField(source='user.email')

    class Meta:
        model = Socio
        fields = ('id', 'username', 'first_name', 'last_name', 'password', 'email', 'tel', 'dni', 'address', 'created_at', 'deleted')
        read_only_fields = ('created_at', )

    def validate_email(self, value):
        instance = self.instance
        user = instance.user if instance else None
        if user and value == user.email:
            return value
        if User.objects.filter(email=value).exists():
            raise ValidationError('El correo electrónico ya está en uso.')
        return value

    def validate_username(self, value):
        instance = self.instance
        user = instance.user if instance else None
        if user and value == user.username:
            return value
        if User.objects.filter(username=value).exists():
            raise ValidationError('El nombre de usuario ya está en uso.')
        return value

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
