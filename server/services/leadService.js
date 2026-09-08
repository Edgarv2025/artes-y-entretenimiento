const { db } = require('../database');
const { getCatalogData } = require('./catalogService');

const VALID_STATUSES = ['Nuevo', 'Contactado', 'Cotización enviada', 'En negociación', 'Reservado', 'Perdido'];

function getLeads(filters = {}) {
  let query = `
    SELECT 
      l.*,
      c.name as campaign_name,
      COUNT(a.id) as activities_count
    FROM Lead l
    LEFT JOIN MarketingCampaign c ON l.campaign_id = c.id
    LEFT JOIN LeadActivity a ON l.id = a.lead_id
    WHERE 1=1
  `;

  const params = [];

  if (filters.status) {
    query += ' AND l.status = ?';
    params.push(filters.status);
  }

  if (filters.client_type) {
    query += ' AND l.client_type = ?';
    params.push(filters.client_type);
  }

  if (filters.campaign_id) {
    query += ' AND l.campaign_id = ?';
    params.push(parseInt(filters.campaign_id));
  }

  if (filters.search) {
    query += ' AND (l.name LIKE ? OR l.company LIKE ? OR l.phone LIKE ? OR l.email LIKE ?)';
    const term = `%${filters.search}%`;
    params.push(term, term, term, term);
  }

  query += ' GROUP BY l.id ORDER BY l.id DESC';

  return db.prepare(query).all(...params);
}

function getLeadById(id) {
  const lead = db.prepare(`
    SELECT l.*, c.name as campaign_name
    FROM Lead l
    LEFT JOIN MarketingCampaign c ON l.campaign_id = c.id
    WHERE l.id = ?
  `).get(id);

  if (!lead) return null;

  const activities = db.prepare(`
    SELECT * FROM LeadActivity WHERE lead_id = ? ORDER BY id DESC
  `).all(id);

  return { ...lead, activities };
}

