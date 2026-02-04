import React from 'react';
import { Mail, Lock, X } from 'lucide-react';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Loader2 } from 'lucide-react';

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword?: boolean }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center"
         style={{ backgroundImage: "url('/img/FotoMuseo.jpeg')" }}>

      
      <nav className="absolute top-0 w-full flex justify-between items-center p-8 text-white">
        <div className="text-2xl font-bold">Museo del Táchira</div>
        
      </nav>

      
      <div className="relative bg-white/10 backdrop-blur-md border border-white/20 p-10 rounded-2xl shadow-2xl w-[400px] text-white">
        <Head title="Museo del Táchira" />

        
        <button className="absolute top-4 right-4 text-white hover:scale-110 transition">
          <X size={24} />
        </button>

        <h2 className="text-3xl font-semibold text-center mb-8">Iniciar Sesión</h2>

        {status && (
          <div className="mb-4 text-sm font-medium text-green-200 bg-green-500/20 p-3 rounded-lg border border-green-500/30">
            {status}
          </div>
        )}

        <form onSubmit={submit} className="space-y-6">
          
          <div className="relative border-b-2 border-white/50 focus-within:border-white transition">
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full bg-transparent border-none outline-none py-2 pr-10 text-white placeholder:text-white/70"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
            />
            <Mail className="absolute right-2 top-2" size={20} />
          </div>
          {errors.email && <p className="text-xs text-red-300 font-medium">{errors.email}</p>}

          
          <div className="relative border-b-2 border-white/50 focus-within:border-white transition">
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full bg-transparent border-none outline-none py-2 pr-10 text-white placeholder:text-white/70"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
            />
            <Lock className="absolute right-2 top-2" size={20} />
          </div>
          {errors.password && <p className="text-xs text-red-300 font-medium">{errors.password}</p>}

          
          <div className="flex justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.remember}
                onChange={(e) => setData('remember', e.target.checked)}
                className="accent-black"
              /> Recordar sesión
            </label>
            {canResetPassword && (
              <Link href={route('password.request')} className="hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            )}
          </div>

          
          <button
            type="submit"
            disabled={processing}
            className="w-full bg-slate-900 text-white py-2 rounded-md font-semibold hover:bg-black transition disabled:opacity-50"
          >
            {processing ? (
              <>
                <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
                Iniciando...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>

          
          <p className="text-center text-sm">
            ¿No tienes cuenta? <Link href={route('register')} className="font-bold hover:underline text-white">registrate</Link>
          </p>
        </form>
      </div>
    </div>
  );
}