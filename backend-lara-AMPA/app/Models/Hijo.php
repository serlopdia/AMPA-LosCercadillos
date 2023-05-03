<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hijo extends Model
{
    protected $fillable = [
        'nombre',
        'apellidos',
        'fecha_nacimiento',
        'id_socio',
    ];
}
