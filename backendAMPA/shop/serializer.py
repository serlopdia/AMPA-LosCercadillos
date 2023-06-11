from rest_framework import serializers
from .models import LineaPedido, Pago, Pedido, Producto, StockProducto

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

    def create(self, validated_data):
        pedido = Pedido.objects.create(**validated_data)
        return pedido

    def update(self, instance, validated_data):
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.email = validated_data.get('email', instance.email)
        instance.telefono = validated_data.get('telefono', instance.telefono)
        instance.estado = validated_data.get('estado', instance.estado)
        instance.observaciones = validated_data.get('observaciones', instance.observaciones)
        instance.pago = validated_data.get('pago', instance.pago)
        instance.socio = validated_data.get('socio', instance.socio)
        instance.save()
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

    def create(self, validated_data):
        stock_producto = StockProducto.objects.create(**validated_data)
        return stock_producto

    def update(self, instance, validated_data):
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.cantidad = validated_data.get('cantidad', instance.cantidad)
        instance.producto = validated_data.get('producto', instance.producto)
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
