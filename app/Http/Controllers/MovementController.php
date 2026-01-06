<?php

namespace App\Http\Controllers;

use App\Models\Movement;
use App\Models\MovementCatalog;
use App\Models\Agent;
use App\Models\TransactionStatusCatalog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class MovementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Movement::query()
            ->with(['movementCatalog', 'agent', 'transactionStatus', 'user', 'piece']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('agent', function ($q) use ($search) {
                $q->where('name_legal_entity', 'like', "%{$search}%");
            })->orWhereHas('piece', function ($q) use ($search) {
                $q->where('piece_name', 'like', "%{$search}%");
            });
        }

        $movements = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Movements/Index', [
            'movements' => $movements,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Movements/Create', [
            'movementTypes' => MovementCatalog::all(),
            'agents' => Agent::all(),
            'statuses' => TransactionStatusCatalog::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'movement_type_id' => 'required|exists:movement_catalogs,id',
            'agent_id' => 'required|exists:agents,id',
            'transaction_status_id' => 'required|exists:transaction_status_catalogs,id',
            'entry_exit_date' => 'required|date',
        ]);

        $validated['user_id'] = Auth::id();

        Movement::create($validated);

        return redirect()->route('movimientos.index')->with('success', 'Movimiento registrado exitosamente.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Movement $movimiento)
    {
        return Inertia::render('Movements/Edit', [
            'movement' => $movimiento,
            'movementTypes' => MovementCatalog::all(),
            'agents' => Agent::all(),
            'statuses' => TransactionStatusCatalog::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Movement $movimiento)
    {
        $validated = $request->validate([
            'movement_type_id' => 'required|exists:movement_catalogs,id',
            'agent_id' => 'required|exists:agents,id',
            'transaction_status_id' => 'required|exists:transaction_status_catalogs,id',
            'entry_exit_date' => 'required|date',
        ]);

        $movimiento->update($validated);

        return redirect()->route('movimientos.index')->with('success', 'Movimiento actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Movement $movimiento)
    {
        $movimiento->delete();

        return redirect()->route('movimientos.index')->with('success', 'Movimiento eliminado exitosamente.');
    }
}
