
import React from 'react';
import { Mail, Lock, X, User, Calendar, IdCard, Phone } from 'lucide-react';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';
import { FormEventHandler } from 'react';
import { Loader2 } from 'lucide-react';

export default function Register() {
  const { data, setData, post, processing, errors, setError, clearErrors, reset } = useForm({
    document_id: '',
    first_name: '',
    last_name: '',
    phone: '',
    birth_date: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  type RegisterField = keyof typeof data;

  const validateField = async (field: RegisterField, value: string) => {
    if (!value) return;

    try {
      const response = await axios.post(route('register.validate'), {
        field,
        value,
        password_confirmation: field === 'password' ? data.password_confirmation : undefined
      });

      if (!response.data.valid) {
        setError(field, response.data.error);
      } else {
        clearErrors(field);
      }
    } catch (e) {
      console.error('Error validating field:', e);
    }
  };

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    console.log('Submitting form:', data);
    post(route('register'), {
      onFinish: () => {
        console.log('Registration request finished');
        reset('password', 'password_confirmation');
      },
      onError: (errors) => {
        console.log('Registration errors:', errors);
      }
    });
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center"
         style={{ backgroundImage: "url('/img/FotoMuseo.jpeg')" }}>

      {/* Navbar Simple */}
      <nav className="absolute top-0 w-full flex justify-between items-center p-8 text-white">
        <div className="text-2xl font-bold">Museo del Táchira</div>
      </nav>

      {/* Tarjeta Glassmorphism */}
      <div className="relative bg-white/10 backdrop-blur-md border border-white/20 p-10 rounded-2xl shadow-2xl w-[500px] text-white my-10">
        <Head title="Museo del Táchira" />

        {/* Botón Cerrar */}
        <Link href="/" className="absolute top-4 right-4 text-white hover:scale-110 transition">
          <X size={24} />
        </Link>

        <h2 className="text-3xl font-semibold text-center mb-8">Registrarse</h2>

        <form onSubmit={submit} className="space-y-6">
          {/* Documento ID */}
          <div className="relative border-b-2 border-white/50 focus-within:border-white transition">
            <input
              type="number"
              placeholder="Cédula de Identidad"
              className="w-full bg-transparent border-none outline-none py-2 pr-10 text-white placeholder:text-white/70 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={data.document_id}
              onChange={(e) => setData('document_id', e.target.value)}
              onBlur={(e) => validateField('document_id', e.target.value)}
            />
            <IdCard className="absolute right-2 top-2" size={20} />
          </div>
          {errors.document_id && <p className="text-xs text-red-300 font-medium">{errors.document_id}</p>}

          {/* Nombres */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative border-b-2 border-white/50 focus-within:border-white transition">
              <input
                type="text"
                placeholder="Nombre"
                className="w-full bg-transparent border-none outline-none py-2 pr-10 text-white placeholder:text-white/70"
                value={data.first_name}
                onChange={(e) => setData('first_name', e.target.value)}
                onBlur={(e) => validateField('first_name', e.target.value)}
              />
              <User className="absolute right-2 top-2" size={20} />
            </div>

            <div className="relative border-b-2 border-white/50 focus-within:border-white transition">
              <input
                type="text"
                placeholder="Apellido"
                className="w-full bg-transparent border-none outline-none py-2 pr-10 text-white placeholder:text-white/70"
                value={data.last_name}
                onChange={(e) => setData('last_name', e.target.value)}
                onBlur={(e) => validateField('last_name', e.target.value)}
              />
              <User className="absolute right-2 top-2" size={20} />
            </div>
            {(errors.first_name || errors.last_name) && (
              <div className="col-span-2 space-y-1">
                {errors.first_name && <p className="text-xs text-red-300 font-medium">{errors.first_name}</p>}
                {errors.last_name && <p className="text-xs text-red-300 font-medium">{errors.last_name}</p>}
              </div>
            )}
          </div>

          {/* Teléfono */}
          <div className="relative border-b-2 border-white/50 focus-within:border-white transition">
            <input
              type="text"
              placeholder="Número de Teléfono"
              className="w-full bg-transparent border-none outline-none py-2 pr-10 text-white placeholder:text-white/70"
              value={data.phone}
              onChange={(e) => setData('phone', e.target.value)}
              onBlur={(e) => validateField('phone', e.target.value)}
            />
            <Phone className="absolute right-2 top-2" size={20} />
          </div>
          {errors.phone && <p className="text-xs text-red-300 font-medium">{errors.phone}</p>}

          {/* Fecha de Nacimiento */}
          <div className="relative border-b-2 border-white/50 focus-within:border-white transition">
            <input
              type="date"
              className="w-full bg-transparent border-none outline-none py-2 pr-10 text-white placeholder:text-white/70"
              value={data.birth_date}
              onChange={(e) => setData('birth_date', e.target.value)}
              onBlur={(e) => validateField('birth_date', e.target.value)}
            />
            <Calendar className="absolute right-2 top-2" size={20} />
          </div>
          {errors.birth_date && <p className="text-xs text-red-300 font-medium">{errors.birth_date}</p>}

          {/* Email */}
          <div className="relative border-b-2 border-white/50 focus-within:border-white transition">
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full bg-transparent border-none outline-none py-2 pr-10 text-white placeholder:text-white/70"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              onBlur={(e) => validateField('email', e.target.value)}
            />
            <Mail className="absolute right-2 top-2" size={20} />
          </div>
          {errors.email && <p className="text-xs text-red-300 font-medium">{errors.email}</p>}

          {/* Password */}
          <div className="relative border-b-2 border-white/50 focus-within:border-white transition">
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full bg-transparent border-none outline-none py-2 pr-10 text-white placeholder:text-white/70"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              onBlur={(e) => validateField('password', e.target.value)}
            />
            <Lock className="absolute right-2 top-2" size={20} />
          </div>
          {errors.password && <p className="text-xs text-red-300 font-medium">{errors.password}</p>}

          {/* Confirm Password */}
          <div className="relative border-b-2 border-white/50 focus-within:border-white transition">
            <input
              type="password"
              placeholder="Confirmar Contraseña"
              className="w-full bg-transparent border-none outline-none py-2 pr-10 text-white placeholder:text-white/70"
              value={data.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.target.value)}
              onBlur={() => validateField('password', data.password)}
            />
            <Lock className="absolute right-2 top-2" size={20} />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={processing}
            className="w-full bg-slate-900 text-white py-2 rounded-md font-semibold hover:bg-black transition disabled:opacity-50"
          >
            {processing ? (
              <>
                <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
                Registrando...
              </>
            ) : (
              'Registrarse'
            )}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm">
            ¿Ya tienes cuenta? <Link href={route('login')} className="font-bold hover:underline text-white">Inicia sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
