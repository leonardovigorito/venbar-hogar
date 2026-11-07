export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagenUrl?: string;
}

export function buildWhatsAppUrl(items: CartItem[]): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "59894214684";
  const lines = items.map(
    (item) =>
      `• ${item.nombre} x${item.cantidad} — $${(item.precio * item.cantidad).toFixed(2)}`
  );
  const total = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
  const message = [
    "Hola! Me gustaría hacer el siguiente pedido en *Venbar Hogar*:",
    "",
    ...lines,
    "",
    `*Total estimado: $${total.toFixed(2)}*`,
    "",
    "¿Podrían confirmar disponibilidad? Gracias!",
  ].join("\n");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
