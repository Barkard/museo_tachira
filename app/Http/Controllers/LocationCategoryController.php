<?php

namespace App\Http\Controllers;

use App\Models\LocationCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LocationCategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = LocationCategory::query();

        if ($request->has('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        $locations = $query->paginate(10)->withQueryString();

        return Inertia::render('Locations/Index', [
            'locations' => $locations,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Locations/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:location_categories,name',
            'description' => 'nullable|string',
        ]);

        LocationCategory::create($validated);

        return redirect()->route('ubicaciones.index')->with('success', 'Ubicación creada.');
    }

    public function edit(LocationCategory $ubicacione)
    {
        return Inertia::render('Locations/Edit', [
            'location' => $ubicacione,
        ]);
    }

    public function update(Request $request, LocationCategory $ubicacione)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:location_categories,name,' . $ubicacione->id,
            'description' => 'nullable|string',
        ]);

        $ubicacione->update($validated);

        return redirect()->route('ubicaciones.index')->with('success', 'Ubicación actualizada.');
    }

    public function destroy(LocationCategory $ubicacione)
    {
        $ubicacione->delete();
        return redirect()->route('ubicaciones.index')->with('success', 'Ubicación eliminada.');
    }
}
