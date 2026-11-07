import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

async function getDestacados() {
  try {
    return await prisma.producto.findMany({
      where: { destacado: true, disponible: true },
      include: { categoria: true },
      take: 4,
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const destacados = await getDestacados();

  return (
    <>
      {/* Hero */}
      <section className="bg-beige-200 py-24 px-4 text-center">
        <p className="text-burgundy-500 text-sm font-medium uppercase tracking-widest mb-3">
          Tienda de Telas · Montevideo
        </p>
        <h1 className="font-serif text-5xl md:text-7xl text-burgundy-700 mb-6 leading-tight">
          Venbar Hogar
        </h1>
        <p className="text-burgundy-600 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
          Textiles y mercería de calidad para decoración, confección y tapicería.
          Encontrá todo lo que necesitás en un solo lugar.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/productos"
            className="bg-burgundy-600 text-beige-50 px-8 py-3 rounded text-sm font-medium hover:bg-burgundy-700 transition-colors"
          >
            Ver Productos
          </Link>
          <a
            href="#nosotros"
            className="border border-burgundy-600 text-burgundy-600 px-8 py-3 rounded text-sm font-medium hover:bg-beige-300 transition-colors"
          >
            Conocernos
          </a>
        </div>
      </section>

      {/* Destacados */}
      {destacados.length > 0 && (
        <section className="py-16 px-4 bg-cream">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif text-3xl text-burgundy-700 mb-2 text-center">
              Productos Destacados
            </h2>
            <p className="text-burgundy-500 text-center mb-10 text-sm">
              Nuestra selección especial
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {destacados.map((p) => (
                <ProductCard key={p.id} producto={p} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/productos"
                className="text-burgundy-600 border-b border-burgundy-400 pb-0.5 text-sm hover:text-burgundy-800 transition-colors"
              >
                Ver todos los productos →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Nosotros */}
      <section id="nosotros" className="py-16 px-4 bg-beige-100">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-burgundy-500 text-xs font-medium uppercase tracking-widest mb-2">
              Quiénes somos
            </p>
            <h2 className="font-serif text-3xl text-burgundy-700 mb-4">
              Nuestra Historia
            </h2>
            <p className="text-burgundy-700 leading-relaxed mb-4">
              Venbar Hogar es una tienda especializada en telas y textiles ubicada en el corazón de Montevideo.
              Ofrecemos una amplia variedad de géneros para decoración del hogar, confección de prendas y tapicería.
            </p>
            <p className="text-burgundy-700 leading-relaxed">
              Nos caracterizamos por la atención personalizada y la calidad de nuestros productos,
              acompañando a nuestros clientes en cada proyecto.
            </p>
          </div>
          <div className="relative rounded-lg overflow-hidden h-64 shadow-md border border-beige-300">
            <Image
              src="/telas-venbar.jpg"
              alt="Telas Venbar Hogar"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Ubicación */}
      <section className="py-16 px-4 bg-cream">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-burgundy-500 text-xs font-medium uppercase tracking-widest mb-2">
            Dónde encontrarnos
          </p>
          <h2 className="font-serif text-3xl text-burgundy-700 mb-4">
            Nuestra Sucursal Central
          </h2>
          <p className="text-burgundy-600 mb-8">
            📍 8 de octubre 3572, Montevideo
          </p>
          <div className="rounded-xl overflow-hidden shadow-md border border-beige-300">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3272.5843!2d-56.154!3d-34.893!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x959f8136c10a8f85%3A0xa7e4e1af02f8c2c!2s8+de+Octubre+3572%2C+Montevideo%2C+Uruguay!5e0!3m2!1ses!2suy!4v1700000000000"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Venbar Hogar"
            />
          </div>

          <div className="mt-12">
            <p className="text-burgundy-500 text-xs font-medium uppercase tracking-widest mb-4">
              Otras sucursales
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {["Las Piedras", "Rocha", "Paso de los Toros", "Pando", "Durazno", "Minas"].map((ciudad) => (
                <span
                  key={ciudad}
                  className="bg-beige-200 text-burgundy-700 px-4 py-2 rounded-full text-sm font-medium"
                >
                  📍 {ciudad}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <a
              href="https://wa.me/59894214684"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-burgundy-600 text-beige-50 px-6 py-3 rounded text-sm font-medium hover:bg-burgundy-700 transition-colors"
            >
              Escribinos por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
