import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-burgundy-800 text-beige-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-beige-50 rounded-xl p-1.5 shadow-sm shrink-0">
              <Image
                src="/logo-venbar.jpg"
                alt="Venbar Hogar"
                width={56}
                height={56}
                className="rounded-lg block"
              />
            </div>
            <h3 className="font-serif text-xl text-beige-100">Venbar Hogar</h3>
          </div>
          <p className="text-sm text-beige-300 leading-relaxed">
            Textiles y mercería de calidad para tus proyectos de decoración y confección.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-beige-100 mb-3 text-sm uppercase tracking-wider">Navegación</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="text-beige-300 hover:text-beige-100 transition-colors">Inicio</Link></li>
            <li><Link href="/productos" className="text-beige-300 hover:text-beige-100 transition-colors">Productos</Link></li>
            <li><Link href="/carrito" className="text-beige-300 hover:text-beige-100 transition-colors">Carrito</Link></li>
          </ul>
        </div>

        <div id="contacto">
          <h4 className="font-semibold text-beige-100 mb-3 text-sm uppercase tracking-wider">Contacto</h4>
          <ul className="space-y-2 text-sm text-beige-300">
            <li>📍 8 de octubre 3572, Montevideo</li>
            <li>
              <a
                href="https://wa.me/59894214684"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-beige-100 transition-colors"
              >
                📱 094 214 684
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-burgundy-700 py-4 text-center text-xs text-beige-400">
        © {new Date().getFullYear()} Venbar Hogar — Todos los derechos reservados
      </div>
    </footer>
  );
}
