from rest_framework import serializers
from .models import LineaPedido, Pago, Pedido, Producto, StockProducto
import re

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ('id', 'nombre', 'descripcion', 'precio_general', 'precio_socio', 'imagen', 'created_at')
        read_only_fields = ('id', 'created_at')
        extra_kwargs = {
            'nombre': {'required': True},
            'descripcion': {'required': True},
            'precio_general': {'required': True},
            'precio_socio': {'required': True},
        }

    def create(self, validated_data):
        producto = Producto.objects.create(**validated_data)
        return producto

    def update(self, instance, validated_data):
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.descripcion = validated_data.get('descripcion', instance.descripcion)
        instance.precio_general = validated_data.get('precio_general', instance.precio_general)
        instance.precio_socio = validated_data.get('precio_socio', instance.precio_socio)
        instance.imagen = validated_data.get('imagen', instance.imagen)
        instance.save()
        return instance

class PagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pago
        fields = ('id', 'nombre', 'email', 'telefono', 'estado', 'cantidad', 'socio', 'created_at')
        read_only_fields = ('id', 'created_at')
        extra_kwargs = {
            'nombre': {'required': True},
            'email': {'required': True},
            'telefono': {'required': True},
            'estado': {'required': True},
            'cantidad': {'required': True},
        }

    def validate_estado(self, value):
        if value not in ['PAGADO', 'PENDIENTE', 'RECHAZADO']:
            raise serializers.ValidationError("El valor del campo 'estado' debe ser uno de los siguientes: 'PAGADO', 'PENDIENTE', 'RECHAZADO'")
        return value

    def validate_telefono(self, value):
        if not re.match(r'^\d{9}$', value):
            raise serializers.ValidationError("El número de teléfono debe tener 9 dígitos.")
        return value

    def validate_email(self, value):
        if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', value):
            raise serializers.ValidationError("El correo electrónico no tiene un formato válido.")
        return value

    def validate_cantidad(self, value):
        if value < 0:
            raise serializers.ValidationError("La cantidad debe ser un número positivo o igual a 0.")
        return value

    def create(self, validated_data):
        pago = Pago.objects.create(**validated_data)
        return pago

    def update(self, instance, validated_data):
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.email = validated_data.get('email', instance.email)
        instance.telefono = validated_data.get('telefono', instance.telefono)
        instance.estado = validated_data.get('estado', instance.estado)
        instance.cantidad = validated_data.get('cantidad', instance.cantidad)
        instance.socio = validated_data.get('socio', instance.socio)
        instance.save()
        return instance
    
