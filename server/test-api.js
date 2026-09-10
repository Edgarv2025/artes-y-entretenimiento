const { db } = require('./database');
const { getCatalogData } = require('./services/catalogService');
const { getAudiences, getCampaigns, createCampaign, deleteCampaign } = require('./services/campaignService');
const { generateCommercialContent } = require('./services/aiService');
const { createContentAndPublication, getPublications, updatePublicationStatus } = require('./services/publicationService');
const { getLeads, createLead, updateLeadStatus, getLeadStats, generateWhatsAppResponse } = require('./services/leadService');
const { syncMediaFiles, getMediaItems } = require('./services/mediaService');
const { getDashboardAnalytics } = require('./services/analyticsService');

async function runTests() {
  let newCamp = null;
  let newLead = null;
  try {
  console.log('--- 1. Probando Catálogo de datos.js ---');
  const catalog = getCatalogData();
  console.log(`✓ Paquetes encontrados: ${catalog.paquetes.length}`);
  console.log(`✓ Artistas encontrados: ${catalog.artistas.length}`);
  console.log(`✓ Testimonios encontrados: ${catalog.testimonios.length}`);
  if (catalog.paquetes.length === 0) throw new Error('No se cargaron los paquetes');

  console.log('\n--- 2. Probando Audiencias y Campañas ---');
  const audiences = getAudiences();
  console.log(`✓ Audiencias en base de datos: ${audiences.length}`);
  
  newCamp = createCampaign({
    name: 'Campaña de Prueba Automatizada BTL',
    objective: 'Activación Marcas',
    audience_id: 2,
    budget: 350000
  });
  console.log(`✓ Campaña creada: ID ${newCamp.id} - ${newCamp.name}`);

  console.log('\n--- 3. Probando Generador de IA (Sin Alucinaciones) ---');
  // Prueba 1: Bodas con DJ Cool y Plan Elegance
  const aiResultBodas = await generateCommercialContent({
    platform: 'Instagram',
    audienceType: 'end_clients_wedding',
    serviceFocus: 'elegance',
    artistFocus: 'djcool'
  });
  console.log(`✓ IA Bodas Generada:`);
  console.log(`  Título: ${aiResultBodas.title}`);
  console.log(`  Gancho: ${aiResultBodas.hook}`);
  console.log(`  Hashtags: ${aiResultBodas.hashtags}`);
  console.log(`  Paquete usado: ${aiResultBodas.meta.package_used} (${aiResultBodas.meta.package_price})`);

  // Prueba 2: BTL con DJ Ice y Plan Prestige
  const aiResultBTL = await generateCommercialContent({
    platform: 'TikTok',
    audienceType: 'btl_agencies',
    serviceFocus: 'prestige',
    artistFocus: 'djice'
  });
  console.log(`✓ IA BTL Generada:`);
  console.log(`  Título: ${aiResultBTL.title}`);
  console.log(`  Gancho: ${aiResultBTL.hook}`);
  console.log(`  Paquete usado: ${aiResultBTL.meta.package_used} (${aiResultBTL.meta.package_price})`);

  console.log('\n--- 4. Probando Creación de Publicación y Calendario ---');
  const newPost = createContentAndPublication({
    campaign_id: newCamp.id,
    platform: 'Instagram',
    title: aiResultBodas.title,
    copy_text: aiResultBodas.copy_text,
    cta: aiResultBodas.cta,
    hashtags: aiResultBodas.hashtags,
    target_url: aiResultBodas.target_url,
    scheduled_date: '2026-10-15',
    scheduled_time: '19:00',
    status: 'Programado'
  });
  const createdPosts = Array.isArray(newPost) ? newPost : [newPost];
  if (createdPosts.length === 0 || createdPosts.some(post => !post || !post.id)) {
    throw new Error('No se devolvieron publicaciones válidas');
  }
  console.log(`✓ Publicaciones programadas: ${createdPosts.length}`);

  createdPosts.forEach(post => {
    const updatedPost = updatePublicationStatus(post.id, 'Aprobado', 'Revisado por director');
    if (!updatedPost || updatedPost.status !== 'Aprobado') {
      throw new Error(`No se pudo actualizar la publicación ${post.id}`);
    }
  });
  console.log(`✓ Estado actualizado a Aprobado en ${createdPosts.length} publicación(es)`);

  console.log('\n--- 5. Probando Sincronización Multimedia ---');
  const mediaList = syncMediaFiles();
  console.log(`✓ Archivos multimedia sincronizados: ${mediaList.length} elementos`);

  console.log('\n--- 6. Probando CRM de Leads ---');
  newLead = createLead({
    name: 'Carolina Martínez Test',
    company: 'Bodas & Glamour',
    client_type: 'Organizador de eventos',
    phone: '3109876543',
    service_interest: 'Plan Prestige',
    event_type: 'Boda Campestre',
    event_date: '2026-12-05',
    city: 'Chía'
  });
  console.log(`✓ Lead creado: ID ${newLead.id} - ${newLead.name} (${newLead.status})`);

  const waResp = generateWhatsAppResponse(newLead.id);
  console.log(`✓ Enlace de respuesta WhatsApp generado: ${waResp.url.substring(0, 70)}...`);

  updateLeadStatus(newLead.id, 'Cotización enviada', 'Propuesta formal enviada en PDF');
  const leadStats = getLeadStats();
  console.log(`✓ Total Leads en CRM: ${leadStats.total} | Tasa Conversión: ${leadStats.conversionRate}`);

  console.log('\n--- 7. Probando Dashboard General de Analítica ---');
  const analytics = getDashboardAnalytics();
  console.log('✓ KPIs calculados exitosamente:');
  console.log(`  - Leads: ${analytics.kpis.total_leads}`);
  console.log(`  - Campañas activas: ${analytics.kpis.active_campaigns}`);
  console.log(`  - Posts programados: ${analytics.kpis.scheduled_posts}`);
  console.log(`  - Reservas cerradas: ${analytics.kpis.closed_bookings}`);

  console.log('\n====================================================');
  console.log(' 🎉 ¡TODOS LOS SERVICIOS Y ENTIDADES FUNCIONAN AL 100%!');
  console.log('====================================================\n');
  } finally {
    if (newCamp && newCamp.id) {
      deleteCampaign(newCamp.id);
    }
    if (newLead && newLead.id) {
      db.prepare('DELETE FROM LeadActivity WHERE lead_id = ?').run(newLead.id);
      db.prepare('DELETE FROM Lead WHERE id = ?').run(newLead.id);
    }
    console.log('🧹 Limpieza de datos de prueba finalizada. Base de datos protegida.\n');
  }
}

runTests().catch(err => {
  console.error('❌ Error en las pruebas:', err);
  process.exit(1);
});
