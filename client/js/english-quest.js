/**
 * ==============================================================================
 * CYPRUS AYDIN UNIVERSITY (CAU) — DUOLINGO-INSPIRED EDUTAINMENT ARENA
 * Tailored for CAU English Preparatory School Students
 *
 * Core Features:
 * 1. 3-Column Edutainment Hub (Nav Rail, Winding Skill Tree, Gamified Sidebar)
 * 2. 4 Interactive Mechanics:
 *    - Word-Bank Sentence Builder (Tap Chips)
 *    - Match Madness (2-Column Fast Timed Pairing)
 *    - Audio Intercept (Web Speech API TTS Listening & Dictation)
 *    - Campus Chat Simulator (Contextual Dialogue)
 * 3. 5 Academic Shields (Hearts) + Bonus Shield for English Club Members
 * 4. Spaced-Repetition Loop (Missed questions re-queued until 100% mastery)
 * 5. Procedural Audio Feedback via arena-sfx.js (Web Audio API)
 * 6. Code Redemption Modal (SHA-256) for 2x XP Boosters & Shield Refills
 * 7. Seeded CAU Prep School League & Faculty Wars Leaderboard
 * ==============================================================================
 */

import { cauStore, getCauState, setCauState } from './cau-store.js';
import { arenaSfx } from './arena-sfx.js';
import { verifyArenaCode } from './arena-hashes.js';

/* ── Seeded CAU Prep School League Data ── */
const PREP_LEAGUE_STUDENTS = [
  { name: 'Omar Abo Jmei', faculty: 'Engineering', xp: 420, avatar: 'O', trend: 'up' },
  { name: 'Elena Rostova', faculty: 'Law & Diplomacy', xp: 380, avatar: 'E', trend: 'up' },
  { name: 'Yasir Jamal', faculty: 'Tourism', xp: 350, avatar: 'Y', trend: 'up' },
  { name: 'Setia Santoso', faculty: 'Business Admin', xp: 310, avatar: 'S', trend: 'same' },
  { name: 'Tariq Mansoor', faculty: 'Health Sciences', xp: 280, avatar: 'T', trend: 'down' },
  { name: 'Fatma Al-Sayed', faculty: 'Dentistry', xp: 260, avatar: 'F', trend: 'same' },
  { name: 'Romeo Lele Koyue', faculty: 'Graduate Institute', xp: 240, avatar: 'R', trend: 'down' },
  { name: 'Amina Diallo', faculty: 'Applied Sciences', xp: 210, avatar: 'A', trend: 'down' },
  { name: 'Lucas Chen', faculty: 'Engineering', xp: 190, avatar: 'L', trend: 'down' }
];

const FACULTY_WARS_DATA = [
  { faculty: 'Faculty of Engineering & AI', totalXp: 3420, activeStudents: 48, leadBadge: '🏆 1st Place' },
  { faculty: 'Faculty of Health Sciences & Physio', totalXp: 2980, activeStudents: 36, leadBadge: '2nd Place' },
  { faculty: 'Faculty of Law & Diplomacy', totalXp: 2450, activeStudents: 29, leadBadge: '3rd Place' },
  { faculty: 'Faculty of Economics & Business', totalXp: 2180, activeStudents: 24, leadBadge: '4th Place' }
];

