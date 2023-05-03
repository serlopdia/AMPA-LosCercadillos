from .models import Socio
from rest_framework import viewsets, permissions
from .serializer import SocioSerializer

class SocioViewSet(viewsets.ModelViewSet):
    queryset = Socio.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = SocioSerializer