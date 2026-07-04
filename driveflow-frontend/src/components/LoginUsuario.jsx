import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContextStore';

const esquemaLogin = z.object({
  email: z.string()
    .min(1, { message: "El correo electrónico es un campo requerido" })
    .email({ message: "Proporcione una dirección de correo válida (ej: usuario@dominio.com)" }),
  password: z.string()
    .min(1, { message: "La contraseña es un campo requerido" })
});

export default function LoginUsuario({ onVolver, onExito }) {
  const { iniciarSesionGlobal } = useContext(AuthContext);
  const [errorServidor, setErrorServidor] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(esquemaLogin),
    defaultValues: { email: '', password: '' }
  });

  const procesarAutenticacion = async (data) => {
    setErrorServidor('');

    try {
      const res = await fetch('http://localhost:8080/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email.trim(),
          password: data.password.trim()
        })
      });
      
      const datos = await res.json();

      // Interceptamos fallos de credenciales erróneas (US #14)
      if (!res.ok) {
        throw new Error(datos.mensaje || 'Las credenciales proporcionadas no son válidas.');
      }

      iniciarSesionGlobal(datos, data.password.trim());
      onExito(); 
    } catch (err) {
      setErrorServidor(err.message);
    }
  };
  return (
    <div className="max-w-md w-full mx-auto bg-white border border-brand-border p-8 rounded-2xl shadow-sm text-brand-dark animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black tracking-tight">Iniciar Sesión</h2>
        <p className="text-xs text-slate-400 mt-1">Ingrese a su cuenta premium de DriveFlow</p>
      </div>

      {errorServidor && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
          ⚠️ {errorServidor}
        </div>
      )}

      <form onSubmit={handleSubmit(procesarAutenticacion)} className="space-y-4" noValidate>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Correo Electrónico</label>
          <input 
            type="text"
            {...register('email')}
            className={`w-full bg-slate-50 border rounded-xl p-2.5 text-xs focus:outline-none ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-brand-border focus:border-brand-primary'}`}
            placeholder="correo@ejemplo.com"
          />
          {errors.email && <p className="text-[10px] text-red-500 mt-1 font-bold font-mono">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Contraseña</label>
          <input 
            type="password"
            {...register('password')}
            className={`w-full bg-slate-50 border rounded-xl p-2.5 text-xs focus:outline-none ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-brand-border focus:border-brand-primary'}`}
            placeholder="••••••••"
          />
          {errors.password && <p className="text-[10px] text-red-500 mt-1 font-bold font-mono">{errors.password.message}</p>}
        </div>

        <button type="submit" className="w-full bg-brand-primary text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-sm hover:bg-blue-700 transition-colors">
          Ingresar a la plataforma
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-slate-100 text-center">
        <button type="button" onClick={onVolver} className="text-xs font-bold text-slate-400 hover:text-brand-primary cursor-pointer transition-colors">
          Volver al catálogo público
        </button>
      </div>
    </div>
  );
}
