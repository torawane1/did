/**
 * DID – Desi In Denmark
 * app.js — Hash router · Markdown renderer · Command palette search
 * "Landing" theme — boarding pass cards, passport stamp badges, departure board nav
 */

'use strict';

// ============================================================
// PAGE CONFIGURATION
// ============================================================

const PAGES = [
  {
    id: 'home',
    title: 'Home',
    icon: '🏠',
    file: 'content/home.md',
    desc: 'Overview, quick reference, and site guide',
    code: 'DK-00',
    sectionLabel: null,
    isHome: true,
  },
  {
    id: 'before-you-move',
    title: 'Before You Move',
    icon: '✈️',
    file: 'content/before-you-move.md',
    desc: 'Visa types, required documents, salary negotiation, timeline',
    code: 'DK-01',
    sectionLabel: 'Guides',
  },
  {
    id: 'first-30-days',
    title: 'First 30 Days',
    icon: '📅',
    file: 'content/first-30-days.md',
    desc: 'CPR number, bank account, MitID, SIM card, housing',
    code: 'DK-02',
    sectionLabel: null,
  },
  {
    id: 'money-and-tax',
    title: 'Money & Tax',
    icon: '💰',
    file: 'content/money-and-tax.md',
    desc: 'SKAT, tax card, payslips, pension, Forskerordning',
    code: 'DK-03',
    sectionLabel: null,
  },
  {
    id: 'daily-life',
    title: 'Daily Life',
    icon: '🌤️',
    file: 'content/daily-life.md',
    desc: 'Indian groceries, community groups, healthcare, weather',
    code: 'DK-04',
    sectionLabel: null,
  },
  {
    id: 'work-culture',
    title: 'Work Culture',
    icon: '💼',
    file: 'content/work-culture.md',
    desc: 'Flat hierarchy, communication norms, unions, notice periods',
    code: 'DK-05',
    sectionLabel: null,
  },
  {
    id: 'long-term',
    title: 'Long Term',
    icon: '🏡',
    file: 'content/long-term.md',
    desc: 'Permanent residency, family visas, citizenship, schooling',
    code: 'DK-06',
    sectionLabel: null,
  },
];

// ============================================================
// SVG ASSETS
// ============================================================

