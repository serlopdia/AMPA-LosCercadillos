<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Producto::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $producto = new Producto;
        $producto->nombre = $request->producto;
        $producto->descripcion = $request->descripcion;
        $producto->imagen = $request->imagen;
        $producto->precio_general = $request->precio_general;
        $producto->precio_socio = $request->precio_socio;
        $producto->stock = $request->stock;
        $producto->save();

        return $producto;
    }

    /**
     * Display the specified resource.
     */
    public function show(Producto $producto)
    {
        return $producto;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Producto $producto)
    {
        $producto->nombre = $request->producto;
        $producto->descripcion = $request->descripcion;
        $producto->imagen = $request->imagen;
        $producto->precio_general = $request->precio_general;
        $producto->precio_socio = $request->precio_socio;
        $producto->stock = $request->stock;
        $producto->save();

        return $producto;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($idProducto)
    {
        $producto = Producto::find($idProducto);

        if(is_null($producto)) {
            return response()->json('No se pudo realizar la operación', 404);
        }

        $producto->delete();
        return response()->noContent();
    }
}
