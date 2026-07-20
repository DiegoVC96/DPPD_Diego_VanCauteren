import { useState } from 'react';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try {
      const sesionCifrada = localStorage.getItem('df_session_premium');
      if (sesionCifrada) {
        return JSON.parse(atob(sesionCifrada)); 
      }
    } catch (e) {
        console.error('Error al decodificar la sesión:', e);
      localStorage.removeItem('df_session_premium');
    }
    return null;
  });

  const iniciarSesionGlobal = (datosDto, passwordPlano) => {
    const payloadSesion = { ...datosDto, authKey: btoa(`${datosDto.email}:${passwordPlano}`) };
    setUsuario(payloadSesion);
    localStorage.setItem('df_session_premium', btoa(JSON.stringify(payloadSesion)));
  };

  const cerrarSesionGlobal = () => {
    setUsuario(null);
    localStorage.removeItem('df_session_premium');
    window.location.assign('/');
  };

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesionGlobal, cerrarSesionGlobal }}>
      {children}
    </AuthContext.Provider>
  );
}
