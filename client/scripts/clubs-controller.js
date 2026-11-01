/**
 * ==============================================================================
 * CYPRUS AYDIN UNIVERSITY (CAU) — STUDENT CLUBS PORTAL CONTROLLER
 * Architecture: Structured Data Engine, Reactive Search & Filter,
 * cau-store.js Integration, Focus-Trapped Accessible Modal Dialog
 * ==============================================================================
 */

import { cauStore } from './cau-store.js';

// Complete 10 Faculty-Aligned Societies
export const CLUBS_DATA = [
  {
    id: 'blue-butterfly',
    title: 'Blue Butterfly Social Responsibility Club',
    category: 'health',
    categoryLabel: 'Health & Impact',
    image: '/assets/brochure/club-blue-butterfly.webp',
    activityTag: 'Community Outreach',
    schedule: 'Thursdays 16:00 • Social Hall',
    membersCount: 42,
    description: 'Children’s rights advocacy, primary school book drives, creative learning ateliers, and community social development projects across Cyprus.',
    tags: ['children', 'advocacy', 'social', 'community', 'outreach', 'welfare']
  },
  {
    id: 'first-aid',
    title: 'First & Emergency Aid Society',
    category: 'health',
    categoryLabel: 'Health & Impact',
    image: '/assets/brochure/club-first-aid.webp',
    activityTag: 'Tactical Med & CPR',
    schedule: 'Tuesdays 16:30 • Paramedic Lab',
    membersCount: 65,
    description: 'Paramedic simulation drills, campus-wide CPR certifications, emergency response scenarios, and first aid training in partnership with Kyrenia health services.',
    tags: ['first aid', 'cpr', 'emergency', 'paramedic', 'medical', 'health', 'ambulance']
  },
  {
    id: 'physiotherapy',
    title: 'Physiotherapy & Rehabilitation Club',
    category: 'health',
    categoryLabel: 'Health & Impact',
    image: '/assets/brochure/club-physiotherapy.webp',
    activityTag: 'Sports & Mobility',
    schedule: 'Mondays 17:00 • Physio Gym',
    membersCount: 54,
    description: 'Ergonomics clinics, posture correction workshops, sports rehabilitation practices, and campus active living initiatives guided by clinical faculty.',
    tags: ['physiotherapy', 'rehabilitation', 'sports', 'ergonomics', 'posture', 'health']
  },
  {
    id: 'red-crescent',
    title: 'CAU Red Crescent (Kızılay) Youth',
    category: 'health',
    categoryLabel: 'Health & Impact',
    image: '/assets/brochure/club-red-crescent.webp',
    activityTag: 'Humanitarian Aid',
    schedule: 'Wednesdays 15:00 • Student Center',
    membersCount: 88,
    description: 'Community care campaigns, disaster relief preparation, blood drives, and humanitarian volunteer missions across Northern Cyprus.',
    tags: ['red crescent', 'kizilay', 'humanitarian', 'blood drive', 'disaster relief', 'volunteering']
  },
  {
    id: 'english-debate',
    title: 'English Arena & Global Debate Society',
    category: 'language',
    categoryLabel: 'Language & Debate',
    image: '/assets/brochure/cau-clubs-badge.webp',
    activityTag: 'Weekly Quests & MUN',
    schedule: 'Fridays 16:00 • Language Amphitheater',
    membersCount: 120,
    perkBadge: '+1 Permanent Shield (6 Max) • 2x XP Boosters',
    description: 'Official student society bridging Model UN debates, weekly Arena quest tournaments, public speaking masterclasses, and international diplomatic discourse. Membership grants +1 Permanent Arena Shield (6 Max) and 24-hr 2x XP Club Night Boosters in the CAU English Quest Arena.',
    tags: ['english', 'arena', 'debate', 'mun', 'speaking', 'ielts', 'toefl', 'language', 'duolingo', 'shield']
  },
  {
    id: 'software-ai',
    title: 'Software Engineering & AI Guild',
    category: 'engineering',
    categoryLabel: 'Engineering & AI',
    image: '/assets/brochure/campus-students-1.webp',
    activityTag: 'Hackathons & CTF',
    schedule: 'Thursdays 17:00 • Lab B204',
    membersCount: 95,
    description: 'Hands-on workshops in machine learning, full-stack web engineering, algorithms, and competitive hackathon teams representing CAU across Europe.',
    tags: ['software', 'ai', 'machine learning', 'coding', 'hackathon', 'engineering', 'web']
  },
  {
    id: 'moot-court',
    title: 'International Law & Moot Court Society',
    category: 'law',
    categoryLabel: 'Law & Diplomacy',
    image: '/assets/brochure/campus-students-2.webp',
    activityTag: 'Mock Trials & UN',
    schedule: 'Tuesdays 16:00 • Moot Court Room',
    membersCount: 58,
    description: 'Bilingual moot court simulations, international human rights litigation debates, and courtroom observation visits to Kyrenia District Courts.',
    tags: ['law', 'moot court', 'trials', 'human rights', 'diplomacy', 'legal', 'justice']
  },
  {
    id: 'aviation-society',
    title: 'Civil Aviation & Aerospace Club',
    category: 'culture',
    categoryLabel: 'Culture & Aviation',
    image: '/assets/brochure/aleg-losich.webp',
    activityTag: 'Flight Sim & Tours',
    schedule: 'Wednesdays 16:30 • Aviation Hangar',
    membersCount: 48,
    description: 'Flight simulation challenges, drone piloting clinics, aerodynamics workshops, and guest panels with commercial airline captains.',
    tags: ['aviation', 'aerospace', 'flight', 'drone', 'pilot', 'aircraft', 'travel']
  },
  {
    id: 'gastronomy-arts',
    title: 'Gastronomy & Culinary Arts Collective',
    category: 'culture',
    categoryLabel: 'Culture & Aviation',
    image: '/assets/brochure/fatma-nur-aydin.webp',
    activityTag: 'Workshops & Tasting',
    schedule: 'Saturdays 11:00 • Culinary Studio',
    membersCount: 52,
    description: 'Masterclasses in Mediterranean and Cypriot gastronomy, molecular cooking ateliers, pastry workshops, and inter-university culinary challenges.',
    tags: ['gastronomy', 'culinary', 'food', 'cooking', 'mediterranean', 'chef', 'baking']
  },
  {
    id: 'cyber-sec',
    title: 'Information Security & Cyber Defense',
    category: 'engineering',
    categoryLabel: 'Engineering & AI',
    image: '/assets/brochure/mohamed-khattab.webp',
    activityTag: 'Pen-Testing Labs',
    schedule: 'Mondays 18:00 • Cyber Range Lab',
    membersCount: 62,
    description: 'Ethical hacking challenges, capture-the-flag competitions, threat intelligence seminars, and network defense workshops in our isolated cyber lab.',
    tags: ['cybersecurity', 'security', 'ctf', 'hacking', 'network', 'defense', 'linux']
  }
];

