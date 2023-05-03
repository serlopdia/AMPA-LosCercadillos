<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AdministradorController;
use App\Http\Controllers\AsuntoController;
use App\Http\Controllers\CitaController;
use App\Http\Controllers\ColaboradorController;
use App\Http\Controllers\CursoController;
use App\Http\Controllers\EventoController;
use App\Http\Controllers\HijoController;
use App\Http\Controllers\LineaPedidoController;
use App\Http\Controllers\NoticiaController;
use App\Http\Controllers\PagoController;
use App\Http\Controllers\PagoCursoController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\SocioController;
use App\Http\Controllers\SugerenciaController;
use App\Http\Controllers\VistaController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

/*Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});*/

Route::apiResource('administradores', AdministradorController::class);
Route::apiResource('asuntos', AsuntoController::class);
Route::apiResource('citas', CitaController::class);
Route::apiResource('colaboradores', ColaboradorController::class);
Route::apiResource('cursos', CursoController::class);
Route::apiResource('eventos', EventoController::class);
Route::apiResource('hijos', HijoController::class);
Route::apiResource('lineas-pedidos', LineaPedidoController::class);
Route::apiResource('noticias', NoticiaController::class);
Route::apiResource('pagos', PagoController::class);
Route::apiResource('pagos-curso', PagoCursoController::class);
Route::apiResource('pedidos', PedidoController::class);
Route::apiResource('productos', ProductoController::class);
Route::apiResource('socios', SocioController::class);
Route::apiResource('sugerencias', SugerenciaController::class);
Route::apiResource('vistas', VistaController::class);
