const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const obtenerHeaders = (token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Basic ${token}`;
  return headers;
};

export const apiService = {
  obtenerVehiculosPaginados: (page, size, filtros = '', texto = '') => {
    return fetch(`${API_URL}/vehiculos/paginados?page=${page}&size=${size}${filtros}${texto}`).then(res => res.json());
  },
  obtenerCategorias: () => fetch(`${API_URL}/categorias`).then(res => res.json()),
  eliminarCategoria: (id, token) => {
    return fetch(`${API_URL}/categorias/${id}`, { method: 'DELETE', headers: obtenerHeaders(token) });
  },

  obtenerFechasOcupadas: (vid) => fetch(`${API_URL}/reservas/ocupadas/${vid}`).then(res => res.json()),
  obtenerHistorialReservas: (uid, token) => {
    return fetch(`${API_URL}/reservas/usuario/${uid}`, { headers: obtenerHeaders(token) }).then(res => res.json());
  },
  registrarReserva: (payload, token) => {
    return fetch(`${API_URL}/reservas`, { method: 'POST', headers: obtenerHeaders(token), body: JSON.stringify(payload) });
  },

  obtenerPuntuacionesVehiculo: (vid) => fetch(`${API_URL}/puntuaciones/vehiculo/${vid}`).then(res => res.json()),
  publicarReseña: (vid, uid, payload, token) => {
    return fetch(`${API_URL}/puntuaciones/vehiculo/${vid}/usuario/${uid}`, { method: 'POST', headers: obtenerHeaders(token), body: JSON.stringify(payload) });
  }
};
