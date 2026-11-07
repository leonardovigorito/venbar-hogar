"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Categoria { id: number; nombre: string; }
interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  imagenUrl: string | null;
  disponible: boolean;
  destacado: boolean;
  categoriaId: number;
  categoria: { nombre: string };
}

const EMPTY_FORM = {
  nombre: "",
  descripcion: "",
  precio: "",
  imagenUrl: "",
  disponible: true,
  destacado: false,
  categoriaId: "",
};

export default function AdminProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editando, setEditando] = useState<Producto | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState<number | null>(null);

  async function load() {
    const [prods, cats] = await Promise.all([
      fetch("/api/productos?disponible=all").then((r) => r.json()),
      fetch("/api/categorias").then((r) => r.json()),
    ]);
    setProductos(Array.isArray(prods) ? prods : []);
    setCategorias(cats);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function startEdit(p: Producto) {
    setEditando(p);
    setForm({
      nombre: p.nombre,
      descripcion: p.descripcion ?? "",
      precio: String(p.precio),
      imagenUrl: p.imagenUrl ?? "",
      disponible: p.disponible,
      destacado: p.destacado,
      categoriaId: String(p.categoriaId),
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditando(null);
    setForm(EMPTY_FORM);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const body = {
      nombre: form.nombre,
      descripcion: form.descripcion || null,
      precio: Number(form.precio),
      imagenUrl: form.imagenUrl || null,
      disponible: form.disponible,
      destacado: form.destacado,
      categoriaId: Number(form.categoriaId),
    };
    const res = editando
      ? await fetch(`/api/productos/${editando.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      : await fetch("/api/productos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
    if (res.ok) {
      resetForm();
      load();
    } else {
      const data = await res.json();
      setError(data.error ?? "Error al guardar");
    }
    setSaving(false);
  }

  async function handleDelete(id: number, nombre: string) {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return;
    const res = await fetch(`/api/productos/${id}`, { method: "DELETE" });
    if (res.ok) load();
    else alert("Error al eliminar");
  }

  const productosFiltrados = filtroCategoria
    ? productos.filter((p) => p.categoriaId === filtroCategoria)
    : productos;

  return (
    <div>
      <h1 className="font-serif text-3xl text-burgundy-700 mb-8">Productos</h1>

      {/* Formulario */}
      <div className="bg-white rounded-lg border border-beige-200 p-6 mb-8">
        <h2 className="font-semibold text-burgundy-700 mb-4">
          {editando ? `Editando: ${editando.nombre}` : "Nuevo producto"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-burgundy-700 mb-1">Nombre *</label>
            <input
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
              className="w-full border border-beige-300 rounded px-3 py-2 text-sm text-burgundy-800 focus:outline-none focus:border-burgundy-500"
              placeholder="Ej: Tela de lino natural"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-burgundy-700 mb-1">Precio ($ UYU) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.precio}
              onChange={(e) => setForm({ ...form, precio: e.target.value })}
              required
              className="w-full border border-beige-300 rounded px-3 py-2 text-sm text-burgundy-800 focus:outline-none focus:border-burgundy-500"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-burgundy-700 mb-1">Categoría *</label>
            <select
              value={form.categoriaId}
              onChange={(e) => setForm({ ...form, categoriaId: e.target.value })}
              required
              className="w-full border border-beige-300 rounded px-3 py-2 text-sm text-burgundy-800 focus:outline-none focus:border-burgundy-500"
            >
              <option value="">Seleccionar categoría...</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-burgundy-700 mb-1">URL de imagen</label>
            <input
              value={form.imagenUrl}
              onChange={(e) => setForm({ ...form, imagenUrl: e.target.value })}
              className="w-full border border-beige-300 rounded px-3 py-2 text-sm text-burgundy-800 focus:outline-none focus:border-burgundy-500"
              placeholder="https://... o /uploads/imagen.jpg"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-burgundy-700 mb-1">Descripción</label>
            <textarea
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              rows={2}
              className="w-full border border-beige-300 rounded px-3 py-2 text-sm text-burgundy-800 focus:outline-none focus:border-burgundy-500"
              placeholder="Descripción del producto..."
            />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-burgundy-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.disponible}
                onChange={(e) => setForm({ ...form, disponible: e.target.checked })}
                className="accent-burgundy-600"
              />
              Disponible
            </label>
            <label className="flex items-center gap-2 text-sm text-burgundy-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.destacado}
                onChange={(e) => setForm({ ...form, destacado: e.target.checked })}
                className="accent-burgundy-600"
              />
              Destacado en inicio
            </label>
          </div>
          {error && <p className="md:col-span-2 text-red-600 text-sm">{error}</p>}
          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-burgundy-600 text-beige-50 px-5 py-2 rounded text-sm font-medium hover:bg-burgundy-700 transition-colors disabled:opacity-60"
            >
              {saving ? "Guardando..." : editando ? "Actualizar" : "Crear producto"}
            </button>
            {editando && (
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2 rounded text-sm border border-beige-300 text-burgundy-600 hover:bg-beige-100 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Filtro */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFiltroCategoria(null)}
          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            !filtroCategoria ? "bg-burgundy-600 text-beige-50" : "bg-beige-200 text-burgundy-700"
          }`}
        >
          Todos ({productos.length})
        </button>
        {categorias.map((c) => (
          <button
            key={c.id}
            onClick={() => setFiltroCategoria(c.id)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              filtroCategoria === c.id ? "bg-burgundy-600 text-beige-50" : "bg-beige-200 text-burgundy-700"
            }`}
          >
            {c.nombre} ({productos.filter((p) => p.categoriaId === c.id).length})
          </button>
        ))}
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-beige-100 rounded h-16 animate-pulse" />
          ))}
        </div>
      ) : productosFiltrados.length === 0 ? (
        <p className="text-burgundy-400 text-sm py-8 text-center">No hay productos.</p>
      ) : (
        <div className="bg-white rounded-lg border border-beige-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-beige-100 text-left">
              <tr>
                <th className="px-4 py-3 text-burgundy-700 font-medium">Producto</th>
                <th className="px-4 py-3 text-burgundy-700 font-medium hidden md:table-cell">Categoría</th>
                <th className="px-4 py-3 text-burgundy-700 font-medium">Precio</th>
                <th className="px-4 py-3 text-burgundy-700 font-medium hidden sm:table-cell">Estado</th>
                <th className="px-4 py-3 text-burgundy-700 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-100">
              {productosFiltrados.map((p) => (
                <tr key={p.id} className="hover:bg-beige-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 flex-shrink-0 bg-beige-100 rounded overflow-hidden">
                        {p.imagenUrl ? (
                          <Image
                            src={p.imagenUrl}
                            alt={p.nombre}
                            width={36}
                            height={36}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-base">🪡</div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-burgundy-800">{p.nombre}</p>
                        {p.destacado && (
                          <span className="text-xs text-burgundy-500">★ Destacado</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-burgundy-500 hidden md:table-cell">
                    {p.categoria.nombre}
                  </td>
                  <td className="px-4 py-3 font-serif font-semibold text-burgundy-700">
                    ${p.precio.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        p.disponible
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {p.disponible ? "Disponible" : "Sin stock"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(p)}
                        className="text-xs text-burgundy-600 hover:text-burgundy-800 transition-colors px-2 py-1 border border-beige-300 rounded"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.nombre)}
                        className="text-xs text-red-500 hover:text-red-700 transition-colors px-2 py-1 border border-red-200 rounded"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
