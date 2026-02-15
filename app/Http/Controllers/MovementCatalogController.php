<?php

namespace App\Http\Controllers;

use App\Models\MovementCatalog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MovementCatalogController extends Controller
{
    public function index(Request $request)
    {
        $query = MovementCatalog::query();

        if ($request->has('search')) {
            $query->where('movement_name', 'like', "%{$request->search}%");
        }

        $types = $query->paginate(10)->withQueryString();

        return Inertia::render('MovementTypes/Index', [
            'types' => $types,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('MovementTypes/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'movement_name' => 'required|string|max:255|unique:movement_catalogs,movement_name',
        ]);

        $movementType = MovementCatalog::create($validated);

        // If AJAX request (from modal), return JSON
        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'data' => $movementType,
                'message' => 'Tipo de movimiento creado exitosamente.'
            ], 201);
        }

        // Otherwise, redirect as usual
        return redirect()->route('tipos-movimiento.index')->with('success', 'Tipo de movimiento creado.');
    }

    public function edit(MovementCatalog $tipos_movimiento)
    {
        return Inertia::render('MovementTypes/Edit', [
            'type' => $tipos_movimiento,
        ]);
    }

    public function update(Request $request, MovementCatalog $tipos_movimiento)
    {
        $validated = $request->validate([
            'movement_name' => 'required|string|max:255|unique:movement_catalogs,movement_name,' . $tipos_movimiento->id,
        ]);

        $tipos_movimiento->update($validated);

        return redirect()->route('tipos-movimiento.index')->with('success', 'Tipo de movimiento actualizado.');
    }

    public function destroy(MovementCatalog $tipos_movimiento)
    {
        $tipos_movimiento->delete();
        return redirect()->route('tipos-movimiento.index')->with('success', 'Tipo de movimiento eliminado.');
    }
}