class ClubsController {
  constructor() {
    this.currentCategory = 'all';
    this.currentSearch = '';
    this.showOnlyJoined = false;
    this.modalActiveClub = null;
    this.lastFocusedElement = null;

    this.dom = {
      grid: document.getElementById('clubs-directory-grid'),
      pills: document.querySelectorAll('.cau-club-filter-pill'),
      searchInput: document.getElementById('club-search'),
      joinedToggle: document.getElementById('my-clubs-toggle'),
      joinedCountBadge: document.getElementById('joined-clubs-count'),
      totalCountBadge: document.getElementById('clubs-total-count'),
      emptyState: document.getElementById('clubs-empty-state'),
      modal: document.getElementById('cauClubJoinModal'),
      modalForm: document.getElementById('cauClubJoinForm'),
      modalCloseBtn: document.getElementById('cauModalCloseBtn'),
      modalCancelBtn: document.getElementById('cauModalCancelBtn'),
      modalClubName: document.getElementById('modalClubNameText'),
      modalClubCategory: document.getElementById('modalClubCategoryBadge'),
      modalClubIdInput: document.getElementById('modalClubIdInput'),
      // Spotlight Bridge Elements
      bridgeCefrBadge: document.getElementById('bridgeCefrBadge'),
      bridgeXpDisplay: document.getElementById('bridgeXpDisplay'),
      bridgeJoinBtn: document.getElementById('bridgeJoinEnglishBtn')
    };

    this.init();
  }

  init() {
    this.renderGrid();
    this.bindEvents();
    this.updateSpotlightBridge();
    this.syncJoinedBadges();

    // Subscribe to cau-store changes
    cauStore.subscribe((state) => {
      this.syncJoinedBadges();
      this.updateSpotlightBridge();
      this.updateCounters();
    });
  }

