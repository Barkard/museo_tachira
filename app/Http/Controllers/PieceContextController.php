<?php

namespace App\Http\Controllers;

use App\Models\Piece;
use App\Models\PieceContext;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PieceContextController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $contexts = PieceContext::query()
            ->with(['piece'])
            ->when($search, function ($query, $search) {
                $query->where('provenance_location', 'like', "%{$search}%")
                    ->orWhereHas('piece', function ($q) use ($search) {
                        $q->where('piece_name', 'like', "%{$search}%")
                          ->orWhere('registration_number', 'like', "%{$search}%");
                    });
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('PieceContexts/Index', [
            'contexts' => $contexts,
            'filters' => ['search' => $search],
        ]);
    }

    public function create()
    {
        // Only pieces that don't have a context yet
        $pieces = Piece::doesntHave('context')->select('id', 'piece_name', 'registration_number')->get();

        return Inertia::render('PieceContexts/Create', [
            'pieces' => $pieces,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'piece_id' => 'required|exists:pieces,id|unique:piece_contexts,piece_id',
            'provenance_location' => 'nullable|string|max:255',
            'bibliographic_references' => 'nullable|string',
        ]);

        PieceContext::create($validated);

        return redirect()->route('contextos.index');
    }

    public function edit(PieceContext $context)
    {
        // Include the current piece, and any other pieces without context
        $currentPiece = $context->piece;
        
        // Use a trick to include the current piece in the list if we wanted to change it, 
        // but changing proper piece context usually isn't done this way. 
        // For simplicity, we just pass the current one or a list. 
        // Actually, usually context is bound to a piece forever. I'll just show the piece info or allow readonly.
        // But for flexible CRUD, I'll pass the piece.
        
        return Inertia::render('PieceContexts/Edit', [
            'context' => $context->load('piece'),
        ]);
    }

    public function update(Request $request, PieceContext $context)
    {
        // Not allowing to change piece_id likely, but if we did we'd need validation.
        // Let's assume piece_id is fixed for now or allow user to not change it easily.
        
        $validated = $request->validate([
            'provenance_location' => 'nullable|string|max:255',
            'bibliographic_references' => 'nullable|string',
        ]);

        $context->update($validated);

        return redirect()->route('contextos.index');
    }

    public function destroy(PieceContext $context)
    {
        $context->delete();
        return redirect()->route('contextos.index');
    }
}
