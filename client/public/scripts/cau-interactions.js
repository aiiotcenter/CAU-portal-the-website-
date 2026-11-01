/**
 * ==============================================================================
 * CYPRUS AYDIN UNIVERSITY (CAU) — UNIFIED INTERACTION ENGINE
 * Architecture: Declarative State Engine & Programmatic UI API
 * Zero Dependencies • Accessible ARIA Sync • Resilient Event Delegation
 * ==============================================================================
 */

(() => {
  'use strict';

  if (window.CAU_CORE_INTERACTIONS_INITIALIZED) return;
  window.CAU_CORE_INTERACTIONS_INITIALIZED = true;

  /* --------------------------------------------------------------------------
     0. PRECISION CUSTOM CURSOR (runs on every page)
     -------------------------------------------------------------------------- */
  (() => {
    if (window.__CAU_MILK_INITIALIZED__) return; // already running (homepage)
    window.__CAU_MILK_INITIALIZED__ = true;

    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.matchMedia('(hover: none)').matches;
    if (isTouch) return;

    // Remove any legacy outer ring cursor element
    const existingRing = document.querySelector('.cau-page-cursor');
    if (existingRing) existingRing.remove();

    let dot = document.querySelector('.cau-page-cursor-dot');
    if (!dot) {
      dot = document.createElement('div');
      dot.className = 'cau-page-cursor-dot is-hidden';
      document.body.appendChild(dot);
    }

    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
      if (!isVisible) {
        isVisible = true;
        dot.classList.remove('is-hidden');
      }
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    }, { passive: true });

    document.addEventListener('mouseleave', () => { isVisible = false; dot.classList.add('is-hidden'); });
    document.addEventListener('mouseenter', () => { isVisible = true; dot.classList.remove('is-hidden'); });

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button, .btn, input, select, textarea, [role="button"], [tabindex="0"], .milk-card, .degree-card, .box-figure, .testimonial-media, .program-directory-card, .news-card')) {
        dot.classList.add('is-hovering');
      }
    }, { passive: true });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('a, button, .btn, input, select, textarea, [role="button"], [tabindex="0"], .milk-card, .degree-card, .box-figure, .testimonial-media, .program-directory-card, .news-card')) {
        dot.classList.remove('is-hovering');
      }
    }, { passive: true });

    document.addEventListener('mousedown', () => dot.classList.add('is-active-press'));
    document.addEventListener('mouseup', () => dot.classList.remove('is-active-press'));
  })();

  /* --------------------------------------------------------------------------
     1. TOAST NOTIFICATION ENGINE
     -------------------------------------------------------------------------- */
  const getOrCreateToastContainer = () => {
    let container = document.querySelector('.cau-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'cau-toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(container);
    }
    return container;
  };

  const createToast = ({ message, type = 'info', duration = 4000 }) => {
    const container = getOrCreateToastContainer();
    const toast = document.createElement('div');
    toast.className = `cau-toast cau-toast--${type}`;
    toast.setAttribute('role', 'alert');

    const iconMap = {
      success: '<i class="fa-solid fa-circle-check" style="color: var(--cau-navy);" aria-hidden="true"></i>',
      error: '<i class="fa-solid fa-triangle-exclamation" style="color: var(--cau-coral);" aria-hidden="true"></i>',
      info: '<i class="fa-solid fa-circle-info" style="color: var(--cau-navy);" aria-hidden="true"></i>'
    };

    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        ${iconMap[type] || iconMap.info}
        <span>${message}</span>
      </div>
      <button type="button" aria-label="Dismiss notification" style="background: none; border: none; cursor: pointer; color: var(--cau-muted); font-size: 14px; padding: 2px;">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
    `;

    const closeBtn = toast.querySelector('button');
    const dismiss = () => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'all 180ms ease';
      setTimeout(() => toast.remove(), 200);
    };

    closeBtn?.addEventListener('click', dismiss);
    if (duration > 0) {
      setTimeout(dismiss, duration);
    }

    container.appendChild(toast);
    return toast;
  };

  /* --------------------------------------------------------------------------
     2. ACCORDION CONTROLLER (Unified Event Delegation)
     -------------------------------------------------------------------------- */
  const initAccordions = () => {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-cau-toggle="accordion"], .cau-accordion-trigger, .directory-toggle, .faq-question');
      if (!trigger) return;

      const item = trigger.closest('.cau-accordion-item, .accordion-item-card, .faq-item');
      if (!item) return;

      const panel = item.querySelector('.cau-accordion-panel, .directory-panel, .faq-answer') || 
                    (trigger.dataset.target ? document.getElementById(trigger.dataset.target) : null);
      const isCurrentlyOpen = item.classList.contains('is-open') || item.classList.contains('open');

      // Check if parent container enforces single-open behavior
      const container = item.closest('[data-cau-accordion-single="true"], .cau-accordion--single');
      if (container && !isCurrentlyOpen) {
        container.querySelectorAll('.cau-accordion-item, .accordion-item-card, .faq-item').forEach((sibling) => {
          if (sibling !== item) {
            sibling.classList.remove('is-open', 'open');
            const sibTrigger = sibling.querySelector('.cau-accordion-trigger, .directory-toggle, .faq-question');
            const sibPanel = sibling.querySelector('.cau-accordion-panel, .directory-panel, .faq-answer');
            sibTrigger?.setAttribute('aria-expanded', 'false');
            sibTrigger?.classList.remove('is-open');
            sibPanel?.setAttribute('aria-hidden', 'true');
            sibPanel?.classList.remove('is-open');
            if (sibPanel) sibPanel.style.display = 'none';
          }
        });
      }

      if (isCurrentlyOpen) {
        item.classList.remove('is-open', 'open');
        trigger.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        if (panel) {
          panel.setAttribute('aria-hidden', 'true');
          panel.classList.remove('is-open');
          panel.style.display = 'none';
        }
      } else {
        item.classList.add('is-open', 'open');
        trigger.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        if (panel) {
          panel.setAttribute('aria-hidden', 'false');
          panel.classList.add('is-open');
          panel.style.display = 'block';
        }
      }
    });
  };

  /* --------------------------------------------------------------------------
     3. TAB CONTROLLER
     -------------------------------------------------------------------------- */
  const initTabs = () => {
    document.addEventListener('click', (e) => {
      const tab = e.target.closest('[data-cau-toggle="tab"], [role="tab"]');
      if (!tab) return;

      const tabList = tab.closest('[role="tablist"], .cau-tabs, .degree-switcher-tabs, .faq-categories');
      if (!tabList) return;

      const targetId = tab.dataset.target || tab.getAttribute('aria-controls');
      const siblings = tabList.querySelectorAll('[data-cau-toggle="tab"], [role="tab"], .degree-tab, .cat-pill');

      siblings.forEach((sibling) => {
        sibling.classList.remove('is-active', 'active');
        sibling.setAttribute('aria-selected', 'false');
      });

      tab.classList.add('is-active', 'active');
      tab.setAttribute('aria-selected', 'true');

      if (targetId) {
        const panels = document.querySelectorAll(`[data-cau-tab-panel]`);
        panels.forEach((p) => {
          const match = p.id === targetId || p.dataset.tabId === targetId;
          p.classList.toggle('is-active', match);
          p.setAttribute('aria-hidden', String(!match));
          p.style.display = match ? 'block' : 'none';
        });
      }
    });
  };

  /* --------------------------------------------------------------------------
     4. MODAL CONTROLLER
     -------------------------------------------------------------------------- */
  const modalController = {
    open(modalTarget) {
      const modal = typeof modalTarget === 'string' ? document.querySelector(modalTarget) : modalTarget;
      if (!modal) return;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      focusable?.focus();
    },
    close(modalTarget) {
      const modal = typeof modalTarget === 'string' ? document.querySelector(modalTarget) : modalTarget;
      if (!modal) return;
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  const initModals = () => {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-cau-toggle="modal"], [data-open-modal]');
      if (!trigger) return;
      const targetSelector = trigger.dataset.target || trigger.dataset.openModal;
      if (targetSelector) {
        e.preventDefault();
        modalController.open(targetSelector);
      }
    });

    document.addEventListener('click', (e) => {
      const closeBtn = e.target.closest('[data-cau-dismiss="modal"], .cau-modal-close');
      if (closeBtn) {
        const modal = closeBtn.closest('.cau-modal, .modal');
        if (modal) modalController.close(modal);
        return;
      }
      const modal = e.target.closest('.cau-modal.is-open');
      if (modal && e.target === modal) {
        modalController.close(modal);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.cau-modal.is-open');
        if (openModal) modalController.close(openModal);
      }
    });
  };

  /* --------------------------------------------------------------------------
     5. STANDARDIZED FORM VALIDATION & DISPATCH
     -------------------------------------------------------------------------- */
  const initForms = () => {
    document.addEventListener('submit', (e) => {
      const form = e.target.closest('form[data-cau-form]');
      if (!form) return;

      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const feedback = form.querySelector('.cau-form-feedback, .form-feedback');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('is-loading');
        if (form.classList.contains('newsletter-form') || submitBtn.classList.contains('newsletter-submit-btn')) {
          submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>';
        } else {
          submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2" aria-hidden="true"></i> Processing...';
        }
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('is-loading');
          submitBtn.innerHTML = originalBtnText;
        }

        const successMessage = form.dataset.cauSuccess || 'Thank you! Your submission has been received.';

        if (feedback) {
          feedback.className = 'cau-form-feedback is-success';
          feedback.innerHTML = `<i class="fa-solid fa-circle-check me-2" aria-hidden="true"></i> ${successMessage}`;
        }

        createToast({ message: successMessage, type: 'success' });
        form.reset();

        setTimeout(() => {
          if (feedback) {
            feedback.textContent = '';
            feedback.className = 'cau-form-feedback';
          }
        }, 7000);
      }, 700);
    });
  };

  /* --------------------------------------------------------------------------
     6. AWWWARDS HERO, DOCK & MEGA DROPDOWN SYSTEM
     -------------------------------------------------------------------------- */
  const initAwwwardsFeatures = () => {
    // 1. Floating Sticky Header Reveal
    const floatingHeader = document.getElementById('floatingHeader');
    if (floatingHeader) {
      const onScroll = () => {
        if (window.scrollY > 380) {
          floatingHeader.classList.add('is-visible');
        } else {
          floatingHeader.classList.remove('is-visible');
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    // 2. Mega Dropdown Tab Switching
    const megaMenuTabs = document.querySelectorAll('.cau-mega-menu__item[data-tab]');
    megaMenuTabs.forEach((tab) => {
      const activateTab = () => {
        const tabTarget = tab.getAttribute('data-tab');
        const parentGrid = tab.closest('.cau-mega-grid');
        if (!parentGrid) return;

        parentGrid.querySelectorAll('.cau-mega-menu__item').forEach((t) => t.classList.remove('is-active'));
        parentGrid.querySelectorAll('.cau-mega-panel').forEach((p) => p.classList.remove('is-active'));

        tab.classList.add('is-active');
        const activePanel = parentGrid.querySelector(`#${tabTarget}`);
        if (activePanel) activePanel.classList.add('is-active');
      };

      tab.addEventListener('mouseenter', activateTab);
      tab.addEventListener('click', activateTab);
    });

    // Fix #4+#5+#7: Touch-friendly mega dropdown toggle + aria-expanded tracking
    document.querySelectorAll('.cau-header-nav__item.has-dropdown').forEach((item) => {
      const trigger = item.querySelector('#exploreTrigger, .cau-header-nav__link');
      const updateAria = (open) => {
        if (trigger) trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      };
      // Toggle on click — makes dropdown work on touch devices
      item.addEventListener('click', (e) => {
        const isOpen = item.classList.contains('is-open');
        // Close all other open dropdowns first
        document.querySelectorAll('.cau-header-nav__item.has-dropdown.is-open').forEach((el) => {
          el.classList.remove('is-open');
          const t = el.querySelector('#exploreTrigger, .cau-header-nav__link');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('is-open');
          updateAria(true);
          e.stopPropagation();
        }
      });
      // Keep aria accurate for mouse users
      item.addEventListener('mouseenter', () => updateAria(true));
      item.addEventListener('mouseleave', () => {
        if (!item.classList.contains('is-open')) updateAria(false);
      });
    });
    // Close all dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.cau-header-nav__item.has-dropdown')) {
        document.querySelectorAll('.cau-header-nav__item.has-dropdown').forEach((item) => {
          item.classList.remove('is-open');
          const trigger = item.querySelector('#exploreTrigger, .cau-header-nav__link');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
      }
    });
    // Close on Escape key and return focus to trigger
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.cau-header-nav__item.has-dropdown.is-open').forEach((item) => {
          item.classList.remove('is-open');
          const trigger = item.querySelector('#exploreTrigger, .cau-header-nav__link');
          if (trigger) { trigger.setAttribute('aria-expanded', 'false'); trigger.focus(); }
        });
      }
    });

    // 3. Share Flyout Popup & Clipboard Copy
    const shareBtns = document.querySelectorAll('.cau-share-toggle, #cauShareBtn');
    shareBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const popup = btn.querySelector('.cau-share-popup, .toolbar-bts__share') ||
                      btn.parentElement.querySelector('.cau-share-popup, .toolbar-bts__share');
        if (popup) {
          popup.classList.toggle('is-show');
        }
      });
    });

    document.querySelectorAll('.cau-share-close').forEach((closeBtn) => {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeBtn.closest('.cau-share-popup, .toolbar-bts__share')?.classList.remove('is-show');
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.cau-share-popup') && !e.target.closest('.toolbar-bts__share') && !e.target.closest('.cau-share-toggle') && !e.target.closest('#cauShareBtn')) {
        document.querySelectorAll('.cau-share-popup, .toolbar-bts__share').forEach((p) => p.classList.remove('is-show'));
      }
    });

    document.querySelectorAll('[data-cau-action="copy-link"]').forEach((copyBtn) => {
      copyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard?.writeText(window.location.href).then(() => {
          createToast({ message: 'URL copied to clipboard!', type: 'success' });
          copyBtn.closest('.cau-share-popup, .toolbar-bts__share')?.classList.remove('is-show');
        }).catch(() => {
          createToast({ message: window.location.href, type: 'info' });
        });
      });
    });

    // 4. Bookmark Button Toggle
    const bookmarkBtn = document.getElementById('cauBookmarkBtn');
    if (bookmarkBtn) {
      bookmarkBtn.addEventListener('click', (e) => {
        e.preventDefault();
        bookmarkBtn.classList.toggle('is-saved');
        const isSaved = bookmarkBtn.classList.contains('is-saved');
        bookmarkBtn.setAttribute('aria-pressed', isSaved ? 'true' : 'false');
        if (isSaved) {
          createToast({ message: 'Cyprus Aydin University saved to bookmarks!', type: 'success' });
        } else {
          createToast({ message: 'Bookmark removed', type: 'info' });
        }
      });
    }

    // 5. Hero Video Controls inside .cau-box-figure & Full Film Modal
    const heroVideo = document.getElementById('cauHeroVideo');
    const playBtn = document.getElementById('cauVideoPlayBtn');
    const muteBtn = document.getElementById('cauVideoMuteBtn');
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('cauModalVideo');

    if (heroVideo && playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (heroVideo.paused) {
          heroVideo.play().catch(() => {});
          playBtn.innerHTML = '<i class="fa-solid fa-pause" aria-hidden="true"></i> Pause';
        } else {
          heroVideo.pause();
          playBtn.innerHTML = '<i class="fa-solid fa-play" aria-hidden="true"></i> Play';
        }
      });

      heroVideo.addEventListener('play', () => {
        playBtn.innerHTML = '<i class="fa-solid fa-pause" aria-hidden="true"></i> Pause';
      });
      heroVideo.addEventListener('pause', () => {
        playBtn.innerHTML = '<i class="fa-solid fa-play" aria-hidden="true"></i> Play';
      });
    }

    if (heroVideo && muteBtn) {
      // Initialize mute button state
      const updateMuteBtnState = () => {
        if (heroVideo.muted || heroVideo.volume === 0) {
          muteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark" aria-hidden="true"></i> Unmute';
          muteBtn.classList.remove('is-unmuted');
        } else {
          muteBtn.innerHTML = '<i class="fa-solid fa-volume-high" aria-hidden="true"></i> Mute';
          muteBtn.classList.add('is-unmuted');
        }
      };

      updateMuteBtnState();

      muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        heroVideo.muted = !heroVideo.muted;
        if (!heroVideo.muted) {
          heroVideo.volume = 1.0;
          if (heroVideo.paused) {
            heroVideo.play().catch(() => {});
          }
          createToast({ message: '🔊 Sound is now playing', type: 'info' });
        }
        updateMuteBtnState();
      });

      heroVideo.addEventListener('volumechange', updateMuteBtnState);
    }

    // Modal video lifecycle integration
    if (videoModal && modalVideo && heroVideo) {
      videoModal.addEventListener('show.bs.modal', () => {
        try {
          modalVideo.currentTime = heroVideo.currentTime || 0;
        } catch (_) {}
        heroVideo.pause();
        modalVideo.muted = false;
        modalVideo.volume = 1.0;
        setTimeout(() => {
          modalVideo.play().catch(() => {});
        }, 300);
      });

      videoModal.addEventListener('hidden.bs.modal', () => {
        try {
          heroVideo.currentTime = modalVideo.currentTime || 0;
        } catch (_) {}
        modalVideo.pause();
        heroVideo.play().catch(() => {});
      });
    }

    // 6. Scroll-Driven Video Scale to Fullscreen (.cau-box-figure)
    const boxFigure = document.getElementById('cauBoxFigure') || document.querySelector('.cau-box-figure');
    if (boxFigure) {
      let cachedElemTop = 0;
      const updateMetrics = () => {
        const cw = document.documentElement.clientWidth;
        document.documentElement.style.setProperty('--client-width', `${cw}px`);
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const rect = boxFigure.getBoundingClientRect();
        cachedElemTop = rect.top + scrollY;
      };

      updateMetrics();
      window.addEventListener('resize', updateMetrics, { passive: true });

      let ticking = false;
      const calculateScale = () => {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const startScroll = 20;
        const endScroll = Math.max(startScroll + 160, (cachedElemTop || 400) - 80);

        let progress = 0;
        if (scrollY <= startScroll) {
          progress = 0;
        } else if (scrollY >= endScroll) {
          progress = 1;
        } else {
          progress = (scrollY - startScroll) / (endScroll - startScroll);
        }

        boxFigure.style.setProperty('--video-scale-progress', progress.toFixed(3));

        if (progress >= 0.98) {
          boxFigure.classList.add('is-fullwidth');
        } else {
          boxFigure.classList.remove('is-fullwidth');
        }

        ticking = false;
      };

      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(calculateScale);
          ticking = true;
        }
      }, { passive: true });

      calculateScale();
    }

    // 5. Bottom Floating Quick-Navigation Pill
    const dockItems = document.querySelectorAll('.cau-menu-float__item[data-scroll-to]');
    dockItems.forEach((item) => {
      item.addEventListener('click', () => {
        const targetSelector = item.getAttribute('data-scroll-to');
        const targetEl = document.querySelector(targetSelector);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
          dockItems.forEach((di) => di.classList.remove('is-active'));
          item.classList.add('is-active');
        }
      });
    });

    // 6. Back-to-Top Button
    const backToTop = document.getElementById('cauBackToTop');
    if (backToTop) {
      backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // 7. Safe Mobile Navigation Overlay Controller
    const closeMobileNav = () => {
      const overlay = document.getElementById('cauNavOverlay');
      if (overlay && overlay.classList.contains('is-open')) {
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('cau-nav-open');
        document.body.style.overflow = '';
        document.querySelectorAll('.cau-menu-toggle').forEach((btn) => {
          btn.setAttribute('aria-expanded', 'false');
          const label = btn.querySelector('.cau-menu-toggle__label');
          if (label) label.textContent = 'Menu';
        });
      }
    };

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const overlay = document.getElementById('cauNavOverlay');
        if (overlay && overlay.classList.contains('is-open')) {
          closeMobileNav();
        }
      }
    });

    const currentNavOverlay = document.getElementById('cauNavOverlay');
    if (currentNavOverlay) {
      currentNavOverlay.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMobileNav);
      });
    }
  };

  /* --------------------------------------------------------------------------
     7. AWWWARDS SEARCH DRAWER CONTROLLER
     -------------------------------------------------------------------------- */
  const escapeHtml = (str) => {
    return String(str || '').replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m]));
  };

  const initSearchDrawer = () => {
    const headerEl = document.getElementById('cauHeader');
    const searchForm = document.getElementById('cauHeaderSearchForm') || document.querySelector('.search-form');
    const searchInput = document.getElementById('cauHeaderSearchInput') || document.querySelector('.search-form__input');
    const searchDrawer = document.getElementById('cauSearchDrawer');
    const searchBackdrop = document.getElementById('cauSearchBackdrop');
    const searchClearBtn = document.getElementById('cauSearchClearBtn');
    const dynamicPanel = document.getElementById('searchPanel-dynamic');
    const dynamicList = document.getElementById('searchDynamicList');
    const dynamicCount = document.getElementById('searchDynamicCount');
    const queryEcho = document.getElementById('searchQueryEcho');
    const tabs = document.querySelectorAll('.cau-search-tab[data-search-tab]');
    const panels = document.querySelectorAll('.cau-search-panel:not(.cau-search-panel--dynamic)');

    if (!searchInput || !searchDrawer) return;

    let activeTabId = 'popular';
    let catalogPrograms = [];

    // Pre-load academic programs to support instant live search
    fetch('/program-catalog.json')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          catalogPrograms = data;
        }
      })
      .catch(() => {});

    // Collect all static items from panels for searching
    const allStaticItems = [];
    panels.forEach((p) => {
      p.querySelectorAll('.cau-search-item').forEach((item) => {
        const title = item.querySelector('.cau-search-item__title')?.textContent.trim() || '';
        const count = item.querySelector('.cau-badge-counter, .cau-search-item__count')?.textContent.trim() || '';
        const href = item.getAttribute('href') || '/programs.html';
        if (title && !allStaticItems.some((x) => x.title === title)) {
          allStaticItems.push({ title, count, href });
        }
      });
    });

    const alignDrawer = () => {
      searchDrawer.style.left = '0';
      searchDrawer.style.right = 'auto';
      searchDrawer.style.maxWidth = 'calc(100vw - 32px)';
      const rect = searchDrawer.getBoundingClientRect();
      if (rect.right > window.innerWidth - 16) {
        searchDrawer.style.left = 'auto';
        searchDrawer.style.right = '0';
      }
    };

    const openDrawer = () => {
      headerEl?.classList.add('has-search-open');
      searchDrawer.classList.add('is-open');
      searchDrawer.setAttribute('aria-hidden', 'false');
      searchBackdrop?.classList.add('is-open');
      searchForm?.classList.add('is-active');
      alignDrawer();
    };

    const closeDrawer = () => {
      headerEl?.classList.remove('has-search-open');
      searchDrawer.classList.remove('is-open');
      searchDrawer.setAttribute('aria-hidden', 'true');
      searchBackdrop?.classList.remove('is-open');
      searchForm?.classList.remove('is-active');
      searchDrawer.querySelectorAll('.cau-search-item.is-selected').forEach((el) => el.classList.remove('is-selected'));
    };

    const switchTab = (targetTabId) => {
      activeTabId = targetTabId;
      tabs.forEach((t) => {
        const isActive = t.dataset.searchTab === targetTabId;
        t.classList.toggle('is-active', isActive);
        t.setAttribute('aria-selected', String(isActive));
      });

      panels.forEach((p) => {
        const isActive = p.id === `searchPanel-${targetTabId}`;
        p.classList.toggle('is-active', isActive);
      });

      if (dynamicPanel) {
        dynamicPanel.style.display = 'none';
      }
    };

    // Open on focus or click
    searchInput.addEventListener('focus', openDrawer);
    searchInput.addEventListener('click', (e) => {
      e.stopPropagation();
      openDrawer();
    });

    // Close on backdrop click
    searchBackdrop?.addEventListener('click', (e) => {
      e.preventDefault();
      closeDrawer();
    });

    // Prevent mousedown inside drawer from stealing focus/blurring prematurely
    searchDrawer.addEventListener('mousedown', (e) => {
      if (!e.target.closest('input')) {
        e.preventDefault();
      }
    });

    // Delegated click handler for all search items (guarantees click navigation works)
    searchDrawer.addEventListener('click', (e) => {
      const item = e.target.closest('.cau-search-item');
      if (item) {
        const href = item.getAttribute('href');
        if (href) {
          e.preventDefault();
          closeDrawer();
          window.location.href = href;
        }
      }
    });

    // Switch tab on click and hover (matching Explore mega dropdown behavior)
    tabs.forEach((tab) => {
      const activateTab = (e) => {
        if (e.type === 'click') {
          e.preventDefault();
          e.stopPropagation();
        }
        const tabTarget = tab.dataset.searchTab;
        if (searchInput.value.trim().length > 0) {
          searchInput.value = '';
          if (searchClearBtn) searchClearBtn.hidden = true;
        }
        switchTab(tabTarget);
      };
      tab.addEventListener('mouseenter', activateTab);
      tab.addEventListener('click', activateTab);
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (searchDrawer.classList.contains('is-open')) {
        if (!searchDrawer.contains(e.target) && !searchForm?.contains(e.target)) {
          closeDrawer();
        }
      }
    });

    // Handle typing and live search filtering
    const handleSearchInput = () => {
      const query = searchInput.value.trim();

      if (searchClearBtn) {
        searchClearBtn.hidden = query.length === 0;
      }

      if (query.length === 0) {
        if (dynamicPanel) dynamicPanel.style.display = 'none';
        switchTab(activeTabId);
        return;
      }

      // Hide regular tab panels and show dynamic panel
      panels.forEach((p) => p.classList.remove('is-active'));
      if (dynamicPanel) dynamicPanel.style.display = 'block';
      if (queryEcho) queryEcho.textContent = query;

      const lowerQuery = query.toLowerCase();

      // Search matches in static items + catalog programs
      const matched = [];

      // 1. Static items match
      allStaticItems.forEach((item) => {
        if (item.title.toLowerCase().includes(lowerQuery)) {
          matched.push({
            title: item.title,
            count: item.count,
            href: item.href
          });
        }
      });

      // 2. Program catalog match
      catalogPrograms.forEach((prog) => {
        const name = prog['Program Name'] || prog.name || '';
        const dept = prog['Department'] || '';
        const degree = prog['Degree Level'] || '';
        if (name && (name.toLowerCase().includes(lowerQuery) || dept.toLowerCase().includes(lowerQuery))) {
          if (!matched.some((m) => m.title.toLowerCase() === name.toLowerCase())) {
            matched.push({
              title: name,
              count: degree || dept || 'CAU',
              href: `/program-details.html?slug=${prog.slug || encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'))}`
            });
          }
        }
      });

      // Render matches
      if (dynamicList) {
        dynamicList.innerHTML = '';
        if (matched.length === 0) {
          dynamicList.innerHTML = `<div class="cau-search-empty-msg">No matching programmes found for "<strong>${escapeHtml(query)}</strong>". Press Enter to view all catalogue results.</div>`;
          if (dynamicCount) dynamicCount.textContent = '0 results';
        } else {
          const slice = matched.slice(0, 8);
          if (dynamicCount) dynamicCount.textContent = `${matched.length} result${matched.length === 1 ? '' : 's'}`;

          slice.forEach((item) => {
            const a = document.createElement('a');
            a.className = 'cau-search-item';
            a.href = item.href;

            // Highlight match in title
            const idx = item.title.toLowerCase().indexOf(lowerQuery);
            let titleHtml = escapeHtml(item.title);
            if (idx >= 0) {
              const before = escapeHtml(item.title.substring(0, idx));
              const match = escapeHtml(item.title.substring(idx, idx + query.length));
              const after = escapeHtml(item.title.substring(idx + query.length));
              titleHtml = `${before}<span class="cau-search-dynamic__match-highlight">${match}</span>${after}`;
            }

            a.innerHTML = `
              <span class="cau-search-item__title">${titleHtml}</span>
              <span class="cau-badge-counter">${escapeHtml(item.count)}</span>
            `;

            dynamicList.appendChild(a);
          });
        }
      }
    };

    searchInput.addEventListener('input', handleSearchInput);

    // Clear button
    searchClearBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      searchInput.value = '';
      searchClearBtn.hidden = true;
      searchInput.focus();
      handleSearchInput();
    });

    // Keyboard navigation (ArrowDown, ArrowUp, Escape, Enter)
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDrawer();
        searchInput.blur();
        return;
      }

      if (!searchDrawer.classList.contains('is-open')) {
        if (e.key === 'ArrowDown') {
          openDrawer();
        }
        return;
      }

      const activeVisiblePanel = dynamicPanel && dynamicPanel.style.display !== 'none'
        ? dynamicPanel
        : searchDrawer.querySelector('.cau-search-panel.is-active');

      if (!activeVisiblePanel) return;

      const items = Array.from(activeVisiblePanel.querySelectorAll('.cau-search-item'));
      if (!items.length) return;

      let currentIdx = items.findIndex((el) => el.classList.contains('is-selected'));

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentIdx < items.length - 1) {
          if (currentIdx >= 0) items[currentIdx].classList.remove('is-selected');
          currentIdx++;
          items[currentIdx].classList.add('is-selected');
          items[currentIdx].scrollIntoView({ block: 'nearest' });
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentIdx > 0) {
          items[currentIdx].classList.remove('is-selected');
          currentIdx--;
          items[currentIdx].classList.add('is-selected');
          items[currentIdx].scrollIntoView({ block: 'nearest' });
        } else if (currentIdx === 0) {
          items[currentIdx].classList.remove('is-selected');
        }
      } else if (e.key === 'Enter') {
        if (currentIdx >= 0 && items[currentIdx]) {
          e.preventDefault();
          items[currentIdx].click();
        }
      }
    });

    // Window resize alignment
    window.addEventListener('resize', () => {
      if (searchDrawer.classList.contains('is-open')) {
        alignDrawer();
      }
    }, { passive: true });

    // Document click to close if clicking outside
    document.addEventListener('click', (e) => {
      if (searchDrawer.classList.contains('is-open')) {
        if (!e.target.closest('.header-main__search') && !e.target.closest('#cauSearchDrawer')) {
          closeDrawer();
        }
      }
    });

    // Document Escape key listener to close drawer from anywhere when open
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchDrawer.classList.contains('is-open')) {
        closeDrawer();
        searchInput.blur();
      }
    });
  };

  /* --------------------------------------------------------------------------
     8. LIVE CAMPUS CLOCK & FLOATING DOCK CONTROLLER
     -------------------------------------------------------------------------- */
  const initLiveClock = () => {
    const clockEl = document.getElementById('cauLiveClock');
    const dateEl = document.getElementById('cauLiveDate');
    if (!clockEl && !dateEl) return;

    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Europe/Nicosia',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      const dateStr = now.toLocaleDateString('en-US', {
        timeZone: 'Europe/Nicosia',
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      if (clockEl) clockEl.textContent = timeStr;
      if (dateEl) dateEl.textContent = dateStr;
    };

    updateTime();
    setInterval(updateTime, 1000);
  };

      const initFloatingNav = () => {
    // Back to top button
    const backToTopBtn = document.getElementById('cauBackToTop');
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
          backToTopBtn.style.opacity = '1';
          backToTopBtn.style.visibility = 'visible';
        } else {
          backToTopBtn.style.opacity = '0';
          backToTopBtn.style.visibility = 'hidden';
        }
      }, { passive: true });
    }

    // Floating Menu on-demand summon controller
    // Hidden by default so it never clutters page content; appears only on demand
    const menuFloat = document.getElementById('cauMenuFloat');
    const menuTrigger = document.getElementById('cauMenuFloatTrigger');
    const minimizeBtn = document.getElementById('cauMenuFloatMinimize');
    if (!menuFloat) return;

    let isExpanded = false;
    let lastScrollY = window.scrollY;
    let scrollTimeout = null;

    const showDock = () => {
      isExpanded = true;
      menuFloat.classList.add('is-visible');
      menuFloat.classList.remove('is-hidden', 'is-minimized');
      if (menuTrigger) {
        menuTrigger.classList.remove('is-visible');
        menuTrigger.classList.add('is-hidden');
      }
    };

    const hideDock = () => {
      isExpanded = false;
      menuFloat.classList.remove('is-visible');
      menuFloat.classList.add('is-hidden');
      updateVisibility();
    };

    const updateVisibility = () => {
      const scrollY = window.scrollY;
      const footer = document.querySelector('.shared-footer') || document.querySelector('[data-shared-footer]');
      let isNearFooter = false;
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        if (footerRect.top < window.innerHeight - 30) {
          isNearFooter = true;
        }
      }

      // Past hero threshold (hidden at top of page)
      const isPastHero = scrollY > 320;

      if (!isPastHero || isNearFooter) {
        // At the top of page or at the footer: completely hide both dock and trigger
        menuFloat.classList.remove('is-visible');
        menuFloat.classList.add('is-hidden');
        if (menuTrigger) {
          menuTrigger.classList.remove('is-visible');
          menuTrigger.classList.add('is-hidden');
        }
      } else {
        // Past hero and not in footer
        if (isExpanded) {
          menuFloat.classList.add('is-visible');
          menuFloat.classList.remove('is-hidden');
          if (menuTrigger) {
            menuTrigger.classList.remove('is-visible');
            menuTrigger.classList.add('is-hidden');
          }
        } else {
          // Default on-demand state: dock is hidden, discreet summon trigger pill is visible
          menuFloat.classList.remove('is-visible');
          menuFloat.classList.add('is-hidden');
          if (menuTrigger) {
            menuTrigger.classList.add('is-visible');
            menuTrigger.classList.remove('is-hidden');
          }
        }
      }

      lastScrollY = scrollY;
    };

    window.addEventListener('scroll', () => {
      updateVisibility();
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateVisibility, 150);
    }, { passive: true });

    // Minimize button on the dock
    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        hideDock();
      });
    }

    // Trigger pill to summon the dock on demand
    if (menuTrigger) {
      menuTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        showDock();
      });
    }

    // Close dock when clicking anywhere outside
    document.addEventListener('click', (e) => {
      if (isExpanded && !menuFloat.contains(e.target) && (!menuTrigger || !menuTrigger.contains(e.target))) {
        hideDock();
      }
    });

    // Toggle floating dock via Escape or Alt+N / Option+N
    document.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable) return;
      if (e.key === 'Escape' && isExpanded) {
        hideDock();
      } else if (e.altKey && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        if (isExpanded) {
          hideDock();
        } else {
          showDock();
        }
      }
    });

    // Smooth scroll for nav items and auto-tuck dock after selection
    const navLinks = menuFloat.querySelectorAll('.cau-menu-float__item[href^="#"]');
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href').slice(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
          navLinks.forEach(l => l.classList.remove('is-active'));
          link.classList.add('is-active');
          // Auto-tuck dock after choosing a destination
          setTimeout(() => {
            hideDock();
          }, 350);
        }
      });
    });

    // Scroll spy
    const sections = ['creator', 'why', 'program-directory', 'stories', 'news'];
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop - 120;
          if (window.scrollY >= top) {
            current = id;
          }
        }
      });

      if (current) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('is-active');
          } else {
            link.classList.remove('is-active');
          }
        });
      }
    }, { passive: true });

    // Initial evaluation
    updateVisibility();
  };

  const initKeyboardShortcuts = () => {
    const searchInput = document.getElementById('cauHeaderSearchInput');
    if (!searchInput) return;

    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        searchInput.focus();
      }
    });
  };

  /* --------------------------------------------------------------------------
     8.5 DYNAMIC TESTIMONIALS & STORY SHOWCASE
     -------------------------------------------------------------------------- */
  const initDynamicTestimonials = () => {
    const cards = document.querySelectorAll('.testimonial-story-card');
    if (!cards.length) return;

    // 1. Department Filter Tabs
    const filterTabs = document.querySelectorAll('.testimonial-filter-tab[data-story-filter]');
    filterTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        filterTabs.forEach((t) => t.classList.remove('is-active'));
        tab.classList.add('is-active');

        const filterVal = tab.getAttribute('data-story-filter');
        cards.forEach((card) => {
          const cat = card.getAttribute('data-story-category');
          if (filterVal === 'all' || cat === filterVal) {
            card.classList.remove('is-filtered-out');
          } else {
            card.classList.add('is-filtered-out');
          }
        });
      });
    });

    // 2. Sequential Story Navigation (Prev / Next & Counter)
    let currentStory = 1;
    const counterEl = document.getElementById('currentStoryNum');
    const updateActiveStory = (index) => {
      currentStory = ((index - 1 + cards.length) % cards.length) + 1;
      cards.forEach((card, idx) => {
        if (idx + 1 === currentStory) {
          card.classList.add('is-active-spotlight');
        } else {
          card.classList.remove('is-active-spotlight');
        }
      });
      if (counterEl) {
        counterEl.textContent = String(currentStory).padStart(2, '0');
      }
    };

    const prevBtn = document.querySelector('.js-story-prev');
    const nextBtn = document.querySelector('.js-story-next');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => updateActiveStory(currentStory - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => updateActiveStory(currentStory + 1));
    }

    // Clicking card activates spotlight
    cards.forEach((card, idx) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.testimonial-perspective-btn, .testimonial-audio-pill')) return;
        updateActiveStory(idx + 1);
      });
    });

    // 3. Perspective Body Toggles
    const perspectiveBtns = document.querySelectorAll('.testimonial-perspective-btn[data-target]');
    perspectiveBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetId = btn.getAttribute('data-target');
        const bodyEl = document.getElementById(targetId);
        if (bodyEl) {
          const isOpen = bodyEl.classList.toggle('is-open');
          btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
          btn.innerHTML = isOpen
            ? '<i class="fa-solid fa-chevron-up" aria-hidden="true"></i> Close'
            : '<i class="fa-solid fa-layer-group" aria-hidden="true"></i> Perspective';
        }
      });
    });

    // 4. Simulated Audio Voice Note Preview
    const audioPills = document.querySelectorAll('.testimonial-audio-pill[data-student]');
    let activeAudioBtn = null;
    audioPills.forEach((pill) => {
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        const student = pill.getAttribute('data-student');
        if (activeAudioBtn && activeAudioBtn !== pill) {
          activeAudioBtn.classList.remove('is-playing');
          activeAudioBtn.querySelector('span').textContent = activeAudioBtn.getAttribute('data-orig-text') || 'Listen';
          activeAudioBtn.querySelector('i').className = 'fa-solid fa-play';
        }

        const isPlaying = pill.classList.toggle('is-playing');
        if (isPlaying) {
          activeAudioBtn = pill;
          if (!pill.hasAttribute('data-orig-text')) {
            pill.setAttribute('data-orig-text', pill.querySelector('span').textContent);
          }
          pill.querySelector('i').className = 'fa-solid fa-pause';
          pill.querySelector('span').textContent = `Playing ${student}...`;
          createToast({ message: `Playing student perspective from ${student}`, type: 'info' });
        } else {
          activeAudioBtn = null;
          pill.querySelector('i').className = 'fa-solid fa-play';
          pill.querySelector('span').textContent = pill.getAttribute('data-orig-text') || 'Listen';
        }
      });
    });

    // 5. Draggable Marquee Track (Reference: agency draggable carousel engine)
    const gridEl = document.querySelector('.testimonials-cards-grid');
    if (gridEl) {
      let isDown = false;
      let startX;
      let scrollLeft;
      let draggedDistance = 0;

      gridEl.addEventListener('mousedown', (e) => {
        if (e.target.closest('button, a, input')) return;
        isDown = true;
        draggedDistance = 0;
        gridEl.classList.add('is-dragging');
        startX = e.pageX - gridEl.offsetLeft;
        scrollLeft = gridEl.scrollLeft;
      });

      gridEl.addEventListener('mouseleave', () => {
        isDown = false;
        gridEl.classList.remove('is-dragging');
      });

      gridEl.addEventListener('mouseup', () => {
        isDown = false;
        gridEl.classList.remove('is-dragging');
      });

      gridEl.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - gridEl.offsetLeft;
        const walk = (x - startX) * 1.5;
        draggedDistance += Math.abs(walk);
        gridEl.scrollLeft = scrollLeft - walk;
      });
    }

    // 6. Student Story Detail Modal Controller (Reference: agency modal engine)
    const openStoryModal = (data) => {
      let backdrop = document.querySelector('.cau-story-modal-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'cau-story-modal-backdrop';
        backdrop.setAttribute('role', 'dialog');
        backdrop.setAttribute('aria-modal', 'true');
        document.body.appendChild(backdrop);
      }

      backdrop.innerHTML = `
        <div class="cau-story-modal">
          <div class="cau-story-modal__header">
            <div class="cau-story-modal__title">
              <h3>${data.name || 'Student Voice'}</h3>
              <div class="cau-story-modal__country-badge">
                <span>${data.country || 'International Student'}</span>
                <span>•</span>
                <span>${data.faculty || 'Cyprus Aydın University'}</span>
              </div>
            </div>
            <button type="button" class="cau-story-modal__close" aria-label="Close student profile">
              <i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
          </div>
          <div class="cau-story-modal__body">
            <div class="cau-story-modal__avatar-col">
              <img src="${data.image || '/assets/brochure/omar-abo-jmei.webp'}" alt="${data.name || 'Student'}" class="cau-story-modal__avatar" />
              <div class="testimonial-story-card__program-badge" style="font-size: 10.5px; text-align: center;">
                ${data.degree || data.program || 'Undergraduate Degree'}
              </div>
            </div>
            <div class="cau-story-modal__content-col">
              <blockquote class="cau-story-modal__quote">
                ${data.quote || ''}
              </blockquote>
              <div class="cau-story-modal__insight">
                <strong>Academic Milestone &amp; Projects:</strong><br />
                ${data.insight || 'Participated in hands-on research labs and international campus leadership.'}
              </div>
            </div>
          </div>
          <div class="cau-story-modal__footer">
            <div style="font-size: 12px; color: var(--sys-text-muted, #5f6368);">
              <i class="fa-solid fa-check-double text-coral" aria-hidden="true"></i> Verified CAU Student Story
            </div>
            <a href="${data.programLink || '/programs.html'}" class="cau-story-modal__cta">
              Explore Programmes <i class="system-arrow ms-1" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      `;

      // Trigger transition
      requestAnimationFrame(() => {
        backdrop.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
      });

      const closeBtn = backdrop.querySelector('.cau-story-modal__close');
      const closeModal = () => {
        backdrop.classList.remove('is-visible');
        document.body.style.overflow = '';
      };

      closeBtn?.addEventListener('click', closeModal, { once: true });
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal();
      });

      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          closeModal();
          document.removeEventListener('keydown', handleEsc);
        }
      };
      document.addEventListener('keydown', handleEsc);
    };

    // Modal triggers on profile button or card
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.js-open-story-modal, [data-story-modal]');
      if (!trigger) return;
      e.stopPropagation();

      const rawData = trigger.getAttribute('data-story-modal') || trigger.closest('[data-story-modal]')?.getAttribute('data-story-modal');
      if (rawData) {
        try {
          const data = JSON.parse(rawData);
          openStoryModal(data);
        } catch (err) {
          console.error('Failed to parse student story modal data', err);
        }
      }
    });
  };

  /* --------------------------------------------------------------------------
     10. ONE-CLICK QUICK COPY COMPONENT (Agency Reference: z / data-component="copy")
     -------------------------------------------------------------------------- */
  const initCopyComponent = () => {
    document.addEventListener('click', async (e) => {
      const copyBtn = e.target.closest('[data-component="copy"], .cau-copy-btn, #shareCopy, [data-copy-target], [data-copy-text]');
      if (!copyBtn) return;
      e.preventDefault();

      let textToCopy = '';
      if (copyBtn.dataset.copyText) {
        textToCopy = copyBtn.dataset.copyText;
      } else if (copyBtn.dataset.copyTarget) {
        const targetEl = document.querySelector(copyBtn.dataset.copyTarget);
        textToCopy = targetEl ? (targetEl.value || targetEl.innerText || targetEl.textContent).trim() : '';
      } else if (copyBtn.id === 'shareCopy') {
        textToCopy = window.location.href;
      } else {
        const textNode = copyBtn.querySelector('code, span') || copyBtn;
        textToCopy = (textNode.innerText || textNode.textContent).trim();
      }

      if (!textToCopy) return;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = textToCopy;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          document.execCommand('copy');
          textarea.remove();
        }

        // Show floating micro-tooltip
        let tooltip = copyBtn.querySelector('.cau-copy-tooltip');
        if (!tooltip) {
          tooltip = document.createElement('span');
          tooltip.className = 'cau-copy-tooltip';
          tooltip.setAttribute('role', 'status');
          copyBtn.style.position = 'relative';
          copyBtn.appendChild(tooltip);
        }
        tooltip.textContent = '✓ Copied!';
        tooltip.classList.add('is-visible');

        // Button state
        copyBtn.classList.add('is-copied');

        createToast({
          message: `Copied: ${textToCopy.length > 28 ? textToCopy.slice(0, 28) + '...' : textToCopy}`,
          type: 'success',
          duration: 3000
        });

        setTimeout(() => {
          tooltip.classList.remove('is-visible');
          copyBtn.classList.remove('is-copied');
        }, 2200);
      } catch (err) {
        console.error('Failed to copy to clipboard', err);
        createToast({ message: 'Unable to copy to clipboard', type: 'error' });
      }
    });
  };

  /* --------------------------------------------------------------------------
     11. STICKY LINK CRAWLER / TABLE OF CONTENTS (Agency Reference: Pt / link-crawler)
     -------------------------------------------------------------------------- */
  const initLinkCrawler = () => {
    const crawlerLinks = document.querySelectorAll('[data-aside-link], .cau-crawler-link, a.cau-toc-link');
    if (!crawlerLinks.length) return;

    const sections = [];
    crawlerLinks.forEach((link) => {
      const targetId = link.getAttribute('href')?.replace('#', '') || link.dataset.asideLink;
      const targetSection = targetId ? document.getElementById(targetId) : null;
      if (targetSection) {
        sections.push({ link, section: targetSection });
      }

      // Smooth scroll on click
      link.addEventListener('click', (e) => {
        const hash = link.getAttribute('href');
        if (hash && hash.startsWith('#')) {
          const el = document.querySelector(hash);
          if (el) {
            e.preventDefault();
            const topOffset = 80;
            const elementPosition = el.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - topOffset;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });

    if (!sections.length || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          sections.forEach(({ link, section }) => {
            link.classList.toggle('is-active', section === entry.target);
          });
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });

    sections.forEach(({ section }) => observer.observe(section));
  };

  /* --------------------------------------------------------------------------
     12. INITIALIZATION & GLOBAL API EXPORT
     -------------------------------------------------------------------------- */
  const init = () => {
    initAccordions();
    initTabs();
    initModals();
    initForms();
    initAwwwardsFeatures();
    initSearchDrawer();
    initLiveClock();
    initFloatingNav();
    initDynamicTestimonials();
    initKeyboardShortcuts();
    initCopyComponent();
    initLinkCrawler();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.CAU = {
    toast: createToast,
    modal: modalController,
    accordion: {
      toggle(itemOrTrigger) {
        const trigger = itemOrTrigger.matches('[data-cau-toggle="accordion"], .cau-accordion-trigger, .directory-toggle, .faq-question')
          ? itemOrTrigger
          : itemOrTrigger.querySelector('.cau-accordion-trigger, .directory-toggle, .faq-question');
        trigger?.click();
      }
    },
    setTheme(theme) {
      if (typeof window.CAU_SET_THEME === 'function') {
        window.CAU_SET_THEME(theme);
      } else {
        document.documentElement.dataset.theme = theme;
      }
    }
  };
})();
