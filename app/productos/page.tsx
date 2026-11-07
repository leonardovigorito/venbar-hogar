"use client";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";

interface Categoria {
  id: number;
  nombre: string;
}

interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  imagenUrl: string | null;
  disponible: boolean;
  categoriaId: number;
  categoria: { nombre: string };
}

export default function ProductosPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categoriaActiva, setCategoriaActiva] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/categorias").then((r) => r.json()),
      fetch("/api/productos").then((r) => r.json()),
    ]).then(([cats, prods]) => {
      setCategorias(cats);
      setProductos(prods);
      setLoading(false);
    });
  }, []);

  const productosFiltrados =
    categoriaActiva === null
      ? productos
      : productos.filter((p) => p.categoriaId === categoriaActiva);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl text-burgundy-700 mb-2">Productos</h1>
      <p className="text-burgundy-500 mb-8 text-sm">
        Explorá nuestra colección de telas y textiles
      </p>

      {/* Filtro por categoría */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setCategoriaActiva(null)}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            categoriaActiva === null
              ? "bg-burgundy-600 text-beige-50"
              : "bg-beige-200 text-burgundy-700 hover:bg-beige-300"
          }`}
        >
          Todos
        </button>
        {categorias.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoriaActiva(cat.id)}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              categoriaActiva === cat.id
                ? "bg-burgundy-600 text-beige-50"
                : "bg-beige-200 text-burgundy-700 hover:bg-beige-300"
            }`}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      {/* Grid de productos */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-beige-100 rounded-lg h-64 animate-pulse"
            />
          ))}
        </div>
      ) : productosFiltrados.length === 0 ? (
        <div className="text-center py-20 text-burgundy-400">
          <p className="text-4xl mb-3">🪡</p>
          <p>No hay productos en esta categoría todavía.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productosFiltrados.map((p) => (
            <ProductCard key={p.id} producto={p} />
          ))}
        </div>
      )}
    </div>
  );
}
