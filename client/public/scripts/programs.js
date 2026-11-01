/* CAU Academic Programmes Discovery & Filter Engine
   Swiss Editorial Design System • Live Search • Faceted Filtering • Sorting
   Cyprus Aydın University (CAU) • Kyrenia, TRNC */

(() => {
  const state = {
    degree: 'all',
    department: 'all',
    language: 'all',
    duration: 'all',
    query: '',
    sort: 'recommended',
    view: 'grid',
    visible: 9,
  };

  const list = document.querySelector('#programList');
  const empty = document.querySelector('#emptyResults') || document.querySelector('#emptyState');
  const count = document.querySelector('#resultCount');
  const showMore = document.querySelector('#showMorePrograms');
  const activeSummary = document.querySelector('#activeFilterSummary');
  const activeFiltersBar = document.querySelector('#activeFiltersBar');
  const activeFiltersList = document.querySelector('#activeFiltersList');
  const clearAllBtn = document.querySelector('#clearAllFiltersBtn');
  const searchInput = document.querySelector('#programSearchInput');
  const searchClearBtn = document.querySelector('#searchClearBtn');
  const searchForm = document.querySelector('#programSearchForm');
  const sortSelect = document.querySelector('#sortSelect');
  const degreeTabs = document.querySelector('#degreeTabs');
  const viewToggles = document.querySelectorAll('.view-toggle');

  if (!list) return;

  const normalize = (value) => String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
  const escapeHtml = (value) => String(value || '').replace(/[&<>'"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));

  // Curated editorial images mapped by academic field
  const editorialImages = [
    { src: '/assets/untitled2-13-24f9b4bd8b_652e8d35.jpg', alt: 'Engineering and computing laboratory' },
    { src: '/assets/untitled2-14-def7ddf464_580c9d6d.jpg', alt: 'Health sciences and clinical practice' },
    { src: '/assets/untitled2-12-b26e7632db_5e13efc2.jpg', alt: 'Law and jurisprudence studies' },
    { src: '/assets/untitled2-9-ee2a180aac_80c7b714.png', alt: 'Business, finance and social sciences' },
    { src: '/assets/untitled2-11-88f245d7e3_5c234f69.jpg', alt: 'Tourism, hospitality and culinary arts' },
    { src: '/assets/untitled2-15-857094fecf_79e0b7ec.jpg', alt: 'Graduate research and postgraduate studies' },
    { src: '/assets/cau-campus-gate_e8b028bc.jpg', alt: 'Cyprus Aydin University Kyrenia campus' },
  ];

  const imageFor = (program) => {
    const dept = normalize(program.Department);
    const name = normalize(program['Program Name']);
    if (dept.includes('health') || /nursing|physiotherapy|dentistry|opticianry|emergency|hemsirelik|fizyoterapi/.test(name)) return editorialImages[1];
    if (dept.includes('engineering') || dept.includes('architecture') || /computer|software|electrical|mechatronics|information security|civil|ai|artificial/.test(name)) return editorialImages[0];
    if (dept.includes('law') || /law|hukuk/.test(name)) return editorialImages[2];
    if (dept.includes('tourism') || dept.includes('applied') || /tourism|hospitality|gastronomy|aviation|guidance/.test(name)) return editorialImages[4];
    if (dept.includes('business') || dept.includes('humanities') || /business|banking|finance|relations|psychology/.test(name)) return editorialImages[3];
    if (/master|ph\.d\.|doctoral/.test(normalize(program['Degree Level']))) return editorialImages[5];
    return editorialImages[6];
  };

  // Curated descriptions replacing scraper artifacts or 404 text
  const cleanDescription = (program) => {
    if (program.summary) return program.summary;
    const name = normalize(program['Program Name']);
    const dept = normalize(program.Department);
    const deg = normalize(program['Degree Level']);

    if (name.includes('ai') || name.includes('artificial')) return 'Equipping students with cutting-edge artificial intelligence, neural networks, machine learning algorithms, deep learning models, and autonomous intelligent systems engineering.';
    if (name.includes('software')) return 'Master modern software architecture, cloud platforms, full-stack engineering, algorithms, and agile methodologies designed for high-impact international tech careers.';
    if (name.includes('computer engineering')) return 'Bridging hardware architectures and intelligent computing systems, preparing graduates for AI engineering, cyber defense, and network infrastructure.';
    if (name.includes('information security')) return 'Defend critical digital ecosystems with deep training in cryptographic protocols, ethical hacking, network forensics, and cybersecurity compliance.';
    if (name.includes('mechatronics')) return 'Integrate mechanical precision, electrical engineering, robotics, and embedded computing for advanced automated systems and smart manufacturing.';
    if (name.includes('electrical')) return 'Study renewable power grids, microelectronics, telecommunications, and automated signal processing under international engineering standards.';
    if (name.includes('civil')) return 'Design sustainable urban infrastructure, structural systems, and geotechnical projects with modern seismic and BIM computing tools.';
    if (name.includes('architecture')) return 'Explore spatial design, sustainable urban planning, architectural technology, and studio design philosophies rooted in Mediterranean heritage.';
    if (name.includes('interior')) return 'Craft human-centric interior environments, sustainable materials, adaptive reuse, and environmental lighting across commercial and residential spaces.';
    if (name.includes('dentistry')) return 'A 5-year premier clinical curriculum in state-of-the-art simulation phantom heads and clinical suites, training internationally competent dental practitioners.';
    if (name.includes('nursing')) return 'Evidence-based patient care, advanced clinical simulation, maternal and critical health training accredited by international healthcare councils.';
    if (name.includes('physiotherapy')) return 'Rehabilitation science, musculoskeletal recovery, clinical biomechanics, and specialized therapeutic techniques in dedicated wellness laboratories.';
    if (name.includes('psychology')) return 'Scientific study of human cognition, developmental behavior, psychometrics, and clinical foundations preparing for healthcare and corporate roles.';
    if (name.includes('business')) return 'Global strategic leadership, corporate finance, digital marketing, and entrepreneurial innovation for modern multinational enterprises.';
    if (name.includes('international relations')) return 'Geopolitics, international diplomacy, regional security, peace negotiations, and European Union affairs in a strategic Eastern Mediterranean hub.';
    if (name.includes('banking') || name.includes('finance')) return 'FinTech innovations, investment portfolios, risk modeling, international banking regulations, and monetary policy analysis.';
    if (name.includes('law')) return 'Comprehensive jurisprudence education covering public, civil, commercial, criminal, and international maritime and comparative legal frameworks.';
    if (name.includes('tourism') || name.includes('hospitality')) return 'Executive resort management, global destination marketing, sustainable eco-tourism, and luxury guest service logistics.';
    if (name.includes('gastronomy')) return 'Artisan culinary arts, Mediterranean and global gastronomy, kitchen leadership, nutrition, and food & beverage entrepreneurship.';
    if (name.includes('preparatory')) return 'Intensive academic English language preparation focusing on academic writing, research presentation, listening comprehension, and university readiness.';
    if (deg.includes('master')) return 'Advanced postgraduate specialisation pairing coursework with a master’s research thesis under distinguished faculty supervisors.';
    if (deg.includes('ph.d.')) return 'Rigorous doctoral scholarship, dissertation defense, and academic contributions to original scientific and applied research.';
    if (deg.includes('associate')) return 'Hands-on practical 2-year vocational diploma providing immediate workforce entry and seamless vertical transfer pathways into bachelor degrees.';

    return 'Experience a rigorous, practice-led curriculum designed to equip you with critical thinking, research proficiency, and career-ready international competence.';
  };

  // ECTS Credits mapping
  const getEcts = (program) => {
    const deg = normalize(program['Degree Level']);
    const dur = normalize(program.Duration);
    if (deg.includes('bachelor')) {
      if (dur.includes('5')) return '300 ECTS';
      return '240 ECTS';
    }
    if (deg.includes('master')) return '120 ECTS';
    if (deg.includes('ph.d.')) return '240 ECTS';
    if (deg.includes('associate')) return '120 ECTS';
    if (deg.includes('preparatory')) return '60 ECTS';
    return '240 ECTS';
  };

  // Localization helpers for programs catalog
  const getLang = () => window.CAU_LANG || localStorage.getItem('cau-language') || 'en';

  const i18nPrograms = {
    degrees: {
      'Bachelor': { en: 'Bachelor', ar: 'البكالوريوس', ru: 'Бакалавриат', fr: 'Licence', fa: 'کارشناسی' },
      'Master': { en: 'Master', ar: 'الماجستير', ru: 'Магистратура', fr: 'Master', fa: 'کارشناسی ارشد' },
      'Ph.D.': { en: 'Ph.D.', ar: 'الدكتوراه', ru: 'Докторантура', fr: 'Doctorat', fa: 'دکتری' },
      'Associate': { en: 'Associate', ar: 'الدبلوم', ru: 'Диплом', fr: 'Diplôme', fa: 'کاردانی' },
      'Preparatory': { en: 'Preparatory', ar: 'السنة التحضيرية', ru: 'Подготовительный курс', fr: 'Préparatoire', fa: 'پیش‌دانشگاهی' }
    },
    faculties: {
      'Faculty of Dentistry': { en: 'Faculty of Dentistry', ar: 'كلية طب الأسنان', ru: 'Факультет стоматологии', fr: 'Faculté de médecine dentaire', fa: 'دانشکده دندانپزشکی' },
      'Faculty of Engineering and Architecture': { en: 'Faculty of Engineering and Architecture', ar: 'كلية الهندسة والعمارة', ru: 'Факультет инженерии и архитектуры', fr: "Faculté d'ingénierie et d'architecture", fa: 'دانشکده مهندسی و معماری' },
      'Faculty of Health Sciences': { en: 'Faculty of Health Sciences', ar: 'كلية العلوم الصحية', ru: 'Факультет медицинских наук', fr: 'Faculté des sciences de la santé', fa: 'دانشکده علوم بهداشت' },
      'Faculty of Humanities and Social Sciences': { en: 'Faculty of Humanities and Social Sciences', ar: 'كلية العلوم الإنسانية والاجتماعية', ru: 'Факультет гуманитарных и социальных наук', fr: 'Faculté des sciences humaines et sociales', fa: 'دانشکده علوم انسانی و اجتماعی' },
      'Faculty of Law': { en: 'Faculty of Law', ar: 'كلية الحقوق', ru: 'Юридический факультет', fr: 'Faculté de droit', fa: 'دانشکده حقوق' },
      'Faculty of Tourism and Applied Sciences': { en: 'Faculty of Tourism and Applied Sciences', ar: 'كلية السياحة والعلوم التطبيقية', ru: 'Факультет туризма и прикладных наук', fr: 'Faculté de tourisme et sciences appliquées', fa: 'دانشکده گردشگری و علوم کاربردی' },
      'Vocational School of Health Services': { en: 'Vocational School of Health Services', ar: 'المعهد المهني للخدمات الصحية', ru: 'Профессиональная школа медицинских услуг', fr: 'École professionnelle des services de santé', fa: 'مدرسه عالی خدمات بهداشتی' },
      'Vocational School': { en: 'Vocational School', ar: 'المعهد المهني', ru: 'Профессиональная школа', fr: 'École professionnelle', fa: 'مدرسه عالی فنی و حرفه‌ای' },
      'English Preparatory School': { en: 'English Preparatory School', ar: 'مدرسة اللغة الإنجليزية التحضيرية', ru: 'Подготовительная школа английского языка', fr: "École préparatoire d'anglais", fa: 'مدرسه پیش‌دانشگاهی زبان انگلیسی' }
    },
    durations: {
      '4 Years': { en: '4 Years', ar: '4 سنوات', ru: '4 года', fr: '4 ans', fa: '۴ سال' },
      '2 Years': { en: '2 Years', ar: 'سنتان', ru: '2 года', fr: '2 ans', fa: '۲ سال' },
      '5 Years': { en: '5 Years', ar: '5 سنوات', ru: '5 лет', fr: '5 ans', fa: '۵ سال' },
      '1 Year': { en: '1 Year', ar: 'سنة واحدة', ru: '1 год', fr: '1 an', fa: '۱ سال' }
    },
    buttons: {
      explore: { en: 'Explore Programme', ar: 'استكشف البرنامج', ru: 'Подробнее о программе', fr: 'Explorer le programme', fa: 'بررسی برنامه' },
      askAi: { en: 'Ask AI', ar: 'اسأل الذكاء الاصطناعي', ru: 'Спросить ИИ', fr: "Demander à l'IA", fa: 'پرسش از هوش مصنوعی' }
    }
  };

  const translateDegree = (d) => i18nPrograms.degrees[d]?.[getLang()] || d;
  const translateFaculty = (f) => i18nPrograms.faculties[f]?.[getLang()] || f;
  const translateDuration = (dur) => i18nPrograms.durations[dur]?.[getLang()] || dur;

  // Language display
  const getLanguageDisplay = (program) => {
    const l = normalize(program.Language);
    const lang = getLang();
    if (l.includes('turkish') || l.includes('türkçe')) {
      const label = lang === 'ar' ? 'التركية' : lang === 'fa' ? 'ترکی' : lang === 'ru' ? 'Турецкий' : lang === 'fr' ? 'Turc' : 'Turkish';
      return `🇹🇷 ${label}`;
    }
    const label = lang === 'ar' ? 'الإنجليزية (100%)' : lang === 'fa' ? 'انگلیسی (۱۰۰٪)' : lang === 'ru' ? 'Английский (100%)' : lang === 'fr' ? 'Anglais (100%)' : '100% English';
    return `🇬🇧 ${label}`;
  };

  // Tuition formatting (Official Handbook: Tuition in USD $)
  const getTuitionInfo = (program) => {
    const deg = normalize(program['Degree Level']);
    const name = normalize(program['Program Name']);
    const lang = getLang();

    if (name.includes('dentistry')) {
      return {
        amount: lang === 'ar' ? '$22,000 / سنوياً' : lang === 'fa' ? '$22,000 / سالانه' : lang === 'ru' ? '$22,000 / год' : lang === 'fr' ? '$22,000 / an' : '$22,000 / yr',
        subtext: lang === 'ar' ? 'السنوات 1–3 ($36,500 للسنوات 4–5)' : 'Years 1–3 CAU ($36,500 yrs 4–5 IAU)',
        scholarship: lang === 'ar' ? 'منح 50%–80% متاحة' : lang === 'fa' ? 'بورسیه ۵۰٪ تا ۸۰٪ موجود است' : lang === 'ru' ? 'Стипендии 50%–80%' : lang === 'fr' ? 'Bourses de 50%–80% disponibles' : '50%–80% Merit Scholarships'
      };
    }
    if (deg.includes('master')) {
      return {
        amount: lang === 'ar' ? '$7,000 إجمالي' : lang === 'fa' ? '$7,000 کل دوره' : lang === 'ru' ? '$7,000 всего' : lang === 'fr' ? '$7,000 au total' : '$7,000 total',
        subtext: 'Complete 2-year master’s ($7,600 total incl. fees)',
        scholarship: lang === 'ar' ? 'منح تفوق 50%–80%' : lang === 'fa' ? 'بورسیه شایستگی ۵۰٪ تا ۸۰٪' : lang === 'ru' ? 'Скидки 50%–80% за успехи' : lang === 'fr' ? 'Bourses de mérite 50%–80%' : '50%–80% Merit Scholarships'
      };
    }
    if (deg.includes('ph.d.')) {
      return {
        amount: lang === 'ar' ? '$12,000 إجمالي' : lang === 'fa' ? '$12,000 کل دوره' : lang === 'ru' ? '$12,000 всего' : lang === 'fr' ? '$12,000 au total' : '$12,000 total',
        subtext: 'Complete 4-year doctorate ($12,600 total incl. fees)',
        scholarship: lang === 'ar' ? 'منح بحثية 25%–50%' : lang === 'fa' ? 'گرنت پژوهشی ۲۵٪ تا ۵۰٪' : lang === 'ru' ? 'Гранты 25%–50%' : lang === 'fr' ? 'Bourses de recherche 25%–50%' : '25%–50% Research Scholarships'
      };
    }
    return {
      amount: lang === 'ar' ? '$10,000 / سنوياً' : lang === 'fa' ? '$10,000 / سالانه' : lang === 'ru' ? '$10,000 / год' : lang === 'fr' ? '$10,000 / an' : '$10,000 / yr',
      subtext: 'Net: $5,000 to $0 + $600 fees',
      scholarship: lang === 'ar' ? 'منح تصل 50%–100%' : lang === 'fa' ? 'بورسیه ۵۰٪ تا ۱۰۰٪' : lang === 'ru' ? 'Стипендии 50%–100%' : lang === 'fr' ? 'Bourses de 50%–100%' : '50%–100% Merit Scholarships'
    };
  };

  // Synonym & keyword aliases for smart matching
  const SYNONYMS = {
    'software': ['software', 'programming', 'developer', 'coding', 'it', 'web', 'app', 'yazılım', 'yazilim', 'الهندسة البرمجية', 'هندسة البرمجيات'],
    'computer': ['computer', 'hardware', 'networks', 'bilgisayar', 'cyber', 'security', 'tech', 'هندسة الحاسوب'],
    'ai': ['software', 'computer', 'artificial intelligence', 'data', 'mechatronics', 'machine learning', 'الذكاء الاصطناعي'],
    'doctor': ['dentistry', 'dentist', 'dental', 'nursing', 'physiotherapy', 'health', 'medical', 'medicine', 'طب الأسنان', 'طب'],
    'dentistry': ['dentist', 'dental', 'teeth', 'diş', 'hekimliği', 'orthodontics', 'طب الأسنان', 'طب اسنان'],
    'opticianry': ['opticianry', 'optometry', 'optisyenlik', 'البصريات', 'بصريات'],
    'nurse': ['nursing', 'nurse', 'hemşirelik', 'health', 'care', 'midwifery', 'التمريض'],
    'lawyer': ['law', 'legal', 'justice', 'hukuk', 'international law', 'attorney', 'القانون', 'الحقوق'],
    'architect': ['architecture', 'interior architecture', 'mimarlık', 'design', 'building', 'العمارة'],
    'hotel': ['tourism', 'hospitality', 'hotel management', 'travel', 'turizm', 'aviation', 'السياحة'],
    'chef': ['gastronomy', 'culinary', 'food', 'cooking', 'mutfak', 'aşçılık', 'فنون الطهي'],
    'business': ['business administration', 'management', 'marketing', 'işletme', 'mba', 'commerce', 'إدارة الأعمال'],
    'finance': ['banking', 'finance', 'accounting', 'economics', 'bankacılık', 'العلوم المالية والمصرفية'],
    'psychology': ['psychology', 'counseling', 'guidance', 'psikoloji', 'mental health', 'clinical', 'علم النفس'],
    'english': ['english', 'ingilizce', 'preparatory', 'prep', 'اللغة الإنجليزية'],
  };

  let programs = [];

  // Parse Initial URL Query Params
  const initFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('degree')) state.degree = params.get('degree') || 'all';
    if (params.has('department')) state.department = params.get('department') || 'all';
    if (params.has('faculty')) state.department = params.get('faculty') || 'all';
    if (params.has('q')) state.query = params.get('q') || '';
    if (params.has('interest')) state.query = params.get('interest') || '';
    if (params.has('sort')) state.sort = params.get('sort') || 'recommended';
    if (params.has('view')) state.view = params.get('view') || 'grid';

    if (state.query && searchInput) {
      searchInput.value = state.query;
      if (searchClearBtn) searchClearBtn.hidden = false;
    }
    if (sortSelect && state.sort) sortSelect.value = state.sort;
  };

  // Sync State to URL
  const syncToUrl = () => {
    const params = new URLSearchParams();
    if (state.degree !== 'all') params.set('degree', state.degree);
    if (state.department !== 'all') params.set('department', state.department);
    if (state.query) params.set('q', state.query);
    if (state.sort !== 'recommended') params.set('sort', state.sort);
    if (state.view !== 'grid') params.set('view', state.view);

    const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
    window.history.replaceState({}, '', newUrl);
  };

  // Search Matcher
  const matchesQuery = (program, query) => {
    if (!query) return true;
    const q = normalize(query);
    const searchable = normalize([
      program['Program Name'],
      program.Department,
      program['Degree Level'],
      program.Language,
      program.Duration,
      program.category,
      program.slug,
    ].join(' '));

    if (searchable.includes(q)) return true;

    // Check synonyms
    for (const [key, terms] of Object.entries(SYNONYMS)) {
      if (q.includes(key) || key.includes(q)) {
        if (terms.some(t => searchable.includes(t))) return true;
      }
    }

    // Multi-word matching
    const words = q.split(/\s+/).filter(w => w.length > 2);
    if (words.length > 1 && words.every(w => searchable.includes(w))) return true;

    return false;
  };

  // Filtered and Sorted Array
  const getFilteredPrograms = () => {
    return programs.filter((p) => {
      // Degree Level
      if (state.degree !== 'all') {
        const deg = normalize(p['Degree Level']);
        const target = normalize(state.degree);
        if (target === 'bachelor' && !deg.includes('bachelor')) return false;
        if (target === 'master' && !deg.includes('master')) return false;
        if (target === 'ph.d.' && !deg.includes('ph.d.') && !deg.includes('doctoral')) return false;
        if (target === 'associate' && !deg.includes('associate')) return false;
        if (target === 'preparatory' && !deg.includes('preparatory')) return false;
      }

      // Department / Faculty
      if (state.department !== 'all') {
        if (normalize(p.Department) !== normalize(state.department)) return false;
      }

      // Language
      if (state.language !== 'all') {
        const lang = normalize(p.Language);
        if (state.language === 'English' && (lang.includes('turkish') || lang.includes('türkçe'))) return false;
        if (state.language === 'Turkish' && !lang.includes('turkish') && !lang.includes('türkçe')) return false;
      }

      // Duration
      if (state.duration !== 'all') {
        if (!normalize(p.Duration).includes(normalize(state.duration))) return false;
      }

      // Text Query
      if (!matchesQuery(p, state.query)) return false;

      return true;
    }).sort((a, b) => {
      if (state.sort === 'name-asc') return a['Program Name'].localeCompare(b['Program Name']);
      if (state.sort === 'name-desc') return b['Program Name'].localeCompare(a['Program Name']);
      if (state.sort === 'duration-asc') return parseInt(a.Duration || '4') - parseInt(b.Duration || '4');
      if (state.sort === 'duration-desc') return parseInt(b.Duration || '4') - parseInt(a.Duration || '4');

      // 'recommended' sort priority
      const getPriority = (p) => {
        // Prioritize newly added or updated programs from CMS
        if (p.updatedAt) {
          const diffDays = (Date.now() - new Date(p.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
          if (diffDays < 30) return 0;
        }
        const n = normalize(p['Program Name']);
        if (n.includes('ai') || n.includes('artificial')) return 1;
        if (n.includes('software')) return 2;
        if (n.includes('computer')) return 3;
        if (n.includes('dentistry')) return 4;
        if (n.includes('nursing')) return 5;
        if (n.includes('architecture')) return 6;
        if (n.includes('law')) return 7;
        if (n.includes('business')) return 8;
        if (n.includes('psychology')) return 9;
        if (n.includes('tourism')) return 10;
        return 50;
      };
      return getPriority(a) - getPriority(b);
    });
  };

  // Update Dynamic Counts on Degree Tabs & Filter Rail Options
  const updateCounts = () => {
    // Degree tab badges
    const allCount = programs.length;
    const bCount = programs.filter(p => normalize(p['Degree Level']).includes('bachelor')).length;
    const mCount = programs.filter(p => normalize(p['Degree Level']).includes('master')).length;
    const pCount = programs.filter(p => normalize(p['Degree Level']).includes('ph.d.') || normalize(p['Degree Level']).includes('doctoral')).length;
    const aCount = programs.filter(p => normalize(p['Degree Level']).includes('associate')).length;
    const prCount = programs.filter(p => normalize(p['Degree Level']).includes('preparatory')).length;

    const setBadge = (id, val) => { const el = document.querySelector(id); if (el) el.textContent = val; };
    setBadge('#tabCountAll', allCount);
    setBadge('#tabCountBachelor', bCount);
    setBadge('#tabCountMaster', mCount);
    setBadge('#tabCountPhD', pCount);
    setBadge('#tabCountAssociate', aCount);
    setBadge('#tabCountPrep', prCount);

    // Degree tabs active highlight
    document.querySelectorAll('.degree-tab').forEach((tab) => {
      const active = normalize(tab.dataset.degree) === normalize(state.degree);
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });

    // Update filter rail option counts
    document.querySelectorAll('.filter-option[data-filter-key]').forEach((btn) => {
      const key = btn.dataset.filterKey;
      const val = btn.dataset.filterValue;

      // Count matching programs with other filters held
      const matchCount = programs.filter((p) => {
        if (key === 'degree') return normalize(p['Degree Level']) === normalize(val);
        if (key === 'department') return normalize(p.Department) === normalize(val);
        if (key === 'language') {
          const l = normalize(p.Language);
          if (val === 'English') return !l.includes('turkish');
          return l.includes('turkish');
        }
        if (key === 'duration') return normalize(p.Duration).includes(normalize(val));
        return true;
      }).length;

      const countEl = btn.querySelector('.filter-option-count');
      if (countEl) countEl.textContent = matchCount;

      const isSelected = normalize(state[key]) === normalize(val);
      btn.classList.toggle('active', isSelected);
      btn.classList.toggle('is-active', isSelected);
      btn.setAttribute('aria-pressed', String(isSelected));
      btn.setAttribute('aria-selected', String(isSelected));
    });

    // Current filter labels in accordion header and reset button visibility
    const hasActiveFilter = state.degree !== 'all' || state.department !== 'all' || state.language !== 'all' || state.duration !== 'all' || !!state.query;
    const resetBtn = document.querySelector('#resetFilters');
    if (resetBtn) resetBtn.hidden = !hasActiveFilter;

    document.querySelectorAll('[data-current]').forEach((el) => {
      const k = el.dataset.current;
      if (state[k] && state[k] !== 'all') {
        el.textContent = state[k];
        el.hidden = false;
      } else {
        el.textContent = '';
        el.hidden = true;
      }
    });
  };

  // Render Active Filter Chips Bar
  const renderActiveFilters = () => {
    if (!activeFiltersBar || !activeFiltersList) return;

    const activeList = [];
    if (state.degree !== 'all') activeList.push({ label: `Degree: ${state.degree}`, key: 'degree' });
    if (state.department !== 'all') activeList.push({ label: `Faculty: ${state.department}`, key: 'department' });
    if (state.language !== 'all') activeList.push({ label: `Language: ${state.language}`, key: 'language' });
    if (state.duration !== 'all') activeList.push({ label: `Duration: ${state.duration}`, key: 'duration' });
    if (state.query) activeList.push({ label: `Search: "${state.query}"`, key: 'query' });

    if (activeList.length === 0) {
      if (activeFiltersBar) activeFiltersBar.hidden = true;
      if (activeFiltersList) activeFiltersList.innerHTML = '';
      return;
    }

    if (activeFiltersBar) activeFiltersBar.hidden = false;
    activeFiltersList.innerHTML = activeList.map(item => `
      <span class="active-filter-pill">
        <span>${escapeHtml(item.label)}</span>
        <button type="button" class="active-filter-remove" data-remove-key="${item.key}" aria-label="Remove filter ${escapeHtml(item.label)}">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </span>
    `).join('');
  };

  // Build Card HTML
  const buildCard = (program, index) => {
    const img = imageFor(program);
    const slug = program.slug || program['Program Name'].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const tuition = getTuitionInfo(program);
    const ects = getEcts(program);
    const lang = getLanguageDisplay(program);
    const desc = cleanDescription(program);
    const link = `/programs/${encodeURIComponent(slug)}.html`;
    const curLang = getLang();
    const exploreText = i18nPrograms.buttons.explore[curLang] || 'Explore Programme';
    const askAiText = i18nPrograms.buttons.askAi[curLang] || 'Ask AI';

    return `
<article class="program-card">
  <div class="program-card-visual">
    <img src="${img.src}" alt="${escapeHtml(img.alt)}" loading="lazy" />
    <span class="program-card-degree-badge">${escapeHtml(translateDegree(program['Degree Level']))}</span>
  </div>

  <div class="program-card-body">
    <p class="program-card-faculty">${escapeHtml(translateFaculty(program.Department))}</p>
    <h3 class="program-card-title">
      <a href="${link}">${escapeHtml(program['Program Name'])}</a>
    </h3>
    <p class="program-card-desc">${escapeHtml(desc)}</p>

    <div class="program-card-tags">
      <span class="program-tag"><i class="fa-solid fa-earth-americas"></i> ${lang}</span>
      <span class="program-tag"><i class="fa-solid fa-clock"></i> ${escapeHtml(translateDuration(program.Duration || '4 Years'))}</span>
      <span class="program-tag"><i class="fa-solid fa-graduation-cap"></i> ${ects}</span>
    </div>

    <div class="program-card-tuition-box">
      <span class="tuition-amount">${tuition.amount}</span>
      <span class="scholarship-badge">${tuition.scholarship}</span>
    </div>
  </div>


  <div class="program-card-footer">
    <a href="${link}" class="program-explore-link">
      <span>${exploreText}</span>
      <i class="system-arrow" aria-hidden="true"></i>
    </a>
    <button type="button" class="ask-ai-card-btn" data-program="${escapeHtml(program['Program Name'])}" title="Ask AI about this programme" aria-label="Ask AI about this programme">
      <svg class="ai-sparkle-icon" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z"/>
      </svg>
      <span>${askAiText}</span>
    </button>
  </div>
</article>
`;
  };

  // Main Render Routine
  const render = () => {
    const filtered = getFilteredPrograms();
    const visiblePrograms = filtered.slice(0, state.visible);
    const curLang = getLang();

    list.className = `program-list view-${state.view}`;
    list.innerHTML = visiblePrograms.map((p, idx) => buildCard(p, idx)).join('');

    if (count) count.textContent = filtered.length;
    if (empty) empty.hidden = filtered.length !== 0;
    if (showMore) {
      showMore.hidden = filtered.length <= state.visible;
      // Localize showMore button text
      const showMoreText = curLang === 'ar' ? 'عرض المزيد من البرامج' : curLang === 'fa' ? 'نمایش برنامه‌های بیشتر' : curLang === 'ru' ? 'Показать больше программ' : curLang === 'fr' ? 'Afficher plus de programmes' : 'Show More Programmes';
      const showMoreBtnTextSpan = showMore.querySelector('span:not(.spinner-border)');
      if (showMoreBtnTextSpan) showMoreBtnTextSpan.textContent = showMoreText;
    }

    // Sync view toggles active state
    document.querySelectorAll('.view-toggle').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.view === state.view);
    });

    if (activeSummary) {
      if (filtered.length === programs.length) {
        if (curLang === 'ar') activeSummary.textContent = `جميع البرامج الأكاديمية البالغ عددها ${programs.length}`;
        else if (curLang === 'fa') activeSummary.textContent = `تمام ${programs.length} برنامه آموزشی کاتالوگ`;
        else if (curLang === 'ru') activeSummary.textContent = `Все ${programs.length} программ каталога`;
        else if (curLang === 'fr') activeSummary.textContent = `Tous les ${programs.length} programmes du catalogue`;
        else activeSummary.textContent = `All ${programs.length} catalogue programmes`;
      } else {
        if (curLang === 'ar') activeSummary.textContent = `النتائج المصفاة (${filtered.length} من أصل ${programs.length})`;
        else if (curLang === 'fa') activeSummary.textContent = `نتایج فیلترشده (${filtered.length} از ${programs.length})`;
        else if (curLang === 'ru') activeSummary.textContent = `Отфильтрованные результаты (${filtered.length} из ${programs.length})`;
        else if (curLang === 'fr') activeSummary.textContent = `Résultats filtrés (${filtered.length} sur ${programs.length})`;
        else activeSummary.textContent = `Filtered results (${filtered.length} of ${programs.length})`;
      }
    }

    renderActiveFilters();
    updateCounts();
    syncToUrl();
  };

  // Build Filter Options from catalog data
  const buildFilterOptions = () => {
    // Degree Options
    const degreeOpts = ['Bachelor', 'Master', 'Ph.D.', 'Associate', 'Preparatory'];
    const degreeContainer = document.querySelector('#degree-options');
    if (degreeContainer) {
      degreeContainer.innerHTML = degreeOpts.map(d => `
        <button class="filter-option" type="button" data-filter-key="degree" data-filter-value="${d}" aria-pressed="false">
          <span>${translateDegree(d)}</span>
          <span class="filter-option-count">0</span>
        </button>
      `).join('');
    }

    // Department / Faculty Options
    const depts = [...new Set(programs.map(p => p.Department).filter(Boolean))].sort();
    const deptContainer = document.querySelector('#department-options');
    if (deptContainer) {
      deptContainer.innerHTML = depts.map(dep => `
        <button class="filter-option" type="button" data-filter-key="department" data-filter-value="${escapeHtml(dep)}" aria-pressed="false">
          <span>${escapeHtml(translateFaculty(dep))}</span>
          <span class="filter-option-count">0</span>
        </button>
      `).join('');
    }

    // Language Options
    const curLang = getLang();
    const englishOptLabel = curLang === 'ar' ? 'الإنجليزية (100%)' : curLang === 'fa' ? 'انگلیسی (۱۰۰٪)' : curLang === 'ru' ? 'Английский (100%)' : curLang === 'fr' ? 'Anglais (100%)' : 'English (100%)';
    const turkishOptLabel = curLang === 'ar' ? 'التركية' : curLang === 'fa' ? 'ترکی' : curLang === 'ru' ? 'Турецкий' : curLang === 'fr' ? 'Turc' : 'Turkish';
    const langContainer = document.querySelector('#language-options');
    if (langContainer) {
      langContainer.innerHTML = `
        <button class="filter-option" type="button" data-filter-key="language" data-filter-value="English" aria-pressed="false">
          <span>${englishOptLabel}</span>
          <span class="filter-option-count">0</span>
        </button>
        <button class="filter-option" type="button" data-filter-key="language" data-filter-value="Turkish" aria-pressed="false">
          <span>${turkishOptLabel}</span>
          <span class="filter-option-count">0</span>
        </button>
      `;
    }

    // Duration Options
    const durContainer = document.querySelector('#duration-options');
    if (durContainer) {
      durContainer.innerHTML = `
        <button class="filter-option" type="button" data-filter-key="duration" data-filter-value="4 Years" aria-pressed="false">
          <span>${translateDuration('4 Years')}</span>
          <span class="filter-option-count">0</span>
        </button>
        <button class="filter-option" type="button" data-filter-key="duration" data-filter-value="2 Years" aria-pressed="false">
          <span>${translateDuration('2 Years')}</span>
          <span class="filter-option-count">0</span>
        </button>
        <button class="filter-option" type="button" data-filter-key="duration" data-filter-value="5 Years" aria-pressed="false">
          <span>${translateDuration('5 Years')}</span>
          <span class="filter-option-count">0</span>
        </button>
        <button class="filter-option" type="button" data-filter-key="duration" data-filter-value="1 Year" aria-pressed="false">
          <span>${translateDuration('1 Year')}</span>
          <span class="filter-option-count">0</span>
        </button>
      `;
    }
  };

  window.CAU_REFRESH_PROGRAM_FILTERS = () => {
    buildFilterOptions();
    render();
  };

  // Wire Event Listeners
  const wireEvents = () => {
    // Degree Horizontal Tabs
    degreeTabs?.addEventListener('click', (e) => {
      const tab = e.target.closest('.degree-tab');
      if (!tab) return;
      state.degree = tab.dataset.degree || 'all';
      state.visible = 9;
      render();
    });

    // Search Input Real-Time Debounced Filtering
    let searchDebounceTimer;
    searchInput?.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (searchClearBtn) searchClearBtn.hidden = !val;
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => {
        state.query = val;
        state.visible = 9;
        render();
      }, 150);
    });

    searchForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      state.query = (searchInput?.value || '').trim();
      state.visible = 9;
      render();
    });

    searchClearBtn?.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (searchClearBtn) searchClearBtn.hidden = true;
      state.query = '';
      state.visible = 9;
      searchInput?.focus();
      render();
    });


    // View Mode Toggles (Grid Size / Layout with Blur Crossfade — Reference: agency view switcher engine)
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.view-toggle');
      if (!btn) return;
      const targetView = btn.dataset.view || 'grid';
      if (state.view === targetView) return;

      state.view = targetView;
      if (list) {
        list.classList.add('is-switching-view');
        setTimeout(() => {
          render();
          requestAnimationFrame(() => {
            list.classList.remove('is-switching-view');
          });
        }, 140);
      } else {
        render();
      }
    });

    // Card-level Smart AI Chips and "Ask AI" Buttons
    document.addEventListener('click', (e) => {
      const chip = e.target.closest('.program-card-ai-chip');
      if (chip) {
        const progName = chip.dataset.program || '';
        const topic = chip.dataset.topic || 'general';
        let prompt = '';
        if (topic === 'careers') {
          prompt = `What career paths, typical job roles, and industries are available for ${progName} graduates from Cyprus Aydin University?`;
        } else if (topic === 'tuition') {
          prompt = `What is the net tuition fee and scholarship opportunities (50% to 100%) for the ${progName} programme at CAU?`;
        } else if (topic === 'difficulty') {
          prompt = `How difficult are the courses in ${progName}, and what prerequisites or skills are needed?`;
        } else {
          prompt = `Tell me about the ${progName} programme at CAU.`;
        }

        if (typeof window.CAU_OPEN_AI_CHAT === 'function') {
          window.CAU_OPEN_AI_CHAT(prompt, 'course_explainer', progName);
        } else {
          const chatToggle = document.querySelector('.cau-chat-toggle');
          const chatInput = document.querySelector('.cau-chat-input');
          const chatForm = document.querySelector('.cau-chat-foot');
          if (chatToggle && !document.querySelector('.cau-chat-panel.open')) {
            chatToggle.click();
          }
          setTimeout(() => {
            if (chatInput) {
              chatInput.value = prompt;
              chatForm?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
              chatInput.focus();
            }
          }, 300);
        }
        return;
      }

      const aiBtn = e.target.closest('.ask-ai-card-btn');
      if (aiBtn) {
        const progName = aiBtn.dataset.program || '';
        const prompt = `Tell me about the ${progName} programme at CAU (tuition fees, scholarships, duration, language, and admission requirements).`;

        if (typeof window.CAU_OPEN_AI_CHAT === 'function') {
          window.CAU_OPEN_AI_CHAT(prompt, 'course_explainer', progName);
        } else {
          const chatToggle = document.querySelector('.cau-chat-toggle');
          const chatInput = document.querySelector('.cau-chat-input');
          const chatForm = document.querySelector('.cau-chat-foot');
          if (chatToggle && !document.querySelector('.cau-chat-panel.open')) {
            chatToggle.click();
          }
          setTimeout(() => {
            if (chatInput) {
              chatInput.value = prompt;
              chatForm?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
              chatInput.focus();
            }
          }, 300);
        }
      }
    });

    // Show More Pagination
    showMore?.addEventListener('click', () => {
      state.visible += 9;
      render();
    });

    // Reset Buttons
    const resetAll = () => {
      state.degree = 'all';
      state.department = 'all';
      state.language = 'all';
      state.duration = 'all';
      state.query = '';
      state.sort = 'recommended';
      state.visible = 9;
      if (searchInput) searchInput.value = '';
      if (searchClearBtn) searchClearBtn.hidden = true;
      if (sortSelect) sortSelect.value = 'recommended';
      render();
    };

    document.querySelector('#resetFilters')?.addEventListener('click', resetAll);
    document.querySelector('#clearAllFiltersBtn')?.addEventListener('click', resetAll);
    document.querySelector('#emptyResetBtn')?.addEventListener('click', resetAll);

    // Remove single active filter
    activeFiltersBar?.addEventListener('click', (e) => {
      const btn = e.target.closest('.active-filter-remove');
      if (!btn) return;
      const key = btn.dataset.removeKey;
      if (key === 'query') {
        state.query = '';
        if (searchInput) searchInput.value = '';
        if (searchClearBtn) searchClearBtn.hidden = true;
      } else if (state[key]) {
        state[key] = 'all';
      }
      state.visible = 9;
      render();
    });

    // Accordion Toggle Headers in Filter Rail
    document.querySelectorAll('[data-filter-toggle]').forEach((toggle) => {
      toggle.addEventListener('click', () => {
        const id = toggle.dataset.filterToggle;
        const options = document.querySelector(`#${id}-options`);
        if (!options) return;
        const isOpen = options.classList.contains('open');
        options.classList.toggle('open', !isOpen);
        toggle.classList.toggle('open', !isOpen);
        toggle.setAttribute('aria-expanded', String(!isOpen));
      });
    });

    // Filter Rail Option Clicks
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-option[data-filter-key]');
      if (!btn) return;
      const key = btn.dataset.filterKey;
      const val = btn.dataset.filterValue;

      state[key] = normalize(state[key]) === normalize(val) ? 'all' : val;
      state.visible = 9;
      render();
    });

    // Empty state "Ask AI" button
    document.querySelector('#emptyAskAiBtn')?.addEventListener('click', () => {
      const chatToggle = document.querySelector('.cau-chat-toggle');
      const chatInput = document.querySelector('.cau-chat-input');
      if (chatToggle) {
        if (!document.querySelector('.cau-chat-panel.open')) chatToggle.click();
        setTimeout(() => {
          if (chatInput) {
            chatInput.value = state.query ? `Do you have programmes related to "${state.query}"?` : 'What programmes does CAU offer?';
            chatInput.focus();
          }
        }, 300);
      }
    });
  };

  // Preload and Initialize with cache-busting
  const init = async () => {
    try {
      const res = await fetch(`/program-catalog.json?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        programs = await res.json();
        window.CAU_PROGRAM_CATALOG = programs;
      }
    } catch (err) {
      console.error('[Programs] Failed to fetch fresh catalog, checking fallback:', err);
      if (Array.isArray(window.CAU_PROGRAM_CATALOG) && window.CAU_PROGRAM_CATALOG.length) {
        programs = window.CAU_PROGRAM_CATALOG;
      }
    }

    if (!programs.length) {
      if (empty) {
        empty.hidden = false;
        const h3 = empty.querySelector('h3');
        if (h3) h3.textContent = 'Catalogue temporarily unavailable';
      }
      return;
    }

    initFromUrl();
    buildFilterOptions();
    const modeCountEl = document.querySelector('#modeCatalogueCount');
    if (modeCountEl) modeCountEl.textContent = programs.length;
    wireEvents();
    render();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
