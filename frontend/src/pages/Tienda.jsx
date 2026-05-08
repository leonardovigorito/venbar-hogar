import { useState, useEffect } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import CartSidebar from '../components/CartSidebar';

export default function Tienda() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('');
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [config, setConfig] = useState({});

  useEffect(() => {
    fetch('/api/config').then(r => r.json()).then(setConfig).catch(() => {});
  }, []);

  useEffect(() => {
    setCargando(true);
    const params = new URLSearchParams();
    if (busqueda) params.set('buscar', busqueda);
    if (categoria) params.set('categoria', categoria);
    fetch(`/api/productos?${params}`)
      .then(r => r.json())
      .then(data => { setProductos(data); setCargando(false); })
      .catch(() => setCargando(false));
  }, [busqueda, categoria]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onAbrirCarrito={() => setCarritoAbierto(true)} />

      {/* Hero — Logo real */}
      <section className="text-center" style={{ backgroundColor: '#EDD5B0' }}>
        <img
          src="/logo.png"
          alt="Venbar Hogar"
          className="w-full block"
          style={{ mixBlendMode: 'multiply', display: 'block' }}
        />
        <p className="text-venbar-red text-sm sm:text-base max-w-lg mx-auto pb-6 px-4 leading-relaxed font-light tracking-wide">
          Calidad, precio y atención ajustada para sus necesidades
        </p>
      </section>

      {/* Sobre Nosotros */}
      <section className="bg-venbar-cream px-4 sm:px-6 py-12">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          {/* Columna izquierda: título + features */}
          <div>
            <p className="text-venbar-red text-xs font-semibold tracking-widest uppercase mb-2">Quiénes somos</p>
            <h2 className="font-serif text-3xl font-bold text-venbar-red mb-6">Sobre Nosotros</h2>
            <div className="space-y-5">
              {/* Feature 1 */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-venbar-red flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-venbar-red">30 años de experiencia</p>
                  <p className="text-sm text-gray-600 mt-0.5">Décadas dedicadas a la importación y venta de telas de calidad.</p>
                </div>
              </div>
              {/* Feature 2 */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-venbar-red flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-venbar-red">Especialistas en cortinados</p>
                  <p className="text-sm text-gray-600 mt-0.5">Confección de artículos del hogar con los mejores materiales.</p>
                </div>
              </div>
              {/* Feature 3 */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-venbar-red flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-venbar-red">Asesoramiento personalizado</p>
                  <p className="text-sm text-gray-600 mt-0.5">Atención ajustada a las necesidades de cada cliente.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha: descripción */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border-l-4 border-venbar-red">
            <p className="font-serif text-xl text-venbar-red italic mb-4 leading-snug">
              "Somos una empresa que se dedica a la importación y venta de telas."
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              También brindamos asesoramiento textil y confección de los artículos más variados del hogar. Somos especialistas en cortinados.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Tenemos <strong className="text-venbar-red">calidad, precio y atención</strong> ajustada para sus necesidades. Más de tres décadas avalan nuestro compromiso con cada cliente.
            </p>
            <div className="mt-6 pt-5 border-t border-venbar-cream-dark flex items-center gap-3">
              <div className="h-1 w-8 bg-venbar-red rounded" />
              <span className="text-sm text-venbar-red font-semibold tracking-wide">Venbar Hogar — La Unión, Montevideo</span>
            </div>
          </div>
        </div>
      </section>

      {/* Buscador + filtros */}
      <SearchBar
        onBuscar={setBusqueda}
        onFiltrarCategoria={setCategoria}
        categoriaActiva={categoria}
      />

      {/* Catálogo */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {cargando ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-venbar-cream" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                  <div className="h-8 bg-gray-200 rounded mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : productos.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="font-medium">No se encontraron productos</p>
            <p className="text-sm mt-1">Probá con otra búsqueda o categoría</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {productos.length} {productos.length === 1 ? 'producto' : 'productos'}
              {categoria ? ` en "${categoria}"` : ''}
              {busqueda ? ` para "${busqueda}"` : ''}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {productos.map(p => (
                <ProductCard key={p.id} producto={p} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-venbar-red text-white mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid sm:grid-cols-3 gap-8 text-sm">
          {/* Col 1: Empresa */}
          <div>
            <h3 className="font-serif font-bold text-base mb-3 text-venbar-cream">Venbar Hogar</h3>
            <p className="text-white/80 leading-relaxed mb-3">
              30 años dedicados a la importación y venta de telas. Especialistas en cortinados y artículos del hogar.
            </p>
          </div>

          {/* Col 2: Horarios */}
          <div>
            <h3 className="font-serif font-bold text-base mb-3 text-venbar-cream">Horarios</h3>
            <p className="text-white/80">{config.horarios?.semana || 'Lunes a viernes: 9:00 a 18:00 hs'}</p>
            <p className="text-white/80 mb-4">{config.horarios?.sabado || 'Sábados: 9:30 a 13:30 hs'}</p>
            <h3 className="font-serif font-bold text-base mb-2 text-venbar-cream">Contacto</h3>
            <p className="text-white/80">WhatsApp: 094 214 684</p>
            <p className="text-white/80">{config.email || 'venbarhogar@hotmail.com'}</p>
          </div>

          {/* Col 3: Mapa */}
          <div>
            <h3 className="font-serif font-bold text-base mb-3 text-venbar-cream">Dónde estamos</h3>
            <p className="text-white/80 mb-3">{config.direccion || 'Avda. 8 de octubre 3572'}, La Unión</p>
            <div className="rounded-xl overflow-hidden shadow-md border-2 border-white/20">
              <iframe
                title="Ubicación Venbar Hogar"
                src="https://maps.google.com/maps?q=Avenida+8+de+octubre+3572+La+Union+Montevideo+Uruguay&output=embed&z=16"
                width="100%"
                height="180"
                style={{ border: 0, display: 'block' }}
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 text-center text-white/50 text-xs py-3">
          © {new Date().getFullYear()} Venbar Hogar — Todos los derechos reservados
        </div>
      </footer>

      <CartSidebar abierto={carritoAbierto} onCerrar={() => setCarritoAbierto(false)} />
    </div>
  );
}
