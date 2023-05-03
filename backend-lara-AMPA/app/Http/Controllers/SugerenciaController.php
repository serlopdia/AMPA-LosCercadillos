<?php

namespace App\Http\Controllers;

use App\Models\Sugerencia;
use Illuminate\Http\Request;

class SugerenciaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Sugerencia::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $sugerencia = new Sugerencia;
        $sugerencia->titulo = $request->titulo;
        $sugerencia->descripcion = $request->descripcion;
        $sugerencia->fecha = $request->fecha;
        $sugerencia->hora = $request->hora;
        $sugerencia->save();

        return $sugerencia;
    }

    /**
     * Display the specified resource.
     */
    public function show(Sugerencia $sugerencia)
    {
        return $sugerencia;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Sugerencia $sugerencia)
    {
        $sugerencia->titulo = $request->titulo;
        $sugerencia->descripcion = $request->descripcion;
        $sugerencia->fecha = $request->fecha;
        $sugerencia->hora = $request->hora;
        $sugerencia->save();

        return $sugerencia;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($idSugerencia)
    {
        $sugerencia = Sugerencia::find($idSugerencia);

        if(is_null($sugerencia)) {
            return response()->json('No se pudo realizar la operación', 404);
        }

        $sugerencia->delete();
        return response()->noContent();
    }
}
