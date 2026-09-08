const { db } = require('../database');

function getAudiences() {
  const stmt = db.prepare('SELECT * FROM MarketingAudience ORDER BY id ASC');
  return stmt.all();
}

function getCampaigns() {
  const query = `
    SELECT 
      c.*,
      a.name as audience_name,
      a.key as audience_key,
      COUNT(DISTINCT ct.id) as total_contents,
      COUNT(DISTINCT p.id) as total_publications,
      COUNT(DISTINCT l.id) as total_leads
    FROM MarketingCampaign c
    LEFT JOIN MarketingAudience a ON c.audience_id = a.id
    LEFT JOIN MarketingContent ct ON c.id = ct.campaign_id
    LEFT JOIN MarketingPublication p ON ct.id = p.content_id
    LEFT JOIN Lead l ON c.id = l.campaign_id
    GROUP BY c.id
    ORDER BY c.id DESC
  `;
  return db.prepare(query).all();
}

function getCampaignById(id) {
  const camp = db.prepare(`
    SELECT c.*, a.name as audience_name, a.recommended_tone, a.sample_hooks
    FROM MarketingCampaign c
    LEFT JOIN MarketingAudience a ON c.audience_id = a.id
    WHERE c.id = ?
  `).get(id);

  if (!camp) return null;

  const contents = db.prepare(`
    SELECT ct.*, COUNT(p.id) as publications_count
    FROM MarketingContent ct
    LEFT JOIN MarketingPublication p ON ct.id = p.content_id
    WHERE ct.campaign_id = ?
    GROUP BY ct.id
    ORDER BY ct.id DESC
  `).all(id);

  const leads = db.prepare(`
    SELECT * FROM Lead WHERE campaign_id = ? ORDER BY id DESC
  `).all(id);

  return { ...camp, contents, leads };
}

function createCampaign({ name, objective, audience_id, start_date, end_date, budget, status, notes }) {
  const stmt = db.prepare(`
    INSERT INTO MarketingCampaign (name, objective, audience_id, start_date, end_date, budget, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    name,
    objective || 'Captación de Clientes',
    audience_id ? parseInt(audience_id) : null,
    start_date || new Date().toISOString().split('T')[0],
    end_date || null,
    budget ? parseFloat(budget) : 0,
    status || 'Activa',
    notes || ''
  );
  
  // En node:sqlite el último ID insertado se puede obtener con last_insert_rowid()
  const lastId = db.prepare('SELECT last_insert_rowid() as id').get().id;
  return getCampaignById(lastId);
}

function updateCampaign(id, data) {
  const existing = db.prepare('SELECT * FROM MarketingCampaign WHERE id = ?').get(id);
  if (!existing) return null;

  const name = data.name !== undefined ? data.name : existing.name;
  const objective = data.objective !== undefined ? data.objective : existing.objective;
  const audience_id = data.audience_id !== undefined ? (data.audience_id ? parseInt(data.audience_id) : null) : existing.audience_id;
  const start_date = data.start_date !== undefined ? data.start_date : existing.start_date;
  const end_date = data.end_date !== undefined ? data.end_date : existing.end_date;
  const budget = data.budget !== undefined ? parseFloat(data.budget) : existing.budget;
  const status = data.status !== undefined ? data.status : existing.status;
  const notes = data.notes !== undefined ? data.notes : existing.notes;

  db.prepare(`
    UPDATE MarketingCampaign
    SET name = ?, objective = ?, audience_id = ?, start_date = ?, end_date = ?, budget = ?, status = ?, notes = ?
    WHERE id = ?
  `).run(name, objective, audience_id, start_date, end_date, budget, status, notes, id);

  return getCampaignById(id);
}

function deleteCampaign(id) {
  const result = db.prepare('DELETE FROM MarketingCampaign WHERE id = ?').run(id);
  return { success: true, deletedId: id };
}

module.exports = {
  getAudiences,
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign
};
