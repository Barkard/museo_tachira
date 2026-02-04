<?php

namespace App\Http\Controllers;

use App\Models\ClassificationCategory;
use App\Models\Piece;
use App\Models\PieceImage; 
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

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
            'realization_date' => 'nullable|date',
            'brief_history' => 'nullable|string',

            'is_research_piece' => 'boolean',
            'photograph_reference' => 'nullable|string|max:255',
            'images' => 'nullable|array|max:3',
            'images.*' => 'image|max:5120', 
        ]);

        // Crear la pieza
        $piece = Piece::create($validated);

        // Procesar para comprimir la imagen pinche patroclo.
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $optimizedImage = $this->optimizeToBase64($image);
                
                if ($optimizedImage) {
                    $piece->images()->create(['path' => $optimizedImage]);
                }
            }
        }

        return redirect()->route('piezas.index')->with('success', 'Pieza creada exitosamente.');
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