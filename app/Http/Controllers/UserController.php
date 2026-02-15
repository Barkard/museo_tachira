<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('role');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('document_id', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return Inertia::render('Users/Index', [
            'users' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Users/Create', [
            'roles' => Role::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'document_id' => 'required|string|max:20|unique:users',
            'email' => 'required|string|lowercase|email|max:255|unique:users',
            'phone' => 'nullable|string|max:20',
            'birth_date' => 'nullable|date',
        ]);

        $employeeRole = Role::where('role_name', 'Empleado')->first();

        User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'document_id' => $request->document_id,
            'email' => $request->email,
            'phone' => $request->phone,
            'role_id' => $employeeRole->id,
            'password' => Hash::make($request->document_id), // Password is the cedula
            'birth_date' => $request->birth_date,
        ]);

        return redirect()->route('usuarios.index')->with('message', 'Usuario creado exitosamente (la contraseña es su cédula).');
    }

    public function edit(User $usuario)
    {
        return Inertia::render('Users/Edit', [
            'user' => $usuario->load('role'),
            'roles' => Role::all(),
        ]);
    }

    public function update(Request $request, User $usuario)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'document_id' => 'required|string|max:20|unique:users,document_id,' . $usuario->id,
            'email' => 'required|string|lowercase|email|max:255|unique:users,email,' . $usuario->id,
            'phone' => 'nullable|string|max:20',
            'birth_date' => 'nullable|date',
        ]);

        $usuario->update($request->only([
            'first_name',
            'last_name',
            'document_id',
            'email',
            'phone',
            'birth_date',
        ]));

        if ($request->filled('password')) {
            $request->validate([
                'password' => ['confirmed', Rules\Password::defaults()],
            ]);
            $usuario->update([
                'password' => Hash::make($request->password),
            ]);
        }

        return redirect()->route('usuarios.index')->with('message', 'Usuario actualizado exitosamente.');
    }

    public function destroy(User $usuario)
    {
        $usuario->delete();
        return redirect()->route('usuarios.index')->with('message', 'Usuario eliminado.');
    }

    public function checkUniqueness(Request $request)
    {
        $field = $request->has('document_id') ? 'document_id' : ($request->has('email') ? 'email' : null);

        if (!$field) {
            return response()->json(['exists' => false]);
        }

        $query = User::where($field, $request->input($field));

        if ($request->has('exclude_id')) {
            $query->where('id', '!=', $request->exclude_id);
        }

        $exists = $query->exists();
        $fieldName = $field === 'document_id' ? 'cédula' : 'correo electrónico';

        return response()->json([
            'exists' => $exists,
            'message' => $exists ? "El $fieldName ya se encuentra registrado." : ''
        ]);
    }
}
