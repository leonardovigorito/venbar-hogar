import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const producto = await prisma.producto.findUnique({
    where: { id: Number(id) },
    include: { categoria: true },
  });
  if (!producto) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(producto);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await req.json();
  const producto = await prisma.producto.update({
    where: { id: Number(id) },
    data: {
      nombre: data.nombre,
      descripcion: data.descripcion ?? null,
      precio: Number(data.precio),
      imagenUrl: data.imagenUrl ?? null,
      disponible: Boolean(data.disponible),
      destacado: Boolean(data.destacado),
      categoriaId: Number(data.categoriaId),
    },
    include: { categoria: { select: { nombre: true } } },
  });
  return NextResponse.json(producto);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.producto.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
