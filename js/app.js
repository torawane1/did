/**
 * DID – Desi In Denmark
 * app.js — Sci-fi "Dataport Denmark" theme
 * Hash router · Markdown renderer · Command palette search
 */

'use strict';

// ============================================================
// PAGE CONFIGURATION
// ============================================================

const PAGES = [
  {
    id: 'home',
    title: 'Home',
    icon: '⬡',
    file: 'content/home.md',
    desc: 'Overview, quick reference, and site guide',
    code: 'DK-00',
    sectionLabel: null,
    isHome: true,
  },
  {
    id: 'before-you-move',
    title: 'Before You Move',
    icon: '✈',
    file: 'content/before-you-move.md',
    desc: 'Visa types, required documents, salary negotiation, timeline',
    code: 'DK-01',
    sectionLabel: 'GUIDES',
  },
  {
    id: 'first-30-days',
    title: 'First 30 Days',
    icon: '◎',
    file: 'content/first-30-days.md',
    desc: 'CPR number, bank account, MitID, SIM card, housing',
    code: 'DK-02',
    sectionLabel: null,
  },
  {
    id: 'money-and-tax',
    title: 'Money & Tax',
    icon: '◈',
    file: 'content/money-and-tax.md',
    desc: 'SKAT, tax card, payslips, pension, Forskerordning',
    code: 'DK-03',
    sectionLabel: null,
  },
  {
    id: 'daily-life',
    title: 'Daily Life',
    icon: '◌',
    file: 'content/daily-life.md',
    desc: 'Indian groceries, community groups, healthcare, weather',
    code: 'DK-04',
    sectionLabel: null,
  },
  {
    id: 'work-culture',
    title: 'Work Culture',
    icon: '◧',
    file: 'content/work-culture.md',
    desc: 'Flat hierarchy, communication norms, unions, notice periods',
    code: 'DK-05',
    sectionLabel: null,
  },
  {
    id: 'long-term',
    title: 'Long Term',
    icon: '⬟',
    file: 'content/long-term.md',
    desc: 'Permanent residency, family visas, citizenship, schooling',
    code: 'DK-06',
    sectionLabel: null,
  },
];

// ============================================================
// RADAR SVG — animated scanner
// ============================================================

const RADAR_SVG = `
<svg class="radar-svg" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <!-- Outer rings -->
  <circle cx="100" cy="100" r="92" stroke="#00CFEF" stroke-width="0.5" opacity="0.18" stroke-dasharray="3 8"/>
  <circle cx="100" cy="100" r="72" stroke="#00CFEF" stroke-width="0.5" opacity="0.22"/>
  <circle cx="100" cy="100" r="52" stroke="#00CFEF" stroke-width="0.5" opacity="0.22"/>
  <circle cx="100" cy="100" r="32" stroke="#00CFEF" stroke-width="0.5" opacity="0.18"/>
  <!-- Cardinal cross-hairs -->
  <line x1="100" y1="8" x2="100" y2="192" stroke="#00CFEF" stroke-width="0.3" opacity="0.18"/>
  <line x1="8" y1="100" x2="192" y2="100" stroke="#00CFEF" stroke-width="0.3" opacity="0.18"/>
  <!-- Diagonal lines -->
  <line x1="35" y1="35" x2="165" y2="165" stroke="#00CFEF" stroke-width="0.3" opacity="0.06"/>
  <line x1="165" y1="35" x2="35" y2="165" stroke="#00CFEF" stroke-width="0.3" opacity="0.06"/>
  <!-- Tick marks -->
  <line x1="100" y1="8" x2="100" y2="18" stroke="#00CFEF" stroke-width="2" opacity="0.6"/>
  <line x1="100" y1="182" x2="100" y2="192" stroke="#00CFEF" stroke-width="1.5" opacity="0.4"/>
  <line x1="8" y1="100" x2="18" y2="100" stroke="#00CFEF" stroke-width="1.5" opacity="0.4"/>
  <line x1="182" y1="100" x2="192" y2="100" stroke="#00CFEF" stroke-width="1.5" opacity="0.4"/>
  <!-- Blips -->
  <circle cx="132" cy="62" r="3" fill="#00E87A" class="radar-blip blip-1"/>
  <circle cx="72" cy="148" r="2.5" fill="#00CFEF" class="radar-blip blip-2"/>
  <circle cx="158" cy="115" r="2" fill="#00CFEF" class="radar-blip blip-3"/>
  <circle cx="58" cy="72" r="2.5" fill="#9B5FFF" class="radar-blip blip-4"/>
  <!-- Blip rings (static glow) -->
  <circle cx="132" cy="62" r="7" stroke="#00E87A" stroke-width="0.5" opacity="0.3"/>
  <circle cx="72" cy="148" r="6" stroke="#00CFEF" stroke-width="0.5" opacity="0.2"/>
  <!-- Center -->
  <circle cx="100" cy="100" r="5" fill="none" stroke="#00CFEF" stroke-width="1" opacity="0.5"/>
  <circle cx="100" cy="100" r="2.5" fill="#00CFEF" opacity="0.9"/>
  <!-- DK label -->
  <text x="109" y="98" font-family="Orbitron,monospace" font-size="6" fill="#00CFEF" opacity="0.45" letter-spacing="3">DK</text>
  <!-- Coord labels -->
  <text x="88" y="15" font-family="Space Mono,monospace" font-size="5" fill="#00CFEF" opacity="0.3" letter-spacing="1">N</text>
  <text x="88" y="197" font-family="Space Mono,monospace" font-size="5" fill="#00CFEF" opacity="0.3" letter-spacing="1">S</text>
  <text x="2" y="103" font-family="Space Mono,monospace" font-size="5" fill="#00CFEF" opacity="0.3" letter-spacing="1">W</text>
  <text x="188" y="103" font-family="Space Mono,monospace" font-size="5" fill="#00CFEF" opacity="0.3" letter-spacing="1">E</text>
</svg>`;

