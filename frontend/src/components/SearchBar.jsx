import { useState, useEffect } from 'react';

export default function SearchBar({ onBuscar, onFiltrarCategoria, categoriaActiva }) {
  const [texto, setTexto] = useState('');
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    fetch('/api/categorias')
      .then(r => r.json())
      .then(setCategorias)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => onBuscar(texto), 300);
    return () => clearTimeout(timer);
  }, [texto]);

  return (
    <div className="bg-white shadow-sm border-b border-venbar-cream-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-3">
        {/* Buscador */}
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar telas, cortinas, tapicería..."
            value={texto}
            onChange={e => setTexto(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-venbar-red focus:border-transparent"
          />
        </div>

        {/* Filtros por categoría */}
        {categorias.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => onFiltrarCategoria('')}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !categoriaActiva ? 'bg-venbar-red text-white' : 'bg-venbar-cream text-venbar-red hover:bg-venbar-cream-dark'
              }`}
            >
              Todas
            </button>
            {categorias.map(cat => (
              <button
                key={cat}
                onClick={() => onFiltrarCategoria(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  cat === categoriaActiva ? 'bg-venbar-red text-white' : 'bg-venbar-cream text-venbar-red hover:bg-venbar-cream-dark'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
