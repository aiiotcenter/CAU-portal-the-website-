/**
 * ==============================================================================
 * CYPRUS AYDIN UNIVERSITY (CAU) — ENGLISH PREP SCHOOL HUB STORE
 * Lightweight Teacher-Student Weekly Portal & Extracurricular Store
 * LocalStorage Key: 'cau_english_hub_v1' (synced with 'cau_portal_state_v1')
 * ==============================================================================
 */

export const ENGLISH_HUB_STORAGE_KEY = 'cau_english_hub_v1';
export const ENGLISH_HUB_EVENT = 'cau:english-hub-changed';

// ── 1. Teachers Dataset (6 EAP Instructors) ──
export const PREP_TEACHERS = [
  {
    id: 'teacher-aleg',
    name: 'Dr. Aleg Losich',
    title: 'IELTS & Placement Coordinator',
    roleTag: 'Placement & EAP Lead',
    office: 'Language Bldg L-204',
    officeHours: 'Mon & Wed 10:00 – 12:00',
    email: 'aleg.losich@cau.edu.tr',
    image: '/assets/brochure/aleg-losich.webp',
    activeQuizId: 'quiz-aleg-w4',
    activeQuizTitle: 'Week 4: Essential Academic Collocations',
    questionCount: 5
  },
  {
    id: 'teacher-fatma',
    name: 'Ms. Fatma Nur Aydın',
    title: 'Speaking & Pronunciation Lead',
    roleTag: 'Oral Fluency & Phonetics',
    office: 'Language Amphitheater A-102',
    officeHours: 'Tue & Thu 14:00 – 16:00',
    email: 'fatma.aydin@cau.edu.tr',
    image: '/assets/brochure/fatma-nur-aydin.webp',
    activeQuizId: 'quiz-fatma-w4',
    activeQuizTitle: 'Week 4: Campus Discourse & Fluency Drills',
    questionCount: 5
  },
  {
    id: 'teacher-frah',
    name: 'Dr. Frah Badawi',
    title: 'Senior EAP Instructor',
    roleTag: 'Academic Research & Syntax',
    office: 'Faculty Tower F-310',
    officeHours: 'Mon & Thu 11:00 – 13:00',
    email: 'frah.badawi@cau.edu.tr',
    image: '/assets/brochure/frah-badawi.webp',
    activeQuizId: 'quiz-frah-w4',
    activeQuizTitle: 'Week 4: Synthesizing Research & Formal Register',
    questionCount: 5
  },
  {
    id: 'teacher-mohamed',
    name: 'Mr. Mohamed Khattab',
    title: 'Grammar & Mechanics Specialist',
    roleTag: 'Grammar Accuracy & CBT',
    office: 'Language Lab B-108',
    officeHours: 'Wed & Fri 13:00 – 15:00',
    email: 'mohamed.khattab@cau.edu.tr',
    image: '/assets/brochure/mohamed-khattab.webp',
    activeQuizId: 'quiz-mohamed-w4',
    activeQuizTitle: 'Week 4: Modal Verbs & Inverted Conditionals',
    questionCount: 5
  },
  {
    id: 'teacher-omar',
    name: 'Mr. Omar Abo Jmei',
    title: 'Listening & Note-Taking Coach',
    roleTag: 'Lecture Audio & Dictation',
    office: 'Multimedia Lab M-201',
    officeHours: 'Tue & Thu 09:30 – 11:30',
    email: 'omar.abojmei@cau.edu.tr',
    image: '/assets/brochure/omar-abo-jmei.webp',
    activeQuizId: 'quiz-omar-w4',
    activeQuizTitle: 'Week 4: Lecture Note-Taking & Key Signals',
    questionCount: 5
  },
  {
    id: 'teacher-setia',
    name: 'Ms. Setia Santoso',
    title: 'Prep Writing & Argumentation Coach',
    roleTag: 'Essay Architecture & Logic',
    office: 'Writing Center W-105',
    officeHours: 'Mon & Wed 14:30 – 16:30',
    email: 'setia.santoso@cau.edu.tr',
    image: '/assets/brochure/setia-santoso.webp',
    activeQuizId: 'quiz-setia-w4',
    activeQuizTitle: 'Week 4: Avoiding Fallacies in Argumentative Essays',
    questionCount: 5
  }
];

