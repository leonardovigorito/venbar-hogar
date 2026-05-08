const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const db = require('../db/database');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', (req, res) => {
  const { buscar, categoria } = req.query;
  let lista = db.get('productos').value();
  if (buscar) {
    const q = buscar.toLowerCase();
    lista = lista.filter(p =>
      p.nombre.toLowerCase().includes(q) || (p.descripcion || '').toLowerCase().includes(q)
    );
  }
  if (categoria) {
    lista = lista.filter(p => p.categoria === categoria);
  }
  res.json(lista.slice().reverse());
});

router.get('/:id', (req, res) => {
  const p = db.get('productos').find({ id: Number(req.params.id) }).value();
  if (!p) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(p);
});

router.post('/', auth, upload.single('imagen'), (req, res) => {
  const { nombre, precio, descripcion, categoria, stock } = req.body;
  const imagen = req.file ? `/uploads/${req.file.filename}` : null;
  const id = db.get('nextId').value();
  const nuevo = { id, nombre, precio: parseFloat(precio) || 0, descripcion: descripcion || '', imagen, categoria: categoria || '', stock: parseFloat(stock) || 0, createdAt: new Date().toISOString() };
  db.get('productos').push(nuevo).write();
  db.update('nextId', n => n + 1).write();
  res.status(201).json(nuevo);
});

router.put('/:id', auth, upload.single('imagen'), (req, res) => {
  const id = Number(req.params.id);
  const existing = db.get('productos').find({ id }).value();
  if (!existing) return res.status(404).json({ error: 'Producto no encontrado' });
  const { nombre, precio, descripcion, categoria, stock } = req.body;
  const imagen = req.file ? `/uploads/${req.file.filename}` : existing.imagen;
  db.get('productos').find({ id }).assign({ nombre, precio: parseFloat(precio) || 0, descripcion: descripcion || '', imagen, categoria: categoria || '', stock: parseFloat(stock) || 0 }).write();
  res.json(db.get('productos').find({ id }).value());
});

router.delete('/:id', auth, (req, res) => {
  const id = Number(req.params.id);
  const existing = db.get('productos').find({ id }).value();
  if (!existing) return res.status(404).json({ error: 'Producto no encontrado' });
  db.get('productos').remove({ id }).write();
  res.json({ ok: true });
});

module.exports = router;
