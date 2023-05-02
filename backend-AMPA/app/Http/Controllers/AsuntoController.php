<?php

namespace App\Http\Controllers;

use App\Models\Asunto;
use Illuminate\Http\Request;

class AsuntoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Asunto::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $asunto = new Asunto;
        $asunto->nombre = $request->nombre;
        $asunto->minutos_frecuencia = $request->minutos_frecuencia;
        $asunto->fecha_inicio = $request->fecha_inicio;
        $asunto->fecha_fin = $request->fecha_fin;
        $asunto->hora_inicio = $request->hora_inicio;
        $asunto->hora_fin = $request->hora_fin;
        $asunto->save();

        return $asunto;
    }

    /**
     * Display the specified resource.
     */
    public function show(Asunto $asunto)
    {
        return $asunto;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Asunto $asunto)
    {
        $asunto->nombre = $request->nombre;
        $asunto->minutos_frecuencia = $request->minutos_frecuencia;
        $asunto->fecha_inicio = $request->fecha_inicio;
        $asunto->fecha_fin = $request->fecha_fin;
        $asunto->hora_inicio = $request->hora_inicio;
        $asunto->hora_fin = $request->hora_fin;
        $asunto->save();

        return $asunto;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($idAsunto)
    {
        $asunto = Asunto::find($idAsunto);

        if(is_null($asunto)) {
            return response()->json('No se pudo realizar la operación', 404);
        }

        $asunto->delete();
        return response()->noContent();
    }
}
