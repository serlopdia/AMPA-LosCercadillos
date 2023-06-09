from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404, redirect
from rest_framework import permissions, authentication
from django.conf import settings
from shop.models import *
from shop.serializer import *
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
    
class PagosSocioList(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated, IsSocioOrAdmin]

    def get(self, request, *args, **kwargs):
        pk = self.kwargs.get('pk')
        socio = get_object_or_404(Socio, id=pk)
        pagos = Pago.objects.filter(socio = socio)
        serializer = PagoSerializer(pagos, many=True)
        return Response(serializer.data)

class PedidosSocioList(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        pk = self.kwargs.get('pk')
        socio = get_object_or_404(Socio, id=pk)
        pedidos = Pedido.objects.filter(socio = socio)
        serializer = PedidoSerializer(pedidos, many=True)
        return Response(serializer.data)
    
class CreateCheckoutSession(APIView):
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
                success_url=FRONTEND_CHECKOUT_SUCCESS_URL,
                cancel_url=FRONTEND_CHECKOUT_FAILED_URL,
            )
            return Response({'url': checkout_session.url})
        except stripe.error.InvalidRequestError as e:
            return Response({'error': str(e)})

class WebHook(APIView):
  def post(self , request):
    event = None
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']

    try:
      event = stripe.Webhook.construct_event(
        payload ,sig_header , webhook_secret
        )
    except ValueError as err:
        # Invalid payload
        raise err
    except stripe.error.SignatureVerificationError as err:
        # Invalid signature
        raise err

    # Handle the event
    if event.type == 'payment_intent.succeeded':
      payment_intent = event.data.object 
      print("--------payment_intent ---------->" , payment_intent)
    elif event.type == 'payment_method.attached':
      payment_method = event.data.object 
      print("--------payment_method ---------->" , payment_method)
    # ... handle other event types
    else:
      print('Unhandled event type {}'.format(event.type))

    return JsonResponse(success=True, safe=False)