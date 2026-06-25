import { useEffect, useState } from 'react';
import { Eye, Trash2, Edit, AlertCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import FormularioEditarProducto from './FormularioEditarProducto';

export default function TablaProductosAdmin({ onVerDetalle }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Estados exclusivos para la US #11 (Eliminar producto)
  const [idParaEliminar, setIdParaEliminar] = useState(null);
  const [nombreParaEliminar, setNombreParaEliminar] = useState('');

  // Estados exclusivos para la US Bonus #1 (Editar producto)
  const [vehiculoParaConfirmarEditar, setVehiculoParaConfirmarEditar] = useState(null);
  const [vehiculoEnEdicion, setVehiculoEnEdicion] = useState(null);

  // Función encargada de sincronizar los datos reales desde el Backend de Java 26
  const cargarInventarioFlota = () => {
    fetch('http://localhost:8080/api/vehiculos/paginados?page=0&size=50')
      .then((res) => {
        if (!res.ok) throw new Error('Error al conectar con la base de datos de DriveFlow');
        return res.json();
      })
      .then((data) => {
        setProductos(data.content || data);
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarInventarioFlota();
  }, []);

  // LÓGICA DE CONTROL: ELIMINAR PRODUCTO 
  const solicitarEliminacion = (id, nombre) => {
    setIdParaEliminar(id);
    setNombreParaEliminar(nombre);
  };

  const cancelarEliminacion = () => {
    setIdParaEliminar(null);
    setNombreParaEliminar('');
  };

  const confirmarEliminacion = async () => {
    try {
      const respuesta = await fetch(`http://localhost:8080/api/vehiculos/${idParaEliminar}`, {
        method: 'DELETE'
      });

      if (!respuesta.ok) throw new Error('No se pudo remover el recurso del servidor.');

      setProductos(productos.filter(p => p.id !== idParaEliminar));
      cancelarEliminacion();
    } catch (err) {
      alert(`⚠️ Error operativo: ${err.message}`);
    }
  };

  // LÓGICA DE CONTROL: EDITAR PRODUCTO 
  const solicitarEdicion = (auto) => {
    setVehiculoParaConfirmarEditar(auto);
  };

  const rechazarEdicion = () => {
    setVehiculoParaConfirmarEditar(null);
  };

  const aceptarEdicion = () => {
    setVehiculoEnEdicion(vehiculoParaConfirmarEditar);
    setVehiculoParaConfirmarEditar(null);
  };

  const finalizarEdicionConExito = () => {
    setVehiculoEnEdicion(null);
    setCargando(true);
    cargarInventarioFlota(); // Recarga los nombres y precios modificados desde XAMPP
  };

  // INTERRUPTOR DE VISTA ASÍNCRONA: Renderiza el formulario si se aceptó la edición
  if (vehiculoEnEdicion) {
    return (
      <FormularioEditarProducto 
        vehiculo={vehiculoEnEdicion} 
        onCancel={() => setVehiculoEnEdicion(null)} 
        onSaveSuccess={finalizarEdicionConExito}
      />
    );
  }

  if (cargando) {
    return (
      <div className="w-full text-center py-12 bg-white border border-brand-border rounded-2xl">
        <div className="animate-spin inline-block w-6 h-6 border-3 border-brand-primary border-t-transparent rounded-full text-brand-primary"></div>
        <p className="text-xs text-slate-400 mt-2 font-medium">Actualizando inventario...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-xs flex items-center space-x-2 font-medium">
        <AlertCircle size={16} />
        <span>No se pudo sincronizar el inventario: {error}</span>
      </div>
    );
  }
  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-xs overflow-hidden relative">
      
      {/* Encabezado del contenedor de inventario */}
      <div className="px-6 py-4 border-b border-brand-border bg-slate-50/75 flex justify-between items-center">
        <h3 className="text-sm font-black text-brand-dark uppercase tracking-wider">Flota de Vehículos Registrada</h3>
        <span className="text-[11px] bg-brand-primary/10 text-brand-primary font-bold px-2.5 py-1 rounded-md">
          Total: {productos.length} unidades
        </span>
      </div>

      {/* RENDERIZADO TABULAR DE DATOS */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider border-b border-brand-border">
              {/* LAS TRES COLUMNAS EXIGIDAS */}
              <th className="py-3.5 px-6 w-24">Id</th>
              <th className="py-3.5 px-6">Nombre</th>
              <th className="py-3.5 px-6 text-right w-44">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-brand-dark">
            {productos.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-10 text-slate-400 font-medium">
                  No hay productos registrados en el sistema actualmente.
                </td>
              </tr>
            ) : (
              productos.map((auto) => (
                <tr key={auto.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Columna Id */}
                  <td className="py-3.5 px-6 font-mono text-xs font-bold text-slate-400">
                    #{auto.id}
                  </td>
                  
                  {/* Columna Nombre */}
                  <td className="py-3.5 px-6 font-semibold">
                    <div className="flex items-center space-x-3">
                      {auto.imagenes && auto.imagenes.length > 0 && (
                        <img 
                          src={auto.imagenes[0]} 
                          alt="" 
                          className="w-8 h-8 object-cover rounded-lg border border-slate-200 bg-slate-100 shrink-0"
                        />
                      )}
                      <span className="truncate max-w-md">{auto.nombre}</span>
                    </div>
                  </td>
                  
                  {/* Columna Acciones */}
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end space-x-1">

                      {/* ACCIÓN ACTUALIZADA: Redirige al detalle al hacer clic */}
                      <button 
                        onClick={() => onVerDetalle(auto.id)}
                        title="Ver detalle de especificaciones"
                        className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-brand-primary rounded-lg transition-colors cursor-pointer"
                        >
                        <Eye size={16} />
                      </button>
                      
                      {/* ACCION DE EDITAR PRODUCTO POR FILA */}
                      <button 
                        onClick={() => solicitarEdicion(auto)}
                        title="Editar parámetros"
                        className="p-1.5 hover:bg-amber-50 text-slate-400 hover:text-amber-600 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit size={16} />
                      </button>

                      {/* ACCION DE ELIMINAR PRODUCTO POR FILA */}
                      <button 
                        onClick={() => solicitarEliminacion(auto.id, auto.nombre)}
                        title="Eliminar vehículo"
                        className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL INTERACTIVO DE CONFIRMACIÓN DE BORRADO (US #11) */}
      {idParaEliminar !== null && (
        <div className="fixed inset-0 bg-brand-dark/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-brand-border p-6 rounded-2xl shadow-xl max-w-sm w-full">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle size={24} />
            </div>
            <h4 className="text-base font-black text-brand-dark mb-1">¿Confirmas la eliminación?</h4>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Estás por eliminar el vehículo <span className="font-bold text-slate-700">"{nombreParaEliminar}"</span> del catálogo. Esta acción borrará el registro de la base de datos de XAMPP.
            </p>
            <div className="flex space-x-3">
              <button onClick={cancelarEliminacion} className="flex-1 bg-slate-100 text-brand-dark font-bold text-xs py-2.5 rounded-xl cursor-pointer">
                No, mantener
              </button>
              <button onClick={confirmarEliminacion} className="flex-1 bg-red-600 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer hover:bg-red-700">
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL INTERACTIVO DE CONFIRMACIÓN DE EDICIÓN (US BONUS #1) */}
      {vehiculoParaConfirmarEditar !== null && (
        <div className="fixed inset-0 bg-brand-dark/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-brand-border p-6 rounded-2xl shadow-xl max-w-sm w-full">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-4">
              <HelpCircle size={24} />
            </div>
            <h4 className="text-base font-black text-brand-dark mb-1">¿Abrir editor de producto?</h4>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Vas a ingresar a la consola de cambios para el coche <span className="font-bold text-slate-700">"{vehiculoParaConfirmarEditar.nombre}"</span>. ¿Deseas proceder?
            </p>
            <div className="flex space-x-3">
              <button onClick={rechazarEdicion} className="flex-1 bg-slate-100 text-brand-dark font-bold text-xs py-2.5 rounded-xl cursor-pointer">
                No, cancelar
              </button>
              <button onClick={aceptarEdicion} className="flex-1 bg-amber-500 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer hover:bg-amber-600">
                Sí, editar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
