# Generated by Django 4.0 on 2023-06-18 22:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Asunto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=32)),
                ('fecha_inicio', models.DateField()),
                ('fecha_fin', models.DateField()),
                ('hora_inicio', models.TimeField(verbose_name=['%H:%M'])),
                ('hora_fin', models.TimeField(verbose_name=['%H:%M'])),
                ('minutos_frecuencia', models.IntegerField()),
                ('dias_semana', models.CharField(max_length=64)),
                ('visible', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Balance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tipo', models.CharField(choices=[('INGRESO', 'Ingreso'), ('GASTO', 'Gasto')], max_length=64)),
                ('asunto', models.CharField(max_length=128)),
                ('cantidad', models.FloatField(max_length=64)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Cita',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha', models.DateField()),
                ('hora', models.TimeField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Clase',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('curso', models.IntegerField()),
                ('letra', models.CharField(max_length=2)),
                ('tipo_clase', models.CharField(choices=[('INFANTIL', 'Infantil'), ('PRIMARIA', 'Primaria')], max_length=16)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Colaborador',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=64)),
                ('ventaja', models.CharField(blank=True, default='', max_length=128)),
                ('descripcion', models.CharField(max_length=2048)),
                ('imagen', models.CharField(blank=True, default='', max_length=2048)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='CursoEscolar',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=64)),
                ('precio_cuota', models.FloatField(max_length=64)),
                ('fecha_inicio', models.DateField()),
                ('fecha_fin', models.DateField()),
                ('actual', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Evento',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titulo', models.CharField(max_length=128)),
                ('descripcion', models.CharField(max_length=2048)),
                ('capacidad', models.IntegerField()),
                ('visible', models.BooleanField(default=True)),
                ('fin_inscripcion', models.DateTimeField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Noticia',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titulo', models.CharField(max_length=128)),
                ('cuerpo', models.TextField(max_length=2048)),
                ('imagen', models.CharField(blank=True, default='', max_length=2048)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Sugerencia',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=64)),
                ('email', models.CharField(max_length=128)),
                ('titulo', models.CharField(max_length=128)),
                ('descripcion', models.TextField(max_length=2048)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Vista',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tipo', models.CharField(choices=[('PRINCIPAL', 'Principal'), ('COLEGIO', 'Colegio'), ('COMEDOR', 'Comedor'), ('VENTAJAS', 'Ventajas')], max_length=64)),
                ('markdown', models.TextField(blank=True, default='')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='PagoCurso',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cantidad', models.FloatField(max_length=64)),
                ('estado', models.CharField(choices=[('PAGADO', 'Pagado'), ('PENDIENTE', 'Pendiente'), ('RECHAZADO', 'Rechazado')], max_length=64)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('curso_escolar', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='ampa.cursoescolar')),
            ],
        ),
    ]
