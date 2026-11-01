/**
 * ==============================================================================
 * CYPRUS AYDIN UNIVERSITY (CAU) — STUDENT CLUBS INTERACTIVE ENGINE
 * Features: Live Filter Pills, Instant Search, Join Modal, LocalStorage Sync
 * ==============================================================================
 */

(() => {
  'use strict';

  const STORAGE_KEY = 'cau_club_registrations';

  // Helper to load registrations from localStorage
  const getRegistrations = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  };

  // Helper to save registration
  const saveRegistration = (reg) => {
    const list = getRegistrations();
    // Prevent duplicate registration for the same club by the same student
    const existingIndex = list.findIndex(item => item.clubName === reg.clubName && item.studentId === reg.studentId);
    if (existingIndex >= 0) {
      list[existingIndex] = reg;
    } else {
      list.push(reg);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('cau:clubs-updated', { detail: list }));
    return list;
  };

  const initClubs = () => {
    const filterPills = document.querySelectorAll('.cau-club-filter-pill');
    const searchInput = document.getElementById('cauClubSearchInput');
    const clubCards = document.querySelectorAll('.cau-interactive-club-card');
    const countBadge = document.getElementById('cauClubCountBadge');
    const emptyState = document.getElementById('cauClubEmptyState');

    let currentCategory = 'all';
    let currentSearch = '';

    const updateFilter = () => {
      let visibleCount = 0;

      clubCards.forEach((card) => {
        const cat = card.getAttribute('data-category') || '';
        const title = (card.querySelector('.cau-club-title')?.textContent || '').toLowerCase();
        const desc = (card.querySelector('.cau-club-desc')?.textContent || '').toLowerCase();
        const tags = (card.getAttribute('data-tags') || '').toLowerCase();

        const matchesCat = (currentCategory === 'all' || cat === currentCategory);
        const matchesSearch = !currentSearch || (title.includes(currentSearch) || desc.includes(currentSearch) || tags.includes(currentSearch));

        if (matchesCat && matchesSearch) {
          card.style.display = '';
          card.classList.remove('is-hidden');
          visibleCount++;
        } else {
          card.style.display = 'none';
          card.classList.add('is-hidden');
        }
      });

      if (countBadge) {
        countBadge.textContent = `${visibleCount} of ${clubCards.length} clubs`;
      }

      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    };

    // Filter pills click
    filterPills.forEach((pill) => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        filterPills.forEach(p => p.classList.remove('is-active'));
        pill.classList.add('is-active');
        currentCategory = pill.getAttribute('data-filter') || 'all';
        updateFilter();
      });
    });

    // Real-time search input
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.trim().toLowerCase();
        updateFilter();
      });
    }

    // Modal elements
    const modal = document.getElementById('cauJoinClubModal');
    const form = document.getElementById('cauJoinClubForm');
    const clubNameInput = document.getElementById('joinClubName');
    const clubTitleDisplay = document.getElementById('joinModalClubTitle');
    const formCard = document.getElementById('joinModalFormCard');
    const successCard = document.getElementById('joinModalSuccessCard');
    const successClubName = document.getElementById('successClubName');
    const successStudentName = document.getElementById('successStudentName');
    const successStudentId = document.getElementById('successStudentId');
    const successDate = document.getElementById('successDate');

    const openJoinModal = (clubName) => {
      if (!modal) return;
      if (clubNameInput) clubNameInput.value = clubName;
      if (clubTitleDisplay) clubTitleDisplay.textContent = clubName;
      if (formCard) formCard.style.display = 'block';
      if (successCard) successCard.style.display = 'none';
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const firstInput = modal.querySelector('input:not([readonly])');
      if (firstInput) setTimeout(() => firstInput.focus(), 150);
    };

    const closeJoinModal = () => {
      if (!modal) return;
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (form) form.reset();
    };

    // Bind Join buttons on cards
    document.querySelectorAll('.cau-join-club-trigger').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const clubName = btn.getAttribute('data-club-name') || 'Student Club';
        openJoinModal(clubName);
      });
    });

    // Close buttons & modal overlay clicks
    if (modal) {
      modal.querySelectorAll('.cau-modal-close-btn, [data-modal-close]').forEach((btn) => {
        btn.addEventListener('click', closeJoinModal);
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('cau-modal-backdrop')) {
          closeJoinModal();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
          closeJoinModal();
        }
      });
    }

    // Handle form submit
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = (document.getElementById('joinStudentName')?.value || '').trim();
        const emailOrId = (document.getElementById('joinStudentId')?.value || '').trim();
        const faculty = document.getElementById('joinFaculty')?.value || 'General Studies';
        const year = document.getElementById('joinStudyYear')?.value || '1st Year';
        const clubName = clubNameInput?.value || 'CAU Student Club';

        if (!name || !emailOrId) {
          alert('Please enter your full name and student ID / email.');
          return;
        }

        const now = new Date();
        const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

        const record = {
          clubName,
          studentName: name,
          studentId: emailOrId,
          faculty,
          year,
          joinedAt: now.toISOString(),
          formattedDate: dateStr
        };

        saveRegistration(record);

        // Update success card
        if (successClubName) successClubName.textContent = clubName;
        if (successStudentName) successStudentName.textContent = name;
        if (successStudentId) successStudentId.textContent = emailOrId;
        if (successDate) successDate.textContent = dateStr;

        if (formCard) formCard.style.display = 'none';
        if (successCard) successCard.style.display = 'block';

        // Update card visual badge
        clubCards.forEach((card) => {
          const cardTitle = card.querySelector('.cau-club-title')?.textContent || '';
          if (cardTitle.trim() === clubName.trim()) {
            const btn = card.querySelector('.cau-join-club-trigger');
            if (btn) {
              btn.innerHTML = '<i class="fa-solid fa-circle-check text-success me-1"></i> Joined';
              btn.classList.add('btn-success');
              btn.classList.remove('btn-coral');
            }
          }
        });
      });
    }

    // Refresh joined badges from existing localStorage data
    const existingRegs = getRegistrations();
    if (existingRegs.length > 0) {
      existingRegs.forEach((reg) => {
        clubCards.forEach((card) => {
          const cardTitle = card.querySelector('.cau-club-title')?.textContent || '';
          if (cardTitle.trim() === reg.clubName.trim()) {
            const btn = card.querySelector('.cau-join-club-trigger');
            if (btn) {
              btn.innerHTML = '<i class="fa-solid fa-circle-check text-success me-1"></i> Joined';
              btn.classList.add('btn-success');
              btn.classList.remove('btn-coral');
            }
          }
        });
      });
    }

    // Initial filter pass
    updateFilter();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initClubs);
  } else {
    initClubs();
  }
})();
