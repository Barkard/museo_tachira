<?php

namespace App\Http\Controllers;

use App\Models\TransactionStatusCatalog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionStatusCatalogController extends Controller
{
    public function index(Request $request)
    {
        $query = TransactionStatusCatalog::query();

        if ($request->has('search')) {
            $query->where('status', 'like', "%{$request->search}%");
        }

        $statuses = $query->paginate(10)->withQueryString();

        return Inertia::render('Statuses/Index', [
            'statuses' => $statuses,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Statuses/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'status' => 'required|string|max:255|unique:transaction_status_catalogs,status',
            'description' => 'nullable|string',
        ]);

        TransactionStatusCatalog::create($validated);

        return redirect()->route('estados.index')->with('success', 'Estado creado.');
    }

    public function edit(TransactionStatusCatalog $estado)
    {
        return Inertia::render('Statuses/Edit', [
            'status' => $estado,
        ]);
    }

    public function update(Request $request, TransactionStatusCatalog $estado)
    {
        $validated = $request->validate([
            'status' => 'required|string|max:255|unique:transaction_status_catalogs,status,' . $estado->id,
            'description' => 'nullable|string',
        ]);

        $estado->update($validated);

        return redirect()->route('estados.index')->with('success', 'Estado actualizado.');
    }

    public function destroy(TransactionStatusCatalog $estado)
    {
        $estado->delete();
        return redirect()->route('estados.index')->with('success', 'Estado eliminado.');
    }
}
