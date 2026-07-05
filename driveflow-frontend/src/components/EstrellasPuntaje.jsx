import { Star } from 'lucide-react';

export default function EstrellasPuntaje({ promedio, total, tamano = 14 }) {
  const nota = promedio || 0;
  
  return (
    <div className="flex items-center space-x-1 w-max select-none font-mono">
      <div className="flex space-x-0.5">
        {[1, 2, 3, 4, 5].map((num) => (
          <Star 
            key={num} 
            size={tamano} 
            strokeWidth={2.5}
            className={num <= Math.round(nota) ? "fill-amber-400 text-amber-400" : "text-slate-200"} 
          />
        ))}
      </div>
      {total !== undefined && (
        <span className="text-[10px] text-slate-400 font-bold ml-1.5 bg-slate-50 border border-slate-200/60 px-1.5 py-0.5 rounded-md">
          {nota.toFixed(1)} ({total})
        </span>
      )}
    </div>
  );
}
