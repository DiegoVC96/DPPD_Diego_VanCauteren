import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

const esquemaRegistro = z.object({
  nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  apellido: z.string().min(2, { message: "El apellido debe tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Proporcione una dirección de correo válida" }),
  password: z.string().min(6, { message: "La contraseña debe contener al menos 6 caracteres" })
});

export default function RegistroUsuario({ onVolverAlInicio }) {
  const [errorServidor, setErrorServidor] = useState('');
  const [exito, setExito] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(esquemaRegistro)
  });

  const enviarDatosAlBackend = async (data) => {
    setErrorServidor('');
    setExito(false);

    try {
      const respuesta = await fetch('http://localhost:8080/api/usuarios/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'Error en el servidor al registrar.');
      }

      setExito(true);
      reset(); 
    } catch (err) {
      setErrorServidor(err.message);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white border border-brand-border p-8 rounded-2xl shadow-sm text-brand-dark">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black tracking-tight">Crear una cuenta</h2>
        <p className="text-xs text-slate-400 mt-1">Saneamiento estricto de credenciales DriveFlow</p>
      </div>

      {errorServidor && <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl">⚠️ {errorServidor}</div>}
      {exito && <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl text-center">🎉 ¡Registro exitoso! Correo de confirmación enviado.</div>}

      <form onSubmit={handleSubmit(enviarDatosAlBackend)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Nombre</label>
            <input 
              type="text" 
              {...register('nombre')}
              className={`w-full bg-slate-50 border rounded-xl p-2.5 text-xs focus:outline-none ${errors.nombre ? 'border-red-500' : 'border-brand-border'}`}
            />
            {/* Mensaje de error específico debajo del campo */}
            {errors.nombre && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.nombre.message}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Apellido</label>
            <input 
              type="text" 
              {...register('apellido')}
              className={`w-full bg-slate-50 border rounded-xl p-2.5 text-xs focus:outline-none ${errors.apellido ? 'border-red-500' : 'border-brand-border'}`}
            />
            {errors.apellido && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.apellido.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Correo electrónico</label>
          <input 
            type="text" 
            {...register('email')}
            className={`w-full bg-slate-50 border rounded-xl p-2.5 text-xs focus:outline-none ${errors.email ? 'border-red-500' : 'border-brand-border'}`}
            placeholder="juan@ejemplo.com"
          />
          {errors.email && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Contraseña</label>
          <input 
            type="password" 
            {...register('password')}
            className={`w-full bg-slate-50 border rounded-xl p-2.5 text-xs focus:outline-none ${errors.password ? 'border-red-500' : 'border-brand-border'}`}
          />
          {errors.password && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.password.message}</p>}
        </div>

        <button type="submit" className="w-full bg-brand-primary text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-xs hover:bg-blue-700">
          Registrarse
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-slate-100 text-center">
        <button onClick={onVolverAlInicio} className="text-xs font-bold text-slate-400 hover:text-brand-primary cursor-pointer">
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
