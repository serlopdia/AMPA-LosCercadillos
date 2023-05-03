<?php

namespace App\Http\Controllers;

use App\Models\Noticia;
use Illuminate\Http\Request;

class NoticiaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Noticia::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $noticia = new Noticia;
        $noticia->titulo = $request->titulo;
        $noticia->texto = $request->texto;
        $noticia->imagen = $request->imagen;
        $noticia->fecha = $request->fecha;
        $noticia->hora = $request->hora;
        $noticia->save();

        return $noticia;
    }

    /**
     * Display the specified resource.
     */
    public function show(Noticia $noticia)
    {
        return $noticia;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Noticia $noticia)
    {
        $noticia->titulo = $request->titulo;
        $noticia->texto = $request->texto;
        $noticia->imagen = $request->imagen;
        $noticia->fecha = $request->fecha;
        $noticia->hora = $request->hora;
        $noticia->save();

        return $noticia;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($idNoticia)
    {
        $noticia = Noticia::find($idNoticia);

        if(is_null($noticia)) {
            return response()->json('No se pudo realizar la operación', 404);
        }

        $noticia->delete();
        return response()->noContent();
    }
}
