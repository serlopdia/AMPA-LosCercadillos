<?php

namespace App\Http\Controllers;

use App\Models\PagoCurso;
use Illuminate\Http\Request;

class PagoCursoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return PagoCurso::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $pagoCurso = new PagoCurso;
        $pagoCurso->cantidad = $request->cantidad;
        $pagoCurso->estado = $request->estado;
        $pagoCurso->metodo_pago = $request->metodo_pago;
        $pagoCurso->fecha = $request->fecha;
        $pagoCurso->hora = $request->hora;
        $pagoCurso->id_socio = $request->id_socio;
        $pagoCurso->id_curso = $request->id_curso;
        $pagoCurso->save();

        return $pagoCurso;
    }

    /**
     * Display the specified resource.
     */
    public function show(PagoCurso $pagoCurso)
    {
        return $pagoCurso;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PagoCurso $pagoCurso)
    {
        $pagoCurso->cantidad = $request->cantidad;
        $pagoCurso->estado = $request->estado;
        $pagoCurso->metodo_pago = $request->metodo_pago;
        $pagoCurso->fecha = $request->fecha;
        $pagoCurso->hora = $request->hora;
        $pagoCurso->id_socio = $request->id_socio;
        $pagoCurso->id_curso = $request->id_curso;
        $pagoCurso->save();

        return $pagoCurso;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($idPagoCurso)
    {
        $pagoCurso = PagoCurso::find($idPagoCurso);

        if(is_null($pagoCurso)) {
            return response()->json('No se pudo realizar la operación', 404);
        }

        $pagoCurso->delete();
        return response()->noContent();
    }
}
