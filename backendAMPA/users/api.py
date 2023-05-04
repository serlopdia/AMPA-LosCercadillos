from .models import Administrador, Socio
from rest_framework import viewsets, permissions
from .serializer import AdministradorSerializer, SocioSerializer

class CustomPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == 'POST':
            # Permitir cualquier petición POST, incluso si no está autenticado
            return True
        elif request.method in ['GET', 'PUT', 'DELETE']:
            # Verificar si el token de la solicitud pertenece al mismo usuario que se modifica o elimina
            # O si el token del que realiza la petición pertenece a un usuario is_staff
            user = request.user
            if user.is_authenticated:
                if user.is_staff:
                    return True  # Permitir si el usuario es is_staff
                elif user.id == view.kwargs['pk']:
                    return True  # Permitir si el usuario es el mismo que se modifica o elimina
        return False  # Denegar en cualquier otro caso

class SocioViewSet(viewsets.ModelViewSet):
    queryset = Socio.objects.all()
    permission_classes = [CustomPermission]
    serializer_class = SocioSerializer

class AdministradorViewSet(viewsets.ModelViewSet):
    queryset = Administrador.objects.all()
    permission_classes = [permissions.IsAdminUser]
    serializer_class = AdministradorSerializer