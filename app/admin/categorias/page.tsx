"use client";
import { useEffect, useState } from "react";

interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  orden: number;
}

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nombre: "", descripcion: "", orden: "0" });
  const [editando, setEditando] = useState<Categoria | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const data = await fetch("/api/categorias").then((r) => r.json());
    setCategorias(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function startEdit(cat: Categoria) {
    setEditando(cat);
    setForm({ nombre: cat.nombre, descripcion: cat.descripcion ?? "", orden: String(cat.orden) });
    setError("");
  }

  function resetForm() {
    setEditando(null);
    setForm({ nombre: "", descripcion: "", orden: "0" });
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const body = { nombre: form.nombre, descripcion: form.descripcion, orden: Number(form.orden) };
    const res = editando
      ? await fetch(`/api/categorias/${editando.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      : await fetch("/api/categorias", {
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
    if (!confirm(`¿Eliminar la categoría "${nombre}"?`)) return;
    const res = await fetch(`/api/categorias/${id}`, { method: "DELETE" });
    if (res.ok) {
      load();
    } else {
      const data = await res.json();
      alert(data.error ?? "Error al eliminar");
    }
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-burgundy-700 mb-8">Categorías</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario */}
        <div className="bg-white rounded-lg border border-beige-200 p-6">
          <h2 className="font-semibold text-burgundy-700 mb-4">
            {editando ? `Editar: ${editando.nombre}` : "Nueva categoría"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-burgundy-700 mb-1">
                Nombre *
              </label>
              <input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
                className="w-full border border-beige-300 rounded px-3 py-2 text-burgundy-800 focus:outline-none focus:border-burgundy-500 text-sm"
                placeholder="Ej: Lienzo, Algodón, Tapicería..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-burgundy-700 mb-1">
                Descripción
              </label>
              <textarea
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                rows={2}
                className="w-full border border-beige-300 rounded px-3 py-2 text-burgundy-800 focus:outline-none focus:border-burgundy-500 text-sm"
                placeholder="Descripción opcional..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-burgundy-700 mb-1">
                Orden de visualización
              </label>
              <input
                type="number"
                value={form.orden}
                onChange={(e) => setForm({ ...form, orden: e.target.value })}
                className="w-full border border-beige-300 rounded px-3 py-2 text-burgundy-800 focus:outline-none focus:border-burgundy-500 text-sm"
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-burgundy-600 text-beige-50 px-4 py-2 rounded text-sm font-medium hover:bg-burgundy-700 transition-colors disabled:opacity-60"
              >
                {saving ? "Guardando..." : editando ? "Actualizar" : "Crear categoría"}
              </button>
              {editando && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded text-sm border border-beige-300 text-burgundy-600 hover:bg-beige-100 transition-colors"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Lista */}
        <div>
          <h2 className="font-semibold text-burgundy-700 mb-4">
            Categorías existentes ({categorias.length})
          </h2>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-beige-100 rounded h-14 animate-pulse" />
              ))}
            </div>
          ) : categorias.length === 0 ? (
            <p className="text-burgundy-400 text-sm">No hay categorías todavía.</p>
          ) : (
            <div className="space-y-2">
              {categorias.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white border border-beige-200 rounded-lg px-4 py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-burgundy-800 text-sm">{cat.nombre}</p>
                    {cat.descripcion && (
                      <p className="text-burgundy-400 text-xs">{cat.descripcion}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(cat)}
                      className="text-xs text-burgundy-600 hover:text-burgundy-800 transition-colors px-2 py-1 border border-beige-300 rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.nombre)}
                      className="text-xs text-red-500 hover:text-red-700 transition-colors px-2 py-1 border border-red-200 rounded"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
