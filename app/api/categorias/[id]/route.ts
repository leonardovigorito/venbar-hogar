import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cat = await prisma.categoria.findUnique({ where: { id: Number(id) } });
  if (!cat) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  return NextResponse.json(cat);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await req.json();
  const cat = await prisma.categoria.update({
    where: { id: Number(id) },
    data: { nombre: data.nombre, descripcion: data.descripcion, orden: data.orden },
  });
  return NextResponse.json(cat);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const count = await prisma.producto.count({ where: { categoriaId: Number(id) } });
  if (count > 0) {
    return NextResponse.json(
      { error: "La categoría tiene productos asociados. Eliminá los productos primero." },
      { status: 400 }
    );
  }
  await prisma.categoria.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
