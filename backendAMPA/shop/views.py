from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.db.models import F
from django.http import JsonResponse
from rest_framework import permissions, authentication, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ampa.models import CursoEscolar, PagoCurso
from .models import *
from .serializer import *
import stripe

stripe.api_key = settings.STRIPE_SECRET_KEY
webhook_secret = settings.STRIPE_PAGOTIENDA_WEBHOOK_SECRET

FRONTEND_CHECKOUT_SUCCESS_URL = settings.CHECKOUT_SUCCESS_URL
FRONTEND_CHECKOUT_FAILED_URL = settings.CHECKOUT_FAILED_URL
    
class EstadoPago(models.TextChoices):
    PAGADO = "PAGADO", _("Pagado"),
    PENDIENTE = "PENDIENTE", _("Pendiente"),
    RECHAZADO = "RECHAZADO", _("Rechazado"),

class IsOwnerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        pk = view.kwargs.get('pk')
        if request.user.is_staff:
            return True
        if pk and request.user.socio.id == int(pk):
            return True
        return False

class IsSocioAbonadoOwnerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        pk = view.kwargs.get('pk')
        if not request.user.is_authenticated:
            return False
        if request.user.is_staff:
            return True
        elif not pk:
            # Verificar si el usuario tiene un PagoCurso asociado en estado "PAGADO" con el curso_escolar actual
            curso_actual = CursoEscolar.objects.filter(actual=True).first()
            if curso_actual:
                pago_curso = PagoCurso.objects.filter(socio=request.user.socio, curso_escolar=curso_actual, estado=EstadoPago.PAGADO).first()
                if pago_curso:
                    return True
        elif pk and request.user.socio.id == int(pk):
            # Verificar si el usuario tiene un PagoCurso asociado en estado "PAGADO" con el curso_escolar actual
            curso_actual = CursoEscolar.objects.filter(actual=True).first()
            if curso_actual:
                pago_curso = PagoCurso.objects.filter(socio=request.user.socio, curso_escolar=curso_actual, estado=EstadoPago.PAGADO).first()
                if pago_curso:
                    return True

        return False

class IsSocioAbonado(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.user.is_staff:
            return False
        else:
            # Verificar si el usuario tiene un PagoCurso asociado en estado "PAGADO" con el curso_escolar actual
            curso_actual = CursoEscolar.objects.filter(actual=True).first()
            if curso_actual:
                pago_curso = PagoCurso.objects.filter(socio=request.user.socio, curso_escolar=curso_actual, estado=EstadoPago.PAGADO).first()
                if pago_curso:
                    return True

        return False

class IsSocioAbonado(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.user.is_staff:
            return False
        else:
            # Verificar si el usuario tiene un PagoCurso asociado en estado "PAGADO" con el curso_escolar actual
            curso_actual = CursoEscolar.objects.filter(actual=True).first()
            if curso_actual:
                pago_curso = PagoCurso.objects.filter(socio=request.user.socio, curso_escolar=curso_actual, estado=EstadoPago.PAGADO).first()
                if pago_curso:
                    return True

        return False
    
class PagosSocioList(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [IsOwnerOrAdmin]

    def get(self, request, *args, **kwargs):
        pk = self.kwargs.get('pk')
        socio = get_object_or_404(Socio, id=pk)
        pagos = Pago.objects.filter(socio = socio)
        serializer = PagoSerializer(pagos, many=True)
        return Response(serializer.data)

class PedidosSocioList(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [IsOwnerOrAdmin]

    def get(self, request, *args, **kwargs):
        pk = self.kwargs.get('pk')
        socio = get_object_or_404(Socio, id=pk)
        pedidos = Pedido.objects.filter(socio = socio)
        serializer = PedidoSerializer(pedidos, many=True)
        return Response(serializer.data)

class CreateCompraCheckoutSession(APIView):
    def post(self, request):
        dataDict = dict(request.data)
        price = int(dataDict['price'] * 100)
        product_name = dataDict['product_name']
        nombre = dataDict['nombre']
        email = dataDict['email']
        telefono = dataDict['telefono']
        idPedido = dataDict['idPedido']
        idSocio = dataDict['idSocio']
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
                payment_intent_data={
                    'metadata': {
                        'nombre': nombre,
                        'email': email,
                        'telefono': telefono,
                        'idPedido': idPedido,
                        'idSocio': idSocio,
                    }
                }
            )

            return Response({'url': checkout_session.url})

        except stripe.error.InvalidRequestError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CompraStripeWebhook(APIView):
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
            payment_nombre = payment_data['nombre']
            payment_email = payment_data['email']
            payment_telefono = payment_data['telefono']
            payment_idPedido = payment_data['idPedido']
            payment_idSocio = payment_data.get('idSocio')

            pedido = get_object_or_404(Pedido, id=payment_idPedido)
            if payment_idSocio is None:
                socio = None
            else:
                socio = get_object_or_404(Socio, id=payment_idSocio)

            pago = Pago.objects.create(
                nombre=payment_nombre,
                email=payment_email,
                telefono=payment_telefono,
                cantidad=payment_amount/100,
                estado=EstadoPago.PAGADO,
                socio=socio,
            )
            pago.save()

            lineas_pedido = LineaPedido.objects.filter(pedido=pedido)
            for linea_pedido in lineas_pedido:
                producto = linea_pedido.producto
                stock = linea_pedido.stock
                cantidad = linea_pedido.cantidad
                StockProducto.objects.filter(id=stock.id).update(cantidad=F('cantidad') - cantidad)

            pedido.pago = pago
            pedido.estado = EstadoPedido.PREPARACION
            pedido.save()

        elif event.type == 'payment_intent.canceled' or event.type == 'payment_intent.payment_failed':
            session = event.data.object
            
            payment_data = session['metadata']
            payment_amount = session['amount']
            payment_nombre = payment_data['nombre']
            payment_email = payment_data['email']
            payment_telefono = payment_data['telefono']
            payment_idPedido = payment_data['idPedido']
            payment_idSocio = payment_data.get('idSocio')  # Obtener el valor o None si no existe la clave

            pedido = get_object_or_404(Pedido, id=payment_idPedido)
            if payment_idSocio is None:
                socio = None
            else:
                socio = get_object_or_404(Socio, id=payment_idSocio)

            pago = Pago.objects.create(
                nombre=payment_nombre,
                email=payment_email,
                telefono=payment_telefono,
                cantidad=payment_amount/100,
                estado=EstadoPago.RECHAZADO,
                socio=socio,
            )
            pago.save()

            pedido.pago = pago
            pedido.estado = EstadoPedido.CANCELADO
            pedido.save()

        return JsonResponse({'success': True})
