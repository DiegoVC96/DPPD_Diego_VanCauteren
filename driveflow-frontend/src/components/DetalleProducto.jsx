import { useEffect, useState } from 'react';
import { ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DetalleProducto({ vehiculoId, onVolver }) {
  const [vehiculo, setVehiculo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para controlar el visor en pantalla completa (Modal)
  const [modalAbierto, setModalAbierto] = useState(false);
  const [indiceImagenActiva, setIndiceImagenActiva] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:8080/api/vehiculos/${vehiculoId}`)
      .then((res) => {
        if (!res.ok) throw new Error('No se pudo obtener la información');
        return res.json();
      })
      .then((data) => {
        setVehiculo(data);
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  }, [vehiculoId]);

  if (cargando) return <div className="text-center py-20 font-medium">Cargando especificaciones...</div>;
  if (error) return <div className="text-center py-20 text-red-500">⚠️ Error: {error}</div>;

  // Array controlado para evitar roturas visuales
  const imagenes = vehiculo.imagenes && vehiculo.imagenes.length > 0 
    ? vehiculo.imagenes 
    : ['https://w7.pngwing.com/pngs/766/256/png-transparent-car-sport-utility-vehicle-hand-drawn-cartoon-car-material-cartoon-character-compact-car-glass.png']; 

  const abrirModalEnImagen = (index) => {
    setIndiceImagenActiva(index);
    setModalAbierto(true);
  };

  const siguienteImagen = () => {
    setIndiceImagenActiva((prev) => (prev + 1) % imagenes.length);
  };

  const anteriorImagen = () => {
    setIndiceImagenActiva((prev) => (prev - 1 + imagenes.length) % imagenes.length);
  };

  return (
    <div className="w-full flex flex-col">
      
      {/* HEADER DE DETALLE - Ocupa el 100% de la pantalla */}
      <div className="w-screen relative left-1/2 right-1/2 mx-[-50vw] bg-brand-dark border-b border-slate-800 text-white py-4 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-brand-primary uppercase font-bold tracking-widest">Premium Fleet</span>
            <h1 className="text-xl font-black md:text-2xl tracking-tight">{vehiculo.nombre}</h1>
          </div>
          <button onClick={onVolver} className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer">
            <ArrowLeft size={16} /> <span className="hidden sm:inline">Volver</span>
          </button>
        </div>
      </div>

      {/* REQUERIMIENTO STRICT US #6: GALERÍA DE IMÁGENES EN MOSAICO 50/50 INTEGRAL */}
      <div className="w-full bg-white border border-brand-border p-3 rounded-3xl shadow-xs mb-8">
  
        {/* CONTENEDOR MAESTRO DE LA GALERÍA: 
        - Móviles: Altura automática para evitar desbordes.
        - Escritorios (lg): Grilla simétrica de dos mitades exactas. */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 h-auto relative rounded-2xl overflow-hidden">
    
          {/* Mitad Izquierda: Foto Principal con Fondo */}
          <div 
            onClick={() => abrirModalEnImagen(0)}
            className="w-full h-64 md:h-80 lg:h-100 cursor-pointer relative overflow-hidden group border border-slate-200 rounded-xl lg:rounded-none bg-slate-950 flex items-center justify-center"
            >
            <img 
              src={imagenes[0]} 
              alt="Vista principal del vehículo" 
              className="w-full h-full object-contain group-hover:scale-101 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
          </div>

          {/* Mitad Derecha: Miniaturas con Fondo */}
          <div className="hidden lg:grid grid-cols-2 grid-rows-2 gap-3 h-100 w-full">
            {[1, 2, 3, 4].map((index) => (
              <div 
                key={index}
                onClick={() => abrirModalEnImagen(index < imagenes.length ? index : 0)}
                className="w-full h-full cursor-pointer relative overflow-hidden group border border-slate-200 rounded-xl bg-slate-950 flex items-center justify-center"
                >
                {index < imagenes.length ? (
                  <img 
                    src={imagenes[index]} 
                    alt={`Detalle multimedia ${index}`} 
                    className="w-full h-full object-contain group-hover:scale-102 transition-transform duration-500" 
                  />
                ) : (
                  <div className="text-slate-600 flex flex-col items-center gap-1 font-mono text-[9px] uppercase font-bold tracking-wider">
                    <span>DriveFlow View</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              </div>
            ))}
          </div>

          {/* BOTÓN "VER MÁS": Posicionado de forma flotante en la región inferior derecha */}
          <button 
            onClick={() => abrirModalEnImagen(0)}
            className="absolute bottom-4 right-4 bg-brand-dark/90 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-2 border border-slate-700 backdrop-blur-xs hover:scale-102 z-10"
            >
            <span>Ver más</span>
          </button>
        </div>
      </div>

      <div className="w-full bg-white border border-brand-border p-6 rounded-2xl shadow-xs mb-8">
        <h2 className="text-base font-black text-brand-dark uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
          Características
        </h2>
        
        {/* GRILLA RESPONSIVA: 2 columnas en móvil, 3 en tablet, 4 en pantallas de escritorio */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {vehiculo.caracteristicas && vehiculo.caracteristicas.map((carac) => (
            <div key={carac.id} className="flex items-center space-x-3 bg-slate-50 border border-slate-100 p-3 rounded-xl transition-all hover:bg-blue-50/50 group select-none">
              {/* RENDERIZADO DIRECTO POR URL DEL ICONO DE LA CARACTERÍSTICA */}
              <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center p-1.5 shadow-2xs shrink-0">
                <img src={carac.urlImagen} alt="" className="w-full h-full object-contain" />
              </div>
              <span className="text-xs font-bold text-slate-600 truncate">{carac.nombre}</span>
            </div>
          ))}
        </div>
      </div>


      {/* 3. BODY DEL PRODUCTO: Descripción comercial y reserva */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 bg-white border border-brand-border p-6 rounded-2xl shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Sobre este servicio</h2>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
            {vehiculo.descripcion}
          </p>
        </div>

        <div className="lg:col-span-1 bg-white border border-brand-border p-6 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Precio Diario</p>
            <p className="text-2xl font-black text-brand-primary">
              ${vehiculo.precioPorDia.toLocaleString('es-AR')} <span className="text-xs font-normal text-slate-500">/ día</span>
            </p>
          </div>
          <button className="w-full mt-6 bg-brand-primary hover:bg-blue-700 text-white font-bold text-sm py-3 rounded-xl shadow-xs transition-colors cursor-pointer text-center">
            Reservar Ahora
          </button>
        </div>
      </div>

      {/* VISOR EN PANTALLA COMPLETA */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-brand-dark/98 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-md">
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-white max-w-7xl mx-auto w-full px-4">
            <span className="text-sm font-bold font-mono tracking-wider">
              Imagen {indiceImagenActiva + 1} de {imagenes.length}
            </span>
            <button 
              onClick={() => setModalAbierto(false)}
              className="bg-white/10 hover:bg-white/20 p-2.5 rounded-full text-white transition-colors cursor-pointer"
            >
              <X size={22} />
            </button>
          </div>

          <div className="relative max-w-5xl w-full h-[70vh] flex items-center justify-center">
            <button onClick={anteriorImagen} className="absolute left-2 md:-left-16 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-colors cursor-pointer z-10">
              <ChevronLeft size={24} />
            </button>
            <img src={imagenes[indiceImagenActiva]} alt="Vista ampliada" className="max-w-full max-h-full object-contain rounded-xl select-none" />
            <button onClick={siguienteImagen} className="absolute right-2 md:-right-16 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-colors cursor-pointer z-10">
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="absolute bottom-6 flex space-x-2 overflow-x-auto max-w-xl p-2 bg-slate-900/60 rounded-xl border border-slate-800">
            {imagenes.map((url, index) => (
              <button
                key={index}
                onClick={() => setIndiceImagenActiva(index)}
                className={`w-14 h-10 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                  index === indiceImagenActiva ? 'border-brand-primary scale-105 shadow' : 'border-transparent opacity-50'
                }`}
              >
                <img src={url} alt="Miniatura" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
