import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Función para simular la redirección a la página principal
  const irAlInicio = () => {
    window.location.href = '/';
  };

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-brand-dark text-white shadow-md z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* BLOQUE IZQUIERDO: Logotipo y Lema (Redirige al inicio al hacer clic) */}
        <div 
          onClick={irAlInicio}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          {/* Isotipo Circular */}
          <div className="w-10 h-10 bg-brand-primary text-white rounded-xl flex items-center justify-center font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
            DF
          </div>
          {/* Texto de Marca y Lema */}
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight leading-none group-hover:text-blue-400 transition-colors">
              DriveFlow
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">
              Premium Car Rental
            </span>
          </div>
        </div>

        {/* BLOQUE DERECHO: Botones de Acción (Escritorio) */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="text-slate-300 hover:text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors cursor-pointer">
            Crear cuenta
          </button>
          <button className="bg-brand-primary hover:bg-blue-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer">
            Iniciar sesión
          </button>
          <button 
            onClick={() => window.location.href = '/administración'}
            className="text-slate-300 hover:text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
            Consola Admin
          </button>
        </div>

        {/* Botón de Menú Móvil (Hamburguesa) */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-slate-300 hover:text-white focus:outline-none p-1 cursor-pointer"
            aria-label="Toggle menú"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MENÚ DESPLEGABLE RESPONSIVO (Solo móvil) */}
      <div className={`md:hidden absolute top-16 left-0 w-full bg-slate-900 border-t border-slate-800 shadow-xl transition-all duration-300 ease-in-out ${
        isMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'
      }`}>
        <div className="px-4 pt-4 pb-6 space-y-3 flex flex-col">
          <button className="w-full text-left text-slate-300 hover:text-white font-medium text-base py-2.5 px-3 rounded-md hover:bg-slate-800 transition-colors cursor-pointer">
            Crear cuenta
          </button>
          <button className="w-full bg-brand-primary hover:bg-blue-700 text-white font-medium text-base py-3 px-4 rounded-lg text-center transition-colors shadow-sm cursor-pointer">
            Iniciar sesión
          </button>
        </div>
      </div>
    </header>
  );
}
