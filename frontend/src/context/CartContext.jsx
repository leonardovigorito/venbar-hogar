import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('venbar_carrito') || '{}');
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('venbar_carrito', JSON.stringify(items));
  }, [items]);

  const agregarAlCarrito = (producto, metros = 1) => {
    setItems(prev => ({
      ...prev,
      [producto.id]: prev[producto.id]
        ? { ...prev[producto.id], metros: Math.round((prev[producto.id].metros + metros) * 10) / 10 }
        : { producto, metros },
    }));
  };

  const quitarDelCarrito = (id) => {
    setItems(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const actualizarCantidad = (id, metros) => {
    const m = parseFloat(metros);
    if (!m || m <= 0) {
      quitarDelCarrito(id);
      return;
    }
    setItems(prev => ({ ...prev, [id]: { ...prev[id], metros: m } }));
  };

  const vaciarCarrito = () => setItems({});

  const totalItems = Object.values(items).length;
  const totalPrecio = Object.values(items).reduce(
    (sum, { producto, metros }) => sum + producto.precio * metros,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, agregarAlCarrito, quitarDelCarrito, actualizarCantidad, vaciarCarrito, totalItems, totalPrecio }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
