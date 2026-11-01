/**
 * ==============================================================================
 * CYPRUS AYDIN UNIVERSITY (CAU) — UNIFIED PORTAL & ENGAGEMENT STORE
 * Shared state manager for Clubs Portal, English Arena, Diagnostic Test & CMS
 * LocalStorage Schema: CAU_STATE_V1 ('cau_portal_state_v1')
 * ==============================================================================
 */

export const CAU_STORAGE_KEY = 'cau_portal_state_v1';
export const CAU_STATE_EVENT = 'cau:state-changed';

const defaultState = {
  studentProfile: {
    name: '',
    studentId: '',
    email: '',
    faculty: ''
  },
  clubs: {
    joinedClubIds: [],       // e.g. ['english-debate', 'software-ai', 'first-aid']
    applications: [],        // Array of { clubId, clubName, studentName, studentId, faculty, role, timestamp }
    bookmarkedIds: []
  },
  englishArena: {
    unlocked: false,
    accessTokenHash: null,
    cefrLevel: null,         // 'A1' | 'A2' | 'B1' | 'B2' | 'C1' (Synced from placement-test.html)
    xp: 0,
    level: 1,
    bestStreak: 0,
    badges: [],              // e.g. ['first-quest', 'streak-10', 'c1-master']
    activeSession: null,     // { questId, qIndex, score, streak, startedAtMs, durationMs, answers: [] }
    history: []              // Completed quest logs
  }
};

/**
 * Migration helper to import legacy individual localStorage items
 */
function migrateLegacyState(target) {
  let modified = false;

  // 1. Migrate Placement Test Result
  try {
    const legacyPlacement = localStorage.getItem('cau_placement_result');
    if (legacyPlacement) {
      const p = JSON.parse(legacyPlacement);
      if (p.cefrLevel && !target.englishArena.cefrLevel) {
        target.englishArena.cefrLevel = p.cefrLevel;
        modified = true;
      }
      if (p.candidateName && !target.studentProfile.name) {
        target.studentProfile.name = p.candidateName;
        modified = true;
      }
      if (p.candidateId && !target.studentProfile.studentId) {
        target.studentProfile.studentId = p.candidateId;
        modified = true;
      }
      if (p.faculty && !target.studentProfile.faculty) {
        target.studentProfile.faculty = p.faculty;
        modified = true;
      }
    }
  } catch {}

  // 2. Migrate Clubs Registrations
  try {
    const legacyClubs = localStorage.getItem('cau_club_registrations');
    if (legacyClubs) {
      const list = JSON.parse(legacyClubs);
      if (Array.isArray(list)) {
        list.forEach(reg => {
          // Normalize clubName to a slug if needed
          const slug = reg.clubId || reg.clubName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          if (!target.clubs.joinedClubIds.includes(slug)) {
            target.clubs.joinedClubIds.push(slug);
            modified = true;
          }
          if (!target.clubs.applications.some(a => a.clubId === slug)) {
            target.clubs.applications.push({
              clubId: slug,
              clubName: reg.clubName,
              studentName: reg.studentName || target.studentProfile.name,
              studentId: reg.studentId || target.studentProfile.studentId,
              faculty: reg.faculty || target.studentProfile.faculty,
              role: reg.role || 'Active Member',
              timestamp: reg.joinedAt || new Date().toISOString()
            });
            modified = true;
          }
        });
      }
    }
  } catch {}

  // 3. Migrate XP and Badges
  try {
    const legacyXP = localStorage.getItem('cau_quest_xp');
    if (legacyXP && target.englishArena.xp === 0) {
      target.englishArena.xp = parseInt(legacyXP, 10) || 0;
      target.englishArena.level = Math.floor(target.englishArena.xp / 200) + 1;
      modified = true;
    }
  } catch {}

  try {
    const legacyBadges = localStorage.getItem('cauBadges');
    if (legacyBadges) {
      const b = JSON.parse(legacyBadges);
      if (Array.isArray(b)) {
        b.forEach(id => {
          if (!target.englishArena.badges.includes(id)) {
            target.englishArena.badges.push(id);
            modified = true;
          }
        });
      }
    }
  } catch {}

  return modified;
}

/**
 * Load complete portal state with fallbacks & legacy migration
 */
export function getCauState() {
  try {
    const raw = localStorage.getItem(CAU_STORAGE_KEY);
    if (!raw) {
      const initial = JSON.parse(JSON.stringify(defaultState));
      migrateLegacyState(initial);
      setCauState(initial);
      return initial;
    }
    const state = JSON.parse(raw);
    const merged = {
      ...defaultState,
      ...state,
      studentProfile: { ...defaultState.studentProfile, ...(state.studentProfile || {}) },
      clubs: { ...defaultState.clubs, ...(state.clubs || {}) },
      englishArena: { ...defaultState.englishArena, ...(state.englishArena || {}) }
    };

    if (migrateLegacyState(merged)) {
      setCauState(merged);
    }
    return merged;
  } catch (e) {
    console.warn('Failed to parse CAU portal state from localStorage:', e);
    return JSON.parse(JSON.stringify(defaultState));
  }
}

