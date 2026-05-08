require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const router = require('express').Router();

router.post('/login', (req, res) => {
  const { usuario, password } = req.body;
  if (usuario === process.env.ADMIN_USER && password === process.env.ADMIN_PASSWORD) {
    return res.json({ token: process.env.ADMIN_TOKEN });
  }
  return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
});

module.exports = router;
