<?php

namespace App\Http\Controllers;

use App\Models\CurrentLocation;
use App\Models\Piece;
use App\Models\LocationCategory;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class CurrentLocationController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $locations = CurrentLocation::query()
            ->with(['piece', 'locationCategory', 'user'])
            ->when($search, function ($query, $search) {
                $query->whereHas('piece', function ($q) use ($search) {
                    $q->where('piece_name', 'like', "%{$search}%")
                      ->orWhere('registration_number', 'like', "%{$search}%");
                })->orWhereHas('locationCategory', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            })
            ->latest('movement_date') // Show newest first
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('CurrentLocations/Index', [
            'locations' => $locations,
            'filters' => ['search' => $search],
        ]);
    }

    public function create()
    {
        return Inertia::render('CurrentLocations/Create', [
            'pieces' => Piece::select('id', 'piece_name', 'registration_number')->get(),
            'locations' => LocationCategory::select('id', 'name')->get(),
            'users' => User::select('id', 'first_name', 'last_name')->get(), // In case admin wants to record for someone else, or just auto-assign
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'piece_id' => 'required|exists:pieces,id',
            'location_id' => 'required|exists:location_categories,id',
            'movement_date' => 'required|date',
            'movement_reason' => 'nullable|string',
            'user_id' => 'nullable|exists:users,id', // Optional, defaults to Auth user
        ]);

        if (empty($validated['user_id'])) {
            $validated['user_id'] = Auth::id();
        }

        CurrentLocation::create($validated);

        return redirect()->route('historial-ubicaciones.index');
    }

    public function edit(CurrentLocation $location)
    {
        // Parameter name mismatch in route? we'll see. 
        // Route::resource uses model binding.
        
        return Inertia::render('CurrentLocations/Edit', [
            'location' => $location,
            'pieces' => Piece::select('id', 'piece_name', 'registration_number')->get(),
            'locations' => LocationCategory::select('id', 'name')->get(),
            'users' => User::select('id', 'first_name', 'last_name')->get(),
        ]);
    }

    public function update(Request $request, CurrentLocation $location)
    {
        $validated = $request->validate([
            'piece_id' => 'required|exists:pieces,id',
            'location_id' => 'required|exists:location_categories,id',
            'movement_date' => 'required|date',
            'movement_reason' => 'nullable|string',
            'user_id' => 'required|exists:users,id',
        ]);

        $location->update($validated);

        return redirect()->route('historial-ubicaciones.index');
    }

    public function destroy(CurrentLocation $location)
    {
        $location->delete();
        return redirect()->route('historial-ubicaciones.index');
    }
}
