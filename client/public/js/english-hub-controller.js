/**
 * ==============================================================================
 * CYPRUS AYDIN UNIVERSITY (CAU) — ENGLISH HUB CONTROLLER
 * Minimalist, Decluttered 4-Pillar Prep School Portal Architecture
 * ==============================================================================
 */

import { englishHubStore, PREP_TEACHERS, PREP_SPORTS_TEAMS } from './english-hub-store.js';
import { cauStore } from './cau-store.js';
import { arenaSfx } from './arena-sfx.js';
import { verifyArenaCode } from './arena-hashes.js';

export class EnglishHubController {
  constructor() {
    this.currentTab = 'teachers';
    this.activeQuiz = null;
    this.activeQuizQIndex = 0;
    this.activeQuizAnswers = [];
    this.activeQuizScore = 0;
    this.isOptionLocked = false;
    this.questionStartTime = Date.now();

    this.cacheDom();
    this.bindEvents();
    this.renderAll();

    // Subscribe to state updates
    englishHubStore.subscribe(() => {
      this.renderAll();
    });
  }

  cacheDom() {
    this.dom = {
      // Status Strip
      statusAuthWrap: document.getElementById('hubStatusAuthWrap'),
      statusStudentWrap: document.getElementById('hubStatusStudentWrap'),
      statusStudentName: document.getElementById('hubStatusStudentName'),
      statusStudentId: document.getElementById('hubStatusStudentId'),
      statusStudentLevel: document.getElementById('hubStatusStudentLevel'),
      btnOpenAuthModal: document.getElementById('hubOpenAuthModalBtn'),
      btnOpenTeacherMode: document.getElementById('hubOpenTeacherModeBtn'),
      btnSignOut: document.getElementById('hubSignOutBtn'),

      // Hero Placement Card
      heroPlacementScore: document.getElementById('heroPlacementScore'),
      heroPlacementBadge: document.getElementById('heroPlacementBadge'),
      heroPlacementDesc: document.getElementById('heroPlacementDesc'),
      heroPlacementAction: document.getElementById('heroPlacementAction'),

      // Tab Buttons
      tabBtns: document.querySelectorAll('.hub-tab-btn'),
      tabViews: document.querySelectorAll('.hub-tab-view'),

      // Tab Containers
      teachersGrid: document.getElementById('hubTeachersGrid'),
      teamsGrid: document.getElementById('hubTeamsGrid'),
      quizzesGrid: document.getElementById('hubQuizzesGrid'),
      gradebookContent: document.getElementById('hubGradebookContent'),

      // Modals
      authModal: document.getElementById('hubAuthModal'),
      authForm: document.getElementById('hubAuthForm'),
      teacherModal: document.getElementById('hubTeacherModal'),
      teacherPinInput: document.getElementById('hubTeacherPinInput'),
      teacherCreateForm: document.getElementById('hubTeacherCreateForm'),
      teacherPinSection: document.getElementById('hubTeacherPinSection'),
      teacherBuildSection: document.getElementById('hubTeacherBuildSection'),

      // Quiz Stage Modal
      quizModal: document.getElementById('hubQuizModal'),
      quizTitle: document.getElementById('hubQuizModalTitle'),
      quizProgress: document.getElementById('hubQuizProgressText'),
      quizProgressBar: document.getElementById('hubQuizProgressBar'),
      quizQuestionText: document.getElementById('hubQuizQuestionText'),
      quizOptionsGrid: document.getElementById('hubQuizOptionsGrid'),
      quizFeedbackDrawer: document.getElementById('combatFeedbackDrawer'),
      quizResultsView: document.getElementById('hubQuizResultsView'),
      quizStageView: document.getElementById('hubQuizStageView')
    };
  }

