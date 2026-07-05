import { useEffect, useState, useContext } from 'react';
import { Edit, Trash2, AlertTriangle } from 'lucide-react';
import FormularioEditarCategoria from './FormularioEditarCategoria';
import { AuthContext } from '../context/AuthContextStore';

export default function GestionCategoriasAdmin() {
  const { usuario } = useContext(AuthContext); 
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [catParaEliminar, setCatParaEliminar] = useState(null);
  const [catEnEdicion, setCatEnEdicion] = useState(null);

  const cargarCategorias = () => {
    fetch('http://localhost:8080/api/categorias')
      .then(res => res.json())
      .then(data => { setCategorias(data); setCargando(false); })
      .catch(() => setCargando(false));
  };

  useEffect(() => { cargarCategorias(); }, []);

  const ejecutarEliminacionDefinitiva = async () => {
    if (!catParaEliminar) return;

    try {
      const res = await fetch(`http://localhost:8080/api/categorias/${catParaEliminar.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${usuario.authKey}`
        }
      });

      if (res.status === 409 || !res.ok) {
        const datos = await res.json();
        throw new Error(datos.mensaje || 'No se pudo procesar la baja de la categoría.');
      }

      // Actualización en tiempo real
      setCategorias(categorias.filter(c => c.id !== catParaEliminar.id));
      setCatParaEliminar(null);
    } catch (err) {
      alert(`⚠️ Bloqueo: ${err.message}`);
      setCatParaEliminar(null);
    }
  };
  if (cargando) return <div className="text-center py-10 text-xs text-slate-400 font-bold font-mono">Sincronizando familias de flota...</div>;

  return (
    <div className="w-full bg-white border border-brand-border rounded-3xl p-6 shadow-2xs text-brand-dark animate-fade-in relative">
      
      {catEnEdicion ? (
        <FormularioEditarCategoria 
          categoria={catEnEdicion} 
          onCancel={() => setCatEnEdicion(null)} 
          onSaveSuccess={() => { setCatEnEdicion(null); cargarCategorias(); }} 
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-400 uppercase font-black font-mono tracking-wider border-b border-brand-border">
                <th className="py-3.5 px-4 w-16">ID</th>
                <th className="py-3.5 px-4 w-40">Portada</th>
                <th className="py-3.5 px-4">Familia</th>
                <th className="py-3.5 px-4">Descripción de Segmento</th>
                <th className="py-3.5 px-4 text-right w-24">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {categorias.map(cat => (
                <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-slate-400">#{cat.id}</td>
                  <td className="py-4 px-4">
                    <div className="w-14 h-10 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 p-1 flex items-center justify-center">
                      <img src={cat.urlImagen} alt="" className="max-w-full max-h-full object-contain" onError={e => e.target.style.display = 'none'} />
                    </div>
                  </td>
                  <td className="py-4 px-4 font-black text-brand-dark text-sm">{cat.nombre}</td>
                  <td className="py-4 px-4 text-slate-500 max-w-xs truncate">{cat.descripcion}</td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button onClick={() => setCatEnEdicion(cat)} className="p-2 hover:bg-slate-100 text-slate-400 hover:text-brand-dark rounded-xl cursor-pointer transition-colors"><Edit size={14}/></button>
                      
                      {/* BOTÓN CLARO DE ELIMINACIÓN */}
                      <button onClick={() => setCatParaEliminar(cat)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl cursor-pointer transition-colors"><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MECANISMO DE CONFIRMACIÓN PREVENTIVO */}
      {catParaEliminar && (
        <div className="fixed inset-0 bg-brand-dark/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-brand-border rounded-3xl p-6 max-w-md w-full shadow-2xl relative text-center flex flex-col items-center">
            
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4 border border-red-100 shadow-2xs">
              <AlertTriangle size={22} />
            </div>

            {/* Mensaje claro detallando la categoría específica a punto de eliminarse */}
            <h3 className="text-base font-black text-brand-dark uppercase tracking-tight">
              ¿Confirmar eliminación de {catParaEliminar.nombre}?
            </h3>
            
            {/* Mensaje explícito detallando las consecuencias de la baja */}
            <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">
              Está a punto de dar de baja la categoría <span className="font-extrabold text-brand-primary">#{catParaEliminar.id} - {catParaEliminar.nombre}</span>. Esta acción es destructiva e inalterable, y podría afectar la visibilidad de los productos vinculados en el catálogo.
            </p>

            {/* Opciones claras para Confirmar o Cancelar la baja de forma consciente */}
            <div className="flex space-x-2.5 w-full mt-6 pt-4 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => setCatParaEliminar(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-brand-dark text-xs font-bold py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar Acción
              </button>
              <button 
                type="button"
                onClick={ejecutarEliminacionDefinitiva}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Confirmar Baja
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
