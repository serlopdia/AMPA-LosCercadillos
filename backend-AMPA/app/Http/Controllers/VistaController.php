<?php

namespace App\Http\Controllers;

use App\Models\Vista;
use Illuminate\Http\Request;

class VistaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Vista::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $vista = new Vista;
        $vista->nombre = $request->nombre;
        $vista->markdown = $request->markdown;
        $vista->save();

        return $vista;
    }

    /**
     * Display the specified resource.
     */
    public function show(Vista $vista)
    {
        return $vista;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Vista $vista)
    {
        $vista->nombre = $request->nombre;
        $vista->markdown = $request->markdown;
        $vista->save();

        return $vista;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($idVista)
    {
        $vista = Vista::find($idVista);

        if(is_null($vista)) {
            return response()->json('No se pudo realizar la operación', 404);
        }

        $vista->delete();
        return response()->noContent();
    }
}