  renderGrid() {
    if (!this.dom.grid) return;

    const joinedIds = cauStore.getJoinedClubIds();
    let visibleCount = 0;

    this.dom.grid.innerHTML = '';

    CLUBS_DATA.forEach(club => {
      const isJoined = joinedIds.includes(club.id);

      // Filter matches
      const matchesCategory = (this.currentCategory === 'all' || club.category === this.currentCategory);
      const matchesSearch = !this.currentSearch || (
        club.title.toLowerCase().includes(this.currentSearch) ||
        club.description.toLowerCase().includes(this.currentSearch) ||
        club.activityTag.toLowerCase().includes(this.currentSearch) ||
        club.tags.some(t => t.includes(this.currentSearch))
      );
      const matchesJoined = !this.showOnlyJoined || isJoined;

      const isVisible = matchesCategory && matchesSearch && matchesJoined;
      if (isVisible) visibleCount++;

      const card = document.createElement('article');
      card.className = `cau-club-card cau-card ${isVisible ? '' : 'is-hidden'}`;
      card.setAttribute('data-club-id', club.id);
      card.setAttribute('data-category', club.category);
      if (!isVisible) card.style.display = 'none';

      card.innerHTML = `
        <div class="cau-club-card__media">
          <img src="${club.image}" alt="${club.title}" loading="lazy" decoding="async" width="480" height="300" />
          <span class="cau-club-card__badge">
            <i class="fa-solid fa-tag me-1"></i>${club.categoryLabel}
          </span>
          <span class="cau-club-card__activity">
            ${club.activityTag}
          </span>
        </div>
        <div class="cau-club-card__content">
          <h3 class="cau-club-card__title">${club.title}</h3>
          ${club.perkBadge ? `
            <div class="mb-2">
              <span class="badge" style="background: rgba(230, 59, 46, 0.12); color: var(--cau-coral, #e63b2e); border: 1px solid rgba(230, 59, 46, 0.3); font-weight: 700; font-size: 11px;">
                <i class="fa-solid fa-bolt me-1"></i>${club.perkBadge}
              </span>
            </div>
          ` : ''}
          <p class="cau-club-card__desc">${club.description}</p>
          <div class="cau-club-card__meta">
            <span class="cau-club-meta-item"><i class="fa-regular fa-clock me-1"></i>${club.schedule}</span>
            <span class="cau-club-meta-item"><i class="fa-solid fa-users me-1"></i>${club.membersCount + (isJoined ? 1 : 0)} Members</span>
          </div>
          <div class="cau-club-card__actions">
            ${isJoined ? `
              <button type="button" class="cau-btn cau-btn-success cau-btn-sm w-100 is-joined" data-action="joined" disabled>
                <i class="fa-solid fa-circle-check me-1"></i> Member (View in Dashboard)
              </button>
            ` : `
              <button type="button" class="cau-btn cau-btn-primary cau-btn-sm w-100 cau-join-trigger" data-club-id="${club.id}">
                Join Society <i class="fa-solid fa-arrow-right cau-btn-icon ms-1"></i>
              </button>
            `}
          </div>
        </div>
      `;

      // Event listener for Join button
      const joinBtn = card.querySelector('.cau-join-trigger');
      if (joinBtn) {
        joinBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.openJoinModal(club, joinBtn);
        });
      }

      this.dom.grid.appendChild(card);
    });

    if (this.dom.emptyState) {
      this.dom.emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    this.updateCounters(visibleCount);
  }

  updateCounters(visibleCount = null) {
    const joinedIds = cauStore.getJoinedClubIds();
    if (this.dom.joinedCountBadge) {
      this.dom.joinedCountBadge.textContent = joinedIds.length;
    }
    if (this.dom.totalCountBadge) {
      const count = visibleCount !== null ? visibleCount : this.dom.grid.querySelectorAll('.cau-club-card:not(.is-hidden)').length;
      this.dom.totalCountBadge.textContent = `${count} of ${CLUBS_DATA.length} Societies`;
    }
  }

  updateSpotlightBridge() {
    const state = cauStore.get();
    const cefr = state.englishArena.cefrLevel || 'Diagnostic Pending';
    const xp = state.englishArena.xp || 0;
    const isJoined = state.clubs.joinedClubIds.includes('english-debate');
    const shields = cauStore.getShields ? cauStore.getShields() : (state.englishArena.shields ?? 5);
    const maxShields = cauStore.getMaxShields ? cauStore.getMaxShields() : 5;

    if (this.dom.bridgeCefrBadge) {
      this.dom.bridgeCefrBadge.textContent = `CEFR: ${cefr}`;
    }
    if (this.dom.bridgeXpDisplay) {
      this.dom.bridgeXpDisplay.textContent = `${xp} XP • Level ${state.englishArena.level || 1} • 🛡️ ${shields}/${maxShields}`;
    }
    if (this.dom.bridgeJoinBtn) {
      if (isJoined) {
        this.dom.bridgeJoinBtn.innerHTML = '<i class="fa-solid fa-circle-check me-1"></i> Society Member (+1 Max Shield Active)';
        this.dom.bridgeJoinBtn.classList.remove('cau-btn-coral');
        this.dom.bridgeJoinBtn.classList.add('cau-btn-success');
        this.dom.bridgeJoinBtn.disabled = true;
      } else {
        this.dom.bridgeJoinBtn.innerHTML = '<i class="fa-solid fa-user-plus me-1"></i> Join English Society (Unlock 6th Shield)';
        this.dom.bridgeJoinBtn.classList.remove('cau-btn-success');
        this.dom.bridgeJoinBtn.classList.add('cau-btn-coral');
        this.dom.bridgeJoinBtn.disabled = false;
        this.dom.bridgeJoinBtn.onclick = () => {
          const englishClub = CLUBS_DATA.find(c => c.id === 'english-debate');
          if (englishClub) this.openJoinModal(englishClub, this.dom.bridgeJoinBtn);
        };
      }
    }
  }

  syncJoinedBadges() {
    const joinedIds = cauStore.getJoinedClubIds();
    document.querySelectorAll('.cau-club-card').forEach(card => {
      const clubId = card.getAttribute('data-club-id');
      const actionWrap = card.querySelector('.cau-club-card__actions');
      if (!actionWrap) return;

      if (joinedIds.includes(clubId)) {
        actionWrap.innerHTML = `
          <button type="button" class="cau-btn cau-btn-success cau-btn-sm w-100 is-joined" data-action="joined" disabled>
            <i class="fa-solid fa-circle-check me-1"></i> Member (View in Dashboard)
          </button>
        `;
      }
    });
  }

  bindEvents() {
    // 1. Category Filter Pills
    this.dom.pills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        this.dom.pills.forEach(p => {
          p.classList.remove('is-active');
          p.setAttribute('aria-selected', 'false');
        });
        pill.classList.add('is-active');
        pill.setAttribute('aria-selected', 'true');
        this.currentCategory = pill.getAttribute('data-category') || 'all';
        this.filterCards();
      });
    });

    // 2. Real-time Search Input
    if (this.dom.searchInput) {
      this.dom.searchInput.addEventListener('input', (e) => {
        this.currentSearch = e.target.value.trim().toLowerCase();
        this.filterCards();
      });

      // Keyboard shortcut: Press '/' to focus search
      document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== this.dom.searchInput && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
          e.preventDefault();
          this.dom.searchInput.focus();
        }
      });
    }

    // 3. My Joined Clubs Toggle
    if (this.dom.joinedToggle) {
      this.dom.joinedToggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.showOnlyJoined = !this.showOnlyJoined;
        this.dom.joinedToggle.classList.toggle('is-active', this.showOnlyJoined);
        this.filterCards();
      });
    }

    // 4. Modal Close Handlers
    if (this.dom.modalCloseBtn) {
      this.dom.modalCloseBtn.addEventListener('click', () => this.closeJoinModal());
    }
    if (this.dom.modalCancelBtn) {
      this.dom.modalCancelBtn.addEventListener('click', () => this.closeJoinModal());
    }

    // Overlay click & Escape key
    if (this.dom.modal) {
      this.dom.modal.addEventListener('click', (e) => {
        if (e.target === this.dom.modal || e.target.classList.contains('cau-modal-backdrop')) {
          this.closeJoinModal();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (!this.dom.modal || !this.dom.modal.classList.contains('is-open')) return;

        if (e.key === 'Escape') {
          this.closeJoinModal();
          return;
        }

        if (e.key === 'Tab') {
          const focusableSelectors = 'button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])';
          const focusables = Array.from(this.dom.modal.querySelectorAll(focusableSelectors))
            .filter(el => !el.disabled && el.offsetParent !== null);
          if (focusables.length === 0) return;

          const firstEl = focusables[0];
          const lastEl = focusables[focusables.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstEl) {
              e.preventDefault();
              lastEl.focus();
            }
          } else {
            if (document.activeElement === lastEl) {
              e.preventDefault();
              firstEl.focus();
            }
          }
        }
      });
    }

    // 5. Modal Form Submit
    if (this.dom.modalForm) {
      this.dom.modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmit();
      });
    }
  }

  filterCards() {
    const joinedIds = cauStore.getJoinedClubIds();
    let visibleCount = 0;

    const cards = this.dom.grid.querySelectorAll('.cau-club-card');
    cards.forEach(card => {
      const clubId = card.getAttribute('data-club-id');
      const cat = card.getAttribute('data-category');
      const club = CLUBS_DATA.find(c => c.id === clubId);
      if (!club) return;

      const isJoined = joinedIds.includes(clubId);
      const matchesCategory = (this.currentCategory === 'all' || cat === this.currentCategory);
      const matchesSearch = !this.currentSearch || (
        club.title.toLowerCase().includes(this.currentSearch) ||
        club.description.toLowerCase().includes(this.currentSearch) ||
        club.activityTag.toLowerCase().includes(this.currentSearch) ||
        club.tags.some(t => t.includes(this.currentSearch))
      );
      const matchesJoined = !this.showOnlyJoined || isJoined;

      const isVisible = matchesCategory && matchesSearch && matchesJoined;
      if (isVisible) {
        card.style.display = '';
        card.classList.remove('is-hidden');
        visibleCount++;
      } else {
        card.style.display = 'none';
        card.classList.add('is-hidden');
      }
    });

    if (this.dom.emptyState) {
      this.dom.emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    this.updateCounters(visibleCount);
  }

  openJoinModal(club, triggerElement) {
    if (!this.dom.modal) return;
    this.modalActiveClub = club;
    this.lastFocusedElement = triggerElement;

    const profile = cauStore.get().studentProfile;

    if (this.dom.modalClubName) this.dom.modalClubName.textContent = club.title;
    if (this.dom.modalClubCategory) this.dom.modalClubCategory.textContent = club.categoryLabel;
    if (this.dom.modalClubIdInput) this.dom.modalClubIdInput.value = club.id;

    // Pre-fill profile if available
    const nameInput = document.getElementById('modalStudentName');
    const idInput = document.getElementById('modalStudentId');
    const facultySelect = document.getElementById('modalFaculty');

    if (nameInput && profile.name) nameInput.value = profile.name;
    if (idInput && profile.studentId) idInput.value = profile.studentId;
    if (facultySelect && profile.faculty) facultySelect.value = profile.faculty;

    // Reset confirmation state
    const formCard = document.getElementById('modalFormCard');
    const successCard = document.getElementById('modalSuccessCard');
    if (formCard) formCard.style.display = 'block';
    if (successCard) successCard.style.display = 'none';

    this.dom.modal.classList.add('is-open');
    this.dom.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus trap: focus first field
    setTimeout(() => {
      const firstField = this.dom.modal.querySelector('input:not([type="hidden"]), select');
      if (firstField) firstField.focus();
    }, 120);
  }

  closeJoinModal() {
    if (!this.dom.modal) return;
    this.dom.modal.classList.remove('is-open');
    this.dom.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (this.dom.modalForm) this.dom.modalForm.reset();

    // Restore focus
    if (this.lastFocusedElement) {
      this.lastFocusedElement.focus();
      this.lastFocusedElement = null;
    }
  }

  handleFormSubmit() {
    if (!this.modalActiveClub) return;

    const name = (document.getElementById('modalStudentName')?.value || '').trim();
    const studentId = (document.getElementById('modalStudentId')?.value || '').trim();
    const faculty = document.getElementById('modalFaculty')?.value || 'Faculty of Engineering and Architecture';
    const role = document.getElementById('modalRoleInterest')?.value || 'Active Member';

    if (!name || !studentId) {
      alert('Please fill out your full name and student ID / email.');
      return;
    }

    // Commit to cauStore
    cauStore.joinClub({
      clubId: this.modalActiveClub.id,
      clubName: this.modalActiveClub.title,
      studentName: name,
      studentId: studentId,
      faculty: faculty,
      role: role
    });

    // Show Confirmation in Modal
    const formCard = document.getElementById('modalFormCard');
    const successCard = document.getElementById('modalSuccessCard');
    if (formCard) formCard.style.display = 'none';
    if (successCard) {
      successCard.style.display = 'block';
      const confName = document.getElementById('confMemberName');
      const confClub = document.getElementById('confClubTitle');
      const confRole = document.getElementById('confRole');
      if (confName) confName.textContent = name;
      if (confClub) confClub.textContent = this.modalActiveClub.title;
      if (confRole) confRole.textContent = role;
    }

    this.syncJoinedBadges();
    this.updateCounters();
    this.updateSpotlightBridge();
  }
}

// Auto-mount controller when DOM ready
if (typeof window !== 'undefined') {
  const bootClubs = () => {
    if (!window.cauClubsController) {
      window.cauClubsController = new ClubsController();
    }
  };
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', bootClubs);
  } else {
    bootClubs();
  }
}
