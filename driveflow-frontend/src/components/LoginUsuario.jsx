import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContextStore';

export default function LoginUsuario({ onVolver, onExito }) {
  const { iniciarSesionGlobal } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const manejarLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const res = await fetch('http://localhost:8080/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const datos = await res.json();

      if (!res.ok) throw new Error(datos.mensaje || 'Error al iniciar sesión');
      datos.password = password.trim(); 
      iniciarSesionGlobal(datos);
      onExito();
    } catch (err) {
      setErrorMsg(err.message); 
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white border border-brand-border p-8 rounded-2xl shadow-sm">
      <h2 className="text-xl font-black text-brand-dark text-center mb-6">Iniciar Sesión</h2>
      {errorMsg && <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl">⚠️ {errorMsg}</div>}
      <form onSubmit={manejarLogin} className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Email</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border border-brand-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-primary" />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Contraseña</label>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-50 border border-brand-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-primary" />
        </div>
        <button type="submit" className="w-full bg-brand-primary text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer">Ingresar</button>
      </form>
      <button onClick={onVolver} className="w-full text-center text-xs text-slate-400 font-bold mt-4 hover:underline">Volver</button>
    </div>
  );
}
