<?php

namespace App\Http\Controllers;

use App\Models\Agent;
use App\Models\ClassificationCategory;
use App\Models\CurrentLocation;
use App\Models\LocationCategory;
use App\Models\Movement;
use App\Models\MovementCatalog;
use App\Models\Piece;
use App\Models\PieceImage;
use App\Models\TransactionStatusCatalog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PieceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Piece::query()->with(['classification', 'images']);

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
            'agents' => Agent::all(),
            'movementTypes' => MovementCatalog::all(),
            'locations' => LocationCategory::all(),
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
            'realization_date' => 'nullable|date',
            'brief_history' => 'nullable|string',
            'is_research_piece' => 'boolean',
            'photograph_reference' => 'nullable|string|max:255',
            'images' => 'nullable|array|max:3',
            'images.*' => 'image|max:5120',

            // Campos de movimiento y ubicación inicial
            'movement_type_id' => 'required|exists:movement_catalogs,id',
            'agent_id' => 'required|exists:agents,id',
            'entry_exit_date' => 'required|date',
            'location_id' => 'required|exists:location_categories,id',

            // Dimensiones y valor
            'height' => 'nullable|numeric|min:0',
            'width' => 'nullable|numeric|min:0',
            'depth' => 'nullable|numeric|min:0',
            'reference_value' => 'nullable|numeric|min:0',
        ]);

        return DB::transaction(function () use ($request, $validated) {
            // 1. Crear el Movimiento de adquisición primero para obtener el ID
            $movement = Movement::create([
                'movement_type_id' => $validated['movement_type_id'],
                'agent_id' => $validated['agent_id'],
                'transaction_status' => true,
                'user_id' => Auth::id(),
                'entry_exit_date' => $validated['entry_exit_date'],
            ]);

            // 2. Calcular dimensiones y construir datos de la pieza
            $dims = [];
            if (!empty($validated['height'])) $dims[] = "Alto: {$validated['height']} cm";
            if (!empty($validated['width'])) $dims[] = "Ancho: {$validated['width']} cm";
            if (!empty($validated['depth'])) $dims[] = "Profundidad: {$validated['depth']} cm";

            $pieceData = collect($validated)->except([
                'movement_type_id', 'agent_id',
                'entry_exit_date', 'location_id', 'images',
                'height', 'width', 'depth'
            ])->toArray();

            $pieceData['dimensions'] = implode(', ', $dims);

            $pieceData['movement_id'] = $movement->id;
            $piece = Piece::create($pieceData);

            // Actualizar el movimiento con el piece_id (si el modelo lo requiere)
            $movement->update(['piece_id' => $piece->id]);

            // 3. Crear la Ubicación inicial
            CurrentLocation::create([
                'piece_id' => $piece->id,
                'location_id' => $validated['location_id'],
                'user_id' => Auth::id(),
                'movement_date' => $validated['entry_exit_date'],
                'movement_reason' => 'Ubicación inicial al registrar pieza',
            ]);

            // 4. Procesar imágenes
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('pieces', 'public');
                    if ($path) {
                        $piece->images()->create(['path' => $path]);
                    }
                }
            }

            return redirect()->route('piezas.index')->with('success', 'Pieza, movimiento y ubicación registrados exitosamente.');
        });
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Piece $pieza)
    {
        // imágenes existentes
        $pieza->load('images');

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
            'realization_date' => 'nullable|date',
            'brief_history' => 'nullable|string',

            'is_research_piece' => 'boolean',
            'photograph_reference' => 'nullable|string|max:255',
            'images' => 'nullable|array|max:3',
            'images.*' => 'image|max:5120',
        ]);

        $pieza->update($validated);

        // aqui pa las nuevas imagenes
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $optimizedImage = $this->optimizeToBase64($image);
                if ($optimizedImage) {
                    $pieza->images()->create(['path' => $optimizedImage]);
                }
            }
        }

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

    public function checkUniqueness(Request $request)
    {
        $field = $request->input('field', 'registration_number');
        $value = $request->input('value');
        $excludeId = $request->input('exclude_id');

        $query = Piece::where($field, $value);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        $exists = $query->exists();

        return response()->json([
            'valid' => !$exists,
            'error' => $exists ? 'Este número de registro ya está en uso.' : null,
        ]);
    }

    /**
     * NOTE: Function optimizeToBase64 removed in favor of filesystem storage.
     * Images are now stored using $file->store() in the store method.
     */
}
