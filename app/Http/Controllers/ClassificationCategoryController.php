<?php

namespace App\Http\Controllers;

use App\Models\ClassificationCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class ClassificationCategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = ClassificationCategory::query();

        if ($request->has('search')) {
            $query->where('name', 'ilike', "%{$request->search}%"); // ilike para búsqueda insensible en Postgres
        }

        $classifications = $query->orderBy('name', 'asc')->paginate(10)->withQueryString();

        return Inertia::render('Classifications/Index', [
            'classifications' => $classifications,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Classifications/Create');
    }

    public function store(Request $request)
    {
        // Validamos manualmente la existencia ignorando mayúsculas/minúsculas
        $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) {
                    $exists = ClassificationCategory::whereRaw('LOWER(name) = ?', [strtolower($value)])->exists();
                    if ($exists) {
                        $fail('Esta clasificación ya existe.');
                    }
                },
            ],
            'description' => 'nullable|string',
        ]);

        ClassificationCategory::create([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return redirect()->route('clasificaciones.index')->with('success', 'Clasificación creada con éxito.');
    }

    public function edit(ClassificationCategory $clasificacione)
    {
        return Inertia::render('Classifications/Edit', [
            'classification' => $clasificacione,
        ]);
    }

    public function update(Request $request, ClassificationCategory $clasificacione)
    {
        $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) use ($clasificacione) {
                    $exists = ClassificationCategory::whereRaw('LOWER(name) = ?', [strtolower($value)])
                        ->where('id', '!=', $clasificacione->id)
                        ->exists();
                    if ($exists) {
                        $fail('El nombre ya está registrado en otra categoría.');
                    }
                },
            ],
            'description' => 'nullable|string',
        ]);

        $clasificacione->update($request->only(['name', 'description']));

        return redirect()->route('clasificaciones.index')->with('success', 'Clasificación actualizada con éxito.');
    }

    public function destroy(ClassificationCategory $clasificacione)
    {
        $clasificacione->delete();
        return redirect()->route('clasificaciones.index')->with('success', 'Clasificación eliminada.');
    }
}