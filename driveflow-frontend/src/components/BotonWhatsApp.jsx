import { useState } from 'react';
import { MessageCircle, X, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BotonWhatsApp() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensajeConsulta, setMensajeConsulta] = useState('¡Hola, DriveFlow! 🚗 Me gustaría recibir más información sobre el catálogo de alquileres vigentes.');
  const [notificacionExito, setNotificacionExito] = useState(false);
  const [errorConexion, setErrorServidor] = useState(false);

  const ejecutarAperturaChatNativa = (e) => {
    e.preventDefault();
    setErrorServidor(false);
    setNotificacionExito(false);

    // Número corporativo local ficticio con prefijo internacional
    const numeroSoporteDriveFlow = "5491123456789"; 

    if (!numeroSoporteDriveFlow || numeroSoporteDriveFlow.length < 10) {
      setErrorServidor(true);
      return;
    }

    try {
      // Conexión universal wa.me/ que abre la app nativa en smartphones y tablets
      const urlApiWhatsapp = `https://wa.me{numeroSoporteDriveFlow}?text=${encodeURIComponent(mensajeConsulta.trim())}`;
      
      window.open(urlApiWhatsapp, '_blank', 'noopener,noreferrer');
      
      // NOTIFICACIÓN DE ÉXITO
      setNotificacionExito(true);
      setModalAbierto(false);
      setMensajeConsulta('¡Hola, DriveFlow! 🚗 Me gustaría recibir más información sobre el catálogo de alquileres vigentes.');
      setTimeout(() => setNotificacionExito(false), 4000);
    } catch (err) {
        console.error('Error al intentar abrir WhatsApp:', err);
      setErrorServidor(true); 
    }
  };

  return (
    <>
      {/* =======================================================================
          BOTÓN CLARAMENTE VISIBLE UBICADO ABAJO A LA DERECHA
          ======================================================================= */}
      <div className="fixed bottom-6 right-6 z-50 animate-bounce-slow flex flex-col items-end">
        
        {/* NOTIFICACIÓN DE ÉXITO FLOTANTE TEMPORAL */}
        {notificacionExito && (
          <div className="mb-3 p-3 bg-emerald-600 text-white text-xs font-bold rounded-2xl shadow-xl flex items-center space-x-2 border border-emerald-500 animate-fade-in font-mono select-none">
            <CheckCircle2 size={14} />
            <span>¡Redirección exitosa a WhatsApp! Consulta despachada.</span>
          </div>
        )}

        {/* NOTIFICACIÓN DE ERROR ESPECÍFICA */}
        {errorConexion && (
          <div className="mb-3 p-3 bg-red-600 text-white text-xs font-bold rounded-2xl shadow-xl flex items-center space-x-2 border border-red-500 animate-fade-in font-mono select-none max-w-xs">
            <AlertCircle size={14} />
            <span>Error de canal: No se pudo enlazar con WhatsApp. Compruebe su conexión a internet.</span>
          </div>
        )}

        {/* El Disparador Circular de WhatsApp (Accesible sin registrarse) */}
        <button
          type="button"
          onClick={() => { setModalAbierto(!modalAbierto); setErrorServidor(false); }}
          title="Iniciar chat de consultas por WhatsApp"
          className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer border border-emerald-400"
        >
          {modalAbierto ? <X size={24} /> : <MessageCircle size={28} className="fill-current text-emerald-500/10" />}
        </button>
      </div>

      {/* PERSIANA FLOTANTE DE REDACCIÓN DE PREGUNTAS */}
      {modalAbierto && (
        <div className="fixed bottom-24 right-6 z-50 bg-white border border-brand-border rounded-3xl p-5 shadow-2xl w-80 text-brand-dark animate-fade-in select-none">
          <div className="bg-emerald-500 -mx-5 -mt-5 p-4 rounded-t-3xl text-white mb-4 flex items-center space-x-3 border-b border-emerald-600">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-black text-sm">DF</div>
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-tight leading-none">Canal de Soporte Directo</span>
              <span className="text-[9px] text-emerald-100 font-bold mt-0.5 tracking-wider">DriveFlow Center • En línea</span>
            </div>
          </div>

          <form onSubmit={ejecutarAperturaChatNativa} className="space-y-3">
            <div>
              <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1 tracking-wider">Escribe tu duda o consulta</label>
              <textarea
                rows="4"
                required
                value={mensajeConsulta}
                onChange={(e) => setMensajeConsulta(e.target.value)}
                className="w-full bg-slate-50 border border-brand-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500 text-slate-600 leading-relaxed resize-none"
                placeholder="Escriba aquí..."
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer h-10"
            >
              <Send size={12} />
              <span>Iniciar Conversación</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
