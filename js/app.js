/**
 * The Arrival Guide
 * app.js — Travel Journal / Diary theme
 * Hash router · Markdown renderer · Command palette search · 3D page-flip transitions
 */

'use strict';

// ============================================================
// PAGE CONFIGURATION & METADATA
// ============================================================

const PAGES = [
  {
    id: 'home',
    title: 'Home',
    icon: 'home',
    file: 'content/home.md',
    desc: 'Overview, quick reference, and site guide',
    code: '00',
    sectionLabel: null,
    isHome: true,
  },
  {
    id: 'site-index',
    title: 'Site Index',
    icon: 'site-index',
    file: 'content/site-index.md',
    desc: 'Complete table of contents — every chapter and section at a glance',
    code: 'IX',
    sectionLabel: 'JOURNAL SECTIONS',
  },
  {
    id: 'before-you-move',
    title: 'Before You Move',
    icon: 'before-you-move',
    file: 'content/before-you-move.md',
    desc: 'Visa types, required documents, salary negotiation, timeline',
    code: '01',
    sectionLabel: null,
  },
  {
    id: 'first-30-days',
    title: 'First 30 Days',
    icon: 'first-30-days',
    file: 'content/first-30-days.md',
    desc: 'CPR number, bank account, MitID, SIM card, housing',
    code: '02',
    sectionLabel: null,
  },
  {
    id: 'money-and-tax',
    title: 'Money & Tax',
    icon: 'money-and-tax',
    file: 'content/money-and-tax.md',
    desc: 'SKAT, tax card, payslips, pension, Forskerordning',
    code: '03',
    sectionLabel: null,
  },
  {
    id: 'daily-life',
    title: 'Daily Life',
    icon: 'daily-life',
    file: 'content/daily-life.md',
    desc: 'Indian groceries, community groups, healthcare, weather',
    code: '04',
    sectionLabel: null,
  },
  {
    id: 'work-culture',
    title: 'Work Culture',
    icon: 'work-culture',
    file: 'content/work-culture.md',
    desc: 'Flat hierarchy, communication norms, unions, notice periods',
    code: '05',
    sectionLabel: null,
  },
  {
    id: 'long-term',
    title: 'Long Term',
    icon: 'long-term',
    file: 'content/long-term.md',
    desc: 'Permanent residency, family visas, citizenship, schooling',
    code: '06',
    sectionLabel: null,
  },
  {
    id: 'student-guide',
    title: 'Study in Denmark',
    icon: 'student-guide',
    file: 'content/student-guide.md',
    desc: 'University admissions, tuition fees, scholarships, housing (kollegier), and visa rules',
    code: '07',
    sectionLabel: null,
  },
  {
    id: 'tourism',
    title: 'Tourism & Travel',
    icon: 'tourism',
    file: 'content/tourism.md',
    desc: 'Sightseeing in/out of Copenhagen, student/budget discounts, public transport, and bike rules',
    code: '08',
    sectionLabel: null,
  },
  {
    id: 'social-life',
    title: 'Social Life',
    icon: 'social-life',
    file: 'content/social-life.md',
    desc: 'Meeting Danes, Indian community, hygge, nightlife, festivals, and dating culture',
    code: '09',
    sectionLabel: null,
  },
  {
    id: 'driving-license',
    title: 'Driving Licence',
    icon: 'driving-license',
    file: 'content/driving-license.md',
    desc: 'Indian licence validity, Danish licence process, theory & practical tests, buying a car',
    code: '10',
    sectionLabel: null,
  },
  {
    id: 'family-guide',
    title: 'Family Guide',
    icon: 'family-guide',
    file: 'content/family-guide.md',
    desc: 'Dependent visas, spousal work rights, daycare (vuggestue, dagpleje, børnehave), daily routines, international schools, child benefit',
    code: '11',
    sectionLabel: null,
  },
  {
    id: 'india-denmark-history',
    title: 'India & Denmark: History',
    icon: 'india-denmark-history',
    file: 'content/india-denmark-history.md',
    desc: 'Tranquebar, Danish East India Company, Serampore Mission, and modern bilateral relations',
    code: '12',
    sectionLabel: null,
  },
];

