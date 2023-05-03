<?php

namespace App\Http\Controllers;

use App\Models\Administrador;
use Illuminate\Http\Request;

class AdministradorController extends Controller
{
    public function index()
    {
        return Administrador::all();
    }

    public function store(Request $request)
    {
        $administrador = new Administrador;
        $administrador->email = $request->email;
        $administrador->password = $request->password;
        $administrador->save();

        return $administrador;
    }

    public function show(Administrador $administrador)
    {
        return $administrador;
    }

    public function update(Request $request, Administrador $administrador)
    {
        $administrador->email = $request->email;
        $administrador->password = $request->password;
        $administrador->save();

        return $administrador;
    }

    public function destroy($idAdministrador)
    {
        $administrador = Administrador::find($idAdministrador);

        if(is_null($administrador)) {
            return response()->json('No se pudo realizar la operación', 404);
        }

        $administrador->delete();
        return response()->noContent();
    }
    
    public function login(Request $request)
    {
        $response = ["status"=>0, "msg"=>""];

        $data = json_decode($request->getContent());
        $administrador = Administrador::where('email', $data->email)->first();

        if($administrador) {
            if(Hash::check($data->password, $administrador->password)) {
                $token = $administrador->createToken("example");
                $response["status"] = 1;
                $response["msg"] = $token->plainTextToken;
            } else {
                $response["msg"] = "Credenciales incorrectas.";
            }
        } else {
            $response["msg"] = "Administrador no encontrado.";
        }

        return response()->json($response);
    }
}
