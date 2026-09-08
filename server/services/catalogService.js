const fs = require('fs');
const path = require('path');

const datosFilePath = path.resolve(__dirname, '../../datos.js');

function getCatalogData() {
  try {
    const fileContent = fs.readFileSync(datosFilePath, 'utf8');
    
    // Ejecutar de forma segura en un contexto aislado para extraer las variables
    const sandbox = {};
    const fn = new Function('sandbox', `
      ${fileContent}
      sandbox.paquetesData = typeof paquetesData !== 'undefined' ? paquetesData : [];
      sandbox.artistasData = typeof artistasData !== 'undefined' ? artistasData : [];
      sandbox.testimoniosData = typeof testimoniosData !== 'undefined' ? testimoniosData : [];
    `);
    fn(sandbox);
    
    return {
      paquetes: sandbox.paquetesData,
      artistas: sandbox.artistasData,
      testimonios: sandbox.testimoniosData,
      marca: {
        nombre: 'Artes y Entretenimiento',
        slogan: 'Vive tu Experiencia. Nosotros ponemos la Magia.',
        telefono: '+57 320 245 90 32',
        whatsapp: '573202459032',
        ciudad: 'Bogotá, Colombia',
        direccion: 'Calle 16 h bis 112 a 14, Bogotá'
      }
    };
  } catch (err) {
    console.error('Error al leer datos.js:', err.message);
    return {
      paquetes: [],
      artistas: [],
      testimonios: [],
      marca: {
        nombre: 'Artes y Entretenimiento',
        telefono: '+57 320 245 90 32',
        whatsapp: '573202459032',
        ciudad: 'Bogotá, Colombia'
      }
    };
  }
}

module.exports = { getCatalogData };
