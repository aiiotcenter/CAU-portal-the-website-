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
     6. INITIALIZATION & GLOBAL API EXPORT
     -------------------------------------------------------------------------- */
  const init = () => {
    initAccordions();
    initTabs();
    initModals();
    initForms();
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
