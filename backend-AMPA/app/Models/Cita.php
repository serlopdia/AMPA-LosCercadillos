<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cita extends Model
{
    protected $fillable = [
        'fecha',
        'hora',
        'id_socio',
        'id_asunto',
    ];
}
