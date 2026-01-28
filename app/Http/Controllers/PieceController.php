<?php

namespace App\Http\Controllers;

use App\Models\ClassificationCategory;
use App\Models\Piece;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PieceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Piece::query()->with('classification');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('piece_name', 'like', "%{$search}%")
                  ->orWhere('registration_number', 'like', "%{$search}%");
            });
        }

        $pieces = $query->paginate(10)->withQueryString();

        return Inertia::render('Pieces/Index', [
            'pieces' => $pieces,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Pieces/Create', [
            'classifications' => ClassificationCategory::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'piece_name' => 'required|string|max:255',
            'registration_number' => 'required|string|unique:pieces,registration_number|max:50',
            'classification_id' => 'required|exists:classification_categories,id',
            'description' => 'nullable|string',
            'author_ethnicity' => 'nullable|string|max:255',
            'dimensions' => 'nullable|array',
            'dimensions.height' => 'nullable|numeric',
            'dimensions.width' => 'nullable|numeric',
            'dimensions.thickness' => 'nullable|numeric',
            'realization_date' => 'nullable|date',
            'brief_history' => 'nullable|string',
            'reference_value' => 'nullable|numeric',
            'is_research_piece' => 'boolean',
            /* 'photograph_reference' => 'nullable|string|max:255', */
        ]);

        Piece::create($validated);

        return redirect()->route('piezas.index')->with('success', 'Pieza creada exitosamente.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Piece $pieza)
    {
        return Inertia::render('Pieces/Edit', [
            'piece' => $pieza,
            'classifications' => ClassificationCategory::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Piece $pieza)
    {
        $validated = $request->validate([
            'piece_name' => 'required|string|max:255',
            'registration_number' => 'required|string|max:50|unique:pieces,registration_number,' . $pieza->id,
            'classification_id' => 'required|exists:classification_categories,id',
            'description' => 'nullable|string',
            'author_ethnicity' => 'nullable|string|max:255',
            'dimensions' => 'nullable|array',
            'dimensions.height' => 'nullable|numeric',
            'dimensions.width' => 'nullable|numeric',
            'dimensions.thickness' => 'nullable|numeric',
            'realization_date' => 'nullable|date',
            'brief_history' => 'nullable|string',
            'reference_value' => 'nullable|numeric',
            'is_research_piece' => 'boolean',
            /* 'photograph_reference' => 'nullable|string|max:255', */
        ]);

        $pieza->update($validated);

        return redirect()->route('piezas.index')->with('success', 'Pieza actualizada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Piece $pieza)
    {
        $pieza->delete();

        return redirect()->route('piezas.index')->with('success', 'Pieza eliminada exitosamente.');
    }
}
