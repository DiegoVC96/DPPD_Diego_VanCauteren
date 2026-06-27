import { useState, useEffect, useContext} from 'react';
import { AuthContext } from '../context/AuthContextStore';

export default function FormularioProducto({ onCerrar }) {
  const { usuario } = useContext(AuthContext);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [urlImagen, setUrlImagen] = useState('');
  const [listaImagenes, setListaImagenes] = useState([]);
  const [errorServidor, setErrorServidor] = useState('');
  const [exito, setExito] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [categoriaId, setCategoriaId] = useState('');
  const [listaCaracteristicas, setListaCaracteristicas] = useState([]);
  const [caracteristicasSeleccionadas, setCaracteristicasSeleccionadas] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/caracteristicas').then(res => res.json()).then(data => setListaCaracteristicas(data));
  }, []);

  const manejarCheckboxChange = (id) => {
    if (caracteristicasSeleccionadas.includes(id)) {
      setCaracteristicasSeleccionadas(caracteristicasSeleccionadas.filter(item => item !== id));
    } else {
      setCaracteristicasSeleccionadas([...caracteristicasSeleccionadas, id]);
    }
  };

  // Carga las categorías de la base de datos al montar el componente
  useEffect(() => {
    fetch('http://localhost:8080/api/categorias')
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(err => console.error("Error cargando categorías", err));
  }, []);

  // Añadir una URL de imagen a la lista temporal
  const agregarImagenLista = () => {
    if (urlImagen.trim() !== '') {
      setListaImagenes([...listaImagenes, urlImagen.trim()]);
      setUrlImagen('');
    }
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setErrorServidor('');
    setExito(false);

    if (listaImagenes.length === 0) {
      setErrorServidor('Debe añadir al menos una imagen antes de guardar.');
      return;
    }

    const payload = {
      nombre,
      descripcion,
      precioPorDia: parseFloat(precio),
      imagenes: listaImagenes,
      categoriaId: categoriaId ? parseInt(categoriaId, 10) : null,
      caracteristicasIds: caracteristicasSeleccionadas
    };

    try {
      const credencialesBase64 = btoa(`${usuario.email}:${usuario.password}`);

      const respuesta = await fetch('http://localhost:8080/api/vehiculos', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credencialesBase64}`
        },
        body: JSON.stringify(payload)
      });

      if (!respuesta.ok) {
        if (respuesta.status === 401) {
          throw new Error('Su sesión ha expirado o sus privilegios de Administrador no son válidos.');
        }
        const datos = await respuesta.json();
        throw new Error(datos.mensaje || 'Error al guardar el producto');
      }

      setExito(true);
      setNombre('');
      setDescripcion('');
      setPrecio('');
      setListaImagenes([]);
      setCategoriaId('');
      setCaracteristicasSeleccionadas([]);
    } catch (err) {
      setErrorServidor(err.message);
    }
  };

  return (
    <div className="bg-white border border-brand-border p-6 rounded-2xl shadow-md max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-brand-dark">Registrar Nuevo Vehículo</h2>
        <button onClick={onCerrar} className="text-slate-400 hover:text-slate-600 text-sm font-semibold cursor-pointer">
          Volver al catálogo
        </button>
      </div>

      {errorServidor && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-lg">
          ⚠️ {errorServidor}
        </div>
      )}

      {exito && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium rounded-lg">
          🎉 ¡Vehículo guardado exitosamente en la base de datos!
        </div>
      )}

      <form onSubmit={manejarEnvio} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Nombre del auto</label>
          <input 
            type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)}
            className="w-full bg-slate-50 border border-brand-border rounded-lg p-2.5 text-sm focus:border-brand-primary focus:outline-none"
            placeholder="Ej: Toyota Corolla Hybrid 2026"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Descripción</label>
          <textarea 
            required rows="3" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
            className="w-full bg-slate-50 border border-brand-border rounded-lg p-2.5 text-sm focus:border-brand-primary focus:outline-none"
            placeholder="Escribe los detalles del servicio, equipamiento, transmisión..."
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Precio por día ($)</label>
          <input 
            type="number" required min="1" value={precio} onChange={(e) => setPrecio(e.target.value)}
            className="w-full bg-slate-50 border border-brand-border rounded-lg p-2.5 text-sm focus:border-brand-primary focus:outline-none"
            placeholder="Ej: 45000"
          />
        </div>

        <div className="bg-slate-50 border border-brand-border p-4 rounded-xl">
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2 tracking-wider">Características Disponibles</label>
            <div className="grid grid-cols-2 gap-3">
              {listaCaracteristicas.map(c => (
                <label key={c.id} className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={caracteristicasSeleccionadas.includes(c.id)}
                    onChange={() => manejarCheckboxChange(c.id)}
                    className="rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                  />
                  <span>{c.nombre}</span>
                </label>
              ))}
            </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Categoría del Vehículo</label>
          <select 
            value={categoriaId} 
            onChange={(e) => setCategoriaId(e.target.value)}
            className="w-full bg-slate-50 border border-brand-border rounded-lg p-2.5 text-sm focus:border-brand-primary focus:outline-none"
            >
            <option value="">Seleccione una categoría...</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Añadir Imágenes (Una o más)</label>
          <div className="flex gap-2">
            <input 
              type="url" value={urlImagen} onChange={(e) => setUrlImagen(e.target.value)}
              className="grow bg-slate-50 border border-brand-border rounded-lg p-2.5 text-sm focus:border-brand-primary focus:outline-none"
              placeholder="https://ejemplo.com"
            />
            <button 
              type="button" onClick={agregarImagenLista}
              className="bg-brand-dark text-white px-4 text-sm font-medium rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              Añadir
            </button>
          </div>
          
          {listaImagenes.length > 0 && (
            <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-brand-border space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase">Imágenes cargadas ({listaImagenes.length}):</p>
              {listaImagenes.map((url, idx) => (
                <div key={idx} className="text-xs text-blue-600 truncate bg-white p-1.5 rounded border border-slate-100">
                  {url}
                </div>
              ))}
            </div>
          )}
        </div>

        <button 
          type="submit"
          className="w-full bg-brand-primary hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-sm cursor-pointer mt-2"
        >
          Guardar Producto
        </button>
      </form>
    </div>
  );
}
