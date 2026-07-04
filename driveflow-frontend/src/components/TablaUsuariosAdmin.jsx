import { useEffect, useState, useContext } from 'react';
import { Shield, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContextStore'; 

export default function TablaUsuariosAdmin() {
  const { usuario } = useContext(AuthContext); 
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarUsuarios = () => {
    fetch('http://localhost:8080/api/usuarios')
      .then(res => {
        if (!res.ok) throw new Error('Error al conectar con la API de usuarios');
        return res.json();
      })
      .then(data => {
        setUsuarios(data);
        setCargando(false);
      })
      .catch(err => {
        setError(err.message);
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Función atómica para añadir o quitar permisos (US #16)
  const togglePermisoAdmin = async (id, rolActual) => {
    const nuevoRol = rolActual === 'ADMINISTRADOR' ? 'CLIENTE' : 'ADMINISTRADOR';
    try {

      const res = await fetch(`http://localhost:8080/api/usuarios/${id}/cambiar-rol?nuevoRol=${nuevoRol}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Basic ${usuario.authKey}`
        }
      });
      
      if (!res.ok) {
        if (res.status === 401) throw new Error('Su sesión administrativa ha expirado.');
        throw new Error('No se pudo actualizar el rango del usuario');
      }
      
      setUsuarios(usuarios.map(u => u.id === id ? { ...u, rol: nuevoRol } : u));
    } catch (err) {
      alert(`⚠️ Fallo de privilegios: ${err.message}`);
    }
  };

  if (cargando) return <div className="text-center py-10 text-xs text-slate-400 font-medium">Sincronizando cuentas...</div>;
  if (error) return <div className="p-4 bg-red-50 text-red-700 text-xs font-medium rounded-xl">⚠️ Error: {error}</div>;

  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-xs overflow-hidden">
      <div className="px-6 py-4 border-b border-brand-border bg-slate-50/75">
        <h3 className="text-sm font-black text-brand-dark uppercase tracking-wider">Control de Acceso y Roles de Seguridad</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider border-b border-brand-border">
              <th className="py-3.5 px-6 w-24">Id</th>
              <th className="py-3.5 px-6">Usuario</th>
              <th className="py-3.5 px-6">Correo Electrónico</th>
              <th className="py-3.5 px-6">Rol de Sistema</th>
              <th className="py-3.5 px-6 text-right w-52">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-brand-dark">
            {usuarios.map(u => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6 font-mono text-xs font-bold text-slate-400">#{u.id}</td>
                <td className="py-4 px-6 font-semibold">{u.nombre} {u.apellido}</td>
                <td className="py-4 px-6 text-slate-500 text-xs">{u.email}</td>
                <td className="py-4 px-6">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center space-x-1.5 w-max ${
                    u.role === 'ADMINISTRADOR' || u.rol === 'ADMINISTRADOR'
                      ? 'bg-blue-50 text-brand-primary' 
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {u.rol === 'ADMINISTRADOR' ? <Shield size={12} /> : <User size={12} />}
                    <span>{u.rol}</span>
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
  {/* Deshabilitar el botón si la fila coincide con el admin en sesión */}
  {usuario.email.toLowerCase() === u.email.toLowerCase() ? (
    <span className="text-xs font-bold text-slate-300 bg-slate-50 border border-slate-200 py-1.5 px-3.5 rounded-xl select-none">
      Tu Cuenta (Bloqueado)
    </span>
  ) : (
    <button
      onClick={() => togglePermisoAdmin(u.id, u.rol)}
      className={`text-xs font-bold py-1.5 px-3.5 rounded-xl transition-all shadow-xs cursor-pointer ${
        u.rol === 'ADMINISTRADOR'
          ? 'bg-red-50 text-red-600 hover:bg-red-100'
          : 'bg-brand-primary text-white hover:bg-blue-700'
      }`}
    >
      {u.rol === 'ADMINISTRADOR' ? 'Quitar Admin' : 'Hacer Admin'}
    </button>
  )}
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
