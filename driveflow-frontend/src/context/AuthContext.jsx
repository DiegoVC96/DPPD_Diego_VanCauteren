import { useState } from 'react';
import { AuthContext } from './AuthContextStore';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const sesionGuardada = localStorage.getItem('df_session');
    if (sesionGuardada) {
      try {
        return JSON.parse(sesionGuardada);
      } catch (e) {
        console.error("Error al decodificar la sesión guardada", e);
        localStorage.removeItem('df_session');
      }
    }
    return null;
  });

  const iniciarSesionGlobal = (datosUsuario) => {
    setUsuario(datosUsuario);
    localStorage.setItem('df_session', JSON.stringify(datosUsuario));
  };

  const cerrarSesionGlobal = () => {
    setUsuario(null);
    localStorage.removeItem('df_session');
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesionGlobal, cerrarSesionGlobal }}>
      {children}
    </AuthContext.Provider>
  );
}
