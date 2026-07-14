import { useState, useEffect, useContext } from 'react';
import { Calendar, User, Car, ArrowLeft, Phone, MapPin, Sliders } from 'lucide-react';
import { DateRange } from 'react-date-range';
import { es } from 'date-fns/locale';
import { AuthContext } from '../context/AuthContextStore';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

function formatearFechaISO(d) {
  if (!d) return null;
  const fecha = new Date(d);
  const yyyy = fecha.getFullYear();
  const mm = String(fecha.getMonth() + 1).padStart(2, '0');
  const dd = String(fecha.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function FormularioReserva({ vehiculoId, onVolver }) {
  const { usuario } = useContext(AuthContext);
  
  const [vehiculo, setVehiculo] = useState(null);
  const [fechasOcupadas, setFechasOcupadas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorServidor, setErrorServidor] = useState('');
  const [exito, setExito] = useState(false);
  const [telefono, setTelefono] = useState('');
  const [ciudadRetiro, setCiudadRetiro] = useState('Buenos Aires, Argentina');

  const [rangoSeleccionado, setRangoSeleccionado] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  useEffect(() => {
    let activo = true;

    Promise.all([
      fetch(`http://localhost:8080/api/vehiculos/${vehiculoId}`).then(res => res.json()),
      fetch(`http://localhost:8080/api/reservas/ocupadas/${vehiculoId}`).then(res => res.json())
    ])
      .then(([dataVehiculo, dataFechas]) => {
        if (activo) {
          setVehiculo(dataVehiculo);
          const objetosFecha = dataFechas.map(str => new Date(str + 'T00:00:00'));
          setFechasOcupadas(objetosFecha);
          setCargando(false);
        }
      })
      .catch(() => {
        if (activo) setCargando(false);
      });

    return () => { activo = false; };
  }, [vehiculoId]);

  const ejecutarReservaFinal = async (e) => {
    e.preventDefault();
    setErrorServidor('');

    const inicio = rangoSeleccionado[0].startDate;
    const fontFin = rangoSeleccionado[0].endDate;

    if (!inicio || !fontFin || inicio.toDateString() === fontFin.toDateString()) {
      setErrorServidor("Debe seleccionar un período válido de al menos 1 día completo de alquiler.");
      return;
    }

    let actual = new Date(inicio);
    while (actual <= fontFin) {
      const match = fechasOcupadas.some(d => d.toDateString() === actual.toDateString());
      if (match) {
        setErrorServidor("⚠️ El período seleccionado incluye jornadas que ya cuentan con reservas previas.");
        return;
      }
      actual.setDate(actual.getDate() + 1);
    }

    const payload = {
      fechaInicio: formatearFechaISO(inicio),
      fechaFin: formatearFechaISO(fontFin),
      vehiculoId: parseInt(vehiculoId, 10),
      usuarioId: usuario.id,
      telefono: telefono.trim() !== '' ? telefono.trim() : 'No Proporcionado',
      ciudadRetiro: ciudadRetiro.trim() !== '' ? ciudadRetiro.trim() : 'Sede Central'
    };

    try {
      const res = await fetch('http://localhost:8080/api/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${usuario.authKey}`
        },
        body: JSON.stringify(payload)
      });

      const datos = await res.json();

      if (!res.ok) {
        throw new Error(datos.mensaje || 'Ocurrió un conflicto de red inesperado.');
      }

      setExito(true);
    } catch (err) {
      setErrorServidor(err.message); 
    }
  };

  if (cargando) return <div className="text-center py-20 text-xs text-slate-400 font-bold font-mono animate-pulse">Sincronizando especificaciones de checkout relacional...</div>;

  const imagenes = vehiculo?.imagenes && String(vehiculo.imagenes).trim() !== ''
    ? String(vehiculo.imagenes).split(',')
    : ['https://unsplash.com'];
  return (
    <div className="w-full flex flex-col text-brand-dark animate-fade-in pt-16 lg:pt-20">
      
      {/* HEADER DE CONTROL */}
      <div className="flex items-center justify-between mb-8 border-b border-brand-border pb-4 gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] text-brand-primary uppercase font-bold tracking-widest font-mono">Step 2 / Checkout</span>
          <h2 className="text-xl md:text-2xl font-black tracking-tight uppercase">Confirmar Reserva de Unidad</h2>
        </div>
        <button onClick={onVolver} className="text-xs bg-white border border-brand-border text-slate-600 font-bold py-2 px-4 rounded-xl hover:bg-slate-50 flex items-center space-x-1.5 cursor-pointer shadow-2xs transition-transform active:scale-95"><ArrowLeft size={14} /><span>Cambiar vehículo</span></button>
      </div>

      {exito ? (
        <div className="bg-white border border-brand-border rounded-3xl p-8 max-w-xl mx-auto text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center mx-auto text-xl font-bold">✓</div>
          <h3 className="text-lg font-black uppercase text-brand-dark">¡Contrato de Alquiler Registrado!</h3>
          <p className="text-xs text-slate-500 leading-relaxed">Su reserva ha sido procesada de forma atómica en XAMPP. Hemos despachado un correo electrónico con las directivas de cobertura, seguro y retiro de la unidad a su casilla <span className="font-bold">{usuario.email}</span>.</p>
          <button onClick={onVolver} className="w-full bg-brand-dark text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider mt-4 cursor-pointer">Regresar al inicio</button>
        </div>
      ) : (
        <form onSubmit={ejecutarReservaFinal} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" noValidate>
          {errorServidor && <div className="col-span-full p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-100">⚠️ {errorServidor}</div>}

          {/* COLUMNA IZQUIERDA: FORMULARIO Y SELECCIÓN DE FECHAS */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* VISUALIZACIÓN DETALLADA DE DATOS DEL USUARIO */}
            <div className="bg-white border border-brand-border p-6 rounded-2xl shadow-2xs space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center space-x-2"><User size={14}/><span>Datos del Conductor Designado</span></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Nombre y Apellido</label>
                  <input type="text" disabled value={`${usuario.nombre} ${usuario.apellido}`} className="w-full bg-slate-50 border border-brand-border rounded-xl p-2.5 text-xs font-semibold text-slate-500 cursor-not-allowed focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Correo Electrónico</label>
                  <input type="text" disabled value={usuario.email} className="w-full bg-slate-50 border border-brand-border rounded-xl p-2.5 text-xs font-semibold text-slate-500 cursor-not-allowed focus:outline-none" />
                </div>
                
                {/* POSIBILIDAD DE AMPLIAR DATOS EXIGIDA POR LA RÚBRICA */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-brand-primary mb-1">Teléfono de Contacto (Ampliar)</label>
                  <div className="relative flex items-center bg-white rounded-xl border border-brand-border px-3 py-2">
                    <Phone size={14} className="text-slate-400 mr-2 shrink-0" />
                    <input type="tel" value={telefono} onChange={e => setTelefono(e.target.value)} required className="w-full bg-transparent text-xs font-medium focus:outline-none text-slate-700" placeholder="Ej: +54 9 11 1234-5678" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-brand-primary mb-1">Ciudad de Retiro / Destino (Ampliar)</label>
                  <div className="relative flex items-center bg-white rounded-xl border border-brand-border px-3 py-2">
                    <MapPin size={14} className="text-slate-400 mr-2 shrink-0" />
                    <input type="text" value={ciudadRetiro} onChange={e => setCiudadRetiro(e.target.value)} required className="w-full bg-transparent text-xs font-medium focus:outline-none text-slate-700" placeholder="Ciudad de entrega de la unidad..." />
                  </div>
                </div>
              </div>
            </div>

            {/* RANGO CRONOLÓGICO SELECCIONADO VALIDADO */}
            <div className="bg-white border border-brand-border p-6 rounded-2xl shadow-2xs space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center space-x-2"><Calendar size={14}/><span>Período Cronológico Seleccionado (Rango Válido)</span></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Retiro de Unidad</label>
                  <input type="text" disabled value={rangoSeleccionado[0].startDate.toLocaleDateString('es-AR', { dateStyle: 'long' })} className="w-full bg-slate-50 border border-brand-border rounded-xl p-2.5 text-xs font-bold font-mono text-brand-primary cursor-not-allowed focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Devolución de Unidad</label>
                  <input type="text" disabled value={rangoSeleccionado[0].endDate.toLocaleDateString('es-AR', { dateStyle: 'long' })} className="w-full bg-slate-50 border border-brand-border rounded-xl p-2.5 text-xs font-bold font-mono text-brand-primary cursor-not-allowed focus:outline-none" />
                </div>
              </div>

              {/* Selector de Calendario Doble */}
              <div className="w-full overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-2 flex justify-center select-none date-range-interactive-picker">
                <DateRange
                  editableDateInputs={true}
                  onChange={item => setRangoSeleccionado([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={rangoSeleccionado}
                  disabledDates={fechasOcupadas} 
                  minDate={new Date()}
                  direction="horizontal"
                  months={2}
                  locale={es}
                  rangeColors={['#2563EB']}
                />
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: US #31 - RESUMEN CON DETALLE DEL PRODUCTO COMPLETO */}
          <div className="lg:col-span-4 bg-white border border-brand-border p-5 rounded-2xl shadow-2xs space-y-4 flex flex-col">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center space-x-2"><Car size={14}/><span>Especificaciones de la Flota</span></h3>
            
            {/* Imagen Clara y Representativa */}
            <div className="w-full h-36 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden p-2 flex items-center justify-center">
              <img src={imagenes[0].trim()} alt={vehiculo.nombre} className="max-w-full max-h-full object-contain" />
            </div>

            {/* Título e Información Destacada */}
            <div>
              <h4 className="font-black text-base text-brand-dark uppercase tracking-tight">{vehiculo.nombre}</h4>
              <p className="text-[10px] text-brand-primary uppercase font-extrabold font-mono mt-0.5 tracking-wider bg-blue-50/50 px-2 py-0.5 rounded border border-blue-100/50 w-max">{vehiculo.categoria?.nombre || 'Premium'}</p>
            </div>

            {/* Descripción Breve y Concisa */}
            <div>
              <span className="block text-[9px] font-bold uppercase text-slate-400 mb-0.5 tracking-wider">Descripción Breve</span>
              <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 font-medium bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/50">{vehiculo.descripcion}</p>
            </div>

            {/* Atributos y Detalles */}
            <div className="space-y-1.5 bg-slate-50/50 border border-slate-100 p-3 rounded-xl">
              <span className="block text-[9px] font-bold uppercase text-slate-400 mb-1.5 tracking-wider items-center space-x-1"><Sliders size={10}/><span>Equipamiento Destacado</span></span>
              <div className="flex flex-wrap gap-1">
                {vehiculo.caracteristicas?.slice(0, 4).map(c => (
                  <span key={c.id} className="text-[10px] font-bold bg-white text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md flex items-center space-x-1"><span className="w-1 h-1 rounded-full bg-slate-400"></span><span>{c.nombre}</span></span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Tarifa por Jornada</span>
                <span className="font-black text-brand-primary text-base">${vehiculo.precioPorDia.toLocaleString('es-AR')}</span>
              </div>
            </div>
            {/* BOTÓN DE SUBMIT PARA CONFIRMAR LA RESERVA */}
            <button type="submit" className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105">
              Confirmar Contrato de Alquiler
            </button>
          </div>
        </form>
      )}
    </div>
  );
}