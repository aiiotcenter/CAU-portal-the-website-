/**
 * ==============================================================================
 * CYPRUS AYDIN UNIVERSITY (CAU) — CANONICAL GLOBAL SHELL CONTROLLER
 * Architecture: Swiss Editorial Design System (Figma Baseline Standard)
 * Directional Masthead • Navigation Overlay • Theme & Language Switchers • Quick Search
 * ==============================================================================
 */

(() => {
  'use strict';

  if (window.CAU_SHELL_INITIALIZED) return;
  window.CAU_SHELL_INITIALIZED = true;

  /* --------------------------------------------------------------------------
     1. THEME SWITCHER WITH LOCALSTORAGE PERSISTENCE
     -------------------------------------------------------------------------- */
  const themeStorageKey = 'cau-theme';
  const normaliseTheme = (value) => (value === 'dark' ? 'dark' : 'light');

  const applyTheme = (value, persist = true) => {
    const theme = normaliseTheme(value);
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;

    if (persist) {
      try {
        localStorage.setItem(themeStorageKey, theme);
      } catch {}
    }

    document.querySelectorAll('[data-theme-mode]').forEach((button) => {
      const active = button.dataset.themeMode === theme;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    window.dispatchEvent(new CustomEvent('cau-theme-change', { detail: { theme } }));
  };

  window.CAU_SET_THEME = applyTheme;
  try {
    applyTheme(localStorage.getItem(themeStorageKey), false);
  } catch {
    applyTheme('light', false);
  }

  document.addEventListener('click', (e) => {
    const themeBtn = e.target.closest('[data-theme-mode]');
    if (!themeBtn) return;
    const mode = themeBtn.dataset.themeMode;
    if (mode) applyTheme(mode, true);
  });

  /* --------------------------------------------------------------------------
     2. DIRECTIONAL STICKY MASTHEAD (Hide on down-scroll, reveal on up-scroll)
     -------------------------------------------------------------------------- */
  const siteHeader = document.querySelector('.site-header');
  let lastScrollY = window.scrollY;
  let ticking = false;

  const updateHeader = () => {
    if (!siteHeader) return;
    const currentY = Math.max(0, window.scrollY);
    const delta = currentY - lastScrollY;

    if (document.body.classList.contains('cau-nav-open') || document.querySelector('.cau-nav-overlay.is-open')) {
      siteHeader.classList.remove('is-hidden');
      ticking = false;
      return;
    }

    if (currentY <= 12) {
      siteHeader.classList.remove('is-hidden');
    } else if (currentY > siteHeader.offsetHeight) {
      siteHeader.classList.add('is-hidden');
    }

    lastScrollY = currentY;
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    },
    { passive: true }
  );

  /* --------------------------------------------------------------------------
     3. FULLSCREEN NAVIGATION OVERLAY DRAWER
     -------------------------------------------------------------------------- */
  const initNavOverlay = () => {
    // Mobile navigation overlay controller is safely delegated to shared-footer.js
  };

  /* --------------------------------------------------------------------------
     4. GLOBAL QUICK SEARCH COMMAND PALETTE (Ctrl+K / ⌘K)
     -------------------------------------------------------------------------- */
  const PALETTE_ITEMS = [
    { title: 'Apply for Admission', sub: 'Online application portal for 2026-2027', icon: 'fa-user-graduate', url: '/admission.html' },
    { title: 'Academic Offerings', sub: 'Explore all Undergraduate, Master & PhD programs', icon: 'fa-book-open', url: '/programs.html' },
    { title: 'Scholarships & Grants', sub: '50% to 85% international scholarship awards', icon: 'fa-award', url: '/scholarships.html' },
    { title: 'Tuition Fees & Cost', sub: 'Official fee schedules by faculty and degree', icon: 'fa-receipt', url: '/tuition.html' },
    { title: 'International Students', sub: 'Visa guidelines, accommodation & arrival services', icon: 'fa-globe', url: '/international.html' },
    { title: 'Campus FAQ Database', sub: 'Frequently asked questions & student support', icon: 'fa-circle-question', url: '/faq.html' },
    { title: 'About Cyprus Aydin University', sub: 'History, leadership, and accreditation', icon: 'fa-landmark', url: '/about.html' },
    { title: 'Contact & Campus Directory', sub: 'Official WhatsApp desk, emails, and directory', icon: 'fa-envelope', url: '/contact.html' }
  ];

  const initCommandPalette = () => {
    let backdrop = document.getElementById('cauPaletteBackdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'cauPaletteBackdrop';
      backdrop.innerHTML = `
        <div class="cau-palette-modal" role="dialog" aria-modal="true" aria-label="Search site">
          <div class="cau-palette-header">
            <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
            <input type="text" class="cau-palette-input" placeholder="Type a destination, program, or question..." aria-label="Search query" />
            <kbd style="font-size: 11px; background: var(--cau-soft); padding: 2px 6px; border: 1px solid var(--cau-line); border-radius: 4px;">ESC</kbd>
          </div>
          <div class="cau-palette-results"></div>
        </div>
      `;
      document.body.appendChild(backdrop);
    }

    const input = backdrop.querySelector('.cau-palette-input');
    const results = backdrop.querySelector('.cau-palette-results');

    const renderResults = (query = '') => {
      const q = query.trim().toLowerCase();
      const filtered = PALETTE_ITEMS.filter((item) => !q || item.title.toLowerCase().includes(q) || item.sub.toLowerCase().includes(q));

      if (filtered.length === 0) {
        results.innerHTML = `<div style="padding: 24px; text-align: center; color: var(--cau-muted);">No matching destinations found.</div>`;
        return;
      }

      results.innerHTML = filtered
        .map(
          (item) => `
          <a href="${item.url}" class="cau-palette-item">
            <i class="fa-solid ${item.icon}" style="color: var(--cau-coral); width: 20px; text-align: center;" aria-hidden="true"></i>
            <div>
              <strong style="display: block; font-size: 14px;">${item.title}</strong>
              <small style="font-size: 12px; color: var(--cau-muted);">${item.sub}</small>
            </div>
          </a>
        `
        )
        .join('');
    };

    const openPalette = () => {
      backdrop.classList.add('is-open');
      input.value = '';
      renderResults('');
      setTimeout(() => input.focus(), 50);
      document.body.style.overflow = 'hidden';
    };

    const closePalette = () => {
      backdrop.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-open-palette="true"], .cau-search-trigger')) {
        e.preventDefault();
        openPalette();
      } else if (e.target === backdrop) {
        closePalette();
      }
    });

    input?.addEventListener('input', (e) => renderResults(e.target.value));

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (backdrop.classList.contains('is-open')) closePalette();
        else openPalette();
      } else if (e.key === 'Escape' && backdrop.classList.contains('is-open')) {
        closePalette();
      }
    });
  };

  /* --------------------------------------------------------------------------
     5. LANGUAGE PICKER DELEGATION
     -------------------------------------------------------------------------- */
  document.addEventListener('change', (e) => {
    const select = e.target.closest('.language-select');
    if (!select) return;
    const lang = select.value;
    if (typeof window.CAU_TRANSLATE === 'function') {
      window.CAU_TRANSLATE(lang);
    }
  });

  /* --------------------------------------------------------------------------
     INITIALIZATION
     -------------------------------------------------------------------------- */
  const init = () => {
    initNavOverlay();
    initCommandPalette();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
