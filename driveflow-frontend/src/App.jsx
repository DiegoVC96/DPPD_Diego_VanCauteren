import { useState } from 'react';
import Header from './components/Header';
import Buscador from './components/Buscador';
import Categorias from './components/Categorias';
import Recomendaciones from './components/Recomendaciones';
import DetalleProducto from './components/DetalleProducto';
import RegistroUsuario from './components/RegistroUsuario';
import LoginUsuario from './components/LoginUsuario'; 
import Footer from './components/Footer';
import MisFavoritos from './components/MisFavoritos';
import FormularioReserva from './components/FormularioReserva';
import MisReservas from './components/MisReservas';
import BotonWhatsApp from './components/BotonWhatsApp';

export default function App() {
  const [vistaActiva, setVistaActiva] = useState('catalogo');
  const [vehiculoSeleccionadoId, setVehiculoSeleccionadoId] = useState(null);
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [filtrosActivos, setFiltrosActivos] = useState([]);

  const manejarCambioFiltro = (id) => {
    if (filtrosActivos.includes(id)) {
      setFiltrosActivos(filtrosActivos.filter(item => item !== id)); 
    } else {
      setFiltrosActivos([...filtrosActivos, id]); 
    }
  };

  const limpiarTodosLosFiltros = () => {
    setFiltrosActivos([]); 
  };

  const [verPantallaLogin, setVerPantallaLogin] = useState(() => {
    try {
      const parametros = new URLSearchParams(window.location.search);
      return parametros.get('openLogin') === 'true';
    } catch (e) {
      console.error("Error al analizar los parámetros de la URL:", e);
      return false;
    }
  });

  const [verPantallaRegistro, setVerPantallaRegistro] = useState(() => {
    try {
      const parametros = new URLSearchParams(window.location.search);
      return parametros.get('openLogin') === 'true' ? false : false;
    } catch (e) {
      console.error("Error al analizar los parámetros de la URL:", e);
      return false;
    }
  });

  const reservaVehiculoId = (() => {
    try {
      return new URLSearchParams(window.location.search).get('reservaVehiculoId');
    } catch (e) {
      console.error("Error al analizar los parámetros de la URL:", e);
      return null;
    }
  })();

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-brand-dark antialiased">
      
      {/* HEADER GLOBAL CON INTERRUPTOR DE FAVORITOS (US #25) */}
      <Header 
        onAbrirRegistro={() => {
          setVerPantallaRegistro(true);
          setVerPantallaLogin(false);
          setVehiculoSeleccionadoId(null);
          setVistaActiva('catalogo');
        }} 
        onAbrirLogin={() => {
          setVerPantallaLogin(true);
          setVerPantallaRegistro(false);
          setVehiculoSeleccionadoId(null);
          setVistaActiva('catalogo');
        }}
        onCambiarVista={(nuevaVista) => {
          setVistaActiva(nuevaVista);
          setVerPantallaLogin(false);
          setVerPantallaRegistro(false);
          setVehiculoSeleccionadoId(null);
        }}
      />

      <main className="grow pt-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        
        {/* TÍTULO PRINCIPAL: Oculto si estamos viendo el Detalle o en Mis Favoritos */}
        {vehiculoSeleccionadoId == null && !verPantallaLogin && !verPantallaRegistro && vistaActiva === 'catalogo' && (
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-brand-border mt-6">
            <div className="flex flex-col">
              <h1 className="text-2xl font-black text-brand-dark tracking-tight md:text-3xl">
                Explora DriveFlow
              </h1>
              <p className="text-xs md:text-sm text-slate-400 mt-1">
                Encuentra el auto perfecto para tu próximo viaje
              </p>
            </div>
          </div>
        )}
        
        {/* ENRUTADOR REACTIVO INTERNO DE PANTALLAS COMPLETO */}
        {verPantallaLogin ? (
          <LoginUsuario 
            onVolver={() => setVerPantallaLogin(false)} 
            onExito={() => setVerPantallaLogin(false)} 
          />
        ) : verPantallaRegistro ? (
          <RegistroUsuario onVolverAlInicio={() => setVerPantallaRegistro(false)} />
        ) : reservaVehiculoId != null ? (
          <FormularioReserva 
            vehiculoId={reservaVehiculoId} 
            onVolver={() => {
              const params = new URLSearchParams(window.location.search);
              params.delete('reservaVehiculoId');
              window.location.assign(`${window.location.pathname}`);
            }} 
          />
        ) : vehiculoSeleccionadoId != null ? (
          <DetalleProducto 
            vehiculoId={vehiculoSeleccionadoId} 
            onVolver={() => setVehiculoSeleccionadoId(null)} 
          />
        ) : vistaActiva === 'mis_favoritos' ? (
          <MisFavoritos 
            onSeleccionarVehiculo={setVehiculoSeleccionadoId}
            onVolverAlCatalogo={() => setVistaActiva('catalogo')}
          />
        ) : vistaActiva === 'mis_reservas' ? (
          <MisReservas 
            onSeleccionarVehiculo={setVehiculoSeleccionadoId}
            onVolverAlCatalogo={() => setVistaActiva('catalogo')}
          />
        ) : (
          <div className="space-y-10 md:space-y-14 w-full">
            <Buscador 
              onEjecutarBusqueda={(criterios) => setTextoBusqueda(criterios.texto)}
              onLimpiarBusqueda={() => setTextoBusqueda('')}
            />
            <Categorias 
              filtrosActivos={filtrosActivos} 
              onCambiarFiltro={manejarCambioFiltro} 
              onLimpiarFiltros={limpiarTodosLosFiltros} 
            />
            <Recomendaciones 
              onSeleccionarVehiculo={setVehiculoSeleccionadoId} 
              filtrosCategorias={filtrosActivos} 
              textoBusqueda={textoBusqueda}
            />
          </div>
        )}

      </main>

      <Footer />
      <BotonWhatsApp />
    </div>
  );
}
