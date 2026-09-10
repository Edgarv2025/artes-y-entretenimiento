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
  'style.css'
];
const directories = ['assets', 'fotos', 'campanas'];

function prepareSeoHtml(html) {
  const season = getCurrentSeasonConfig();
  const baseUrl = process.env.SEO_BASE_URL || 'https://artesyentretenimiento.com';
  const keywords = season.keywords.join(', ');
  const description = `Artes y Entretenimiento: ${season.primaryFocus} en Bogota y Colombia. Sonido profesional, iluminacion, pantallas LED y DJ para eventos. ${season.tone}.`;
  const structuredData = JSON.stringify(generateStructuredData(baseUrl), null, 2);

  return html
    .replace(/<title>[^<]*<\/title>/i, `<title>Artes y Entretenimiento | ${season.primaryFocus} en Bogota</title>`)
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
  } else {
    fs.copyFileSync(sourcePath, targetPath);
  }
}

for (const directory of directories) {
  fs.cpSync(path.join(root, directory), path.join(publicDir, directory), { recursive: true });
}

console.log(`Archivos estaticos preparados en ${publicDir}`);
