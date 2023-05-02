<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asunto extends Model
{
    protected $fillable = [
        'nombre',
        'minutos_frecuencia',
        'fecha_inicio',
        'fecha_fin',
        'hora_inicio',
        'hora_fin',
    ];
}