class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = ('id', 'nombre', 'email', 'telefono', 'estado', 'observaciones', 'pago', 'socio', 'created_at')
        read_only_fields = ('id', 'created_at')
        extra_kwargs = {
            'nombre': {'required': True},
            'email': {'required': True},
            'telefono': {'required': True},
            'estado': {'required': True},
            'pago': {'required': True},
        }

    def validate_estado(self, value):
        if value not in ['ENTREGADO', 'PREPARACION', 'DEVUELTO', 'CANCELADO', 'NO_PAGADO']:
            raise serializers.ValidationError("El valor del campo 'estado' debe ser uno de los siguientes: 'ENTREGADO', 'PREPARACION', 'CANCELADO', 'NO_PAGADO'")
        return value

    def validate_telefono(self, value):
        if not re.match(r'^\d{9}$', value):
            raise serializers.ValidationError("El número de teléfono debe tener 9 dígitos.")
        return value

    def validate_email(self, value):
        if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', value):
            raise serializers.ValidationError("El correo electrónico no tiene un formato válido.")
        return value

    def create(self, validated_data):
        lineas_pedido = validated_data.pop('lineas_pedido', [])
        pago = validated_data.get('pago', None)

        if pago and pago.estado == 'PAGADO':
            for linea_pedido in lineas_pedido:
                stock_producto = linea_pedido['stock'].producto
                cantidad = linea_pedido['cantidad']
                stock_producto.cantidad -= cantidad
                stock_producto.save()

        pedido = Pedido.objects.create(**validated_data)
        for linea_pedido in lineas_pedido:
            linea_pedido['pedido'] = pedido
            LineaPedido.objects.create(**linea_pedido)

        return pedido

    def update(self, instance, validated_data):
        lineas_pedido = validated_data.pop('lineas_pedido', [])
        pago = validated_data.get('pago', None)
        estado_anterior = instance.estado

        if estado_anterior != 'PAGADO' and pago and pago.estado == 'PAGADO':
            for linea_pedido_data in lineas_pedido:
                stock_producto = linea_pedido_data['stock'].producto
                cantidad = linea_pedido_data['cantidad']
                stock_producto.cantidad -= cantidad
                stock_producto.save()

        instance = super().update(instance, validated_data)

        nuevo_estado = validated_data.get('estado', estado_anterior)

        if estado_anterior in ['ENTREGADO', 'PREPARACION'] and instance.estado in ['DEVUELTO', 'CANCELADO']:
            for linea_pedido in lineas_pedido:
                stock_producto = linea_pedido['stock'].producto
                cantidad = linea_pedido['cantidad']
                stock_producto.cantidad += cantidad
                stock_producto.save()

        elif estado_anterior in ['DEVUELTO', 'CANCELADO'] and instance.estado in ['ENTREGADO', 'PREPARACION']:
            for linea_pedido in lineas_pedido:
                stock_producto = linea_pedido['stock'].producto
                cantidad = linea_pedido['cantidad']
                stock_producto.cantidad -= cantidad
                stock_producto.save()

        # Actualizar las líneas de pedido existentes
        for linea_pedido_data in lineas_pedido:
            linea_pedido_id = linea_pedido_data.get('id', None)
            if linea_pedido_id:
                linea_pedido = LineaPedido.objects.get(id=linea_pedido_id)
                linea_pedido.producto = linea_pedido_data.get('producto', linea_pedido.producto)
                linea_pedido.stock = linea_pedido_data.get('stock', linea_pedido.stock)
                linea_pedido.cantidad = linea_pedido_data.get('cantidad', linea_pedido.cantidad)
                linea_pedido.pedido = linea_pedido_data.get('pedido', linea_pedido.pedido)
                linea_pedido.save()

        return instance
    
class StockProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockProducto
        fields = ('id', 'nombre', 'cantidad', 'producto', 'created_at')
        read_only_fields = ('id', 'created_at')
        extra_kwargs = {
            'nombre': {'required': True},
            'cantidad': {'required': True},
            'producto': {'required': True},
        }

    def validate_cantidad(self, value):
        if value < 0:
            raise serializers.ValidationError("La cantidad debe ser mayor o igual a cero.")
        return value

    def create(self, validated_data):
        cantidad = validated_data.get('cantidad', 0)
        self.validate_cantidad(cantidad)

        nombre = validated_data.get('nombre', None)
        producto = validated_data.get('producto', None)
        if StockProducto.objects.filter(nombre__iexact=nombre, producto=producto).exists():
            raise serializers.ValidationError("Ya existe un stock con el mismo nombre para este producto.")

        stock_producto = StockProducto.objects.create(**validated_data)
        return stock_producto

    def update(self, instance, validated_data):
        cantidad = validated_data.get('cantidad', instance.cantidad)
        self.validate_cantidad(cantidad)

        nombre = validated_data.get('nombre', instance.nombre)
        producto = validated_data.get('producto', instance.producto)
        if StockProducto.objects.filter(nombre__iexact=nombre, producto=producto).exclude(id=instance.id).exists():
            raise serializers.ValidationError("Ya existe otro stock con el mismo nombre para este producto.")

        instance.nombre = nombre
        instance.cantidad = cantidad
        instance.producto = producto
        instance.save()
        return instance
    
class LineaPedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = LineaPedido
        fields = ('id', 'producto', 'stock', 'cantidad', 'pedido', 'created_at')
        read_only_fields = ('id', 'created_at')
        extra_kwargs = {
            'producto': {'required': True},
            'stock': {'required': True},
            'cantidad': {'required': True},
            'pedido': {'required': True},
        }

    def validate_cantidad(self, value):
        if value < 0:
            raise serializers.ValidationError("La cantidad debe ser mayor o igual a cero.")
        return value
    
    def create(self, validated_data):
        linea_pedido = LineaPedido.objects.create(**validated_data)
        return linea_pedido

    def update(self, instance, validated_data):
        instance.producto = validated_data.get('producto', instance.producto)
        instance.stock = validated_data.get('stock', instance.stock)
        instance.cantidad = validated_data.get('cantidad', instance.cantidad)
        instance.pedido = validated_data.get('pedido', instance.pedido)
        instance.save()
        return instance
