# Generated by Django 4.0 on 2023-06-18 22:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='LineaPedido',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cantidad', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Pago',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=128)),
                ('email', models.CharField(max_length=128)),
                ('telefono', models.CharField(max_length=20)),
                ('estado', models.CharField(choices=[('PAGADO', 'Pagado'), ('PENDIENTE', 'Pendiente'), ('RECHAZADO', 'Rechazado')], max_length=64)),
                ('cantidad', models.FloatField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Producto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=64)),
                ('descripcion', models.CharField(max_length=1024)),
                ('precio_general', models.FloatField()),
                ('precio_socio', models.FloatField()),
                ('imagen', models.CharField(max_length=2048)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='StockProducto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=64)),
                ('cantidad', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('producto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='shop.producto')),
            ],
        ),
        migrations.CreateModel(
            name='Pedido',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=128)),
                ('email', models.CharField(max_length=128)),
                ('telefono', models.CharField(max_length=20)),
                ('estado', models.CharField(choices=[('ENTREGADO', 'Entregado'), ('PREPARACION', 'Preparación'), ('DEVUELTO', 'Devuelto'), ('CANCELADO', 'Cancelado'), ('NO_PAGADO', 'No pagado')], max_length=64)),
                ('observaciones', models.CharField(blank=True, max_length=512, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('pago', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='shop.pago')),
            ],
        ),
    ]
