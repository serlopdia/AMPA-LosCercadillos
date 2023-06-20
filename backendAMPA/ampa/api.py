from rest_framework import viewsets, permissions
from django.db import models
from django.utils.translation import gettext_lazy as _
from .models import Asunto, Balance, Cita, Clase, Colaborador, CursoEscolar, Evento, Hijo, Noticia, PagoCurso, Sugerencia, Vista
from .serializer import AsuntoSerializer, BalanceSerializer, CitaSerializer, ClaseSerializer, ColaboradorSerializer, CursoEscolarSerializer, EventoSerializer, HijoSerializer, NoticiaSerializer, PagoCursoSerializer, SugerenciaSerializer, VistaSerializer

class IsOwnerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_staff:
            return True
        elif request.user.is_authenticated and hasattr(request.user, 'socio'):
            if view.action == 'list':
                # Los socios no pueden realizar peticiones 'list'
                return False
            elif view.action in ['retrieve', 'update', 'partial_update', 'destroy']:
                # Verificar que el socio solo pueda manipular objetos asociados a él
                return self._is_owner_or_admin(request, view)
            else:
                return True
        else:
            return False
    
    def _is_owner_or_admin(self, request, view):
        # Verificar si el usuario es propietario del objeto o un administrador
        obj = self._get_object(view)
        return request.user.is_authenticated and (
            request.user.is_staff or
            (hasattr(request.user, 'socio') and request.user.socio.id == obj.socio.id)
        )

    def _get_object(self, view):
        # Obtener el objeto específico de la solicitud
        return view.get_object()

class VistaViewSet(viewsets.ModelViewSet):
    queryset = Vista.objects.all()
    serializer_class = VistaSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

class NoticiaViewSet(viewsets.ModelViewSet):
    queryset = Noticia.objects.all()
    serializer_class = NoticiaSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

class EventoViewSet(viewsets.ModelViewSet):
    queryset = Evento.objects.all()
    serializer_class = EventoSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

class SugerenciaViewSet(viewsets.ModelViewSet):
    queryset = Sugerencia.objects.all()
    serializer_class = SugerenciaSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

class ColaboradorViewSet(viewsets.ModelViewSet):
    queryset = Colaborador.objects.all()
    serializer_class = ColaboradorSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer
    permission_classes = [permissions.IsAuthenticated]

class AsuntoViewSet(viewsets.ModelViewSet):
    queryset = Asunto.objects.all()
    serializer_class = AsuntoSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

class BalanceViewSet(viewsets.ModelViewSet):
    queryset = Balance.objects.all()
    serializer_class = BalanceSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

class CursoEscolarViewSet(viewsets.ModelViewSet):
    queryset = CursoEscolar.objects.all()
    serializer_class = CursoEscolarSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

class ClaseViewSet(viewsets.ModelViewSet):
    queryset = Clase.objects.all()
    serializer_class = ClaseSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

class HijoViewSet(viewsets.ModelViewSet):
    queryset = Hijo.objects.all()
    serializer_class = HijoSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [IsOwnerOrAdmin]
        return [permission() for permission in permission_classes]

class PagoCursoViewSet(viewsets.ModelViewSet):
    queryset = PagoCurso.objects.all()
    serializer_class = PagoCursoSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            # Check if the user is the owner of the object or an admin
            permission_classes = [IsOwnerOrAdmin]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]
