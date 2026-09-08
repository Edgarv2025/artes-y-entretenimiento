const { db } = require('../database');
const { getLeadStats } = require('./leadService');

function getDashboardAnalytics() {
  // 1. Leads summary
  const leadStats = getLeadStats();

  // 2. Campaigns summary
  const campaigns = db.prepare(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'Activa' THEN 1 ELSE 0 END) as active
    FROM MarketingCampaign
  `).get();

  // 3. Publications summary
  const publications = db.prepare(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'Publicado' THEN 1 ELSE 0 END) as published,
      SUM(CASE WHEN status = 'Programado' THEN 1 ELSE 0 END) as scheduled,
      SUM(CASE WHEN status = 'Borrador' THEN 1 ELSE 0 END) as draft
    FROM MarketingPublication
  `).get();

  // 4. Social accounts summary
  const social = db.prepare(`
    SELECT 
      SUM(followers) as total_followers,
      COUNT(*) as total_accounts
    FROM SocialAccount
  `).get();

  // 5. Media summary
  const mediaCount = db.prepare('SELECT COUNT(*) as count FROM MarketingMedia').get().count;

  // 6. Recent Leads
  const recentLeads = db.prepare(`
    SELECT id, name, company, client_type, service_interest, status, created_at
    FROM Lead
    ORDER BY id DESC
    LIMIT 5
  `).all();

  // 7. Upcoming Publications (next 7 days)
  const upcomingPosts = db.prepare(`
    SELECT p.id, p.platform, p.scheduled_date, p.scheduled_time, p.status, ct.title
    FROM MarketingPublication p
    JOIN MarketingContent ct ON p.content_id = ct.id
    WHERE p.status IN ('Programado', 'Aprobado', 'Borrador')
    ORDER BY p.scheduled_date ASC, p.scheduled_time ASC
    LIMIT 5
  `).all();

  // 8. Top Performing Campaigns
  const topCampaigns = db.prepare(`
    SELECT 
      c.id, c.name, c.status, c.budget,
      COUNT(DISTINCT l.id) as leads_generated,
      SUM(CASE WHEN l.status = 'Reservado' THEN 1 ELSE 0 END) as bookings_count
    FROM MarketingCampaign c
    LEFT JOIN Lead l ON c.id = l.campaign_id
    GROUP BY c.id
    ORDER BY leads_generated DESC
    LIMIT 5
  `).all();

  return {
    kpis: {
      total_leads: leadStats.total,
      active_campaigns: campaigns.active || 0,
      scheduled_posts: publications.scheduled || 0,
      total_followers: social.total_followers || 0,
      closed_bookings: leadStats.closedWon,
      conversion_rate: leadStats.conversionRate,
      media_assets: mediaCount
    },
    funnel: leadStats.byStatus,
    popular_services: leadStats.byService,
    sources: leadStats.bySource,
    recent_leads: recentLeads,
    upcoming_posts: upcomingPosts,
    top_campaigns: topCampaigns
  };
}

module.exports = { getDashboardAnalytics };
