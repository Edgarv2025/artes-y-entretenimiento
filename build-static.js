const fs = require('fs');
const path = require('path');
const { generateStructuredData, getCurrentSeasonConfig } = require('./server/services/seoService');

const root = __dirname;
const publicDir = path.join(root, 'public');
const files = [
  'admin.html',
  'datos.js',
  'index.html',
  'main.js',
  'marketing.html',
  'style.css',
  'dj-bogota.html',
  'sonido-eventos-bogota.html',
  'iluminacion-eventos-bogota.html',
  'dj-bodas-bogota.html',
  'eventos-empresariales-bogota.html'
];
const directories = ['assets', 'fotos', 'campanas', 'schema'];

function prepareSeoHtml(html) {
  const season = getCurrentSeasonConfig();
  const baseUrl = process.env.SEO_BASE_URL || 'https://artesyentretenimiento.com';
  const keywords = season.keywords.join(', ');
  const description = `Artes y Entretenimiento: ${season.primaryFocus} en Bogotá y Colombia. Sonido profesional, iluminación, pantallas LED y DJ para eventos. ${season.tone}.`;
  const structuredData = JSON.stringify(generateStructuredData(baseUrl), null, 2);

  return html
    .replace(/<title>[^<]*<\/title>/i, `<title>DJ, Sonido e Iluminación para Eventos en Bogotá | Artes & Entretenimiento</title>`)
    .replace(/<meta name="description" content="[^"]*">/i, `<meta name="description" content="${description}">`)
    .replace(/<meta name="keywords" content="[^"]*">/i, `<meta name="keywords" content="${keywords}">`)
    .replace(/<link rel="canonical" href="[^"]*">/i, `<link rel="canonical" href="${baseUrl}/">`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/i, `<script type="application/ld+json">\n    ${structuredData}\n    </script>`);
}

fs.rmSync(publicDir, { recursive: true, force: true });
fs.mkdirSync(publicDir, { recursive: true });

for (const file of files) {
  const sourcePath = path.join(root, file);
  const targetPath = path.join(publicDir, file);
  if (file === 'index.html') {
    fs.writeFileSync(targetPath, prepareSeoHtml(fs.readFileSync(sourcePath, 'utf8')), 'utf8');
  } else if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath);
  }
}

for (const directory of directories) {
  const sourceDirectory = path.join(root, directory);
  if (fs.existsSync(sourceDirectory)) {
    fs.cpSync(sourceDirectory, path.join(publicDir, directory), { recursive: true });
  }
}

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://artesyentretenimiento.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://artesyentretenimiento.com/dj-bogota</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://artesyentretenimiento.com/sonido-eventos-bogota</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://artesyentretenimiento.com/iluminacion-eventos-bogota</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://artesyentretenimiento.com/dj-bodas-bogota</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://artesyentretenimiento.com/eventos-empresariales-bogota</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
`;

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent, 'utf8');
fs.writeFileSync(path.join(publicDir, 'robots.txt'), 'User-agent: *\nAllow: /\nDisallow: /admin.html\nDisallow: /server/\nSitemap: https://artesyentretenimiento.com/sitemap.xml\n', 'utf8');
fs.writeFileSync(path.join(publicDir, 'manifest.json'), JSON.stringify({
  name: 'Artes & Entretenimiento',
  short_name: 'Artes & Entretenimiento',
  description: 'DJ, sonido e iluminación para eventos en Bogotá, Colombia.',
  start_url: '/',
  display: 'standalone',
  background_color: '#0f0f12',
  theme_color: '#d4af37',
  icons: [
    { src: '/fotos/hero.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
  ]
}, null, 2), 'utf8');

console.log(`Archivos estaticos preparados en ${publicDir}`);
