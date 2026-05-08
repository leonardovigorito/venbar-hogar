require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');

require('./db/database');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/productos', require('./routes/productos'));

app.get('/api/config', (req, res) => {
  res.json({
    nombre: process.env.STORE_NAME,
    whatsapp: process.env.WA_NUMBER,
    direccion: process.env.STORE_ADDRESS,
    email: process.env.STORE_EMAIL,
    horarios: {
      semana: process.env.STORE_HOURS_WEEKDAY,
      sabado: process.env.STORE_HOURS_SAT,
    },
  });
});

if (process.env.NODE_ENV === 'production') {
  const dist = path.join(__dirname, '../dist');
  app.use(express.static(dist));
  app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Venbar Hogar API corriendo en http://localhost:${PORT}`)
);
