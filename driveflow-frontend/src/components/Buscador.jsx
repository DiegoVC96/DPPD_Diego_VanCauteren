import { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Search, X, Loader2 } from 'lucide-react';
import { DateRange } from 'react-date-range';
import { es } from 'date-fns/locale';
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 

export default function Buscador({ onEjecutarBusqueda, onLimpiarBusqueda }) {
  const [queryTexto, setQueryTexto] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [cargandoSugerencias, setCargandoSugerencias] = useState(false);

  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [rangoFechas, setRangoFechas] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  const buscadorRef = useRef(null);

  const manejarCambioInput = (valor) => {
    setQueryTexto(valor);
    
    if (valor.trim().length < 2) {
      setSugerencias([]);
      setMostrarSugerencias(false);
      setCargandoSugerencias(false); 
    } else {
      setMostrarSugerencias(true);
      setCargandoSugerencias(true); 
    }
  };

  useEffect(() => {
    function hacerClicAfuera(e) {
      if (buscadorRef.current && !buscadorRef.current.contains(e.target)) {
        setMostrarSugerencias(false);
        setMostrarCalendario(false);
      }
    }
    document.addEventListener('mousedown', hacerClicAfuera);
    return () => document.removeEventListener('mousedown', hacerClicAfuera);
  }, []);

  useEffect(() => {
    if (queryTexto.trim().length < 2) return;

    let activo = true;

    const delayDebounce = setTimeout(() => {
      fetch(`http://localhost:8080/api/vehiculos/paginados?size=50`)
        .then(res => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then(data => {
          if (activo) {
            const vehiculosLote = data.content || data;
            const filtrados = vehiculosLote.filter(v => 
              v.nombre.toLowerCase().includes(queryTexto.toLowerCase())
            );
            setSugerencias(filtrados);
            setCargandoSugerencias(false); 
          }
        })
        .catch(() => {
          if (activo) setCargandoSugerencias(false);
        });
    }, 300); 

    return () => {
      activo = false;
      clearTimeout(delayDebounce);
    };
  }, [queryTexto]);

  const formatearFecha = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const procesarEnvioBusqueda = (e) => {
    e.preventDefault();
    setMostrarCalendario(false);
    setMostrarSugerencias(false);
    
    onEjecutarBusqueda({
      texto: queryTexto.trim(),
      fechaInicio: rangoFechas.startDate,
      fechaFin: rangoFechas.endDate
    });
  };

  return (
    <div className="w-full bg-brand-dark text-white rounded-3xl p-6 md:p-8 shadow-md relative" ref={buscadorRef}>
      {/* DISEÑO DEL BLOQUE */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-black tracking-tight uppercase">Alquila el auto de tus sueños</h2>
        <p className="text-xs text-slate-400 mt-1">Selecciona el modelo ideal y define las fechas de tu próximo viaje sin sobre-reservas.</p>
      </div>

      <form onSubmit={procesarEnvioBusqueda} className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
        {/* Búsqueda Interactiva con Autocompletado */}
        <div className="lg:col-span-5 relative">
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 tracking-wider">¿Qué vehículo buscas?</label>
          <div className="relative flex items-center bg-white text-brand-dark rounded-xl border border-brand-border px-3.5 py-2.5">
            <MapPin size={16} className="text-slate-400 mr-2.5 shrink-0" />
            <input 
              type="text" 
              value={queryTexto}
              onChange={(e) => manejarCambioInput(e.target.value)} 
              onFocus={() => { if (queryTexto.trim().length >= 2) setMostrarSugerencias(true); }}
              className="w-full bg-transparent text-xs font-semibold focus:outline-none placeholder-slate-400"
              placeholder="Ej: Tesla, BMW, Audi..."
            />
            {cargandoSugerencias && <Loader2 size={14} className="animate-spin text-brand-primary" />}
            {queryTexto && (
              <button type="button" onClick={() => { setQueryTexto(''); onLimpiarBusqueda(); }} className="text-slate-400 hover:text-brand-dark ml-1"><X size={14} /></button>
            )}
          </div>

          {/* DESPLEGABLE DE SUGERENCIAS FLOTANTES */}
          {mostrarSugerencias && sugerencias.length > 0 && (
            <div className="absolute left-0 right-0 top-17 bg-white border border-brand-border rounded-xl shadow-xl z-50 overflow-hidden text-brand-dark divide-y divide-slate-100 animate-fade-in max-h-48 overflow-y-auto">
              {sugerencias.map(v => (
                <div 
                  key={v.id}
                  onClick={() => { setQueryTexto(v.nombre); setMostrarSugerencias(false); }}
                  className="px-4 py-2.5 text-xs font-bold hover:bg-blue-50/50 hover:text-brand-primary cursor-pointer flex justify-between items-center"
                >
                  <span>{v.nombre}</span>
                  <span className="text-[10px] text-slate-400 font-normal uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">{v.categoria?.nombre || 'Flota'}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rango de Fechas con Calendario Doble */}
        <div className="lg:col-span-5 relative">
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 tracking-wider">Período de Alquiler (Entrega - Devolución)</label>
          <div 
            onClick={() => setMostrarCalendario(!mostrarCalendario)}
            className="relative flex items-center bg-white text-brand-dark rounded-xl border border-brand-border px-3.5 py-2.5 cursor-pointer select-none"
          >
            <Calendar size={16} className="text-slate-400 mr-2.5 shrink-0" />
            <span className="text-xs font-bold text-slate-700">
              {rangoFechas[0].startDate && rangoFechas[0].endDate && rangoFechas[0].startDate !== rangoFechas[0].endDate
                ? `${formatearFecha(rangoFechas[0].startDate)} - ${formatearFecha(rangoFechas[0].endDate)}`
                : 'Seleccionar fechas de viaje...'}
            </span>
          </div>

          {/* CAJA DEL CALENDARIO DOBLE FLOTANTE */}
          {mostrarCalendario && (
            <div className="absolute left-0 lg:left-auto lg:right-0 top-17 bg-white border border-brand-border rounded-2xl shadow-2xl z-50 overflow-hidden p-2 text-brand-dark animate-fade-in">
              <DateRange
                editableDateInputs={true}
                onChange={item => setRangoFechas([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={rangoFechas}
                months={2} // CALENDARIO DOBLE EXIGIDO
                direction="horizontal"
                locale={es}
                minDate={new Date()} 
                rangeColors={['#2563EB']} 
              />
            </div>
          )}
        </div>

        {/* BOTÓN OFICIAL DE REALIZAR BÚSQUEDA */}
        <div className="lg:col-span-2">
          <button 
            type="submit"
            className="w-full bg-brand-primary hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer h-10.5"
          >
            <Search size={14} />
            <span>Buscar</span>
          </button>
        </div>
      </form>
    </div>
  );
}