// ── 2. Prep School Sports & Activities Dataset ──
export const PREP_SPORTS_TEAMS = [
  {
    id: 'prep-lions',
    sport: 'Football (5-a-Side)',
    name: 'CAU Prep Lions FC',
    icon: 'fa-futbol',
    accentColor: '#e63b2e',
    badge: 'Campus League & Cup',
    schedule: 'Tuesdays & Thursdays 18:00 • West Sports Arena',
    captain: 'Coach Turgay & Captain Tariq (Prep B1)',
    currentMembers: 14,
    maxMembers: 18,
    description: 'Weekly campus league matches and tactical 5-a-side drills. Strengthen physical endurance, foster team camaraderie, and speak practical English on the pitch.'
  },
  {
    id: 'prep-hoops',
    sport: 'Basketball (3x3)',
    name: 'Prep Hoops Squad',
    icon: 'fa-basketball',
    accentColor: '#d4af37',
    badge: '3x3 Half-Court',
    schedule: 'Thursdays 17:30 • Campus Outdoor Courts',
    captain: 'Captain Marko (Prep B2)',
    currentMembers: 9,
    maxMembers: 12,
    description: 'Fast-break half-court tournaments with music, quick English tactical calls, and friendly pickup games with international students.'
  },
  {
    id: 'prep-aces',
    sport: 'Volleyball (Mixed)',
    name: 'Prep Aces Volleyball',
    icon: 'fa-volleyball',
    accentColor: '#002469',
    badge: 'Co-ed Recreation',
    schedule: 'Wednesdays 16:30 • Main Gymnasium',
    captain: 'Coach Leyla & Elena (Prep A2)',
    currentMembers: 12,
    maxMembers: 16,
    description: 'Co-ed recreational volleyball, spike and serve clinics, and semester beach volleyball outings along the scenic Kyrenia coastline.'
  },
  {
    id: 'prep-chess-tt',
    sport: 'Table Tennis & Chess',
    name: 'Table Tennis & Chess Blitz',
    icon: 'fa-chess',
    accentColor: '#059669',
    badge: 'Social & Strategy',
    schedule: 'Fridays 15:00 • Student Activity Lounge',
    captain: 'Kenan (Prep B1)',
    currentMembers: 18,
    maxMembers: 24,
    description: 'Rapid 3-minute ping pong rallies paired with 5-minute speed chess and informal conversational English practice.'
  },
  {
    id: 'prep-debate',
    sport: 'Model UN & Debate',
    name: 'Global Debate & Speaking Team',
    icon: 'fa-comments',
    accentColor: '#7c3aed',
    badge: 'Competitive Rhetoric',
    schedule: 'Fridays 16:00 • Language Amphitheater',
    captain: 'Dr. Aleg Losich & Yasir (Prep C1)',
    currentMembers: 22,
    maxMembers: 30,
    description: 'Parliamentary debates, Model United Nations simulations, and persuasive oratory coaching in partnership with the CAU Debate Society.'
  }
];

