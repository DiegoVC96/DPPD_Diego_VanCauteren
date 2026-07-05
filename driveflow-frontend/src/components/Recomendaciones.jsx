import { useEffect, useState, useContext } from 'react';
import { ChevronsLeft, Heart } from 'lucide-react';
import { AuthContext } from '../context/AuthContextStore';
import EstrellasPuntaje from './EstrellasPuntaje';

export default function Recomendaciones({ onSeleccionarVehiculo, filtrosCategorias, textoBusqueda }) {
  const { usuario } = useContext(AuthContext); 
  
  const [vehiculos, setVehiculos] = useState([]);
  const [listaFavoritosIds, setListaFavoritosIds] = useState([]); 
  
  const [paginaActual, setPaginaActual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [productosFiltradosCount, setProductosFiltradosCount] = useState(0);
  const [totalProductosCatalogo, setTotalProductosCatalogo] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/vehiculos/paginados?size=100')
      .then(res => res.json())
      .then(data => setTotalProductosCatalogo(data.totalElements || 0))
      .catch(() => {});
  }, []);

  useEffect(() => {
  if (!usuario || !usuario.id) return; 

  let activo = true;

  fetch(`http://localhost:8080/api/usuarios/${usuario.id}/favoritos-completos`, {
    headers: { 'Authorization': `Basic ${usuario.authKey}` }
  })
    .then(res => {
      if (!res.ok) throw new Error('Error de autorización o red en favoritos');
      return res.json();
    })
    .then(data => {
      if (activo && Array.isArray(data)) {
        const mapeoIdsSeguros = data.map(auto => auto.id);
        
        setListaFavoritosIds(mapeoIdsSeguros); 
      }
    })
    .catch((err) => {
      console.warn("Aviso de sincronización de favoritos:", err.message);
    });

  return () => {
    activo = false;
  };
}, [usuario]); 

  useEffect(() => {
  let activo = true;
  setTimeout(() => setCargando(true), 0);

  const stringFiltros = filtrosCategorias && filtrosCategorias.length > 0 ? `&categorias=${filtrosCategorias.join(',')}` : '';
  const stringBusqueda = textoBusqueda && textoBusqueda.trim() !== '' ? `&texto=${encodeURIComponent(textoBusqueda.trim())}` : '';

  fetch(`http://localhost:8080/api/vehiculos/paginados?page=${paginaActual}&size=10${stringFiltros}${stringBusqueda}`)
    .then((res) => { if (!res.ok) throw new Error('Error de red'); return res.json(); })
    .then((data) => {
      if (activo) {
        let loteAutos = data.content || [];
        
        if (!stringFiltros && !stringBusqueda && loteAutos.length > 0) {
          loteAutos = [...loteAutos].sort(() => Math.random() - 0.5);
        }

        setVehiculos(loteAutos);
        setTotalPaginas(data.totalPages || 1); 
        setProductosFiltradosCount(data.totalElements || 0); 
        setCargando(false);
      }
    })
    .catch((err) => { if (activo) { setError(err.message); setCargando(false); } });

  return () => { activo = false; };
}, [paginaActual, filtrosCategorias, textoBusqueda]);

  const conmutarFavoritoInteractiva = async (e, vehiculoId) => {
    e.stopPropagation(); 

    if (!usuario) {
      const params = new URLSearchParams(window.location.search);
      params.set('openLogin', 'true');
      window.location.assign(`${window.location.pathname}?${params.toString()}`);
      return;
    }

    const esFavorito = listaFavoritosIds.includes(vehiculoId);
    const metodoHttp = esFavorito ? 'DELETE' : 'POST';
    const urlEndpoint = `http://localhost:8080/api/usuarios/${usuario.id}/favoritos/${vehiculoId}`;

    try {
      const res = await fetch(urlEndpoint, {
        method: metodoHttp,
        headers: { 'Authorization': `Basic ${usuario.authKey}` }
      });

      if (res.ok) {
        if (esFavorito) {
          setListaFavoritosIds(listaFavoritosIds.filter(id => id !== vehiculoId));
        } else {
          setListaFavoritosIds([...listaFavoritosIds, vehiculoId]);
        }
      }
    } catch (err) {
      console.error("Error al actualizar favoritos", err);
    }
  };

  const cambiarPagina = (nuevaPagina) => {
    setCargando(true);
    setPaginaActual(nuevaPagina);
  };

  if (cargando) return <div className="text-center py-10"><div className="animate-spin inline-block w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full text-brand-primary"></div></div>;
  if (error) return <div className="text-center py-10 text-red-500">⚠️ Error al sincronizar resultados: {error}</div>;

  return (
    <section className="w-full flex flex-col animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-6 gap-2">
        <h2 className="text-xl font-extrabold tracking-tight text-brand-dark md:text-2xl">
          Resultados de búsqueda
        </h2>
        
        {/* Contadores funcionales de stock */}
        <div className="text-xs text-slate-500 font-medium bg-white border border-brand-border px-3 py-2 rounded-xl shadow-2xs flex items-center space-x-2 w-max select-none">
          <span className="font-bold text-brand-primary">{productosFiltradosCount} encontrados</span>
          <span className="text-slate-300">|</span>
          <span>{totalProductosCatalogo} vehículos en catálogo total</span>
        </div>
      </div>

      {/* Grilla distributiva de 2 columnas en escritorios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {vehiculos.length === 0 ? (
          <div className="p-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center col-span-full py-12">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">No se encontraron vehículos coincidentes</p>
            <p className="text-[11px] text-slate-400 mt-1">Pruebe modificando las fechas o la palabra clave ingresada en el buscador.</p>
          </div>
        ) : (
          vehiculos.map((auto) => {
            const marcadoComoFavorito = listaFavoritosIds.includes(auto.id);

            return (
              <div key={auto.id} className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row h-auto sm:h-48 group relative">
                <button
                  type="button"
                  onClick={(e) => conmutarFavoritoInteractiva(e, auto.id)}
                  title={marcadoComoFavorito ? "Quitar de favoritos" : "Marcar como favorito"}
                  className="absolute top-3 right-3 sm:right-auto sm:left-3 z-20 w-8 h-8 rounded-full bg-white/90 text-slate-400 border border-brand-border flex items-center justify-center shadow-xs transition-all duration-300 hover:scale-110 active:scale-90 cursor-pointer backdrop-blur-xs group/fav"
                >
                  <Heart 
                    size={15} 
                    strokeWidth={2.5}
                    className={`transition-colors duration-300 ${
                      marcadoComoFavorito 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-slate-400 group-hover/fav:text-red-400'
                    }`} 
                  />
                </button>

                {/* Contenedor Multimedia */}
                <div className="w-full sm:w-44 h-48 sm:h-full bg-slate-100 overflow-hidden shrink-0 relative flex items-center justify-center">
                  {auto.imagenes && String(auto.imagenes).trim() !== '' ? (
                    <img 
                      src={
                        Array.isArray(auto.imagenes) 
                        ? auto.imagenes[0].trim() 
                        : String(auto.imagenes).split(',')[0].trim() 
                      } 
                      alt={auto.nombre} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      onError={(e) => {
                        e.target.src = 'https://unsplash.com';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50 font-mono text-[10px] uppercase font-bold">
                      <span>No Photo</span>
                    </div>
                  )}
                </div>

                {/* Panel Descriptor */}
                <div className="p-5 flex flex-col justify-between grow min-w-0">
                  <div>
                    <h3 className="font-extrabold text-base text-brand-dark mb-1 truncate group-hover:text-brand-primary transition-colors">{auto.nombre}</h3>
                    <div className="mb-2">
                      <EstrellasPuntaje promedio={auto.promedioPuntuacion} total={auto.totalPuntuaciones} tamano={12} />
                    </div>
                    <p className="text-slate-500 text-xs line-clamp-2 md:line-clamp-3">{auto.descripcion}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Tarifa</span>
                      <span className="text-brand-primary font-black text-base">${auto.precioPorDia.toLocaleString('es-AR')}</span>
                    </div>
                    <button onClick={() => onSeleccionarVehiculo(auto.id)} className="bg-slate-100 hover:bg-brand-primary hover:text-white text-brand-dark font-bold text-xs py-2 px-4 rounded-xl cursor-pointer transition-colors">Ver detalle</button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Botonera de Paginación Fluida */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-center space-x-2 bg-white border border-brand-border py-3 px-4 rounded-2xl shadow-xs max-w-md mx-auto w-full">
          <button
            onClick={() => cambiarPagina(0)}
            disabled={paginaActual === 0}
            className="p-2 rounded-xl border border-brand-border hover:bg-slate-50 text-brand-dark disabled:opacity-30 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronsLeft size={16} />
          </button>

          <button
            onClick={() => cambiarPagina(Math.max(0, paginaActual - 1))}
            disabled={paginaActual === 0}
            className="flex items-center space-x-1 px-3 py-2 rounded-xl border border-brand-border hover:bg-slate-50 text-xs font-bold text-brand-dark disabled:opacity-30 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <span className="text-[14px]">&lsaquo;</span>
            <span>Atrás</span>
          </button>

          <div className="px-4 text-xs font-bold text-brand-dark font-mono bg-slate-50 py-2 rounded-xl border border-brand-border">
            {paginaActual + 1} / {totalPaginas}
          </div>

          <button
            onClick={() => cambiarPagina(Math.min(totalPaginas - 1, paginaActual + 1))}
            disabled={paginaActual >= totalPaginas - 1}
            className="flex items-center space-x-1 px-3 py-2 rounded-xl border border-brand-border hover:bg-slate-50 text-xs font-bold text-brand-dark disabled:opacity-30 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <span>Siguiente</span>
            <span className="text-[14px]">&rsaquo;</span>
          </button>
        </div>
      )}
    </section>
  );
}
