<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sugerencia extends Model
{
    protected $fillable = [
        'titulo',
        'descripcion',
        'fecha',
        'hora',
    ];
}
