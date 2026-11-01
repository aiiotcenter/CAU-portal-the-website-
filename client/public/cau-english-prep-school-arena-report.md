# Cyprus Aydın University — English Preparatory School (Hazırlık) Club & Arena Hub
# Comprehensive Master Engineering, Architecture, Features & Codebase Report

**Document Title:** CAU English Preparatory School (Hazırlık) Digital Hub — Complete Technical & Pedagogical Architecture  
**Target URL Routes:** `/english-quest.html` and `/english.html`  
**Host Application:** Cyprus Aydın University Official Web Portal  
**Primary Engine:** Vanilla JavaScript (ES6+), Modern Vanilla CSS, HTML5, Web Audio API, Canvas 2D, LocalStorage Persistence  
**Design System:** CAU Swiss-Editorial System (Space Grotesk display, Inter / NB International body, `--sys-accent` coral `#e63b2e`, dark-mode parity via `[data-theme="dark"]`)  

---

## Table of Contents
1. [Executive Summary & Pedagogical Purpose](#1-executive-summary--pedagogical-purpose)
2. [Preparatory School Architecture & Elimination of Degree Faculties](#2-preparatory-school-architecture--elimination-of-degree-faculties)
3. [Complete System Feature Catalog](#3-complete-system-feature-catalog)
4. [Exhaustive Section-by-Section DOM & UI Breakdown](#4-exhaustive-section-by-section-dom--ui-breakdown)
5. [Teacher ↔ Student Interactive Ecosystem](#5-teacher--student-interactive-ecosystem)
6. [Technical Challenges Overcome (Engineering Post-Mortem)](#6-technical-challenges-overcome-engineering-post-mortem)
7. [Core Code Implementations & Data Architectures](#7-core-code-implementations--data-architectures)
8. [Design System & CSS Styling Specifications](#8-design-system--css-styling-specifications)
9. [Verification, Quality Assurance & Deployment Status](#9-verification-quality-assurance--deployment-status)

---

## 1. Executive Summary & Pedagogical Purpose

The **CAU English Club & Academic Arena** is a specialized web application engineered for students enrolled in the **Cyprus Aydın University English Preparatory School (İngilizce Hazırlık Okulu)** located in Kyrenia, TRNC.

### Core Objectives:
1. **Bridge Classrooms to Fluency:** Provide daily, high-speed gamified language practice that directly mirrors the CEFR-aligned curriculum taught in CAU Prep School classrooms.
2. **Exit Exam & Proficiency Readiness:** Replicate the strict time pressure of the CAU English Proficiency (Exemption/Exit) Exam with 45-second timed sprints, error detection drills, and dense reading comprehension modules.
3. **Teacher-Led Community:** Enable instructors (led by Head of Preparatory English, Dr. David Henderson) to publish weekend challenges, broadcast tips, track scores on a live roster, and answer student questions in a public office hours feed.
4. **Zero-Friction Access:** Eliminate login walls, complex credentials, and database hurdles. Any student can join, claim their spot on the leaderboard, RSVP for campus speaking circles, and contribute XP to their prep cohort in seconds.

---

## 2. Preparatory School Architecture & Elimination of Degree Faculties

Following strict administrative requirements, **all degree faculties (Dentistry, Engineering, Architecture, Law, Health Sciences, Applied Sciences) were entirely eradicated from the arena application**. Degree faculties belong to undergraduate study after students pass preparatory school.

The arena is built 100% around the **Four Official Prep School Modules**:

```
                                  [ CAU ENGLISH PREPARATORY SCHOOL ]
                                                  │
                 ┌──────────────────┬─────────────┴──────────────┬──────────────────┐
                 ▼                  ▼                            ▼                  ▼
          ┌─────────────┐    ┌─────────────┐              ┌─────────────┐    ┌─────────────┐
          │  MODULE 1   │    │  MODULE 2   │              │  MODULE 3   │    │  MODULE 4   │
          │  Track A2   │    │  Track B1   │              │  Track B2   │    │Track C1/Exit│
          │ Elementary  │    │Pre-Intermed │              │Upper-Interm │    │ Proficiency │
          └─────────────┘    └─────────────┘              └─────────────┘    └─────────────┘
                 │                  │                            │                  │
                 └──────────────────┴─────────────┬──────────────┴──────────────────┘
                                                  ▼
                               [ CAU ENGLISH PROFICIENCY / EXIT EXAM ]
```

### Prep School Module Specifications:
- **Module 1 (Track A2 - Elementary Prep):**
  - **Focus:** Foundational campus communication, classroom etiquette, basic syntax, polite requests, everyday student life vocabulary.
  - **Starting Cohort Baseline:** 10,450 XP (Rank #4)
- **Module 2 (Track B1 - Pre-Intermediate Prep):**
  - **Focus:** Sentence architecture, coordinating conjunctions, transitional linkers, narrative past tenses, paragraph coherence.
  - **Starting Cohort Baseline:** 11,200 XP (Rank #3)
- **Module 3 (Track B2 - Upper-Intermediate Prep):**
  - **Focus:** Complex academic grammar, error detection ("Spot the Red Flag"), scholarly hedging, email etiquette, seminar dialogue.
  - **Starting Cohort Baseline:** 13,950 XP (Rank #2)
- **Module 4 (Track C1 - Proficiency & Exit Master):**
  - **Focus:** High-density reading comprehension passages, deductive logic under 45-second timers, TOEFL/IELTS-level vocabulary, academic thesis defense.
  - **Starting Cohort Baseline:** 14,820 XP (Rank #1 Leader)

---

## 3. Complete System Feature Catalog

### 3.1 Gamified Academic Arena
- **6-Tier Progressive Sprint:** 6 calibrated stages scaling from A2 to C2. Features a 45-second countdown timer, speed multipliers, and combo bonuses.
- **Spot the Red Flag (Grammar Detective):** Dedicated exercises targeting common errors (dangling modifiers, run-on sentences, false cognates, awkward direct translations).
- **Dynamic Question Types:**
  - Standard 4-choice multiple choice.
  - Cloze sentence completion with dropdown selections.
  - Underlined sentence error detection.
  - Dual-character dialogue bubble analysis.
  - Dense reading excerpt analysis with deductive reasoning.
- **Grammar Hotline (Hint System):** Consumes 1 unit of Assessment Energy to strike out two incorrect choices (`useHint()`).
- **Blitz the Owl Mascot Engine:** Responsive mascot providing supportive, witty feedback tailored to correct answers, timeouts, mistakes, and streaks.

### 3.2 Prep Scenario Simulator (Pragmatics Gym)
- **Real-World University Dilemmas:** Scenarios covering extension requests, sharp critique defense, group work accountability, and seminar debates.
- **Multi-Choice Register Analysis:** Distinguishes between informal/emotional responses and professional academic diplomacy.
- **Power Phrases Clipboard:** One-click utility that copies polished academic phrases (e.g., *"While acknowledging the economic rationale..."*) to the student's clipboard.

### 3.3 Speaking Hub & Campus Meetups
- **The CAU Prep Proficiency Cup 2026:** Seasonal countdown clock tracking the final exam playoffs, with an automated 30+ XP eligibility validator.
- **3 Real-World Campus Societies:**
  1. *Frappe & Fluency Social:* Gazebo informal circle (Role selection: `Active Speaker` vs `Listener/Social`).
  2. *Speaking Exam Mock Clinic:* Prep Lab 2 timed oral practice (Role selection: `Mock Candidate` vs `Peer Observer`).
  3. *Prep Portfolio Writing Clinic:* Library Room 3 essay review (Role selection: `Bringing Draft` vs `General Help`).
- **One-Click Role RSVP:** Real-time seat tally updates and instant +10 XP reward.

### 3.4 Teacher ↔ Student Interactive Loop
- **Weekend Prep Flash Sprint:** Instructor-pinned sprint with countdown badge, instructor guidance note, and 1-click enrollment.
- **Live Office Hours Q&A Feed:** Public feed where students post questions and instructors post verified answers with instructor badges.
- **Teacher Desk Management Modal:** Instructor control console for reviewing the live enrolled roster, awarding commendations, creating new weekend challenges, and exporting grades to CSV.

### 3.5 Champions Leaderboard & Module Standings
- **Defending Champion Spotlight:** Highlights the Week 6 crown holder.
- **Zero-Friction Spot Claim:** Input name and select prep module to instantly rank on the board with current XP.
- **Modular Standings:** Dynamic progress bars where every earned point increases the student's module cohort standing.
- **Historical Champions Hall:** Archive of weekly gold medal winners (Weeks 1 to 6).

---

## 4. Exhaustive Section-by-Section DOM & UI Breakdown

The entire page layout in `client/english-quest.html` (and mirrored in `client/english.html`) is structured into explicit, accessible semantic regions:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. Canonical CAU Header (#cauHeader) & Explore Mega-Dropdown           │
├────────────────────────────────────────────────────────────────────────┤
│ 2. Page Kicker, H1 Title & Action Bar (.quest-title-section)           │
├────────────────────────────────────────────────────────────────────────┤
│ 3. Global Metrics Strip (.quest-stats-strip: XP, Streak, Energy, Audio)│
├────────────────────────────────────────────────────────────────────────┤
│ 4. Blitz Mascot Commentary Bubble (#mascotBubble)                      │
│ 5. Achievement Toast Notification (#badgeToast)                        │
├────────────────────────────────────────────────────────────────────────┤
│ 6. Three-Pillar Segmented Controller (.pillars-segmented)              │
│    [ ⚔️ Prep Module Arena ] [ 🎓 Scenario Simulator ] [ 🎙️ Speaking Hub]│
├────────────────────────────────────────────────────────────────────────┤
│ 7. ACTIVE PANE CONTENT:                                                │
│    ├── Pillar 1: #pillar-arena                                         │
│    │   ├── Weekend Flash Sprint Card (#weekendChallengeCard)           │
│    │   ├── Prep Modular League Standings (.faculty-clash-card)         │
│    │   ├── Featured Arena Launch Grid (.arena-launch-grid)             │
│    │   ├── Achievement Shelf (#badgeShelf - 10 Badges)                 │
│    │   └── 6-Tier CEFR Stage Grid (.quest-stage-grid)                  │
│    │                                                                   │
│    ├── Pillar 2: #pillar-simulator                                     │
│    │   └── Scenario Container (.scenario-sim-container)                │
│    │       ├── Dilemma Card (#scenarioSituation, #scenarioIncoming)    │
│    │       ├── Interactive Choices Grid (#scenarioChoices)             │
│    │       └── Immediate Register Feedback Box (#scenarioAnalysis)     │
│    │                                                                   │
│    └── Pillar 3: #pillar-speaking                                      │
│        ├── Prep Proficiency Cup Banner & Countdown                     │
│        ├── 3 Campus Meetup Cards with Role RSVP Selectors              │
│        ├── Office Hours Q&A Feed (#qaFeedList) & Question Form         │
│        └── Prep Champions Leaderboard (.leaderboard-container)         │
│            ├── Defending Champion Spotlight (#weeklyChampionSpotlight) │
│            ├── Zero-Friction Claim Strip (.leaderboard-claim-strip)    │
│            └── Live Ranked Table (#leaderboardBody)                    │
├────────────────────────────────────────────────────────────────────────┤
│ 8. SCREEN 2: Skill Module Map (#screen-map)                            │
├────────────────────────────────────────────────────────────────────────┤
│ 9. SCREEN 3: Active Assessment Arena (#screen-game)                    │
│    ├── 45s Countdown Bar (#timerBar) & Digits (#timerDigits)           │
│    ├── Dynamic Question Container (#questionHeading, #optionsContainer)│
│    ├── Grammar Hotline Hint Button (#hintBtn)                          │
│    └── Instant Rationale Bar (#feedbackBar) & Next Button              │
├────────────────────────────────────────────────────────────────────────┤
│ 10. SCREEN 4: Results & Evaluation (#screen-result)                    │
│     ├── Trophy & CEFR Placement Result Box                             │
│     ├── Earned XP Display, Rank Badge & Confetti Canvas                │
│     └── Direct Navigation CTAs (Replay, Leaderboard, Diagnostic Test)   │
├────────────────────────────────────────────────────────────────────────┤
│ 11. MODAL: Instructor Control Desk (#facultyDeskModal)                 │
│     ├── Tab 1: Live Enrolled Roster Table & CSV Grade Export           │
│     ├── Tab 2: Create & Pin Weekend Challenge Form                     │
│     └── Tab 3: Teacher Tip Broadcast Input                             │
├────────────────────────────────────────────────────────────────────────┤
│ 12. Canonical Shared Footer (<footer data-shared-footer="true">)       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Teacher ↔ Student Interactive Ecosystem

### 5.1 The Interaction Lifecycle

```
[ Instructor ]                                                 [ Student ]
     │                                                              │
     ├─► 1. Creates Weekend Challenge in Console                    │
     │      (Topic: Collocations, +50 XP bounty)                    │
     │                                                              │
     │   2. Pinned Card Updates on Home Screen ────────────────────►│
     │                                                              ├─► 3. Clicks "Enroll & Play"
     │                                                              │      (Enters nickname, auto-added to Roster)
     │                                                              │
     │                                                              ├─► 4. Plays 5-Question Timed Sprint
     │                                                              │      (Earns +50 XP bonus)
     │                                                              │
     │◄─ 5. Score updates on Live Instructor Roster ────────────────┤
     │                                                              │
     ├─► 6. Grants "Instructor Commendation" ──────────────────────►│
     │      (Student profile displays Commended badge)              │
     │                                                              │
     │                                                              ├─► 7. Posts question in Office Hours
     │                                                              │      ("Is 'furthermore' formal in essays?")
     │                                                              │
     ├─► 8. Clicks "Instructor Reply" in Feed ─────────────────────►│
     │      (Publishes verified answer with Dr. Henderson badge)    │
     │                                                              │
     ├─► 9. Exports Roster Grades to CSV                            │
```

### 5.2 The 7 Official Preparatory School Instructors

The CAU English Preparatory School faculty consists of **7 specialized instructors**, each anchoring specific CEFR levels, grammar clinics, research methodologies, and speaking circles:

| # | Instructor Name | Role / Specialty | Institutional Email | Assigned Hazırlık Module | Humor / Pedagogical Quirks |
|---|-----------------|------------------|---------------------|--------------------------|----------------------------|
| 1 | **Dr. David Henderson** | Head of Prep English & Writing Chair | `d.henderson@cau.edu.tr` | Module 4 (Track C1 Exit) | Fierce Oxford comma defender; turns 2,000-word essay terror into 4-step puzzles. |
| 2 | **Ms. Sarah Jenkins** | Module 3 Lead & Grammar Director | `s.jenkins@cau.edu.tr` | Module 3 (Track B2 Intermediate) | Conditionals specialist from London; turns irregular verbs into hilarious courtroom dramas. |
| 3 | **Mr. Mehmet Demir** | Module 1 Lead & Vocab Coordinator | `m.demir@cau.edu.tr` | Module 1 (Track A2 Elementary) | Saintly patience; treats 'I am agree' as a crime; awards Turkish delight for 100% scores. |
| 4 | **Dr. Elena Rostova** | Exit Strategist & Research Tactician | `e.rostova@cau.edu.tr` | Module 4 (Track C1 Exit) | Multilingual chess mind; detects plagiarism at 30 paces; master of scholarly paraphrasing. |
| 5 | **Mr. Tariq Al-Mansoor** | Module 2 Lead & Speaking Host | `t.almansoor@cau.edu.tr` | Module 2 (Track B1 Pre-Inter) | Gazebo 'Frappe & Fluency' host; bans 'sorry for bad English'; debate energizer. |
| 6 | **Ms. Zeynep Kaya** | Phonetics & Presentation Coach | `z.kaya@cau.edu.tr` | All Modules (Cross-Track) | Tongue-twister champion; eliminates presentation stage fright in 30 seconds. |
| 7 | **Mr. Marcus Sterling** | Speed Reading & Syntax Detective | `m.sterling@cau.edu.tr` | Module 3/4 Critical Reading | 1,000-word scanner; always has 4 highlighters; decodes academic Latin roots instantly. |

### 5.3 Interactive Cards & Client-Side Management Features
1. **Interactive Drawers (`toggleInstructorDetails`):** One-click toggle unfolds funny quirks, classroom pet peeves, quotes, and office hours with synthesized Web Audio tone feedback.
2. **Instant Clipboard Engine (`copyInstructorEmail`):** One-click copy with dynamic `✓ Copied!` button state change and animated `#badgeToast`.
3. **Mascot Speech Reactivity (`mascotInstructorFact`):** Clicking avatar rings prompts the CAU mascot in the bottom corner to share unique teacher trivia.
4. **Interactive Management Modal (`#instructorModal`):** Complete CRUD modal allowing instructors and admins to add, edit, or delete mentor profiles with real-time live preview.
5. **Persistence (`cauPrepInstructors`):** Custom edits serialize to `localStorage` while retaining instant 1-click restore to the canonical 7 defaults.


---

## 6. Technical Challenges Overcome (Engineering Post-Mortem)

### 6.1 Total Eradication of Degree Faculties
- **Problem:** Initial builds had references to degree faculties (Dentistry, Engineering, etc.) mixed into cohort calculations and UI cards.
- **Solution:** Replaced all references with **Prep Modules 1 to 4**. Built `PREP_MODULES` state dictionary and updated all points algorithms, dropdowns, and cohort progress meters to reflect preparatory school tracks.

### 6.2 Eliminating Page Clutter with the 3-Pillar Switcher
- **Problem:** Housing an arena, scenario dilemmas, speaking meetups, Q&A feeds, and leaderboards on one page caused infinite scrolling and user disorientation.
- **Solution:** Created the **3-Pillar Segmented Switcher** (`switchPillar()`). It toggles visibility between panes instantly with zero page reloads, smooth scroll anchoring, and audio feedback.

### 6.3 Zero-Database Passwordless Persistence
- **Problem:** The user requested an interactive experience with leaderboards, rosters, and Q&A feeds without database backends or complex account creation.
- **Solution:** Designed a client-side architecture using `localStorage` with seed datasets. All operations (claiming leaderboard spots, posting questions, answering queries, creating weekend sprints) serialize to local state and persist across refreshes.

### 6.4 Audio Synthesis Without Media Asset Failures
- **Problem:** External `.mp3` sound files caused latency, 404 network failures, and browser autoplay blocks.
- **Solution:** Implemented a pure Web Audio API oscillator synthesizer directly in `english-quest.js`. It synthesizes custom sound frequencies for timer ticks, correct answers, errors, and fanfares without requiring external files.

### 6.5 Safe Synchronous File Synchronization
- **Problem:** The dev server serves assets from both `client/` and `client/public/`. Changes in one directory without the other led to stale assets or cache mismatches.
- **Solution:** Built synchronization scripts to mirror changes across both directories, followed by automated `node -c` syntax verification.

---

## 7. Core Code Implementations & Data Architectures

### 7.1 State Definitions
```javascript
// Prep Modules State
const PREP_MODULES = {
  module4: { name: "Module 4 (Track C1 Exit Prep)", emoji: "🎓", points: 14820, rank: 1 },
  module3: { name: "Module 3 (Track B2 Intermediate)", emoji: "📙", points: 13950, rank: 2 },
  module2: { name: "Module 2 (Track B1 Pre-Intermediate)", emoji: "📘", points: 11200, rank: 3 },
  module1: { name: "Module 1 (Track A2 Elementary)", emoji: "📚", points: 10450, rank: 4 }
};

// Seed Champions Board
const DEFAULT_PREP_STUDENTS = [
  { rank: 1, name: "Tariq Al-Mansoor", faculty: "Module 4: Proficiency Exit Master (C1)", tier: "TOEFL Titan", xp: 480, badge: "👑 Week 6 Leader" },
  { rank: 2, name: "Elena Vance", faculty: "Module 3: Upper-Intermediate (B2)", tier: "Scholarly Fellow", xp: 420, badge: "Challenger" },
  { rank: 3, name: "Cemil Yılmaz", faculty: "Module 3: Upper-Intermediate (B2)", tier: "Scholarly Fellow", xp: 395, badge: "Challenger" },
  { rank: 4, name: "Amara Okafor", faculty: "Module 2: Pre-Intermediate (B1)", tier: "Pragmatics Pro", xp: 360, badge: "Top 5" },
  { rank: 5, name: "Lucas Meyer", faculty: "Module 2: Pre-Intermediate (B1)", tier: "Pragmatics Pro", xp: 310, badge: "Top 5" },
  { rank: 6, name: "Zeynep Kaya", faculty: "Module 1: Elementary Prep (A2)", tier: "Syntax Sleuth", xp: 275, badge: "Contender" },
  { rank: 7, name: "Kofi Boateng", faculty: "Module 1: Elementary Prep (A2)", tier: "Syntax Sleuth", xp: 240, badge: "Contender" }
];

// Historical Champions Archive
const PAST_PREP_CHAMPIONS = [
  { week: "Week 6 (Current)", name: "Tariq Al-Mansoor", faculty: "Module 4 (Exit Prep)", tier: "Exit Exam Titan (C2)", xp: 480, crown: "👑 Week 6 Gold" },
  { week: "Week 5", name: "Elena Vance", faculty: "Module 3 (Track B2)", tier: "Scholarly Fellow (C1)", xp: 420, crown: "🏆 Week 5 Gold" },
  { week: "Week 4", name: "Cemil Yılmaz", faculty: "Module 3 (Track B2)", tier: "Scholarly Fellow (C1)", xp: 395, crown: "🏆 Week 4 Gold" },
  { week: "Week 3", name: "Amara Okafor", faculty: "Module 2 (Track B1)", tier: "Pragmatics Pro (B2+)", xp: 360, crown: "🏆 Week 3 Gold" },
  { week: "Week 2", name: "Lucas Meyer", faculty: "Module 2 (Track B1)", tier: "Pragmatics Pro (B2+)", xp: 330, crown: "🏆 Week 2 Gold" },
  { week: "Week 1", name: "Zeynep Kaya", faculty: "Module 1 (Track A2)", tier: "Syntax Sleuth (B2)", xp: 310, crown: "🏆 Week 1 Gold" }
];
```

### 7.2 Zero-Registration Leaderboard Claim Engine
```javascript
window.claimLeaderboardSpot = function(e) {
  const nameInput = document.getElementById("leaderboardInputName");
  const moduleSelect = document.getElementById("leaderboardSelectFaculty");

  let studentName = nameInput ? nameInput.value.trim() : "";
  if (!studentName) {
    studentName = prompt("Enter your Name or Nickname for the Prep School Leaderboard:", "Prep Student");
    if (!studentName || !studentName.trim()) return;
    studentName = studentName.trim();
    if (nameInput) nameInput.value = studentName;
  }

  const chosenModule = moduleSelect ? moduleSelect.value : "Module 3: Upper-Intermediate (B2)";

  let tierName = "Module 1 Fundamentals (A2)";
  if (xp >= 100) tierName = "Module 2 Architecture (B1)";
  if (xp >= 200) tierName = "Module 3 Pragmatics (B2)";
  if (xp >= 350) tierName = "Module 4 Scholarly (C1)";
  if (xp >= 450) tierName = "Proficiency Exit Master (C2)";

  let scoreToPost = xp <= 0 ? 35 : xp;
  if (xp <= 0) {
    xp = 35;
    if (typeof updateStats === 'function') updateStats();
  }

  const champions = getWeeklyChampionsData();
  const filtered = champions.filter(c => !c.isUser);

  const newEntry = {
    rank: 1,
    name: studentName,
    faculty: chosenModule,
    tier: tierName,
    xp: scoreToPost,
    badge: "Prep Scholar",
    isUser: true,
    timestamp: Date.now()
  };

  filtered.push(newEntry);
  filtered.sort((a, b) => b.xp - a.xp);
  saveWeeklyChampionsData(filtered);

  try {
    localStorage.setItem("cauCurrentStudentName", studentName);
  } catch(err) {}

  if (typeof playTone === 'function') playTone('fanfare');
  if (typeof fireConfetti === 'function') fireConfetti();

  const myRank = filtered.findIndex(c => c.isUser) + 1;
  renderLeaderboardTable('weekly');
  awardModulePoints(scoreToPost);
};
```

### 7.3 Grade Export (CSV) Engine
```javascript
function exportRosterCsv() {
  const roster = getRosterData();
  let csv = "Student Name,Prep Module Track,Status,Score,Time,Commended\n";
  roster.forEach(r => {
    csv += `"${r.name}","${r.faculty}","${r.status}","${r.score}","${r.time}",${r.commended ? 'Yes' : 'No'}\n`;
  });
  
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "CAU_PrepSchool_Grades_" + new Date().toISOString().slice(0,10) + ".csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
```

### 7.4 Web Audio Synthesizer Engine
```javascript
function playTone(type) {
  if (isMuted) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'correct') {
      playFreq(ctx, 523.25, 0.08, 0);       // C5
      playFreq(ctx, 659.25, 0.12, 0.08);     // E5
    } else if (type === 'wrong') {
      playFreq(ctx, 349.23, 0.10, 0);       // F4
      playFreq(ctx, 329.63, 0.18, 0.09);     // E4
    } else if (type === 'fanfare') {
      playFreq(ctx, 523.25, 0.10, 0);       // C5
      playFreq(ctx, 783.99, 0.12, 0.10);     // G5
      playFreq(ctx, 1046.50, 0.25, 0.22);    // C6
    }
  } catch(e) {}
}

function playFreq(ctx, freq, duration, delay) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
  gain.gain.setValueAtTime(0.08, ctx.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration);
}
```

---

## 8. Design System & CSS Styling Specifications

All styling lives in `client/styles/english-quest.css`. Key tokens and styles include:

### 8.1 3-Pillar Segmented Controller
```css
.pillars-nav-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.pillars-segmented {
  display: inline-flex;
  background: var(--sys-surface-2);
  border: var(--border-hairline);
  border-radius: 9999px;
  padding: 4px;
  gap: 4px;
}

.pillar-tab-btn {
  border: none;
  background: transparent;
  color: var(--sys-text-muted);
  font-family: var(--font-family-display);
  font-weight: 700;
  font-size: 13px;
  padding: 8px 18px;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.pillar-tab-btn.is-active {
  background: var(--sys-surface-1);
  color: var(--sys-accent);
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
```

### 8.2 Verified Instructor Card & Avatar
```css
.teacher-avatar-ring {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--sys-surface-2);
  border: 2px solid var(--sys-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  position: relative;
  flex-shrink: 0;
}

.teacher-verified-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 14px;
  height: 14px;
  background: #10b981;
  border: 2px solid var(--sys-surface-1);
  border-radius: 50%;
}
```

### 8.3 Q&A Feed & Verified Instructor Reply
```css
.qa-card-item {
  background: var(--sys-surface-1);
  border: var(--border-hairline);
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 12px;
}

.qa-faculty-reply-box {
  background: var(--sys-surface-2);
  border-left: 3px solid #10b981;
  border-radius: 6px;
  padding: 10px 12px;
  margin-top: 10px;
}

.qa-faculty-badge {
  font-size: 11px;
  font-weight: 700;
  color: #10b981;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
```

---

## 9. Verification, Quality Assurance & Deployment Status

- **Zero Degree Faculties:** Confirmed. All references map to Modules 1 through 4.
- **Server Status:** Node/Vite development server running smoothly on port 3000.
- **HTTP Status:** All core routes return `HTTP 200 OK` (`/english-quest.html`, `/english.html`, `/styles/english-quest.css`, `/scripts/english-quest.js`).
- **Syntax Validation:** `node -c` runs clean with exit code 0 across all JavaScript files.
- **State Integrity:** All data operations successfully persist to `localStorage`.

---
---

## 10. Live Export, Report Download & Cache Busting Architecture

### 10.1 Direct Markdown (.md) Report Download Suite
- **1-Click Architectural Export:** Added universal `downloadEnglishReportMd()` download triggers across 4 key touchpoints:
  1. **Top Title Action Bar:** Featured `#downloadReportBtn` with high-visibility coral styling and real-time download trigger.
  2. **Page Hero Banner:** Prominent `.alert-light` callout providing immediate single-click access to the full report file.
  3. **Teacher Console (Faculty Desk):** Export button directly adjacent to the CSV student grade roster.
  4. **Bottom Quick Strip:** Persistent action trigger situated above the site footer.
- **Cache-Busting Stream:** Fetches `/CAU_ENGLISH_PREP_SCHOOL_ARENA_REPORT.md?v=${timestamp}` ensuring clients always receive the live, untruncated master specification file.

### 10.2 Official Digital Student Pass Generator
- **Dedicated Pass Studio (`#club-membership`):** Interactive member pass generator providing instant issuance without logins or passwords.
- **Prep Module Synchronization:** Fully integrated with Prep Modules 1 through 4, club tracks, avatar selector (🎓, 📘, 💻, 🏛️, 🎙️, 🌍), and printable card generation.
- **Live XP Incentive:** Awards +20 Arena XP upon first-time pass activation and serializes to `localStorage`.

### 10.3 Live Ticking Countdown Engine
- Real-time 4-digit countdown timer (`#cdDays`, `#cdHours`, `#cdMins`, `#cdSecs`) for the CAU Prep Proficiency Cup 2026 finals.

---
*Report compiled and verified for the Cyprus Aydın University English Preparatory School (Hazırlık Okulu) Academic Department.*
