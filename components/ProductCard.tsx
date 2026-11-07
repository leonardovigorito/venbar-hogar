"use client";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  imagenUrl: string | null;
  disponible: boolean;
  categoria?: { nombre: string } | null;
}

export default function ProductCard({ producto }: { producto: Producto }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="bg-white border border-beige-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow group">
      <div className="relative h-48 bg-beige-100 overflow-hidden">
        {producto.imagenUrl ? (
          <Image
            src={producto.imagenUrl}
            alt={producto.nombre}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-beige-400">
            <div className="text-4xl">🪡</div>
          </div>
        )}
        {producto.categoria && (
          <span className="absolute top-2 left-2 bg-beige-200 text-burgundy-700 text-xs px-2 py-0.5 rounded">
            {producto.categoria.nombre}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-burgundy-800 mb-1 truncate">{producto.nombre}</h3>
        {producto.descripcion && (
          <p className="text-burgundy-500 text-xs mb-3 line-clamp-2">{producto.descripcion}</p>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="font-serif text-lg font-semibold text-burgundy-700">
            ${producto.precio.toFixed(2)}
          </span>
          <button
            onClick={() =>
              addItem({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                imagenUrl: producto.imagenUrl ?? undefined,
              })
            }
            disabled={!producto.disponible}
            className="bg-burgundy-600 text-beige-50 text-xs px-3 py-1.5 rounded hover:bg-burgundy-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {producto.disponible ? "Agregar" : "Sin stock"}
          </button>
        </div>
      </div>
    </div>
  );
}