const COMPASS_SVG = `
<svg class="hero-compass" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <!-- Outer rings -->
  <circle cx="120" cy="120" r="108" stroke="currentColor" stroke-width="0.75" stroke-dasharray="2 9" opacity="0.22"/>
  <circle cx="120" cy="120" r="88" stroke="currentColor" stroke-width="0.5" opacity="0.12"/>
  <circle cx="120" cy="120" r="60" stroke="currentColor" stroke-width="0.75" opacity="0.18"/>
  <circle cx="120" cy="120" r="36" stroke="currentColor" stroke-width="0.5" stroke-dasharray="3 5" opacity="0.12"/>
  <!-- Cardinal lines -->
  <line x1="120" y1="8" x2="120" y2="232" stroke="currentColor" stroke-width="0.75" opacity="0.18"/>
  <line x1="8" y1="120" x2="232" y2="120" stroke="currentColor" stroke-width="0.75" opacity="0.18"/>
  <!-- Diagonal lines -->
  <line x1="42" y1="42" x2="198" y2="198" stroke="currentColor" stroke-width="0.5" opacity="0.08"/>
  <line x1="198" y1="42" x2="42" y2="198" stroke="currentColor" stroke-width="0.5" opacity="0.08"/>
  <!-- Tick marks -->
  <line x1="120" y1="12" x2="120" y2="24" stroke="currentColor" stroke-width="2" opacity="0.55"/>
  <line x1="120" y1="216" x2="120" y2="228" stroke="currentColor" stroke-width="1.5" opacity="0.35"/>
  <line x1="12" y1="120" x2="24" y2="120" stroke="currentColor" stroke-width="1.5" opacity="0.35"/>
  <line x1="216" y1="120" x2="228" y2="120" stroke="currentColor" stroke-width="1.5" opacity="0.35"/>
  <line x1="55" y1="55" x2="63" y2="63" stroke="currentColor" stroke-width="1" opacity="0.2"/>
  <line x1="177" y1="55" x2="185" y2="63" stroke="currentColor" stroke-width="1" opacity="0.2"/>
  <line x1="55" y1="185" x2="63" y2="177" stroke="currentColor" stroke-width="1" opacity="0.2"/>
  <line x1="177" y1="185" x2="185" y2="177" stroke="currentColor" stroke-width="1" opacity="0.2"/>
  <!-- North needle (Danish Red) -->
  <polygon points="120,26 127,116 120,128 113,116" fill="#C8102E" opacity="0.9"/>
  <!-- South needle (muted) -->
  <polygon points="120,214 127,124 120,112 113,124" fill="currentColor" opacity="0.28"/>
  <!-- Center pivot -->
  <circle cx="120" cy="120" r="8" fill="#131C2B" stroke="currentColor" stroke-width="0.75" opacity="0.4"/>
  <circle cx="120" cy="120" r="4" fill="#C8102E"/>
  <!-- N label -->
  <text x="112" y="11" font-family="Space Mono, monospace" font-size="10" fill="currentColor" opacity="0.55" letter-spacing="1">N</text>
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
  navList:            document.getElementById('navList'),
  loadingState:       document.getElementById('loadingState'),
  contentArea:        document.getElementById('contentArea'),
  contentDisclaimer:  document.getElementById('contentDisclaimer'),
  markdownBody:       document.getElementById('markdownBody'),
  pageNav:            document.getElementById('pageNav'),
  errorState:         document.getElementById('errorState'),

  // Search overlay
  searchOverlay:      document.getElementById('searchOverlay'),
  searchOverlayBg:    document.getElementById('searchOverlayBackdrop'),
  searchInput:        document.getElementById('searchInput'),
  searchResults:      document.getElementById('searchResults'),

  // Sidebar
  searchTriggerBtn:   document.getElementById('searchTriggerBtn'),
  sidebar:            document.getElementById('sidebar'),
  sidebarBackdrop:    document.getElementById('sidebarBackdrop'),
  hamburgerBtn:       document.getElementById('hamburgerBtn'),
  mobileSearchBtn:    document.getElementById('mobileSearchBtn'),
};

// ============================================================
// MARKDOWN CONFIG
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
      const value = line.slice(colonIdx + 1).trim();
      if (key === 'title') meta.title = value;
      else if (key === 'updated') meta.updated = value;
      else if (key === 'description') meta.description = value;
      else if (key === 'showDisclaimer') meta.showDisclaimer = value === 'true';
    }
  }

  const body = rawMd.replace(/^<!--\s*meta\s*[\s\S]*?-->/, '').trim();
  return { meta, body };
}

// ============================================================
// NAV BUILDER — Departure board style
// ============================================================

function buildNav() {
  let html = '';
  let lastSection = null;

  for (const [idx, page] of PAGES.entries()) {
    if (page.sectionLabel && page.sectionLabel !== lastSection) {
      html += `<li class="nav-section-label" aria-hidden="true">${page.sectionLabel}</li>`;
      lastSection = page.sectionLabel;
    }
    const num = String(idx).padStart(2, '0');
    html += `
      <li class="nav-item">
        <a href="#${page.id}" class="nav-link" data-page="${page.id}" data-status="OPEN →" id="nav-${page.id}">
          <span class="nav-num" aria-hidden="true">${num}</span>
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
    const isActive = link.dataset.page === pageId;
    link.classList.toggle('active', isActive);
    link.setAttribute('data-status', isActive ? 'OPEN ✓' : 'OPEN →');
  });
}

// ============================================================
// MARKDOWN FETCH WITH CACHE
// ============================================================

async function fetchMarkdown(file) {
  if (contentCache[file]) return contentCache[file];
  const response = await fetch(file);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const text = await response.text();
  contentCache[file] = text;
  return text;
}

// ============================================================
// HOMEPAGE RENDERER — Hero + Boarding Pass Cards
// ============================================================

function buildBoardingPassCard(page) {
  return `
    <a href="#${page.id}" class="bp-card">
      <div class="bp-header">
        <span class="bp-flight-num">${page.code}</span>
        <span class="bp-status">OPEN</span>
        <span class="bp-icon-wrap" aria-hidden="true">${page.icon}</span>
      </div>
      <div class="bp-tear"></div>
      <div class="bp-body">
        <h3 class="bp-title">${page.title}</h3>
        <p class="bp-desc">${page.desc}</p>
        <span class="bp-action">→ OPEN GUIDE</span>
      </div>
    </a>
  `;
}