// ============================================================
// STATE & CACHE
// ============================================================

const contentCache = {};
let fuseInstance = null;
let searchIndex = [];
let searchHighlightIdx = -1;

// ============================================================
// DOM REFERENCES
// ============================================================

const els = {
  navList:           document.getElementById('navList'),
  loadingState:      document.getElementById('loadingState'),
  contentArea:       document.getElementById('contentArea'),
  contentDisclaimer: document.getElementById('contentDisclaimer'),
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
    const num = String(idx).padStart(2, '0');
    html += `
      <li class="nav-item">
        <a href="#${page.id}" class="nav-link" data-page="${page.id}" data-status="OPEN" id="nav-${page.id}">
          <span class="nav-num">${num}</span>
          <span class="nav-icon" aria-hidden="true">${page.icon}</span>
          <span class="nav-label">${page.title}</span>
        </a>
      </li>
    `;
  }

  els.navList.innerHTML = html;
}

function setActiveNav(pageId) {
  document.querySelectorAll('.nav-link').forEach(link => {
    const active = link.dataset.page === pageId;
    link.classList.toggle('active', active);
    link.setAttribute('data-status', active ? 'ACTIVE' : 'OPEN');
  });
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
// HOMEPAGE — Sci-fi hero + grid cards
// ============================================================

function buildSciCard(page) {
  return `
    <a href="#${page.id}" class="sc-card">
      <div class="sc-card-top">
        <span class="sc-code">${page.code}</span>
        <span class="sc-status">
          <span class="sc-status-dot"></span>OPEN
        </span>
        <span class="sc-icon" aria-hidden="true">${page.icon}</span>
      </div>
      <div class="sc-card-body">
        <h3 class="sc-card-title">${page.title.toUpperCase()}</h3>
        <p class="sc-card-desc">${page.desc}</p>
        <div class="sc-card-action">// ACCESS GUIDE →</div>
      </div>
    </a>
  `;
}

function renderHomePage(body) {
  const bodyNoH1 = body.replace(/^#\s+.+\n/m, '').trim();

  const heroHtml = `
    <section class="hero">
      <div class="hero-sys-line">
        <span class="hero-sys-tag">SYS://DID.DENMARK.GOV</span>
        <span class="hero-sys-status">ONLINE</span>
        <span class="hero-sys-coord">55.6761°N 12.5683°E — CPH KASTRUP</span>
      </div>

      <div class="hero-layout">
        <div class="hero-left">
          <div class="hero-init-label">// ARRIVAL GUIDE — INITIALIZED</div>
          <h1 class="hero-headline">
            <span class="hero-h1-line1">You've</span>
            <span class="hero-h1-line2">Landed.</span>
            <span class="hero-h1-line3">Now navigate what's next.</span>
          </h1>
          <p class="hero-lead">Complete navigation system for Indian tech professionals relocating to Denmark. From visa application to permanent residency — all in one place.</p>
          <div class="hero-ctas">
            <a href="#before-you-move" class="cta-primary">[ INIT SEQUENCE ]</a>
            <a href="#first-30-days" class="cta-secondary">[ FIRST 30 DAYS ]</a>
          </div>
        </div>
        <div class="hero-radar-wrap" aria-hidden="true">
          ${RADAR_SVG}
          <div class="radar-sweep-wrap">
            <div class="radar-sweep"></div>
          </div>
        </div>
      </div>

      <div class="hero-stats">
        <div class="hero-stat">
          <span class="hero-stat-val">~15,000</span>
          <span class="hero-stat-label">Indians in Denmark</span>
        </div>
        <div class="hero-stat">
          <span class="hero-stat-val">6 sectors</span>
          <span class="hero-stat-label">Coverage modules</span>
        </div>
        <div class="hero-stat">
          <span class="hero-stat-val">Jul 2026</span>
          <span class="hero-stat-label">Last sync</span>
        </div>
        <div class="hero-stat">
          <span class="hero-stat-val">ZERO</span>
          <span class="hero-stat-label">Paywalls</span>
        </div>
      </div>
    </section>

    <section class="sections-section">
      <span class="sections-eyebrow">// SELECT SECTOR</span>
      <h2 class="sections-title">Navigation Matrix</h2>
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
  els.contentDisclaimer.style.display = 'none';
  els.markdownBody.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.disabled = true; });
}

// ============================================================
// SECTION PAGE — HUD header
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
      <span class="hud-code">${page.code}</span>
      <span class="hud-sep">·</span>
      <span class="hud-sys">DID.DENMARK.GOV // SECTOR ${page.code}</span>
      <span class="hud-status">ACTIVE</span>
    </div>
    <div class="hud-main">
      <div class="hud-title-block">
        <h1 class="hud-title">${page.title}</h1>
        ${meta.description ? `<p class="hud-desc">${meta.description}</p>` : ''}
      </div>
      <div class="hud-badge">
        <span class="hud-badge-code">${page.code}</span>
        <span class="hud-badge-name">${page.title.toUpperCase()}</span>
        ${meta.updated ? `<span class="hud-badge-date">${meta.updated.toUpperCase()}</span>` : ''}
      </div>
    </div>
    <div class="hud-bottom-bar">
      <span class="hud-coord">55.6761°N 12.5683°E</span>
      ${meta.updated ? `<span class="hud-updated">LAST SYNC: ${meta.updated.toUpperCase()}</span>` : ''}
      ${meta.showDisclaimer ? `<span class="hud-disclaimer">⚠ VERIFY AT OFFICIAL SOURCES</span>` : ''}
    </div>
  `;

  els.contentArea.insertBefore(hudEl, els.contentArea.firstChild);

  const bodyNoH1 = body.replace(/^#\s+.+\n/m, '').trim();
  els.markdownBody.innerHTML = marked.parse(bodyNoH1);
  els.contentDisclaimer.style.display = meta.showDisclaimer ? 'flex' : 'none';
  els.markdownBody.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.disabled = true; });
}

// ============================================================
// RENDER PAGE
// ============================================================

async function renderPage(pageId) {
  const page = PAGES.find(p => p.id === pageId);
  if (!page) { showError(); return; }

  showLoading();
  setActiveNav(pageId);

  document.title = page.isHome
    ? 'DID – Desi In Denmark | Resource Hub for Indian Tech Professionals'
    : `${page.title} | DID – Desi In Denmark`;

  try {
    const raw = await fetchMarkdown(page.file);
    const { meta, body } = parseFrontmatter(raw);

    const prevHud = document.getElementById('pageHudWrap');
    if (prevHud) prevHud.remove();

    if (page.isHome) {
      renderHomePage(body);
    } else {
      renderSectionPage(page, meta, body);
    }

    renderPageNav(pageId);
    showContent();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    els.contentArea.focus({ preventScroll: true });

    indexPageForSearch(page, meta, body);
  } catch (err) {
    console.error('Failed to load page:', err);
    showError();
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
  if (prev) html += `<a href="#${prev.id}" class="page-nav-btn prev"><span class="nav-btn-label">← PREV SECTOR</span><span class="nav-btn-title">${prev.icon} ${prev.title}</span></a>`;
  if (next) html += `<a href="#${next.id}" class="page-nav-btn next"><span class="nav-btn-label">NEXT SECTOR →</span><span class="nav-btn-title">${next.icon} ${next.title}</span></a>`;
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

function getPageFromHash() {
  const hash = window.location.hash.slice(1);
  return PAGES.find(p => p.id === hash) ? hash : 'home';
}

function handleRoute() {
  renderPage(getPageFromHash());
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
    threshold: 0.35,
    minMatchCharLength: 2,
  });
}

async function preloadAllForSearch() {
  for (const page of PAGES) {
    try {
      const raw = await fetchMarkdown(page.file);
      const { meta, body } = parseFrontmatter(raw);
      indexPageForSearch(page, meta, body);
    } catch { /* skip */ }
  }
}

function performSearch(query) {
  const resultsEl = els.searchResults;
  searchHighlightIdx = -1;

  if (!query || query.trim().length < 2) {
    resultsEl.innerHTML = `<div class="search-empty">&gt;_ TYPE TO QUERY ALL SECTORS…</div>`;
    return;
  }

  if (!fuseInstance) {
    resultsEl.innerHTML = `<div class="search-empty">&gt;_ INDEX LOADING — RETRY MOMENTARILY…</div>`;
    return;
  }

  const results = fuseInstance.search(query, { limit: 10 });

  if (!results.length) {
    resultsEl.innerHTML = `<div class="search-empty">&gt;_ NO RESULTS FOR <strong>"${escapeHtml(query)}"</strong> — SECTOR UNKNOWN</div>`;
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
        <div class="sr-code">[${item.pageCode}] <span class="sr-section-name">${item.pageTitle.toUpperCase()}</span></div>
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
  els.searchResults.innerHTML = `<div class="search-empty">&gt;_ TYPE TO QUERY ALL SECTORS…</div>`;
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
