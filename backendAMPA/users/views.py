from rest_framework.views import APIView
from users.models import Administrador, Socio
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate

# Create your views here.
class LoginView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]

    def post(self, request):
        # Get the username and password from the request data
        username = request.data.get('username')
        password = request.data.get('password')

        if username is None or password is None:
            return Response({'error': 'Por favor, proporciona tanto el nombre de usuario como la contraseña.'}, status=400)
        
        # Buscar el usuario en ambos modelos
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'Credenciales inválidas.'}, status=401)

        # Authenticate the user using Django's built-in authentication
        user = authenticate(request, username=username, password=password)

        # If authentication fails, return an error response
        if not user:
            return Response({'error': 'Credenciales inválidas.'}, status=status.HTTP_401_UNAUTHORIZED)

        # If authentication succeeds, create a new token or retrieve an existing one
        token, _ = Token.objects.get_or_create(user=user)

        try:
            socio = Socio.objects.get(user_id=user.id)
        except Socio.DoesNotExist:
            administrador = Administrador.objects.get(user_id=user.id)
            # Return the token as a response
            return Response({'token': token.key, "administrador id": administrador.id})
        
        return Response({'token': token.key, "socio id": socio.id})
        
class LogoutView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        request.user.auth_token.delete()
        return Response({'message': 'Sesión cerrada'}, status=status.HTTP_200_OK)