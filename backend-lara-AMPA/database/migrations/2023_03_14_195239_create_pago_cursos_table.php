<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pago_cursos', function (Blueprint $table) {
            $table->id();
            $table->float('cantidad');
            $table->string('estado');
            $table->string('metodo_pago');
            $table->date('fecha');
            $table->time('hora');
            $table->foreign('id_socio');
            $table->foreign('id_curso');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pago_cursos');
    }
};
