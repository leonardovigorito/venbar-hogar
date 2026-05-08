function fmt(n) {
  return Number(n).toLocaleString('es-UY', { maximumFractionDigits: 0 });
}

export default function ProductTable({ productos, onEditar, onEliminar }) {
  if (!productos.length) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-sm">No hay productos cargados aún</p>
        <p className="text-xs mt-1">Usá el botón "Agregar producto" para comenzar</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-venbar-cream text-venbar-red">
          <tr>
            <th className="text-left px-4 py-3 font-semibold">Producto</th>
            <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Categoría</th>
            <th className="text-right px-4 py-3 font-semibold">Precio/m</th>
            <th className="text-right px-4 py-3 font-semibold hidden sm:table-cell">Stock</th>
            <th className="text-right px-4 py-3 font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {productos.map((p, i) => (
            <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-venbar-cream/60'}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-venbar-cream flex-shrink-0">
                    {p.imagen ? (
                      <img src={p.imagen} alt={p.nombre} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-venbar-red opacity-40">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <span className="font-medium text-gray-800 line-clamp-1">{p.nombre}</span>
                </div>
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                <span className="inline-block bg-venbar-cream text-venbar-red text-xs px-2 py-0.5 rounded-full">
                  {p.categoria || '—'}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-semibold text-venbar-red">${fmt(p.precio)}</td>
              <td className="px-4 py-3 text-right text-gray-500 hidden sm:table-cell">{p.stock}m</td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEditar(p)}
                    className="text-xs px-3 py-1.5 border border-venbar-red text-venbar-red rounded-lg hover:bg-venbar-cream transition-colors font-medium"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onEliminar(p)}
                    className="text-xs px-3 py-1.5 border border-red-300 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium"
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
  );
}
