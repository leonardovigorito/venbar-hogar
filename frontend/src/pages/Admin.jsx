import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLogin from '../components/AdminLogin';
import ProductForm from '../components/ProductForm';
import ProductTable from '../components/ProductTable';

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem('venbar_admin_token') || '');
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [confirmarEliminar, setConfirmarEliminar] = useState(null);
  const [confirmarEliminarCat, setConfirmarEliminarCat] = useState(null);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [errorCat, setErrorCat] = useState('');
  const [categoriaSel, setCategoriaSel] = useState('');

  const cargarProductos = async () => {
    setCargando(true);
    try {
      const params = categoriaSel ? `?categoria=${encodeURIComponent(categoriaSel)}` : '';
      const res = await fetch(`/api/productos${params}`);
      setProductos(await res.json());
    } catch { /* silencioso */ }
    finally { setCargando(false); }
  };

  const cargarCategorias = async () => {
    try {
      const res = await fetch('/api/categorias');
      setCategorias(await res.json());
    } catch { /* silencioso */ }
  };

  useEffect(() => {
    if (token) { cargarProductos(); cargarCategorias(); }
  }, [token]);

  useEffect(() => {
    if (token) cargarProductos();
  }, [categoriaSel]);

  const handleLogin = (t) => setToken(t);

  const handleLogout = () => {
    localStorage.removeItem('venbar_admin_token');
    setToken('');
  };

  const handleGuardado = () => {
    setMostrarForm(false);
    setEditando(null);
    cargarProductos();
  };

  const handleEditar = (p) => {
    setEditando(p);
    setMostrarForm(true);
  };

  const handleEliminarProducto = async () => {
    if (!confirmarEliminar) return;
    try {
      await fetch(`/api/productos/${confirmarEliminar.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setConfirmarEliminar(null);
      cargarProductos();
    } catch { /* silencioso */ }
  };

  const handleAgregarCategoria = async (e) => {
    e.preventDefault();
    setErrorCat('');
    const nombre = nuevaCategoria.trim();
    if (!nombre) return;
    try {
      const res = await fetch('/api/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nombre }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorCat(data.error); return; }
      setCategorias(data);
      setNuevaCategoria('');
    } catch { setErrorCat('Error al agregar'); }
  };

  const handleEliminarCategoria = async () => {
    if (!confirmarEliminarCat) return;
    try {
      const res = await fetch(`/api/categorias/${encodeURIComponent(confirmarEliminarCat)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setCategorias(data);
        if (categoriaSel === confirmarEliminarCat) setCategoriaSel('');
      }
      setConfirmarEliminarCat(null);
    } catch { /* silencioso */ }
  };

  const productosDeCat = (cat) => productos.filter(p => p.categoria === cat).length;

  if (!token) return <AdminLogin onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-venbar-cream">
      {/* Header */}
      <header className="bg-venbar-red text-white px-4 sm:px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-venbar-cream hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="font-serif text-xl font-bold">Panel Admin — Venbar Hogar</h1>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-venbar-cream hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Salir
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total productos</p>
            <p className="text-3xl font-bold text-venbar-red font-serif mt-1">{productos.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Con stock</p>
            <p className="text-3xl font-bold text-green-600 font-serif mt-1">{productos.filter(p => p.stock > 0).length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm col-span-2 sm:col-span-1">
            <p className="text-sm text-gray-500">Categorías</p>
            <p className="text-3xl font-bold text-venbar-red font-serif mt-1">{categorias.length}</p>
          </div>
        </div>

        {/* ── Gestión de categorías ── */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-serif text-lg font-semibold text-gray-800 mb-4">Categorías</h2>

          {/* Lista de categorías */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categorias.map(cat => (
              <div
                key={cat}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer ${
                  categoriaSel === cat
                    ? 'bg-venbar-red text-white border-venbar-red'
                    : 'bg-venbar-cream text-venbar-red border-venbar-cream-dark hover:border-venbar-red'
                }`}
                onClick={() => setCategoriaSel(categoriaSel === cat ? '' : cat)}
              >
                {cat}
                <span className="opacity-60 text-xs">({productosDeCat(cat)})</span>
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmarEliminarCat(cat); }}
                  className="ml-1 hover:opacity-80 transition-opacity"
                  title={`Eliminar categoría ${cat}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            {categorias.length === 0 && (
              <p className="text-sm text-gray-400">No hay categorías. Agregá una abajo.</p>
            )}
          </div>

          {/* Formulario agregar categoría */}
          <form onSubmit={handleAgregarCategoria} className="flex gap-2 items-start">
            <div className="flex-1">
              <input
                type="text"
                value={nuevaCategoria}
                onChange={e => { setNuevaCategoria(e.target.value); setErrorCat(''); }}
                placeholder="Nueva categoría (ej: Terciopelos)"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-venbar-red"
              />
              {errorCat && <p className="text-red-500 text-xs mt-1">{errorCat}</p>}
            </div>
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-venbar-red hover:bg-venbar-red-hover text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Agregar
            </button>
          </form>
        </div>

        {/* ── Catálogo de productos ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-serif text-xl font-semibold text-gray-800">
                {categoriaSel ? `Productos — ${categoriaSel}` : 'Todos los productos'}
              </h2>
              {categoriaSel && (
                <button onClick={() => setCategoriaSel('')} className="text-xs text-venbar-red hover:underline mt-0.5">
                  Ver todos
                </button>
              )}
            </div>
            <button
              onClick={() => { setEditando(null); setMostrarForm(true); }}
              className="flex items-center gap-2 bg-venbar-red hover:bg-venbar-red-hover text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Agregar producto
            </button>
          </div>

          {cargando ? (
            <div className="text-center py-12 text-gray-400">Cargando...</div>
          ) : (
            <ProductTable
              productos={productos}
              onEditar={handleEditar}
              onEliminar={setConfirmarEliminar}
            />
          )}
        </div>
      </main>

      {/* Modal producto */}
      {mostrarForm && (
        <ProductForm
          producto={editando}
          token={token}
          categorias={categorias}
          onGuardado={handleGuardado}
          onCancelar={() => { setMostrarForm(false); setEditando(null); }}
        />
      )}

      {/* Modal confirmar eliminar producto */}
      {confirmarEliminar && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="font-serif text-lg font-bold text-gray-800 mb-1">Eliminar producto</h3>
            <p className="text-gray-500 text-sm mb-6">
              ¿Eliminar <strong>"{confirmarEliminar.nombre}"</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmarEliminar(null)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50">Cancelar</button>
              <button onClick={handleEliminarProducto} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmar eliminar categoría */}
      {confirmarEliminarCat && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h3 className="font-serif text-lg font-bold text-gray-800 mb-1">Eliminar categoría</h3>
            <p className="text-gray-500 text-sm mb-2">
              ¿Eliminar la categoría <strong>"{confirmarEliminarCat}"</strong>?
            </p>
            {productosDeCat(confirmarEliminarCat) > 0 && (
              <p className="text-orange-600 text-xs bg-orange-50 rounded-lg px-3 py-2 mb-4">
                {productosDeCat(confirmarEliminarCat)} producto(s) tienen esta categoría. Los productos no se eliminan, solo dejan de estar en esta categoría.
              </p>
            )}
            <div className="flex gap-3">
              <button onClick={() => setConfirmarEliminarCat(null)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50">Cancelar</button>
              <button onClick={handleEliminarCategoria} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
