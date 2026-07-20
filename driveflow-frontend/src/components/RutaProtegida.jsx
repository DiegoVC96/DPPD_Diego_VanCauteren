import { useContext } from 'react';
import { AuthContext } from '../context/AuthContextStore';

export default function RutaProtegida({ children, rolRequerido }) {
  const { usuario } = useContext(AuthContext);

  if (!usuario) {
    return (
      <div className="text-center py-24 px-4 font-mono text-xs text-brand-dark max-w-sm mx-auto space-y-4">
        <p className="font-bold bg-red-50 text-red-600 border border-red-100 p-4 rounded-xl">🛡️ Acceso Denegado: Debe autenticarse para visualizar este panel.</p>
        <button onClick={() => window.location.assign('/?openLogin=true')} className="bg-brand-dark text-white font-bold py-2 px-4 rounded-xl cursor-pointer">Ir al inicio de sesión</button>
      </div>
    );
  }

  if (rolRequerido && usuario.rol !== rolRequerido) {
    return (
      <div className="text-center py-24 px-4 font-mono text-xs text-brand-dark max-w-md mx-auto">
        <p className="font-bold bg-amber-50 text-amber-700 border border-amber-100 p-4 rounded-xl">⚠️ Privilegios Insuficientes: Se requieren permisos de [{rolRequerido}] para auditar estos recursos.</p>
        <button onClick={() => window.location.assign('/')} className="text-brand-primary font-bold mt-4 underline block mx-auto cursor-pointer">Regresar a la tienda pública</button>
      </div>
    );
  }

  return children;
}