function createLead(data) {
  const {
    name,
    company = '',
    client_type = 'Cliente final - Boda',
    phone = '',
    email = '',
    service_interest = 'Plan Elegance',
    event_type = '',
    event_date = '',
    city = 'Bogotá',
    estimated_budget = '',
    source_channel = 'Web',
    campaign_id = null,
    status = 'Nuevo',
    notes = ''
  } = data;

  if (!name || !name.trim()) {
    throw new Error('El nombre del prospecto o cliente es obligatorio');
  }

  const stmt = db.prepare(`
    INSERT INTO Lead (
      name, company, client_type, phone, email, service_interest,
      event_type, event_date, city, estimated_budget, source_channel,
      campaign_id, status, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    name.trim(),
    company ? company.trim() : '',
    client_type,
    phone ? phone.trim() : '',
    email ? email.trim() : '',
    service_interest,
    event_type,
    event_date,
    city || 'Bogotá',
    estimated_budget,
    source_channel || 'Web',
    campaign_id ? parseInt(campaign_id) : null,
    status || 'Nuevo',
    notes || ''
  );

  const newId = db.prepare('SELECT last_insert_rowid() as id').get().id;

  // Registrar actividad inicial
  addLeadActivity(newId, 'Creación', `Lead registrado en el sistema a través del canal: ${source_channel || 'Web'}`);

  return getLeadById(newId);
}

function updateLeadStatus(id, newStatus, noteDescription) {
  if (!VALID_STATUSES.includes(newStatus)) {
    throw new Error(`Estado de lead no válido: ${newStatus}`);
  }

  const current = db.prepare('SELECT status, name FROM Lead WHERE id = ?').get(id);
  if (!current) return null;

  db.prepare('UPDATE Lead SET status = ? WHERE id = ?').run(newStatus, id);

  const desc = noteDescription || `Cambio de estado: de "${current.status}" a "${newStatus}"`;
  addLeadActivity(id, 'Cambio de estado', desc);

  return getLeadById(id);
}

function updateLead(id, data) {
  const existing = getLeadById(id);
  if (!existing) return null;

  db.prepare(`
    UPDATE Lead SET
      name = COALESCE(?, name),
      company = COALESCE(?, company),
      client_type = COALESCE(?, client_type),
      phone = COALESCE(?, phone),
      email = COALESCE(?, email),
      service_interest = COALESCE(?, service_interest),
      event_type = COALESCE(?, event_type),
      event_date = COALESCE(?, event_date),
      city = COALESCE(?, city),
      estimated_budget = COALESCE(?, estimated_budget),
      source_channel = COALESCE(?, source_channel),
      status = COALESCE(?, status),
      notes = COALESCE(?, notes)
    WHERE id = ?
  `).run(
    data.name || null,
    data.company !== undefined ? data.company : null,
    data.client_type || null,
    data.phone !== undefined ? data.phone : null,
    data.email !== undefined ? data.email : null,
    data.service_interest || null,
    data.event_type !== undefined ? data.event_type : null,
    data.event_date !== undefined ? data.event_date : null,
    data.city || null,
    data.estimated_budget !== undefined ? data.estimated_budget : null,
    data.source_channel || null,
    data.status || null,
    data.notes !== undefined ? data.notes : null,
    id
  );

  return getLeadById(id);
}

function addLeadActivity(lead_id, activity_type, description) {
  db.prepare(`
    INSERT INTO LeadActivity (lead_id, activity_type, description)
    VALUES (?, ?, ?)
  `).run(lead_id, activity_type, description);
}

function getLeadStats() {
  const total = db.prepare('SELECT COUNT(*) as count FROM Lead').get().count;
  const byStatus = db.prepare(`
    SELECT status, COUNT(*) as count 
    FROM Lead 
    GROUP BY status
  `).all();

  const statusMap = {};
  VALID_STATUSES.forEach(s => { statusMap[s] = 0; });
  byStatus.forEach(row => { statusMap[row.status] = row.count; });

  const bySource = db.prepare(`
    SELECT source_channel, COUNT(*) as count 
    FROM Lead 
    GROUP BY source_channel
  `).all();

  const byService = db.prepare(`
    SELECT service_interest, COUNT(*) as count 
    FROM Lead 
    GROUP BY service_interest 
    ORDER BY count DESC
  `).all();

  const closedWon = statusMap['Reservado'] || 0;
  const conversionRate = total > 0 ? ((closedWon / total) * 100).toFixed(1) : 0;

  return {
    total,
    byStatus: statusMap,
    bySource,
    byService,
    conversionRate: `${conversionRate}%`,
    closedWon
  };
}

function generateWhatsAppResponse(id) {
  const lead = getLeadById(id);
  if (!lead) return null;

  const catalog = getCatalogData();
  const cleanPhone = lead.phone.replace(/[^0-9]/g, '');

  const msg = `¡Hola ${lead.name}! 👋 Te saluda el equipo de Artes y Entretenimiento Colombia.%0A%0ARecibimos tu interés para tu evento${lead.event_type ? ' (' + lead.event_type + ')' : ''}${lead.event_date ? ' el día ' + lead.event_date : ''} con nuestra propuesta de *${lead.service_interest || 'Sonido y DJ'}*.%0A%0A¿Aún tienes disponibilidad para conversar unos minutos y enviarte la propuesta formal ajustada a tu fecha? 🎶✨`;

  const waUrl = cleanPhone 
    ? `https://api.whatsapp.com/send?phone=${cleanPhone.startsWith('57') ? cleanPhone : '57' + cleanPhone}&text=${msg}`
    : `https://api.whatsapp.com/send?phone=${catalog.marca.whatsapp}&text=${msg}`;

  return {
    url: waUrl,
    message: decodeURIComponent(msg)
  };
}

module.exports = {
  getLeads,
  getLeadById,
  createLead,
  updateLeadStatus,
  updateLead,
  addLeadActivity,
  getLeadStats,
  generateWhatsAppResponse,
  VALID_STATUSES
};
