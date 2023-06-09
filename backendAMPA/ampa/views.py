from django.conf import settings
from django.http import HttpResponse, JsonResponse
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

        socio = Socio.objects.get(user=request.user)
        if socio in evento.socios.all():
            return Response({'error': 'El socio ya está inscrito en este evento'}, status=400)

        evento.socios.add(socio)
        return Response({'status': 'El socio se ha apuntado correctamente al evento'})
    
class LeaveEventoView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

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
    permission_classes = [permissions.IsAuthenticated]

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

def stripe_webhook(request):
    # Verificar la autenticidad del evento de Stripe utilizando tu clave secreta de Stripe
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except ValueError as e:
        # La firma del evento no es válida
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        # No se pudo verificar la firma del evento
        return HttpResponse(status=400)

    # Procesar el evento payment_intent.succeeded
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        # Obtener los datos necesarios del payment_intent
        payment_amount = payment_intent['amount']
        payment_currency = payment_intent['currency']
        payment_idCurso = payment_intent['metadata']['idCurso']
        payment_idSocio = payment_intent['metadata']['idSocio']
        # Crear el objeto PagoCurso en la base de datos
        pago_curso = PagoCurso.objects.create(
            cantidad=payment_amount,
            estado=EstadoPago.PAGADO,
            socio=payment_idSocio,
            curso_escolar_id=payment_idCurso
        )
        pago_curso.save()

    return HttpResponse(status=200)

class CreateCuotaCheckoutSession(APIView):
    def post(self, request):
        dataDict = dict(request.data)
        price = int(dataDict['price'] * 100)
        product_name = dataDict['product_name']
        quantity = dataDict['quantity']
        
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
            )

            return Response({'url': checkout_session.url})

        except stripe.error.InvalidRequestError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CreatePagoCursoStripe(APIView):
    def post(self, request):
        event = stripe.Webhook.construct_event(
            request.data,  # Pasar el cuerpo de la solicitud como bytes
            request.META.get('HTTP_STRIPE_SIGNATURE'),  # Pasar la firma de la solicitud
            settings.STRIPE_WEBHOOK_SECRET  # Pasar tu clave secreta de Stripe
        )

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            # Verificar el estado del pago en Stripe
            if session['payment_status'] == 'paid':
                cantidad = session['amount_total'] / 100
                estado = 'ACEPTADO'
                idCurso = session['metadata']['idCurso']
                socio_id = request.user.socio.id

                # Crea el PagoCurso
                pago_curso = PagoCurso.objects.create(
                    cantidad=cantidad,
                    estado=estado,
                    socio_id=socio_id,
                    curso_escolar_id=idCurso
                )

                return Response(status=status.HTTP_201_CREATED)

        return Response(status=status.HTTP_400_BAD_REQUEST)