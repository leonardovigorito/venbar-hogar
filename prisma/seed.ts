import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const tursoUrl = process.env.TURSO_DATABASE_URL;
const adapter = tursoUrl
  ? new PrismaLibSql({ url: tursoUrl, authToken: process.env.TURSO_AUTH_TOKEN })
  : new PrismaLibSql({ url: `file:${path.join(process.cwd(), "prisma", "venbar.db")}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  const [lienzo, algodon, tapiceria, decoracion] = await Promise.all([
    prisma.categoria.upsert({
      where: { nombre: "Lienzo y Lino" },
      update: {},
      create: { nombre: "Lienzo y Lino", descripcion: "Telas naturales de lino y lienzo", orden: 1 },
    }),
    prisma.categoria.upsert({
      where: { nombre: "Algodón" },
      update: {},
      create: { nombre: "Algodón", descripcion: "Géneros de algodón en distintos gramajes", orden: 2 },
    }),
    prisma.categoria.upsert({
      where: { nombre: "Tapicería" },
      update: {},
      create: { nombre: "Tapicería", descripcion: "Telas resistentes para muebles y tapizado", orden: 3 },
    }),
    prisma.categoria.upsert({
      where: { nombre: "Decoración" },
      update: {},
      create: { nombre: "Decoración", descripcion: "Telas para cortinas, almohadones y más", orden: 4 },
    }),
  ]);

  const productosData = [
    { nombre: "Lienzo natural crudo", descripcion: "Alta resistencia, ideal para bolsas y decoración rústica", precio: 320, categoriaId: lienzo.id, destacado: true },
    { nombre: "Lino belga importado", descripcion: "Lino premium de origen belga, textura suave y elegante", precio: 890, categoriaId: lienzo.id, destacado: true },
    { nombre: "Género escocés cuadros", descripcion: "Clásico patrón escocés en colores bordo y verde", precio: 450, categoriaId: algodon.id, destacado: true },
    { nombre: "Piqué blanco", descripcion: "Algodón piqué ideal para prendas y tapices", precio: 280, categoriaId: algodon.id, destacado: false },
    { nombre: "Jacquard damascado", descripcion: "Diseño damascado para tapicería fina", precio: 780, categoriaId: tapiceria.id, destacado: true },
    { nombre: "Chenille lisa", descripcion: "Suave y resistente en colores neutros", precio: 620, categoriaId: tapiceria.id, destacado: false },
    { nombre: "Voile de algodón", descripcion: "Tela traslúcida liviana, perfecta para cortinas", precio: 210, categoriaId: decoracion.id, destacado: false },
    { nombre: "Tafetán beige", descripcion: "Tono beige marfil para ambientes elegantes", precio: 390, categoriaId: decoracion.id, destacado: false },
  ];

  for (const p of productosData) {
    await prisma.producto.upsert({
      where: { id: productosData.indexOf(p) + 1 },
      update: {},
      create: p,
    });
  }

  console.log("✓ Seed completado: 4 categorías, 8 productos");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