// ── 3. Teacher Weekly Quizzes Dataset (Ready-to-Play 5 Qs Each) ──
export const INITIAL_WEEKLY_QUIZZES = [
  {
    id: 'quiz-aleg-w4',
    teacherId: 'teacher-aleg',
    teacherName: 'Dr. Aleg Losich',
    week: 4,
    title: 'Essential Academic Collocations & Formality',
    durationMinutes: 3,
    questions: [
      {
        q: 'The faculty committee decided to _____ a thorough inquiry into student feedback.',
        options: ['conduct', 'make', 'do', 'performate'],
        answer: 0,
        tip: '“Conduct an inquiry” is the formal academic collocation; “make” or “do” are too colloquial.'
      },
      {
        q: 'Which verb best collocates with the noun “hypothesis” in scientific papers?',
        options: ['formulate', 'invent', 'build up', 'write out'],
        answer: 0,
        tip: 'Researchers “formulate” or “test” a hypothesis in formal scholarly prose.'
      },
      {
        q: 'Recent archaeological findings _____ light on medieval Mediterranean trade routes.',
        options: ['shed', 'drop', 'shine', 'glow'],
        answer: 0,
        tip: 'The standard academic idiom is to “shed light on” a topic.'
      },
      {
        q: 'The university policy strictly _____ academic dishonesty and plagiarism.',
        options: ['prohibits', 'refuses', 'cancels', 'denies'],
        answer: 0,
        tip: 'Formal university regulations “prohibit” or “forbid” misconduct.'
      },
      {
        q: 'Students are encouraged to draw _____ scholarly literature to support their claims.',
        options: ['upon', 'out', 'across', 'under'],
        answer: 0,
        tip: 'The formal phrasal verb “draw upon” means to utilize or consult source material.'
      }
    ]
  },
  {
    id: 'quiz-fatma-w4',
    teacherId: 'teacher-fatma',
    teacherName: 'Ms. Fatma Nur Aydın',
    week: 4,
    title: 'Campus Discourse & Polite Clarifications',
    durationMinutes: 3,
    questions: [
      {
        q: 'When asking a lecturer to clarify a slide in class, which sentence sounds most polite?',
        options: [
          'Could you please elaborate on that last point, Professor?',
          'What did you say on that slide? Repeat it.',
          'Explain that formula again, I didn’t get it.',
          'You went too fast, go back.'
        ],
        answer: 0,
        tip: 'Using modal polite inquiry (“Could you please elaborate...”) reflects proper university etiquette.'
      },
      {
        q: 'You need to reschedule your academic advising meeting. How should you start your email?',
        options: [
          'Dear Dr. Losich, I am writing to ask if it might be possible to reschedule...',
          'Hey Dr. Aleg, cancel our meeting today.',
          'Yo professor, let’s meet tomorrow instead.',
          'I won’t come today. Reschedule me.'
        ],
        answer: 0,
        tip: 'Formal salutation + conditional framing (“if it might be possible...”) is preferred in English academia.'
      },
      {
        q: 'What is the most natural way to politely disagree during a seminar debate?',
        options: [
          'I see your perspective, however empirical evidence suggests another outcome.',
          'You are completely wrong about this topic.',
          'Your idea makes no sense at all.',
          'That point is absurd.'
        ],
        answer: 0,
        tip: 'Acknowledge the peer’s perspective first, then introduce your counter-evidence with “however”.'
      },
      {
        q: 'In the student registrar office, you need a transcript. Which phrase is appropriate?',
        options: [
          'May I please request an official academic transcript for my scholarship application?',
          'Give me my transcript quickly.',
          'I want paper proof of my grades right now.',
          'Print out my transcript immediately.'
        ],
        answer: 0,
        tip: '“May I please request...” is polite and respectful to university administrative staff.'
      },
      {
        q: 'During a group project meeting, you want to summarize agreed tasks. What is best?',
        options: [
          'To ensure we are all aligned, let’s quickly recap each member’s action items.',
          'Stop talking, listen to what I decided.',
          'Everyone do whatever they feel like doing.',
          'I don’t care who does what.'
        ],
        answer: 0,
        tip: '“Let’s quickly recap...” demonstrates proactive and collaborative leadership.'
      }
    ]
  },
  {
    id: 'quiz-mohamed-w4',
    teacherId: 'teacher-mohamed',
    teacherName: 'Mr. Mohamed Khattab',
    week: 4,
    title: 'Modal Verbs & Inverted Conditionals',
    durationMinutes: 3,
    questions: [
      {
        q: 'Had the international students registered early, they _____ prime dormitory rooms.',
        options: ['would have secured', 'will secure', 'secured', 'had secure'],
        answer: 0,
        tip: 'Inverted third conditional (“Had + Subject + Participle”) requires “would have + Participle” in the result clause.'
      },
      {
        q: 'Under no circumstances _____ candidates look at mobile devices during the exam.',
        options: ['may', 'they should', 'they can', 'are allowed they'],
        answer: 0,
        tip: 'Negative introductory phrases (“Under no circumstances”) require subject-auxiliary inversion: “may candidates”.'
      },
      {
        q: 'The lab equipment _____ inspected by certified technicians before every trial.',
        options: ['must be', 'must to be', 'ought be', 'have to being'],
        answer: 0,
        tip: 'Modal passive structure is “must + be + past participle”.'
      },
      {
        q: 'Were the provost _____ the budget, the language labs would receive 50 new workstations.',
        options: ['to approve', 'approves', 'approved', 'will approve'],
        answer: 0,
        tip: 'Inverted second conditional: “Were + Subject + to-infinitive”.'
      },
      {
        q: 'Applicants for the 50% international scholarship _____ submit transcripts by Friday.',
        options: ['are required to', 'are require to', 'requiring of', 'must to'],
        answer: 0,
        tip: '“Be required to + bare infinitive” denotes formal institutional requirements.'
      }
    ]
  },
  {
    id: 'quiz-frah-w4',
    teacherId: 'teacher-frah',
    teacherName: 'Dr. Frah Badawi',
    week: 4,
    title: 'Synthesizing Sources & Academic Register',
    durationMinutes: 3,
    questions: [
      {
        q: 'Which reporting verb indicates the cited author presented empirical data rather than an opinion?',
        options: ['demonstrates', 'claims', 'guesses', 'feels'],
        answer: 0,
        tip: '“Demonstrates” carries empirical weight; “claims” or “feels” denote subjective argumentation.'
      },
      {
        q: 'Which transition signals a contrasting evaluation between two cited scholars?',
        options: ['Conversely', 'Furthermore', 'Moreover', 'Similarly'],
        answer: 0,
        tip: '“Conversely” introduces an opposing or contrasting academic argument.'
      },
      {
        q: 'Select the sentence with appropriate academic hedging (cautious language):',
        options: [
          'The preliminary results tend to indicate a correlation between attendance and GPA.',
          'Attendance always causes 100% of students to get higher GPAs.',
          'It is an undeniable undisputed truth that attendance is everything.',
          'Everyone knows that attendance makes you smart.'
        ],
        answer: 0,
        tip: 'Academic writing avoids absolute claims and utilizes hedging verbs like “tends to indicate”.'
      },
      {
        q: 'When integrating a direct quote in APA format, which element is mandatory?',
        options: ['Author surname, year of publication, and page number', 'Only the website title', 'Just the author’s first name', 'No citation if under 10 words'],
        answer: 0,
        tip: 'Direct quotations require Author, Year, and specific Page/Paragraph reference.'
      },
      {
        q: 'What is the primary function of a literature review in an academic paper?',
        options: [
          'To establish the current state of knowledge and identify gaps in research',
          'To tell entertaining personal stories about the scientists',
          'To fill word count without citing any peer-reviewed papers',
          'To list random definitions from an internet dictionary'
        ],
        answer: 0,
        tip: 'A literature review surveys scholarship to situate the researcher’s original contribution.'
      }
    ]
  }
];

