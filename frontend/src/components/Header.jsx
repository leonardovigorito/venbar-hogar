import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Header({ onAbrirCarrito }) {
  const { totalItems } = useCart();

  return (
    <header className="bg-venbar-red sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        {/* Nombre de la marca en texto */}
        <Link to="/" className="select-none flex items-baseline gap-1.5">
          <span className="font-serif italic font-bold text-white text-2xl leading-none">venbar</span>
          <span className="font-serif font-bold text-white text-2xl tracking-widest leading-none">HOGAR</span>
        </Link>

        {/* Acciones */}
        <div className="flex items-center gap-3">
          <button
            onClick={onAbrirCarrito}
            className="relative flex items-center gap-2 bg-white text-venbar-red px-4 py-2 rounded-full text-sm font-semibold hover:bg-venbar-cream transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Carrito</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-venbar-red-dark text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-white font-bold">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
