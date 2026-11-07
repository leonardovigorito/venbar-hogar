import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [totalCategorias, totalProductos, totalDisponibles] = await Promise.all([
    prisma.categoria.count(),
    prisma.producto.count(),
    prisma.producto.count({ where: { disponible: true } }),
  ]);

  const stats = [
    { label: "Categorías", value: totalCategorias, href: "/admin/categorias", color: "bg-burgundy-100 text-burgundy-700" },
    { label: "Productos totales", value: totalProductos, href: "/admin/productos", color: "bg-beige-200 text-burgundy-700" },
    { label: "Disponibles", value: totalDisponibles, href: "/admin/productos", color: "bg-green-50 text-green-700" },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-burgundy-700 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <div className={`${s.color} rounded-lg p-6 hover:shadow-md transition-shadow`}>
              <p className="text-4xl font-bold font-serif">{s.value}</p>
              <p className="text-sm mt-1 font-medium">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/categorias"
          className="block border border-beige-300 bg-white rounded-lg p-5 hover:shadow-md transition-shadow"
        >
          <h2 className="font-semibold text-burgundy-700 mb-1">Gestionar Categorías</h2>
          <p className="text-sm text-burgundy-500">Agregar, editar o eliminar categorías de productos</p>
        </Link>
        <Link
          href="/admin/productos"
          className="block border border-beige-300 bg-white rounded-lg p-5 hover:shadow-md transition-shadow"
        >
          <h2 className="font-semibold text-burgundy-700 mb-1">Gestionar Productos</h2>
          <p className="text-sm text-burgundy-500">Agregar, editar o eliminar productos del catálogo</p>
        </Link>
      </div>

      <div className="mt-8 text-sm text-burgundy-400">
        <Link href="/" className="hover:text-burgundy-600 transition-colors">
          ← Ver sitio público
        </Link>
      </div>
    </div>
  );
}
