<?php

namespace App\Http\Controllers;

use App\Models\Socio;
use Illuminate\Http\Request;

class SocioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Socio::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $socio = new Socio;
        $socio->nombre = $request->nombre;
        $socio->apellidos = $request->apellidos;
        $socio->email = $request->email;
        $socio->password = $request->password;
        $socio->telefono = $request->telefono;
        $socio->dni = $request->dni;
        $socio->direccion = $request->direccion;
        $socio->active = $request->active;
        $socio->save();

        return $socio;
    }

    /**
     * Display the specified resource.
     */
    public function show(Socio $socio)
    {
        return $socio;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Socio $socio)
    {
        $socio->nombre = $request->nombre;
        $socio->apellidos = $request->apellidos;
        $socio->email = $request->email;
        $socio->password = $request->password;
        $socio->telefono = $request->telefono;
        $socio->dni = $request->dni;
        $socio->direccion = $request->direccion;
        $socio->active = $request->active;
        $socio->update();

        return $socio;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($idSocio)
    {
        $socio = Socio::find($idSocio);

        if(is_null($socio)) {
            return response()->json('No se pudo realizar la operación', 404);
        }

        $socio->delete();
        return response()->noContent();
    }
}
