<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Validation\Rules;

class RegisterController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create()
    {
        return Inertia::render('auth/register');
    }

    public function store(Request $request)
    {
        \Illuminate\Support\Facades\Log::info('Registering user:', $request->all());

        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'document_id' => 'required|integer|unique:users',
            'phone' => 'required|string|max:20|unique:users',
            'birth_date' => 'required|date',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ], [
            'first_name.required' => 'El nombre es obligatorio.',
            'last_name.required' => 'El apellido es obligatorio.',
            'document_id.required' => 'La cédula es obligatoria.',
            'document_id.integer' => 'La cédula debe ser un número entero.',
            'document_id.unique' => 'Esta cédula ya se encuentra registrada.',
            'phone.required' => 'El número de teléfono es obligatorio.',
            'phone.unique' => 'Este número de teléfono ya se encuentra registrado.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'Ingrese un formato de correo válido.',
            'email.unique' => 'Este correo electrónico ya se encuentra registrado.',
            'birth_date.required' => 'La fecha de nacimiento es obligatoria.',
            'password.required' => 'La contraseña es obligatoria.',
            'password.confirmed' => 'Las contraseñas no coinciden.',
        ]);

        // Assign default role (e.g., 'User') or the first available role if 'User' not found
        $role = Role::where('role_name', 'User')->first() ?? Role::first();

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'document_id' => $request->document_id,
            'phone' => $request->phone,
            'birth_date' => $request->birth_date,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $role ? $role->id : 1, // Safe fallback
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