// ============================================================
// HAND-DRAWN SVGS
// ============================================================

const DOODLE_MAP = {
  'site-index': `
    <svg viewBox="0 0 24 24" class="doodle-icon" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" stroke-width="2" stroke-linecap="round" />
      <line x1="3" y1="12" x2="3.01" y2="12" stroke-width="2" stroke-linecap="round" />
      <line x1="3" y1="18" x2="3.01" y2="18" stroke-width="2" stroke-linecap="round" />
    </svg>`,
  'home': `
    <svg viewBox="0 0 24 24" class="doodle-icon" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20M4 19.5L4 4.5A2.5 2.5 0 0 1 6.5 2M6.5 2H20v20H6.5" />
    </svg>`,
  'before-you-move': `
    <svg viewBox="0 0 24 24" class="doodle-icon" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="8" width="18" height="12" rx="1.5" />
      <path d="M8 8V5.5a1.5 1.5 0 0 1 1.5-1.5h5a1.5 1.5 0 0 1 1.5 1.5V8M3 12h18" />
    </svg>`,
  'first-30-days': `
    <svg viewBox="0 0 24 24" class="doodle-icon" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="17" rx="1.5" />
      <path d="M16 2v4M8 2v4M3 9h18" />
      <circle cx="12" cy="15" r="2.5" />
    </svg>`,
  'money-and-tax': `
    <svg viewBox="0 0 24 24" class="doodle-icon" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M9.5 9.5h5a2 2 0 0 1 0 4h-5v3.5M9.5 13.5H13" />
    </svg>`,
  'daily-life': `
    <svg viewBox="0 0 24 24" class="doodle-icon" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="18.5" cy="17.5" r="3" />
      <circle cx="5.5" cy="17.5" r="3" />
      <path d="M15 17.5H9M12 7.5V17.5M12 7.5L8 10M12 7.5l5 2" />
    </svg>`,
  'work-culture': `
    <svg viewBox="0 0 24 24" class="doodle-icon" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path d="M2 20h20" />
    </svg>`,
  'long-term': `
    <svg viewBox="0 0 24 24" class="doodle-icon" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>`,
  'student-guide': `
    <svg viewBox="0 0 24 24" class="doodle-icon" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M22 10L12 5 2 10l10 5 10-5z" />
      <path d="M6 12v5c0 1.5 2 2.5 6 2.5s6-1 6-2.5v-5" />
    </svg>`,
  'tourism': `
    <svg viewBox="0 0 24 24" class="doodle-icon" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <polygon points="16 8 13.5 13.5 8 16 10.5 10.5 16 8" />
    </svg>`,
  'social-life': `
    <svg viewBox="0 0 24 24" class="doodle-icon" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <line x1="9" y1="10" x2="9" y2="10" stroke-width="2" stroke-linecap="round"/>
      <line x1="12" y1="10" x2="12" y2="10" stroke-width="2" stroke-linecap="round"/>
      <line x1="15" y1="10" x2="15" y2="10" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  'driving-license': `
    <svg viewBox="0 0 24 24" class="doodle-icon" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="3" x2="12" y2="9" />
      <line x1="12" y1="15" x2="12" y2="21" />
      <line x1="3" y1="12" x2="9" y2="12" />
      <line x1="15" y1="12" x2="21" y2="12" />
    </svg>`,
  'family-guide': `
    <svg viewBox="0 0 24 24" class="doodle-icon" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>`,
  'india-denmark-history': `
    <svg viewBox="0 0 24 24" class="doodle-icon" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>`
};

const COMPASS_SVG = `
<svg class="compass-doodle" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <!-- Hand-drawn sketch compass -->
  <circle cx="100" cy="100" r="82" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2 4" opacity="0.6"/>
  <circle cx="100" cy="100" r="77" stroke="currentColor" stroke-width="1" opacity="0.8"/>
  <circle cx="100" cy="100" r="35" stroke="currentColor" stroke-width="0.8" stroke-dasharray="4 2" opacity="0.5"/>
  <!-- Cardinal directions -->
  <path d="M100 12 L100 188 M12 100 L188 100" stroke="currentColor" stroke-width="0.8" opacity="0.5"/>
  <!-- Arrow pointer -->
  <polygon points="100,22 105,85 100,100" fill="currentColor" opacity="0.8"/>
  <polygon points="100,22 95,85 100,100" fill="none" stroke="currentColor" stroke-width="0.8"/>
  <polygon points="100,178 105,115 100,100" fill="none" stroke="currentColor" stroke-width="0.8"/>
  <polygon points="100,178 95,115 100,100" fill="currentColor" opacity="0.5"/>
  <polygon points="178,100 115,105 100,100" fill="currentColor" opacity="0.8"/>
  <polygon points="178,100 115,95 100,100" fill="none" stroke="currentColor" stroke-width="0.8"/>
  <polygon points="22,100 85,105 100,100" fill="none" stroke="currentColor" stroke-width="0.8"/>
  <polygon points="22,100 85,95 100,100" fill="currentColor" opacity="0.5"/>
  <circle cx="100" cy="100" r="4.5" fill="currentColor"/>
  <!-- Labels -->
  <text x="94" y="16" font-family="Caveat, cursive" font-weight="bold" font-size="18" fill="currentColor">N</text>
  <text x="94" y="196" font-family="Caveat, cursive" font-weight="bold" font-size="18" fill="currentColor">S</text>
  <text x="3" y="106" font-family="Caveat, cursive" font-weight="bold" font-size="18" fill="currentColor">W</text>
  <text x="189" y="106" font-family="Caveat, cursive" font-weight="bold" font-size="18" fill="currentColor">E</text>
</svg>`;

// ============================================================
// STATE & CACHE
// ============================================================

const contentCache = {};
let fuseInstance = null;
let searchIndex = [];
let searchHighlightIdx = -1;
let activeTransition = false;
let currentPageId = null;

// ============================================================
// DOM REFERENCES
// ============================================================

const els = {
  navList:           document.getElementById('navList'),
  loadingState:      document.getElementById('loadingState'),
  contentArea:       document.getElementById('contentArea'),
  markdownBody:      document.getElementById('markdownBody'),
  pageNav:           document.getElementById('pageNav'),
  errorState:        document.getElementById('errorState'),

  searchOverlay:     document.getElementById('searchOverlay'),
  searchOverlayBg:   document.getElementById('searchOverlayBackdrop'),
  searchInput:       document.getElementById('searchInput'),
  searchResults:     document.getElementById('searchResults'),

  searchTriggerBtn:  document.getElementById('searchTriggerBtn'),
  sidebar:           document.getElementById('sidebar'),
  sidebarBackdrop:   document.getElementById('sidebarBackdrop'),
  hamburgerBtn:      document.getElementById('hamburgerBtn'),
  mobileSearchBtn:   document.getElementById('mobileSearchBtn'),
};

// ============================================================
// MARKED CONFIG
// ============================================================

marked.setOptions({ breaks: true, gfm: true });

// ============================================================
// HEADING ID UTILITIES (for deep-linking)
// ============================================================

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')       // strip HTML tags
    .replace(/[^\w\s-]/g, '')      // remove special chars except hyphens
    .replace(/\s+/g, '-')          // spaces → hyphens
    .replace(/-+/g, '-')           // collapse multiple hyphens
    .replace(/^-+|-+$/g, '');      // trim leading/trailing hyphens
}

function addHeadingIds(container) {
  const usedIds = new Set();
  container.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
    let id = slugify(heading.textContent);
    // Ensure uniqueness
    let uniqueId = id;
    let counter = 1;
    while (usedIds.has(uniqueId)) {
      uniqueId = `${id}-${counter++}`;
    }
    usedIds.add(uniqueId);
    heading.id = uniqueId;
  });
}

// ============================================================
// FRONTMATTER PARSER
// ============================================================

function parseFrontmatter(rawMd) {
  const metaMatch = rawMd.match(/^<!--\s*meta\s*([\s\S]*?)-->/);
  const meta = { title: '', updated: '', description: '', showDisclaimer: false };

  if (metaMatch) {
    const lines = metaMatch[1].trim().split('\n');
    for (const line of lines) {
      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) continue;
      const key = line.slice(0, colonIdx).trim();
      const val = line.slice(colonIdx + 1).trim();
      if (key === 'title') meta.title = val;
      else if (key === 'updated') meta.updated = val;
      else if (key === 'description') meta.description = val;
      else if (key === 'showDisclaimer') meta.showDisclaimer = val === 'true';
    }
  }

  const body = rawMd.replace(/^<!--\s*meta\s*[\s\S]*?-->/, '').trim();
  return { meta, body };
}

// ============================================================
// NAV BUILDER
// ============================================================

function buildNav() {
  let html = '';
  let lastSection = null;

  for (const [idx, page] of PAGES.entries()) {
    if (page.sectionLabel && page.sectionLabel !== lastSection) {
      html += `<li class="nav-section-label">${page.sectionLabel}</li>`;
      lastSection = page.sectionLabel;
    }
    const doodle = DOODLE_MAP[page.icon] || '';
    const num = String(idx).padStart(2, '0');
    html += `
      <li class="nav-item" id="nav-item-${page.id}">
        <div class="nav-link-row">
          <a href="#${page.id}" class="nav-link" data-page="${page.id}" id="nav-${page.id}">
            <span class="nav-num">${num}</span>
            <span class="nav-icon-wrap" aria-hidden="true">${doodle}</span>
            <span class="nav-label">${page.title}</span>
          </a>
          <button class="nav-sub-toggle" data-page="${page.id}" aria-label="Toggle Subsections">
            <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="toggle-arrow">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>
        <ul class="nav-sub-list" id="nav-sub-${page.id}"></ul>
      </li>
    `;
  }

  els.navList.innerHTML = html;
}

function setActiveNav(pageId, sectionId) {
  // 1. Manage active class on main links
  document.querySelectorAll('.nav-link').forEach(link => {
    const active = link.dataset.page === pageId;
    link.classList.toggle('active', active);
  });

  // 2. Manage active class on sub links
  document.querySelectorAll('.nav-sub-link').forEach(link => {
    const active = link.dataset.page === pageId && link.dataset.section === sectionId;
    link.classList.toggle('active', active);
  });

  // 3. Manage expanded class on nav items (expand active page, collapse others)
  document.querySelectorAll('.nav-item').forEach(item => {
    const isCurrentPageItem = item.id === `nav-item-${pageId}`;
    if (isCurrentPageItem) {
      item.classList.add('expanded');
    } else {
      item.classList.remove('expanded');
    }
  });
}

function populateSubsections(pageId, body) {
  const subListEl = document.getElementById(`nav-sub-${pageId}`);
  if (!subListEl) return;
  
  // If already populated, don't duplicate
  if (subListEl.children.length > 0) return;

  const subsections = [];
  const lines = body.split('\n');
  const usedIds = new Set();
  
  for (const line of lines) {
    const match = line.match(/^##\s+(.+)$/);
    if (match) {
      const title = match[1];
      // Strip markdown links if any in the heading title
      const cleanTitle = title.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim();
      let id = slugify(cleanTitle);
      let uniqueId = id;
      let counter = 1;
      while (usedIds.has(uniqueId)) {
        uniqueId = `${id}-${counter++}`;
      }
      usedIds.add(uniqueId);
      subsections.push({ title: cleanTitle, id: uniqueId });
    }
  }

  let html = '';
  for (const sub of subsections) {
    html += `
      <li class="nav-sub-item">
        <a href="#${pageId}:${sub.id}" class="nav-sub-link" data-page="${pageId}" data-section="${sub.id}">
          ${sub.title}
        </a>
      </li>
    `;
  }
  subListEl.innerHTML = html;
}

// ============================================================
// FETCH WITH CACHE
// ============================================================

async function fetchMarkdown(file) {
  if (contentCache[file]) return contentCache[file];
  const res = await fetch(file);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  contentCache[file] = text;
  return text;
}

// ============================================================
// HOMEPAGE — Diary/Journal hero + grid cards
// ============================================================

function buildSciCard(page) {
  const doodle = DOODLE_MAP[page.icon] || '';
  return `
    <a href="#${page.id}" class="sc-card">
      <div class="sc-card-top">
        <span class="sc-code">Entry #${page.code}</span>
        <span class="sc-icon-wrap" aria-hidden="true">${doodle}</span>
      </div>
      <div class="sc-card-body">
        <h3 class="sc-card-title">${page.title}</h3>
        <p class="sc-card-desc">${page.desc}</p>
        <div class="sc-card-action">Read Entry →</div>
      </div>
    </a>
  `;
}

function renderHomePage(body) {
  const bodyNoH1 = body.replace(/^#\s+.+\n/m, '').trim();

  const heroHtml = `
    <section class="hero">
      <div class="diary-date-header">
        <span class="diary-location">Copenhagen, Denmark</span>
        <span class="diary-date-stamp">July 2026</span>
      </div>

      <div class="hero-layout">
        <div class="hero-left">
          <div class="hero-diary-title">The Arrival Guide</div>
          <h1 class="hero-headline">
            <span class="hero-h1-line1">You've landed.</span>
            <span class="hero-h1-line2">Now navigate what's next.</span>
          </h1>
          <p class="hero-lead">A handwritten travel journal and resources hub for Indians relocating to or studying in Denmark. Whether you're starting a new job or a new degree, we've compiled all the scattered advice, checklists, and official links in one readable notebook.</p>
          <div class="hero-ctas">
            <a href="#before-you-move" class="cta-primary">Before You Move</a>
            <a href="#first-30-days" class="cta-secondary">First 30 Days</a>
          </div>
        </div>
        <div class="hero-compass-wrap" aria-hidden="true">
          ${COMPASS_SVG}
        </div>
      </div>

      <div class="hero-stats">
        <div class="hero-stat">
          <span class="hero-stat-val">~15,000</span>
          <span class="hero-stat-label">Indian Expats</span>
        </div>
        <div class="hero-stat">
          <span class="hero-stat-val">14 chapters</span>
          <span class="hero-stat-label">Detailed Guides</span>
        </div>
        <div class="hero-stat">
          <span class="hero-stat-val">CPH</span>
          <span class="hero-stat-label">Main Hub</span>
        </div>
      </div>
    </section>

    <section class="sections-section">
      <h2 class="sections-title">Journal Index & Entries</h2>
      <div class="sc-grid">
        ${PAGES.filter(p => !p.isHome).map(buildSciCard).join('')}
      </div>
    </section>

    <div class="home-content">
      <div class="markdown-body" style="padding: var(--s8) 0 0;">
        ${marked.parse(bodyNoH1)}
      </div>
    </div>
  `;

  els.markdownBody.innerHTML = heroHtml;
  els.markdownBody.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.disabled = true; });
}

// ============================================================
// SECTION PAGE — Journal HUD header
// ============================================================

function renderSectionPage(page, meta, body) {
  // Remove any previous HUD
  const prev = document.getElementById('pageHudWrap');
  if (prev) prev.remove();

  const hudEl = document.createElement('div');
  hudEl.className = 'page-hud';
  hudEl.id = 'pageHudWrap';
  hudEl.innerHTML = `
    <div class="hud-top-bar">
      <span class="hud-code">Entry #${page.code}</span>
      <span class="hud-sep">·</span>
      <span class="hud-sys">ARRIVAL.DENMARK.GOV | SECTOR ${page.code}</span>
      <span class="hud-status">ACTIVE</span>
    </div>
    <div class="hud-main">
      <div class="hud-title-block">
        <h1 class="hud-title">${page.title}</h1>
        ${meta.description ? `<p class="hud-desc">${meta.description}</p>` : ''}
      </div>
      <div class="hud-badge">
        <span class="hud-badge-code">Ch. ${page.code}</span>
        <span class="hud-badge-name">${page.title}</span>
        ${meta.updated ? `<span class="hud-badge-date">${meta.updated}</span>` : ''}
      </div>
    </div>
    <div class="hud-bottom-bar">
      <span class="hud-coord">55.6761°N 12.5683°E</span>
      ${meta.updated ? `<span class="hud-updated">Last Sync: ${meta.updated}</span>` : ''}
      ${meta.showDisclaimer ? `<span class="hud-disclaimer">⚠ Verify at Official Sources</span>` : ''}
    </div>
  `;

  els.contentArea.insertBefore(hudEl, els.contentArea.firstChild);

  const bodyNoH1 = body.replace(/^#\s+.+\n/m, '').trim();
  els.markdownBody.innerHTML = marked.parse(bodyNoH1);
  els.markdownBody.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.disabled = true; });
}

// ============================================================
// RENDER PAGE WITH 3D PAGE-FLIP TRANSITION
// ============================================================

async function renderPage(pageId, sectionId) {
  const page = PAGES.find(p => p.id === pageId);
  if (!page) { showError(); return; }

  // Fast-path: if we're already on this page, just scroll to the section
  if (currentPageId === pageId && sectionId) {
    setActiveNav(pageId, sectionId);
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.classList.add('heading-highlight');
      setTimeout(() => target.classList.remove('heading-highlight'), 2000);
    }
    return;
  }

  // If already transitioning, skip duplicate triggers
  if (activeTransition) return;

  const performRender = async () => {
    setActiveNav(pageId, sectionId);
    document.title = page.isHome
      ? 'The Arrival Guide | Denmark Relocation & Study Hub'
      : `${page.title} | The Arrival Guide`;

    try {
      const raw = await fetchMarkdown(page.file);
      const { meta, body } = parseFrontmatter(raw);

      const prevHud = document.getElementById('pageHudWrap');
      if (prevHud) prevHud.remove();

      if (page.isHome) {
        renderHomePage(body);
      } else {
        renderSectionPage(page, meta, body);
        populateSubsections(pageId, body);
      }

      renderPageNav(pageId);
      showContent();
      addHeadingIds(els.markdownBody);

      if (sectionId) {
        // Scroll to the target section after a brief delay for DOM paint
        setTimeout(() => {
          const target = document.getElementById(sectionId);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Brief highlight effect
            target.classList.add('heading-highlight');
            setTimeout(() => target.classList.remove('heading-highlight'), 2000);
          }
        }, 120);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      
      // Page Numbering Injection
      let pgNumEl = document.querySelector('.diary-page-number');
      if (!pgNumEl) {
        pgNumEl = document.createElement('div');
        pgNumEl.className = 'diary-page-number';
        els.contentArea.appendChild(pgNumEl);
      }
      pgNumEl.textContent = `Page ${page.code}`;

      indexPageForSearch(page, meta, body);
      currentPageId = pageId;
    } catch (err) {
      console.error('Failed to load page:', err);
      showError();
    }
  };

  // Check if contentArea is already visible (not initial load)
  if (els.contentArea.style.display !== 'none' && els.contentArea.offsetHeight > 0) {
    activeTransition = true;
    els.contentArea.classList.add('page-turning');
    
    // Halfway through rotation (90 deg), swap the content (visually invisible)
    setTimeout(async () => {
      await performRender();
    }, 280);

    // After animation finishes, clean up turning class
    setTimeout(() => {
      els.contentArea.classList.remove('page-turning');
      activeTransition = false;
    }, 600);
  } else {
    // Initial page load, render immediately without animations
    showLoading();
    await performRender();
  }
}

// ============================================================
// PREV / NEXT NAV
// ============================================================

function renderPageNav(currentId) {
  const idx = PAGES.findIndex(p => p.id === currentId);
  const prev = idx > 0 ? PAGES[idx - 1] : null;
  const next = idx < PAGES.length - 1 ? PAGES[idx + 1] : null;
  let html = '';
  if (prev) html += `<a href="#${prev.id}" class="page-nav-btn prev"><span class="nav-btn-label">← Previous Chapter</span><span class="nav-btn-title">${prev.title}</span></a>`;
  if (next) html += `<a href="#${next.id}" class="page-nav-btn next"><span class="nav-btn-label">Next Chapter →</span><span class="nav-btn-title">${next.title}</span></a>`;
  els.pageNav.innerHTML = html;
}

// ============================================================
// VISIBILITY HELPERS
// ============================================================

function showLoading() {
  els.loadingState.style.display = 'block';
  els.contentArea.style.display = 'none';
  els.errorState.style.display = 'none';
}
function showContent() {
  els.loadingState.style.display = 'none';
  els.contentArea.style.display = 'block';
  els.errorState.style.display = 'none';
}
function showError() {
  els.loadingState.style.display = 'none';
  els.contentArea.style.display = 'none';
  els.errorState.style.display = 'flex';
}

// ============================================================
// HASH ROUTER
// ============================================================

function parseHash() {
  const hash = window.location.hash.slice(1);
  const sepIdx = hash.indexOf(':');
  if (sepIdx !== -1) {
    const pageId = hash.slice(0, sepIdx);
    const sectionId = hash.slice(sepIdx + 1);
    return {
      pageId: PAGES.find(p => p.id === pageId) ? pageId : 'home',
      sectionId: sectionId || null
    };
  }
  return {
    pageId: PAGES.find(p => p.id === hash) ? hash : 'home',
    sectionId: null
  };
}

function handleRoute() {
  const { pageId, sectionId } = parseHash();
  renderPage(pageId, sectionId);
  closeMobileSidebar();
  closeSearch();
}

// ============================================================
// SEARCH — Fuse.js full-text
// ============================================================

function indexPageForSearch(page, meta, body) {
  const plain = body
    .replace(/#+\s/g, '').replace(/\*+/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`[^`]+`/g, '').replace(/<!--.*?-->/gs, '')
    .replace(/\|/g, ' ').replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').trim();

  const sentences = plain.split(/(?<=[.!?])\s+/);
  const chunkSize = 3;

  for (let i = 0; i < sentences.length; i += chunkSize) {
    const chunk = sentences.slice(i, i + chunkSize).join(' ');
    if (chunk.trim().length < 20) continue;
    searchIndex.push({
      id: `${page.id}-${i}`,
      pageId: page.id,
      pageTitle: page.title,
      pageIcon: page.icon,
      pageCode: page.code,
      text: chunk.slice(0, 300),
    });
  }

  fuseInstance = new Fuse(searchIndex, {
    keys: ['text', 'pageTitle'],
    threshold: 0.45,
    distance: 1000,
    ignoreLocation: true,
    minMatchCharLength: 2,
  });
}

