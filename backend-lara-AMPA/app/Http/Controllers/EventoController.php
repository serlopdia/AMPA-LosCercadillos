<?php

namespace App\Http\Controllers;

use App\Models\Evento;
use Illuminate\Http\Request;

class EventoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Evento::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $evento = new Evento;
        $evento->titulo = $request->titulo;
        $evento->descripcion = $request->descripcion;
        $evento->capacidad = $request->capacidad;
        $evento->precio = $request->precio;
        $evento->save();

        return $evento;
    }

    /**
     * Display the specified resource.
     */
    public function show(Evento $evento)
    {
        return $evento;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Evento $evento)
    {
        $evento->titulo = $request->titulo;
        $evento->descripcion = $request->descripcion;
        $evento->capacidad = $request->capacidad;
        $evento->precio = $request->precio;
        $evento->save();

        return $evento;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($idEvento)
    {
        $evento = Evento::find($idEvento);

        if(is_null($evento)) {
            return response()->json('No se pudo realizar la operación', 404);
        }

        $evento->delete();
        return response()->noContent();
    }
}
