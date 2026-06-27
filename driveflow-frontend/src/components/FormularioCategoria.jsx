import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContextStore'; 

export default function FormularioCategoria({ onCerrar }) {
  const { usuario } = useContext(AuthContext); 
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [urlImagen, setUrlImagen] = useState('');
  const [icono, setIcono] = useState('Car');
  const [errorServidor, setErrorServidor] = useState('');
  const [exito, setExito] = useState(false);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setErrorServidor('');
    setExito(false);

    const payload = { nombre, descripcion, urlImagen, icono };

    try {
      const credencialesBase64 = btoa(`${usuario.email}:${usuario.password}`);

      const respuesta = await fetch('http://localhost:8080/api/categorias', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credencialesBase64}`
        },
        body: JSON.stringify(payload)
      });

      if (!respuesta.ok) {
        if (respuesta.status === 401) {
          throw new Error('Su sesión administrativa ha expirado o no cuenta con los privilegios requeridos.');
        }
        const datos = await respuesta.json();
        throw new Error(datos.mensaje || 'Error al registrar la categoría');
      }

      setExito(true);
      setNombre(''); setDescripcion(''); setUrlImagen(''); setIcono('Car');
    } catch (err) {
      setErrorServidor(err.message);
    }
  };

  return (
    <div className="bg-white border border-brand-border p-6 rounded-2xl shadow-md max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black text-brand-dark">Añadir Nueva Categoría de Flota</h2>
        <button onClick={onCerrar} className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer">
          Cerrar
        </button>
      </div>

      {errorServidor && <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl">⚠️ {errorServidor}</div>}
      {exito && <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl text-center">🎉 ¡Categoría guardada correctamente en XAMPP!</div>}

      <form onSubmit={manejarEnvio} className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Título de la Categoría</label>
          <input type="text" required value={nombre} onChange={e => setNombre(e.target.value)} className="w-full bg-slate-50 border border-brand-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-primary font-semibold" placeholder="Ej: Minivans" />
        </div>
  
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Descripción de Navegación</label>
          <textarea required rows="3" value={descripcion} onChange={e => setDescripcion(e.target.value)} className="w-full bg-slate-50 border border-brand-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-primary" placeholder="Describa el segmento..." />
        </div>
  
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">URL de la Imagen Representativa</label>
          <input type="url" required value={urlImagen} onChange={e => setUrlImagen(e.target.value)} className="w-full bg-slate-50 border border-brand-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-primary font-mono" placeholder="https://unsplash.com" />
        </div>

        {urlImagen && (
          <div className="w-full h-32 bg-slate-100 border border-brand-border rounded-xl overflow-hidden flex items-center justify-center p-2">
            <img src={urlImagen} alt="Vista previa de portada" className="max-w-full max-h-full object-contain" />
          </div>
        )}

        <button type="submit" className="w-full bg-brand-primary hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer transition-colors shadow-sm">
          Guardar Categoría
        </button>
      </form>
    </div>
  );
}
