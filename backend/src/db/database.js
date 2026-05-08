const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const adapter = new FileSync(path.join(__dirname, '../../tienda.json'));
const db = low(adapter);

const productos = [
  { nombre: 'Tul para Cortinas Blanco', precio: 180, descripcion: 'Tul liviano y elegante, ideal para cortinas de día. Deja pasar la luz suavemente.', imagen: null, categoria: 'Cortinas', stock: 80 },
  { nombre: 'Blackout Premium Crema', precio: 480, descripcion: 'Tela blackout de alta densidad que bloquea la luz. Ideal para dormitorios, excelente aislación térmica.', imagen: null, categoria: 'Cortinas', stock: 45 },
  { nombre: 'Voile Blanco Perlado', precio: 240, descripcion: 'Voile suave y translúcido con acabado perlado. Perfecto para ambientes elegantes.', imagen: null, categoria: 'Cortinas', stock: 60 },
  { nombre: 'Raso Satinado Burdó', precio: 390, descripcion: 'Tela satinada de raso con brillo elegante en tono burdó. Ideal para cortinas de lujo.', imagen: null, categoria: 'Decoración', stock: 30 },
  { nombre: 'Lino Natural Crudo', precio: 520, descripcion: 'Lino 100% natural con textura rústica y elegante. Excelente para cortinas estilo nórdico.', imagen: null, categoria: 'Confección', stock: 25 },
  { nombre: 'Terciopelo Burdó', precio: 680, descripcion: 'Terciopelo de alta calidad con acabado suave. Perfecto para tapicería y cortinas de invierno.', imagen: null, categoria: 'Tapicería', stock: 20 },
  { nombre: 'Oxford Beige', precio: 420, descripcion: 'Tela oxford resistente y versátil. Ideal para tapizado de sillas, sillones y artículos del hogar.', imagen: null, categoria: 'Tapicería', stock: 40 },
  { nombre: 'Brocado Dorado Floral', precio: 750, descripcion: 'Brocado con diseño floral en tonos dorados. Perfecto para cortinas de estilo clásico.', imagen: null, categoria: 'Decoración', stock: 15 },
  { nombre: 'Algodón Estampado Floral', precio: 290, descripcion: 'Algodón suave con estampado floral colorido. Ideal para manteles, almohadones y cortinas livianas.', imagen: null, categoria: 'Confección', stock: 55 },
  { nombre: 'Pana Azul Marino', precio: 380, descripcion: 'Pana de textura suave y cálida. Perfecta para tapicería de invierno y cojines.', imagen: null, categoria: 'Tapicería', stock: 35 },
];

db.defaults({ productos: [], nextId: 1, categorias: ['Cortinas', 'Decoración', 'Tapicería', 'Confección'] }).write();

if (db.get('productos').value().length === 0) {
  let id = 1;
  productos.forEach(p => {
    db.get('productos').push({ id: id++, ...p, createdAt: new Date().toISOString() }).write();
  });
  db.set('nextId', id).write();
  console.log(`✅ ${productos.length} productos de ejemplo cargados`);
}

module.exports = db;
