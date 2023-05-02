<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    protected $fillable = [
        'estado',
        'notas',
        'fecha',
        'hora',
        'id_socio',
    ];
}
