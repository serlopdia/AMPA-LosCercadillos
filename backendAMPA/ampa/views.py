from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.http import JsonResponse
from rest_framework import permissions, authentication, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import *
from .serializer import *
import stripe

stripe.api_key = settings.STRIPE_SECRET_KEY
webhook_secret = settings.STRIPE_WEBHOOK_SECRET

FRONTEND_CHECKOUT_SUCCESS_URL = settings.CHECKOUT_SUCCESS_URL
FRONTEND_CHECKOUT_FAILED_URL = settings.CHECKOUT_FAILED_URL

class IsSocioOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        pk = view.kwargs.get('pk')
        if request.user.is_staff:
            return True
        if pk and request.user.socio.id == int(pk):
            return True
        return False
    
class EstadoPago(models.TextChoices):
    PAGADO = "PAGADO", _("Pagado"),
    PENDIENTE = "PENDIENTE", _("Pendiente"),
    RECHAZADO = "RECHAZADO", _("Rechazado"),

class IsSocioAbonado(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        # Verificar si el usuario tiene un PagoCurso asociado en estado "PAGADO" con el curso_escolar actual
        curso_actual = CursoEscolar.objects.filter(actual=True).first()
        if curso_actual:
            pago_curso = PagoCurso.objects.filter(socio=request.user.socio, curso_escolar=curso_actual, estado=EstadoPago.PAGADO).first()
            if pago_curso:
                return True

        return False

# Create your views here.
class JoinEventoView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [IsSocioAbonado]

    def post(self, request, pk=None):
        try:
            evento = Evento.objects.get(pk=pk)
        except Evento.DoesNotExist:
            return Response({'error': 'El evento especificado no existe'}, status=404)

        if not evento.visible:
            return Response({'error': 'El evento no está visible para inscripciones'}, status=400)

        socio = Socio.objects.get(user=request.user)
        if socio in evento.socios.all():
            return Response({'error': 'El socio ya está inscrito en este evento'}, status=400)

        evento.socios.add(socio)
        return Response({'status': 'El socio se ha apuntado correctamente al evento'})
    
class LeaveEventoView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [IsSocioAbonado]

    def post(self, request, pk=None):
        try:
            evento = Evento.objects.get(pk=pk)
        except Evento.DoesNotExist:
            return Response({'error': 'El evento especificado no existe'}, status=404)

        if not evento.visible:
            return Response({'error': 'El evento no está visible para inscripciones'}, status=400)

        socio = Socio.objects.get(user=request.user)
        if socio not in evento.socios.all():
            return Response({'error': 'El socio no está inscrito en este evento'}, status=400)

        evento.socios.remove(socio)
        return Response({'status': 'El socio ha sido eliminado correctamente del evento'})
    
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
    
class AsuntoDisponibilidadDia(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAdminUser, IsSocioAbonado]

    def post(self, request):
        asunto_id = request.data.get('asunto_id')
        fecha_str = request.data.get('fecha')

        asunto = get_object_or_404(Asunto, id=asunto_id)

        try:
            fecha = datetime.strptime(fecha_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({'error': 'Fecha no válida'}, status=400)

        if fecha < asunto.fecha_inicio or fecha > asunto.fecha_fin:
            return Response({'error': 'La fecha está fuera de los rangos del asunto de la cita'}, status=400)

        citas = Cita.objects.filter(asunto=asunto, fecha=fecha)
        horas_ocupadas = set(cita.hora for cita in citas)

        hora_inicio = asunto.hora_inicio
        hora_fin = asunto.hora_fin
        minutos_frecuencia = asunto.minutos_frecuencia

        horas_disponibles = []
        hora_actual = datetime.combine(datetime.today().date(), hora_inicio)

        while hora_actual.time() <= hora_fin:
            if hora_actual.time() not in horas_ocupadas:
                horas_disponibles.append(hora_actual.time().strftime('%H:%M'))

            hora_actual += timedelta(minutes=minutos_frecuencia)

        return Response(horas_disponibles)

class CreateCuotaCheckoutSession(APIView):
    def post(self, request):
        dataDict = dict(request.data)
        price = int(dataDict['price'] * 100)
        product_name = dataDict['product_name']
        quantity = dataDict['quantity']
        idCurso = dataDict['idCurso']
        idSocio = dataDict['idSocio']
        
        try:
            checkout_session = stripe.checkout.Session.create(
                line_items=[{
                    'price_data': {
                        'currency': 'eur',
                        'product_data': {
                            'name': product_name,
                        },
                        'unit_amount': price
                    },
                    'quantity': quantity
                }],
                mode='payment',
                success_url=dataDict['successUrl'],
                cancel_url=dataDict['cancelUrl'],
                payment_intent_data={
                    'metadata': {
                        'idCurso': idCurso,
                        'idSocio': idSocio,
                    }
                }
            )

            return Response({'url': checkout_session.url})

        except stripe.error.InvalidRequestError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class PagoCursoStripeWebhook(APIView):
    def post(self, request):
        event = None
        payload = request.body
        sig_header = request.META['HTTP_STRIPE_SIGNATURE']

        try:
            event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
        except ValueError as err:
            # Invalid payload
            raise err
        except stripe.error.SignatureVerificationError as err:
            # Invalid signature
            raise err

        # Handle the event
        if event.type == 'payment_intent.succeeded':
            session = event.data.object
            
            payment_data = session['metadata']
            payment_amount = session['amount']
            payment_idCurso = payment_data['idCurso']
            payment_idSocio = payment_data['idSocio']

            socio = get_object_or_404(Socio, id=payment_idSocio)
            curso_escolar = get_object_or_404(CursoEscolar, id=payment_idCurso)

            pago_curso = PagoCurso.objects.create(
                cantidad=payment_amount/100,
                estado=EstadoPago.PAGADO,
                socio=socio,
                curso_escolar=curso_escolar
            )
            pago_curso.save()
            
        elif event.type == 'payment_intent.canceled' or event.type == 'payment_intent.payment_failed':
            session = event.data.object
            
            payment_data = session['metadata']
            payment_amount = session['amount']
            payment_idCurso = payment_data['idCurso']
            payment_idSocio = payment_data['idSocio']

            socio = get_object_or_404(Socio, id=payment_idSocio)
            curso_escolar = get_object_or_404(CursoEscolar, id=payment_idCurso)

            pago_curso = PagoCurso.objects.create(
                cantidad=payment_amount/100,
                estado=EstadoPago.RECHAZADO,
                socio=socio,
                curso_escolar=curso_escolar
            )
            pago_curso.save()

        return JsonResponse({'success': True})
