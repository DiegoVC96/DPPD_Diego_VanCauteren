import { useEffect, useState, useContext } from 'react';
import { Trash2, Car, ArrowLeft } from 'lucide-react';
import { AuthContext } from '../context/AuthContextStore';

export default function MisFavoritos({ onSeleccionarVehiculo, onVolverAlCatalogo }) {
  const { usuario } = useContext(AuthContext);
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  if (!usuario || !usuario.id) return;
  
  let activo = true;

  fetch(`http://localhost:8080/api/usuarios/${usuario.id}/favoritos-completos`, {
    headers: { 'Authorization': `Basic ${usuario.authKey}` }
  })
    .then(res => { 
      if (!res.ok) throw new Error('Error al sincronizar tu biblioteca de favoritos'); 
      return res.json(); 
    })
    .then(data => {
      if (activo && Array.isArray(data)) {
        setFavoritos(data); 
        setCargando(false);
      }
    })
    .catch(err => { 
      if (activo) { setError(err.message); setCargando(false); }
    });

  return () => { activo = false; };
}, [usuario]);

  const eliminarDeFavoritosDirecto = async (e, vehiculoId) => {
    e.stopPropagation(); 

    try {
      const res = await fetch(`http://localhost:8080/api/usuarios/${usuario.id}/favoritos/${vehiculoId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Basic ${usuario.authKey}` }
      });

      if (res.ok) {
        setFavoritos(favoritos.filter(f => f.id !== vehiculoId));
      }
    } catch (err) {
      console.error("No se pudo remover el automóvil de favoritos", err);
    }
  };

  if (cargando) return <div className="text-center py-20 text-xs text-slate-400 font-bold font-mono animate-pulse">Sincronizando tus vehículos preferidos...</div>;
  if (error) return <div className="p-4 bg-red-50 text-red-700 text-xs font-semibold rounded-xl text-center">⚠️ Error: {error}</div>;

  return (
    <section className="w-full flex flex-col text-brand-dark animate-fade-in pt-16 lg:pt-20">
      
      {/* Barra de Navegación de Sección */}
      <div className="flex items-center justify-between mb-8 border-b border-brand-border pb-4 gap-4">
        <div className="flex flex-col">
          <h2 className="text-xl md:text-2xl font-black tracking-tight uppercase">Mis Autos Favoritos</h2>
          <p className="text-xs text-slate-400 mt-1">Revisa y gestiona la lista de los vehículos guardados para tus próximas aventuras.</p>
        </div>
        <button 
          onClick={onVolverAlCatalogo}
          className="text-xs bg-white border border-brand-border text-slate-600 font-bold py-2 px-4 rounded-xl hover:bg-slate-50 shadow-2xs flex items-center space-x-1.5 cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Volver a la tienda</span>
        </button>
      </div>

      {/* COMPATIBILIDAD MULTI-DISPOSITIVO: Grilla responsiva de tarjetas */}
      {favoritos.length === 0 ? (
        <div className="p-8 bg-slate-50 border border-dashed border-slate-200 rounded-3xl text-center py-16 max-w-xl mx-auto w-full">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3"><Car size={20} /></div>
          <h3 className="font-extrabold text-sm text-slate-700 uppercase tracking-tight">Tu lista está vacía</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">Explora el catálogo en el inicio de la plataforma y haz clic sobre el ícono del corazón de cualquier auto para guardarlo aquí.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favoritos.map((auto) => (
            <div 
              key={auto.id}
              className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row h-auto sm:h-44 group relative"
            >
              {/* Contenedor de Foto */}
              <div className="w-full sm:w-40 h-44 sm:h-full bg-slate-100 overflow-hidden shrink-0 relative flex items-center justify-center">
                <img 
                  src={
                    Array.isArray(auto.imagenes) 
                    ? auto.imagenes[0].trim() 
                    : String(auto.imagenes).split(',')[0].trim()
                  } 
                  alt={auto.nombre} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => e.target.src = 'https://unsplash.com'}
                />
              </div>

              {/* Panel de Especificaciones */}
              <div className="p-4 flex flex-col justify-between grow min-w-0">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-extrabold text-base text-brand-dark truncate group-hover:text-brand-primary transition-colors">{auto.nombre}</h3>
                    
                    {/* ACCIÓN DE ELIMINACIÓN DIRECTA CON UN CLIC */}
                    <button
                      type="button"
                      onClick={(e) => eliminarDeFavoritosDirecto(e, auto.id)}
                      title="Eliminar de favoritos"
                      className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="text-slate-500 text-xs line-clamp-2 mt-1 leading-relaxed">{auto.descripcion}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Tarifa</span>
                    <span className="text-brand-primary font-black text-sm">${auto.precioPorDia.toLocaleString('es-AR')}</span>
                  </div>
                  <button 
                    onClick={() => onSeleccionarVehiculo(auto.id)}
                    className="bg-slate-50 hover:bg-brand-primary hover:text-white text-brand-dark font-bold text-xs py-2 px-3.5 rounded-xl cursor-pointer transition-colors"
                  >
                    Ver detalle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
