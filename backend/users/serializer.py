from rest_framework import serializers
from .models import Socio
from django.contrib.auth.models import User

class SocioSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    password = serializers.CharField(source='user.password')
    email = serializers.EmailField(source='user.email')

    class Meta:
        model = Socio
        fields = ('id', 'username', 'first_name', 'last_name', 'password', 'email', 'tel', 'dni', 'address', 'created_at')
        read_only_fields = ('created_at', )

    def create(self, validated_data):
        user_data = validated_data.pop('user', {})
        user = User.objects.create(**user_data)
        socio = Socio.objects.create(user=user, **validated_data)
        return socio

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user = instance.user
        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance