<?php

namespace App\Http\Controllers;

use App\Models\Pago;
use Illuminate\Http\Request;

class PagoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Pago::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $pago = new Pago;
        $pago->cantidad = $request->cantidad;
        $pago->estado = $request->estado;
        $pago->metodo_pago = $request->metodo_pago;
        $pago->fecha = $request->fecha;
        $pago->hora = $request->hora;
        $pago->id_socio = $request->id_socio;
        $pago->id_pedido = $request->id_pedido;
        $pago->id_evento = $request->id_evento;
        $pago->save();

        return $pago;
    }

    /**
     * Display the specified resource.
     */
    public function show(Pago $pago)
    {
        return $pago;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pago $pago)
    {
        $pago->cantidad = $request->cantidad;
        $pago->estado = $request->estado;
        $pago->metodo_pago = $request->metodo_pago;
        $pago->fecha = $request->fecha;
        $pago->hora = $request->hora;
        $pago->id_socio = $request->id_socio;
        $pago->id_pedido = $request->id_pedido;
        $pago->id_evento = $request->id_evento;
        $pago->save();

        return $pago;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($idPago)
    {
        $pago = Pago::find($idPago);

        if(is_null($pago)) {
            return response()->json('No se pudo realizar la operación', 404);
        }

        $pago->delete();
        return response()->noContent();
    }
}
