require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Inicializar base de datos
require('./database');

const marketingRoutes = require('./routes/marketingRoutes');
const { generateSitemapXml, generateRobotsTxt, runAutonomousSeoCycle } = require('./services/seoService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Rutas SEO Dinámicas para Google Search Console ---
app.get('/sitemap.xml', (req, res) => {
  const host = req.get('host');
  const protocol = req.protocol || 'http';
  const baseUrl = `${protocol}://${host}`;
  res.header('Content-Type', 'application/xml');
  res.send(generateSitemapXml(baseUrl));
});

app.get('/robots.txt', (req, res) => {
  const host = req.get('host');
  const protocol = req.protocol || 'http';
  const baseUrl = `${protocol}://${host}`;
  res.header('Content-Type', 'text/plain');
  res.send(generateRobotsTxt(baseUrl));
});

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
  // Ejecutar el primer ciclo del algoritmo SEO continuo al iniciar
  const seoStatus = runAutonomousSeoCycle();
  
  // Programar optimización continua cada 24 horas (86,400,000 ms)
  setInterval(() => {
    try {
      runAutonomousSeoCycle();
    } catch (e) {
      console.error('[SEO Engine] Error en ciclo continuo:', e.message);
    }
  }, 86400000);

  console.log('====================================================');
  console.log(' ✨ ARTES & ENTRETENIMIENTO - PLATAFORMA INTEGRAL');
  console.log(` 🌐 Sitio Web Público:       http://localhost:${PORT}/`);
  console.log(` 🛠️ Panel Administrativo:   http://localhost:${PORT}/admin.html`);
  console.log(` 🚀 Marketing Inteligente:   http://localhost:${PORT}/marketing.html`);
  console.log(` 🔍 Sitemap Google (SEO):    http://localhost:${PORT}/sitemap.xml`);
  console.log(` 🤖 Robots.txt (SEO):        http://localhost:${PORT}/robots.txt`);
  console.log(` 📈 Salud SEO Actual:        ${seoStatus.score}/100 (${seoStatus.currentSeason})`);
  console.log('====================================================');
});
