import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button'; 
import AuthSplitLayout from '@/layouts/auth/auth-split-layout'; 
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
        <AuthSplitLayout 
            title="Bienvenido de nuevo" 
            description="Ingresa tus credenciales para acceder al sistema de gestión del museo."
        >
            <Head title="Iniciar Sesión" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="flex flex-col gap-6">
                {/* EMAIL */}
                <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        placeholder="usuario@museotachira.com"
                        className="block w-full"
                        autoComplete="username"
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    {errors.email && <p className="text-sm text-red-500 font-medium">{errors.email}</p>}
                </div>

                {/* CONTRASEÑA */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Contraseña</Label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        )}
                    </div>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    {errors.password && <p className="text-sm text-red-500 font-medium">{errors.password}</p>}
                </div>

                {/* RECORDAR Y BOTÓN */}
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onCheckedChange={(checked) => setData('remember', !!checked)}
                        />
                        <Label htmlFor="remember" className="text-sm text-gray-600 font-normal cursor-pointer">
                            Recordar sesión
                        </Label>
                    </div>
                </div>

                <Button type="submit" disabled={processing} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5">
                    {processing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Iniciando...
                        </>
                    ) : (
                        'Ingresar al Sistema'
                    )}
                </Button>
                
                {/* ENLACE REGISTRO (OPCIONAL) */}
                <div className="text-center text-sm text-gray-500 mt-4">
                    ¿No tienes cuenta?{' '}
                    <Link href={route('register')} className="text-blue-600 font-semibold hover:underline">
                        Solicitar acceso
                    </Link>
                </div>
            </form>
        </AuthSplitLayout>
    );
}