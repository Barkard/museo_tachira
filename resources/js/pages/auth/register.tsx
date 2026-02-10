
import React from 'react';
import { Mail, Lock, X, User, Calendar, IdCard } from 'lucide-react';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Loader2 } from 'lucide-react';

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    first_name: '',
    last_name: '',
    document_id: '',
    birth_date: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('register'), {
      onFinish: () => reset('password', 'password_confirmation'),
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
      <div className="relative bg-white/10 backdrop-blur-md border border-white/20 p-10 rounded-2xl shadow-2xl w-[500px] text-white">
        <Head title="Museo del Táchira" />

        {/* Botón Cerrar */}
        <button className="absolute top-4 right-4 text-white hover:scale-110 transition">
          <X size={24} />
        </button>

        <h2 className="text-3xl font-semibold text-center mb-8">Registrarse</h2>

        <form onSubmit={submit} className="space-y-6">
          {/* Nombres */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative border-b-2 border-white/50 focus-within:border-white transition">
              <input
                type="text"
                placeholder="Nombre"
                className="w-full bg-transparent border-none outline-none py-2 pr-10 text-white placeholder:text-white/70"
                value={data.first_name}
                onChange={(e) => setData('first_name', e.target.value)}
                required
              />
              <User className="absolute right-2 top-2" size={20} />
            </div>
            {errors.first_name && <p className="text-xs text-red-300 font-medium col-span-2">{errors.first_name}</p>}

            <div className="relative border-b-2 border-white/50 focus-within:border-white transition">
              <input
                type="text"
                placeholder="Apellido"
                className="w-full bg-transparent border-none outline-none py-2 pr-10 text-white placeholder:text-white/70"
                value={data.last_name}
                onChange={(e) => setData('last_name', e.target.value)}
                required
              />
              <User className="absolute right-2 top-2" size={20} />
            </div>
            {errors.last_name && <p className="text-xs text-red-300 font-medium col-span-2">{errors.last_name}</p>}
          </div>

          {/* Documento ID */}
          <div className="relative border-b-2 border-white/50 focus-within:border-white transition">
            <input
              type="text"
              placeholder="Cédula / Documento ID"
              className="w-full bg-transparent border-none outline-none py-2 pr-10 text-white placeholder:text-white/70"
              value={data.document_id}
              onChange={(e) => setData('document_id', e.target.value)}
              required
            />
            <IdCard className="absolute right-2 top-2" size={20} />
          </div>
          {errors.document_id && <p className="text-xs text-red-300 font-medium">{errors.document_id}</p>}

          {/* Fecha de Nacimiento */}
          <div className="relative border-b-2 border-white/50 focus-within:border-white transition">
            <input
              type="date"
              className="w-full bg-transparent border-none outline-none py-2 pr-10 text-white placeholder:text-white/70"
              value={data.birth_date}
              onChange={(e) => setData('birth_date', e.target.value)}
              required
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
              required
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
              required
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
              required
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
