import { useState, useEffect } from 'react';

const VACIO = { nombre: '', precio: '', descripcion: '', categoria: '', stock: '', imagen: null };

export default function ProductForm({ producto, onGuardado, onCancelar, token, categorias = [] }) {
  const [form, setForm] = useState(VACIO);
  const [preview, setPreview] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const editando = Boolean(producto);

  useEffect(() => {
    if (producto) {
      setForm({
        nombre: producto.nombre || '',
        precio: producto.precio || '',
        descripcion: producto.descripcion || '',
        categoria: producto.categoria || categorias[0] || '',
        stock: producto.stock || '',
        imagen: null,
      });
      setPreview(producto.imagen || null);
    } else {
      setForm(p => ({ ...VACIO, categoria: categorias[0] || '' }));
      setPreview(null);
    }
  }, [producto, categorias]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(p => ({ ...p, imagen: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');
    const fd = new FormData();
    fd.append('nombre', form.nombre);
    fd.append('precio', form.precio);
    fd.append('descripcion', form.descripcion);
    fd.append('categoria', form.categoria);
    fd.append('stock', form.stock);
    if (form.imagen) fd.append('imagen', form.imagen);

    const url = editando ? `/api/productos/${producto.id}` : '/api/productos';
    const method = editando ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar');
      onGuardado(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-venbar-red text-white rounded-t-2xl">
          <h2 className="font-serif text-lg font-semibold">{editando ? 'Editar producto' : 'Agregar producto'}</h2>
          <button onClick={onCancelar} className="text-2xl leading-none hover:opacity-80">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Imagen</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-venbar-cream flex items-center justify-center flex-shrink-0">
                {preview ? (
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-venbar-red opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleFile} className="text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-venbar-cream file:text-venbar-red hover:file:bg-venbar-cream-dark" />
            </div>
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input type="text" required value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-venbar-red" />
          </div>

          {/* Precio y Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio (UYU/metro) *</label>
              <input type="number" required min="0" step="0.01" value={form.precio} onChange={e => setForm(p => ({ ...p, precio: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-venbar-red" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock (metros)</label>
              <input type="number" min="0" step="0.5" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-venbar-red" />
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select value={form.categoria} onChange={e => setForm(p => ({ ...p, categoria: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-venbar-red">
              {categorias.length === 0 && <option value="">Sin categorías — agregá una desde el panel</option>}
              {categorias.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea rows={3} value={form.descripcion} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-venbar-red resize-none" />
          </div>

          {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancelar} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Cancelar</button>
            <button type="submit" disabled={cargando} className="flex-1 bg-venbar-red hover:bg-venbar-red-hover text-white py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60">
              {cargando ? 'Guardando...' : editando ? 'Actualizar' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
