const fs = require('fs');
const path = require('path');

const root = __dirname;
const publicDir = path.join(root, 'public');
const files = [
  'admin.html',
  'datos.js',
  'gallery.json',
  'index.html',
  'main.js',
  'marketing.html',
  'paquetes.js',
  'style.css'
];
const directories = ['assets', 'fotos'];

fs.rmSync(publicDir, { recursive: true, force: true });
fs.mkdirSync(publicDir, { recursive: true });

for (const file of files) {
  fs.copyFileSync(path.join(root, file), path.join(publicDir, file));
}

for (const directory of directories) {
  fs.cpSync(path.join(root, directory), path.join(publicDir, directory), { recursive: true });
}

console.log(`Archivos estaticos preparados en ${publicDir}`);
