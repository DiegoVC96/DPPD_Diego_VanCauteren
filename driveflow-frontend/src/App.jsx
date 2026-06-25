import { useState } from 'react';
import Header from './components/Header';
import Buscador from './components/Buscador';
import Categorias from './components/Categorias';
import Recomendaciones from './components/Recomendaciones';
import DetalleProducto from './components/DetalleProducto';
import Footer from './components/Footer'; 

export default function App() {
  const [vehiculoSeleccionadoId, setVehiculoSeleccionadoId] = useState(null);

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-brand-dark antialiased">
      {/* Encabezado fijo global */}
      <Header />

      {/* CONTENEDOR MAIN - Ocupa el 100% del alto y aplica la paleta corporativa */}
      <main className="grow pt-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        
        {/* INTERRUPTOR DINÁMICO: Si hay un ID seleccionado va al detalle, sino muestra las 3 secciones del Home */}
        {vehiculoSeleccionadoId != null ? (
          <DetalleProducto 
            vehiculoId={vehiculoSeleccionadoId} 
            onVolver={() => setVehiculoSeleccionadoId(null)} 
          />
        ) : (
          /* Las tres secciones o bloques obligatorios alineados armónicamente */
          <div className="space-y-10 md:space-y-14">
            {/* Bloque 1: Buscador de disponibilidades */}
            <Buscador />

            {/* Bloque 2: Grilla de Categorías */}
            <Categorias />

            {/* Bloque 3: Muestra aleatoria paginada de hasta 10 productos */}
            <Recomendaciones onSeleccionarVehiculo={setVehiculoSeleccionadoId} />
          </div>
        )}

      </main>

      {/* Pie de página corporativo */}
      <Footer />
    </div>
  );
}
