from rest_framework.authentication import TokenAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Evento

# Create your views here.
class JoinEventoView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

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