/* ── Curated Prep School Units & Multi-Modal Question Bank ── */
const PREP_SKILL_TREE = [
  {
    unitId: 'unit-1',
    unitNumber: 1,
    title: 'Freshers Week & Campus Survival',
    cefr: 'CEFR A1/A2',
    desc: 'Campus navigation, transport, café requests, and joining student societies.',
    themeClass: '',
    nodes: [
      {
        id: 'node-1-1',
        title: 'Shuttle Bus & Directions',
        skillTag: 'Campus Directions',
        type: 'lesson',
        xpReward: 20,
        questions: [
          {
            mechanic: 'sentence_builder',
            prompt: 'Assemble the polite inquiry for the campus shuttle bus:',
            targetWords: ['Does', 'this', 'shuttle', 'bus', 'stop', 'at', 'the', 'North', 'Gate?'],
            distractorWords: ['arrive', 'on', 'are'],
            tip: 'English questions with auxiliary "Does" take the base verb ("stop", not "stops").'
          },
          {
            mechanic: 'chat_simulator',
            speaker: 'Campus Guide',
            message: 'Hello! Are you looking for the Central Library or the Student Registrar?',
            options: [
              { text: 'Excuse me, could you point me toward the Central Library, please?', isCorrect: true },
              { text: 'Give me the books right now.', isCorrect: false },
              { text: 'I am lost forever on this campus.', isCorrect: false }
            ],
            tip: 'Academic politeness uses "Excuse me, could you point me toward...".'
          }
        ]
      },
      {
        id: 'node-1-2',
        title: 'Ordering at the Campus Café',
        skillTag: 'Café & Daily Life',
        type: 'lesson',
        xpReward: 25,
        questions: [
          {
            mechanic: 'audio_intercept',
            prompt: 'Listen carefully and assemble the student order:',
            spokenText: 'I would like a medium black coffee and a croissant, please.',
            targetWords: ['I', 'would', 'like', 'a', 'medium', 'black', 'coffee', 'and', 'a', 'croissant,', 'please.'],
            distractorWords: ['want', 'tea', 'bring'],
            tip: '"I would like..." is the standard polite formulation in English café interactions.'
          },
          {
            mechanic: 'sentence_builder',
            prompt: 'Assemble the request for a student discount:',
            targetWords: ['Could', 'I', 'please', 'use', 'my', 'student', 'ID', 'for', 'a', 'discount?'],
            distractorWords: ['give', 'card', 'free'],
            tip: 'Modal verb "Could" softens the request for proper campus etiquette.'
          }
        ]
      },
      {
        id: 'node-1-3',
        title: 'Joining a Student Club',
        skillTag: 'Extracurriculars',
        type: 'lesson',
        xpReward: 30,
        questions: [
          {
            mechanic: 'chat_simulator',
            speaker: 'English Club President',
            message: 'Welcome to the CAU English Arena & Debate Society! Are you interested in competitive debating or informal conversation nights?',
            options: [
              { text: 'I would love to participate in both to improve my speaking confidence!', isCorrect: true },
              { text: 'I only came here because attendance is mandatory.', isCorrect: false },
              { text: 'Debates are too loud for me.', isCorrect: false }
            ],
            tip: 'Expressing enthusiastic involvement reflects great student leadership.'
          },
          {
            mechanic: 'sentence_builder',
            prompt: 'Assemble the statement of club registration:',
            targetWords: ['I', 'have', 'registered', 'for', 'the', 'Model', 'UN', 'delegation.'],
            distractorWords: ['joined', 'to', 'make'],
            tip: 'Present perfect ("have registered") indicates a recently completed action with present relevance.'
          }
        ]
      },
      {
        id: 'node-1-4',
        title: 'Unit 1 Chest Reward',
        type: 'chest',
        xpReward: 100,
        unlockedNote: 'Freshers Survival Mastered! +100 XP awarded to your student profile.'
      }
    ]
  },
  {
    unitId: 'unit-2',
    unitNumber: 2,
    title: 'Classroom & Prep School Mastery',
    cefr: 'CEFR B1/B1+',
    desc: 'Emailing professors, academic collocations, and high-speed vocabulary pairing.',
    themeClass: 'unit-theme-2',
    nodes: [
      {
        id: 'node-2-1',
        title: 'Emailing Your Professor Politely',
        skillTag: 'Formal Email Register',
        type: 'lesson',
        xpReward: 30,
        questions: [
          {
            mechanic: 'sentence_builder',
            prompt: 'Assemble the formal email salutation and purpose:',
            targetWords: ['Dear', 'Professor', 'Evans,', 'I', 'am', 'writing', 'to', 'inquire', 'about', 'the', 'syllabus.'],
            distractorWords: ['Hey', 'ask', 'demanding'],
            tip: '"I am writing to inquire about..." establishes an appropriate academic register.'
          },
          {
            mechanic: 'chat_simulator',
            speaker: 'Professor Evans',
            message: 'Dear Student, please make sure your draft follows APA citation guidelines before Friday at 5:00 PM.',
            options: [
              { text: 'Thank you, Professor. I will review my citations and submit promptly before the deadline.', isCorrect: true },
              { text: 'Friday is too soon, give me next month.', isCorrect: false },
              { text: 'I don't know what APA citations are.', isCorrect: false }
            ],
            tip: 'Acknowledging guidelines and confirming prompt submission maintains professionalism.'
          }
        ]
      },
      {
        id: 'node-2-2',
        title: 'Academic Collocations & Verbs',
        skillTag: 'Academic Word List (AWL)',
        type: 'lesson',
        xpReward: 35,
        questions: [
          {
            mechanic: 'sentence_builder',
            prompt: 'Assemble the scholarly research sentence:',
            targetWords: ['The', 'researchers', 'conducted', 'an', 'extensive', 'empirical', 'investigation.'],
            distractorWords: ['did', 'made', 'big'],
            tip: 'Academic writing pairs "conducted" with "investigation" rather than informal "did".'
          },
          {
            mechanic: 'audio_intercept',
            prompt: 'Listen and assemble the lecture announcement:',
            spokenText: 'All students must submit their lab reports prior to the published deadline.',
            targetWords: ['All', 'students', 'must', 'submit', 'their', 'lab', 'reports', 'prior', 'to', 'the', 'published', 'deadline.'],
            distractorWords: ['before', 'after', 'hand'],
            tip: '"Prior to" is the formal preposition for "before" in university contexts.'
          }
        ]
      },
      {
        id: 'node-2-3',
        title: 'Match Madness: Academic Vocab',
        skillTag: 'Speed Vocabulary',
        type: 'match_madness',
        xpReward: 40,
        pairs: [
          { term: 'Synthesize', def: 'Combine diverse concepts into a unified whole' },
          { term: 'Mandatory', def: 'Compulsory and legally or officially required' },
          { term: 'Substantiate', def: 'Provide solid evidence to prove a claim' },
          { term: 'Collocation', def: 'Natural pairing of words that occur together' },
          { term: 'Pragmatics', def: 'Study of language in social and practical contexts' }
        ]
      },
      {
        id: 'node-2-4',
        title: 'Unit 2 Chest Reward',
        type: 'chest',
        xpReward: 150,
        unlockedNote: 'Academic Syntax Mastered! +150 XP awarded.'
      }
    ]
  },
  {
    unitId: 'unit-3',
    unitNumber: 3,
    title: 'Debate, Law & Tech Symposium',
    cefr: 'CEFR B2/C1',
    desc: 'Critical rhetoric, fallacy detection, abstract reading, and Mock Exemption Boss Raid.',
    themeClass: 'unit-theme-3',
    nodes: [
      {
        id: 'node-3-1',
        title: 'Spotting Logical Fallacies',
        skillTag: 'Debate & Rhetoric',
        type: 'lesson',
        xpReward: 40,
        questions: [
          {
            mechanic: 'chat_simulator',
            speaker: 'Debate Adjudicator',
            message: 'Speaker A argued that their opponent is too young to understand economic policy. What fallacy was committed?',
            options: [
              { text: 'An Ad Hominem fallacy: attacking the speaker personal character instead of their argument.', isCorrect: true },
              { text: 'A Straw Man fallacy: exaggerating the opponent position.', isCorrect: false },
              { text: 'A Slippery Slope fallacy: predicting extreme chain reactions.', isCorrect: false }
            ],
            tip: 'Ad Hominem attacks the person making the claim rather than addressing the argument substance.'
          },
          {
            mechanic: 'sentence_builder',
            prompt: 'Assemble the academic rebuttal:',
            targetWords: ['The', 'empirical', 'evidence', 'directly', 'refutes', 'the', 'author', 'hypothesis.'],
            distractorWords: ['breaks', 'kills', 'bad'],
            tip: '"Directly refutes" is the standard scholarly phrasing when disproving a claim.'
          }
        ]
      },
      {
        id: 'node-3-2',
        title: 'Technical & Medical Abstracts',
        skillTag: 'Research Discourse',
        type: 'lesson',
        xpReward: 45,
        questions: [
          {
            mechanic: 'audio_intercept',
            prompt: 'Listen and transcribe the clinical methodology statement:',
            spokenText: 'The randomized clinical trial demonstrated statistically significant improvements in patient mobility.',
            targetWords: ['The', 'randomized', 'clinical', 'trial', 'demonstrated', 'statistically', 'significant', 'improvements', 'in', 'patient', 'mobility.'],
            distractorWords: ['good', 'showed', 'very'],
            tip: '"Demonstrated statistically significant improvements" is standard medical research discourse.'
          }
        ]
      },
      {
        id: 'node-3-3',
        title: 'Boss Raid: Exemption Mock Exam',
        skillTag: 'Prep School Exemption',
        type: 'boss_raid',
        xpReward: 100,
        questions: [
          {
            mechanic: 'sentence_builder',
            prompt: 'RAID 1/3 — Inverted Conditional Construction:',
            targetWords: ['Had', 'the', 'committee', 'reviewed', 'the', 'budget,', 'the', 'grant', 'would', 'have', 'been', 'approved.'],
            distractorWords: ['If', 'has', 'being'],
            tip: 'Inverted third conditional ("Had the committee reviewed...") omits "if" for high academic register.'
          },
          {
            mechanic: 'match_madness',
            pairs: [
              { term: 'Hedging', def: 'Cautious academic language (e.g. indicates, suggests)' },
              { term: 'Nominalization', def: 'Converting verbs into nouns (e.g. evaluate -> evaluation)' },
              { term: 'Inference', def: 'Deducing logical conclusions from textual evidence' },
              { term: 'Exemption', def: 'Direct waiver from preparatory school course requirements' }
            ]
          },
          {
            mechanic: 'chat_simulator',
            speaker: 'Faculty Dean',
            message: 'You have completed the advanced academic language symposium with high honors. How will you apply this in your degree faculty?',
            options: [
              { text: 'I will apply critical analysis, clear scholarly citation, and active debate in my departmental seminars.', isCorrect: true },
              { text: 'I will never study English ever again.', isCorrect: false },
              { text: 'I just wanted the exam certificate.', isCorrect: false }
            ],
            tip: 'Academic commitment and continuous scholarship are the hallmarks of a CAU graduate.'
          }
        ]
      },
      {
        id: 'node-3-4',
        title: 'Master Exemption Trophy',
        type: 'chest',
        xpReward: 250,
        unlockedNote: 'Prep School Exemption Standard Achieved! Outstanding scholarship.'
      }
    ]
  }
];

/* ── CAU Edutainment Controller ── */
export class CauEdutainmentApp {
  constructor() {
    this.state = getCauState();
    this.currentUnit = 0;
    this.activeLesson = null;
    this.currentQIndex = 0;
    this.lessonQueue = [];
    this.stagedWords = [];
    this.selectedMatchTerm = null;
    this.matchedPairsCount = 0;
    this.lessonXpEarned = 0;
    this.mistakesCount = 0;
    this.isAnswerChecked = false;
    this.isOptionLocked = false;
    this.questionStartTime = Date.now();

    this.cacheDom();
    this.bindEvents();
    this.renderTopHud();
    this.renderSkillTree();
    this.renderLeaderboard('prep');
    this.renderBounties();

    // Listen to store updates
    cauStore.subscribe((newState) => {
      this.state = newState;
      this.renderTopHud();
      this.renderSkillTree();
      this.renderBounties();
    });
  }

  cacheDom() {
    this.dom = {
      // Containers
      appShell: document.querySelector('.cau-arena-shell'),
      skillTreeHub: document.getElementById('skillTreeHub'),
      lessonStage: document.getElementById('lessonStage'),
      celebrationOverlay: document.getElementById('celebrationOverlay'),
      codeModal: document.getElementById('redeemCodeModal'),
      codeModalInput: document.getElementById('clubVoucherInput'),
      codeModalError: document.getElementById('codeModalError'),
      codeModalSuccess: document.getElementById('codeModalSuccess'),

      // Top HUD
      tierSelect: document.getElementById('hudTierSelect'),
      streakCount: document.getElementById('hudStreakCount'),
      xpCount: document.getElementById('hudXpCount'),
      shieldCount: document.getElementById('hudShieldCount'),
      boosterBadge: document.getElementById('hudBoosterBadge'),
      muteBtn: document.getElementById('hudMuteBtn'),

      // Skill Tree
      treeContainer: document.getElementById('skillPathContainer'),

      // Lesson Stage
      lessonProgressBar: document.getElementById('lessonProgressBar'),
      lessonShieldCount: document.getElementById('lessonShieldCount'),
      lessonPromptTitle: document.getElementById('lessonPromptTitle'),
      lessonContentArea: document.getElementById('lessonContentArea'),
      checkBar: document.getElementById('eduCheckBar'),
      checkBarStatus: document.getElementById('checkBarStatus'),
      combatFeedbackDrawer: document.getElementById('combatFeedbackDrawer'),
      checkActionBtn: document.getElementById('checkActionBtn'),
      skipBtn: document.getElementById('skipQuestionBtn'),

      // Sidebar
      leaderboardList: document.getElementById('leaderboardList'),
      tabPrepLeague: document.getElementById('tabPrepLeague'),
      tabFacultyWars: document.getElementById('tabFacultyWars'),
      bountyXpFill: document.getElementById('bountyXpFill'),
      bountyXpText: document.getElementById('bountyXpText'),
      bountyListeningStatus: document.getElementById('bountyListeningStatus'),
      bountyShieldsStatus: document.getElementById('bountyShieldsStatus')
    };
  }

  bindEvents() {
    // Mute toggle
    if (this.dom.muteBtn) {
      this.dom.muteBtn.addEventListener('click', () => {
        const isMuted = arenaSfx.toggleMute();
        this.dom.muteBtn.innerHTML = isMuted ? '<i class="fa-solid fa-volume-xmark"></i>' : '<i class="fa-solid fa-volume-high"></i>';
      });
    }

    // CEFR Tier select
    if (this.dom.tierSelect) {
      this.dom.tierSelect.addEventListener('change', (e) => {
        cauStore.setCefrLevel(e.target.value);
        arenaSfx.playClick();
      });
    }

    // Leaderboard Tabs
    if (this.dom.tabPrepLeague) {
      this.dom.tabPrepLeague.addEventListener('click', () => this.renderLeaderboard('prep'));
    }
    if (this.dom.tabFacultyWars) {
      this.dom.tabFacultyWars.addEventListener('click', () => this.renderLeaderboard('faculty'));
    }

    // Code Redeem Modal Trigger
    const redeemTriggers = document.querySelectorAll('.js-open-redeem-modal');
    redeemTriggers.forEach(btn => {
      btn.addEventListener('click', () => this.openRedeemModal());
    });

    const closeCodeModalBtn = document.getElementById('closeCodeModalBtn');
    if (closeCodeModalBtn) {
      closeCodeModalBtn.addEventListener('click', () => this.closeRedeemModal());
    }

    const submitCodeBtn = document.getElementById('submitClubCodeBtn');
    if (submitCodeBtn) {
      submitCodeBtn.addEventListener('click', () => this.handleRedeemCode());
    }

    // Check Bar Buttons
    if (this.dom.checkActionBtn) {
      this.dom.checkActionBtn.addEventListener('click', () => {
        if (!this.isAnswerChecked) {
          this.checkCurrentAnswer();
        } else {
          this.advanceLesson();
        }
      });
    }

    if (this.dom.skipBtn) {
      this.dom.skipBtn.addEventListener('click', () => {
        if (!this.isAnswerChecked) {
          this.handleIncorrectAnswer('Question skipped.');
        }
      });
    }

    // Global Keyboards
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (this.dom.lessonStage && this.dom.lessonStage.style.display !== 'none') {
          if (!this.isAnswerChecked && !this.dom.checkActionBtn.disabled) {
            this.checkCurrentAnswer();
          } else if (this.isAnswerChecked) {
            this.advanceLesson();
          }
        }
      }
    });

    const closeLessonBtn = document.getElementById('closeLessonBtn');
    if (closeLessonBtn) {
      closeLessonBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to exit? Mid-lesson progress will be lost.')) {
          this.exitLessonToHub();
        }
      });
    }

    const finishCelebrationBtn = document.getElementById('finishCelebrationBtn');
    if (finishCelebrationBtn) {
      finishCelebrationBtn.addEventListener('click', () => {
        this.closeCelebration();
      });
    }
  }

  /* ── 1. Top HUD Rendering ── */
  renderTopHud() {
    const s = this.state.englishArena;
    if (this.dom.streakCount) this.dom.streakCount.textContent = s.bestStreak || 1;
    if (this.dom.xpCount) this.dom.xpCount.textContent = s.xp || 0;

    const shieldsInfo = cauStore.getShields();
    if (this.dom.shieldCount) {
      this.dom.shieldCount.textContent = `${shieldsInfo.current}/${shieldsInfo.max}`;
      if (shieldsInfo.hasBonus) {
        this.dom.shieldCount.title = 'Includes +1 CAU English Club Bonus Shield!';
      }
    }

    const urlTier = new URLSearchParams(window.location.search).get('tier');
    if (urlTier && ['A1', 'A2', 'B1', 'B2', 'C1'].includes(urlTier)) {
      if (!s.cefrLevel || s.cefrLevel !== urlTier) {
        cauStore.setCefrLevel(urlTier);
      }
      if (this.dom.tierSelect) this.dom.tierSelect.value = urlTier;
    } else if (this.dom.tierSelect && s.cefrLevel) {
      this.dom.tierSelect.value = s.cefrLevel;
    }

    // Booster Badge
    if (this.dom.boosterBadge) {
      const isBooster = cauStore.isXpBoosterActive();
      this.dom.boosterBadge.style.display = isBooster ? 'inline-flex' : 'none';
    }
  }

  /* ── 2. Winding Skill Tree Rendering ── */
  renderSkillTree() {
    if (!this.dom.treeContainer) return;
    const completed = this.state.englishArena.completedNodeIds || ['node-1-1'];
    let html = '';

    PREP_SKILL_TREE.forEach((unit) => {
      html += `
        <div class="edu-unit-card mb-4">
          <div class="edu-unit-header ${unit.themeClass}">
            <span class="edu-unit-badge">UNIT ${unit.unitNumber} • ${unit.cefr}</span>
            <h3 class="edu-unit-title">${unit.title}</h3>
            <p class="edu-unit-desc">${unit.desc}</p>
          </div>
          <div class="edu-path-track">
      `;

      unit.nodes.forEach((node, nodeIdx) => {
        const isCompleted = completed.includes(node.id);
        const prevNodeId = nodeIdx > 0 ? unit.nodes[nodeIdx - 1].id : null;
        const isUnlocked = nodeIdx === 0 || completed.includes(prevNodeId);

        let stateClass = 'state-locked';
        let iconHtml = '<i class="fa-solid fa-lock"></i>';

        if (node.type === 'chest') {
          stateClass = isCompleted ? 'state-completed' : (isUnlocked ? 'state-chest' : 'state-locked');
          iconHtml = isCompleted ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-gift"></i>';
        } else if (isCompleted) {
          stateClass = 'state-completed';
          iconHtml = '<i class="fa-solid fa-check"></i>';
        } else if (isUnlocked) {
          stateClass = 'state-active';
          iconHtml = '<i class="fa-solid fa-star"></i>';
        }

        html += `
          <div class="edu-node-wrap">
            <button
              type="button"
              class="edu-node-btn ${stateClass}"
              data-node-id="${node.id}"
              ${!isUnlocked && !isCompleted ? 'disabled' : ''}
              aria-label="${node.title}"
            >
              ${iconHtml}
            </button>
            <span class="edu-node-label">${node.title}</span>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    this.dom.treeContainer.innerHTML = html;

    // Attach click events to nodes
    const nodeBtns = this.dom.treeContainer.querySelectorAll('.edu-node-btn:not(:disabled)');
    nodeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const nodeId = btn.getAttribute('data-node-id');
        this.handleNodeClick(nodeId);
      });
    });
  }

  handleNodeClick(nodeId) {
    let foundNode = null;
    PREP_SKILL_TREE.forEach(unit => {
      const match = unit.nodes.find(n => n.id === nodeId);
      if (match) foundNode = match;
    });

    if (!foundNode) return;

    if (foundNode.type === 'chest') {
      // Chest claim
      arenaSfx.playChestUnlock();
      cauStore.completeNode(foundNode.id, foundNode.xpReward);
      alert(`🎉 Treasure Chest Unlocked! + ${foundNode.xpReward} Academic XP earned!`);
      this.renderSkillTree();
      this.renderTopHud();
    } else {
      // Launch Lesson
      arenaSfx.playClick();
      this.startLesson(foundNode);
    }
  }

    animateProgressBar(targetPct) {
    if (!this.dom.lessonProgressBar) return;
    const startPct = parseFloat(this.dom.lessonProgressBar.style.width || '0');
    const startTime = Date.now();
    const duration = 250;
    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      const current = startPct + (targetPct - startPct) * progress;
      if (this.dom.lessonProgressBar) this.dom.lessonProgressBar.style.width = `${current}%`;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }

  /* ── 3. Multi-Modal Interactive Lesson Stage ── */
  startLesson(node) {
    this.activeLesson = node;
    this.currentQIndex = 0;
    this.lessonXpEarned = 0;
    this.mistakesCount = 0;

    // Queue questions (clone array)
    this.lessonQueue = [...node.questions];

    if (this.dom.skillTreeHub) this.dom.skillTreeHub.style.display = 'none';
    if (this.dom.lessonStage) this.dom.lessonStage.style.display = 'block';

    this.renderCurrentQuestion();
  }

  renderCurrentQuestion() {
    if (this.currentQIndex >= this.lessonQueue.length) {
      this.completeLessonSuccess();
      return;
    }

    const q = this.lessonQueue[this.currentQIndex];
    this.isOptionLocked = false;
    this.questionStartTime = Date.now();
    this.isAnswerChecked = false;
    this.stagedWords = [];
    this.selectedMatchTerm = null;
    this.matchedPairsCount = 0;

    // Update progress bar with smooth requestAnimationFrame delta
    const pct = (this.currentQIndex / this.lessonQueue.length) * 100;
    this.animateProgressBar(pct);

    // Update lesson shields
    const shieldsInfo = cauStore.getShields();
    if (this.dom.lessonShieldCount) {
      this.dom.lessonShieldCount.textContent = `🛡️ ${shieldsInfo.current}`;
    }

    // Reset check bar
    this.resetCheckBar();

    if (!this.dom.lessonContentArea) return;

    if (q.mechanic === 'sentence_builder') {
      this.renderSentenceBuilder(q);
    } else if (q.mechanic === 'match_madness') {
      this.renderMatchMadness(q);
    } else if (q.mechanic === 'audio_intercept') {
      this.renderAudioIntercept(q);
    } else if (q.mechanic === 'chat_simulator') {
      this.renderChatSimulator(q);
    }
  }

  /* Mechanic 1: Sentence Builder */
  renderSentenceBuilder(q) {
    if (this.dom.lessonPromptTitle) this.dom.lessonPromptTitle.textContent = q.prompt;

    const allWords = [...q.targetWords, ...q.distractorWords].sort(() => Math.random() - 0.5);

    let html = `
      <div class="edu-answer-tray" id="eduAnswerTray" aria-label="Selected words tray"></div>
      <div class="edu-chips-bank" id="eduChipsBank">
    `;

    allWords.forEach((w, idx) => {
      html += `<button type="button" class="edu-word-chip" data-word-idx="${idx}" data-word="${w}">${w}</button>`;
    });

    html += `</div>`;
    this.dom.lessonContentArea.innerHTML = html;

    const chips = this.dom.lessonContentArea.querySelectorAll('.edu-word-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        arenaSfx.playClick();
        const word = chip.getAttribute('data-word');
        chip.classList.add('is-used');
        this.addWordToTray(word, chip);
      });
    });
  }

  addWordToTray(word, originalChip) {
    const tray = document.getElementById('eduAnswerTray');
    if (!tray) return;

    const trayChip = document.createElement('button');
    trayChip.type = 'button';
    trayChip.className = 'edu-word-chip';
    trayChip.textContent = word;
    trayChip.addEventListener('click', () => {
      arenaSfx.playClick();
      originalChip.classList.remove('is-used');
      tray.removeChild(trayChip);
      this.stagedWords = this.stagedWords.filter(item => item.chip !== trayChip);
      this.updateCheckBtnState();
    });

    tray.appendChild(trayChip);
    this.stagedWords.push({ word, chip: trayChip, originalChip });
    this.updateCheckBtnState();
  }

  /* Mechanic 2: Speed Match Madness */
  renderMatchMadness(q) {
    if (this.dom.lessonPromptTitle) this.dom.lessonPromptTitle.textContent = 'Speed Match: Pair each term with its definition!';

    const terms = q.pairs.map(p => ({ text: p.term, type: 'term', pairId: p.term })).sort(() => Math.random() - 0.5);
    const defs = q.pairs.map(p => ({ text: p.def, type: 'def', pairId: p.term })).sort(() => Math.random() - 0.5);

    let html = `<div class="edu-match-grid">`;
    html += `<div class="d-flex flex-column gap-3">`;
    terms.forEach(t => {
      html += `<button type="button" class="edu-match-card" data-pair-id="${t.pairId}" data-type="term">${t.text}</button>`;
    });
    html += `</div><div class="d-flex flex-column gap-3">`;
    defs.forEach(d => {
      html += `<button type="button" class="edu-match-card" data-pair-id="${d.pairId}" data-type="def">${d.text}</button>`;
    });
    html += `</div></div>`;

    this.dom.lessonContentArea.innerHTML = html;

    const cards = this.dom.lessonContentArea.querySelectorAll('.edu-match-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        arenaSfx.playClick();
        this.handleMatchCardClick(card, q);
      });
    });
  }

  handleMatchCardClick(card, q) {
    if (card.classList.contains('is-matched')) return;

    const type = card.getAttribute('data-type');
    const pairId = card.getAttribute('data-pair-id');

    if (!this.selectedMatchTerm) {
      this.selectedMatchTerm = { card, type, pairId };
      card.classList.add('is-selected');
    } else {
      // Matching attempt
      if (this.selectedMatchTerm.card === card) {
        card.classList.remove('is-selected');
        this.selectedMatchTerm = null;
        return;
      }

      if (this.selectedMatchTerm.type !== type && this.selectedMatchTerm.pairId === pairId) {
        // Correct match!
        arenaSfx.playSuccess();
        this.selectedMatchTerm.card.classList.remove('is-selected');
        this.selectedMatchTerm.card.classList.add('is-matched');
        card.classList.add('is-matched');
        this.selectedMatchTerm = null;
        this.matchedPairsCount++;

        if (this.matchedPairsCount === q.pairs.length) {
          this.handleCorrectAnswer('All vocabulary pairs matched with academic precision!');
        }
      } else {
        // Wrong match
        arenaSfx.playError();
        this.selectedMatchTerm.card.classList.remove('is-selected');
        this.selectedMatchTerm = null;
      }
    }
  }

  /* Mechanic 3: Audio Intercept */
  renderAudioIntercept(q) {
    if (this.dom.lessonPromptTitle) this.dom.lessonPromptTitle.textContent = q.prompt;

    let html = `
      <div class="edu-audio-controls">
        <button type="button" class="edu-audio-btn" id="playAudioNormalBtn">
          <i class="fa-solid fa-volume-high"></i> Play Normal
        </button>
        <button type="button" class="edu-audio-btn btn-slow" id="playAudioSlowBtn">
          <i class="fa-solid fa-tortoise"></i> Slow (0.7x)
        </button>
      </div>
      <div class="edu-answer-tray" id="eduAnswerTray" aria-label="Dictation tray"></div>
      <div class="edu-chips-bank" id="eduChipsBank">
    `;

    const allWords = [...q.targetWords, ...q.distractorWords].sort(() => Math.random() - 0.5);
    allWords.forEach((w, idx) => {
      html += `<button type="button" class="edu-word-chip" data-word-idx="${idx}" data-word="${w}">${w}</button>`;
    });

    html += `</div>`;
    this.dom.lessonContentArea.innerHTML = html;

    // Bind audio TTS
    document.getElementById('playAudioNormalBtn')?.addEventListener('click', () => {
      arenaSfx.speakText(q.spokenText, 1.0);
    });
    document.getElementById('playAudioSlowBtn')?.addEventListener('click', () => {
      arenaSfx.speakText(q.spokenText, 0.7);
    });

    // Automatically speak on initial render
    setTimeout(() => arenaSfx.speakText(q.spokenText, 1.0), 300);

    const chips = this.dom.lessonContentArea.querySelectorAll('.edu-word-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        arenaSfx.playClick();
        const word = chip.getAttribute('data-word');
        chip.classList.add('is-used');
        this.addWordToTray(word, chip);
      });
    });
  }

  /* Mechanic 4: Campus Chat Simulator */
  renderChatSimulator(q) {
    if (this.dom.lessonPromptTitle) this.dom.lessonPromptTitle.textContent = 'Select the most natural & polite academic response:';

    let html = `
      <div class="edu-chat-stage">
        <div class="edu-chat-bubble">
          <div class="edu-chat-avatar"><i class="fa-solid fa-graduation-cap"></i></div>
          <div class="edu-chat-msg">
            <strong>${q.speaker}:</strong> ${q.message}
          </div>
        </div>
      </div>
      <div class="edu-dialogue-options" id="eduDialogueOptions">
    `;

    q.options.forEach((opt, idx) => {
      html += `<button type="button" class="edu-dialogue-opt cau-arena-option" data-opt-idx="${idx}">
        <span class="cau-arena-keybind">[${idx + 1}]</span>
        <span>${opt.text}</span>
      </button>`;
    });

    html += `</div>`;
    this.dom.lessonContentArea.innerHTML = html;

    const opts = this.dom.lessonContentArea.querySelectorAll('.edu-dialogue-opt');
    opts.forEach(btn => {
      btn.addEventListener('click', () => {
        arenaSfx.playClick();
        opts.forEach(b => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        this.selectedDialogueOpt = parseInt(btn.getAttribute('data-opt-idx'), 10);
        this.updateCheckBtnState();
      });
    });
  }

  updateCheckBtnState() {
    if (!this.dom.checkActionBtn) return;
    const q = this.lessonQueue[this.currentQIndex];

    if (q.mechanic === 'sentence_builder' || q.mechanic === 'audio_intercept') {
      this.dom.checkActionBtn.disabled = (this.stagedWords.length === 0);
    } else if (q.mechanic === 'chat_simulator') {
      this.dom.checkActionBtn.disabled = (this.selectedDialogueOpt === undefined);
    } else if (q.mechanic === 'match_madness') {
      this.dom.checkActionBtn.disabled = true;
    }
  }

  checkCurrentAnswer() {
    if (this.isOptionLocked) return;
    this.isOptionLocked = true;
    const elapsedMs = Date.now() - this.questionStartTime;
    const q = this.lessonQueue[this.currentQIndex];

    if (q.mechanic === 'sentence_builder' || q.mechanic === 'audio_intercept') {
      const userSentence = this.stagedWords.map(item => item.word).join(' ');
      const targetSentence = q.targetWords.join(' ');
      if (userSentence === targetSentence) {
        this.handleCorrectAnswer('Spot on! Accurate academic syntax.');
      } else {
        this.handleIncorrectAnswer(`Correct sentence: "${targetSentence}". ${q.tip || ''}`);
      }
    } else if (q.mechanic === 'chat_simulator') {
      const selected = q.options[this.selectedDialogueOpt];
      if (selected && selected.isCorrect) {
        this.handleCorrectAnswer('Excellent response! Perfect academic tone.');
      } else {
        const correctChoice = q.options.find(o => o.isCorrect);
        this.handleIncorrectAnswer(`Best response: "${correctChoice ? correctChoice.text : ''}". ${q.tip || ''}`);
      }
    }
  }

  handleCorrectAnswer(message) {
    this.isAnswerChecked = true;
    arenaSfx.playSuccess();
    this.lessonXpEarned += 10;

    if (this.dom.checkBar) {
      this.dom.checkBar.className = 'edu-bottom-check-bar is-correct';
    }
    if (this.dom.checkBarStatus) {
      this.dom.checkBarStatus.innerHTML = `
        <div class="edu-feedback-text text-correct"><i class="fa-solid fa-circle-check me-2"></i> Excellent!</div>
        <div class="edu-feedback-sub">${message}</div>
      `;
    }
    const combatFeedbackDrawer = document.getElementById('combatFeedbackDrawer') || this.dom.combatFeedbackDrawer;
    if (combatFeedbackDrawer) {
      combatFeedbackDrawer.innerHTML = `<div class="pedagogical-explanation">${message}</div>`;
    }
    if (this.dom.checkActionBtn) {
      this.dom.checkActionBtn.disabled = false;
      this.dom.checkActionBtn.innerHTML = 'Continue &rarr;';
    }
  }

  handleIncorrectAnswer(explanation) {
    this.isAnswerChecked = true;
    arenaSfx.playError();
    this.mistakesCount++;

    // Deduct Shield
    cauStore.deductShield();
    const shieldsInfo = cauStore.getShields();
    if (this.dom.lessonShieldCount) {
      this.dom.lessonShieldCount.textContent = `🛡️ ${shieldsInfo.current}`;
    }

    // Spaced Repetition Loop: Re-queue missed question at end of lesson
    const missedQ = this.lessonQueue[this.currentQIndex];
    this.lessonQueue.push(missedQ);

    if (this.dom.checkBar) {
      this.dom.checkBar.className = 'edu-bottom-check-bar is-wrong';
    }
    if (this.dom.checkBarStatus) {
      this.dom.checkBarStatus.innerHTML = `
        <div class="edu-feedback-text text-wrong"><i class="fa-solid fa-circle-xmark me-2"></i> Correct Solution:</div>
        <div class="edu-feedback-sub">${explanation}</div>
      `;
    }
    const combatFeedbackDrawer = document.getElementById('combatFeedbackDrawer') || this.dom.combatFeedbackDrawer;
    if (combatFeedbackDrawer) {
      combatFeedbackDrawer.innerHTML = `<div class="pedagogical-explanation">${explanation}</div>`;
    }
    if (this.dom.checkActionBtn) {
      this.dom.checkActionBtn.disabled = false;
      this.dom.checkActionBtn.innerHTML = 'Got it &rarr;';
    }
  }

  advanceLesson() {
    this.currentQIndex++;
    this.renderCurrentQuestion();
  }

  resetCheckBar() {
    if (this.dom.checkBar) {
      this.dom.checkBar.className = 'edu-bottom-check-bar';
    }
    if (this.dom.checkBarStatus) {
      this.dom.checkBarStatus.innerHTML = '';
    }
    if (this.dom.checkActionBtn) {
      this.dom.checkActionBtn.disabled = true;
      this.dom.checkActionBtn.innerHTML = 'Check Answer';
    }
  }

  completeLessonSuccess() {
    arenaSfx.playLevelUp();

    // Persist progress to store
    cauStore.completeNode(this.activeLesson.id, this.activeLesson.xpReward);

    if (this.dom.lessonStage) this.dom.lessonStage.style.display = 'none';
    if (this.dom.celebrationOverlay) this.dom.celebrationOverlay.style.display = 'flex';

    const earnedDisplay = document.getElementById('celebEarnedXp');
    if (earnedDisplay) {
      const isBooster = cauStore.isXpBoosterActive();
      earnedDisplay.textContent = isBooster ? `+${this.activeLesson.xpReward * 2} XP (2x Boost!)` : `+${this.activeLesson.xpReward} XP`;
    }

    const accuracyDisplay = document.getElementById('celebAccuracy');
    if (accuracyDisplay) {
      const acc = Math.max(70, Math.round(100 - (this.mistakesCount * 10)));
      accuracyDisplay.textContent = `${acc}%`;
    }
  }

  closeCelebration() {
    if (this.dom.celebrationOverlay) this.dom.celebrationOverlay.style.display = 'none';
    if (this.dom.skillTreeHub) this.dom.skillTreeHub.style.display = 'block';
    this.renderSkillTree();
    this.renderTopHud();
    this.renderBounties();
  }

  exitLessonToHub() {
    if (this.dom.lessonStage) this.dom.lessonStage.style.display = 'none';
    if (this.dom.skillTreeHub) this.dom.skillTreeHub.style.display = 'block';
    this.renderSkillTree();
  }

  /* ── 4. Sidebar: Leaderboard & Bounties ── */
  renderLeaderboard(tab = 'prep') {
    if (!this.dom.leaderboardList) return;

    if (this.dom.tabPrepLeague) {
      this.dom.tabPrepLeague.className = tab === 'prep' ? 'edu-league-tab is-active' : 'edu-league-tab';
    }
    if (this.dom.tabFacultyWars) {
      this.dom.tabFacultyWars.className = tab === 'faculty' ? 'edu-league-tab is-active' : 'edu-league-tab';
    }

    let html = '';
    if (tab === 'prep') {
      const userXp = this.state.englishArena.xp || 0;
      const userName = this.state.studentProfile.name || 'You (CAU Scholar)';

      // Combine seeded students with live user
      const list = [...PREP_LEAGUE_STUDENTS, { name: userName, faculty: 'Preparatory School', xp: userXp, isUser: true }];
      list.sort((a, b) => b.xp - a.xp);

      list.slice(0, 10).forEach((st, idx) => {
        const isPromotion = idx < 3;
        const rowClass = st.isUser ? 'edu-leader-row is-current-user' : (isPromotion ? 'edu-leader-row in-promotion' : 'edu-leader-row');
        const rankBadge = idx === 0 ? '🥇' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : `#${idx + 1}`));

        html += `
          <div class="${rowClass}">
            <div class="d-flex align-items-center gap-2">
              <span style="min-width: 24px; font-weight: 700;">${rankBadge}</span>
              <div>
                <div>${st.name}</div>
                <div style="font-size: 11px; color: var(--sys-text-muted);">${st.faculty}</div>
              </div>
            </div>
            <div class="text-end fw-bold" style="color: var(--cau-navy, #002469);">${st.xp} XP</div>
          </div>
        `;
      });
    } else {
      FACULTY_WARS_DATA.forEach((fw, idx) => {
        html += `
          <div class="edu-leader-row ${idx === 0 ? 'in-promotion' : ''}">
            <div class="d-flex align-items-center gap-2">
              <span style="min-width: 24px; font-weight: 700;">#${idx + 1}</span>
              <div>
                <div>${fw.faculty}</div>
                <div style="font-size: 11px; color: var(--sys-text-muted);">${fw.activeStudents} Active Scholars • ${fw.leadBadge}</div>
              </div>
            </div>
            <div class="text-end fw-bold" style="color: var(--cau-navy, #002469);">${fw.totalXp} XP</div>
          </div>
        `;
      });
    }

    this.dom.leaderboardList.innerHTML = html;
  }

  renderBounties() {
    const s = this.state.englishArena;
    const b = s.bounties || { xpEarnedToday: 0, xpTargetToday: 50, listeningDone: false, shieldsPreserved: false };

    if (this.dom.bountyXpFill) {
      const pct = Math.min(100, Math.round((b.xpEarnedToday / b.xpTargetToday) * 100));
      this.dom.bountyXpFill.style.width = `${pct}%`;
    }
    if (this.dom.bountyXpText) {
      this.dom.bountyXpText.textContent = `${b.xpEarnedToday}/${b.xpTargetToday} XP`;
    }
    if (this.dom.bountyListeningStatus) {
      this.dom.bountyListeningStatus.innerHTML = b.listeningDone ? '<span class="text-success fw-bold">✓ Complete</span>' : '<span class="text-muted">In Progress</span>';
    }
    if (this.dom.bountyShieldsStatus) {
      this.dom.bountyShieldsStatus.innerHTML = b.shieldsPreserved ? '<span class="text-success fw-bold">✓ Complete</span>' : '<span class="text-muted">Active (3+ Shields)</span>';
    }
  }

  /* ── 5. Code Redemption Modal ── */
  openRedeemModal() {
    arenaSfx.playClick();
    if (this.dom.codeModal) {
      this.dom.codeModal.style.display = 'flex';
      if (this.dom.codeModalInput) {
        this.dom.codeModalInput.value = '';
        this.dom.codeModalInput.focus();
      }
      if (this.dom.codeModalError) this.dom.codeModalError.style.display = 'none';
      if (this.dom.codeModalSuccess) this.dom.codeModalSuccess.style.display = 'none';
    }
  }

  closeRedeemModal() {
    if (this.dom.codeModal) this.dom.codeModal.style.display = 'none';
  }

  async handleRedeemCode() {
    const input = this.dom.codeModalInput ? this.dom.codeModalInput.value.trim().toUpperCase() : '';
    if (!input) return;

    const isValid = await verifyArenaCode(input);
    if (isValid) {
      arenaSfx.playLevelUp();
      cauStore.activateXpBooster(24);
      cauStore.refillShields();

      if (this.dom.codeModalError) this.dom.codeModalError.style.display = 'none';
      if (this.dom.codeModalSuccess) {
        this.dom.codeModalSuccess.style.display = 'block';
        this.dom.codeModalSuccess.innerHTML = `
          <strong>🎉 Voucher Verified!</strong><br/>
          24-Hour 2x XP Club Night Booster activated! Shields refilled to max (${cauStore.getShields().max} Shields).
        `;
      }
      this.renderTopHud();
      setTimeout(() => this.closeRedeemModal(), 2200);
    } else {
      arenaSfx.playError();
      if (this.dom.codeModalError) {
        this.dom.codeModalError.style.display = 'block';
        this.dom.codeModalError.textContent = 'Invalid or expired English Club voucher code. Please verify your code.';
      }
    }
  }
}

// Auto-initialize when DOM ready
if (typeof window !== 'undefined') {
  const bootQuest = () => {
    if (!window.cauEdutainment) {
      window.cauEdutainment = new CauEdutainmentApp();
    }
  };
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', bootQuest);
  } else {
    bootQuest();
  }
}
