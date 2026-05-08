import { useState } from 'react';
import { useCart } from '../context/CartContext';

function fmt(n) {
  return Number(n).toLocaleString('es-UY', { maximumFractionDigits: 0 });
}

export default function ProductCard({ producto }) {
  const { agregarAlCarrito } = useCart();
  const [metros, setMetros] = useState(1);
  const [agregado, setAgregado] = useState(false);

  const handleAgregar = () => {
    agregarAlCarrito(producto, metros);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1500);
  };

  const cambiarMetros = (delta) => {
    setMetros(prev => Math.max(0.5, Math.round((prev + delta) * 10) / 10));
  };

  const sinStock = producto.stock <= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      {/* Imagen */}
      <div className="relative bg-venbar-cream aspect-[4/3] overflow-hidden">
        {producto.imagen ? (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-venbar-red opacity-40">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs">Sin imagen</span>
          </div>
        )}
        {sinStock && (
          <span className="absolute top-2 right-2 bg-gray-700 text-white text-xs px-2 py-0.5 rounded-full">
            Sin stock
          </span>
        )}
        {producto.categoria && (
          <span className="absolute top-2 left-2 bg-venbar-red text-white text-xs px-2 py-0.5 rounded-full">
            {producto.categoria}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-serif font-semibold text-gray-900 text-base leading-tight mb-1">
          {producto.nombre}
        </h3>
        {producto.descripcion && (
          <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2 flex-1">
            {producto.descripcion}
          </p>
        )}

        <div className="mt-auto space-y-3">
          <p className="text-venbar-red font-bold text-lg">
            ${fmt(producto.precio)}<span className="text-sm font-normal text-gray-500">/metro</span>
          </p>

          {!sinStock ? (
            <>
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={() => cambiarMetros(-0.5)} className="px-2.5 py-1.5 text-venbar-red hover:bg-venbar-cream transition-colors text-sm font-bold">−</button>
                  <input
                    type="number"
                    value={metros}
                    min="0.5"
                    step="0.5"
                    onChange={e => setMetros(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                    className="w-12 text-center text-sm py-1.5 border-x border-gray-200 focus:outline-none"
                  />
                  <button onClick={() => cambiarMetros(0.5)} className="px-2.5 py-1.5 text-venbar-red hover:bg-venbar-cream transition-colors text-sm font-bold">+</button>
                </div>
                <span className="text-xs text-gray-400">metros</span>
              </div>
              <button
                onClick={handleAgregar}
                className={`w-full py-2 rounded-lg text-sm font-semibold transition-all ${
                  agregado
                    ? 'bg-green-600 text-white'
                    : 'bg-venbar-red hover:bg-venbar-red-hover text-white'
                }`}
              >
                {agregado ? '✓ Agregado' : 'Agregar al carrito'}
              </button>
            </>
          ) : (
            <p className="text-gray-400 text-sm text-center py-2">Sin stock disponible</p>
          )}

          <p className="text-xs text-gray-400 text-center">
            Stock: {producto.stock}m disponibles
          </p>
        </div>
      </div>
    </div>
  );
}
