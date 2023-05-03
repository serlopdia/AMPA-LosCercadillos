<?php

namespace App\Http\Controllers;

use App\Models\Colaborador;
use Illuminate\Http\Request;

class ColaboradorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Colaborador::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $colaborador = new Colaborador;
        $colaborador->nombre = $request->nombre;
        $colaborador->descripcion = $request->descripcion;
        $colaborador->ventaja = $request->ventaja;
        $colaborador->save();

        return $colaborador;
    }

    /**
     * Display the specified resource.
     */
    public function show(Colaborador $colaborador)
    {
        return $colaborador;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Colaborador $colaborador)
    {
        $colaborador->nombre = $request->nombre;
        $colaborador->descripcion = $request->descripcion;
        $colaborador->ventaja = $request->ventaja;
        $colaborador->save();

        return $colaborador;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($idColaborador)
    {
        $colaborador = Colaborador::find($idColaborador);

        if(is_null($colaborador)) {
            return response()->json('No se pudo realizar la operación', 404);
        }

        $colaborador->delete();
        return response()->noContent();
    }
}
