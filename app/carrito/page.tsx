"use client";
import { useCartStore } from "@/store/cartStore";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import Image from "next/image";
import Link from "next/link";

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } =
    useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <h1 className="font-serif text-3xl text-burgundy-700 mb-3">
          Tu carrito está vacío
        </h1>
        <p className="text-burgundy-500 mb-8">
          Explorá nuestros productos y agregá lo que te guste.
        </p>
        <Link
          href="/productos"
          className="bg-burgundy-600 text-beige-50 px-6 py-3 rounded text-sm font-medium hover:bg-burgundy-700 transition-colors"
        >
          Ver Productos
        </Link>
      </div>
    );
  }

  const whatsappUrl = buildWhatsAppUrl(items);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl text-burgundy-700 mb-8">
        Tu Carrito
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-beige-200 rounded-lg p-4 flex gap-4 items-center"
            >
              <div className="relative w-16 h-16 flex-shrink-0 bg-beige-100 rounded overflow-hidden">
                {item.imagenUrl ? (
                  <Image
                    src={item.imagenUrl}
                    alt={item.nombre}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    🪡
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-burgundy-800 truncate">
                  {item.nombre}
                </h3>
                <p className="text-burgundy-500 text-sm">
                  ${item.precio.toFixed(2)} c/u
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                  className="w-7 h-7 rounded border border-beige-300 text-burgundy-700 hover:bg-beige-100 transition-colors text-sm flex items-center justify-center"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm font-medium text-burgundy-800">
                  {item.cantidad}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                  className="w-7 h-7 rounded border border-beige-300 text-burgundy-700 hover:bg-beige-100 transition-colors text-sm flex items-center justify-center"
                >
                  +
                </button>
              </div>
              <div className="text-right min-w-[70px]">
                <p className="font-serif font-semibold text-burgundy-700">
                  ${(item.precio * item.cantidad).toFixed(2)}
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-xs text-burgundy-400 hover:text-burgundy-700 transition-colors"
                >
                  Quitar
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-sm text-burgundy-400 hover:text-burgundy-600 transition-colors"
          >
            Vaciar carrito
          </button>
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <div className="bg-beige-100 rounded-lg p-6 sticky top-24">
            <h2 className="font-serif text-xl text-burgundy-700 mb-4">
              Resumen
            </h2>
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-burgundy-600">
                  <span className="truncate mr-2">
                    {item.nombre} x{item.cantidad}
                  </span>
                  <span className="flex-shrink-0">
                    ${(item.precio * item.cantidad).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-beige-300 pt-4 mb-6">
              <div className="flex justify-between font-semibold text-burgundy-800">
                <span>Total</span>
                <span className="font-serif text-lg">
                  ${totalPrice().toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-burgundy-400 mt-1">
                * Precio estimado, sujeto a disponibilidad
              </p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-green-600 text-white text-center py-3 rounded font-medium hover:bg-green-700 transition-colors text-sm"
            >
              Enviar pedido por WhatsApp
            </a>
            <p className="text-xs text-burgundy-400 text-center mt-3">
              Se abrirá WhatsApp con tu pedido listo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
