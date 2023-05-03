<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Curso extends Model
{
    protected $fillable = [
        'nombre',
        'precio_cuota',
        'fecha_inicio',
        'fecha_fin',
    ];
}
