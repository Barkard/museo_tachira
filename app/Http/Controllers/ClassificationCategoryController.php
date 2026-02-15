<?php

namespace App\Http\Controllers;

use App\Models\ClassificationCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassificationCategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = ClassificationCategory::query();

        if ($request->has('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        $classifications = $query->paginate(10)->withQueryString();

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
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:classification_categories,name',
            'description' => 'nullable|string',
        ]);

        $classification = ClassificationCategory::create($validated);

        // If AJAX request (from modal), return JSON
        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'data' => $classification,
                'message' => 'Clasificación creada exitosamente.'
            ], 201);
        }

        // Otherwise, redirect as usual
        return redirect()->route('clasificaciones.index')->with('success', 'Clasificación creada.');
    }

    public function edit(ClassificationCategory $clasificacione)
    {
        return Inertia::render('Classifications/Edit', [
            'classification' => $clasificacione,
        ]);
    }

    public function update(Request $request, ClassificationCategory $clasificacione)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:classification_categories,name,' . $clasificacione->id,
            'description' => 'nullable|string',
        ]);

        $clasificacione->update($validated);

        return redirect()->route('clasificaciones.index')->with('success', 'Clasificación actualizada.');
    }

    public function destroy(ClassificationCategory $clasificacione)
    {
        $clasificacione->delete();
        return redirect()->route('clasificaciones.index')->with('success', 'Clasificación eliminada.');
    }
}
