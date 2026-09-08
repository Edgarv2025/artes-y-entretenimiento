const { db } = require('../database');

function createContentAndPublication(data) {
  const {
    campaign_id,
    platform = 'Instagram',
    content_type = 'Post',
    audience_type = 'Todos',
    title,
    copy_text,
    cta,
    hashtags,
    target_url,
    generated_by_ai = 1,
    scheduled_date,
    scheduled_time = '18:00',
    media_id,
    status = 'Borrador',
    notes = ''
  } = data;

  const targetAccounts = db.prepare('SELECT * FROM SocialAccount ORDER BY id ASC').all();
  const accountsToPublish = targetAccounts.length > 0 ? targetAccounts : [{ platform }];

  const createdPublications = accountsToPublish.map((account) => {
    const accountPlatform = account && account.platform ? account.platform : platform;
    const accountNote = account && account.account_name ? `${notes} | Cuenta: ${account.account_name}` : notes;

    const insertContentStmt = db.prepare(`
      INSERT INTO MarketingContent (campaign_id, platform, content_type, audience_type, title, copy_text, cta, hashtags, target_url, generated_by_ai)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertContentStmt.run(
      campaign_id ? parseInt(campaign_id) : null,
      accountPlatform,
      content_type,
      audience_type,
      title || 'Sin Título',
      copy_text || '',
      cta || '',
      hashtags || '',
      target_url || '',
      generated_by_ai ? 1 : 0
    );

    const contentId = db.prepare('SELECT last_insert_rowid() as id').get().id;

    const insertPubStmt = db.prepare(`
      INSERT INTO MarketingPublication (content_id, media_id, platform, scheduled_date, scheduled_time, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const dateToSchedule = scheduled_date || new Date().toISOString().split('T')[0];

    insertPubStmt.run(
      contentId,
      media_id ? parseInt(media_id) : null,
      accountPlatform,
      dateToSchedule,
      scheduled_time,
      status,
      accountNote
    );

    const pubId = db.prepare('SELECT last_insert_rowid() as id').get().id;
    return getPublicationById(pubId);
  });

  return createdPublications.length === 1 ? createdPublications[0] : createdPublications;
}

function getPublications(filters = {}) {
  let query = `
    SELECT 
      p.*,
      ct.title,
      ct.copy_text,
      ct.cta,
      ct.hashtags,
      ct.target_url,
      ct.content_type,
      ct.campaign_id,
      c.name as campaign_name,
      m.file_path as media_file_path,
      m.title as media_title
    FROM MarketingPublication p
    JOIN MarketingContent ct ON p.content_id = ct.id
    LEFT JOIN MarketingCampaign c ON ct.campaign_id = c.id
    LEFT JOIN MarketingMedia m ON p.media_id = m.id
    WHERE 1=1
  `;

  const params = [];

  if (filters.status) {
    query += ' AND p.status = ?';
    params.push(filters.status);
  }

  if (filters.platform) {
    query += ' AND p.platform = ?';
    params.push(filters.platform);
  }

  if (filters.campaign_id) {
    query += ' AND ct.campaign_id = ?';
    params.push(parseInt(filters.campaign_id));
  }

  if (filters.startDate) {
    query += ' AND p.scheduled_date >= ?';
    params.push(filters.startDate);
  }

  if (filters.endDate) {
    query += ' AND p.scheduled_date <= ?';
    params.push(filters.endDate);
  }

  query += ' ORDER BY p.scheduled_date ASC, p.scheduled_time ASC';

  const stmt = db.prepare(query);
  return stmt.all(...params);
}

function getPublicationById(id) {
  const query = `
    SELECT 
      p.*,
      ct.title,
      ct.copy_text,
      ct.cta,
      ct.hashtags,
      ct.target_url,
      ct.content_type,
      ct.campaign_id,
      c.name as campaign_name,
      m.file_path as media_file_path,
      m.title as media_title
    FROM MarketingPublication p
    JOIN MarketingContent ct ON p.content_id = ct.id
    LEFT JOIN MarketingCampaign c ON ct.campaign_id = c.id
    LEFT JOIN MarketingMedia m ON p.media_id = m.id
    WHERE p.id = ?
  `;
  return db.prepare(query).get(id);
}

function updatePublicationStatus(id, newStatus, notes) {
  const validStatuses = ['Borrador', 'Pendiente de aprobación', 'Aprobado', 'Programado', 'Publicado', 'Error'];
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Estado inválido: ${newStatus}`);
  }

  let publishedAt = null;
  if (newStatus === 'Publicado') {
    publishedAt = new Date().toISOString();
  }

  db.prepare(`
    UPDATE MarketingPublication
    SET status = ?, notes = COALESCE(?, notes), published_at = COALESCE(?, published_at)
    WHERE id = ?
  `).run(newStatus, notes || null, publishedAt, id);

  return getPublicationById(id);
}

function updatePublicationDetails(id, data) {
  const existing = getPublicationById(id);
  if (!existing) return null;

  if (data.scheduled_date || data.scheduled_time || data.status || data.media_id !== undefined || data.notes !== undefined) {
    db.prepare(`
      UPDATE MarketingPublication
      SET 
        scheduled_date = COALESCE(?, scheduled_date),
        scheduled_time = COALESCE(?, scheduled_time),
        status = COALESCE(?, status),
        media_id = ?,
        notes = COALESCE(?, notes)
      WHERE id = ?
    `).run(
      data.scheduled_date || null,
      data.scheduled_time || null,
      data.status || null,
      data.media_id !== undefined ? (data.media_id ? parseInt(data.media_id) : null) : existing.media_id,
      data.notes || null,
      id
    );
  }

  if (data.title || data.copy_text || data.cta || data.hashtags) {
    db.prepare(`
      UPDATE MarketingContent
      SET
        title = COALESCE(?, title),
        copy_text = COALESCE(?, copy_text),
        cta = COALESCE(?, cta),
        hashtags = COALESCE(?, hashtags)
      WHERE id = ?
    `).run(
      data.title || null,
      data.copy_text || null,
      data.cta || null,
      data.hashtags || null,
      existing.content_id
    );
  }

  return getPublicationById(id);
}

function deletePublication(id) {
  const pub = db.prepare('SELECT content_id FROM MarketingPublication WHERE id = ?').get(id);
  if (pub) {
    db.prepare('DELETE FROM MarketingPublication WHERE id = ?').run(id);
    db.prepare('DELETE FROM MarketingContent WHERE id = ?').run(pub.content_id);
  }
  return { success: true, deletedId: id };
}

module.exports = {
  createContentAndPublication,
  getPublications,
  getPublicationById,
  updatePublicationStatus,
  updatePublicationDetails,
  deletePublication
};
