<?php

namespace App\Http\Controllers;

use App\Models\Agent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AgentController extends Controller
{
    public function index(Request $request)
    {
        $query = Agent::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('name_legal_entity', 'like', "%{$search}%")
                  ->orWhere('representative_name', 'like', "%{$search}%")
                  ->orWhere('unique_id', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
        }

        return Inertia::render('Agents/Index', [
            'agents' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Agents/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'unique_id' => 'required|integer|unique:agents,unique_id',
            'name_legal_entity' => 'required|string|max:255',
            'agent_type' => 'required|string|in:Persona,Entidad,Institución',
            'representative_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
        ]);

        $agent = Agent::create($validated);

        // If AJAX request (from modal), return JSON
        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'data' => $agent,
                'message' => 'Agente registrado exitosamente.'
            ], 201);
        }

        // Otherwise, redirect as usual
        return redirect()->route('agentes.index')->with('message', 'Agente registrado correctamente.');
    }

    public function edit(Agent $agente)
    {
        return Inertia::render('Agents/Edit', [
            'agent' => $agente
        ]);
    }

    public function update(Request $request, $id)
    {
        $agent = Agent::findOrFail($id);

        $validated = $request->validate([
            'unique_id' => 'required|integer|unique:agents,unique_id,' . $agent->id,
            'name_legal_entity' => 'required|string|max:255',
            'representative_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
        ]);

        $agent->update($validated);

        return redirect()->route('agentes.index')->with('message', 'Información actualizada.');
    }

    public function destroy($id)
    {
        $agent = Agent::findOrFail($id);
        $agent->delete();

        return redirect()->route('agentes.index');
    }
}
