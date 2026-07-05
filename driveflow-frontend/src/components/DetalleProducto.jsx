import { useEffect, useState, useContext } from 'react';
import { ArrowLeft, X, Image as ImageIcon, RotateCcw, Star, Send, Share2 } from 'lucide-react';
import { DateRange } from 'react-date-range';
import { es } from 'date-fns/locale';
import { AuthContext } from '../context/AuthContextStore'; 
import EstrellasPuntaje from './EstrellasPuntaje';
import ModalCompartir from './ModalCompartir';
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css';

export default function DetalleProducto({ vehiculoId, onVolver }) {
  const { usuario } = useContext(AuthContext);

  const [vehiculo, setVehiculo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [fechasOcupadas, setFechasOcupadas] = useState([]);
  const [errorFechas, setErrorFechas] = useState(false);
  const [cargandoFechas, setCargandoFechas] = useState(true);
  const [reseñas, setReseñas] = useState([]);
  const [notaMedia, setNotaMedia] = useState(0);
  const [estrellasSeleccionadas, setEstrellasSeleccionadas] = useState(5);
  const [comentarioInput, setComentarioInput] = useState('');
  const [enviandoReseña, setEnviandoReseña] = useState(false);
  const [modalShareAbierto, setModalShareAbierto] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [indiceImagenActiva, setIndiceImagenActiva] = useState(0);
  const [disparadorReintento, setDisparadorReintento] = useState(0);

  const urlInmutableProducto = `${window.location.origin}${window.location.pathname}?id=${vehiculoId}`;

  const reintentarCargaManual = () => {
    setError(null);
    setErrorFechas(false);
    setCargando(true);
    setCargandoFechas(true);
    setDisparadorReintento(prev => prev + 1);
  };

  useEffect(() => {
    let activo = true;

    fetch(`http://localhost:8080/api/vehiculos/${vehiculoId}`)
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => { if (activo) { setVehiculo(data); setCargando(false); } })
      .catch(() => { if (activo) { setError('No se puede obtener la información en este momento.'); setCargando(false); } });

    fetch(`http://localhost:8080/api/reservas/ocupadas/${vehiculoId}`)
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => {
        if (activo) {
          const objetosFecha = data.map(str => new Date(str + 'T00:00:00'));
          setFechasOcupadas(objetosFecha);
          setCargandoFechas(false);
        }
      })
      .catch(() => { if (activo) { setErrorFechas(true); setCargandoFechas(false); } });

    fetch(`http://localhost:8080/api/puntuaciones/vehiculo/${vehiculoId}`)
      .then(res => res.json())
      .then(data => {
        if (activo) {
          setReseñas(data);
          if (data.length > 0) {
            const suma = data.reduce((acc, curr) => acc + curr.estrellas, 0);
            setNotaMedia(suma / data.length);
          } else {
            setNotaMedia(0);
          }
        }
      })
      .catch(() => {});

    return () => { activo = false; };
  }, [vehiculoId, disparadorReintento]);

  const enviarNuevaReseñaXampp = async (e) => {
    e.preventDefault();
    if (!comentarioInput.trim()) return;
    setEnviandoReseña(true);

    const payload = { estrellas: estrellasSeleccionadas, comentario: comentarioInput.trim() };

    try {
      const res = await fetch(`http://localhost:8080/api/puntuaciones/vehiculo/${vehiculoId}/usuario/${usuario.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${usuario.authKey}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setComentarioInput('');
        setEstrellasSeleccionadas(5);
        setDisparadorReintento(prev => prev + 1);
      }
      setEnviandoReseña(false);
    } catch (err) {
      console.error('Error al enviar la reseña:', err);
      setEnviandoReseña(false);
    }
  };

  if (cargando) return <div className="text-center py-20 font-medium text-slate-400 animate-pulse">Sincronizando especificaciones con el servidor...</div>;
  if (error) return (
    <div className="text-center py-20 flex flex-col items-center justify-center space-y-4">
      <p className="text-red-500 font-bold">⚠️ Error: {error}</p>
      <button onClick={reintentarCargaManual} className="text-xs bg-slate-800 text-white font-bold px-4 py-2 rounded-xl cursor-pointer"><RotateCcw size={14}/><span>Intentar de nuevo</span></button>
    </div>
  );

  const imagenes = vehiculo.imagenes && vehiculo.imagenes.length > 0 
    ? vehiculo.imagenes 
    : ['https://unsplash.com'];
  return (
    <div className="w-full flex flex-col text-brand-dark anonymity-safe animate-fade-in pt-16 lg:pt-20">
      
      {/* HEADER SUPERIOR CON PUNTUACIÓN MEDIA DINÁMICA (US #28) */}
      <div className="w-screen relative left-1/2 right-1/2 mx-[-50vw] bg-brand-dark border-b border-slate-800 text-white py-4 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-brand-primary uppercase font-bold tracking-widest flex items-center space-x-2">
              <span>Premium Fleet</span>
              <span>•</span>
              <EstrellasPuntaje promedio={notaMedia} total={reseñas.length} tamano={10} />
            </span>
            <h1 className="text-xl font-black md:text-2xl tracking-tight">{vehiculo.nombre}</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* US #27: BOTÓN COMPARTIR CORPORATIVO */}
            <button 
              type="button"
              onClick={() => setModalShareAbierto(true)}
              title="Compartir este vehículo en tus redes sociales"
              className="flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-200 w-10 h-10 rounded-xl transition-all cursor-pointer border border-slate-700"
            >
              <Share2 size={16} />
            </button>

            <button onClick={onVolver} className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer border border-slate-700">
              <ArrowLeft size={16} /> <span>Volver</span>
            </button>
          </div>
        </div>
      </div>

      {/* GALERÍA DE IMÁGENES */}
      <div className="w-full bg-white border border-brand-border p-3 rounded-3xl shadow-2xs mb-8">
  <div 
    onClick={() => { setIndiceImagenActiva(0); setModalAbierto(true); }} 
    className="w-full h-64 md:h-80 lg:h-96 cursor-pointer bg-slate-950 flex items-center justify-center overflow-hidden rounded-2xl group relative"
  >
    <img 
      src={
        Array.isArray(imagenes) && imagenes.length > 0
          ? String(imagenes[0]).trim() 
          : String(imagenes).split(',')[0].trim()
      } 
      alt={vehiculo.nombre} 
      className="max-w-full max-h-full object-contain group-hover:scale-[1.02] transition-transform duration-500" 
    />
    <button className="absolute bottom-4 right-4 bg-brand-dark/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 backdrop-blur-xs cursor-pointer">
      <ImageIcon size={12} className="inline mr-2"/>Ver galería
    </button>
  </div>
</div>

      {/* GRID DISTRIBUTIVO DE INFORMACIÓN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-brand-border p-6 rounded-2xl shadow-2xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Sobre este servicio</h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{vehiculo.descripcion}</p>
          </div>

          {/* Características */}
          <div className="bg-white border border-brand-border p-6 rounded-2xl shadow-2xs">
            <h2 className="text-base font-black uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Características</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {vehiculo.caracteristicas?.map(c => (
                <div key={c.id} className="flex items-center space-x-3 bg-slate-50 border border-slate-100 p-3 rounded-xl">
                  <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center p-1.5 shrink-0"><img src={c.urlImagen} alt="" className="w-full h-full object-contain" /></div>
                  <span className="text-xs font-bold text-slate-600 truncate">{c.nombre}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CALENDARIO DOBLE DE DISPONIBILIDAD */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-brand-border p-6 rounded-2xl shadow-2xs flex flex-col">
            <h3 className="text-sm font-black uppercase tracking-wider mb-4 border-b border-slate-100 pb-3">Disponibilidad</h3>
            {errorFechas ? (
              <div className="p-5 bg-red-50/70 border border-red-100 rounded-2xl text-center flex flex-col items-center space-y-3">
                <p className="text-xs text-red-700 font-bold leading-tight">No se puede obtener la información de disponibilidad en este momento.</p>
                <button onClick={reintentarCargaManual} className="text-[10px] uppercase font-mono font-black bg-white border border-red-200 text-red-600 px-3 py-2 rounded-xl shadow-2xs hover:bg-red-50 cursor-pointer">Intentar re-conectar</button>
              </div>
            ) : cargandoFechas ? (
              <div className="text-center py-6 text-xs text-slate-400 font-mono animate-pulse">Sincronizando bloqueos de XAMPP...</div>
            ) : (
              <div className="w-full overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-1 flex justify-center date-range-static-view select-none">
                <DateRange 
                  disabledDates={fechasOcupadas} 
                  minDate={new Date()} 
                  direction="vertical" 
                  months={2} 
                  locale={es} 
                  showSelectionPreview={false} 
                  showDateDisplay={false} 
                  onChange={() => {}} 
                  ranges={[{ startDate: null, endDate: null, key: 'selection' }]} 
                  rangeColors={['#2563EB']} 
                />
              </div>
            )}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div><span className="text-[10px] text-slate-400 uppercase font-bold">Tarifa</span><p className="text-xl font-black text-brand-primary">${vehiculo.precioPorDia.toLocaleString('es-AR')}</p></div>
              <button disabled={errorFechas} className="bg-brand-primary text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl cursor-pointer disabled:opacity-40">Reservar</button>
            </div>
          </div>
        </div>
      </div>
      {/* BLOQUE DE POLÍTICAS DEL PRODUCTO (US #26 - Cobertura Ancho 100%) */}
      <div className="w-full bg-white border border-brand-border rounded-3xl p-6 md:p-8 shadow-2xs mt-8">
        <div className="mb-6 border-b border-slate-100 pb-3">
          <h3 className="text-base md:text-lg font-black uppercase tracking-wider text-brand-dark inline-block border-b-2 border-brand-primary pb-1">
            Políticas de Uso y Conditions del Servicio
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="flex flex-col"><h4 className="font-extrabold text-sm text-brand-dark mb-2">1. Entrega del Vehículo</h4><p className="text-slate-500 text-xs leading-relaxed">Presentar licencia vigente y DNI físico. Tolerancia de espera de 30 minutos.</p></div>
          <div className="flex flex-col pt-4 md:pt-0 md:pl-6"><h4 className="font-extrabold text-sm text-brand-dark mb-2">2. Cuidados e Higiene</h4><p className="text-slate-500 text-xs leading-relaxed">Prohibido fumar. El coche se entrega con tanque lleno y debe restituirse igual.</p></div>
          <div className="flex flex-col pt-4 md:pt-0 md:pl-6"><h4 className="font-extrabold text-sm text-brand-dark mb-2">3. Cancelación Contractual</h4><p className="text-slate-500 text-xs leading-relaxed">Aviso mayor a 48 horas otorga reembolso total de la seña inyectada.</p></div>
        </div>
      </div>

      {/* SECCIÓN DEDICADA A VALORACIONES (US #28 - Lugar Prominente) */}
      <div className="w-full bg-white border border-brand-border rounded-3xl p-6 md:p-8 shadow-2xs mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LADO A: FORMULARIO INTERACTIVO DE PUNTUACIÓN DE ESTRELLAS */}
        <div className="lg:col-span-1 bg-slate-50 border border-brand-border p-5 rounded-2xl">
          <h3 className="text-xs font-black uppercase tracking-widest text-brand-primary mb-3">Danos tu opinión</h3>
          {usuario ? (
            <form onSubmit={enviarNuevaReseñaXampp} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Calificación de Servicio</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      type="button" key={num}
                      onClick={() => setEstrellasSeleccionadas(num)}
                      className="text-slate-300 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star size={20} className={num <= estrellasSeleccionadas ? "fill-amber-400 text-amber-400" : "text-slate-300"} strokeWidth={2.5} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Tu Reseña Detallada</label>
                <textarea
                  rows="3" required value={comentarioInput} onChange={e => setComentarioInput(e.target.value)}
                  className="w-full bg-white border border-brand-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-primary leading-relaxed text-slate-600"
                  placeholder="Comparte los detalles de tu experiencia de alquiler..."
                />
              </div>
              <button disabled={enviandoReseña} type="submit" className="w-full bg-brand-primary hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl shadow-xs flex items-center justify-center space-x-2 cursor-pointer transition-colors">
                <Send size={12} /> <span>{enviandoReseña ? 'Publicando...' : 'Publicar Reseña'}</span>
              </button>
            </form>
          ) : (
            <div className="text-center py-6"><p className="text-xs text-slate-400 font-bold leading-relaxed">Debes iniciar sesión para calificar este vehículo comercial.</p></div>
          )}
        </div>

        {/* LADO B: HISTORIAL DETALLADO DE COMENTARIOS */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h3 className="text-sm font-black uppercase tracking-wider text-brand-dark">Comentarios de Clientes</h3>
            <span className="text-xs text-slate-400 font-bold font-mono">{reseñas.length} compartidos</span>
          </div>

          <div className="space-y-4 max-h-72 overflow-y-auto pr-2 divide-y divide-slate-100">
            {reseñas.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center font-medium">Este vehículo aún no cuenta con valoraciones. ¡Sé el primero en opinar!</p>
            ) : (
              reseñas.map((res) => (
                <div key={res.id} className="pt-4 first:pt-0 flex flex-col">
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-xs text-brand-dark">{res.usuario?.nombre} {res.usuario?.apellido}</span>
                      <div className="mt-1"><EstrellasPuntaje promedio={res.estrellas} tamano={10} /></div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">{new Date(res.fechaPublicacion + 'T00:00:00').toLocaleDateString('es-AR')}</span>
                  </div>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed font-medium bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/60">{res.comentario}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* VISOR DE FOTOS MODAL INTERACTIVO EN PANTALLA COMPLETA */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-brand-dark/95确定 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-md" onClick={() => setModalAbierto(false)}>
          <div className="absolute top-4 right-4 text-white">
            <button onClick={() => setModalAbierto(false)} className="bg-white/10 p-2.5 rounded-full cursor-pointer hover:bg-white/20 transition-colors"><X size={20} /></button>
          </div>
          <div className="max-w-4xl w-full h-[75vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img 
              src={Array.isArray(imagenes) ? imagenes[indiceImagenActiva].trim() : String(imagenes).split(',')[indiceImagenActiva].trim()} 
              alt="Vista ampliada DriveFlow" 
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" 
            />
          </div>
        </div>
      )}

      {/* MODAL DE REDES SOCIALES */}
      <ModalCompartir 
        abierto={modalShareAbierto} 
        onCerrar={() => setModalShareAbierto(false)} 
        vehiculo={vehiculo}
        urlProducto={urlInmutableProducto}
      />

    </div>
  );
}
