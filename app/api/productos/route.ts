import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoriaId = searchParams.get("categoriaId");
  const destacado = searchParams.get("destacado");

  const showAll = searchParams.get("disponible") === "all";
  const where: Record<string, unknown> = showAll ? {} : { disponible: true };
  if (categoriaId) where.categoriaId = Number(categoriaId);
  if (destacado === "true") where.destacado = true;

  const productos = await prisma.producto.findMany({
    where,
    include: { categoria: { select: { nombre: true } } },
    orderBy: { creadoEn: "desc" },
  });
  return NextResponse.json(productos);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  if (!data.nombre || !data.precio || !data.categoriaId) {
    return NextResponse.json({ error: "Campos requeridos: nombre, precio, categoriaId" }, { status: 400 });
  }
  const producto = await prisma.producto.create({
    data: {
      nombre: data.nombre,
      descripcion: data.descripcion ?? null,
      precio: Number(data.precio),
      imagenUrl: data.imagenUrl ?? null,
      disponible: data.disponible ?? true,
      destacado: data.destacado ?? false,
      categoriaId: Number(data.categoriaId),
    },
    include: { categoria: { select: { nombre: true } } },
  });
  return NextResponse.json(producto, { status: 201 });
}
