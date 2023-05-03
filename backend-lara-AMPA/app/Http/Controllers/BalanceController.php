<?php

namespace App\Http\Controllers;

use App\Models\Balance;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BalanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Balance::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $balance = new Balance;
        $balance->asunto = $request->asunto;
        $balance->cantidad = $request->cantidad;
        $balance->fecha = $request->fecha;
        $balance->tipo = $request->tipo;
        $balance->save();

        return $balance;
    }

    /**
     * Display the specified resource.
     */
    public function show(Balance $balance)
    {
        return $balance;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Balance $balance)
    {
        $balance->asunto = $request->asunto;
        $balance->cantidad = $request->cantidad;
        $balance->fecha = $request->fecha;
        $balance->tipo = $request->tipo;
        $balance->save();

        return $balance;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($idBalance)
    {
        $balance = Balance::find($idBalance);

        if(is_null($balance)) {
            return response()->json('No se pudo realizar la operación', 404);
        }

        $balance->delete();
        return response()->noContent();
    }
}