// ── 4. Initial Default Hub State ──
const defaultHubState = {
  studentAuth: {
    isLoggedIn: false,
    fullName: '',
    studentId: '',
    email: '',
    prepGroup: 'B1-Morning',
    assignedTeacherId: 'teacher-aleg',
    joinedTeams: ['prep-lions'],
    placementTestResult: null,
    weeklyGrades: [
      {
        quizId: 'quiz-aleg-w3',
        quizTitle: 'Week 3: Academic Signposting & Transitions',
        teacherName: 'Dr. Aleg Losich',
        week: 3,
        score: 5,
        maxScore: 5,
        percentage: 100,
        completedAt: '2026-10-10',
        status: 'Distinction'
      }
    ]
  },
  teachers: PREP_TEACHERS,
  sportsTeams: PREP_SPORTS_TEAMS,
  weeklyQuizzes: INITIAL_WEEKLY_QUIZZES
};

// ── 5. Helper Storage Functions ──
function loadHubState() {
  if (typeof window === 'undefined') return defaultHubState;
  try {
    const raw = localStorage.getItem(ENGLISH_HUB_STORAGE_KEY);
    if (!raw) {
      saveHubState(defaultHubState);
      return defaultHubState;
    }
    const parsed = JSON.parse(raw);

    // Sync with placement test result if exists in legacy or portal store
    const placementRaw = localStorage.getItem('cau_placement_result');
    if (placementRaw && !parsed.studentAuth.placementTestResult) {
      try {
        const p = JSON.parse(placementRaw);
        parsed.studentAuth.placementTestResult = {
          cefrLevel: p.cefrLevel || 'B1',
          totalScore: p.totalScore || 70,
          date: p.formattedDate || '2026-10-12',
          verificationCode: p.verificationCode || 'CAU-TEST-2026'
        };
      } catch {}
    }

    return {
      ...defaultHubState,
      ...parsed,
      studentAuth: {
        ...defaultHubState.studentAuth,
        ...(parsed.studentAuth || {})
      },
      teachers: parsed.teachers && parsed.teachers.length ? parsed.teachers : PREP_TEACHERS,
      sportsTeams: parsed.sportsTeams && parsed.sportsTeams.length ? parsed.sportsTeams : PREP_SPORTS_TEAMS,
      weeklyQuizzes: parsed.weeklyQuizzes && parsed.weeklyQuizzes.length ? parsed.weeklyQuizzes : INITIAL_WEEKLY_QUIZZES
    };
  } catch (err) {
    console.warn('Failed to parse english hub store, resetting to default:', err);
    return defaultHubState;
  }
}