  bindEvents() {
    // 1. Tab Switching
    if (this.dom.tabBtns) {
      this.dom.tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const targetTab = btn.getAttribute('data-tab');
          this.switchTab(targetTab);
        });
      });
    }

    // 2. Auth Modal Triggers
    if (this.dom.btnOpenAuthModal) {
      this.dom.btnOpenAuthModal.addEventListener('click', () => this.openAuthModal());
    }
    if (this.dom.btnSignOut) {
      this.dom.btnSignOut.addEventListener('click', () => {
        englishHubStore.signOutStudent();
        arenaSfx.playClick();
      });
    }
    if (this.dom.authForm) {
      this.dom.authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fullName = document.getElementById('authInputName').value.trim();
        const studentId = document.getElementById('authInputId').value.trim();
        const prepGroup = document.getElementById('authInputGroup').value;
        const assignedTeacherId = document.getElementById('authInputTeacher').value;

        if (fullName && studentId) {
          englishHubStore.signInStudent({ fullName, studentId, prepGroup, assignedTeacherId });
          arenaSfx.playLevelUp();
          this.closeAuthModal();
        }
      });
    }

    // 3. Teacher Mode Modal
    if (this.dom.btnOpenTeacherMode) {
      this.dom.btnOpenTeacherMode.addEventListener('click', () => this.openTeacherModal());
    }

    const unlockTeacherBtn = document.getElementById('hubUnlockTeacherBtn');
    if (unlockTeacherBtn) {
      unlockTeacherBtn.addEventListener('click', () => this.handleUnlockTeacher());
    }

    if (this.dom.teacherCreateForm) {
      this.dom.teacherCreateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handlePublishTeacherQuiz();
      });
    }
  }

  switchTab(tabId) {
    this.currentTab = tabId;
    arenaSfx.playClick();

    if (this.dom.tabBtns) {
      this.dom.tabBtns.forEach(btn => {
        btn.classList.toggle('is-active', btn.getAttribute('data-tab') === tabId);
      });
    }

    if (this.dom.tabViews) {
      this.dom.tabViews.forEach(view => {
        view.classList.toggle('is-active', view.id === `tabView-${tabId}`);
      });
    }
  }

  renderAll() {
    this.renderTopStatus();
    this.renderHeroPlacement();
    this.renderTeachers();
    this.renderTeams();
    this.renderQuizzes();
    this.renderGradebook();
  }

  // ── Top Status Strip ──
  renderTopStatus() {
    const state = englishHubStore.get();
    const auth = state.studentAuth;

    if (auth.isLoggedIn) {
      if (this.dom.statusAuthWrap) this.dom.statusAuthWrap.style.display = 'none';
      if (this.dom.statusStudentWrap) this.dom.statusStudentWrap.style.display = 'flex';
      if (this.dom.statusStudentName) this.dom.statusStudentName.textContent = auth.fullName;
      if (this.dom.statusStudentId) this.dom.statusStudentId.textContent = auth.studentId;
      
      const level = (auth.placementTestResult && auth.placementTestResult.cefrLevel) || 'B1';
      if (this.dom.statusStudentLevel) this.dom.statusStudentLevel.textContent = `CEFR ${level}`;
    } else {
      if (this.dom.statusAuthWrap) this.dom.statusAuthWrap.style.display = 'flex';
      if (this.dom.statusStudentWrap) this.dom.statusStudentWrap.style.display = 'none';
    }
  }

  // ── Hero Placement Test Spotlight ──
  renderHeroPlacement() {
    const state = englishHubStore.get();
    const p = state.studentAuth.placementTestResult;

    if (p && p.cefrLevel) {
      if (this.dom.heroPlacementBadge) {
        this.dom.heroPlacementBadge.className = 'hub-placement-card__badge text-success';
        this.dom.heroPlacementBadge.innerHTML = `<i class="fa-solid fa-circle-check me-1"></i> Official CEFR ${p.cefrLevel}`;
      }
      if (this.dom.heroPlacementDesc) {
        this.dom.heroPlacementDesc.innerHTML = `Assessment verified on <strong>${p.date || '2026-10-12'}</strong> with score <strong>${p.totalScore || 75}/100</strong>. Your academic placement is verified for Preparatory coursework.`;
      }
      if (this.dom.heroPlacementAction) {
        this.dom.heroPlacementAction.innerHTML = `
          <div class="d-flex gap-2">
            <a href="/placement-test.html" class="btn btn-outline-dark btn-sm fw-bold">
              <i class="fa-solid fa-certificate me-1"></i> View Diagnostic Certificate
            </a>
            <a href="/placement-test.html" class="btn btn-coral btn-sm fw-bold cau-btn cau-btn-primary">
              Retake Level Test <i class="system-arrow ms-1"></i>
            </a>
          </div>
        `;
      }
    } else {
      if (this.dom.heroPlacementBadge) {
        this.dom.heroPlacementBadge.className = 'hub-placement-card__badge';
        this.dom.heroPlacementBadge.innerHTML = `<i class="fa-solid fa-clock me-1"></i> Required Diagnostic`;
      }
      if (this.dom.heroPlacementDesc) {
        this.dom.heroPlacementDesc.textContent = 'Take our official 20-question online diagnostic to determine your CEFR level (A1–C1), assign your preparatory study group, and receive customized academic recommendations.';
      }
      if (this.dom.heroPlacementAction) {
        this.dom.heroPlacementAction.innerHTML = `
          <a href="/placement-test.html" class="btn btn-coral w-100 fw-bold py-2 cau-btn cau-btn-primary d-flex align-items-center justify-content-center gap-2">
            <span>Start Official Placement Test (25 Min)</span>
            <i class="system-arrow ms-1"></i>
          </a>
        `;
      }
    }
  }

  // ── Tab 1: Our Teachers ──
  renderTeachers() {
    if (!this.dom.teachersGrid) return;
    const state = englishHubStore.get();

    let html = '';
    state.teachers.forEach(t => {
      html += `
        <article class="hub-teacher-card cau-card">
          <div>
            <div class="hub-teacher-header">
              <img src="${t.image}" alt="${t.name}" class="hub-teacher-avatar" loading="lazy" decoding="async" width="72" height="72" />
              <div>
                <h3 class="hub-teacher-name">${t.name}</h3>
                <span class="hub-teacher-role">${t.title}</span>
              </div>
            </div>
            <div class="hub-teacher-meta">
              <span><i class="fa-solid fa-building me-2 text-muted"></i><strong>Office:</strong> ${t.office}</span>
              <span><i class="fa-regular fa-clock me-2 text-muted"></i><strong>Hours:</strong> ${t.officeHours}</span>
              <span><i class="fa-regular fa-envelope me-2 text-muted"></i><a href="mailto:${t.email}" class="text-muted text-decoration-none">${t.email}</a></span>
            </div>
            <div class="hub-teacher-quiz-strip">
              <span class="badge bg-white text-dark border mb-1" style="font-size: 10.5px; font-weight: 700;">WEEKLY CHALLENGE</span>
              <div class="hub-teacher-quiz-title">${t.activeQuizTitle}</div>
            </div>
          </div>
          <div>
            <button type="button" class="btn btn-outline-dark btn-sm w-100 fw-bold js-launch-teacher-quiz" data-quiz-id="${t.activeQuizId}">
              Play ${t.name.split(' ')[0]}'s Weekly Quiz &rarr;
            </button>
          </div>
        </article>
      `;
    });

    this.dom.teachersGrid.innerHTML = html;

    // Attach click events to "Play [Teacher]'s Quiz"
    const launchBtns = this.dom.teachersGrid.querySelectorAll('.js-launch-teacher-quiz');
    launchBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const qId = btn.getAttribute('data-quiz-id');
        this.switchTab('quizzes');
        this.startQuizById(qId);
      });
    });
  }

  // ── Tab 2: Club Sports & Teams ──
  renderTeams() {
    if (!this.dom.teamsGrid) return;
    const state = englishHubStore.get();
    const joined = state.studentAuth.joinedTeams || [];

    let html = '';
    state.sportsTeams.forEach(team => {
      const isJoined = joined.includes(team.id);
      html += `
        <article class="hub-team-card cau-card">
          <div>
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="hub-team-badge" style="background: rgba(0, 36, 105, 0.08); color: ${team.accentColor};">
                <i class="fa-solid ${team.icon} me-1"></i> ${team.badge}
              </span>
              <span class="small text-muted fw-bold">
                <i class="fa-solid fa-users me-1"></i>${team.currentMembers} / ${team.maxMembers}
              </span>
            </div>
            <h3 class="hub-team-title">${team.name}</h3>
            <p class="hub-team-desc">${team.description}</p>
            <div class="hub-team-meta">
              <div class="mb-1"><strong>Schedule:</strong> ${team.schedule}</div>
              <div><strong>Lead / Captain:</strong> ${team.captain}</div>
            </div>
          </div>
          <div>
            <button type="button" class="btn w-100 fw-bold btn-sm js-toggle-team ${isJoined ? 'btn-success' : 'btn-outline-dark'}" data-team-id="${team.id}">
              ${isJoined ? '<i class="fa-solid fa-circle-check me-1"></i> On the Team Roster' : '<i class="fa-solid fa-plus me-1"></i> Join Team Roster'}
            </button>
          </div>
        </article>
      `;
    });

    this.dom.teamsGrid.innerHTML = html;

    // Attach join/leave toggle
    const toggleBtns = this.dom.teamsGrid.querySelectorAll('.js-toggle-team');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const teamId = btn.getAttribute('data-team-id');
        const nowJoined = englishHubStore.toggleTeamRoster(teamId);
        arenaSfx.playClick();
        if (nowJoined) arenaSfx.playSuccess();
      });
    });
  }

  // ── Tab 3: Weekly Teacher Quizzes ──
  renderQuizzes() {
    if (!this.dom.quizzesGrid) return;
    const state = englishHubStore.get();

    let html = '';
    state.weeklyQuizzes.forEach(quiz => {
      const grade = (state.studentAuth.weeklyGrades || []).find(g => g.quizId === quiz.id);

      html += `
        <article class="hub-quiz-card cau-card">
          <div>
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="badge bg-light text-dark border fw-bold" style="font-size: 11px;">
                WEEK ${quiz.week || 4}
              </span>
              ${grade ? `
                <span class="badge ${grade.percentage >= 80 ? 'badge-distinction' : 'badge-passed'}">
                  Score: ${grade.percentage}%
                </span>
              ` : `
                <span class="badge bg-warning text-dark fw-bold" style="font-size: 11px;">
                  3 Mins • 5 Qs
                </span>
              `}
            </div>
            <h3 style="font-family: var(--font-family-display, sans-serif); font-size: 17.5px; font-weight: 700; color: var(--hub-navy); margin-bottom: 6px;">
              ${quiz.title}
            </h3>
            <p class="text-muted small mb-3">Instructor: <strong>${quiz.teacherName}</strong></p>
          </div>
          <div>
            <button type="button" class="btn btn-coral w-100 fw-bold btn-sm cau-btn cau-btn-primary js-start-quiz-btn" data-quiz-id="${quiz.id}">
              ${grade ? 'Retake Quiz →' : 'Start Quiz (3 Mins) →'}
            </button>
          </div>
        </article>
      `;
    });

    this.dom.quizzesGrid.innerHTML = html;

    const startBtns = this.dom.quizzesGrid.querySelectorAll('.js-start-quiz-btn');
    startBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const qId = btn.getAttribute('data-quiz-id');
        this.startQuizById(qId);
      });
    });
  }

  // ── Tab 4: Gradebook & Records ──
  renderGradebook() {
    if (!this.dom.gradebookContent) return;
    const state = englishHubStore.get();
    const auth = state.studentAuth;

    if (!auth.isLoggedIn) {
      this.dom.gradebookContent.innerHTML = `
        <div class="cau-card p-4 text-center max-w-md mx-auto" style="max-width: 480px; margin: 40px auto; background: var(--hub-surface); border: 1px solid var(--hub-line); border-radius: 16px;">
          <div class="mb-3">
            <i class="fa-solid fa-id-card-clip text-muted" style="font-size: 40px;"></i>
          </div>
          <h3 class="fw-bold mb-2" style="font-family: var(--font-family-display, sans-serif); color: var(--hub-navy); font-size: 21px;">
            Student Sign In &amp; Registration
          </h3>
          <p class="text-muted small mb-4">
            Sign in with your Cyprus Aydın University Student ID to view your weekly quiz gradebook, placement certificate, and club sports rosters.
          </p>
          <button type="button" class="btn btn-coral fw-bold px-4 py-2 cau-btn cau-btn-primary" onclick="document.getElementById('hubOpenAuthModalBtn').click();">
            Sign In / Register Now &rarr;
          </button>
        </div>
      `;
      return;
    }

    const p = auth.placementTestResult;
    const grades = auth.weeklyGrades || [];
    const joinedTeams = state.sportsTeams.filter(t => (auth.joinedTeams || []).includes(t.id));

    let html = `
      <div class="row g-4 mb-4">
        <!-- Card 1: Official Placement Level -->
        <div class="col-lg-4 col-md-6">
          <div class="cau-card p-4 h-100" style="background: var(--hub-surface); border: 1px solid var(--hub-line); border-radius: 14px;">
            <span class="text-muted small fw-bold text-uppercase d-block mb-1">Official Academic Placement</span>
            <h4 class="fw-bold mb-2" style="color: var(--hub-navy); font-size: 24px;">
              CEFR ${p ? p.cefrLevel : 'B1'}
            </h4>
            <p class="text-muted small mb-3">
              ${p ? `Diagnostic completed on ${p.date} • Score: ${p.totalScore}/100` : 'Assigned based on preparatory intake.'}
            </p>
            <a href="/placement-test.html" class="btn btn-outline-dark btn-sm fw-bold">
              View Level Details &rarr;
            </a>
          </div>
        </div>

        <!-- Card 2: Student Group & Teacher -->
        <div class="col-lg-4 col-md-6">
          <div class="cau-card p-4 h-100" style="background: var(--hub-surface); border: 1px solid var(--hub-line); border-radius: 14px;">
            <span class="text-muted small fw-bold text-uppercase d-block mb-1">Assigned Prep Group</span>
            <h4 class="fw-bold mb-2" style="color: var(--hub-navy); font-size: 24px;">
              ${auth.prepGroup}
            </h4>
            <p class="text-muted small mb-3">
              Advisor: <strong>${(state.teachers.find(t => t.id === auth.assignedTeacherId) || state.teachers[0]).name}</strong>
            </p>
            <span class="badge bg-light text-dark border">Academic Year 2026/27</span>
          </div>
        </div>

        <!-- Card 3: Sports Teams Summary -->
        <div class="col-lg-4 col-md-12">
          <div class="cau-card p-4 h-100" style="background: var(--hub-surface); border: 1px solid var(--hub-line); border-radius: 14px;">
            <span class="text-muted small fw-bold text-uppercase d-block mb-1">My Sports &amp; Activities</span>
            <h4 class="fw-bold mb-2" style="color: var(--hub-navy); font-size: 24px;">
              ${joinedTeams.length} Active Teams
            </h4>
            <p class="text-muted small mb-3">
              ${joinedTeams.map(t => t.name).join(', ') || 'No sports teams joined yet.'}
            </p>
            <button type="button" class="btn btn-outline-primary btn-sm fw-bold" onclick="window.cauEnglishHub.switchTab('sports');">
              Manage Teams &rarr;
            </button>
          </div>
        </div>
      </div>

      <!-- Weekly Quiz Gradebook Table -->
      <div class="mt-4">
        <h4 class="fw-bold mb-3" style="font-family: var(--font-family-display, sans-serif); color: var(--hub-navy); font-size: 19px;">
          Weekly Teacher Quiz Records
        </h4>
        <div class="table-responsive">
          <table class="hub-gradebook-table">
            <thead>
              <tr>
                <th>Week</th>
                <th>Quiz Title</th>
                <th>Instructor</th>
                <th>Date Submitted</th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${grades.length ? grades.map(g => `
                <tr>
                  <td><strong>Week ${g.week || 4}</strong></td>
                  <td>${g.quizTitle}</td>
                  <td>${g.teacherName}</td>
                  <td>${g.completedAt}</td>
                  <td><strong>${g.score} / ${g.maxScore} (${g.percentage}%)</strong></td>
                  <td>
                    <span class="${g.percentage >= 80 ? 'badge-distinction' : 'badge-passed'}">
                      ${g.status}
                    </span>
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="6" class="text-center text-muted py-4">
                    No weekly quizzes completed yet. Switch to Tab 3 to take your first teacher challenge!
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.dom.gradebookContent.innerHTML = html;
  }

  // ── Quiz Stage Execution ──
  startQuizById(quizId) {
    const state = englishHubStore.get();
    const quiz = state.weeklyQuizzes.find(q => q.id === quizId);
    if (!quiz) return;

    this.activeQuiz = quiz;
    this.activeQuizQIndex = 0;
    this.activeQuizAnswers = [];
    this.activeQuizScore = 0;
    this.isOptionLocked = false;
    this.questionStartTime = Date.now();

    if (this.dom.quizTitle) this.dom.quizTitle.textContent = quiz.title;
    if (this.dom.quizResultsView) this.dom.quizResultsView.style.display = 'none';
    if (this.dom.quizStageView) this.dom.quizStageView.style.display = 'block';

    this.openQuizModal();
    this.renderQuizQuestion();
  }

  animateProgressBar(targetPct) {
    if (!this.dom.quizProgressBar) return;
    const startPct = parseFloat(this.dom.quizProgressBar.style.width || '0');
    const startTime = Date.now();
    const duration = 200;
    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      const current = startPct + (targetPct - startPct) * progress;
      if (this.dom.quizProgressBar) this.dom.quizProgressBar.style.width = `${current}%`;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  renderQuizQuestion() {
    const q = this.activeQuiz.questions[this.activeQuizQIndex];
    this.isOptionLocked = false;
    this.questionStartTime = Date.now();

    const currentNum = this.activeQuizQIndex + 1;
    const totalNum = this.activeQuiz.questions.length;
    const pct = ((currentNum - 1) / totalNum) * 100;
    this.animateProgressBar(pct);

    if (this.dom.quizProgress) {
      this.dom.quizProgress.textContent = `Question ${currentNum} of ${totalNum}`;
    }
    if (this.dom.quizQuestionText) {
      this.dom.quizQuestionText.textContent = q.q;
    }

    if (this.dom.quizOptionsGrid) {
      let html = '';
      q.options.forEach((opt, idx) => {
        html += `
          <button type="button" class="cau-option-btn cau-arena-option mb-2" data-opt-idx="${idx}">
            <span class="cau-arena-keybind me-2">[${idx + 1}]</span>
            <span>${opt}</span>
          </button>
        `;
      });
      this.dom.quizOptionsGrid.innerHTML = html;

      const optBtns = this.dom.quizOptionsGrid.querySelectorAll('.cau-option-btn');
      optBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          if (this.isOptionLocked) return;
          this.isOptionLocked = true;
          const selectedIdx = parseInt(btn.getAttribute('data-opt-idx'), 10);
          this.handleQuizAnswer(selectedIdx, btn);
        });
      });
    }

    if (this.dom.quizFeedbackDrawer) {
      this.dom.quizFeedbackDrawer.style.display = 'none';
      this.dom.quizFeedbackDrawer.innerHTML = '';
    }
  }

  handleQuizAnswer(selectedIdx, btnElement) {
    const q = this.activeQuiz.questions[this.activeQuizQIndex];
    const isCorrect = (selectedIdx === q.answer);

    if (isCorrect) {
      arenaSfx.playSuccess();
      btnElement.classList.add('is-correct');
      btnElement.style.borderColor = '#10b981';
      btnElement.style.background = 'rgba(16, 185, 129, 0.12)';
      this.activeQuizScore++;
    } else {
      arenaSfx.playError();
      btnElement.classList.add('is-wrong');
      btnElement.style.borderColor = '#e63b2e';
      btnElement.style.background = 'rgba(230, 59, 46, 0.12)';
    }

    if (this.dom.quizFeedbackDrawer) {
      this.dom.quizFeedbackDrawer.style.display = 'block';
      this.dom.quizFeedbackDrawer.innerHTML = `
        <div class="alert ${isCorrect ? 'alert-success' : 'alert-danger'} py-2 px-3 small mt-2 mb-0">
          <strong>${isCorrect ? 'Correct!' : 'Incorrect.'}</strong> ${q.tip}
        </div>
      `;
    }

    setTimeout(() => {
      this.activeQuizQIndex++;
      if (this.activeQuizQIndex < this.activeQuiz.questions.length) {
        this.renderQuizQuestion();
      } else {
        this.finishQuiz();
      }
    }, 1200);
  }

  finishQuiz() {
    arenaSfx.playLevelUp();
    this.animateProgressBar(100);

    const total = this.activeQuiz.questions.length;
    const score = this.activeQuizScore;
    const pct = Math.round((score / total) * 100);

    // Save record to store
    englishHubStore.recordQuizGrade({
      quizId: this.activeQuiz.id,
      quizTitle: this.activeQuiz.title,
      teacherName: this.activeQuiz.teacherName,
      week: this.activeQuiz.week,
      score,
      maxScore: total
    });

    if (this.dom.quizStageView) this.dom.quizStageView.style.display = 'none';
    if (this.dom.quizResultsView) {
      this.dom.quizResultsView.style.display = 'block';
      this.dom.quizResultsView.innerHTML = `
        <div class="text-center py-4">
          <div style="font-size: 48px; margin-bottom: 8px;">🎉</div>
          <h3 class="fw-bold mb-1" style="color: var(--hub-navy); font-size: 22px;">
            Quiz Completed!
          </h3>
          <p class="text-muted small mb-4">${this.activeQuiz.title}</p>
          <div class="d-inline-flex align-items-center gap-3 px-4 py-3 rounded-4 mb-4" style="background: rgba(0, 36, 105, 0.05); border: 1.5px solid var(--hub-line);">
            <div>
              <div class="small text-muted text-uppercase fw-bold">Score</div>
              <div style="font-size: 28px; font-weight: 800; color: var(--hub-navy);">${score} / ${total}</div>
            </div>
            <div class="vr" style="height: 36px;"></div>
            <div>
              <div class="small text-muted text-uppercase fw-bold">Grade</div>
              <div style="font-size: 28px; font-weight: 800; color: ${pct >= 80 ? '#059669' : '#002469'};">${pct}%</div>
            </div>
          </div>
          <div class="d-flex justify-content-center gap-2">
            <button type="button" class="btn btn-outline-dark fw-bold btn-sm" onclick="window.cauEnglishHub.closeQuizModal();">
              Close
            </button>
            <button type="button" class="btn btn-coral fw-bold btn-sm cau-btn cau-btn-primary" onclick="window.cauEnglishHub.closeQuizModal(); window.cauEnglishHub.switchTab('grades');">
              View in Gradebook &rarr;
            </button>
          </div>
        </div>
      `;
    }
  }

  // ── Modal Handlers ──
  openAuthModal() {
    if (this.dom.authModal) this.dom.authModal.style.display = 'flex';
  }
  closeAuthModal() {
    if (this.dom.authModal) this.dom.authModal.style.display = 'none';
  }

  openTeacherModal() {
    if (this.dom.teacherModal) {
      this.dom.teacherModal.style.display = 'flex';
      if (this.dom.teacherPinSection) this.dom.teacherPinSection.style.display = 'block';
      if (this.dom.teacherBuildSection) this.dom.teacherBuildSection.style.display = 'none';
      if (this.dom.teacherPinInput) {
        this.dom.teacherPinInput.value = '';
        this.dom.teacherPinInput.focus();
      }
    }
  }
  closeTeacherModal() {
    if (this.dom.teacherModal) this.dom.teacherModal.style.display = 'none';
  }

  handleUnlockTeacher() {
    const pin = this.dom.teacherPinInput ? this.dom.teacherPinInput.value.trim().toUpperCase() : '';
    // Accept either instructor PIN or standard code
    if (pin === 'CAU-TEACH-2026' || pin === 'CAU-ARENA-2026') {
      arenaSfx.playSuccess();
      if (this.dom.teacherPinSection) this.dom.teacherPinSection.style.display = 'none';
      if (this.dom.teacherBuildSection) this.dom.teacherBuildSection.style.display = 'block';
    } else {
      arenaSfx.playError();
      alert('Invalid Instructor PIN. Demo PIN is CAU-TEACH-2026');
    }
  }

  handlePublishTeacherQuiz() {
    const teacherId = document.getElementById('teachQuizTeacher').value;
    const quizTitle = document.getElementById('teachQuizTitle').value.trim();
    const week = document.getElementById('teachQuizWeek').value;
    const q1Text = document.getElementById('teachQ1Text').value.trim();
    const q1A = document.getElementById('teachQ1A').value.trim();
    const q1B = document.getElementById('teachQ1B').value.trim();
    const q1C = document.getElementById('teachQ1C').value.trim();
    const q1D = document.getElementById('teachQ1D').value.trim();
    const q1Correct = parseInt(document.getElementById('teachQ1Correct').value, 10);
    const q1Tip = document.getElementById('teachQ1Tip').value.trim();

    if (!quizTitle || !q1Text) {
      alert('Please fill out the quiz title and at least question 1.');
      return;
    }

    const questions = [
      {
        q: q1Text,
        options: [q1A || 'Option A', q1B || 'Option B', q1C || 'Option C', q1D || 'Option D'],
        answer: q1Correct,
        tip: q1Tip || 'Academic phrasing and syntax correctness.'
      },
      {
        q: 'Which transition word best signals cause and effect in academic writing?',
        options: ['Consequently', 'Nevertheless', 'Notwithstanding', 'Alternatively'],
        answer: 0,
        tip: '“Consequently” introduces a direct logical effect or outcome.'
      },
      {
        q: 'What is the most formal way to introduce a research citation?',
        options: ['As demonstrated by recent findings...', 'Like this guy said...', 'Look at this book...', 'Everyone knows that...'],
        answer: 0,
        tip: 'Formal scholarly framing uses passive or reporting constructions.'
      }
    ];

    englishHubStore.createWeeklyQuiz({
      teacherId,
      quizTitle,
      week,
      questions
    });

    arenaSfx.playLevelUp();
    alert('🎉 Weekly Quiz published successfully to students!');
    this.closeTeacherModal();
    this.switchTab('quizzes');
  }

  openQuizModal() {
    if (this.dom.quizModal) this.dom.quizModal.style.display = 'flex';
  }
  closeQuizModal() {
    if (this.dom.quizModal) this.dom.quizModal.style.display = 'none';
  }
}

// Auto-initialize when ready
if (typeof window !== 'undefined') {
  const bootHub = () => {
    if (!window.cauEnglishHub) {
      window.cauEnglishHub = new EnglishHubController();
    }
  };
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', bootHub);
  } else {
    bootHub();
  }
}
