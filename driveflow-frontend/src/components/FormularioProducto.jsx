import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContextStore';

const esquemaProducto = z.object({
  nombre: z.string()
    .min(3, { message: "El nombre es obligatorio (mínimo 3 caracteres)" })
    .max(100, { message: "El nombre no puede superar los 100 caracteres" }),
  descripcion: z.string()
    .min(10, { message: "La descripción comercial es obligatoria (mínimo 10 caracteres)" }),
  precioPorDia: z.coerce.number()
    .positive({ message: "La tarifa diaria debe ser un número mayor a 0" }),
  categoriaId: z.string()
    .min(1, { message: "Debe seleccionar una categoría para el vehículo" }),
  nuevaUrlImagen: z.string().optional() 
});

export default function FormularioProducto({ onCerrar }) {
  const { usuario } = useContext(AuthContext);
  
  const [categorias, setCategorias] = useState([]);
  const [listaCaracteristicas, setListaCaracteristicas] = useState([]);
  
  const [imagenesSubidas, setImagenesSubidas] = useState([]);
  const [caracteristicasSeleccionadas, setCaracteristicasSeleccionadas] = useState([]);
  
  const [errorServidor, setErrorServidor] = useState('');
  const [exito, setExito] = useState(false);

  const { register, handleSubmit, control, setValue, formState: { errors }, reset } = useForm({
    resolver: zodResolver(esquemaProducto),
    defaultValues: { nombre: '', descripcion: '', precioPorDia: '', categoriaId: '', nuevaUrlImagen: '' }
  });

  const urlImagenDigitada = useWatch({ control, name: 'nuevaUrlImagen', defaultValue: '' });

  useEffect(() => {
    fetch('http://localhost:8080/api/categorias').then(res => res.json()).then(data => setCategorias(data));
    fetch('http://localhost:8080/api/caracteristicas').then(res => res.json()).then(data => setListaCaracteristicas(data));
  }, []);

  // Lógica manual para agregar URLs al carrusel multimedia
  const agregarImagenAlLote = () => {
    if (urlImagenDigitada && urlImagenDigitada.trim() !== '') {
      setImagenesSubidas([...imagenesSubidas, urlImagenDigitada.trim()]);
      setValue('nuevaUrlImagen', '');
    }
  };

  // Lógica interactiva de selección múltiple de características inline (US #17)
  const manejarCheckboxChange = (id) => {
    if (caracteristicasSeleccionadas.includes(id)) {
      setCaracteristicasSeleccionadas(caracteristicasSeleccionadas.filter(item => item !== id));
    } else {
      setCaracteristicasSeleccionadas([...caracteristicasSeleccionadas, id]);
    }
  };

  const guardarVehiculo = async (data) => {
    setErrorServidor('');
    setExito(false);

    if (imagenesSubidas.length === 0) {
      setErrorServidor('Criterio de Aceptación US #3: Debe incorporar al menos una URL de imagen representativa.');
      return;
    }

    const payload = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      precioPorDia: data.precioPorDia,
      imagenes: imagenesSubidas,
      categoriaId: parseInt(data.categoriaId, 10),
      caracteristicasIds: caracteristicasSeleccionadas
    };

    try {
      const respuesta = await fetch('http://localhost:8080/api/vehiculos', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Basic ${usuario.authKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!respuesta.ok) {
        const datos = await respuesta.json();
        throw new Error(datos.mensaje || 'Error al procesar el alta del automóvil.');
      }

      setExito(true);
      setImagenesSubidas([]);
      setCaracteristicasSeleccionadas([]);
      reset();
    } catch (err) {
      setErrorServidor(err.message);
    }
  };
  return (
    <div className="bg-white border border-brand-border p-6 rounded-2xl shadow-md max-w-2xl mx-auto text-brand-dark animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black text-brand-dark">Registrar Nuevo Vehículo en Flota</h2>
        <button onClick={onCerrar} className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer">Cerrar</button>
      </div>

      {errorServidor && <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl">⚠️ {errorServidor}</div>}
      {exito && <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl text-center">🎉 ¡Vehículo guardado de forma atómica en XAMPP con éxito!</div>}

      <form onSubmit={handleSubmit(guardarVehiculo)} className="space-y-5" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-wider">Nombre Comercial</label>
            <input 
              type="text" {...register('nombre')}
              className={`w-full bg-slate-50 border rounded-xl p-2.5 text-xs focus:outline-none ${errors.nombre ? 'border-red-500' : 'border-brand-border focus:border-brand-primary'}`}
              placeholder="Ej: Tesla Model S"
            />
            {errors.nombre && <p className="text-[10px] text-red-500 mt-1 font-bold font-mono">{errors.nombre.message}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-wider">Categoría Relacionada</label>
            <select 
              {...register('categoriaId')}
              className={`w-full bg-slate-50 border rounded-xl p-2.5 text-xs focus:outline-none ${errors.categoriaId ? 'border-red-500' : 'border-brand-border focus:border-brand-primary'}`}
            >
              <option value="">Seleccione un segmento...</option>
              {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
            </select>
            {errors.categoriaId && <p className="text-[10px] text-red-500 mt-1 font-bold font-mono">{errors.categoriaId.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-wider">Descripción del Servicio</label>
            <textarea 
              rows="3" {...register('descripcion')}
              className={`w-full bg-slate-50 border rounded-xl p-2.5 text-xs focus:outline-none ${errors.descripcion ? 'border-red-500' : 'border-brand-border focus:border-brand-primary'}`}
              placeholder="Escriba los detalles comerciales para el cliente..."
            />
            {errors.descripcion && <p className="text-[10px] text-red-500 mt-1 font-bold font-mono">{errors.descripcion.message}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-wider">Tarifa Diaria ($)</label>
            <input 
              type="number" {...register('precioPorDia')}
              className={`w-full bg-slate-50 border rounded-xl p-2.5 text-xs focus:outline-none font-mono font-bold ${errors.precioPorDia ? 'border-red-500' : 'border-brand-border focus:border-brand-primary'}`}
              placeholder="0.00"
            />
            {errors.precioPorDia && <p className="text-[10px] text-red-500 mt-1 font-bold font-mono">{errors.precioPorDia.message}</p>}
          </div>
        </div>

        {/* CONTENEDOR MULTIMEDIA: Carga dinámica de fotos */}
        <div className="bg-slate-50 border border-brand-border p-4 rounded-xl">
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-wider">Galería de Imágenes (URLs Libres de Internet)</label>
          <div className="flex space-x-2">
            <input 
              type="text" {...register('nuevaUrlImagen')}
              className="grow bg-white border border-brand-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-primary font-mono text-blue-600"
              placeholder="https://unsplash.com"
            />
            <button type="button" onClick={agregarImagenAlLote} className="bg-brand-primary text-white font-bold text-xs px-4 rounded-xl cursor-pointer hover:bg-blue-700 transition-colors">Añadir</button>
          </div>
          {imagenesSubidas.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-3">
              {imagenesSubidas.map((url, idx) => (
                <div key={idx} className="w-full h-16 bg-white border rounded-lg p-1 relative group overflow-hidden">
                  <img src={url} alt="" className="w-full h-full object-contain" />
                  <button type="button" onClick={() => setImagenesSubidas(imagenesSubidas.filter((_, i) => i !== idx))} className="absolute inset-0 bg-red-600/90 text-white font-bold text-[9px] uppercase tracking-wider flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">Quitar</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SELECCIÓN MÚLTIPLE DE CARACTERÍSTICAS (US #17) */}
        <div className="bg-slate-50 border border-brand-border p-4 rounded-xl">
          <label className="block text-[10px] font-bold uppercase text-brand-primary mb-2 tracking-widest">Asociar Características Disponibles</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {listaCaracteristicas.map(c => {
              const estaMarcado = caracteristicasSeleccionadas.includes(c.id);
              return (
                <label key={c.id} className={`flex items-center space-x-2 text-xs font-bold p-2 rounded-lg border transition-all select-none cursor-pointer ${estaMarcado ? 'bg-blue-50/50 border-blue-200 text-brand-primary' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                  <input 
                    type="checkbox" checked={estaMarcado} onChange={() => manejarCheckboxChange(c.id)}
                    className="rounded border-slate-300 text-brand-primary focus:ring-brand-primary w-3.5 h-3.5 cursor-pointer"
                  />
                  <span className="truncate">{c.nombre}</span>
                </label>
              );
            })}
          </div>
        </div>

        <button type="submit" className="w-full bg-brand-primary text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-sm hover:bg-blue-700 transition-colors">
          Registrar Vehículo en Catálogo
        </button>
      </form>
    </div>
  );
}
