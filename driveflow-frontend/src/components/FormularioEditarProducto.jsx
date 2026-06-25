import { useState } from 'react';

export default function FormularioEditarProducto({ vehiculo, onCancel, onSaveSuccess }) {
  const [nombre, setNombre] = useState(vehiculo.nombre);
  const [descripcion, setDescripcion] = useState(vehiculo.descripcion);
  const [precio, setPrecio] = useState(vehiculo.precioPorDia);
  const [errorServidor, setErrorServidor] = useState('');

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setErrorServidor('');

    const payload = {
      nombre,
      descripcion,
      precioPorDia: parseFloat(precio),
      imagenes: vehiculo.imagenes // Mantiene las imágenes previas para simplificar el flujo
    };

    try {
      const respuesta = await fetch(`http://localhost:8080/api/vehiculos/${vehiculo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'Error al actualizar el producto');
      }

      onSaveSuccess(); // Notifica a la tabla que debe refrescar los datos
    } catch (err) {
      setErrorServidor(err.message);
    }
  };

  return (
    <div className="bg-white border border-brand-border p-6 rounded-2xl shadow-sm max-w-xl mx-auto">
      <h3 className="text-base font-black text-brand-dark mb-4">Modificar Parámetros de: {vehiculo.nombre}</h3>
      
      {errorServidor && <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">⚠️ {errorServidor}</div>}
      
      <form onSubmit={manejarEnvio} className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Nombre</label>
          <input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full bg-slate-50 border border-brand-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-primary" />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Descripción</label>
          <textarea required rows="3" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="w-full bg-slate-50 border border-brand-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-primary" />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Precio por día ($)</label>
          <input type="number" required value={precio} onChange={(e) => setPrecio(e.target.value)} className="w-full bg-slate-50 border border-brand-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-primary" />
        </div>
        <div className="flex space-x-2 pt-2">
          <button type="button" onClick={onCancel} className="flex-1 bg-slate-100 text-brand-dark text-xs font-bold py-2.5 rounded-xl cursor-pointer">Cancelar</button>
          <button type="submit" className="flex-1 bg-brand-primary text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer hover:bg-blue-700">Guardar Cambios</button>
        </div>
      </form>
    </div>
  );
}
