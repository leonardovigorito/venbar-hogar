import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

function fmt(n) {
  return Number(n).toLocaleString('es-UY', { maximumFractionDigits: 0 });
}

export default function CartSidebar({ abierto, onCerrar }) {
  const { items, quitarDelCarrito, actualizarCantidad, totalPrecio } = useCart();
  const [config, setConfig] = useState({ whatsapp: '59894214684', nombre: 'Venbar Hogar' });
  const listaItems = Object.values(items);

  useEffect(() => {
    fetch('/api/config').then(r => r.json()).then(setConfig).catch(() => {});
  }, []);

  const generarMensajeWA = () => {
    const lineas = listaItems.map(({ producto, metros }) =>
      `• ${metros}m de ${producto.nombre} — $${fmt(metros * producto.precio)} UYU`
    ).join('\n');
    const texto = `Hola! Quiero hacer el siguiente pedido en ${config.nombre || 'Venbar Hogar'}:\n\n${lineas}\n\nTotal estimado: $${fmt(totalPrecio)} UYU\n\n¿Me podés confirmar disponibilidad y coordinar la entrega? ¡Gracias!`;
    const num = (config.whatsapp || '59894214684').replace(/\D/g, '');
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity ${abierto ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onCerrar}
      />

      {/* Sidebar */}
      <aside className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${abierto ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-venbar-red text-white">
          <h2 className="font-serif text-lg font-semibold">Tu pedido</h2>
          <button onClick={onCerrar} className="text-2xl leading-none hover:opacity-80 transition-opacity">&times;</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {listaItems.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-sm">Tu carrito está vacío</p>
              <p className="text-xs mt-1">Agregá telas para armar tu pedido</p>
            </div>
          ) : (
            listaItems.map(({ producto, metros }) => (
              <div key={producto.id} className="flex gap-3 bg-venbar-cream-dark rounded-lg p-3">
                {/* Mini imagen */}
                <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-venbar-cream">
                  {producto.imagen ? (
                    <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-venbar-red opacity-40">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">{producto.nombre}</p>
                  <p className="text-xs text-gray-500">${fmt(producto.precio)}/metro</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white">
                      <button onClick={() => actualizarCantidad(producto.id, Math.round((metros - 0.5) * 10) / 10)} className="px-2 py-0.5 text-venbar-red text-sm font-bold hover:bg-venbar-cream transition-colors">−</button>
                      <span className="px-2 text-sm">{metros}m</span>
                      <button onClick={() => actualizarCantidad(producto.id, Math.round((metros + 0.5) * 10) / 10)} className="px-2 py-0.5 text-venbar-red text-sm font-bold hover:bg-venbar-cream transition-colors">+</button>
                    </div>
                    <span className="text-sm font-semibold text-venbar-red ml-auto">${fmt(metros * producto.precio)}</span>
                  </div>
                </div>

                {/* Eliminar */}
                <button onClick={() => quitarDelCarrito(producto.id)} className="text-gray-300 hover:text-red-500 transition-colors self-start mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {listaItems.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-3 bg-white">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Total estimado</span>
              <span className="font-bold text-venbar-red text-lg">${fmt(totalPrecio)} <span className="text-sm font-normal text-gray-500">UYU</span></span>
            </div>
            <p className="text-xs text-gray-400">Los precios son por metro. Te confirmamos disponibilidad y coordinamos la entrega.</p>
            <button
              onClick={generarMensajeWA}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-sm transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.858L.057 23.569a.75.75 0 00.921.921l5.772-1.476A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.663-.523-5.178-1.432l-.37-.222-3.827.978.996-3.762-.242-.386A9.97 9.97 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              Comprar por WhatsApp
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
