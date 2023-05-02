<?php

namespace App\Http\Controllers;

use App\Models\Administrador;
use Illuminate\Http\Request;

class AdministradorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Administrador::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $administrador = new Administrador;
        $administrador->email = $request->email;
        $administrador->password = $request->password;
        $administrador->save();

        return $administrador;
    }

    /**
     * Display the specified resource.
     */
    public function show(Administrador $administrador)
    {
        return $administrador;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Administrador $administrador)
    {
        $administrador->email = $request->email;
        $administrador->password = $request->password;
        $administrador->save();

        return $administrador;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($idAdministrador)
    {
        $administrador = Administrador::find($idAdministrador);

        if(is_null($administrador)) {
            return response()->json('No se pudo realizar la operación', 404);
        }

        $administrador->delete();
        return response()->noContent();
    }
}
