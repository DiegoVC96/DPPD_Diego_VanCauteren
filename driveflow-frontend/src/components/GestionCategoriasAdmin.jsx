import { useEffect, useState, useContext } from 'react';
import { Edit, Trash2, AlertTriangle, Car, Compass, Gauge, Zap, HelpCircle } from 'lucide-react';
import FormularioEditarCategoria from './FormularioEditarCategoria';
import { AuthContext } from '../context/AuthContextStore'; 

const mapeoIconos = { Car, Compass, Gauge, Zap };

export default function GestionCategoriasAdmin() {
  const { usuario } = useContext(AuthContext); 
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // Controles de modales (US Bonus #2)
  const [catParaEliminar, setCatParaEliminar] = useState(null);
  const [catEnEdicion, setCatEnEdicion] = useState(null);

  const cargarCategorias = () => {
    fetch('http://localhost:8080/api/categorias')
      .then(res => res.json())
      .then(data => { setCategorias(data); setCargando(false); })
      .catch(() => setCargando(false));
  };

  useEffect(() => { cargarCategorias(); }, []);

  const ejecutarEliminacion = async () => {
    try {
      const credencialesBase64 = btoa(`${usuario.email}:${usuario.password}`);

      const res = await fetch(`http://localhost:8080/api/categorias/${catParaEliminar.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${credencialesBase64}`
        }
      });

      if (res.status === 409) {
        const datos = await res.json();
        throw new Error(datos.mensaje);
      }
      
      if (!res.ok) throw new Error('No se pudo eliminar la categoría.');

      setCategorias(categorias.filter(c => c.id !== catParaEliminar.id));
      setCatParaEliminar(null);
    } catch (err) {
      alert(err.message);
      setCatParaEliminar(null);
    }
  };

  if (cargando) return <div className="text-center py-6 text-xs text-slate-400 font-medium">Sincronizando familias...</div>;

  if (catEnEdicion) {
    return (
      <FormularioEditarCategoria 
        categoria={catEnEdicion} 
        onCancel={() => setCatEnEdicion(null)} 
        onSaveSuccess={() => { setCatEnEdicion(null); setCargando(true); cargarCategorias(); }} 
      />
    );
  }

  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-xs overflow-hidden relative">
      <div className="px-6 py-4 border-b border-brand-border bg-slate-50/75">
        <h3 className="text-sm font-black text-brand-dark uppercase tracking-wider">Maestro de Categorías Disponibles</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider border-b border-brand-border">
              <th className="py-3.5 px-6 w-24">Id</th>
              <th className="py-3.5 px-6">Icono / Título</th>
              <th className="py-3.5 px-6">Descripción de Segmento</th>
              <th className="py-3.5 px-6 text-right w-44">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-brand-dark">
            {categorias.map(cat => {
              const IconComp = mapeoIconos[cat.icono] || HelpCircle;
              return (
                <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-mono text-xs font-bold text-slate-400">#{cat.id}</td>
                  <td className="py-4 px-6 font-semibold">
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center shrink-0">
                        <IconComp size={14} />
                      </div>
                      <span className="font-bold">{cat.nombre}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-500 max-w-xs truncate">{cat.descripcion}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      {/* EDITAR CATEGORÍA */}
                      <button 
                        onClick={() => setCatEnEdicion(cat)}
                        className="p-1.5 hover:bg-amber-50 text-slate-400 hover:text-amber-600 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit size={15} />
                      </button>
                      
                      {/* ELIMINAR CATEGORÍA */}
                      <button 
                        onClick={() => setCatParaEliminar(cat)}
                        className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* CONFIRMACIÓN DE BORRADO DE CATEGORÍA */}
      {catParaEliminar && (
        <div className="fixed inset-0 bg-brand-dark/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-brand-border p-6 rounded-2xl shadow-xl max-w-sm w-full">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4"><AlertTriangle size={24} /></div>
            <h4 className="text-base font-black text-brand-dark mb-1">¿Confirmas la eliminación?</h4>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">Estás por eliminar de forma permanente la categoría <span className="font-bold text-slate-700">"{catParaEliminar.nombre}"</span> de la base de datos.</p>
            <div className="flex space-x-3">
              <button onClick={() => setCatParaEliminar(null)} className="flex-1 bg-slate-100 text-brand-dark font-bold text-xs py-2.5 rounded-xl cursor-pointer">No, mantener</button>
              <button onClick={ejecutarEliminacion} className="flex-1 bg-red-600 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer hover:bg-red-700">Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
