from rest_framework import permissions, authentication
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import *
from .serializer import *

class IsSocioOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        pk = view.kwargs.get('pk')
        if request.user.is_staff:
            return True
        if pk and request.user.socio.id == int(pk):
            return True
        return False

# Create your views here.
class JoinEventoView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk=None):
        try:
            evento = Evento.objects.get(pk=pk)
        except Evento.DoesNotExist:
            return Response({'error': 'El evento especificado no existe'}, status=404)

        if not evento.visible:
            return Response({'error': 'El evento no está visible para inscripciones'}, status=400)

        if evento.socios.count() >= evento.capacidad:
            return Response({'error': 'El evento ha alcanzado su capacidad máxima'}, status=400)

        socio = request.user
        if socio in evento.socios.all():
            return Response({'error': 'El socio ya está inscrito en este evento'}, status=400)

        evento.socios.add(socio)
        return Response({'status': 'El socio se ha apuntado correctamente al evento'})
    
class CitasSocioList(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated, IsSocioOrAdmin]

    def get(self, request, *args, **kwargs):
        pk = self.kwargs.get('pk')
        socio = get_object_or_404(Socio, id=pk)
        citas = Cita.objects.filter(socio = socio)
        serializer = CitaSerializer(citas, many=True)
        return Response(serializer.data)

class HijosSocioList(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated, IsSocioOrAdmin]

    def get(self, request, *args, **kwargs):
        pk = self.kwargs.get('pk')
        socio = get_object_or_404(Socio, id=pk)
        hijos = Hijo.objects.filter(socio = socio)
        serializer = HijoSerializer(hijos, many=True)
        return Response(serializer.data)
    
class PagosCursoSocioList(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated, IsSocioOrAdmin]

    def get(self, request, *args, **kwargs):
        pk = self.kwargs.get('pk')
        socio = get_object_or_404(Socio, id=pk)
        pagos_curso = PagoCurso.objects.filter(socio = socio)
        serializer = PagoCursoSerializer(pagos_curso, many=True)
        return Response(serializer.data)