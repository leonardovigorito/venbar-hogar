"use client";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";

export default function Navbar() {
  const totalItems = useCartStore((s) => s.totalItems());
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-beige-300 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-venbar.jpg"
            alt="Venbar Hogar"
            width={60}
            height={60}
            className="rounded-sm"
            priority
          />
          <span className="font-serif text-2xl font-bold text-burgundy-600 tracking-wide">
            Venbar Hogar
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-burgundy-700 hover:text-burgundy-500 transition-colors text-sm font-medium">
            Inicio
          </Link>
          <Link href="/productos" className="text-burgundy-700 hover:text-burgundy-500 transition-colors text-sm font-medium">
            Productos
          </Link>
          <Link href="/#nosotros" className="text-burgundy-700 hover:text-burgundy-500 transition-colors text-sm font-medium">
            Nosotros
          </Link>
          <Link href="/#contacto" className="text-burgundy-700 hover:text-burgundy-500 transition-colors text-sm font-medium">
            Contacto
          </Link>
          <Link
            href="/carrito"
            className="relative bg-burgundy-600 text-beige-50 px-4 py-2 rounded text-sm font-medium hover:bg-burgundy-700 transition-colors"
          >
            Carrito
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-beige-400 text-burgundy-800 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile: cart + burger */}
        <div className="flex items-center gap-3 md:hidden">
          <Link href="/carrito" className="relative text-burgundy-700">
            <span className="text-xl">🛒</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-burgundy-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-burgundy-700 p-1"
            aria-label="Menú"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span className="block h-0.5 bg-current" />
              <span className="block h-0.5 bg-current" />
              <span className="block h-0.5 bg-current" />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-t border-beige-300 px-4 pb-4 flex flex-col gap-3">
          {[
            { href: "/", label: "Inicio" },
            { href: "/productos", label: "Productos" },
            { href: "/#nosotros", label: "Nosotros" },
            { href: "/#contacto", label: "Contacto" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="text-burgundy-700 py-1 text-sm font-medium"
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
