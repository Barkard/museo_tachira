<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        $query = Role::query();

        if ($request->has('search')) {
            $query->where('role_name', 'like', "%{$request->search}%");
        }

        $roles = $query->paginate(10)->withQueryString();

        return Inertia::render('Roles/Index', [
            'roles' => $roles,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Roles/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'role_name' => 'required|string|max:255|unique:roles,role_name',
            'description' => 'nullable|string',
        ]);

        Role::create($validated);

        return redirect()->route('roles.index')->with('success', 'Rol creado.');
    }

    public function edit(Role $role)
    {
        return Inertia::render('Roles/Edit', [
            'role' => $role,
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'role_name' => 'required|string|max:255|unique:roles,role_name,' . $role->id,
            'description' => 'nullable|string',
        ]);

        $role->update($validated);

        return redirect()->route('roles.index')->with('success', 'Rol actualizado.');
    }

    public function destroy(Role $role)
    {
        $role->delete();
        return redirect()->route('roles.index')->with('success', 'Rol eliminado.');
    }
}