function renderHomePage(body) {
  // Remove the h1 from body since hero shows the headline
  const bodyNoH1 = body.replace(/^#\s+.+\n/m, '').trim();

  const heroHtml = `
    <section class="hero">
      <div class="hero-arrival-line">
        <span>CPH · KASTRUP</span>
        <span>ARRIVAL</span>
        <span>IN: INDIA</span>
      </div>
      <div class="hero-layout">
        <div class="hero-left">
          <h1 class="hero-headline">
            You've<br>landed.<br>
            <em>Now what?</em>
          </h1>
          <p class="hero-lead">The practical guide for Indian tech professionals navigating every stage of life in Denmark — from visa to permanent residency.</p>
          <div class="hero-ctas">
            <a href="#before-you-move" class="cta-primary">Start here →</a>
            <a href="#first-30-days" class="cta-secondary">First 30 days →</a>
          </div>
        </div>
        <div class="hero-compass-wrap">
          ${COMPASS_SVG}
        </div>
      </div>
      <div class="hero-stats">
        <div class="hero-stat">
          <span class="hero-stat-val">~15,000</span>
          <span class="hero-stat-label">Indians in Denmark</span>
        </div>
        <div class="hero-stat">
          <span class="hero-stat-val">6 guides</span>
          <span class="hero-stat-label">Topics covered</span>
        </div>
        <div class="hero-stat">
          <span class="hero-stat-val">Jul 2026</span>
          <span class="hero-stat-label">Last updated</span>
        </div>
        <div class="hero-stat">
          <span class="hero-stat-val">Zero</span>
          <span class="hero-stat-label">Paywalls</span>
        </div>
      </div>
    </section>

    <section class="sections-section">
      <span class="sections-eyebrow">YOUR ITINERARY</span>
      <h2 class="sections-title">Where would you like to go?</h2>
      <div class="bp-grid">
        ${PAGES.filter(p => !p.isHome).map(buildBoardingPassCard).join('')}
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

  // Post-process checkboxes
  els.markdownBody.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.disabled = true; });
}

// ============================================================
// SECTION PAGE RENDERER — Stamp badge + Markdown
// ============================================================

function renderSectionPage(page, meta, body) {
  // Inject stamp header before content area
  const existingStamp = document.getElementById('pageStampWrap');
  if (existingStamp) existingStamp.remove();

  const updatedBadge = meta.updated
    ? `<div class="updated-badge">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        UPDATED: ${meta.updated.toUpperCase()}
      </div>`
    : '';

  const stampWrap = document.createElement('div');
  stampWrap.className = 'page-stamp-wrap';
  stampWrap.id = 'pageStampWrap';
  stampWrap.innerHTML = `
    <div class="page-stamp-inner">
      <div class="page-stamp-headline">
        <h1>${page.title}</h1>
        ${meta.description ? `<p class="page-stamp-desc">${meta.description}</p>` : ''}
      </div>
      <div class="page-stamp">
        <span class="stamp-code">${page.code}</span>
        <span class="stamp-name">${page.title.toUpperCase()}</span>
        ${meta.updated ? `<span class="stamp-date">${meta.updated.toUpperCase()}</span>` : ''}
      </div>
    </div>
    ${updatedBadge ? `<div style="margin-top: var(--s4); position: relative; z-index: 1;">${updatedBadge}</div>` : ''}
  `;

  // Insert before content area
  els.contentArea.insertBefore(stampWrap, els.contentArea.firstChild);

  // Strip h1 from markdown since stamp shows the title
  const bodyNoH1 = body.replace(/^#\s+.+\n/m, '').trim();
  els.markdownBody.innerHTML = marked.parse(bodyNoH1);
  els.contentDisclaimer.style.display = meta.showDisclaimer ? 'flex' : 'none';

  // Post-process checkboxes
  els.markdownBody.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.disabled = true; });
}

// ============================================================
// MAIN PAGE RENDERER
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

    // Remove any previous stamp header
    const prevStamp = document.getElementById('pageStampWrap');
    if (prevStamp) prevStamp.remove();

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
  if (prev) {
    html += `
      <a href="#${prev.id}" class="page-nav-btn prev">
        <span class="nav-btn-label">← PREVIOUS</span>
        <span class="nav-btn-title">${prev.icon} ${prev.title}</span>
      </a>`;
  }
  if (next) {
    html += `
      <a href="#${next.id}" class="page-nav-btn next">
        <span class="nav-btn-label">NEXT →</span>
        <span class="nav-btn-title">${next.icon} ${next.title}</span>
      </a>`;
  }

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
// SEARCH — Full-text via Fuse.js
// ============================================================

function indexPageForSearch(page, meta, body) {
  // Strip markdown syntax
  const plainText = body
    .replace(/#+\s/g, '')
    .replace(/\*+/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`[^`]+`/g, '')
    .replace(/<!--.*?-->/gs, '')
    .replace(/\|/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  const sentences = plainText.split(/(?<=[.!?])\s+/);
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
    } catch (e) { /* skip */ }
  }
}

