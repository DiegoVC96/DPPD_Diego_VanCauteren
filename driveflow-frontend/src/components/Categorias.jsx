export default function Categorias() {
  return (
    <section className="w-full">
      <h2 className="text-xl font-extrabold tracking-tight mb-4 text-brand-dark">Buscar por categoría</h2>
      {/* Grilla responsiva de categorías */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['Sedán', 'SUV', 'Deportivos', 'Eléctricos'].map((cat, index) => (
          <div 
            key={index} 
            className="bg-white border border-brand-border p-4 rounded-xl shadow-xs hover:border-brand-primary cursor-pointer transition-all text-center font-semibold text-sm"
          >
            {cat}
          </div>
        ))}
      </div>
    </section>
  );
}
