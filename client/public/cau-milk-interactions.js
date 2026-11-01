/**
 * ==============================================================================
 * CYPRUS AYDIN UNIVERSITY (CAU) — MILK NETWORK INTERACTION ENGINE
 * 1. Precision Custom Cursor with Hover Physics & Card States
 * 2. Blinking Section Index Counters (_01, _02, _03)
 * 3. Dynamic TRNC Campus Clock & Status Pulse
 * 4. Kinetic Multi-Underline & Arrow Interactions
 * Inspired by: milknetwork.com
 * ==============================================================================
 */

(() => {
  'use strict';

  // Avoid duplicate initialization
  if (window.__CAU_MILK_INITIALIZED__) return;
  window.__CAU_MILK_INITIALIZED__ = true;

  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.matchMedia('(hover: none)').matches;

  /* ==============================================================================
     1. PRECISION CUSTOM MOUSE CURSOR (Desktop only - Single Solid Dot)
     ============================================================================== */
  const initCustomCursor = () => {
    if (isTouch) return;

    // Remove any existing outer big stroke cursor
    const existingOuterCursor = document.querySelector('.cau-page-cursor');
    if (existingOuterCursor) {
      existingOuterCursor.remove();
    }

    let dot = document.querySelector('.cau-page-cursor-dot');
    if (!dot) {
      dot = document.createElement('div');
      dot.className = 'cau-page-cursor-dot is-hidden';
      document.body.appendChild(dot);
    }

    let isVisible = false;

    // Fast precise tracking for solid inner dot
    window.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        dot.classList.remove('is-hidden');
      }

      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      isVisible = false;
      dot.classList.add('is-hidden');
    });

    document.addEventListener('mouseenter', () => {
      isVisible = true;
      dot.classList.remove('is-hidden');
    });

    // Dynamic hover bindings for interactive elements
    const handleMouseOver = (e) => {
      const interactive = e.target.closest('a, button, .btn, input, select, textarea, [role="button"], [tabindex="0"], .milk-card, .degree-card, .box-figure, .testimonial-media, .program-directory-card, .news-card');
      if (interactive) {
        dot.classList.add('is-hovering');
      }
    };

    const handleMouseOut = (e) => {
      const interactive = e.target.closest('a, button, .btn, input, select, textarea, [role="button"], [tabindex="0"], .milk-card, .degree-card, .box-figure, .testimonial-media, .program-directory-card, .news-card');
      if (interactive) {
        dot.classList.remove('is-hovering');
      }
    };

    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });

    document.addEventListener('mousedown', () => dot.classList.add('is-active-press'));
    document.addEventListener('mouseup', () => dot.classList.remove('is-active-press'));
  };

  /* ==============================================================================
     2. DYNAMIC TRNC CAMPUS CLOCK
     ============================================================================== */
  const initCampusClock = () => {
    const clockEls = document.querySelectorAll('#cauLiveClock, #cauCampusClock, [data-component="local-time"]');
    if (!clockEls.length) return;

    const updateClock = () => {
      try {
        const now = new Date();
        const trncFormatter = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Europe/Nicosia',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
        const formatted = trncFormatter.format(now);

        clockEls.forEach((el) => {
          const liveClockChild = el.querySelector('#cauLiveClock');
          if (liveClockChild) {
            liveClockChild.textContent = formatted;
            return;
          }
          if (el.id === 'cauLiveClock' || el.id === 'cauCampusClock') {
            el.textContent = formatted;
            return;
          }
          if (el.dataset.component === 'local-time') {
            const parts = formatted.split(':');
            const h = el.querySelector('[data-hour]');
            const m = el.querySelector('[data-minutes]');
            if (h && m) {
              h.textContent = parts[0];
              m.textContent = parts[1];
            } else if (!el.children.length) {
              el.textContent = `${parts[0]}:${parts[1]} TRNC`;
            }
          } else {
            el.textContent = formatted;
          }
        });
      } catch {
        const now = new Date();
        const hours = String((now.getUTCHours() + 3) % 24).padStart(2, '0');
        const mins = String(now.getUTCMinutes()).padStart(2, '0');
        const secs = String(now.getUTCSeconds()).padStart(2, '0');
        const fallbackTime = `${hours}:${mins}:${secs}`;
        clockEls.forEach(el => {
          const liveClockChild = el.querySelector('#cauLiveClock');
          if (liveClockChild) {
            liveClockChild.textContent = fallbackTime;
          } else if (el.id === 'cauLiveClock' || el.id === 'cauCampusClock' || !el.children.length) {
            el.textContent = fallbackTime;
          }
        });
      }
    };

    updateClock();
    setInterval(updateClock, 1000);
  };

  /* ==============================================================================
     3. EDITORIAL ARROW & HOVER ENHANCEMENTS
     ============================================================================== */
  const initEditorialHovers = () => {
    // Add underline-multi to editorial anchor links
    document.querySelectorAll('.milk-section-header a, .footer-link-col a, .cau-hero-action-pill').forEach(a => {
      if (!a.querySelector('.underline-multi')) {
        a.classList.add('underline-multi');
      }
    });
  };

  /* ==============================================================================
     BOOTSTRAP
     ============================================================================== */
  const init = () => {
    initCustomCursor();
    initCampusClock();
    initEditorialHovers();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
