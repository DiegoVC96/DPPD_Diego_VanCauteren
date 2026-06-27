import { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';


export default function Categorias({ filtrosActivos, onCambiarFiltro, onLimpiarFiltros }) {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/categorias')
      .then(res => res.json())
      .then(data => { setCategorias(data); setCargando(false); })
      .catch(() => setCargando(false));
  }, []);

  if (cargando) return <div className="text-center py-4"><div className="animate-spin inline-block w-5 h-5 border-3 border-brand-primary border-t-transparent rounded-full text-brand-primary"></div></div>;

  return (
    <section className="w-full">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-extrabold tracking-tight text-brand-dark md:text-2xl">
          Filtrar por categoría
        </h2>
        {/* BOTÓN: Permitir al usuario eliminar los filtros aplicados */}
        {filtrosActivos.length > 0 && (
          <button 
            onClick={onLimpiarFiltros}
            className="text-xs font-bold text-brand-primary hover:text-blue-700 flex items-center space-x-1 transition-colors cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Eliminar filtros</span>
          </button>
        )}
      </div>
      
      {/* Grilla responsiva adaptada a móviles, tablets y monitores de escritorio */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categorias.map((cat) => {
          const estaSeleccionado = filtrosActivos.includes(cat.id);
          const tieneImagenValida = cat.urlImagen && cat.urlImagen.trim() !== '';

          return (
            <div 
              key={cat.id} 
              onClick={() => onCambiarFiltro(cat.id)}
              className={`border p-5 rounded-2xl shadow-2xs group cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center select-none ${
              estaSeleccionado 
              ? 'bg-brand-dark border-brand-dark text-white' 
              : 'bg-white border-brand-border hover:border-brand-primary text-brand-dark'
              }`}
              >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 overflow-hidden p-1.5 transition-colors duration-300 ${
                estaSeleccionado ? 'bg-brand-primary text-white' : 'bg-slate-50 text-slate-500 group-hover:bg-blue-50'
                }`}>
                {tieneImagenValida ? (
                  <img 
                    src={cat.urlImagen.trim()} 
                    alt="" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-xs font-black uppercase font-mono tracking-wider">
                    {cat.nombre.charAt(0)}
                  </span>
                )}
              </div>
      
              <span className={`font-extrabold text-sm tracking-tight ${estaSeleccionado ? 'text-white' : 'group-hover:text-brand-primary'}`}>
                {cat.nombre}
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-1 line-clamp-1 hidden md:block px-1">
                {cat.descripcion}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