async function preloadAllForSearch() {
  for (const page of PAGES) {
    try {
      const raw = await fetchMarkdown(page.file);
      const { meta, body } = parseFrontmatter(raw);
      indexPageForSearch(page, meta, body);
      if (page.id !== 'home') {
        populateSubsections(page.id, body);
      }
    } catch { /* skip */ }
  }
}

function performSearch(query) {
  const resultsEl = els.searchResults;
  searchHighlightIdx = -1;

  if (!query || query.trim().length < 2) {
    resultsEl.innerHTML = `<div class="search-empty">Type keywords to browse the index page…</div>`;
    return;
  }

  if (!fuseInstance) {
    resultsEl.innerHTML = `<div class="search-empty">Preparing the index, search again in a moment…</div>`;
    return;
  }

  const results = fuseInstance.search(query, { limit: 10 });

  if (!results.length) {
    resultsEl.innerHTML = `<div class="search-empty">No entries found for <strong>"${escapeHtml(query)}"</strong> in this journal.</div>`;
    return;
  }

  const seen = new Set();
  const filtered = results.filter(r => {
    if (seen.has(r.item.pageId)) return false;
    seen.add(r.item.pageId);
    return true;
  });

  resultsEl.innerHTML = filtered.map(r => {
    const item = r.item;
    const snippet = item.text.slice(0, 110) + (item.text.length > 110 ? '…' : '');
    return `
      <div class="search-result-item" data-page="${item.pageId}" role="option" tabindex="0">
        <div class="sr-code">[Chapter ${item.pageCode}] <span class="sr-section-name">${item.pageTitle}</span></div>
        <div class="sr-snippet">&gt; ${escapeHtml(snippet)}</div>
      </div>
    `;
  }).join('');

  resultsEl.querySelectorAll('.search-result-item').forEach(item => {
    item.addEventListener('click', () => navigateToResult(item.dataset.page));
    item.addEventListener('keydown', e => { if (e.key === 'Enter') navigateToResult(item.dataset.page); });
  });
}

