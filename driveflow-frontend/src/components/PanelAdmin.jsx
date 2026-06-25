import { useState, useEffect } from 'react';
import { Car, FolderKanban, ShieldAlert, ArrowLeft, ClipboardList } from 'lucide-react';
import FormularioProducto from './FormularioProducto';
import TablaProductosAdmin from './TablaProductosAdmin';
import DetalleProducto from './DetalleProducto';

export default function PanelAdmin() {
  const [esEscritorio, setEsEscritorio] = useState(window.innerWidth >= 1024);
  const [vehiculoSeleccionadoId, setVehiculoSeleccionadoId] = useState(null);
  
  // Seteamos 'lista_productos' como la sub-vista activa por defecto
  const [menuActivo, setMenuActivo] = useState('lista_productos');

  useEffect(() => {
    const manejarResize = () => setEsEscritorio(window.innerWidth >= 1024);
    window.addEventListener('resize', manejarResize);
    return () => window.removeEventListener('resize', manejarResize);
  }, []);

  if (!esEscritorio) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 text-center antialiased">
        <div className="bg-white border border-brand-border p-8 rounded-2xl shadow-md max-w-sm flex flex-col items-center">
          <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert size={28} />
          </div>
          <h1 className="text-lg font-black text-brand-dark mb-2">Panel no disponible en móviles</h1>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">Por razones de seguridad, las herramientas administrativas de DriveFlow requieren pantalla de escritorio.</p>
          <button onClick={() => window.location.href = '/'} className="mt-4 flex items-center justify-center space-x-2 text-xs font-bold text-brand-primary hover:underline cursor-pointer">
            <ArrowLeft size={14} /> <span>Volver a la tienda</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-dark flex antialiased">
      
      {/* SIDEBAR GLOBAL DE ACCIONES */}
      <aside className="w-64 bg-brand-dark text-slate-400 flex flex-col fixed h-full left-0 top-0 z-40 border-r border-slate-800">
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3 cursor-pointer" onClick={() => window.location.href = '/'}>
          <div className="w-8 h-8 bg-brand-primary text-white rounded-lg flex items-center justify-center font-black text-sm">DF</div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-white tracking-tight leading-none">DriveFlow</span>
            <span className="text-[9px] text-slate-500 font-bold tracking-wider mt-0.5">CONSOLE v1.0</span>
          </div>
        </div>

        <nav className="grow p-4 space-y-1.5 mt-4">
          
          {/* BOTÓN REQUERIDO: LISTA DE PRODUCTOS */}
          <button 
            onClick={() => setMenuActivo('lista_productos')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              menuActivo === 'lista_productos' 
                ? 'bg-brand-primary text-white shadow-xs' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ClipboardList size={18} />
            <span>Lista de productos</span>
          </button>

          {/* Botón Registrar Producto (US #3) */}
          <button 
            onClick={() => setMenuActivo('registrar_producto')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              menuActivo === 'registrar_producto' 
                ? 'bg-brand-primary text-white shadow-xs' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Car size={18} />
            <span>Registrar Producto</span>
          </button>

          <button 
            onClick={() => setMenuActivo('categorias')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              menuActivo === 'categorias' ? 'bg-brand-primary text-white shadow-xs' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FolderKanban size={18} />
            <span>Categorías</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 text-[10px] text-center text-slate-600 font-medium">
          Dashboard Administrativo Privado
        </div>
      </aside>

      {/* CUERPO PRINCIPAL O COMPONENT VIEW */}
      <main className="grow ml-64 p-8 lg:p-12 min-h-screen flex flex-col">
      {/* Cabecera del Panel (Oculta si estamos viendo el detalle para limpiar la UI) */}
      {vehiculoSeleccionadoId === null && (
        <div className="mb-8 pb-4 border-b border-brand-border flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-brand-dark">
              {menuActivo === 'lista_productos' && 'Maestro de Inventario Flota'}
              {menuActivo === 'registrar_producto' && 'Registrar Nuevo Vehículo'}
              {menuActivo === 'categorias' && 'Maestro de Categorías'}
            </h1>
            <p className="text-xs text-slate-400">Consola centralizada del operador corporativo</p>
          </div>
          <button onClick={() => window.location.href = '/'} className="text-xs bg-white border border-brand-border text-slate-600 font-bold py-2 px-4 rounded-xl hover:bg-slate-50 shadow-xs cursor-pointer">
            Regresar a la tienda
          </button>
        </div>
      )}

      {/* NAVEGADOR INTERNO DE MÓDULOS DE ADMINISTRACIÓN */}
      <div className="grow">
        {/* INTERRUPTOR PRINCIPAL: Si hay un ID seleccionado, abre el Detalle en la consola */}
        {vehiculoSeleccionadoId !== null ? (
          <DetalleProducto 
            vehiculoId={vehiculoSeleccionadoId} 
            onVolver={() => setVehiculoSeleccionadoId(null)} // Al volver, restituye la tabla
          />
        ) : (
          /* Sub-vistas administrativas convencionales */
          <>
            {menuActivo === 'lista_productos' && (
              /* Pasamos la función como prop a la tabla */
              <TablaProductosAdmin onVerDetalle={setVehiculoSeleccionadoId} />
            )}
            
            {menuActivo === 'registrar_producto' && (
              <FormularioProducto onCerrar={() => setMenuActivo('lista_productos')} />
            )}
            
            {menuActivo === 'categorias' && (
              <div className="bg-white border border-brand-border p-8 rounded-2xl text-center text-sm text-slate-400 border-dashed">
                [Módulo Maestro de Categorías en desarrollo]
              </div>
            )}
          </>
        )}
      </div>
    </main>
  </div>
  );
}
