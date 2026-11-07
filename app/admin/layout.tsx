"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/categorias", label: "Categorías" },
  { href: "/admin/productos", label: "Productos" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-beige-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-burgundy-800 text-beige-100 flex flex-col">
        <div className="p-5 border-b border-burgundy-700">
          <Link href="/admin" className="font-serif text-lg text-beige-100">
            Venbar Hogar
          </Link>
          <p className="text-xs text-beige-400 mt-0.5">Panel Admin</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`block px-3 py-2 rounded text-sm transition-colors ${
                pathname === href
                  ? "bg-burgundy-600 text-beige-50"
                  : "text-beige-300 hover:bg-burgundy-700"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-burgundy-700">
          <button
            onClick={handleLogout}
            className="w-full text-left text-sm text-beige-400 hover:text-beige-200 transition-colors"
          >
            Cerrar sesión →
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
