<?php

namespace App\Http\Controllers;

use App\Models\LineaPedido;
use Illuminate\Http\Request;

class LineaPedidoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return LineaPedido::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $lineaPedido = new LineaPedido;
        $lineaPedido->cantidad = $request->cantidad;
        $lineaPedido->id_producto = $request->id_producto;
        $lineaPedido->id_pedido = $request->id_pedido;
        $lineaPedido->save();

        return $lineaPedido;
    }

    /**
     * Display the specified resource.
     */
    public function show(LineaPedido $lineaPedido)
    {
        return $lineaPedido;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, LineaPedido $lineaPedido)
    {
        $lineaPedido->cantidad = $request->cantidad;
        $lineaPedido->id_producto = $request->id_producto;
        $lineaPedido->id_pedido = $request->id_pedido;
        $lineaPedido->save();

        return $lineaPedido;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($idLineaPedido)
    {
        $lineaPedido = LineaPedido::find($idLineaPedido);

        if(is_null($lineaPedido)) {
            return response()->json('No se pudo realizar la operación', 404);
        }

        $lineaPedido->delete();
        return response()->noContent();
    }
}