function navigateToResult(pageId) {
  window.location.hash = pageId;
  closeSearch();
}

function moveSearchHighlight(dir) {
  const items = els.searchResults.querySelectorAll('.search-result-item');
  if (!items.length) return;
  items.forEach(i => i.classList.remove('highlighted'));
  searchHighlightIdx = Math.max(0, Math.min(items.length - 1, searchHighlightIdx + dir));
  items[searchHighlightIdx].classList.add('highlighted');
  items[searchHighlightIdx].scrollIntoView({ block: 'nearest' });
}

function selectHighlighted() {
  const h = els.searchResults.querySelector('.search-result-item.highlighted');
  if (h) navigateToResult(h.dataset.page);
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ============================================================
// SEARCH OPEN / CLOSE
// ============================================================

function openSearch() {
  els.searchOverlay.classList.add('open');
  els.searchOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  els.searchInput.value = '';
  els.searchResults.innerHTML = `<div class="search-empty">Type keywords to browse the index page…</div>`;
  searchHighlightIdx = -1;
  setTimeout(() => els.searchInput.focus(), 50);
}

function closeSearch() {
  els.searchOverlay.classList.remove('open');
  els.searchOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  els.searchInput.blur();
}

// ============================================================
// MOBILE SIDEBAR
// ============================================================

function openMobileSidebar() {
  els.sidebar.classList.add('open');
  els.sidebarBackdrop.classList.add('active');
  els.hamburgerBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMobileSidebar() {
  els.sidebar.classList.remove('open');
  els.sidebarBackdrop.classList.remove('active');
  els.hamburgerBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

// ============================================================
// EVENT BINDING
// ============================================================

function bindEvents() {
  window.addEventListener('hashchange', handleRoute);

  els.searchTriggerBtn.addEventListener('click', openSearch);
  els.mobileSearchBtn.addEventListener('click', openSearch);
  els.searchOverlayBg.addEventListener('click', closeSearch);

  let debounce;
  els.searchInput.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => performSearch(els.searchInput.value), 180);
  });

  els.searchInput.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); moveSearchHighlight(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); moveSearchHighlight(-1); }
    else if (e.key === 'Enter') { e.preventDefault(); selectHighlighted(); }
    else if (e.key === 'Escape') closeSearch();
  });

  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      els.searchOverlay.classList.contains('open') ? closeSearch() : openSearch();
    }
    if (e.key === 'Escape') {
      if (els.searchOverlay.classList.contains('open')) closeSearch();
      else closeMobileSidebar();
    }
  });

  els.hamburgerBtn.addEventListener('click', () => {
    els.sidebar.classList.contains('open') ? closeMobileSidebar() : openMobileSidebar();
  });
  els.sidebarBackdrop.addEventListener('click', closeMobileSidebar);

  // External links → new tab
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href && href.startsWith('http')) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });

  // Delegated sublist toggle click handler
  els.navList.addEventListener('click', e => {
    const toggleBtn = e.target.closest('.nav-sub-toggle');
    if (toggleBtn) {
      e.preventDefault();
      const pageId = toggleBtn.dataset.page;
      const navItem = document.getElementById(`nav-item-${pageId}`);
      if (navItem) {
        navItem.classList.toggle('expanded');
      }
    }
  });
}

// ============================================================
// INIT
// ============================================================

function init() {
  buildNav();
  bindEvents();
  handleRoute();
  setTimeout(preloadAllForSearch, 800);
}

document.addEventListener('DOMContentLoaded', init);
