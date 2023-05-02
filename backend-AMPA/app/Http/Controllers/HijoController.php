<?php

namespace App\Http\Controllers;

use App\Models\Hijo;
use Illuminate\Http\Request;

class HijoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Hijo::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $hijo = new Hijo;
        $hijo->nombre = $request->nombre;
        $hijo->apellidos = $request->apellidos;
        $hijo->fecha_nacimiento = $request->fecha_nacimiento;
        $hijo->id_socio = $request->id_socio;
        $hijo->save();

        return $hijo;
    }

    /**
     * Display the specified resource.
     */
    public function show(Hijo $hijo)
    {
        return $hijo;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Hijo $hijo)
    {
        $hijo->nombre = $request->nombre;
        $hijo->apellidos = $request->apellidos;
        $hijo->fecha_nacimiento = $request->fecha_nacimiento;
        $hijo->id_socio = $request->id_socio;
        $hijo->save();

        return $hijo;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($idHijo)
    {
        $hijo = Hijo::find($idHijo);

        if(is_null($hijo)) {
            return response()->json('No se pudo realizar la operación', 404);
        }

        $hijo->delete();
        return response()->noContent();
    }
}
