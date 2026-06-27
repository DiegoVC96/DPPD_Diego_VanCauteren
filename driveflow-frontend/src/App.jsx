import { useState } from 'react';
import Header from './components/Header';
import Buscador from './components/Buscador';
import Categorias from './components/Categorias';
import Recomendaciones from './components/Recomendaciones';
import DetalleProducto from './components/DetalleProducto';
import RegistroUsuario from './components/RegistroUsuario';
import LoginUsuario from './components/LoginUsuario'; 
import Footer from './components/Footer';

export default function App() {
  const [vehiculoSeleccionadoId, setVehiculoSeleccionadoId] = useState(null);
  const [verPantallaRegistro, setVerPantallaRegistro] = useState(false);

  const [filtrosActivos, setFiltrosActivos] = useState([]);

  const manejarCambioFiltro = (id) => {
    if (filtrosActivos.includes(id)) {
      setFiltrosActivos(filtrosActivos.filter(item => item !== id)); 
    } else {
      setFiltrosActivos([...filtrosActivos, id]); 
    }
  };

  const limpiarTodosLosFiltros = () => {
    setFiltrosActivos([]); // Restituye el catálogo original vacío de filtros
  };

  // Visibilidad del login a partir de los parámetros de la URL
  const [verPantallaLogin, setVerPantallaLogin] = useState(() => {
    try {
      const parametros = new URLSearchParams(window.location.search);
      return parametros.get('openLogin') === 'true';
    } catch (e) {
      console.log(e)
      return false;
    }
  });

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-brand-dark antialiased">
      
      {/* HEADER GLOBAL */}
      <Header 
        onAbrirRegistro={() => {
          setVerPantallaRegistro(true);
          setVerPantallaLogin(false);
          setVehiculoSeleccionadoId(null);
        }} 
        onAbrirLogin={() => {
          setVerPantallaLogin(true);
          setVerPantallaRegistro(false);
          setVehiculoSeleccionadoId(null);
        }}
      />

      <main className="grow pt-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        
        {vehiculoSeleccionadoId == null && (
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
        
        {/* ENRUTADOR REACTIVO INTERNO DE PANTALLAS */}
        {verPantallaLogin ? (
          <LoginUsuario 
            onVolver={() => setVerPantallaLogin(false)} 
            onExito={() => setVerPantallaLogin(false)} // Al loguearse con éxito, regresa al Home
          />
        ) : verPantallaRegistro ? (
          <RegistroUsuario onVolverAlInicio={() => setVerPantallaRegistro(false)} />
        ) : vehiculoSeleccionadoId != null ? (
          <DetalleProducto 
            vehiculoId={vehiculoSeleccionadoId} 
            onVolver={() => setVehiculoSeleccionadoId(null)} 
          />
        ) : (
          /* PÁGINA PRINCIPAL */
          <div className="space-y-10 md:space-y-14 w-full">
            <Buscador />
            <Categorias 
              filtrosActivos={filtrosActivos} 
              onCambiarFiltro={manejarCambioFiltro} 
              onLimpiarFiltros={limpiarTodosLosFiltros} 
            />
            <Recomendaciones 
              onSeleccionarVehiculo={setVehiculoSeleccionadoId} 
              filtrosCategorias={filtrosActivos} 
            />
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
