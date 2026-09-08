const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new DatabaseSync(dbPath);

function migrateSocialAccountsSchema() {
  const tableSql = db.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'SocialAccount'").get();

  if (!tableSql || !tableSql.sql) {
    return;
  }

  if (tableSql.sql.includes('UNIQUE')) {
    db.exec(`
      PRAGMA foreign_keys = OFF;
      ALTER TABLE SocialAccount RENAME TO SocialAccount_old;
      CREATE TABLE SocialAccount (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        platform TEXT NOT NULL,
        account_name TEXT NOT NULL,
        status TEXT DEFAULT 'Modo Manual',
        followers INTEGER DEFAULT 0,
        profile_url TEXT,
        last_sync TEXT
      );
      INSERT INTO SocialAccount (id, platform, account_name, status, followers, profile_url, last_sync)
      SELECT id, platform, account_name, status, followers, profile_url, last_sync
      FROM SocialAccount_old;
      DROP TABLE SocialAccount_old;
      PRAGMA foreign_keys = ON;
    `);
  }
}

function initializeDatabase() {
  migrateSocialAccountsSchema();

  db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS MarketingAudience (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      key TEXT UNIQUE NOT NULL,
      description TEXT,
      recommended_tone TEXT,
      sample_hooks TEXT
    );

    CREATE TABLE IF NOT EXISTS MarketingCampaign (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      objective TEXT NOT NULL,
      audience_id INTEGER,
      start_date TEXT,
      end_date TEXT,
      budget REAL DEFAULT 0,
      status TEXT DEFAULT 'Activa',
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (audience_id) REFERENCES MarketingAudience(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS MarketingMedia (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_path TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      media_type TEXT DEFAULT 'image',
      service_tag TEXT DEFAULT 'General',
      artist_tag TEXT DEFAULT 'ambos',
      audience_tag TEXT DEFAULT 'Todos',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS MarketingContent (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      campaign_id INTEGER,
      platform TEXT NOT NULL,
      content_type TEXT NOT NULL,
      audience_type TEXT,
      title TEXT NOT NULL,
      copy_text TEXT NOT NULL,
      cta TEXT,
      hashtags TEXT,
      target_url TEXT,
      generated_by_ai INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (campaign_id) REFERENCES MarketingCampaign(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS MarketingPublication (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content_id INTEGER,
      media_id INTEGER,
      platform TEXT NOT NULL,
      scheduled_date TEXT NOT NULL,
      scheduled_time TEXT NOT NULL,
      status TEXT DEFAULT 'Borrador',
      published_at TEXT,
      external_post_url TEXT,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (content_id) REFERENCES MarketingContent(id) ON DELETE CASCADE,
      FOREIGN KEY (media_id) REFERENCES MarketingMedia(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS SocialAccount (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT NOT NULL,
      account_name TEXT NOT NULL,
      status TEXT DEFAULT 'Modo Manual',
      followers INTEGER DEFAULT 0,
      profile_url TEXT,
      last_sync TEXT
    );

    CREATE TABLE IF NOT EXISTS SocialMetric (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      account_id INTEGER,
      date TEXT NOT NULL,
      impressions INTEGER DEFAULT 0,
      reach INTEGER DEFAULT 0,
      engagements INTEGER DEFAULT 0,
      clicks INTEGER DEFAULT 0,
      is_manual INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (account_id) REFERENCES SocialAccount(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS Lead (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      company TEXT,
      client_type TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      service_interest TEXT,
      event_type TEXT,
      event_date TEXT,
      city TEXT DEFAULT 'Bogotá',
      estimated_budget TEXT,
      source_channel TEXT DEFAULT 'Web',
      campaign_id INTEGER,
      status TEXT DEFAULT 'Nuevo',
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (campaign_id) REFERENCES MarketingCampaign(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS LeadActivity (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id INTEGER NOT NULL,
      activity_type TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (lead_id) REFERENCES Lead(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS MarketingAutomation (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      trigger_event TEXT NOT NULL,
      action_type TEXT NOT NULL,
      config_json TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  seedData();
}

function seedData() {
  // 1. Seed Audiences
  const countAudiences = db.prepare("SELECT COUNT(*) as count FROM MarketingAudience").get().count;
  if (countAudiences === 0) {
    const insertAudience = db.prepare(`
      INSERT INTO MarketingAudience (name, key, description, recommended_tone, sample_hooks)
      VALUES (?, ?, ?, ?, ?)
    `);

    const audiences = [
      [
        'Organizadores de Eventos & Wedding Planners',
        'event_planners',
        'Profesionales de la producción que necesitan aliados confiables, montajes estéticos de alta fidelidad acústica y puntualidad británica.',
        'Profesional, confiable, técnico-estético, enfocado en tranquilidad y alianza a largo plazo.',
        'El aliado técnico que todo Wedding Planner necesita|Tu evento sin sorpresas: sonido e iluminación milimétrica|Por qué los mejores productores nos confían su pista'
      ],
      [
        'Empresas BTL & Agencias de Publicidad',
        'btl_agencies',
        'Agencias que ejecutan activaciones de marca y lanzamientos corporativos que exigen impacto de marca, dinamismo y cumplimiento 100%.',
        'Dinámico, enérgico, enfocado en impacto de marca, cumplimiento estricto y adaptabilidad de formatos.',
        'Activa tu marca con la potencia acústica de Artes & Entretenimiento|Montajes sonoros y visuales de alto impacto para BTL|Experiencias de marca que se recuerdan'
      ],
      [
        'Clientes Finales - Bodas y Celebraciones VIP',
        'end_clients_wedding',
        'Parejas y familias que buscan una noche mágica, emotiva, elegante y con una rumba crossover que mantenga la pista llena.',
        'Emocional, cercano, sofisticado, cálido, enfocado en crear recuerdos inolvidables.',
        'La fiesta de tu boda como siempre la soñaste: pista llena hasta el amanecer|Música que eriza la piel: DJ Cool en tu gran día|Planes integrales sin estrés para tu boda'
      ],
      [
        'Clientes Finales - Quince Años & Fiestas Privadas',
        'end_clients_fifteen',
        'Jóvenes y padres que buscan espectáculo moderno: show láser, robots LED, música urbana/crossover y animación moderna.',
        'Juvenil, festivo, impactante, moderno, centrado en el show visual y de luces.',
        'Show láser, robots LED y la rumba de tus 15 como en un festival|Tus 15 años merecen el mejor sonido e iluminación de Bogotá|La rumba que todos tus amigos recordarán'
      ],
      [
        'Eventos Corporativos & Galas de Fin de Año',
        'corporate',
        'Empresas que celebran aniversarios, conferencias, galas y fiestas de fin de año con audio nítido para discursos y show musical.',
        'Elegante, corporativo, sobrio, cumplido, con cotizaciones formales y montaje pulcro.',
        'Eleva el estándar de la fiesta anual de tu empresa|Sonido nítido para discursos + DJ estelar para la gala|Plan Prestige: la solución integral para eventos corporativos'
      ]
    ];

    audiences.forEach(aud => insertAudience.run(...aud));
  }

  // 2. Seed Media Files from filesystem
  const countMedia = db.prepare("SELECT COUNT(*) as count FROM MarketingMedia").get().count;
  if (countMedia === 0) {
    const insertMedia = db.prepare(`
      INSERT OR IGNORE INTO MarketingMedia (file_path, title, media_type, service_tag, artist_tag, audience_tag)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const mediaSeed = [
      ['assets/plan-elegance.png', 'Montaje Plan Elegance Completo', 'image', 'Planes', 'ninguno', 'Todos'],
      ['assets/plan-prestige.png', 'Montaje Plan Prestige Show Truss', 'image', 'Planes', 'ninguno', 'Todos'],
      ['assets/djcool-promo.jpg', 'DJ Cool en Vivo - Crossover', 'image', 'Artistas', 'djcool', 'end_clients_wedding'],
      ['assets/djice-promo.jpg', 'DJ Ice en Escenario - Frecuencias', 'image', 'Artistas', 'djice', 'corporate'],
      ['assets/boda_3.jpg', 'Iluminación y Ambiente de Boda', 'image', 'Bodas', 'djcool', 'end_clients_wedding'],
      ['assets/corp_3.jpg', 'Evento Empresarial de Gala', 'image', 'Corporativo', 'djice', 'corporate'],
      ['assets/bar_2.jpg', 'Noche de Club y Luces Robóticas', 'image', 'Bares', 'djcool', 'btl_agencies'],
      ['assets/bar_3.jpg', 'DJ Session con Láser', 'image', 'Bares', 'djice', 'btl_agencies'],
      ['assets/infantil-promo.jpg', 'Evento Social Familiar', 'image', 'Infantil / Bautizo', 'ambos', 'end_clients_fifteen'],
      ['fotos/bodas/wedding.png', 'Pareja de Boda en Pista Iluminada', 'image', 'Bodas', 'djcool', 'end_clients_wedding'],
      ['fotos/corporativo/corp.png', 'Montaje Corporativo Truss & Pantalla', 'image', 'Corporativo', 'djice', 'corporate'],
      ['fotos/bares/bar1.jpg', 'Montaje en Bar con Cabinas', 'image', 'Bares', 'djcool', 'btl_agencies'],
      ['fotos/hero.png', 'Banner Principal Escenario y Fiesta', 'image', 'General', 'ambos', 'Todos']
    ];

    mediaSeed.forEach(m => insertMedia.run(...m));
  }

  // 3. Seed Social Accounts
  const defaultAccounts = [
    ['Instagram', '@edgardjcool', 'Modo Manual', 0, 'https://www.instagram.com/edgardjcool/'],
    ['Instagram', '@artyento', 'Modo Manual', 0, 'https://www.instagram.com/artyento/'],
    ['Facebook', 'DJ Cool Edgar', 'Modo Manual', 0, 'https://www.facebook.com/dj.cool.edgar/'],
    ['Facebook', 'Artes y Entretenimiento', 'Modo Manual', 0, 'https://www.facebook.com/artesyentretenimiento']
  ];

  const canonicalKeys = new Set(defaultAccounts.map(([platform, account_name]) => `${platform}|${account_name}`));
  const allAccounts = db.prepare('SELECT id, platform, account_name FROM SocialAccount').all();
  const deleteStmt = db.prepare('DELETE FROM SocialAccount WHERE id = ?');
  allAccounts.forEach((row) => {
    const rowKey = `${row.platform}|${row.account_name}`;
    if (!canonicalKeys.has(rowKey)) {
      deleteStmt.run(row.id);
    }
  });

  defaultAccounts.forEach(([platform, account_name, status, followers, profile_url]) => {
    const existing = db.prepare('SELECT id FROM SocialAccount WHERE platform = ? AND account_name = ?').get(platform, account_name);
    if (existing) {
      db.prepare(`
        UPDATE SocialAccount
        SET status = ?, followers = ?, profile_url = ?, last_sync = CURRENT_DATE
        WHERE id = ?
      `).run(status, followers, profile_url, existing.id);
      return;
    }

    db.prepare(`
      INSERT INTO SocialAccount (platform, account_name, status, followers, profile_url, last_sync)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(platform, account_name, status, followers, profile_url, new Date().toISOString().split('T')[0]);
  });

  // 4. Seed Initial Campaigns
  const countCampaigns = db.prepare("SELECT COUNT(*) as count FROM MarketingCampaign").get().count;
  if (countCampaigns === 0) {
    const insertCamp = db.prepare(`
      INSERT INTO MarketingCampaign (name, objective, audience_id, start_date, end_date, budget, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertCamp.run('Temporada Bodas & Alianzas Planner 2026', 'Captación de Wedding Planners', 1, '2026-09-01', '2026-12-31', 450000, 'Activa', 'Enfoque en Plan Elegance y Plan Prestige con puntualidad');
    insertCamp.run('Activaciones BTL & Fin de Año Corporativo', 'Eventos Empresariales', 2, '2026-09-15', '2026-11-30', 600000, 'Activa', 'Dirigido a directores de marketing y agencias de Bogotá');
    insertCamp.run('15 Años & Fiestas Juveniles VIP', 'Clientes Finales 15 Años', 4, '2026-09-01', '2026-10-31', 300000, 'Activa', 'Show láser B500, cabina iluminada y robots LM30');
  }

  // 5. Seed Sample Initial Leads for Demonstration
  const countLeads = db.prepare("SELECT COUNT(*) as count FROM Lead").get().count;
  if (countLeads === 0) {
    const insertLead = db.prepare(`
      INSERT INTO Lead (name, company, client_type, phone, email, service_interest, event_type, event_date, city, estimated_budget, source_channel, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertLead.run(
      'Camila Restrepo',
      'Eventos Bogotá Planners',
      'Organizador de eventos',
      '+57 311 456 7890',
      'camila@eventosplanners.co',
      'Plan Prestige',
      'Boda en Hacienda',
      '2026-11-14',
      'Subachoque',
      '$800.000',
      'Instagram',
      'Cotización enviada',
      'Interesada en video beam y DJ Cool crossover'
    );

    insertLead.run(
      'Andrés Gómez',
      'Agencia BrandLive BTL',
      'Empresa BTL',
      '+57 320 889 1234',
      'andres@brandlive.com',
      'Sonido & Iluminación',
      'Activación de Marca 3 Días',
      '2026-10-05',
      'Bogotá',
      '$2.500.000',
      'Web',
      'En negociación',
      'Requiere 4 cabinas, microfonía inalámbrica y DJ Ice'
    );

    insertLead.run(
      'Marcela Ortiz',
      '',
      'Cliente final - 15 Años',
      '+57 315 234 5678',
      'marcela.ortiz@gmail.com',
      'Plan Elegance',
      'Fiesta de 15 Años',
      '2026-10-24',
      'Bogotá',
      '$650.000',
      'TikTok',
      'Nuevo',
      'Vio el video de los robots LED y la cabina acrílica'
    );
  }

  // 6. Seed Automations
  const countAuto = db.prepare("SELECT COUNT(*) as count FROM MarketingAutomation").get().count;
  if (countAuto === 0) {
    const insertAuto = db.prepare(`
      INSERT INTO MarketingAutomation (name, trigger_event, action_type, config_json, is_active)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertAuto.run('Registro de Lead → Notificación Directa a WhatsApp', 'lead_created', 'whatsapp_reminder', JSON.stringify({ phone: '+573202459032' }), 1);
    insertAuto.run('Lead Cotizado → Recordatorio de Seguimiento 48h', 'lead_quoted', 'crm_status_change', JSON.stringify({ days: 2 }), 1);
    insertAuto.run('Publicación Aprobada → Notificación para Copiar y Publicar', 'post_approved', 'log_metric', JSON.stringify({ notify: true }), 1);
  }
}

// Inicializar de inmediato al importar
initializeDatabase();

module.exports = { db };
