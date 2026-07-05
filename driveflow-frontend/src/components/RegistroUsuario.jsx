import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

const esquemaRegistro = z.object({
  nombre: z.string()
    .min(2, { message: "El nombre es obligatorio (mínimo 2 caracteres)" }),
  apellido: z.string()
    .min(2, { message: "El apellido es obligatorio (mínimo 2 caracteres)" }),
  email: z.string()
    .min(1, { message: "El correo electrónico es obligatorio" })
    .email({ message: "Proporcione un formato de dirección de correo válido" }),
  password: z.string()
    .min(6, { message: "Criterio Core: La contraseña debe contener al menos 6 caracteres" })
});

export default function RegistroUsuario({ onVolverAlInicio }) {
  const [errorServidor, setErrorServidor] = useState('');
  const [exito, setExito] = useState(false);
  const [ultimoEmailRegistrado, setUltimoEmailRegistrado] = useState('');
  const [msgReenvio, setMsgReenvio] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(esquemaRegistro),
    defaultValues: { nombre: '', apellido: '', email: '', password: '' }
  });

  const enviarRegistroAlBackend = async (data) => {
    setErrorServidor('');
    setExito(false);
    setMsgReenvio('');

    try {
      const respuesta = await fetch('http://localhost:8080/api/usuarios/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: data.nombre.trim(),
          apellido: data.apellido.trim(),
          email: data.email.trim(),
          password: data.password.trim()
        })
      });
      
      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'Ocurrió un error al procesar el alta de la cuenta.');
      }

      setUltimoEmailRegistrado(data.email.trim()); 
      setExito(true);
      reset(); 
    } catch (err) {
      setErrorServidor(err.message);
    }
  };

  const solicitarReenvio = async () => {
    setMsgReenvio('');
    try {
      const res = await fetch(`http://localhost:8080/api/usuarios/reenviar-confirmacion?email=${ultimoEmailRegistrado}`, {
        method: 'POST'
      });
      const datos = await res.get ? await res.json() : { mensaje: 'Solicitud procesada con éxito.' };
      setMsgReenvio(datos.mensaje || 'El correo de confirmación ha sido reenviado.');
    } catch (err) {
      console.error('Error al solicitar reenvío de confirmación:', err);
      setMsgReenvio('No se pudo procesar el reenvío en este momento.');
    }
  };
  return (
    <div className="max-w-md w-full mx-auto bg-white border border-brand-border p-8 rounded-2xl shadow-sm text-brand-dark animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black tracking-tight">Crear una cuenta</h2>
        <p className="text-xs text-slate-400 mt-1">Únase a la experiencia DriveFlow Car Rental</p>
      </div>

      {exito ? (
        <div className="text-center py-4 space-y-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">✓</div>
          <h3 className="font-extrabold text-lg">¡Registro Exitoso!</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Hemos despachado un correo electrónico de confirmación de forma inmediata a la dirección <span className="font-bold text-slate-700">{ultimoEmailRegistrado}</span> para validar sus credenciales.
          </p>
          
          {/* OPCIÓN DE SOPORTE INTEGRADA SI EL CORREO NO LLEGA */}
          <div className="pt-4 border-t border-slate-100 mt-6 bg-slate-50/75 p-3 rounded-xl border border-dashed">
            <p className="text-[11px] text-slate-400 font-medium">¿No recibió nuestro mensaje?</p>
            <button 
              onClick={solicitarReenvio}
              className="text-xs font-bold text-brand-primary underline hover:text-blue-700 mt-1 cursor-pointer"
            >
              Haga clic aquí para reenviar el correo de confirmación
            </button>
            {msgReenvio && <p className="text-[10px] text-emerald-600 font-bold mt-2 font-mono">{msgReenvio}</p>}
          </div>

          <button onClick={onVolverAlInicio} className="w-full bg-brand-dark text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider mt-4 cursor-pointer">
            Regresar a la tienda
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(enviarRegistroAlBackend)} className="space-y-4" noValidate>
          {errorServidor && <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl">⚠️ {errorServidor}</div>}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Nombre</label>
              <input 
                type="text" {...register('nombre')}
                className={`w-full bg-slate-50 border rounded-xl p-2.5 text-xs focus:outline-none ${errors.nombre ? 'border-red-500' : 'border-brand-border focus:border-brand-primary'}`}
                placeholder="Juan"
              />
              {errors.nombre && <p className="text-[10px] text-red-500 mt-1 font-bold font-mono">{errors.nombre.message}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Apellido</label>
              <input 
                type="text" {...register('apellido')}
                className={`w-full bg-slate-50 border rounded-xl p-2.5 text-xs focus:outline-none ${errors.apellido ? 'border-red-500' : 'border-brand-border focus:border-brand-primary'}`}
                placeholder="Pérez"
              />
              {errors.apellido && <p className="text-[10px] text-red-500 mt-1 font-bold font-mono">{errors.apellido.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Correo Electrónico</label>
            <input 
              type="text" {...register('email')}
              className={`w-full bg-slate-50 border rounded-xl p-2.5 text-xs focus:outline-none ${errors.email ? 'border-red-500' : 'border-brand-border focus:border-brand-primary'}`}
              placeholder="juan.perez@ejemplo.com"
            />
            {errors.email && <p className="text-[10px] text-red-500 mt-1 font-bold font-mono">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Contraseña</label>
            <input 
              type="password" {...register('password')}
              className={`w-full bg-slate-50 border rounded-xl p-2.5 text-xs focus:outline-none ${errors.password ? 'border-red-500' : 'border-brand-border focus:border-brand-primary'}`}
              placeholder="Mínimo 6 caracteres"
            />
            {errors.password && <p className="text-[10px] text-red-500 mt-1 font-bold font-mono">{errors.password.message}</p>}
          </div>

          <button type="submit" className="w-full bg-brand-primary text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-sm hover:bg-blue-700 transition-colors">
            Completar Registro
          </button>
          
          <div className="mt-4 text-center">
            <button type="button" onClick={onVolverAlInicio} className="text-xs font-bold text-slate-400 hover:text-brand-primary cursor-pointer transition-colors">
              Volver al catálogo
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
