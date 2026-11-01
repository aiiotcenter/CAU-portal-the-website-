/**
 * ==============================================================================
 * CYPRUS AYDIN UNIVERSITY (CAU) — ENGLISH PLACEMENT TEST ENGINE
 * Modularized CBT Assessment Engine with Date.now() Drift-Free Timer,
 * LocalStorage Session Persistence, Double-Tap Click Locking, and Arena Linking
 * ==============================================================================
 */

(() => {
  'use strict';

  const STORAGE_ACTIVE_KEY = 'cau_placement_active_state';
  const STORAGE_RESULT_KEY = 'cau_placement_result';

  const PLACEMENT_QUESTIONS = [
    // ── PART I: Structure & Grammar in Academic Context (Questions 1–6) ──
    {
      id: "epe_str_1",
      section: "PART I: STRUCTURE & GRAMMAR",
      category: "part1",
      q: "The university provost announced that all faculty research departments _____ European Bologna accreditation criteria by the end of the fiscal year.",
      a: ["must have complied with", "are to comply with", "having complied to", "will be comply with"],
      c: 1,
      rationale: "“Are to comply with” expresses formal institutional mandates, and the verb “comply” collocates strictly with the preposition “with”."
    },
    {
      id: "epe_str_2",
      section: "PART I: STRUCTURE & GRAMMAR",
      category: "part1",
      q: "Had the telemetry sensors been properly calibrated prior to experimentation, the anomalous voltage fluctuations _____ immediately.",
      a: ["would have been detected", "were detected", "will be detected", "would be detect"],
      c: 0,
      rationale: "Inverted third conditional ('Had + subject + past participle') strictly requires 'would have + past participle' in the main clause."
    },
    {
      id: "epe_str_3",
      section: "PART I: STRUCTURE & GRAMMAR",
      category: "part1",
      q: "Neither the dean of academic affairs nor the faculty committee members _____ willing to postpone the final examination schedule.",
      a: ["is", "was", "were", "has been"],
      c: 2,
      rationale: "In correlative constructions with “neither ... nor”, the verb agrees in number with the closer subject ('the faculty committee members' = plural 'were')."
    },
    {
      id: "epe_str_4",
      section: "PART I: STRUCTURE & GRAMMAR",
      category: "part1",
      q: "Rarely _____ such unprecedented cross-disciplinary collaboration between biomedical robotics and dental surgery faculties.",
      a: ["we have observed", "have we observed", "we did observe", "had we observing"],
      c: 1,
      rationale: "Negative adverbs like “Rarely” placed at the start of a sentence trigger subject-auxiliary inversion ('have we observed')."
    },
    {
      id: "epe_str_5",
      section: "PART I: STRUCTURE & GRAMMAR",
      category: "part1",
      q: "The ethics committee recommended that the principal investigator _____ the participant consent forms before commencing clinical trials.",
      a: ["modifies", "modify", "is modifying", "will modify"],
      c: 1,
      rationale: "The mandative subjunctive mood following verbs of recommendation requires the bare base form of the verb ('modify')."
    },
    {
      id: "epe_str_6",
      section: "PART I: STRUCTURE & GRAMMAR",
      category: "part1",
      q: "The architectural engineering department selected the student _____ capstone project won the European Sustainable Design Award.",
      a: ["who", "whom", "whose", "which"],
      c: 2,
      rationale: "“Whose” functions as the possessive relative pronoun modifying 'capstone project' belonging to the student."
    },

    // ── PART II: Academic Word List (AWL) & Collocations (Questions 7–12) ──
    {
      id: "epe_voc_1",
      section: "PART II: ACADEMIC VOCABULARY",
      category: "part2",
      q: "In scientific research, “empirical” evidence is defined as data derived from:",
      a: ["Direct systematic observation or experimentation", "Unsubstantiated theoretical speculation", "Popular colloquial consensus", "Traditional literary allegories"],
      c: 0,
      rationale: "Empirical methodology relies strictly on verifiable observational or experimental evidence rather than pure hypothesis."
    },
    {
      id: "epe_voc_2",
      section: "PART II: ACADEMIC VOCABULARY",
      category: "part2",
      q: "Completing an undergraduate capstone dissertation is a mandatory prerequisite _____ degree conferral.",
      a: ["for", "to", "with", "at"],
      c: 0,
      rationale: "In academic regulations, an obligatory qualification serves as a “prerequisite for” a milestone or credential."
    },
    {
      id: "epe_voc_3",
      section: "PART II: ACADEMIC VOCABULARY",
      category: "part2",
      q: "Modern campus libraries are designed with acoustic baffling to maintain an ambient environment _____ to cognitive focus and deep study.",
      a: ["conducive", "detrimental", "hostile", "negligent"],
      c: 0,
      rationale: "“Conducive to” is an academic collocation meaning making a specific outcome likely or possible (fostering deep focus)."
    },
    {
      id: "epe_voc_4",
      section: "PART II: ACADEMIC VOCABULARY",
      category: "part2",
      q: "When two chemical agents interact to produce an overall outcome far greater than the sum of their individual effects, their reaction is termed:",
      a: ["Antagonistic", "Synergistic", "Divergent", "Equivocal"],
      c: 1,
      rationale: "“Synergistic” specifically denotes cooperation where the combined effect exceeds the individual components."
    },
    {
      id: "epe_voc_5",
      section: "PART II: ACADEMIC VOCABULARY",
      category: "part2",
      q: "The doctoral candidate conducted three separate replication trials in order to _____ the anomalous findings observed during the initial study.",
      a: ["corroborate", "subvert", "alienate", "extrapolate"],
      c: 0,
      rationale: "“Corroborate” means to confirm or support with fresh evidence or independent verification."
    },
    {
      id: "epe_voc_6",
      section: "PART II: ACADEMIC VOCABULARY",
      category: "part2",
      q: "The research team’s conclusions were cautious because the small sample size constituted a significant _____ limitation.",
      a: ["methodological", "superficial", "anecdotal", "arbitrary"],
      c: 0,
      rationale: "In academic papers, constraints regarding sample size, design, or instrumentation are termed “methodological limitations”."
    },

    // ── PART III: Campus Pragmatics & Academic Communication (Questions 13–16) ──
    {
      id: "epe_prg_1",
      section: "PART III: CAMPUS PRAGMATICS",
      category: "part3",
      specialType: "dialogue",
      dialogue: [
        { speaker: "Student", text: "Good morning. I’m an international transfer student. I submitted my certified foreign transcripts three weeks ago, but the student portal still marks them as 'Pending Equivalency Committee Review'." },
        { speaker: "Registrar Officer", text: "Welcome to CAU. Due to the high volume of international evaluations, the Senate Equivalency Board convenes every Thursday afternoon. Could you please provide your 8-digit application number so I can check whether your dossier has been scheduled for tomorrow’s docket?" }
      ],
      q: "What is the primary function of the Registrar Officer’s response?",
      a: [
        "To explain the institutional review timeline and request identification to track docket status",
        "To notify the student that foreign credit transfers have been permanently rejected",
        "To advise the student to withdraw their academic application and start anew",
        "To accuse the student of submitting uncertified or fraudulent academic documentation"
      ],
      c: 0,
      rationale: "The registrar explains administrative procedure (Thursday dockets) and requests the student ID to assist."
    },
    {
      id: "epe_prg_2",
      section: "PART III: CAMPUS PRAGMATICS",
      category: "part3",
      specialType: "dialogue",
      dialogue: [
        { speaker: "Student", text: "Excuse me, Professor Sterling. During yesterday's thermodynamic laboratory session, our team's digital calorimeter kept fluctuating wildly whenever the magnetic stirrer was engaged." },
        { speaker: "Professor", text: "That sounds like electromagnetic interference between the motor and the unshielded thermocouple. Before you discard your dataset, repeat the baseline calibration run with the sensor cable shielded, and document both calibration curves in your lab appendix." }
      ],
      q: "What does Professor Sterling advise the student team to do?",
      a: [
        "Discard the entire dataset immediately and accept an incomplete grade for the laboratory",
        "Isolate potential electromagnetic interference using shielded cabling and document comparative calibration curves",
        "Cease using magnetic stirrers entirely across all subsequent engineering experiments",
        "Submit the anomalous results without any explanatory notes or verification"
      ],
      c: 1,
      rationale: "The professor diagnoses possible electromagnetic interference and instructs the student to test with a shielded cable and document both curves."
    },
    {
      id: "epe_prg_3",
      section: "PART III: CAMPUS PRAGMATICS",
      category: "part3",
      specialType: "dialogue",
      dialogue: [
        { speaker: "Student", text: "Dr. Al-Mansoor, I have an unavoidable scheduling conflict. The Mediterranean Robotics Symposium in Kyrenia selected our team’s autonomous rover paper for an oral presentation on the exact morning of our Midterm Examination." },
        { speaker: "Department Chair", text: "Presenting peer-reviewed student research at recognized academic conferences is officially supported by university policy. File a formal Academic Conflict Petition accompanied by the conference acceptance letter at the department office by Friday, and we will schedule a proctored makeup exam." }
      ],
      q: "Under what institutional condition may the student sit for a makeup exam?",
      a: [
        "Only if the student pays a disciplinary rescheduling fee to the rectorate",
        "By submitting a formal conflict petition along with the official conference acceptance letter prior to the deadline",
        "Only if the student forfeits co-authorship on the symposium rover paper",
        "Students are strictly prohibited from presenting at conferences during examination periods"
      ],
      c: 1,
      rationale: "University policy permits conference presentations provided the student submits a formal petition with the official acceptance letter by Friday."
    },
    {
      id: "epe_prg_4",
      section: "PART III: CAMPUS PRAGMATICS",
      category: "part3",
      specialType: "dialogue",
      dialogue: [
        { speaker: "Student", text: "In my literature review chapter, I adapted a conceptual flowchart from a 2024 IEEE paper, redrew it with my own visual layout, and incorporated our lab’s specific telemetry metrics. Do I still need an in-text citation?" },
        { speaker: "Writing Center Advisor", text: "Most definitely. Even when you redraw or reorganize a visual model, the underlying structural concept remains intellectual property. You must caption the figure with: 'Adapted from [Author, Year]' and include the complete reference entry." }
      ],
      q: "According to academic integrity standards, why must the student cite the redrawn figure?",
      a: [
        "Because university software cannot render custom graphical files without attribution",
        "Because altering visual graphics is considered a serious disciplinary violation",
        "Because the intellectual concept originates from the source author, requiring explicit attribution even when adapted",
        "Because IEEE copyright agreements require all diagrams to remain black and white"
      ],
      c: 2,
      rationale: "Proper academic attribution requires citing the origin of intellectual ideas and models even when graphically modified or redrawn."
    },

    // ── PART IV: Academic Reading Comprehension (Questions 17–20) ──
    {
      id: "epe_rdg_1",
      section: "PART IV: ACADEMIC READING",
      category: "part4",
      specialType: "reading",
      passage: `<strong>Renewable Microgrid Decarbonization in the Eastern Mediterranean Basin</strong><br><br>
The climatic profile of the Eastern Mediterranean presents both an extraordinary opportunity and an acute engineering challenge for regional power systems. Benefiting from over 3,000 annual hours of solar irradiance, island territories such as Cyprus possess prime conditions for photovoltaic (PV) generation. However, isolated insular grids operate without synchronous interconnections to continental transmission networks, rendering them exceptionally vulnerable to rapid frequency transients caused by diurnal intermittency.<br><br>
When high-capacity solar farms generate peak power during midday, conventional base-load thermal generators must be throttled down to their operational minimum. In the late afternoon, as solar irradiance sharply wanes while residential cooling demand surges, the network experiences a phenomenon known colloquially as the “duck curve.” To avert destabilizing load-shedding events, utility operators must maintain sufficient fast-ramping spinning reserve or deploy utility-scale Battery Energy Storage Systems (BESS).<br><br>
Recent empirical deployments at university research hubs in Northern Cyprus demonstrate that integrating distributed 4-hour lithium-iron-phosphate (LFP) storage arrays with automated demand-response algorithms can curtail peak ramp-up stress by up to 38%. By dynamically modulating non-critical municipal loads—such as campus thermal chiller plants and municipal desalination pumps—during the critical dusk transition, microgrids achieve robust operational frequency stability without relying on carbon-intensive fossil fuel combustion.`,
      q: "According to the passage, why are isolated insular grids in Cyprus particularly susceptible to frequency instability?",
      a: [
        "They lack synchronous interconnections to continental networks to absorb rapid solar intermittency",
        "They receive less solar irradiance than northern continental European nations",
        "Their electrical distribution lines are exclusively powered by outdated hydroelectric turbines",
        "Campus cooling plants consume more power during the winter months than in summer"
      ],
      c: 0,
      rationale: "Paragraph 1 explains that isolated insular grids operate without synchronous interconnections to continental networks, leaving them vulnerable to diurnal intermittency."
    },
    {
      id: "epe_rdg_2",
      section: "PART IV: ACADEMIC READING",
      category: "part4",
      specialType: "reading",
      passage: `<strong>Renewable Microgrid Decarbonization in the Eastern Mediterranean Basin</strong><br><br>
The climatic profile of the Eastern Mediterranean presents both an extraordinary opportunity and an acute engineering challenge for regional power systems. Benefiting from over 3,000 annual hours of solar irradiance, island territories such as Cyprus possess prime conditions for photovoltaic (PV) generation. However, isolated insular grids operate without synchronous interconnections to continental transmission networks, rendering them exceptionally vulnerable to rapid frequency transients caused by diurnal intermittency.<br><br>
When high-capacity solar farms generate peak power during midday, conventional base-load thermal generators must be throttled down to their operational minimum. In the late afternoon, as solar irradiance sharply wanes while residential cooling demand surges, the network experiences a phenomenon known colloquially as the “duck curve.” To avert destabilizing load-shedding events, utility operators must maintain sufficient fast-ramping spinning reserve or deploy utility-scale Battery Energy Storage Systems (BESS).<br><br>
Recent empirical deployments at university research hubs in Northern Cyprus demonstrate that integrating distributed 4-hour lithium-iron-phosphate (LFP) storage arrays with automated demand-response algorithms can curtail peak ramp-up stress by up to 38%. By dynamically modulating non-critical municipal loads—such as campus thermal chiller plants and municipal desalination pumps—during the critical dusk transition, microgrids achieve robust operational frequency stability without relying on carbon-intensive fossil fuel combustion.`,
      q: "The term “diurnal intermittency” in Paragraph 1 refers to:",
      a: [
        "Continuous geothermal heat flows from underground volcanic reservoirs",
        "Fluctuations in solar energy availability throughout day and night cycles",
        "Unpredictable changes in ocean tidal currents during full moons",
        "Mechanical engine failure in commercial fossil fuel power stations"
      ],
      c: 1,
      rationale: "“Diurnal intermittency” denotes the day-to-night variance and fluctuation in solar radiation."
    },
    {
      id: "epe_rdg_3",
      section: "PART IV: ACADEMIC READING",
      category: "part4",
      specialType: "reading",
      passage: `<strong>Renewable Microgrid Decarbonization in the Eastern Mediterranean Basin</strong><br><br>
The climatic profile of the Eastern Mediterranean presents both an extraordinary opportunity and an acute engineering challenge for regional power systems. Benefiting from over 3,000 annual hours of solar irradiance, island territories such as Cyprus possess prime conditions for photovoltaic (PV) generation. However, isolated insular grids operate without synchronous interconnections to continental transmission networks, rendering them exceptionally vulnerable to rapid frequency transients caused by diurnal intermittency.<br><br>
When high-capacity solar farms generate peak power during midday, conventional base-load thermal generators must be throttled down to their operational minimum. In the late afternoon, as solar irradiance sharply wanes while residential cooling demand surges, the network experiences a phenomenon known colloquially as the “duck curve.” To avert destabilizing load-shedding events, utility operators must maintain sufficient fast-ramping spinning reserve or deploy utility-scale Battery Energy Storage Systems (BESS).<br><br>
Recent empirical deployments at university research hubs in Northern Cyprus demonstrate that integrating distributed 4-hour lithium-iron-phosphate (LFP) storage arrays with automated demand-response algorithms can curtail peak ramp-up stress by up to 38%. By dynamically modulating non-critical municipal loads—such as campus thermal chiller plants and municipal desalination pumps—during the critical dusk transition, microgrids achieve robust operational frequency stability without relying on carbon-intensive fossil fuel combustion.`,
      q: "How do automated demand-response algorithms help mitigate the “duck curve” stress at dusk?",
      a: [
        "By dynamically modulating non-critical loads such as campus chiller plants and desalination pumps",
        "By permanently shutting down solar energy generation across all residential districts",
        "By mandating the construction of coal-fired thermoelectric power plants across coastal areas",
        "By eliminating all digital telemetry and monitoring systems from university campuses"
      ],
      c: 0,
      rationale: "Paragraph 3 specifies that demand-response algorithms modulate non-critical municipal loads like chiller plants and desalination pumps during dusk."
    },
    {
      id: "epe_rdg_4",
      section: "PART IV: ACADEMIC READING",
      category: "part4",
      specialType: "reading",
      passage: `<strong>Renewable Microgrid Decarbonization in the Eastern Mediterranean Basin</strong><br><br>
The climatic profile of the Eastern Mediterranean presents both an extraordinary opportunity and an acute engineering challenge for regional power systems. Benefiting from over 3,000 annual hours of solar irradiance, island territories such as Cyprus possess prime conditions for photovoltaic (PV) generation. However, isolated insular grids operate without synchronous interconnections to continental transmission networks, rendering them exceptionally vulnerable to rapid frequency transients caused by diurnal intermittency.<br><br>
When high-capacity solar farms generate peak power during midday, conventional base-load thermal generators must be throttled down to their operational minimum. In the late afternoon, as solar irradiance sharply wanes while residential cooling demand surges, the network experiences a phenomenon known colloquially as the “duck curve.” To avert destabilizing load-shedding events, utility operators must maintain sufficient fast-ramping spinning reserve or deploy utility-scale Battery Energy Storage Systems (BESS).<br><br>
Recent empirical deployments at university research hubs in Northern Cyprus demonstrate that integrating distributed 4-hour lithium-iron-phosphate (LFP) storage arrays with automated demand-response algorithms can curtail peak ramp-up stress by up to 38%. By dynamically modulating non-critical municipal loads—such as campus thermal chiller plants and municipal desalination pumps—during the critical dusk transition, microgrids achieve robust operational frequency stability without relying on carbon-intensive fossil fuel combustion.`,
      q: "What can be inferred from the author’s discussion of university research hubs in Northern Cyprus?",
      a: [
        "University microgrid deployments serve as effective regional testbeds for scalable, carbon-neutral energy solutions",
        "Universities in the region rely entirely on imported diesel generators for daily electricity",
        "Solar power has proven unviable for Mediterranean universities due to cloud cover",
        "Lithium-iron-phosphate batteries cannot operate effectively in warm Mediterranean climates"
      ],
      c: 0,
      rationale: "The passage highlights how university research microgrids demonstrate successful 38% ramp stress reduction, proving their role as empirical testbeds for regional decarbonization."
    }
  ];

  /* ── Application State ── */
  let currentQuestionIndex = 0;
  let userAnswers = {}; // { questionId: selectedIndex }
  let flaggedQuestions = new Set();
  let examTimerInterval = null;
  let examStartTime = null;
  let examTotalDuration = 25 * 60; // 25 minutes in seconds
  let examTimeRemaining = 25 * 60;
  let isOptionLocked = false;

  const candidateProfile = {
    name: 'International Student',
    id: '',
    country: 'International',
    faculty: 'General Studies',
    exemptionThreshold: 65
  };

  /* ── State Persistence Helpers ── */
  const saveActiveState = () => {
    try {
      const state = {
        currentQuestionIndex,
        userAnswers,
        flaggedQuestions: Array.from(flaggedQuestions),
        candidateProfile,
        examStartTime,
        examTotalDuration,
        lastSaved: Date.now()
      };
      localStorage.setItem(STORAGE_ACTIVE_KEY, JSON.stringify(state));

      // Synchronize active placement progress into CAU_STATE_V1 (cau_portal_state_v1)
      try {
        const portalRaw = localStorage.getItem('cau_portal_state_v1');
        if (portalRaw) {
          const portalState = JSON.parse(portalRaw);
          if (portalState && portalState.englishArena) {
            portalState.englishArena.activePlacementTest = {
              currentQuestionIndex,
              answeredCount: Object.keys(userAnswers || {}).length,
              flaggedCount: (flaggedQuestions && flaggedQuestions.size) || 0,
              candidateName: candidateProfile.name || '',
              candidateId: candidateProfile.id || '',
              faculty: candidateProfile.faculty || '',
              lastSaved: Date.now()
            };
            localStorage.setItem('cau_portal_state_v1', JSON.stringify(portalState));
          }
        }
      } catch (err) {
        console.warn('Could not sync mid-test progress to cau_portal_state_v1:', err);
      }
    } catch (e) {
      console.warn('Could not save test state to localStorage:', e);
    }
  };

  const getActiveState = () => {
    try {
      const raw = localStorage.getItem(STORAGE_ACTIVE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const clearActiveState = () => {
    try {
      localStorage.removeItem(STORAGE_ACTIVE_KEY);
      // Clean up activePlacementTest from cau_portal_state_v1
      try {
        const portalRaw = localStorage.getItem('cau_portal_state_v1');
        if (portalRaw) {
          const portalState = JSON.parse(portalRaw);
          if (portalState && portalState.englishArena && portalState.englishArena.activePlacementTest) {
            delete portalState.englishArena.activePlacementTest;
            localStorage.setItem('cau_portal_state_v1', JSON.stringify(portalState));
          }
        }
      } catch {}
    } catch {}
  };

  /* ── Exemption Thresholds ── */
  function updateExemptionCriteria() {
    const facultyElem = document.getElementById('candidateFaculty');
    const faculty = facultyElem ? facultyElem.value : 'General Studies';
    if (faculty === 'Medicine' || faculty === 'Graduate') {
      candidateProfile.exemptionThreshold = 75;
    } else if (faculty === 'Law') {
      candidateProfile.exemptionThreshold = 70;
    } else if (faculty === 'Tourism') {
      candidateProfile.exemptionThreshold = 60;
    } else {
      candidateProfile.exemptionThreshold = 65;
    }
  }

  /* ── Screen Controller ── */
  function showScreen(screenId) {
    document.querySelectorAll('.placement-screen').forEach(s => s.classList.remove('is-active'));
    const screen = document.getElementById(screenId);
    if (screen) {
      screen.classList.add('is-active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /* ── Accurate Date.now() Timer (Resilient to Background Tab Throttling) ── */
  function startExamTimer(resumeElapsed = 0) {
    if (examTimerInterval) clearInterval(examTimerInterval);
    const timerBadge = document.getElementById('examTimerBadge');
    const timerDigits = document.getElementById('examTimerDigits');

    if (!examStartTime) {
      examStartTime = Date.now() - (resumeElapsed * 1000);
    }

    const tick = () => {
      const elapsedSecs = Math.floor((Date.now() - examStartTime) / 1000);
      examTimeRemaining = Math.max(0, examTotalDuration - elapsedSecs);

      const mins = Math.floor(examTimeRemaining / 60);
      const secs = examTimeRemaining % 60;
      if (timerDigits) {
        timerDigits.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      }

      if (timerBadge) {
        if (examTimeRemaining <= 300) {
          timerBadge.classList.add('warning');
        } else {
          timerBadge.classList.remove('warning');
        }
      }

      if (examTimeRemaining <= 0) {
        clearInterval(examTimerInterval);
        alert('⏰ Time is up! Your answers will now be evaluated for your English level result.');
        submitFinalExam();
      }
    };

    tick();
    examTimerInterval = setInterval(tick, 1000);
  }

  /* ── Level Test Initialization ── */
  function startExam() {
    const rawName = document.getElementById('candidateName') ? document.getElementById('candidateName').value.trim() : '';
    const rawFaculty = document.getElementById('candidateFaculty') ? document.getElementById('candidateFaculty').value : '';
    const rawCountry = document.getElementById('candidateCountry') ? document.getElementById('candidateCountry').value : '';
    const rawId = document.getElementById('candidateId') ? document.getElementById('candidateId').value.trim() : '';

    candidateProfile.name = rawName || 'International Student';
    candidateProfile.faculty = rawFaculty || 'General Studies';
    candidateProfile.country = rawCountry || 'International';
    candidateProfile.id = rawId || `CAU-${Math.floor(1000 + Math.random() * 9000)}`;
    updateExemptionCriteria();

    // Populate CBT Console Header
    if (document.getElementById('cbtNameDisplay')) document.getElementById('cbtNameDisplay').textContent = candidateProfile.name;
    if (document.getElementById('cbtDetailsDisplay')) document.getElementById('cbtDetailsDisplay').textContent = `${candidateProfile.faculty} • English Level Diagnostic`;
    if (document.getElementById('avatarInitial')) document.getElementById('avatarInitial').textContent = candidateProfile.name.charAt(0).toUpperCase();

    // Reset state
    currentQuestionIndex = 0;
    userAnswers = {};
    flaggedQuestions.clear();
    examStartTime = Date.now();
    examTotalDuration = 25 * 60;
    examTimeRemaining = examTotalDuration;

    saveActiveState();

    // Initialize Palette
    buildPaletteGrid();

    // Switch screen and load question 1
    showScreen('screen-cbt');
    renderCbtQuestion(0);
    startExamTimer();
  }

  /* ── Resume Active Test ── */
  function resumeExam() {
    const saved = getActiveState();
    if (!saved) return;

    candidateProfile.name = saved.candidateProfile.name || 'International Student';
    candidateProfile.faculty = saved.candidateProfile.faculty || 'General Studies';
    candidateProfile.country = saved.candidateProfile.country || 'International';
    candidateProfile.id = saved.candidateProfile.id || 'CAU-STUDENT';
    updateExemptionCriteria();

    userAnswers = saved.userAnswers || {};
    flaggedQuestions = new Set(saved.flaggedQuestions || []);
    currentQuestionIndex = saved.currentQuestionIndex || 0;
    examStartTime = saved.examStartTime;
    examTotalDuration = saved.examTotalDuration || 25 * 60;

    // Check if time expired while away
    const elapsedSecs = Math.floor((Date.now() - examStartTime) / 1000);
    if (elapsedSecs >= examTotalDuration) {
      alert('Your test session time expired while you were away. Submitting test now.');
      submitFinalExam();
      return;
    }

    if (document.getElementById('cbtNameDisplay')) document.getElementById('cbtNameDisplay').textContent = candidateProfile.name;
    if (document.getElementById('cbtDetailsDisplay')) document.getElementById('cbtDetailsDisplay').textContent = `${candidateProfile.faculty} • English Level Diagnostic`;
    if (document.getElementById('avatarInitial')) document.getElementById('avatarInitial').textContent = candidateProfile.name.charAt(0).toUpperCase();

    buildPaletteGrid();
    showScreen('screen-cbt');
    renderCbtQuestion(currentQuestionIndex);
    startExamTimer(elapsedSecs);
  }

  /* ── Question Navigation Palette ── */
  function buildPaletteGrid() {
    const grid = document.getElementById('paletteGrid');
    if (!grid) return;
    grid.innerHTML = '';

    PLACEMENT_QUESTIONS.forEach((q, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cbt-palette-btn';
      btn.id = `palette-btn-${idx}`;
      btn.textContent = idx + 1;
      btn.onclick = () => {
        currentQuestionIndex = idx;
        saveActiveState();
        renderCbtQuestion(idx);
      };
      grid.appendChild(btn);
    });

    updatePaletteState();
  }

  function updatePaletteState() {
    let answered = 0;
    let flagged = 0;

    PLACEMENT_QUESTIONS.forEach((q, idx) => {
      const btn = document.getElementById(`palette-btn-${idx}`);
      if (!btn) return;

      btn.classList.remove('is-current', 'is-answered', 'is-flagged');

      if (idx === currentQuestionIndex) {
        btn.classList.add('is-current');
      }

      if (userAnswers[q.id] !== undefined) {
        btn.classList.add('is-answered');
        answered++;
      }

      if (flaggedQuestions.has(q.id)) {
        btn.classList.add('is-flagged');
        flagged++;
      }
    });

    if (document.getElementById('countAnswered')) document.getElementById('countAnswered').textContent = answered;
    if (document.getElementById('countUnanswered')) document.getElementById('countUnanswered').textContent = PLACEMENT_QUESTIONS.length - answered;
    if (document.getElementById('countFlagged')) document.getElementById('countFlagged').textContent = flagged;
  }

  /* ── Render CBT Question ── */
  function renderCbtQuestion(index) {
    if (index < 0 || index >= PLACEMENT_QUESTIONS.length) return;
    const q = PLACEMENT_QUESTIONS[index];

    if (document.getElementById('cbtSectionTag')) document.getElementById('cbtSectionTag').textContent = q.section;
    if (document.getElementById('cbtQuestionNum')) document.getElementById('cbtQuestionNum').textContent = `Question ${index + 1} of ${PLACEMENT_QUESTIONS.length}`;

    // Update Flag State
    const flagBtn = document.getElementById('flagBtn');
    const flagIcon = document.getElementById('flagIcon');
    const flagText = document.getElementById('flagText');
    if (flagBtn && flagIcon && flagText) {
      if (flaggedQuestions.has(q.id)) {
        flagBtn.classList.add('is-active');
        flagIcon.className = 'fa-solid fa-bookmark me-1';
        flagText.textContent = 'Flagged';
      } else {
        flagBtn.classList.remove('is-active');
        flagIcon.className = 'fa-regular fa-bookmark me-1';
        flagText.textContent = 'Flag for Review';
      }
    }

    // Special Content (Passage or Dialogue)
    const specialContainer = document.getElementById('cbtSpecialContent');
    if (specialContainer) {
      specialContainer.innerHTML = '';

      if (q.specialType === 'reading') {
        const passageDiv = document.createElement('div');
        passageDiv.className = 'cbt-reading-passage';
        passageDiv.innerHTML = q.passage;
        specialContainer.appendChild(passageDiv);
      } else if (q.specialType === 'dialogue') {
        const dialogueDiv = document.createElement('div');
        dialogueDiv.className = 'cbt-dialogue-box';
        q.dialogue.forEach(turn => {
          const turnDiv = document.createElement('div');
          turnDiv.className = 'cbt-dialogue-turn';
          turnDiv.innerHTML = `
            <span class="cbt-speaker-tag">${turn.speaker}:</span>
            <div>${turn.text}</div>
          `;
          dialogueDiv.appendChild(turnDiv);
        });
        specialContainer.appendChild(dialogueDiv);
      }
    }

    // Question Text
    if (document.getElementById('cbtQuestionText')) document.getElementById('cbtQuestionText').textContent = q.q;

    // Render Multiple Choice Options with Button Locking
    const optionsList = document.getElementById('cbtOptionsList');
    if (optionsList) {
      optionsList.innerHTML = '';

      const letters = ['A', 'B', 'C', 'D'];
      q.a.forEach((optText, optIdx) => {
        const isSelected = (userAnswers[q.id] === optIdx);
        const optBtn = document.createElement('div');
        optBtn.className = `cbt-option-item cau-option-btn ${isSelected ? 'is-selected' : ''}`;
        optBtn.setAttribute('role', 'radio');
        optBtn.setAttribute('aria-checked', isSelected ? 'true' : 'false');
        optBtn.tabIndex = 0;

        optBtn.innerHTML = `
          <span class="cau-option-badge">${letters[optIdx]}</span>
          <div style="flex-grow: 1;">
            ${optText}
          </div>
        `;

        optBtn.onclick = () => {
          if (isOptionLocked) return;
          isOptionLocked = true;

          userAnswers[q.id] = optIdx;
          saveActiveState();
          renderCbtQuestion(currentQuestionIndex);
          updatePaletteState();

          setTimeout(() => {
            isOptionLocked = false;
          }, 200);
        };

        optBtn.onkeydown = (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            optBtn.click();
          }
        };

        optionsList.appendChild(optBtn);
      });
    }

    // Previous / Next Button States
    const prevBtn = document.getElementById('prevBtn');
    if (prevBtn) {
      prevBtn.disabled = (index === 0);
      prevBtn.style.opacity = (index === 0) ? '0.4' : '1';
    }

    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
      if (index === PLACEMENT_QUESTIONS.length - 1) {
        nextBtn.innerHTML = `Finish &amp; Review <i class="system-arrow ms-1" aria-hidden="true"></i>`;
        nextBtn.onclick = promptSubmitExam;
      } else {
        nextBtn.innerHTML = `Next <i class="system-arrow ms-1" aria-hidden="true"></i>`;
        nextBtn.onclick = () => navigateQuestion(1);
      }
    }

    updatePaletteState();
  }

  function navigateQuestion(delta) {
    const target = currentQuestionIndex + delta;
    if (target >= 0 && target < PLACEMENT_QUESTIONS.length) {
      currentQuestionIndex = target;
      saveActiveState();
      renderCbtQuestion(target);
    }
  }

  function toggleFlagCurrentQuestion() {
    const q = PLACEMENT_QUESTIONS[currentQuestionIndex];
    if (flaggedQuestions.has(q.id)) {
      flaggedQuestions.delete(q.id);
    } else {
      flaggedQuestions.add(q.id);
    }
    saveActiveState();
    renderCbtQuestion(currentQuestionIndex);
  }

  function promptSubmitExam() {
    const answeredCount = Object.keys(userAnswers).length;
    const unansweredCount = PLACEMENT_QUESTIONS.length - answeredCount;
    let msg = `You have answered ${answeredCount} of 20 questions.`;
    if (unansweredCount > 0) {
      msg += `\n\nYou still have ${unansweredCount} unanswered questions.`;
    }
    msg += `\n\nAre you ready to finish and see your English level results?`;

    if (confirm(msg)) {
      submitFinalExam();
    }
  }

  /* ── Exam Submission & Diagnostic Evaluation ── */
  function submitFinalExam() {
    if (examTimerInterval) clearInterval(examTimerInterval);

    let totalScore = 0;
    const scoresByCategory = {
      part1: 0, // Structure (6 questions * 5 = 30 pts)
      part2: 0, // Vocabulary (6 questions * 5 = 30 pts)
      part3: 0, // Pragmatics (4 questions * 5 = 20 pts)
      part4: 0  // Reading (4 questions * 5 = 20 pts)
    };

    PLACEMENT_QUESTIONS.forEach(q => {
      const selected = userAnswers[q.id];
      if (selected !== undefined && selected === q.c) {
        scoresByCategory[q.category] += 5;
        totalScore += 5;
      }
    });

    if (document.getElementById('certTotalScore')) document.getElementById('certTotalScore').textContent = totalScore;
    if (document.getElementById('scorePart1')) document.getElementById('scorePart1').textContent = `${scoresByCategory.part1} / 30`;
    if (document.getElementById('scorePart2')) document.getElementById('scorePart2').textContent = `${scoresByCategory.part2} / 30`;
    if (document.getElementById('scorePart3')) document.getElementById('scorePart3').textContent = `${scoresByCategory.part3} / 20`;
    if (document.getElementById('scorePart4')) document.getElementById('scorePart4').textContent = `${scoresByCategory.part4} / 20`;

    // Progress Bars
    if (document.getElementById('barPart1')) document.getElementById('barPart1').style.width = `${Math.round((scoresByCategory.part1 / 30) * 100)}%`;
    if (document.getElementById('barPart2')) document.getElementById('barPart2').style.width = `${Math.round((scoresByCategory.part2 / 30) * 100)}%`;
    if (document.getElementById('barPart3')) document.getElementById('barPart3').style.width = `${Math.round((scoresByCategory.part3 / 20) * 100)}%`;
    if (document.getElementById('barPart4')) document.getElementById('barPart4').style.width = `${Math.round((scoresByCategory.part4 / 20) * 100)}%`;

    // CEFR Determination
    let cefrCode = 'A1';
    let cefrTitle = 'CEFR A1 • Beginner';
    let isExempt = false;
    let decisionText = '';
    let recommendation = '';

    const banner = document.getElementById('certResultBanner');
    const badge = document.getElementById('certCefrBadge');

    if (totalScore >= 85) {
      cefrCode = 'C1';
      cefrTitle = 'CEFR C1/C2 • Advanced / Mastery';
      isExempt = true;
      decisionText = 'EXCELLENT ACADEMIC FLUENCY — You demonstrate high-level academic English proficiency. You are well-equipped to comprehend complex lectures, participate in research seminars, and author technical university papers across all faculties (including Medicine & Dentistry).';
      recommendation = 'You are fully prepared for direct English-medium degree coursework. Consider joining academic honor societies or engaging in research assistantships at CAU!';
    } else if (totalScore >= 70) {
      cefrCode = 'B2';
      cefrTitle = 'CEFR B2 • Upper-Intermediate';
      isExempt = true;
      decisionText = 'INDEPENDENT ACADEMIC FLUENCY — You possess strong working proficiency in English. You can comfortably understand university lectures, participate in discussions, and write structured academic essays. Ready for direct degree matriculation in most undergraduate faculties.';
      recommendation = 'You have strong academic readiness. If you are entering Medicine, Dentistry, or Law, you may optionally take an advanced academic writing seminar during your first semester.';
    } else if (totalScore >= 55) {
      cefrCode = 'B1';
      cefrTitle = 'CEFR B1 • Intermediate';
      isExempt = false;
      decisionText = 'THRESHOLD ACADEMIC PROFICIENCY — You have solid everyday communication skills and understand standard campus English. In academic and technical contexts, you would benefit from strengthening formal vocabulary and complex grammar.';
      recommendation = 'We recommend taking 1 semester in our English Preparatory School (Module B1/B2) to gain full fluency and technical writing skills before starting your full faculty coursework.';
    } else if (totalScore >= 40) {
      cefrCode = 'A2';
      cefrTitle = 'CEFR A2 • Elementary Foundation';
      isExempt = false;
      decisionText = 'FOUNDATIONAL ENGLISH PROFICIENCY — You understand basic sentences and campus phrases. To succeed in English-medium degree lectures and exams, a structured foundation program is recommended.';
      recommendation = 'Our 2-semester English Preparatory School Foundation Track will help you build solid grammar, expand your academic vocabulary, and develop fluent presentation skills.';
    } else {
      cefrCode = 'A1';
      cefrTitle = 'CEFR A1 • Beginner';
      isExempt = false;
      decisionText = 'BEGINNER IMMERSION — You are at the beginning of your English learning journey. With dedicated immersion and practice, you will rapidly develop essential communication skills.';
      recommendation = 'Join our intensive English Preparatory Immersion Track with dedicated speaking and listening laboratories in Kyrenia to establish a strong communicative base.';
    }

    if (badge) badge.textContent = cefrTitle;
    if (document.getElementById('certDecisionText')) document.getElementById('certDecisionText').textContent = decisionText;
    if (document.getElementById('recommendationDetails')) {
      document.getElementById('recommendationDetails').textContent = recommendation;
    }

    // Highlight Step in Visual CEFR Scale
    document.querySelectorAll('.cefr-scale-step').forEach(step => step.classList.remove('is-active'));
    const activeScaleStep = document.getElementById(`scale-${cefrCode}`);
    if (activeScaleStep) activeScaleStep.classList.add('is-active');

    if (banner) {
      if (isExempt) {
        banner.classList.add('exempt');
        fireConfetti();
      } else {
        banner.classList.remove('exempt');
      }
    }

    // Timestamp & Session Reference Code
    const today = new Date().toISOString().split('T')[0];
    const randCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const verifCode = `CAU-TEST-2026-${(candidateProfile.id || '2026').slice(-4)}-${randCode}`;

    if (document.getElementById('certTimestamp')) document.getElementById('certTimestamp').textContent = today;
    if (document.getElementById('certVerificationCode')) {
      document.getElementById('certVerificationCode').textContent = verifCode;
    }

    // Connect to English Arena CTA
    const arenaCtaBtn = document.getElementById('arenaCtaBtn');
    const arenaCtaTier = document.getElementById('arenaCtaTier');
    if (arenaCtaBtn) {
      arenaCtaBtn.href = `/english-quest.html?tier=${cefrCode}`;
    }
    if (arenaCtaTier) {
      arenaCtaTier.textContent = cefrCode;
    }

    // Save placement result to localStorage
    const placementResult = {
      score: totalScore,
      maxScore: 100,
      cefrLevel: cefrCode,
      cefrTitle: cefrTitle,
      isExempt: isExempt,
      categoryScores: scoresByCategory,
      candidateName: candidateProfile.name,
      candidateId: candidateProfile.id,
      faculty: candidateProfile.faculty,
      completedAt: new Date().toISOString(),
      formattedDate: today,
      verificationCode: verifCode
    };

    try {
      localStorage.setItem(STORAGE_RESULT_KEY, JSON.stringify(placementResult));
      clearActiveState();
      window.dispatchEvent(new CustomEvent('cau:placement-completed', { detail: placementResult }));

      // Unify with CAU_STATE_V1 (cau_portal_state_v1)
      const portalRaw = localStorage.getItem('cau_portal_state_v1');
      let portalState = portalRaw ? JSON.parse(portalRaw) : null;
      if (!portalState) {
        portalState = {
          studentProfile: { name: '', studentId: '', email: '', faculty: '' },
          clubs: { joinedClubIds: [], applications: [], bookmarkedIds: [] },
          englishArena: { unlocked: false, accessTokenHash: null, cefrLevel: null, xp: 0, level: 1, bestStreak: 0, badges: [], activeSession: null, history: [] }
        };
      }
      portalState.englishArena.cefrLevel = placementResult.cefrLevel;
      if (placementResult.candidateName) portalState.studentProfile.name = placementResult.candidateName;
      if (placementResult.candidateId) portalState.studentProfile.studentId = placementResult.candidateId;
      if (placementResult.faculty) portalState.studentProfile.faculty = placementResult.faculty;
      localStorage.setItem('cau_portal_state_v1', JSON.stringify(portalState));
    } catch (e) {
      console.warn('Could not save placement result to localStorage:', e);
    }

    // Show Result Screen
    showScreen('screen-result');
  }

  function restartPlacementTest() {
    if (confirm('Restarting will clear your current answers and return to the level test overview. Proceed?')) {
      clearActiveState();
      userAnswers = {};
      flaggedQuestions.clear();
      examTimeRemaining = 25 * 60;
      examStartTime = null;
      showScreen('screen-intake');
    }
  }

  /* ── Canvas Confetti Engine for Top Level Celebrations ── */
  function fireConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#002469', '#e63b2e', '#137333', '#b06000', '#121316'];
    for (let i = 0; i < 80; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.3,
        r: Math.random() * 5 + 3,
        d: Math.random() * 90,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 10,
        tiltAngleIncremental: Math.random() * 0.07 + 0.05,
        tiltAngle: 0
      });
    }

    let frames = 0;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 1.5;
        p.x += Math.sin(p.d);
        p.tilt = Math.sin(p.tiltAngle) * 12;

        ctx.beginPath();
        ctx.lineWidth = p.r / 2;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
        ctx.stroke();
      });

      frames++;
      if (frames < 130) {
        requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    draw();
  }

  /* ── Check for In-Progress Test on Page Load ── */
  function initPlacementPage() {
    // Bind buttons
    const startBtn = document.getElementById('startExamBtn');
    if (startBtn) startBtn.addEventListener('click', startExam);

    const flagBtn = document.getElementById('flagBtn');
    if (flagBtn) flagBtn.addEventListener('click', toggleFlagCurrentQuestion);

    const prevBtn = document.getElementById('prevBtn');
    if (prevBtn) prevBtn.addEventListener('click', () => navigateQuestion(-1));

    const restartBtns = document.querySelectorAll('[data-restart-test]');
    restartBtns.forEach(btn => btn.addEventListener('click', restartPlacementTest));

    // Check if there is an active session in progress
    const activeState = getActiveState();
    if (activeState && activeState.examStartTime) {
      const elapsed = Math.floor((Date.now() - activeState.examStartTime) / 1000);
      const remaining = activeState.examTotalDuration - elapsed;

      if (remaining > 30) { // If at least 30 seconds left
        const intakeSection = document.getElementById('screen-intake');
        if (intakeSection) {
          const banner = document.createElement('div');
          banner.id = 'resumePromptBanner';
          banner.className = 'alert alert-warning d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4 p-3 rounded-2 shadow-sm';
          banner.style.borderLeft = '5px solid var(--cau-coral, #f04432)';
          banner.innerHTML = `
            <div>
              <strong><i class="fa-solid fa-clock-rotate-left me-1"></i> Ongoing Assessment Session Found</strong>
              <div class="small text-muted mt-1">You answered ${Object.keys(activeState.userAnswers || {}).length} of 20 questions (${Math.floor(remaining / 60)} minutes remaining).</div>
            </div>
            <div class="d-flex gap-2">
              <button type="button" class="btn btn-sm btn-dark" id="resumeExamBtn">
                Resume Test <i class="fa-solid fa-arrow-right ms-1"></i>
              </button>
              <button type="button" class="btn btn-sm btn-outline-secondary" id="discardExamBtn">
                Start Over
              </button>
            </div>
          `;

          const introWrap = intakeSection.querySelector('.placement-intake-card') || intakeSection.firstElementChild;
          if (introWrap) {
            introWrap.parentNode.insertBefore(banner, introWrap);
          }

          document.getElementById('resumeExamBtn')?.addEventListener('click', () => {
            banner.remove();
            resumeExam();
          });

          document.getElementById('discardExamBtn')?.addEventListener('click', () => {
            clearActiveState();
            banner.remove();
          });
        }
      } else {
        clearActiveState();
      }
    }
  }

  // Export functions to window for legacy inline onclick handlers
  window.startExam = startExam;
  window.resumeExam = resumeExam;
  window.restartPlacementTest = restartPlacementTest;
  window.navigateQuestion = navigateQuestion;
  window.toggleFlagCurrentQuestion = toggleFlagCurrentQuestion;
  window.promptSubmitExam = promptSubmitExam;
  window.submitFinalExam = submitFinalExam;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlacementPage);
  } else {
    initPlacementPage();
  }
})();
