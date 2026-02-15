<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'document_id' => ['required', 'integer', Rule::unique(User::class)],
            'phone' => ['required', 'string', 'max:20', Rule::unique(User::class)],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'birth_date' => ['required', 'date'],
            'password' => $this->passwordRules(),
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
        ])->validate();

        return User::create([
            'first_name' => $input['first_name'],
            'last_name' => $input['last_name'],
            'document_id' => $input['document_id'],
            'phone' => $input['phone'],
            'email' => $input['email'],
            'birth_date' => $input['birth_date'],
            'password' => $input['password'],
            'role_id' => 2, // Asumiendo rol estándar de usuario por defecto
        ]);
    }
}
