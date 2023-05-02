<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PagoCurso extends Model
{
    protected $fillable = [
        'cantidad',
        'estado',
        'metodo_pago',
        'fecha',
        'hora',
        'id_socio',
        'id_curso',
    ];
}
