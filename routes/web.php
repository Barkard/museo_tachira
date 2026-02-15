<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;


use App\Http\Controllers\PieceController;
use App\Http\Controllers\CurrentLocationController;
use App\Http\Controllers\LocationCategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AgentController;


//Route::get('/', function () {
  //  return Inertia::render('welcome', [
     //   'canRegister' => Features::enabled(Features::registration()),
   // ]);
//})->name('home');

use App\Http\Controllers\Auth\ValidationController;

Route::redirect('/', '/login');

Route::middleware('guest')->group(function () {
    Route::get('login', [LoginController::class, 'create'])->name('login');
    Route::post('login', [LoginController::class, 'store']);
    Route::get('register', [RegisterController::class, 'create'])->name('register');
    Route::post('register', [RegisterController::class, 'store']);
    Route::post('register/validate', [ValidationController::class, 'validateField'])->name('register.validate');
});

Route::post('logout', [LoginController::class, 'destroy'])->name('logout');


use App\Http\Controllers\UserController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');


    Route::get('piezas/check-uniqueness', [PieceController::class, 'checkUniqueness'])->name('piezas.check-uniqueness');
    Route::resource('piezas', PieceController::class);
    Route::resource('agentes', \App\Http\Controllers\AgentController::class);
    Route::resource('movimientos', \App\Http\Controllers\MovementController::class);
    Route::resource('agentes', AgentController::class);


    Route::resource('clasificaciones', \App\Http\Controllers\ClassificationCategoryController::class);


    Route::resource('ubicaciones', LocationCategoryController::class);

    Route::resource('tipos-movimiento', \App\Http\Controllers\MovementCatalogController::class);
    Route::resource('estados', \App\Http\Controllers\TransactionStatusCatalogController::class);
    Route::get('usuarios/check-uniqueness', [UserController::class, 'checkUniqueness'])->name('usuarios.check-uniqueness');
    Route::resource('usuarios', UserController::class);
    Route::resource('contextos', \App\Http\Controllers\PieceContextController::class)->parameters(['contextos' => 'context']);
    Route::resource('historial-ubicaciones', CurrentLocationController::class)->parameters(['historial-ubicaciones' => 'location']);
    Route::resource('conservacion', \App\Http\Controllers\ConservationStatusController::class)->parameters(['conservacion' => 'status']);
});



require __DIR__.'/settings.php';
