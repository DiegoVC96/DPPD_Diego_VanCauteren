import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContextStore'; 

export default function FormularioEditarCategoria({ categoria, onCancel, onSaveSuccess }) {
  const { usuario } = useContext(AuthContext); 
  const [nombre, setNombre] = useState(categoria.nombre);
  const [descripcion, setDescripcion] = useState(categoria.descripcion);
  const [urlImagen, setUrlImagen] = useState(categoria.urlImagen || '');
  const [icono] = useState(categoria.icono || 'Car');
  const [errorServidor, setErrorServidor] = useState('');

  const manejarEnvio = async (e) => {
  e.preventDefault();
  setErrorServidor('');

  const payload = { nombre, descripcion, urlImagen: urlImagen.trim(), icono };

  try {
    const credencialesBase64 = btoa(`${usuario.email}:${usuario.password}`);

    const res = await fetch(`http://localhost:8080/api/categorias/${categoria.id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credencialesBase64}` 
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Su sesión ha expirado o no cuenta con privilegios de Administrador.');
      }
      const datos = await res.json();
      throw new Error(datos.mensaje || 'Error al actualizar los parámetros.');
    }
    
    onSaveSuccess();
  } catch (err) {
    setErrorServidor(err.message);
  }
};

  return (
    <div className="bg-white border border-brand-border p-6 rounded-2xl shadow-sm max-w-md mx-auto animate-fade-in text-brand-dark">
      <h3 className="text-sm font-black text-brand-dark mb-4 uppercase tracking-wider">
        Modificar Categoría: <span className="text-brand-primary">{categoria.nombre}</span>
      </h3>
      
      {errorServidor && (
        <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
          ⚠️ {errorServidor}
        </div>
      )}
      
      <form onSubmit={manejarEnvio} className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-wider">Título</label>
          <input type="text" required value={nombre} onChange={e => setNombre(e.target.value)} className="w-full bg-slate-50 border border-brand-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-primary font-semibold" />
        </div>
        
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-wider">Descripción de Segmento</label>
          <textarea required rows="2" value={descripcion} onChange={e => setDescripcion(e.target.value)} className="w-full bg-slate-50 border border-brand-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-primary text-slate-600" />
        </div>
        
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-wider">URL de la Imagen Representativa</label>
          <input type="url" required value={urlImagen} onChange={e => setUrlImagen(e.target.value)} className="w-full bg-slate-50 border border-brand-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-primary font-mono text-blue-600" />
        </div>
        {urlImagen.trim() !== '' && (
          <div className="w-full h-32 bg-slate-50 border border-brand-border rounded-xl overflow-hidden flex items-center justify-center p-2">
            <img 
              src={urlImagen} 
              alt="Vista previa en caliente" 
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none'; 
              }}
            />
          </div>
        )}

        <div className="flex space-x-2 pt-2">
          <button type="button" onClick={onCancel} className="flex-1 bg-slate-100 text-brand-dark text-xs font-bold py-2.5 rounded-xl transition-colors cursor-pointer">
            Cancelar
          </button>
          <button type="submit" className="flex-1 bg-brand-primary text-white text-xs font-bold py-2.5 rounded-xl shadow-xs cursor-pointer hover:bg-blue-700 transition-colors">
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
