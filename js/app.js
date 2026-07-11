/**
 * DID – Desi In Denmark
 * app.js — Hash-based SPA router + markdown renderer + search
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
    sectionLabel: null,
  },
  {
    id: 'before-you-move',
    title: 'Before You Move',
    icon: '✈️',
    file: 'content/before-you-move.md',
    sectionLabel: 'Guides',
  },
  {
    id: 'first-30-days',
    title: 'First 30 Days',
    icon: '📅',
    file: 'content/first-30-days.md',
    sectionLabel: null,
  },
  {
    id: 'money-and-tax',
    title: 'Money & Tax',
    icon: '💰',
    file: 'content/money-and-tax.md',
    sectionLabel: null,
  },
  {
    id: 'daily-life',
    title: 'Daily Life',
    icon: '🌤️',
    file: 'content/daily-life.md',
    sectionLabel: null,
  },
  {
    id: 'work-culture',
    title: 'Work Culture',
    icon: '💼',
    file: 'content/work-culture.md',
    sectionLabel: null,
  },
  {
    id: 'long-term',
    title: 'Long Term',
    icon: '🏡',
    file: 'content/long-term.md',
    sectionLabel: null,
  },
];

// Cache of fetched markdown content
const contentCache = {};

// Fuse search index
let fuseInstance = null;
let searchIndex = [];

// ============================================================
// DOM REFERENCES
// ============================================================

const els = {
  navList: document.getElementById('navList'),
  loadingState: document.getElementById('loadingState'),
  contentArea: document.getElementById('contentArea'),
  contentMeta: document.getElementById('contentMeta'),
  contentDisclaimer: document.getElementById('contentDisclaimer'),
  markdownBody: document.getElementById('markdownBody'),
  pageNav: document.getElementById('pageNav'),
  errorState: document.getElementById('errorState'),

  // Search (sidebar)
  searchInput: document.getElementById('searchInput'),
  searchResults: document.getElementById('searchResults'),

  // Mobile
  hamburgerBtn: document.getElementById('hamburgerBtn'),
  sidebarBackdrop: document.getElementById('sidebarBackdrop'),
  sidebar: document.getElementById('sidebar'),
  mobileSearchBtn: document.getElementById('mobileSearchBtn'),
  mobileSearchOverlay: document.getElementById('mobileSearchOverlay'),
  mobileSearchInput: document.getElementById('mobileSearchInput'),
  mobileSearchResults: document.getElementById('mobileSearchResults'),
  mobileSearchClose: document.getElementById('mobileSearchClose'),
};

// ============================================================
// MARKDOWN CONFIGURATION
// ============================================================

marked.setOptions({
  breaks: true,
  gfm: true,
});

// ============================================================
// FRONTMATTER PARSER
// Parses <!-- meta ... --> comment at top of markdown
// ============================================================

function parseFrontmatter(rawMd) {
  const metaMatch = rawMd.match(/^<!--\s*meta\s*([\s\S]*?)-->/);
  const meta = {
    title: '',
    updated: '',
    description: '',
    showDisclaimer: false,
  };

  if (metaMatch) {
    const block = metaMatch[1];
    const lines = block.trim().split('\n');
    for (const line of lines) {
      const [key, ...rest] = line.trim().split(':');
      if (!key) continue;
      const value = rest.join(':').trim();
      if (key === 'title') meta.title = value;
      else if (key === 'updated') meta.updated = value;
      else if (key === 'description') meta.description = value;
      else if (key === 'showDisclaimer') meta.showDisclaimer = value === 'true';
    }
  }

  // Strip the frontmatter from the markdown body
  const body = rawMd.replace(/^<!--\s*meta\s*[\s\S]*?-->/, '').trim();
  return { meta, body };
}

// ============================================================
// NAV BUILDER
// ============================================================

function buildNav() {
  let html = '';
  let lastSection = null;

  for (const page of PAGES) {
    if (page.sectionLabel && page.sectionLabel !== lastSection) {
      html += `<li class="nav-section-label">${page.sectionLabel}</li>`;
      lastSection = page.sectionLabel;
    }
    html += `
      <li class="nav-item">
        <a href="#${page.id}" class="nav-link" data-page="${page.id}" id="nav-${page.id}">
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
    link.classList.toggle('active', link.dataset.page === pageId);
  });
}

// ============================================================
// CONTENT RENDERER
// ============================================================

async function fetchMarkdown(file) {
  if (contentCache[file]) return contentCache[file];

  const response = await fetch(file);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const text = await response.text();
  contentCache[file] = text;
  return text;
}

async function renderPage(pageId) {
  const page = PAGES.find(p => p.id === pageId);
  if (!page) {
    showError();
    return;
  }

  showLoading();
  setActiveNav(pageId);

  // Update document title
  document.title = page.id === 'home'
    ? 'DID – Desi In Denmark | Resource Hub for Indian Tech Professionals'
    : `${page.title} | DID – Desi In Denmark`;

  try {
    const raw = await fetchMarkdown(page.file);
    const { meta, body } = parseFrontmatter(raw);

    // Render content meta bar
    renderContentMeta(page, meta);

    // Show/hide disclaimer
    els.contentDisclaimer.style.display = meta.showDisclaimer ? 'flex' : 'none';

    // Render markdown → HTML
    els.markdownBody.innerHTML = marked.parse(body);

    // Enable task-list checkboxes (make them visual only)
    els.markdownBody.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.disabled = true;
    });

    // Render prev/next nav
    renderPageNav(pageId);

    showContent();

    // Scroll to top of content (important on mobile)
    window.scrollTo({ top: 0, behavior: 'smooth' });
    els.contentArea.focus({ preventScroll: true });

    // Index this page for search
    indexPageForSearch(page, meta, body);

  } catch (err) {
    console.error('Failed to load page:', err);
    showError();
  }
}

// ============================================================
// CONTENT META BAR
// ============================================================

function renderContentMeta(page, meta) {
  const updated = meta.updated
    ? `<span class="content-updated">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        Last updated: ${meta.updated}
      </span>`
    : '';

  els.contentMeta.innerHTML = `
    <span class="content-section-title">${page.icon} ${page.title}</span>
    ${updated}
  `;
}

// ============================================================
// PREV / NEXT PAGE NAVIGATION
// ============================================================

function renderPageNav(currentId) {
  const idx = PAGES.findIndex(p => p.id === currentId);
  const prev = idx > 0 ? PAGES[idx - 1] : null;
  const next = idx < PAGES.length - 1 ? PAGES[idx + 1] : null;

  let html = '';

  if (prev) {
    html += `
      <a href="#${prev.id}" class="page-nav-btn prev">
        <span class="nav-btn-label">← Previous</span>
        <span class="nav-btn-title">${prev.icon} ${prev.title}</span>
      </a>
    `;
  }

  if (next) {
    html += `
      <a href="#${next.id}" class="page-nav-btn next">
        <span class="nav-btn-label">Next →</span>
        <span class="nav-btn-title">${next.icon} ${next.title}</span>
      </a>
    `;
  }

  els.pageNav.innerHTML = html;
}

// ============================================================
// STATE VISIBILITY HELPERS
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
  const hash = window.location.hash.slice(1); // remove '#'
  const page = PAGES.find(p => p.id === hash);
  return page ? page.id : 'home';
}

function handleRoute() {
  const pageId = getPageFromHash();
  renderPage(pageId);
  closeMobileSidebar();
}

// ============================================================
// SEARCH
// ============================================================

function indexPageForSearch(page, meta, body) {
  // Strip markdown syntax for plain-text indexing
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

  // Split into chunks for better search granularity
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
      text: chunk.slice(0, 300),
    });
  }

  rebuildFuse();
}

function rebuildFuse() {
  fuseInstance = new Fuse(searchIndex, {
    keys: ['text', 'pageTitle'],
    threshold: 0.35,
    includeMatches: true,
    minMatchCharLength: 2,
  });
}

function performSearch(query, resultsEl) {
  if (!query || query.trim().length < 2) {
    resultsEl.innerHTML = '';
    resultsEl.classList.add('hidden');
    return;
  }

  if (!fuseInstance) {
    resultsEl.innerHTML = `<div class="search-no-results">Index loading…</div>`;
    resultsEl.classList.remove('hidden');
    return;
  }

  const results = fuseInstance.search(query, { limit: 8 });

  if (results.length === 0) {
    resultsEl.innerHTML = `<div class="search-no-results">No results for "<strong>${escapeHtml(query)}</strong>"</div>`;
    resultsEl.classList.remove('hidden');
    return;
  }

  // Dedupe by pageId — prefer first match per page but show up to 6 distinct results
  const seen = new Set();
  const filtered = results.filter(r => {
    if (seen.has(r.item.pageId)) return false;
    seen.add(r.item.pageId);
    return true;
  });

  const html = filtered.map(result => {
    const item = result.item;
    const snippet = item.text.slice(0, 120) + (item.text.length > 120 ? '…' : '');
    return `
      <div class="search-result-item" data-page="${item.pageId}" role="option" tabindex="0">
        <div class="sr-page">${item.pageIcon} ${item.pageTitle}</div>
        <div class="sr-snippet">${escapeHtml(snippet)}</div>
      </div>
    `;
  }).join('');

  resultsEl.innerHTML = html;
  resultsEl.classList.remove('hidden');

  // Bind click events to results
  resultsEl.querySelectorAll('.search-result-item').forEach(item => {
    item.addEventListener('click', () => {
      const pageId = item.dataset.page;
      window.location.hash = pageId;
      resultsEl.innerHTML = '';
      resultsEl.classList.add('hidden');
      els.searchInput.value = '';
      els.mobileSearchInput.value = '';
      closeMobileSearch();
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') item.click();
    });
  });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Pre-load all pages for search indexing in the background
async function preloadAllForSearch() {
  for (const page of PAGES) {
    try {
      const raw = await fetchMarkdown(page.file);
      const { meta, body } = parseFrontmatter(raw);
      indexPageForSearch(page, meta, body);
    } catch (e) {
      // Silently skip failed pages
    }
  }
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
// MOBILE SEARCH OVERLAY
// ============================================================

function openMobileSearch() {
  els.mobileSearchOverlay.classList.add('active');
  setTimeout(() => els.mobileSearchInput.focus(), 100);
  document.body.style.overflow = 'hidden';
}

function closeMobileSearch() {
  els.mobileSearchOverlay.classList.remove('active');
  els.mobileSearchResults.innerHTML = '';
  document.body.style.overflow = '';
}

// ============================================================
// KEYBOARD SHORTCUTS
// ============================================================

document.addEventListener('keydown', (e) => {
  // Cmd/Ctrl+K → focus search
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    if (window.innerWidth <= 900) {
      openMobileSearch();
    } else {
      els.searchInput.focus();
      els.searchInput.select();
    }
  }

  // Escape → close search results / mobile sidebar / mobile search
  if (e.key === 'Escape') {
    els.searchResults.classList.add('hidden');
    els.searchInput.blur();
    closeMobileSidebar();
    closeMobileSearch();
  }
});

// ============================================================
// EVENT LISTENERS
// ============================================================

function bindEvents() {
  // Hash change → route
  window.addEventListener('hashchange', handleRoute);

  // Mobile hamburger
  els.hamburgerBtn.addEventListener('click', () => {
    const isOpen = els.sidebar.classList.contains('open');
    isOpen ? closeMobileSidebar() : openMobileSidebar();
  });

  // Sidebar backdrop click
  els.sidebarBackdrop.addEventListener('click', closeMobileSidebar);

  // Mobile search toggle
  els.mobileSearchBtn.addEventListener('click', openMobileSearch);
  els.mobileSearchClose.addEventListener('click', closeMobileSearch);

  // Click outside mobile search overlay (on backdrop)
  els.mobileSearchOverlay.addEventListener('click', (e) => {
    if (e.target === els.mobileSearchOverlay) closeMobileSearch();
  });

  // Sidebar search input
  let sidebarSearchTimeout;
  els.searchInput.addEventListener('input', () => {
    clearTimeout(sidebarSearchTimeout);
    sidebarSearchTimeout = setTimeout(() => {
      performSearch(els.searchInput.value, els.searchResults);
    }, 200);
  });

  // Hide search results on blur (after a tiny delay so click fires first)
  els.searchInput.addEventListener('blur', () => {
    setTimeout(() => els.searchResults.classList.add('hidden'), 150);
  });
  els.searchInput.addEventListener('focus', () => {
    if (els.searchInput.value.length >= 2) {
      els.searchResults.classList.remove('hidden');
    }
  });

  // Mobile search input
  let mobileSearchTimeout;
  els.mobileSearchInput.addEventListener('input', () => {
    clearTimeout(mobileSearchTimeout);
    mobileSearchTimeout = setTimeout(() => {
      performSearch(els.mobileSearchInput.value, els.mobileSearchResults);
    }, 200);
  });

  // External links in content → open in new tab
  document.addEventListener('click', (e) => {
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

  // Pre-load all content for search in the background
  // (small delay to not block initial page render)
  setTimeout(preloadAllForSearch, 500);
}

document.addEventListener('DOMContentLoaded', init);
