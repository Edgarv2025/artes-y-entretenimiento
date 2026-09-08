const fs = require('fs');
const path = require('path');
const { db } = require('../database');

const publicDir = path.resolve(__dirname, '../..');

function syncMediaFiles() {
  const assetsDir = path.join(publicDir, 'assets');
  const fotosDir = path.join(publicDir, 'fotos');

  const filesFound = [];

  function scanDir(dir, prefix = '') {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.join(prefix, entry.name).replace(/\\/g, '/');
      if (entry.isDirectory()) {
        scanDir(fullPath, relPath);
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp4'].includes(ext)) {
          filesFound.push({
            file_path: relPath,
            name: entry.name,
            ext
          });
        }
      }
    }
  }

  scanDir(assetsDir, 'assets');
  scanDir(fotosDir, 'fotos');

  const insertStmt = db.prepare(`
    INSERT OR IGNORE INTO MarketingMedia (file_path, title, media_type, service_tag, artist_tag, audience_tag)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const f of filesFound) {
    let serviceTag = 'General';
    let artistTag = 'ambos';
    let audienceTag = 'Todos';
    let title = f.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

    if (f.file_path.includes('boda')) {
      serviceTag = 'Bodas';
      artistTag = 'djcool';
      audienceTag = 'end_clients_wedding';
    } else if (f.file_path.includes('corp')) {
      serviceTag = 'Corporativo';
      artistTag = 'djice';
      audienceTag = 'corporate';
    } else if (f.file_path.includes('bar')) {
      serviceTag = 'Bares';
      artistTag = 'djcool';
      audienceTag = 'btl_agencies';
    } else if (f.file_path.includes('plan')) {
      serviceTag = 'Planes';
      artistTag = 'ninguno';
      audienceTag = 'Todos';
    } else if (f.file_path.includes('djcool')) {
      artistTag = 'djcool';
    } else if (f.file_path.includes('djice')) {
      artistTag = 'djice';
    }

    const mediaType = f.ext === '.mp4' ? 'video' : 'image';

    insertStmt.run(f.file_path, title, mediaType, serviceTag, artistTag, audienceTag);
  }

  return getMediaItems();
}

function getMediaItems(filters = {}) {
  let query = 'SELECT * FROM MarketingMedia WHERE 1=1';
  const params = [];

  if (filters.service_tag && filters.service_tag !== 'Todos') {
    query += ' AND service_tag = ?';
    params.push(filters.service_tag);
  }

  if (filters.artist_tag && filters.artist_tag !== 'Todos') {
    query += ' AND artist_tag = ?';
    params.push(filters.artist_tag);
  }

  if (filters.audience_tag && filters.audience_tag !== 'Todos') {
    query += ' AND audience_tag = ?';
    params.push(filters.audience_tag);
  }

  query += ' ORDER BY id DESC';

  return db.prepare(query).all(...params);
}

function updateMediaItem(id, data) {
  db.prepare(`
    UPDATE MarketingMedia
    SET 
      title = COALESCE(?, title),
      service_tag = COALESCE(?, service_tag),
      artist_tag = COALESCE(?, artist_tag),
      audience_tag = COALESCE(?, audience_tag)
    WHERE id = ?
  `).run(
    data.title || null,
    data.service_tag || null,
    data.artist_tag || null,
    data.audience_tag || null,
    id
  );

  return db.prepare('SELECT * FROM MarketingMedia WHERE id = ?').get(id);
}

module.exports = {
  syncMediaFiles,
  getMediaItems,
  updateMediaItem
};
