require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Inicializar base de datos
require('./database');

const marketingRoutes = require('./routes/marketingRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Montar API de Marketing Inteligente y CRM
app.use('/api/marketing', marketingRoutes);

// El servidor vive dentro de la raíz del proyecto.
const publicPath = path.resolve(__dirname, '..');
app.use(express.static(publicPath));

// Fallback a index.html para rutas no encontradas
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log('====================================================');
  console.log(' ✨ ARTES & ENTRETENIMIENTO - PLATAFORMA INTEGRAL');
  console.log(` 🌐 Sitio Web Público:       http://localhost:${PORT}/`);
  console.log(` 🛠️ Panel Administrativo:   http://localhost:${PORT}/admin.html`);
  console.log(` 🚀 Marketing Inteligente:   http://localhost:${PORT}/marketing.html`);
  console.log(` 📡 API Backend:             http://localhost:${PORT}/api/marketing/analytics`);
  console.log('====================================================');
});
