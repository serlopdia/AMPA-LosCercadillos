<?php

namespace App\Http\Controllers;

use App\Models\Curso;
use Illuminate\Http\Request;

class CursoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Curso::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $curso = new Curso;
        $curso->nombre = $request->nombre;
        $curso->precio_cuota = $request->precio_cuota;
        $curso->fecha_inicio = $request->fecha_inicio;
        $curso->fecha_fin = $request->fecha_fin;
        $curso->save();

        return $curso;
    }

    /**
     * Display the specified resource.
     */
    public function show(Curso $curso)
    {
        return $curso;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Curso $curso)
    {
        $curso->nombre = $request->nombre;
        $curso->precio_cuota = $request->precio_cuota;
        $curso->fecha_inicio = $request->fecha_inicio;
        $curso->fecha_fin = $request->fecha_fin;
        $curso->save();

        return $curso;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($idCurso)
    {
        $curso = Curso::find($idCurso);

        if(is_null($curso)) {
            return response()->json('No se pudo realizar la operación', 404);
        }

        $curso->delete();
        return response()->noContent();
    }
}
