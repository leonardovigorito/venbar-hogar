const router = require('express').Router();
const db = require('../db/database');
const auth = require('../middleware/auth');

// GET todas las categorías (público)
router.get('/', (req, res) => {
  res.json(db.get('categorias').value());
});

// POST agregar categoría (admin)
router.post('/', auth, (req, res) => {
  const nombre = (req.body.nombre || '').trim();
  if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' });

  const existe = db.get('categorias').value().includes(nombre);
  if (existe) return res.status(409).json({ error: 'La categoría ya existe' });

  db.get('categorias').push(nombre).write();
  res.status(201).json(db.get('categorias').value());
});

// DELETE eliminar categoría (admin)
router.delete('/:nombre', auth, (req, res) => {
  const nombre = decodeURIComponent(req.params.nombre);
  const existe = db.get('categorias').value().includes(nombre);
  if (!existe) return res.status(404).json({ error: 'Categoría no encontrada' });

  db.get('categorias').pull(nombre).write();
  res.json(db.get('categorias').value());
});

module.exports = router;
