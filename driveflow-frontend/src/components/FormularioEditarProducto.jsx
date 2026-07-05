import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContextStore'; 

export default function FormularioEditarProducto({ vehiculo, onCancel, onSaveSuccess }) {
  const { usuario } = useContext(AuthContext); 
  const [nombre, setNombre] = useState(vehiculo.nombre);
  const [descripcion, setDescripcion] = useState(vehiculo.descripcion);
  const [precio, setPrecio] = useState(vehiculo.precioPorDia);
  const [categoriaId, setCategoriaId] = useState(vehiculo.categoria ? vehiculo.categoria.id : '');
  const [categorias, setCategorias] = useState([]);
  const [todasLasCaracteristicas, setTodasLasCaracteristicas] = useState([]);
  
  const [caracteristicasSeleccionadas, setCaracteristicasSeleccionadas] = useState(
    vehiculo.caracteristicas ? vehiculo.caracteristicas.map(c => c.id) : []
  );
  
  const [errorServidor, setErrorServidor] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/categorias')
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(err => console.error("Error cargando categorías", err));

    fetch('http://localhost:8080/api/caracteristicas')
      .then(res => res.json())
      .then(data => setTodasLasCaracteristicas(data))
      .catch(err => console.error("Error cargando características", err));
  }, []);

  const manejarCheckboxChange = (id) => {
    if (caracteristicasSeleccionadas.includes(id)) {
      setCaracteristicasSeleccionadas(caracteristicasSeleccionadas.filter(item => item !== id));
    } else {
      setCaracteristicasSeleccionadas([...caracteristicasSeleccionadas, id]);
    }
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setErrorServidor('');

    const payload = {
      nombre,
      descripcion,
      precioPorDia: parseFloat(precio),
      imagenes: vehiculo.imagenes,
      categoriaId: categoriaId ? parseInt(categoriaId, 10) : null,
      caracteristicasIds: caracteristicasSeleccionadas 
    };

    try {

      const respuesta = await fetch(`http://localhost:8080/api/vehiculos/${vehiculo.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Basic ${usuario.authKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!respuesta.ok) {
        if (respuesta.status === 401) {
          throw new Error('Su sesión ha expirado o sus privilegios de Administrador no son válidos.');
        }
        const datos = await respuesta.json();
        throw new Error(datos.mensaje || 'Error al actualizar el producto');
      }
      
      onSaveSuccess(); 
    } catch (err) {
      setErrorServidor(err.message);
    }
  };

  return (
    <div className="bg-white border border-brand-border p-6 rounded-2xl shadow-sm max-w-xl mx-auto animate-fade-in text-brand-dark">
      <h3 className="text-base font-black text-brand-dark mb-4 uppercase tracking-wider">
        Modificar Parámetros de: <span className="text-brand-primary">{vehiculo.nombre}</span>
      </h3>
      
      {errorServidor && (
        <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
          ⚠️ {errorServidor}
        </div>
      )}
      
      <form onSubmit={manejarEnvio} className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-wider">Nombre del Vehículo</label>
          <input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full bg-slate-50 border border-brand-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-primary font-semibold" />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-wider">Descripción Comercial</label>
          <textarea required rows="3" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="w-full bg-slate-50 border border-brand-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-primary" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-wider">Tarifa Diaria ($)</label>
            <input type="number" required value={precio} onChange={(e) => setPrecio(e.target.value)} className="w-full bg-slate-50 border border-brand-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-primary font-mono font-bold" />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-wider">Categoría Relacionada</label>
            <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className="w-full bg-slate-50 border border-brand-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-primary font-medium">
              <option value="">Sin categoría asignada...</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        {/* CONTENEDOR MULTI-SELECCIÓN DE CARACTERÍSTICAS */}
        <div className="bg-slate-50 border border-brand-border p-4 rounded-xl mt-2">
          <label className="block text-[10px] font-bold uppercase text-brand-primary mb-2 tracking-widest">
            Equipamiento y Atributos (Añadir / Quitar)
          </label>
          
          {todasLasCaracteristicas.length === 0 ? (
            <p className="text-[10px] text-slate-400 font-medium">Cargando catálogo de atributos...</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {todasLasCaracteristicas.map(c => {
                const estaMarcado = caracteristicasSeleccionadas.includes(c.id);
                return (
                  <label 
                    key={c.id} 
                    className={`flex items-center space-x-2 text-xs font-bold p-2 rounded-lg border transition-all select-none cursor-pointer ${
                      estaMarcado 
                        ? 'bg-blue-50/50 border-blue-200 text-brand-primary' 
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      checked={estaMarcado}
                      onChange={() => manejarCheckboxChange(c.id)}
                      className="rounded border-slate-300 text-brand-primary focus:ring-brand-primary w-3.5 h-3.5 cursor-pointer"
                    />
                    <span>{c.nombre}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex space-x-2 pt-2">
          <button type="button" onClick={onCancel} className="flex-1 bg-slate-100 hover:bg-slate-200 text-brand-dark text-xs font-bold py-2.5 rounded-xl transition-colors cursor-pointer">
            Cancelar
          </button>
          <button type="submit" className="flex-1 bg-brand-primary hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer">
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
