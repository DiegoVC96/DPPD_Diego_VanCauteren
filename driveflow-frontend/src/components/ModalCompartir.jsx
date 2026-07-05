import { useState } from 'react';
import { X as CloseIcon, MessageCircle, Check, Share2 } from 'lucide-react';

export default function ModalCompartir({ abierto, onCerrar, vehiculo, urlProducto }) {
  const [mensajePersonalizado, setMensajePersonalizado] = useState(
    `¡Miren este auto increíble que encontré en DriveFlow! 🚗💨: ${vehiculo?.nombre}`
  );
  const [enlaceCopiado, setEnlaceCopiado] = useState(false);

  if (!abierto || !vehiculo) return null;

  const primerImagen = vehiculo.imagenes && vehiculo.imagenes.length > 0 
    ? (Array.isArray(vehiculo.imagenes) ? vehiculo.imagenes : String(vehiculo.imagenes).split(','))
    : ['https://unsplash.com'];

  const copiarEnlaceAlPortapapeles = () => {
    navigator.clipboard.writeText(urlProducto);
    setEnlaceCopiado(true);
    setTimeout(() => setEnlaceCopiado(false), 2000);
  };

  const ejecutarCompartir = (red) => {
    const mensajeCompleto = `${mensajePersonalizado}\n\n${vehiculo.descripcion.substring(0, 100)}...\n\nHighway: ${urlProducto}`;

    switch (red) {
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlProducto)}&quote=${encodeURIComponent(mensajePersonalizado)}`,
          '_blank', 'noopener,noreferrer'
        );
        break;

      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(urlProducto)}&text=${encodeURIComponent(mensajePersonalizado)}`,
          '_blank', 'noopener,noreferrer'
        );
        break;

      case 'whatsapp':
        window.open(
          `https://wa.me/?text=${encodeURIComponent(mensajeCompleto)}`,
          '_blank', 'noopener,noreferrer'
        );
        break;

      default:
        break;
    }
  };

  return (
    <div className="fixed inset-0 bg-brand-dark/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in text-brand-dark">
      <div className="bg-white border border-brand-border rounded-3xl p-6 max-w-md w-full shadow-2xl relative flex flex-col">
        
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
          <h3 className="font-black text-sm uppercase tracking-wider text-brand-dark">Recomendar Vehículo</h3>
          <button onClick={onCerrar} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-brand-dark cursor-pointer transition-colors">
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Contenido Breve */}
        <div className="flex items-center space-x-3 bg-slate-50 border border-brand-border p-3 rounded-2xl mb-4">
          <div className="w-16 h-16 bg-white border border-slate-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-1">
            <img src={Array.isArray(primerImagen) ? primerImagen[0].trim() : String(primerImagen).split(',')[0].trim()} alt="" className="max-w-full max-h-full object-contain" />
          </div>
          <div className="min-w-0">
            <h4 className="font-extrabold text-xs text-brand-dark truncate">{vehiculo.nombre}</h4>
            <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">{vehiculo.descripcion}</p>
          </div>
        </div>

        {/* Mensaje Personalizado */}
        <div className="mb-5">
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 tracking-wider">Añade tu comentario personalizado</label>
          <textarea
            rows="3"
            value={mensajePersonalizado}
            onChange={(e) => setMensajePersonalizado(e.target.value)}
            className="w-full bg-slate-50 border border-brand-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-primary leading-relaxed resize-none text-slate-600"
          />
        </div>

        {/* Grid de Redes Sociales */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-wider">Selecciona la red social destino</label>
          
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => ejecutarCompartir('facebook')}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 hover:border-blue-600 hover:bg-blue-50/30 text-blue-600 transition-all cursor-pointer group"
            >
              <Share2 size={18} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold mt-1 text-slate-500">Facebook</span>
            </button>

            <button 
              onClick={() => ejecutarCompartir('twitter')}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 hover:border-black hover:bg-slate-50 text-black transition-all cursor-pointer group"
            >
              <svg 
                viewBox="0 0 24 24" 
                aria-hidden="true" 
                className="w-4 h-4 fill-current group-hover:scale-110 transition-transform duration-300"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
              <span className="text-[10px] font-bold mt-1 text-slate-500">Twitter (X)</span>
            </button>

            <button 
              onClick={() => ejecutarCompartir('whatsapp')}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/30 text-emerald-600 transition-all cursor-pointer group"
            >
              <MessageCircle size={18} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold mt-1 text-slate-500">WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Clipboard Link Footer */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-3xl">
          <span className="text-[10px] font-mono text-slate-400 truncate max-w-60">{urlProducto}</span>
          <button 
            onClick={copiarEnlaceAlPortapapeles}
            className="text-[10px] font-bold uppercase bg-white border border-brand-border text-slate-600 py-1.5 px-3 rounded-lg flex items-center space-x-1 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
          >
            {enlaceCopiado ? <Check size={12} className="text-emerald-500" /> : <Share2 size={12} />}
            <span>{enlaceCopiado ? 'Copiado' : 'Copiar'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
