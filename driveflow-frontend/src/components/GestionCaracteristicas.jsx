import { useEffect, useState, useContext } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContextStore'; 

export default function GestionCaracteristicas() {
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [urlImagen, setUrlImagen] = useState(''); 
  const [editandoId, setEditandoId] = useState(null);
  const { usuario } = useContext(AuthContext); 

  const cargarDatos = () => {
    fetch('http://localhost:8080/api/caracteristicas').then(res => res.json()).then(data => setCaracteristicas(data));
  };

  useEffect(() => { cargarDatos(); }, []);

  const guardar = async (e) => {
    e.preventDefault();
    const payload = { nombre, urlImagen };
    const url = editandoId ? `http://localhost:8080/api/caracteristicas/${editandoId}` : 'http://localhost:8080/api/caracteristicas';
    
    try {
      const credencialesBase64 = btoa(`${usuario.email}:${usuario.password}`);

      const res = await fetch(url, {
        method: editandoId ? 'PUT' : 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credencialesBase64}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        if (res.status === 401) throw new Error('Su sesión administrativa ha expirado.');
        const err = await res.json();
        throw new Error(err.mensaje || 'Error al guardar la característica');
      }

      setNombre(''); setUrlImagen(''); setEditandoId(null);
      cargarDatos();
    } catch (err) {
      alert(`⚠️ Fallo: ${err.message}`);
    }
  };

  const borrar = async (id) => {
    if (confirm('¿Eliminar esta característica?')) {
      try {
        const credencialesBase64 = btoa(`${usuario.email}:${usuario.password}`);

        const res = await fetch(`http://localhost:8080/api/caracteristicas/${id}`, { 
          method: 'DELETE',
          headers: {
            'Authorization': `Basic ${credencialesBase64}`
          }
        });

        if (!res.ok) throw new Error('No se pudo remover el atributo.');
        cargarDatos();
      } catch (err) {
        alert(`⚠️ Error: ${err.message}`);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-brand-dark animate-fade-in">
      
      {/* FORMULARIO DE REQUISICIÓN */}
      <div className="bg-white border border-brand-border p-6 rounded-2xl h-max shadow-xs">
        <h3 className="text-sm font-black text-brand-dark uppercase tracking-wider mb-4">
          {editandoId ? 'Modificar Atributo' : 'Añadir característica'}
        </h3>
        <form onSubmit={guardar} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Nombre</label>
            <input type="text" required value={nombre} onChange={e => setNombre(e.target.value)} className="w-full bg-slate-50 border border-brand-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-primary font-semibold" placeholder="Ej: Techo Solar" />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">URL de la Imagen/Ícono</label>
            <input type="url" required value={urlImagen} onChange={e => setUrlImagen(e.target.value)} className="w-full bg-slate-50 border border-brand-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-primary font-mono" placeholder="https://ejemplo.com" />
          </div>
          
          {/* Vista previa instantánea para el administrador */}
          {urlImagen && (
            <div className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-xl border border-brand-border">
              <span className="text-[9px] font-bold uppercase text-slate-400">Previsualización:</span>
              <img src={urlImagen} alt="" className="w-6 h-6 object-contain" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}

          <button type="submit" className="w-full bg-brand-primary text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer hover:bg-blue-700">
            {editandoId ? 'Actualizar' : 'Guardar'}
          </button>
        </form>
      </div>

      {/* TABLA DE RESULTADOS */}
      <div className="lg:col-span-2 bg-white border border-brand-border rounded-2xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-brand-border bg-slate-50/75">
          <h3 className="text-sm font-black text-brand-dark uppercase tracking-wider">Características Registradas</h3>
        </div>
        <div className="divide-y divide-slate-100 max-h-110 overflow-y-auto">
          {caracteristicas.map(c => {
            const tieneImagenValida = c.urlImagen && c.urlImagen.trim() !== '';
            return (
              <div key={c.id} className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center p-1 border border-slate-200 shrink-0 overflow-hidden">
                    {tieneImagenValida ? (
                      <img 
                        src={c.urlImagen.trim()} 
                        alt="" 
                        className="w-full h-full object-contain" 
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-[10px] font-black uppercase text-slate-400 font-mono">
                        {c.nombre.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-brand-dark">{c.nombre}</span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button onClick={() => { setEditandoId(c.id); setNombre(c.nombre); setUrlImagen(c.urlImagen || ''); }} className="p-1.5 hover:bg-slate-100 text-slate-400 rounded-lg cursor-pointer"><Edit size={14} /></button>
                  <button onClick={() => borrar(c.id)} className="p-1.5 hover:bg-slate-100 text-slate-400 rounded-lg cursor-pointer"><Trash2 size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
