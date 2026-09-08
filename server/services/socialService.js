const { db } = require('../database');

function getSocialAccounts() {
  const query = `
    SELECT 
      sa.*,
      COUNT(sm.id) as metrics_recorded,
      COALESCE(SUM(sm.impressions), 0) as total_impressions,
      COALESCE(SUM(sm.reach), 0) as total_reach,
      COALESCE(SUM(sm.engagements), 0) as total_engagements,
      COALESCE(SUM(sm.clicks), 0) as total_clicks
    FROM SocialAccount sa
    LEFT JOIN SocialMetric sm ON sa.id = sm.account_id
    GROUP BY sa.id
  `;
  return db.prepare(query).all();
}

function createSocialAccount(data = {}) {
  const platform = (data.platform || 'Instagram').trim();
  const account_name = (data.account_name || '').trim();

  if (!platform || !account_name) {
    throw new Error('Faltan los datos de la red social: plataforma y nombre de cuenta son obligatorios');
  }

  const stmt = db.prepare(`
    INSERT INTO SocialAccount (platform, account_name, status, followers, profile_url, last_sync)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    platform,
    account_name,
    data.status || 'Modo Manual',
    data.followers !== undefined ? parseInt(data.followers) || 0 : 0,
    data.profile_url || '',
    new Date().toISOString().split('T')[0]
  );

  const created = db.prepare('SELECT * FROM SocialAccount WHERE id = last_insert_rowid()').get();
  return created;
}

function updateSocialAccount(id, data) {
  db.prepare(`
    UPDATE SocialAccount
    SET 
      account_name = COALESCE(?, account_name),
      status = COALESCE(?, status),
      followers = COALESCE(?, followers),
      profile_url = COALESCE(?, profile_url),
      last_sync = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    data.account_name || null,
    data.status || null,
    data.followers !== undefined ? parseInt(data.followers) : null,
    data.profile_url || null,
    id
  );

  return db.prepare('SELECT * FROM SocialAccount WHERE id = ?').get(id);
}

function recordManualMetric({ account_id, date, impressions, reach, engagements, clicks }) {
  const stmt = db.prepare(`
    INSERT INTO SocialMetric (account_id, date, impressions, reach, engagements, clicks, is_manual)
    VALUES (?, ?, ?, ?, ?, ?, 1)
  `);

  stmt.run(
    parseInt(account_id),
    date || new Date().toISOString().split('T')[0],
    impressions ? parseInt(impressions) : 0,
    reach ? parseInt(reach) : 0,
    engagements ? parseInt(engagements) : 0,
    clicks ? parseInt(clicks) : 0
  );

  return { success: true };
}

function formatContentForClipboard(content) {
  // Genera el texto listo para pegar según la red social
  let output = '';
  if (content.platform === 'Instagram') {
    output = `${content.title ? content.title + '\n\n' : ''}${content.copy_text}\n\n${content.cta ? content.cta + '\n\n' : ''}${content.hashtags || ''}`;
  } else if (content.platform === 'TikTok') {
    output = `${content.title ? content.title + '\n\n' : ''}${content.copy_text}\n\n${content.hashtags || ''}`;
  } else {
    // Facebook
    output = `${content.title ? content.title + '\n\n' : ''}${content.copy_text}\n\n${content.cta ? content.cta + '\n\n' : ''}${content.target_url ? '👉 Enlace: ' + content.target_url + '\n\n' : ''}${content.hashtags || ''}`;
  }

  return {
    raw_text: output.trim(),
    platform: content.platform,
    target_url: content.target_url,
    media_file: content.media_file_path || null
  };
}

module.exports = {
  getSocialAccounts,
  createSocialAccount,
  updateSocialAccount,
  recordManualMetric,
  formatContentForClipboard
};
