import { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContextStore';
import { LogOut, User, Sliders, Heart } from 'lucide-react';

export default function Header({ onAbrirRegistro, onAbrirLogin, onCambiarVista }) {
  const { usuario, cerrarSesionGlobal } = useContext(AuthContext);
  const [menuAvatarAbierto, setMenuAvatarAbierto] = useState(false);
  const menuRef = useRef(null);

  const obtenerIniciales = () => {
    if (!usuario) return '';
    const n = usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : '';
    const a = usuario.apellido ? usuario.apellido.charAt(0).toUpperCase() : '';
    return `${n}${a}`;
  };

  useEffect(() => {
    function clickFuera(evento) {
      if (menuRef.current && !menuRef.current.contains(evento.target)) {
        setMenuAvatarAbierto(false);
      }
    }
    document.addEventListener('mousedown', clickFuera);
    return () => document.removeEventListener('mousedown', clickFuera);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-brand-dark text-white shadow-md z-50">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* BLOQUE IZQUIERDO: Isologotipo */}
        <div onClick={() => window.location.href = '/'} className="flex items-center space-x-3 cursor-pointer group">
          <div className="w-10 h-10 bg-brand-primary text-white rounded-xl flex items-center justify-center font-black text-lg shadow-sm">
            DF
          </div>
          <span className="text-xl font-black tracking-tight group-hover:text-blue-400 transition-colors">
            DriveFlow
          </span>
        </div>

        {/* BLOQUE DERECHO: Acciones o Identificación */}
        <div className="flex items-center space-x-4">
          {usuario ? (
            <div className="relative flex items-center space-x-3" ref={menuRef}>
              
              {/* Saludo Informativo (Opcional en escritorio) */}
              <span className="text-xs font-bold text-slate-300 hidden md:inline">
                Hola, {usuario.nombre}
              </span>

              {/* CONTENEDOR INTERACTIVO DEL AVATAR DE LETRAS */}
              <button 
                onClick={() => setMenuAvatarAbierto(!menuAvatarAbierto)}
                className="w-9 h-9 bg-brand-primary hover:bg-blue-700 text-white rounded-full flex items-center justify-center font-black text-xs shadow-sm cursor-pointer select-none transition-transform active:scale-95 focus:outline-none border-2 border-slate-700"
                aria-label="Menú de cuenta"
              >
                {obtenerIniciales()}
              </button>

              {/* MENÚ FLOTANTE UBICADO DEBAJO DEL AVATAR */}
              {menuAvatarAbierto && (
                <div className="absolute right-0 top-11 w-52 bg-white border border-brand-border rounded-xl shadow-lg py-2 z-50 animate-fade-in text-brand-dark">
    
                  {/* Encabezado del Menú con Nombre Completo */}
                  <div className="px-4 py-2 border-b border-slate-100 flex flex-col">
                    <span className="text-xs font-black text-brand-dark truncate">
                      {usuario.nombre} {usuario.apellido}
                    </span>
                    <span className="text-[10px] bg-blue-50 text-brand-primary font-bold px-1.5 py-0.5 rounded mt-1 w-max uppercase tracking-wider">
                      {usuario.rol}
                    </span>
                  </div>

                  {/* Opción exclusiva para acceder a la lista de Favoritos (US #25) */}
                  <button 
                    onClick={() => { 
                      onCambiarVista('mis_favoritos'); 
                      setMenuAvatarAbierto(false); 
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center space-x-2 cursor-pointer transition-colors"
                    >
                    <Heart size={14} className="text-red-400 fill-red-400/20" />
                    <span>Mis Favoritos</span>
                  </button>

                  {/* ACCESO A LA CONSOLA (Solo visible para Administradores) */}
                  {usuario.rol === 'ADMINISTRADOR' && (
                    <button 
                      onClick={() => window.location.href = '/administración'}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold text-brand-primary hover:bg-blue-50/50 flex items-center space-x-2 cursor-pointer transition-colors"
                      >
                      <Sliders size={14} />
                      <span>Consola de Administración</span>
                    </button>
                  )}

                  {/* Enlace de información personal */}
                  <button className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center space-x-2 cursor-pointer">
                    <User size={14} className="text-slate-400" />
                    <span>Mi Perfil</span>
                  </button>

                  {/* Opción Cerrar Sesión (US #15) */}
                  <button 
                    onClick={cerrarSesionGlobal}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 border-t border-slate-100 flex items-center space-x-2 cursor-pointer transition-colors"
                    >
                    <LogOut size={14} />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ACCIONES PARA USUARIOS ANÓNIMOS */
            <div className="flex items-center space-x-4">
              <button onClick={onAbrirRegistro} className="text-slate-300 hover:text-white font-medium text-sm cursor-pointer">
                Crear cuenta
              </button>
              <button onClick={onAbrirLogin} className="bg-brand-primary hover:bg-blue-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg shadow-sm cursor-pointer">
                Iniciar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
