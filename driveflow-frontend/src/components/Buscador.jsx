export default function Buscador() {
  return (
    <section className="w-full bg-brand-dark text-white rounded-2xl p-6 shadow-md md:p-8">
      <h2 className="text-xl font-bold mb-2 md:text-2xl">Encuentra tu auto ideal</h2>
      <p className="text-sm text-slate-400 mb-4">Selecciona las fechas para verificar la disponibilidad en tiempo real.</p>
      {/* Marcador de Inputs */}
      <div className="h-12 bg-slate-800 rounded-xl border border-dashed border-slate-700 flex items-center justify-center text-slate-500 text-xs font-mono">
        [Área Funcional: Inputs de Fechas / Ubicación]
      </div>
    </section>
  );
}
