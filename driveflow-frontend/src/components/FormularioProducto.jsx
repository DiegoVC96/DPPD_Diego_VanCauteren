import { useState } from 'react';

export default function FormularioProducto({ onCerrar }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [urlImagen, setUrlImagen] = useState('');
  const [listaImagenes, setListaImagenes] = useState([]);
  const [errorServidor, setErrorServidor] = useState('');
  const [exito, setExito] = useState(false);

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
      imagenes: listaImagenes
    };

    try {
      const respuesta = await fetch('http://localhost:8080/api/vehiculos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        // Atrapa el error de nombre duplicado (HTTP 409 o 400) enviado por el backend
        throw new Error(datos.mensaje || 'Error al guardar el producto');
      }

      setExito(true);
      // Limpiar formulario
      setNombre('');
      setDescripcion('');
      setPrecio('');
      setListaImagenes([]);
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
