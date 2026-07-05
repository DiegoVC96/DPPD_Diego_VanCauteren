import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContextStore';

export default function ProtectedRoute({ children }) {
  const { usuario, cargando } = useContext(AuthContext);
  const estaAutorizado = usuario && usuario.rol === 'ADMINISTRADOR';

  useEffect(() => {
    if (!cargando && !estaAutorizado) {
      window.location.href = '/?error=unauthorized';
    }
  }, [cargando, estaAutorizado]);

  if (cargando) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="animate-spin inline-block w-6 h-6 border-3 border-brand-primary border-t-transparent rounded-full text-brand-primary"></div>
      </div>
    );
  }

  if (!estaAutorizado) {
    return null;
  }

  return children;
}
