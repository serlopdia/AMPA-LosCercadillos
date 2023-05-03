<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use Illuminate\Http\Request;

class CitaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Cita::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $cita = new Cita;
        $cita->fecha = $request->fecha;
        $cita->hora = $request->hora;
        $cita->id_socio = $request->id_socio;
        $cita->id_asunto = $request->id_asunto;
        $cita->save();

        return $cita;
    }

    /**
     * Display the specified resource.
     */
    public function show(Cita $cita)
    {
        return $cita;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Cita $cita)
    {
        $cita->fecha = $request->fecha;
        $cita->hora = $request->hora;
        $cita->id_socio = $request->id_socio;
        $cita->id_asunto = $request->id_asunto;
        $cita->save();

        return $cita;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($idCita)
    {
        $cita = Cita::find($idCita);

        if(is_null($cita)) {
            return response()->json('No se pudo realizar la operación', 404);
        }

        $cita->delete();
        return response()->noContent();
    }
}
