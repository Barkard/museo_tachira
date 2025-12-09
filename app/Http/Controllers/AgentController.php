<?php

namespace App\Http\Controllers;

use App\Models\Agent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AgentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Agent::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('name_legal_entity', 'like', "%{$search}%");
        }

        $agents = $query->paginate(10)->withQueryString();

        return Inertia::render('Agents/Index', [
            'agents' => $agents,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Agents/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name_legal_entity' => 'required|string|max:255',
            'agent_type' => 'required|string|max:50', // E.g., 'Persona', 'Institución'
        ]);

        Agent::create($validated);

        return redirect()->route('agentes.index')->with('success', 'Agente creado exitosamente.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Agent $agente)
    {
        return Inertia::render('Agents/Edit', [
            'agent' => $agente,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Agent $agente)
    {
        $validated = $request->validate([
            'name_legal_entity' => 'required|string|max:255',
            'agent_type' => 'required|string|max:50',
        ]);

        $agente->update($validated);

        return redirect()->route('agentes.index')->with('success', 'Agente actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Agent $agente)
    {
        $agente->delete();

        return redirect()->route('agentes.index')->with('success', 'Agente eliminado exitosamente.');
    }
}
