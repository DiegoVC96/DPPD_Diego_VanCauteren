import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft } from 'lucide-react';

export default function Recomendaciones({ onSeleccionarVehiculo }) {
  const [vehiculos, setVehiculos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;

    fetch(`http://localhost:8080/api/vehiculos/paginados?page=${paginaActual}&size=10`)
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error('Error al conectar con el servidor');
        return respuesta.json();
      })
      .then((data) => {
        // Solo actualizamos el estado si el componente sigue montado en la misma página
        if (activo) {
          setVehiculos(data.content || []);
          setTotalPaginas(data.totalPages || 0);
          setCargando(false); // Seteamos la carga directamente en la resolución asíncrona
        }
      })
      .catch((err) => {
        if (activo) {
          setError(err.message);
          setCargando(false);
        }
      });

    // Cancela el efecto si el usuario hace clic rápido en "Siguiente"
    return () => {
      activo = false;
    };
  }, [paginaActual]); // El efecto escucha limpiamente los cambios de página

  // Función envoltorio para cambiar la página que asume la mutación de estado de carga de forma segura
  const cambiarPagina = (nuevaPagina) => {
    setError(null);
    setCargando(true); // Se ejecuta en el hilo de interacción del usuario, no dentro del cuerpo del efecto
    setPaginaActual(nuevaPagina);
  };

  if (cargando) {
    return (
      <div className="w-full text-center py-12">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full text-brand-primary"></div>
        <p className="text-sm text-slate-400 mt-2">Sincronizando flota...</p>
      </div>
    );
  }

  if (error) return <div className="text-center py-10 text-red-500">⚠️ Error: {error}</div>;
  if (vehiculos.length === 0) return <div className="text-center py-10 text-slate-400">No hay vehículos.</div>;

  return (
    <section className="w-full flex flex-col">
      <div className="flex justify-between items-baseline mb-6">
        <h2 className="text-xl font-extrabold tracking-tight text-brand-dark md:text-2xl">
          Explora nuestra flota
        </h2>
        <span className="text-xs text-slate-400 font-bold bg-white border border-brand-border px-3 py-1.5 rounded-xl shadow-xs">
          Página {paginaActual + 1} de {totalPaginas}
        </span>
      </div>

      {/* DISEÑO EXIGIDO EN US #4: 2 columnas en escritorios (Máximo 5 filas por los 10 items) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {vehiculos.map((auto) => (
          <div key={auto.id} className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row h-auto sm:h-48 group">
            <div className="w-full sm:w-44 h-48 sm:h-full bg-slate-100 overflow-hidden shrink-0">
              {auto.imagenes && auto.imagenes.length > 0 ? (
                <img src={auto.imagenes[0]} alt={auto.nombre} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">Sin foto</div>
              )}
            </div>
            <div className="p-5 flex flex-col justify-between grow min-w-0">
              <div>
                <h3 className="font-extrabold text-base text-brand-dark mb-1 truncate group-hover:text-brand-primary transition-colors">{auto.nombre}</h3>
                <p className="text-slate-500 text-xs line-clamp-2 md:line-clamp-3">{auto.descripcion}</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Tarifa</span>
                  <span className="text-brand-primary font-black text-base">${auto.precioPorDia.toLocaleString('es-AR')}</span>
                </div>
                <button onClick={() => onSeleccionarVehiculo(auto.id)} className="bg-slate-100 hover:bg-brand-primary hover:text-white text-brand-dark font-bold text-xs py-2 px-4 rounded-xl cursor-pointer">Ver detalle</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* BOTONERA ACTUALIZADA LLAMANDO A LA FUNCIÓN SEGURA 'cambiarPagina' */}
      <div className="flex items-center justify-center space-x-2 bg-white border border-brand-border py-3 px-4 rounded-2xl shadow-xs max-w-md mx-auto w-full">
        
        {/* Botón Inicio */}
        <button
          onClick={() => cambiarPagina(0)}
          disabled={paginaActual === 0}
          className="p-2 rounded-xl border border-brand-border hover:bg-slate-50 text-brand-dark disabled:opacity-30 transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronsLeft size={16} />
        </button>

        {/* Botón Atrás */}
        <button
          onClick={() => cambiarPagina(Math.max(0, paginaActual - 1))}
          disabled={paginaActual === 0}
          className="flex items-center space-x-1 px-3 py-2 rounded-xl border border-brand-border hover:bg-slate-50 text-xs font-bold text-brand-dark disabled:opacity-30 transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeft size={14} />
          <span>Atrás</span>
        </button>

        {/* Contador Central */}
        <div className="px-4 text-xs font-bold text-brand-dark font-mono bg-slate-50 py-2 rounded-xl border border-brand-border">
          {paginaActual + 1} / {totalPaginas || 1}
        </div>

        {/* Botón Adelante */}
        <button
          onClick={() => cambiarPagina(Math.min(totalPaginas - 1, paginaActual + 1))}
          disabled={paginaActual >= totalPaginas - 1}
          className="flex items-center space-x-1 px-3 py-2 rounded-xl border border-brand-border hover:bg-slate-50 text-xs font-bold text-brand-dark disabled:opacity-30 transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          <span>Siguiente</span>
          <ChevronRight size={14} />
        </button>

      </div>
    </section>
  );
}