<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware('guest')->group(function () {
    Route::get('login', [LoginController::class, 'create'])->name('login');
    Route::post('login', [LoginController::class, 'store']);
    Route::get('register', [RegisterController::class, 'create'])->name('register');
    Route::post('register', [RegisterController::class, 'store']);
});

Route::post('logout', [LoginController::class, 'destroy'])->name('logout');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('piezas', \App\Http\Controllers\PieceController::class);
    Route::resource('agentes', \App\Http\Controllers\AgentController::class);
    Route::resource('movimientos', \App\Http\Controllers\MovementController::class);
    
    // Catalogs
    Route::resource('clasificaciones', \App\Http\Controllers\ClassificationCategoryController::class);
    Route::resource('ubicaciones', \App\Http\Controllers\LocationCategoryController::class);
    Route::resource('tipos-movimiento', \App\Http\Controllers\MovementCatalogController::class);
    Route::resource('estados', \App\Http\Controllers\TransactionStatusCatalogController::class);
    Route::resource('roles', \App\Http\Controllers\RoleController::class);
    Route::resource('contextos', \App\Http\Controllers\PieceContextController::class)->parameters(['contextos' => 'context']);
    Route::resource('historial-ubicaciones', \App\Http\Controllers\CurrentLocationController::class)->parameters(['historial-ubicaciones' => 'location']);
    Route::resource('conservacion', \App\Http\Controllers\ConservationStatusController::class)->parameters(['conservacion' => 'status']);
});

require __DIR__.'/settings.php';
