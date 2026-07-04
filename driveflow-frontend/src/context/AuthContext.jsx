import { useState } from 'react';
import { AuthContext } from './AuthContextStore';

const SECRET_KEY_DF = "DriveFlow_Secure_Token_2026";

const encriptarDatos = (texto) => {
  return btoa(encodeURIComponent(texto).split('').map((c, i) => 
    String.fromCharCode(c.charCodeAt(0) ^ SECRET_KEY_DF.charCodeAt(i % SECRET_KEY_DF.length))
  ).join(''));
};

const desencriptarDatos = (encriptado) => {
  try {
    return decodeURIComponent(atob(encriptado).split('').map((c, i) => 
      String.fromCharCode(c.charCodeAt(0) ^ SECRET_KEY_DF.charCodeAt(i % SECRET_KEY_DF.length))
    ).join(''));
  } catch (e) {
    console.error('Error al desencriptar los datos:', e);
    return null;
  }
};

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const sesionEncriptada = localStorage.getItem('df_session_secure');
    if (sesionEncriptada) {
      const datosClaros = desencriptarDatos(sesionEncriptada);
      if (datosClaros) {
        try {
          return JSON.parse(datosClaros);
        } catch (e) {
          console.error('Error al parsear los datos desencriptados:', e);
          localStorage.removeItem('df_session_secure');
        }
      }
    }
    return null;
  });

  const iniciarSesionGlobal = (datosUsuario, passwordTextoPlano) => {
    const objetoSesionMemoria = {
      ...datosUsuario,
      authKey: btoa(`${datosUsuario.email}:${passwordTextoPlano}`) 
    };

    setUsuario(objetoSesionMemoria);

    const stringCifrada = encriptarDatos(JSON.stringify(objetoSesionMemoria));
    localStorage.setItem('df_session_secure', stringCifrada);
    localStorage.removeItem('df_session'); 
  };

  const cerrarSesionGlobal = () => {
    setUsuario(null);
    localStorage.removeItem('df_session_secure');
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesionGlobal, cerrarSesionGlobal }}>
      {children}
    </AuthContext.Provider>
  );
}
