import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const categorias = await prisma.categoria.findMany({
    orderBy: { orden: "asc" },
  });
  return NextResponse.json(categorias);
}

export async function POST(req: NextRequest) {
  const { nombre, descripcion, orden } = await req.json();
  if (!nombre) {
    return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
  }
  const categoria = await prisma.categoria.create({
    data: { nombre, descripcion, orden: orden ?? 0 },
  });
  return NextResponse.json(categoria, { status: 201 });
}