function performSearch(query) {
  const resultsEl = els.searchResults;
  searchHighlightIdx = -1;

  if (!query || query.trim().length < 2) {
    resultsEl.innerHTML = `<div class="search-empty">Type to search all guides and topics…</div>`;
    return;
  }

  if (!fuseInstance) {
    resultsEl.innerHTML = `<div class="search-empty">Index loading, try again in a moment…</div>`;
    return;
  }

  const results = fuseInstance.search(query, { limit: 10 });

  if (results.length === 0) {
    resultsEl.innerHTML = `<div class="search-empty">No results for "<strong style="color:#E8EDF3">${escapeHtml(query)}</strong>" — try a different term</div>`;
    return;
  }

  // Dedupe by page
  const seen = new Set();
  const filtered = results.filter(r => {
    if (seen.has(r.item.pageId)) return false;
    seen.add(r.item.pageId);
    return true;
  });

  resultsEl.innerHTML = filtered.map(result => {
    const item = result.item;
    const snippet = item.text.slice(0, 110) + (item.text.length > 110 ? '…' : '');
    return `
      <div class="search-result-item" data-page="${item.pageId}" role="option" tabindex="0">
        <div class="sr-section">${item.pageIcon} <span>${item.pageCode} · ${item.pageTitle}</span></div>
        <div class="sr-snippet">${escapeHtml(snippet)}</div>
      </div>
    `;
  }).join('');

  // Bind click / keyboard
  resultsEl.querySelectorAll('.search-result-item').forEach(item => {
    item.addEventListener('click', () => navigateToResult(item.dataset.page));
    item.addEventListener('keydown', e => { if (e.key === 'Enter') navigateToResult(item.dataset.page); });
  });
}

function navigateToResult(pageId) {
  window.location.hash = pageId;
  closeSearch();
}

// Arrow key navigation in search results
function moveSearchHighlight(dir) {
  const items = els.searchResults.querySelectorAll('.search-result-item');
  if (!items.length) return;
  items.forEach(i => i.classList.remove('highlighted'));
  searchHighlightIdx = Math.max(0, Math.min(items.length - 1, searchHighlightIdx + dir));
  items[searchHighlightIdx].classList.add('highlighted');
  items[searchHighlightIdx].scrollIntoView({ block: 'nearest' });
}

function selectHighlighted() {
  const highlighted = els.searchResults.querySelector('.search-result-item.highlighted');
  if (highlighted) navigateToResult(highlighted.dataset.page);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ============================================================
// COMMAND PALETTE OPEN / CLOSE
// ============================================================

function openSearch() {
  els.searchOverlay.classList.add('open');
  els.searchOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  // Reset state
  els.searchInput.value = '';
  els.searchResults.innerHTML = `<div class="search-empty">Type to search all guides and topics…</div>`;
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
  // Routing
  window.addEventListener('hashchange', handleRoute);

  // Search trigger buttons
  els.searchTriggerBtn.addEventListener('click', openSearch);
  els.mobileSearchBtn.addEventListener('click', openSearch);

  // Search overlay backdrop
  els.searchOverlayBg.addEventListener('click', closeSearch);

  // Search input
  let searchTimeout;
  els.searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => performSearch(els.searchInput.value), 180);
  });

  // Arrow keys in search
  els.searchInput.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); moveSearchHighlight(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); moveSearchHighlight(-1); }
    else if (e.key === 'Enter') { e.preventDefault(); selectHighlighted(); }
    else if (e.key === 'Escape') closeSearch();
  });

  // Global keyboard shortcuts
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (els.searchOverlay.classList.contains('open')) closeSearch();
      else openSearch();
    }
    if (e.key === 'Escape') {
      if (els.searchOverlay.classList.contains('open')) closeSearch();
      else closeMobileSidebar();
    }
  });

  // Mobile hamburger
  els.hamburgerBtn.addEventListener('click', () => {
    els.sidebar.classList.contains('open') ? closeMobileSidebar() : openMobileSidebar();
  });

  // Sidebar backdrop
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
  // Pre-index all content for search (background, after initial render)
  setTimeout(preloadAllForSearch, 800);
}

document.addEventListener('DOMContentLoaded', init);
