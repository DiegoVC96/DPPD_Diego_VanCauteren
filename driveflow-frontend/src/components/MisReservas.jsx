import { useEffect, useState, useContext } from 'react';
import { Calendar, ArrowLeft, Clock, MapPin } from 'lucide-react';
import { AuthContext } from '../context/AuthContextStore';
import { apiService } from '../services/api';

export default function MisReservas({ onSeleccionarVehiculo, onVolverAlCatalogo }) {
  const { usuario } = useContext(AuthContext);
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      if (!usuario || !usuario.id) return;
    
      let activo = true;

      apiService.obtenerHistorialReservas(usuario.id, usuario.authKey)
      .then(data => {
        if (activo && Array.isArray(data)) {
          setReservas(data);
          setCargando(false);
        }
      })
      .catch(err => {
        if (activo) { setError(err.message); setCargando(false); }
      });

    return () => { activo = false; };
  }, [usuario]);

  const formatearFechaView = (str) => {
    return new Date(str + 'T00:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (cargando) return <div className="text-center py-20 text-xs text-slate-400 font-bold font-mono animate-pulse">Sincronizando tu historial de reservas...</div>;
  if (error) return <div className="p-4 bg-red-50 text-red-700 text-xs font-semibold rounded-xl text-center">⚠️ Error: {error}</div>;
  return (
    <div className="w-full flex flex-col text-brand-dark animate-fade-in pt-16 lg:pt-20">
      
      {/* BARRA DE NAVEGACIÓN INTERNA */}
      <div className="flex items-center justify-between mb-8 border-b border-brand-border pb-4 gap-4">
        <div className="flex flex-col">
          <h2 className="text-xl md:text-2xl font-black tracking-tight uppercase">Mi Historial de Alquileres</h2>
          <p className="text-xs text-slate-400 mt-1">Consulte los detalles, períodos de uso y comprobantes de sus contratos vigentes e históricos.</p>
        </div>
        <button 
          onClick={onVolverAlCatalogo}
          className="text-xs bg-white border border-brand-border text-slate-600 font-bold py-2 px-4 rounded-xl hover:bg-slate-50 shadow-2xs flex items-center space-x-1.5 cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Volver a la tienda</span>
        </button>
      </div>

      {/* RENDERIZADO DE RESERVAS ANTERIORES */}
      {reservas.length === 0 ? (
        <div className="p-8 bg-slate-50 border border-dashed border-slate-200 rounded-3xl text-center py-16 max-w-xl mx-auto w-full">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3"><Clock size={20} /></div>
          <h3 className="font-extrabold text-sm text-slate-700 uppercase tracking-tight">Sin reservas registradas</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">Aún no has efectuado transacciones en DriveFlow. Selecciona un vehículo de la flota y define tus fechas de viaje para dar de alta tu primer contrato.</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-4xl mx-auto w-full">
          {reservas.map((res) => {
            const auto = res.vehiculo;
            const portadas = auto.imagenes && String(auto.imagenes).trim() !== ''
              ? String(auto.imagenes).split(',')[0].trim()
              : 'https://unsplash.com';

            return (
              <div 
                key={res.id}
                className="bg-white border border-brand-border rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row items-center gap-5 hover:border-brand-primary/20 transition-all group"
              >
                {/* Imagen del Producto Reservado */}
                <div className="w-full md:w-32 h-24 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden p-1 shrink-0 flex items-center justify-center">
                  <img src={portadas} alt="" className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                </div>

                {/* Detalles del Contrato de Alquiler */}
                <div className="grow min-w-0 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex flex-col justify-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Vehículo Seleccionado</span>
                    <h4 className="font-black text-sm text-brand-dark uppercase truncate mt-0.5">{auto.nombre}</h4>
                    <span className="text-[10px] text-brand-primary font-bold mt-1 font-mono uppercase bg-blue-50/50 px-1.5 py-0.5 rounded border border-blue-100/50 w-max">Contrato #{res.id}</span>
                  </div>

                  {/* Fechas de Uso del Producto */}
                  <div className="flex flex-col justify-center bg-slate-50/70 border border-slate-100/60 p-3 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center space-x-1"><Calendar size={10}/><span>Período del Alquiler</span></span>
                    <p className="text-xs font-bold text-slate-700 mt-1 font-mono">
                      {formatearFechaView(res.fechaInicio)} <span className="text-slate-400 font-normal">al</span> {formatearFechaView(res.fechaFin)}
                    </p>
                  </div>

                  <div className="flex flex-col justify-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center space-x-1"><MapPin size={10}/><span>Punto de Retiro</span></span>
                    <p className="text-xs font-semibold text-slate-500 truncate mt-0.5">{res.ciudadRetiro || 'Sede Central Central'}</p>
                    <span className="text-[10px] font-mono text-slate-400 font-bold mt-1">Tel: {res.telefonoContacto || 'No Registrado'}</span>
                  </div>
                </div>

                <div className="shrink-0 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2">
                  <button 
                    onClick={() => onSeleccionarVehiculo(auto.id)}
                    className="bg-slate-100 hover:bg-brand-primary hover:text-white text-brand-dark font-bold text-xs py-2 px-4 rounded-xl transition-all cursor-pointer w-full md:w-max text-center"
                  >
                    Ver unidad
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
