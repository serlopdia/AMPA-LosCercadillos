from .models import Administrador, Socio
from rest_framework import viewsets, permissions
from .serializer import AdministradorSerializer, SocioSerializer

class SocioViewSet(viewsets.ModelViewSet):
    queryset = Socio.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = SocioSerializer

class AdministradorViewSet(viewsets.ModelViewSet):
    queryset = Administrador.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = AdministradorSerializer