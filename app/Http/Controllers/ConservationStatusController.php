<?php

namespace App\Http\Controllers;

use App\Models\ConservationStatus;
use App\Models\Piece;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ConservationStatusController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $statuses = ConservationStatus::query()
            ->with(['piece', 'user'])
            ->when($search, function ($query, $search) {
                $query->whereHas('piece', function ($q) use ($search) {
                    $q->where('piece_name', 'like', "%{$search}%")
                      ->orWhere('registration_number', 'like', "%{$search}%");
                })->orWhere('status_details', 'like', "%{$search}%");
            })
            ->latest('evaluation_date')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('ConservationStatuses/Index', [
            'statuses' => $statuses,
            'filters' => ['search' => $search],
        ]);
    }

    public function create()
    {
        return Inertia::render('ConservationStatuses/Create', [
            'pieces' => Piece::select('id', 'piece_name', 'registration_number')->get(),
            'users' => User::select('id', 'first_name', 'last_name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'piece_id' => 'required|exists:pieces,id',
            'evaluation_date' => 'required|date',
            'status_details' => 'required|string',
            'applied_intervention' => 'nullable|string',
            'user_id' => 'nullable|exists:users,id',
        ]);

        if (empty($validated['user_id'])) {
            $validated['user_id'] = Auth::id();
        }

        ConservationStatus::create($validated);

        return redirect()->route('conservacion.index');
    }

    public function edit(ConservationStatus $status)
    {
        return Inertia::render('ConservationStatuses/Edit', [
            'status' => $status,
            'pieces' => Piece::select('id', 'piece_name', 'registration_number')->get(),
            'users' => User::select('id', 'first_name', 'last_name')->get(),
        ]);
    }

    public function update(Request $request, ConservationStatus $status)
    {
        $validated = $request->validate([
            'piece_id' => 'required|exists:pieces,id',
            'evaluation_date' => 'required|date',
            'status_details' => 'required|string',
            'applied_intervention' => 'nullable|string',
            'user_id' => 'required|exists:users,id',
        ]);

        $status->update($validated);

        return redirect()->route('conservacion.index');
    }

    public function destroy(ConservationStatus $status)
    {
        $status->delete();
        return redirect()->route('conservacion.index');
    }
}