/**
 * Save complete portal state and broadcast custom event
 */
export function setCauState(newState) {
  try {
    localStorage.setItem(CAU_STORAGE_KEY, JSON.stringify(newState));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(CAU_STATE_EVENT, { detail: newState }));
    }
  } catch (e) {
    console.error('Failed to write CAU portal state to localStorage:', e);
  }
}

/**
 * Update partial state
 */
export function updateCauState(mutator) {
  const current = getCauState();
  mutator(current);
  setCauState(current);
  return current;
}

// ─────────────────────────────────────────────────────────────────────────────
// SPECIFIC CONVENIENCE API
// ─────────────────────────────────────────────────────────────────────────────

export const cauStore = {
  get: getCauState,
  set: setCauState,
  update: updateCauState,

  // Student Profile
  setProfile(profile) {
    return updateCauState(s => {
      s.studentProfile = { ...s.studentProfile, ...profile };
    });
  },

  // Clubs API
  joinClub({ clubId, clubName, studentName, studentId, faculty, role = 'Active Member' }) {
    const record = {
      clubId,
      clubName,
      studentName,
      studentId,
      faculty,
      role,
      timestamp: new Date().toISOString()
    };

    const nextState = updateCauState(s => {
      if (!s.clubs.joinedClubIds.includes(clubId)) {
        s.clubs.joinedClubIds.push(clubId);
      }
      const existingIdx = s.clubs.applications.findIndex(a => a.clubId === clubId);
      if (existingIdx >= 0) {
        s.clubs.applications[existingIdx] = record;
      } else {
        s.clubs.applications.push(record);
      }
      if (studentName) s.studentProfile.name = studentName;
      if (studentId) s.studentProfile.studentId = studentId;
      if (faculty) s.studentProfile.faculty = faculty;
    });

    // Also sync to legacy cau_club_registrations for backward compatibility
    try {
      localStorage.setItem('cau_club_registrations', JSON.stringify(nextState.clubs.applications));
    } catch {}

    return nextState;
  },

  isClubJoined(clubId) {
    const s = getCauState();
    return s.clubs.joinedClubIds.includes(clubId);
  },

  getJoinedClubIds() {
    return getCauState().clubs.joinedClubIds;
  },

  // English Arena API
  unlockArena(accessTokenHash) {
    return updateCauState(s => {
      s.englishArena.unlocked = true;
      s.englishArena.accessTokenHash = accessTokenHash;
    });
  },

  isArenaUnlocked() {
    return getCauState().englishArena.unlocked;
  },

  setCefrLevel(cefrLevel) {
    return updateCauState(s => {
      s.englishArena.cefrLevel = cefrLevel;
    });
  },

  addXP(amount) {
    return updateCauState(s => {
      s.englishArena.xp += amount;
      s.englishArena.level = Math.floor(s.englishArena.xp / 200) + 1;
      try {
        localStorage.setItem('cau_quest_xp', String(s.englishArena.xp));
      } catch {}
    });
  },

  unlockBadge(badgeId) {
    return updateCauState(s => {
      if (!s.englishArena.badges.includes(badgeId)) {
        s.englishArena.badges.push(badgeId);
        try {
          localStorage.setItem('cauBadges', JSON.stringify(s.englishArena.badges));
        } catch {}
      }
    });
  },

  updateStreak(streak) {
    return updateCauState(s => {
      if (streak > s.englishArena.bestStreak) {
        s.englishArena.bestStreak = streak;
      }
    });
  },

  saveActiveSession(session) {
    return updateCauState(s => {
      s.englishArena.activeSession = session;
    });
  },

  clearActiveSession() {
    return updateCauState(s => {
      s.englishArena.activeSession = null;
    });
  },

  recordQuestHistory(entry) {
    return updateCauState(s => {
      s.englishArena.history.unshift({
        ...entry,
        completedAt: new Date().toISOString()
      });
      if (s.englishArena.history.length > 30) {
        s.englishArena.history = s.englishArena.history.slice(0, 30);
      }
      s.englishArena.activeSession = null;
    });
  },

  // Subscription for UI reactive updates
  subscribe(callback) {
    const handler = (e) => callback(e.detail);
    window.addEventListener(CAU_STATE_EVENT, handler);
    window.addEventListener('storage', (e) => {
      if (e.key === CAU_STORAGE_KEY) {
        try {
          callback(JSON.parse(e.newValue));
        } catch {}
      }
    });
    return () => {
      window.removeEventListener(CAU_STATE_EVENT, handler);
    };
  }
};

// Also expose globally on window for non-module scripts
if (typeof window !== 'undefined') {
  window.cauStore = cauStore;
  window.getCauState = getCauState;
  window.setCauState = setCauState;
}