function saveHubState(state) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ENGLISH_HUB_STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(ENGLISH_HUB_EVENT, { detail: state }));
  } catch (err) {
    console.error('Error saving english hub state:', err);
  }
}

// ── 6. Exported Hub Store Object & Methods ──
export const englishHubStore = {
  get() {
    return loadHubState();
  },

  // Student Auth & Registration
  signInStudent(profileData) {
    const state = loadHubState();
    state.studentAuth = {
      ...state.studentAuth,
      isLoggedIn: true,
      fullName: profileData.fullName || state.studentAuth.fullName || 'Student',
      studentId: profileData.studentId || state.studentAuth.studentId || '20260101',
      email: profileData.email || state.studentAuth.email || '',
      prepGroup: profileData.prepGroup || state.studentAuth.prepGroup || 'B1-Morning',
      assignedTeacherId: profileData.assignedTeacherId || state.studentAuth.assignedTeacherId || 'teacher-aleg'
    };
    saveHubState(state);
    return state.studentAuth;
  },

  signOutStudent() {
    const state = loadHubState();
    state.studentAuth.isLoggedIn = false;
    saveHubState(state);
  },

  // Sports & Club Teams Toggle
  toggleTeamRoster(teamId) {
    const state = loadHubState();
    const joined = state.studentAuth.joinedTeams || [];
    const team = state.sportsTeams.find(t => t.id === teamId);
    
    if (joined.includes(teamId)) {
      state.studentAuth.joinedTeams = joined.filter(id => id !== teamId);
      if (team && team.currentMembers > 0) team.currentMembers--;
    } else {
      state.studentAuth.joinedTeams.push(teamId);
      if (team) team.currentMembers++;
    }
    saveHubState(state);
    return state.studentAuth.joinedTeams.includes(teamId);
  },

  isTeamJoined(teamId) {
    const state = loadHubState();
    return (state.studentAuth.joinedTeams || []).includes(teamId);
  },

  // Record Quiz Result in Student Gradebook
  recordQuizGrade({ quizId, quizTitle, teacherName, week, score, maxScore }) {
    const state = loadHubState();
    const pct = Math.round((score / maxScore) * 100);
    const status = pct >= 80 ? 'Distinction' : (pct >= 60 ? 'Passed' : 'Needs Review');
    
    const newRecord = {
      quizId,
      quizTitle,
      teacherName,
      week: week || 4,
      score,
      maxScore,
      percentage: pct,
      completedAt: new Date().toISOString().split('T')[0],
      status
    };

    // Remove old attempt if exists for this quiz, then prepend new one
    state.studentAuth.weeklyGrades = [
      newRecord,
      ...state.studentAuth.weeklyGrades.filter(g => g.quizId !== quizId)
    ];

    saveHubState(state);
    return newRecord;
  },

  // Teacher Mode: Create and publish a new weekly quiz
  createWeeklyQuiz({ teacherId, quizTitle, week, questions }) {
    const state = loadHubState();
    const teacher = state.teachers.find(t => t.id === teacherId);
    const quizId = `quiz-${teacherId}-${Date.now()}`;
    
    const newQuiz = {
      id: quizId,
      teacherId,
      teacherName: teacher ? teacher.name : 'CAU Prep Faculty',
      week: parseInt(week, 10) || 5,
      title: quizTitle,
      durationMinutes: 3,
      questions
    };

    state.weeklyQuizzes.unshift(newQuiz);
    
    // Update teacher active quiz reference
    if (teacher) {
      teacher.activeQuizId = quizId;
      teacher.activeQuizTitle = quizTitle;
    }

    saveHubState(state);
    return newQuiz;
  },

  subscribe(callback) {
    const handler = (e) => callback(e.detail);
    window.addEventListener(ENGLISH_HUB_EVENT, handler);
    return () => window.removeEventListener(ENGLISH_HUB_EVENT, handler);
  }
};

// Global attachment for convenience
if (typeof window !== 'undefined') {
  window.englishHubStore = englishHubStore;
}
