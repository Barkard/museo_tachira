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
            'agents' => Agent::all(),
            'movementTypes' => MovementCatalog::all(),
            'transactionStatuses' => TransactionStatusCatalog::all(),
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
            'dimensions' => 'nullable|array',
            'dimensions.height' => 'nullable|numeric',
            'dimensions.width' => 'nullable|numeric',
            'dimensions.thickness' => 'nullable|numeric',
            'realization_date' => 'nullable|date',
            'brief_history' => 'nullable|string',
            'reference_value' => 'nullable|numeric',
            'is_research_piece' => 'boolean',
            'photograph_reference' => 'nullable|string|max:255',
            'images' => 'nullable|array|max:3',
            'images.*' => 'image|max:5120',

            // Campos de movimiento y ubicación inicial
            'movement_type_id' => 'required|exists:movement_catalogs,id',
            'agent_id' => 'required|exists:agents,id',
            'transaction_status_id' => 'required|exists:transaction_status_catalogs,id',
            'entry_exit_date' => 'required|date',
            'location_id' => 'required|exists:location_categories,id',
        ]);

        return DB::transaction(function () use ($request, $validated) {
            // 1. Crear el Movimiento de adquisición primero para obtener el ID
            $movement = Movement::create([
                'movement_type_id' => $validated['movement_type_id'],
                'agent_id' => $validated['agent_id'],
                'transaction_status_id' => $validated['transaction_status_id'],
                'user_id' => Auth::id(),
                'entry_exit_date' => $validated['entry_exit_date'],
            ]);

            // 2. Crear la pieza asociada al movimiento
            $pieceData = collect($validated)->except([
                'movement_type_id', 'agent_id', 'transaction_status_id',
                'entry_exit_date', 'location_id', 'images'
            ])->toArray();

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
                    $optimizedImage = $this->optimizeToBase64($image);
                    if ($optimizedImage) {
                        $piece->images()->create(['path' => $optimizedImage]);
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

    /**
     * Función Privada para Optimizar Imágenes "patroclo cochina" (Redimensionar + WebP)
     */
    private function optimizeToBase64($file)
    {
        try {
            // 1. Crear una imagen desde el archivo original
            $sourceString = file_get_contents($file);
            $image = imagecreatefromstring($sourceString);

            if (!$image) return null;

            // 2. Obtener dimensiones originales
            $width = imagesx($image);
            $height = imagesy($image);

            // 3. Definir ancho máximo
            $maxWidth = 1000;

            // Si la imagen es más grande, se redimensionamos
            if ($width > $maxWidth) {
                $newWidth = $maxWidth;
                $newHeight = floor($height * ($maxWidth / $width));

                // Crear lienzo vacío
                $trueColor = imagecreatetruecolor($newWidth, $newHeight);

                // Mantener transparencia
                imagealphablending($trueColor, false);
                imagesavealpha($trueColor, true);

                // Copiar y redimensionar
                imagecopyresampled($trueColor, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
                $finalImage = $trueColor;
            } else {
                // Si es pequeña, la dejamos tal cual
                $finalImage = $image;
                // Aún así nos aseguramos de preservar transparencia
                imagepalettetotruecolor($finalImage);
                imagealphablending($finalImage, false);
                imagesavealpha($finalImage, true);
            }

            // 4. Comprimir y Convertir a WebP en memoria (Buffer)
            ob_start();
            // Calidad del 80%
            imagewebp($finalImage, null, 80);
            $buffer = ob_get_contents();
            ob_end_clean();

            // Limpiar memoria RAM
            imagedestroy($image);
            if (isset($trueColor)) imagedestroy($trueColor);

            // 5. Retornar el string Base64 listo para la BD
            return 'data:image/webp;base64,' . base64_encode($buffer);

        } catch (\Exception $e) {
            // En caso de error (ej. formato raro), devolvemos null o manejamos el error
            return null;
        }
    }
}
