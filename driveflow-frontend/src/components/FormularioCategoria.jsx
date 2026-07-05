import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContextStore';

const esquemaCategoria = z.object({
  nombre: z.string()
    .min(3, { message: "El título es obligatorio (mínimo 3 caracteres)" })
    .max(50, { message: "El título no puede exceder los 50 caracteres" }),
  descripcion: z.string()
    .min(10, { message: "La descripción es requerida (mínimo 10 caracteres)" })
    .max(255, { message: "La descripción no puede superar los 255 caracteres" }),
  urlImagen: z.string()
    .url({ message: "Proporcione un enlace de imagen válido (URL de internet)" })
});

export default function FormularioCategoria({ onCerrar }) {
  const { usuario } = useContext(AuthContext);
  const [errorServidor, setErrorServidor] = useState('');
  const [exito, setExito] = useState(false);

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
    resolver: zodResolver(esquemaCategoria),
    defaultValues: { nombre: '', descripcion: '', urlImagen: '' }
  });

  const urlImagenActual = useWatch({
    control,
    name: 'urlImagen',
    defaultValue: ''
  });

  const guardarEnBaseDeDatos = async (data) => {
    setErrorServidor('');
    setExito(false);

    const payload = { ...data, icono: 'Car' };

    try {
      const respuesta = await fetch('http://localhost:8080/api/categorias', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Basic ${usuario.authKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!respuesta.ok) {
        const datos = await respuesta.json();
        throw new Error(datos.mensaje || 'Error al guardar la categoría.');
      }

      setExito(true);
      reset(); 
    } catch (err) {
      setErrorServidor(err.message);
    }
  };

  return (
    <div className="bg-white border border-brand-border p-6 rounded-2xl shadow-md max-w-xl mx-auto text-brand-dark animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black text-brand-dark">Añadir Nueva Categoría de Flota</h2>
        <button onClick={onCerrar} className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer">
          Cerrar
        </button>
      </div>

      {errorServidor && <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl">⚠️ {errorServidor}</div>}
      {exito && <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl text-center">🎉 ¡Categoría registrada exitosamente en XAMPP!</div>}

      <form onSubmit={handleSubmit(guardarEnBaseDeDatos)} className="space-y-4" noValidate>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Título de la Categoría</label>
          <input 
            type="text" 
            {...register('nombre')}
            className={`w-full bg-slate-50 border rounded-xl p-2.5 text-xs focus:outline-none ${errors.nombre ? 'border-red-500 focus:border-red-500' : 'border-brand-border focus:border-brand-primary'}`}
            placeholder="Ej: Minivans o Convertibles"
          />
          {errors.nombre && <p className="text-[10px] text-red-500 mt-1 font-bold font-mono">{errors.nombre.message}</p>}
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Descripción de Navegación</label>
          <textarea 
            rows="3" 
            {...register('descripcion')}
            className={`w-full bg-slate-50 border rounded-xl p-2.5 text-xs focus:outline-none ${errors.descripcion ? 'border-red-500 focus:border-red-500' : 'border-brand-border focus:border-brand-primary'}`}
            placeholder="Describa el segmento de la flota comercial..."
          />
          {errors.descripcion && <p className="text-[10px] text-red-500 mt-1 font-bold font-mono">{errors.descripcion.message}</p>}
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">URL de la Imagen Representativa</label>
          <input 
            type="text" 
            {...register('urlImagen')}
            className={`w-full bg-slate-50 border rounded-xl p-2.5 text-xs focus:outline-none ${errors.urlImagen ? 'border-red-500 focus:border-red-500' : 'border-brand-border focus:border-brand-primary'}`}
            placeholder="https://unsplash.com"
          />
          {errors.urlImagen && <p className="text-[10px] text-red-500 mt-1 font-bold font-mono">{errors.urlImagen.message}</p>}
        </div>
        
        {urlImagenActual && urlImagenActual.trim() !== '' && !errors.urlImagen && (
          <div className="w-full h-36 bg-slate-50 border border-brand-border rounded-xl overflow-hidden flex items-center justify-center p-2">
            <img 
              src={urlImagenActual.trim()} 
              alt="Vista previa de portada" 
              className="max-w-full max-h-full object-contain" 
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
          </div>
        )}

        <button type="submit" className="w-full bg-brand-primary text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-sm hover:bg-blue-700 transition-colors">
          Guardar Categoría
        </button>
      </form>
    </div>
  );
}
