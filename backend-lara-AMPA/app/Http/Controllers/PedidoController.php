<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use Illuminate\Http\Request;

class PedidoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Pedido::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $pedido = new Pedido;
        $pedido->estado = $request->estado;
        $pedido->notas = $request->notas;
        $pedido->fecha = $request->fecha;
        $pedido->hora = $request->hora;
        $pedido->id_socio = $request->id_socio;
        $pedido->save();

        return $pedido;
    }

    /**
     * Display the specified resource.
     */
    public function show(Pedido $pedido)
    {
        return $pedido;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pedido $pedido)
    {
        $pedido->estado = $request->estado;
        $pedido->notas = $request->notas;
        $pedido->fecha = $request->fecha;
        $pedido->hora = $request->hora;
        $pedido->id_socio = $request->id_socio;
        $pedido->save();

        return $pedido;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($idPedido)
    {
        $pedido = Pedido::find($idPedido);

        if(is_null($pedido)) {
            return response()->json('No se pudo realizar la operación', 404);
        }

        $pedido->delete();
        return response()->noContent();
    }
}
