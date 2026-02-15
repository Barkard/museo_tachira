<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ValidationController extends Controller
{
    public function validateField(Request $request)
    {
        $field = $request->input('field');
        $value = $request->input('value');

        $rules = [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'document_id' => ['required', 'integer', Rule::unique(User::class)],
            'phone' => ['required', 'string', 'max:20', Rule::unique(User::class)],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique(User::class)],
            'birth_date' => ['required', 'date'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ];

        $messages = [
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
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'password.confirmed' => 'Las contraseñas no coinciden.',
        ];

        if (!array_key_exists($field, $rules)) {
            return response()->json(['valid' => true]);
        }

        // Para la validación de confirmación de contraseña, necesitamos ambos campos
        $dataToValidate = [$field => $value];
        if ($field === 'password') {
            $dataToValidate['password_confirmation'] = $request->input('password_confirmation');
        }

        $validator = Validator::make($dataToValidate, [
            $field => $rules[$field]
        ], $messages);

        if ($validator->fails()) {
            return response()->json([
                'valid' => false,
                'error' => $validator->errors()->first($field)
            ]);
        }

        return response()->json(['valid' => true]);
    }
}
