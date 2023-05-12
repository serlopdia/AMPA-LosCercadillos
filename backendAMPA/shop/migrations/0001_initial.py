# Generated by Django 4.2 on 2023-05-12 03:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Pago',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('estado', models.CharField(choices=[('PAGADO', 'Pagado'), ('PENDIENTE', 'Pendiente'), ('RECHAZADO', 'Rechazado')], max_length=64)),
                ('cantidad', models.FloatField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('socio', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='users.socio')),
            ],
        ),
        migrations.CreateModel(
            name='Producto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=64)),
                ('descripcion', models.CharField(max_length=256)),
                ('precio_general', models.FloatField()),
                ('precio_socio', models.FloatField()),
                ('imagen', models.CharField(max_length=2048)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Pedido',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('estado', models.CharField(choices=[('ENTREGADO', 'Entregado'), ('PREPARACION', 'Preparación'), ('CANCELADO', 'Cancelado')], max_length=64)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('pago', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='shop.pago')),
                ('socio', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='users.socio')),
            ],
        ),
        migrations.CreateModel(
            name='LineaPedido',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cantidad', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('pedido', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='shop.pedido')),
                ('producto', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='shop.producto')),
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
            options={
                'unique_together': {('nombre', 'producto')},
            },
        ),
    ]