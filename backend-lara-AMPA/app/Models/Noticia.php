<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Noticia extends Model
{
    protected $fillable = [
        'titulo',
        'texto',
        'imagen',
        'fecha',
        'hora',
    ];
}
