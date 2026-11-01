/**
 * CAU AI Education Consultant & Academic Advisory Console
 * Cyprus Aydın University (CAU) • Kyrenia, TRNC
 * 
 * Comprehensive 6-Stage Educational Decision-Support Architecture:
 * Discover → Understand → Compare → Explain → Guide → Connect to Admissions
 */

(() => {
  // Master Academic Taxonomy (Mapped to CAU Faculties & Departments)
  const PASSIONS = [
    {
      id: 'software',
      icon: 'fa-laptop-code',
      title: 'Software & Computing',
      desc: 'Full-stack engineering, algorithms, AI applications, cloud infrastructure.',
      keywords: ['software', 'computer', 'artificial', 'intelligence', 'ai', 'information security', 'yazilim', 'bilgisayar']
    },
    {
      id: 'dentistry',
      icon: 'fa-tooth',
      title: 'Dentistry & Oral Health',
      desc: '5-year clinical doctoral degree with high-tech phantom simulation suites.',
      keywords: ['dentistry', 'dental', 'dis hekimligi']
    },
    {
      id: 'health',
      icon: 'fa-user-doctor',
      title: 'Healthcare & Nursing',
      desc: 'Patient care, physiotherapy rehabilitation, clinical emergency response.',
      keywords: ['nursing', 'physiotherapy', 'health', 'emergency', 'fizyoterapi', 'hemsirelik']
    },
    {
      id: 'business',
      icon: 'fa-chart-line',
      title: 'Business & Management',
      desc: 'International finance, organizational leadership, marketing and enterprise.',
      keywords: ['business', 'finance', 'banking', 'management', 'isletme', 'fintech']
    },
    {
      id: 'law',
      icon: 'fa-scale-balanced',
      title: 'International Law',
      desc: 'Comparative legal systems, international arbitration, human rights, EU law.',
      keywords: ['law', 'hukuk', 'jurisprudence', 'legal']
    },
    {
      id: 'architecture',
      icon: 'fa-compass-drafting',
      title: 'Architecture & Design',
      desc: 'Mediterranean spatial design, sustainable urban planning, interior architecture.',
      keywords: ['architecture', 'interior', 'mimarlik', 'urban', 'tasarim']
    },
    {
      id: 'engineering',
      icon: 'fa-gears',
      title: 'Robotics & Engineering',
      desc: 'Mechatronics automation, civil seismic structures, electrical smart grids.',
      keywords: ['mechatronics', 'civil', 'electrical', 'engineering', 'muhendislik']
    },
    {
      id: 'aviation',
      icon: 'fa-plane-departure',
      title: 'Civil Aviation',
      desc: 'Cabin crew operations, airport logistics, international flight safety.',
      keywords: ['aviation', 'cabin', 'havacilik', 'flight']
    },
    {
      id: 'psychology',
      icon: 'fa-brain',
      title: 'Psychology & Behavior',
      desc: 'Cognitive science, developmental counseling, clinical behavioral foundations.',
      keywords: ['psychology', 'psikoloji', 'behavior', 'counseling']
    },
    {
      id: 'gastronomy',
      icon: 'fa-utensils',
      title: 'Gastronomy & Tourism',
      desc: 'Culinary arts, Mediterranean food science, luxury hotel management.',
      keywords: ['gastronomy', 'tourism', 'hospitality', 'culinary', 'gastronomi', 'turizm']
    },
    {
      id: 'diplomacy',
      icon: 'fa-earth-europe',
      title: 'International Relations',
      desc: 'Global diplomacy, Mediterranean geopolitics, foreign policy analysis.',
      keywords: ['international relations', 'diplomacy', 'uluslararasi iliskiler', 'politics']
    },
    {
      id: 'education',
      icon: 'fa-book-open-reader',
      title: 'English Language Teaching',
      desc: 'Applied linguistics, ESL pedagogy, bilingual curriculum development.',
      keywords: ['teaching', 'english', 'preparatory', 'education', 'ogretmenlik']
    }
  ];

  // Deep Knowledge Repository for CAU Programmes (Grounding for Comparison, Careers & Curriculum)
  const PROGRAM_KNOWLEDGE = {
    'Software Engineering': {
      focus: 'Software Systems, Cloud Architecture & Full-Stack Development',
      programming: 'High',
      mathematics: 'High',
      design: 'Medium',
      business: 'Low',
      duration: '4 years',
      enjoy: ['Hands-on Programming', 'Algorithmic Problem Solving', 'Building Real-World Apps'],
      considerations: [
        'Substantial mathematics and algorithmic problem solving coursework',
        'Requires continuous programming lab practice outside lecture hours',
        'Rapidly evolving technical frameworks and version control requirements'
      ],
      careerPaths: [
        'Full-Stack Web & Mobile Developer',
        'Cloud Solutions & DevOps Engineer',
        'Software Systems Architect',
        'AI / Machine Learning Engineer',
        'Cybersecurity & Quality Assurance Specialist'
      ],
      skills: ['TypeScript / Python', 'Data Structures & Algorithms', 'Cloud & Docker / Kubernetes', 'Database Design', 'Software Architecture', 'REST & GraphQL APIs'],
      curriculum: {
        foundation: ['Calculus for Engineers I & II', 'Introduction to Computer Science & Python', 'Discrete Computational Mathematics', 'Physics for Engineers'],
        core: ['Data Structures & Algorithms', 'Object-Oriented Programming (Java/C++)', 'Relational Database Management Systems', 'Operating Systems & Networks', 'Software Engineering Principles'],
        advanced: ['Cloud Computing & Microservices', 'Mobile & Web Application Frameworks', 'Artificial Intelligence & Machine Learning', 'Software Quality & Testing', 'Senior Capstone Design Project']
      }
    },
    'Computer Engineering': {
      focus: 'Hardware Systems, Embedded Electronics & Computing Networks',
      programming: 'High',
      mathematics: 'High',
      design: 'Low',
      business: 'Low',
      duration: '4 years',
      enjoy: ['Microcontrollers & Hardware', 'Low-Level System Coding', 'Robotics Interfacing'],
      considerations: [
        'Rigorous electrical engineering physics and calculus prerequisites',
        'Hardware laboratory sessions with physical breadboards and oscilloscopes',
        'High technical density combining both circuit design and compiler theory'
      ],
      careerPaths: [
        'Embedded Systems & Firmware Engineer',
        'Hardware Architecture Specialist',
        'Robotics & IoT Developer',
        'Network Infrastructure Engineer',
        'Systems Integration Lead'
      ],
      skills: ['C / C++ / Assembly', 'Digital Logic Design', 'FPGA & Microcontrollers', 'Operating System Kernels', 'Network Protocols', 'Hardware-Software Interfacing'],
      curriculum: {
        foundation: ['Calculus I & II', 'Physics: Electricity & Magnetism', 'Electric Circuits Analysis', 'Introduction to Computing in C'],
        core: ['Digital Logic Design', 'Computer Architecture & Organization', 'Microprocessors & Microcontrollers', 'Signals and Systems', 'Operating Systems Fundamentals'],
        advanced: ['Embedded Systems Design', 'VLSI & Chip Layout', 'Computer Networks & Security', 'Real-Time Embedded Programming', 'Senior Engineering Capstone']
      }
    },
    'Management Information Systems': {
      focus: 'Business Strategy, IT Project Management & Data Analytics',
      programming: 'Medium',
      mathematics: 'Medium',
      design: 'Medium',
      business: 'High',
      duration: '4 years',
      enjoy: ['Bridging Tech with Business', 'Business Intelligence & Data', 'Agile IT Leadership'],
      considerations: [
        'Balances both coding labs and corporate finance/accounting lectures',
        'Requires strong presentation, case study analysis, and team negotiation skills',
        'Focuses on corporate system deployment rather than low-level code mechanics'
      ],
      careerPaths: [
        'IT Business Analyst',
        'Data & Business Intelligence Analyst',
        'Technology Product Manager',
        'Enterprise ERP Consultant (SAP/Salesforce)',
        'Digital Transformation Lead'
      ],
      skills: ['Business Process Modeling', 'SQL & Data Warehousing', 'Python for Business Analytics', 'Agile & Scrum Management', 'ERP Systems', 'IT Governance & Strategy'],
      curriculum: {
        foundation: ['Introduction to Business Administration', 'Business Mathematics & Statistics', 'Fundamentals of Information Systems', 'Principles of Economics'],
        core: ['Database Management for Business', 'Systems Analysis & Design', 'E-Commerce & Digital Business', 'Corporate Financial Management', 'Business Analytics & Data Mining'],
        advanced: ['Enterprise Resource Planning (ERP)', 'Information Security & Privacy Law', 'Agile IT Project Management', 'Strategic Decision Support Systems', 'Graduation Consulting Project']
      }
    },
    'Dentistry': {
      focus: 'Clinical Oral Surgery, Prosthodontics & Medical Diagnostics',
      programming: 'None',
      mathematics: 'Low',
      design: 'High',
      business: 'Medium',
      duration: '5 years',
      enjoy: ['Direct Patient Care', 'Micro-Spatial Manual Dexterity', 'Clinical Healthcare Precision'],
      considerations: [
        '5-year demanding European-accredited doctoral medical curriculum',
        'High manual dexterity and spatial fine-motor coordination in phantom labs',
        'Mandatory patient clinical rotations in Kyrenia university healthcare facilities'
      ],
      careerPaths: [
        'Licensed General Dental Surgeon',
        'Orthodontist Specialist',
        'Oral & Maxillofacial Surgeon',
        'Pedodontist (Pediatric Dentist)',
        'Private Dental Clinic Founder / Medical Director'
      ],
      skills: ['Clinical Oral Diagnosis', 'Fine Motor Precision', 'Dental Radiology & Imaging', 'Phantom Simulator Restorations', 'Periodontics & Endodontics', 'Patient Empathy & Care'],
      curriculum: {
        foundation: ['Medical Biology & Genetics', 'Basic Medical Anatomy & Histology', 'Biochemistry for Dental Sciences', 'Dental Anatomy & Morphology'],
        core: ['Phantom Head Simulation Lab I & II', 'Pathology & Pharmacology', 'Endodontics & Restorative Dentistry', 'Periodontology & Oral Diseases', 'Dental Radiology & Radiation Safety'],
        advanced: ['Oral & Maxillofacial Surgery Clinicals', 'Prosthetic Dentistry Clinical Practice', 'Orthodontic Diagnosis & Treatment', 'Pediatric Dental Care Rotations', 'Graduation Clinical Comprehensive Defense']
      }
    },
    'Nursing': {
      focus: 'Clinical Patient Care, Critical Care Nursing & Healthcare Ethics',
      programming: 'None',
      mathematics: 'Low',
      design: 'Low',
      business: 'Low',
      duration: '4 years',
      enjoy: ['Helping & Caring for Patients', 'Hospital Team Rotations', 'High-Impact Clinical Skills'],
      considerations: [
        'Includes demanding hospital clinical shifts and patient bedside care',
        'Requires strong emotional resilience, compassion, and urgent decision-making',
        'Extensive pharmacology, anatomy, and human pathology coursework'
      ],
      careerPaths: [
        'Registered Hospital Nurse (RN)',
        'Intensive Care (ICU) / Emergency Nurse',
        'Surgical Theater Nurse',
        'Community & Public Health Coordinator',
        'Nurse Educator & Clinical Supervisor'
      ],
      skills: ['Patient Vitals & Medication Admin', 'Clinical Assessment', 'Emergency & Critical Care', 'Infection Control', 'Electronic Health Records', 'Patient Advocacy'],
      curriculum: {
        foundation: ['Human Anatomy & Physiology', 'Biochemistry & Microbiology', 'Fundamentals of Nursing Practice', 'Professional Nursing Ethics'],
        core: ['Internal Medicine Nursing', 'Surgical Diseases Nursing', 'Pharmacology in Nursing', 'Women\'s Health & Obstetric Nursing', 'Pediatric Patient Care'],
        advanced: ['Psychiatric & Mental Health Nursing', 'Community Health Nursing', 'Disaster & Emergency Triage', 'Nursing Leadership & Hospital Management', 'Clinical Internship Practicum']
      }
    },
    'Architecture': {
      focus: 'Spatial Design, Mediterranean Urban Sustainability & BIM Modeling',
      programming: 'Low',
      mathematics: 'Medium',
      design: 'High',
      business: 'Medium',
      duration: '4 years',
      enjoy: ['Creative Studio Drafting', 'Physical & 3D Architectural Modeling', 'Urban Design & Ergonomics'],
      considerations: [
        'Intensive architectural studio culture with frequent jury critiques and deadlines',
        'Requires mastering digital CAD, Revit BIM, and 3D visualization rendering software',
        'Balances creative artistic vision with structural physics and municipal codes'
      ],
      careerPaths: [
        'Licensed Project Architect',
        'Urban Designer & City Planner',
        'BIM & Computational Design Specialist',
        'Sustainable Green Building Consultant',
        'Architectural Studio Director'
      ],
      skills: ['Architectural Drawing & Sketching', 'AutoCAD / Revit / Rhino BIM', 'Sustainable Climate Design', 'Structural Mechanics', 'Scale Physical Model Making', 'Client Jury Presentations'],
      curriculum: {
        foundation: ['Basic Design Studio I & II', 'Architectural Drawing & Descriptive Geometry', 'History of World Architecture', 'Building Materials & Physics'],
        core: ['Architectural Design Studios (Urban & Housing)', 'Statics & Structural Analysis', 'Building Construction Technologies & Details', 'Environmental Control Systems', 'Digital BIM Modeling'],
        advanced: ['Urban Design & Landscape Studio', 'Historic Preservation & Restoration', 'Professional Practice & Building Law', 'Advanced Construction Management', 'Diploma Graduation Design Studio']
      }
    },
    'Business Administration': {
      focus: 'Multinational Strategy, Corporate Finance & International Marketing',
      programming: 'Low',
      mathematics: 'Medium',
      design: 'Medium',
      business: 'High',
      duration: '4 years',
      enjoy: ['Strategic Decision-Making', 'Global Market Analysis', 'Leadership & Entrepreneurship'],
      considerations: [
        'Extensive business case study analysis, executive group presentations, and reports',
        'Corporate accounting and financial economics coursework',
        'Requires proactive networking and modern digital business literacy'
      ],
      careerPaths: [
        'International Management Consultant',
        'Corporate Strategy & Operations Analyst',
        'Brand & Digital Marketing Executive',
        'Financial Planner / Investment Analyst',
        'Global Business Founder / Entrepreneur'
      ],
      skills: ['Strategic Planning', 'Financial Accounting & Valuation', 'Digital Marketing & Growth', 'Organizational Leadership', 'Market Research & Forecasting', 'Cross-Border Negotiation'],
      curriculum: {
        foundation: ['Introduction to Management & Organizations', 'Microeconomics & Macroeconomics', 'Business Mathematics', 'Financial Accounting I'],
        core: ['Corporate Finance & Investment', 'Principles of Marketing & Consumer Behavior', 'Human Resource Management', 'Business Law & Corporate Governance', 'Operations & Supply Chain Management'],
        advanced: ['Strategic Management Capstone', 'International Business & Trade Policy', 'Digital Marketing & Social Commerce', 'Entrepreneurship & New Venture Creation', 'Corporate Internship Practicum']
      }
    },
    'International Law': {
      focus: 'Comparative Jurisprudence, International Arbitration & Treaty Law',
      programming: 'None',
      mathematics: 'None',
      design: 'None',
      business: 'High',
      duration: '4 years',
      enjoy: ['Debate & Legal Analysis', 'Human Rights Advocacy', 'Contract Drafting & Diplomacy'],
      considerations: [
        'Extensive legal reading of statutes, case law precedents, and international treaties',
        'Requires precision in writing, oral advocacy, and analytical legal reasoning',
        'Rigorous examinations on procedural law and comparative legal jurisdictions'
      ],
      careerPaths: [
        'International Legal Counsel / Attorney',
        'Corporate Compliance & Contract Officer',
        'Diplomatic Foreign Service Officer',
        'Arbitration & Dispute Resolution Specialist',
        'Non-Governmental Human Rights Advocate'
      ],
      skills: ['Legal Research & Brief Writing', 'Moot Court Oral Advocacy', 'Contract Drafting & Negotiation', 'Treaty Interpretation', 'Comparative Constitutional Law', 'Corporate Regulatory Compliance'],
      curriculum: {
        foundation: ['Introduction to Legal Theory & Jurisprudence', 'Constitutional Law & State Theory', 'Civil Law & Law of Persons', 'Roman Law Foundations'],
        core: ['Law of Obligations & Contracts', 'Public International Law', 'Criminal Law: General & Special Parts', 'Commercial Law & Corporations', 'Administrative Law & Judicial Review'],
        advanced: ['Private International Law & Conflicts', 'International Commercial Arbitration', 'European Union & Human Rights Law', 'Maritime Law & Admiralty', 'Graduation Moot Court Practicum']
      }
    }
  };

  // State Machine for Student Consultation Profile
  const studentProfile = {
    interests: ['software'],
    workPreference: 'building',
    learningStyle: 'practical',
    academicBackground: 'High school',
    goal: 'Start an international career',
    degreeLevel: 'Bachelor',
    language: 'English',
    budget: 'standard'
  };

  const state = {
    step: 1,
    passions: new Set(['software']),
    work: 'building',
    learningStyle: 'practical',
    background: 'High school',
    goal: 'Start an international career',
    degree: 'Bachelor',
    language: 'English',
    results: [],
    selectedDetailProgram: null
  };

  // Sync to sessionStorage
  const saveProfile = () => {
    studentProfile.interests = Array.from(state.passions);
    studentProfile.workPreference = state.work;
    studentProfile.learningStyle = state.learningStyle;
    studentProfile.academicBackground = state.background;
    studentProfile.goal = state.goal;
    studentProfile.degreeLevel = state.degree;
    studentProfile.language = state.language;

    try {
      sessionStorage.setItem('cauStudentProfile', JSON.stringify(studentProfile));
    } catch (_) {}
  };

  const loadProfile = () => {
    try {
      const saved = sessionStorage.getItem('cauStudentProfile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.interests) && parsed.interests.length > 0) {
          state.passions = new Set(parsed.interests);
        }
        if (parsed.workPreference) state.work = parsed.workPreference;
        if (parsed.learningStyle) state.learningStyle = parsed.learningStyle;
        if (parsed.academicBackground) state.background = parsed.academicBackground;
        if (parsed.goal) state.goal = parsed.goal;
        if (parsed.degreeLevel) state.degree = parsed.degreeLevel;
        if (parsed.language) state.language = parsed.language;
      }
    } catch (_) {}
  };

  // Get live catalog from window or cached source
  const getCatalog = () => {
    if (Array.isArray(window.CAU_PROGRAM_CATALOG) && window.CAU_PROGRAM_CATALOG.length > 0) {
      return window.CAU_PROGRAM_CATALOG;
    }
    return [];
  };

  // Helper to retrieve or synthesize programme knowledge
  const getKnowledgeForProgram = (programName, dept, degree) => {
    const cleanName = programName || '';
    for (const [key, val] of Object.entries(PROGRAM_KNOWLEDGE)) {
      if (cleanName.toLowerCase().includes(key.toLowerCase())) {
        return val;
      }
    }

    // Dynamic intelligent fallback based on faculty / fields
    const isTech = /software|computer|engineering|information|mechatronics|ai/i.test(cleanName + ' ' + dept);
    const isMed = /dentistry|nursing|health|physiotherapy|medical/i.test(cleanName + ' ' + dept);
    const isDesign = /architecture|interior|design|gastronomy/i.test(cleanName + ' ' + dept);
    const isBusiness = /business|finance|management|economics|banking/i.test(cleanName + ' ' + dept);

    return {
      focus: isTech ? 'Technical Systems & Applied Engineering' : isMed ? 'Clinical Health Practice & Patient Care' : isDesign ? 'Spatial Design & Creative Studio Work' : isBusiness ? 'Corporate Strategy & Market Leadership' : 'Academic & Professional Disciplines',
      programming: isTech ? 'High' : 'None',
      mathematics: isTech || isBusiness ? 'Medium' : 'Low',
      design: isDesign ? 'High' : 'Medium',
      business: isBusiness ? 'High' : 'Low',
      duration: degree.toLowerCase().includes('associate') ? '2 years' : degree.toLowerCase().includes('master') ? '2 years' : degree.toLowerCase().includes('ph.d') ? '4 years' : '4 years',
      enjoy: isTech ? ['Hands-on Technology', 'System Problem Solving', 'Digital Tools'] : isMed ? ['Patient Care', 'Clinical Practice', 'Medical Sciences'] : isDesign ? ['Creative Design', 'Visual Projects', 'Spatial Concepts'] : ['Strategic Thinking', 'Global Markets', 'Leadership'],
      considerations: isTech ? ['Technical coursework with laboratory commitments', 'Requires practical continuous practice'] : isMed ? ['Clinical shifts and hospital regulations', 'High ethical and academic standards'] : isDesign ? ['Design studio deadlines and creative project critiques'] : ['Case study analysis, team presentations, and exams'],
      careerPaths: isTech ? ['Systems Engineer', 'Technology Consultant', 'Project Developer', 'IT Specialist'] : isMed ? ['Healthcare Practitioner', 'Clinical Specialist', 'Hospital Department Coordinator'] : isDesign ? ['Design Consultant', 'Project Coordinator', 'Creative Specialist'] : ['Business Manager', 'Corporate Consultant', 'Operations Analyst'],
      skills: isTech ? ['Technical Analysis', 'System Architecture', 'Problem Solving'] : isMed ? ['Clinical Diagnosis', 'Patient Care', 'Healthcare Protocols'] : isDesign ? ['Design Software', 'Visual Ergonomics', 'Project Planning'] : ['Strategic Leadership', 'Financial Planning', 'Communication'],
      curriculum: {
        foundation: ['Academic Foundations & Research', 'Introduction to Discipline', 'Analytical Methods', 'Language & Communication'],
        core: ['Core Methodologies & Systems', 'Applied Field Laboratories', 'Departmental Seminars', 'Professional Ethics'],
        advanced: ['Specialized Elective Topics', 'Advanced Practical Projects', 'Internship Fieldwork', 'Graduation Capstone Project']
      }
    };
  };

  // Compute recommendations from catalog
  const computeRecommendations = () => {
    const catalog = getCatalog();
    if (!catalog || catalog.length === 0) return [];

    const selectedPassions = PASSIONS.filter(p => state.passions.has(p.id));
    const allKeywords = selectedPassions.flatMap(p => p.keywords);

    const scored = catalog.map(p => {
      let score = 50; // baseline
      const reasons = [];
      const considerations = [];

      const name = (p['Program Name'] || '').toLowerCase();
      const dept = (p['Department'] || '').toLowerCase();
      const deg = (p['Degree Level'] || '').toLowerCase();
      const lang = (p['Language'] || '').toLowerCase();

      // 1. Keyword / Passion Match
      let keywordHits = 0;
      for (const kw of allKeywords) {
        if (name.includes(kw)) keywordHits += 2;
        else if (dept.includes(kw)) keywordHits += 1;
      }
      if (keywordHits > 0) {
        score += Math.min(35, keywordHits * 10);
        reasons.push('Directly overlaps with your chosen areas of study interest.');
      }

      // 2. Work Preference Alignment
      if (state.work === 'building') {
        if (/software|engineering|computer|architecture|mechatronics|civil/.test(name + ' ' + dept)) {
          score += 20;
          reasons.push('Features extensive laboratory and hands-on system building coursework.');
        }
      } else if (state.work === 'solving') {
        if (/software|computer|engineering|finance|economics|mathematics/.test(name + ' ' + dept)) {
          score += 20;
          reasons.push('Focuses heavily on algorithmic logic, problem solving, and analytical rigor.');
        }
      } else if (state.work === 'people') {
        if (/nursing|psychology|relations|teaching|hospitality|tourism|law/.test(name + ' ' + dept)) {
          score += 20;
          reasons.push('Emphasizes interpersonal dynamics, public dialogue, diplomacy, and mentoring.');
        }
      } else if (state.work === 'designing') {
        if (/architecture|interior|design|gastronomy/.test(name + ' ' + dept)) {
          score += 20;
          reasons.push('Offers studio-based spatial drafting, visual aesthetics, and creative design.');
        }
      } else if (state.work === 'researching') {
        if (/dentistry|law|medicine|psychology|relations/.test(name + ' ' + dept)) {
          score += 20;
          reasons.push('Provides rigorous empirical inquiry, statutory analysis, and clinical diagnostics.');
        }
      } else if (state.work === 'leading') {
        if (/business|finance|management|aviation|administration/.test(name + ' ' + dept)) {
          score += 20;
          reasons.push('Cultivates strategic executive leadership, organizational governance, and enterprise.');
        }
      } else if (state.work === 'caring') {
        if (/dentistry|nursing|health|physiotherapy|psychology/.test(name + ' ' + dept)) {
          score += 20;
          reasons.push('Dedicates coursework to clinical healthcare, patient empathy, and recovery.');
        }
      }

      // 3. Learning Style Synergy
      if (state.learningStyle === 'practical' && /engineering|computing|software|mechatronics|nursing|dentistry|aviation|gastronomy/.test(dept + ' ' + name)) {
        score += 15;
        reasons.push('Learning format emphasizes practical laboratories, clinical suites, or workshops.');
      } else if (state.learningStyle === 'analytical' && /computing|software|engineering|finance|banking|economics/.test(dept + ' ' + name)) {
        score += 15;
        reasons.push('Matches your preference for structured quantitative and algorithmic thinking.');
      } else if (state.learningStyle === 'creative' && /architecture|interior|design|gastronomy/.test(dept + ' ' + name)) {
        score += 15;
        reasons.push('Studio-centered environment fostering personal creative project portfolios.');
      } else if (state.learningStyle === 'theory' && /law|relations|psychology|teaching/.test(dept + ' ' + name)) {
        score += 15;
        reasons.push('Rich academic literature, case law precedent, and deep theoretical foundations.');
      } else if (state.learningStyle === 'combination') {
        score += 12;
        reasons.push('Balanced blend of theoretical lectures, small-group seminars, and project work.');
      }

      // 4. Degree Level Match
      if (state.degree !== 'all') {
        if (deg.includes(state.degree.toLowerCase())) {
          score += 15;
          reasons.push(`Offered at your target ${state.degree} credential level.`);
        } else {
          score -= 20;
        }
      }

      // 5. Language Match
      if (state.language !== 'all') {
        if (lang.includes(state.language.toLowerCase())) {
          score += 10;
        }
      }

      // 6. Reality Check / Considerations
      if (/software|computer|engineering|physics|math/i.test(name)) {
        considerations.push('Mathematical and algorithmic coursework requires disciplined problem solving.');
        considerations.push('Requires continuous coding practice outside lecture hours.');
      } else if (/dentistry|nursing|physiotherapy/i.test(name)) {
        considerations.push('Includes rigorous clinical rotations and patient healthcare standards.');
        considerations.push('High clinical accountability and laboratory attendance required.');
      } else if (/architecture|interior/i.test(name)) {
        considerations.push('Demanding architectural studio hours and jury project critiques.');
        considerations.push('Requires mastering digital BIM modeling (AutoCAD, Revit, Rhino).');
      } else if (/law|relations/i.test(name)) {
        considerations.push('Substantial volume of reading across statutes, legal cases, and international treaties.');
        considerations.push('Rigorous examinations on procedural law and oral argument.');
      } else {
        considerations.push('Regular individual and team assignments with semester capstone presentations.');
      }

      return {
        program: p,
        score: Math.min(99, Math.max(68, score)),
        reasons,
        considerations
      };
    });

    scored.sort((a, b) => b.score - a.score);

    // Pick top 3 unique programs
    const top3 = [];
    const seen = new Set();
    for (const item of scored) {
      const name = item.program['Program Name'];
      if (!seen.has(name)) {
        seen.add(name);
        top3.push(item);
        if (top3.length === 3) break;
      }
    }
    return top3;
  };

  // Generate Personalized Explanation
  const generatePersonalizedWhy = (program, rankIdx) => {
    const pName = program['Program Name'];
    const pDept = program['Department'] || 'CAU Faculty';
    const selectedPassions = Array.from(state.passions).map(id => PASSIONS.find(x => x.id === id)?.title || id).join(', ');

    const workLabels = {
      building: 'building tangible systems and software',
      solving: 'solving complex quantitative and algorithmic puzzles',
      people: 'working with people, diplomacy, and communication',
      designing: 'creative spatial and visual design',
      researching: 'deep scientific, clinical, and legal research',
      leading: 'corporate leadership, enterprise, and strategy',
      caring: 'direct patient care, wellness, and rehabilitation'
    };

    const styleLabels = {
      practical: 'practical, hands-on learning',
      analytical: 'structured analytical inquiry',
      creative: 'creative studio exploration',
      theory: 'deep theoretical and doctrinal study',
      combination: 'a balanced combination of lectures and labs'
    };

    const workDesc = workLabels[state.work] || 'practical engagement';
    const styleDesc = styleLabels[state.learningStyle] || 'active study';

    return `You selected interests in ${selectedPassions}, with a strong preference for ${workDesc} and ${styleDesc}. ${pName} in the ${pDept} aligns directly with these attributes, providing accredited ECTS coursework and verified career progression toward your goal to ${state.goal.toLowerCase()}.`;
  };

  // Switch between Discovery Catalogue Mode & In-Page AI Consultant Deck
  const setCatalogueMode = (mode) => {
    const isAiFinder = mode === 'ai-finder';
    const browseTab = document.querySelector('#modeTabBrowse');
    const aiTab = document.querySelector('#modeTabAiFinder');
    const deck = document.querySelector('#aiConsultationDeck');
    const searchStage = document.querySelector('#catalogueSearchStage');
    const discoverySection = document.querySelector('#programDiscoverySection');

    if (!deck) return;

    if (browseTab) browseTab.classList.toggle('is-active', !isAiFinder);
    if (aiTab) aiTab.classList.toggle('is-active', isAiFinder);

    if (isAiFinder) {
      deck.hidden = false;
      if (searchStage) searchStage.hidden = true;
      if (discoverySection) discoverySection.hidden = true;

      deck.scrollIntoView({ behavior: 'smooth', block: 'start' });

      try {
        const url = new URL(window.location);
        url.searchParams.set('mode', 'ai-finder');
        window.history.replaceState(null, '', url);
      } catch (_) {}
    } else {
      deck.hidden = true;
      if (searchStage) searchStage.hidden = false;
      if (discoverySection) discoverySection.hidden = false;

      try {
        const url = new URL(window.location);
        url.searchParams.delete('mode');
        window.history.replaceState(null, '', url);
      } catch (_) {}
    }
  };

  // Step Navigation in Deck (Steps 1 to 6)
  const goToStep = (stepNumber) => {
    state.step = stepNumber;
    saveProfile();

    for (let i = 1; i <= 6; i++) {
      const stage = document.querySelector(`#consoleStep${i}`);
      const pill = document.querySelector(`#pillStep${i}`);
      if (stage) {
        stage.classList.toggle('is-visible', i === stepNumber);
      }
      if (pill) {
        pill.classList.toggle('is-active', i === stepNumber);
        pill.classList.toggle('is-completed', i < stepNumber);
      }
    }

    if (stepNumber === 6) {
      renderConsultationDossier();
    }
  };

  // Render Step 1 Passion Cards
  const renderFieldCards = () => {
    const grid = document.querySelector('#consoleFieldsGrid');
    if (!grid) return;

    grid.innerHTML = PASSIONS.map(p => {
      const isSelected = state.passions.has(p.id);
      return `
        <button type="button" class="console-field-card ${isSelected ? 'is-selected' : ''}" data-field-id="${p.id}" aria-pressed="${isSelected}">
          <i class="fa-solid ${p.icon} field-card-icon" aria-hidden="true"></i>
          <h4 class="field-card-title">${p.title}</h4>
          <p class="field-card-caption">${p.desc}</p>
        </button>
      `;
    }).join('');

    updatePassionsCounter();
  };

  const updatePassionsCounter = () => {
    const counter = document.querySelector('#consolePassionsCounter');
    const nextBtn = document.querySelector('#consoleStep1Next');
    const count = state.passions.size;

    if (counter) counter.textContent = count;
    if (nextBtn) nextBtn.disabled = count === 0;
  };

  // Render Step 6 Consultation Dossier (The Complete Experience)
  const renderConsultationDossier = () => {
    const results = computeRecommendations();
    state.results = results;
    if (results.length > 0 && !state.selectedDetailProgram) {
      state.selectedDetailProgram = results[0].program['Program Name'];
    }

    // 1. Populate Consultation Profile Card
    const valInterests = document.querySelector('#profValInterests');
    const valWork = document.querySelector('#profValWork');
    const valLearning = document.querySelector('#profValLearning');
    const valBackground = document.querySelector('#profValBackground');
    const valGoal = document.querySelector('#profValGoal');
    const valDegree = document.querySelector('#profValDegree');

    const selectedPassionsText = Array.from(state.passions).map(id => PASSIONS.find(x => x.id === id)?.title || id).join(' · ');
    if (valInterests) valInterests.textContent = selectedPassionsText || 'Technology & Innovation';
    
    const workTitles = {
      building: 'Building things',
      solving: 'Solving complex problems',
      people: 'Working with people',
      designing: 'Designing & visualizing',
      researching: 'Researching & investigating',
      leading: 'Leading & strategizing',
      caring: 'Caring for others'
    };
    if (valWork) valWork.textContent = workTitles[state.work] || state.work;

    const learningTitles = {
      practical: 'Practical / Hands-on',
      analytical: 'Analytical & Quantitative',
      creative: 'Creative & Spatial',
      theory: 'Reading & Deep Theory',
      combination: 'Balanced Combination'
    };
    if (valLearning) valLearning.textContent = learningTitles[state.learningStyle] || state.learningStyle;
    if (valBackground) valBackground.textContent = state.background;
    if (valGoal) valGoal.textContent = state.goal;
    if (valDegree) valDegree.textContent = `${state.degree === 'all' ? 'Any Degree' : state.degree} · ${state.language}`;

    // 2. Render Top 3 Match Cards Grid
    const dossierGrid = document.querySelector('#dossierCardsGrid');
    if (dossierGrid) {
      dossierGrid.innerHTML = results.map((item, idx) => {
        const p = item.program;
        const pName = p['Program Name'];
        const pDept = p['Department'] || 'Faculty Programme';
        const slug = p.slug || pName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const link = `/programs/${encodeURIComponent(slug)}.html`;
        const know = getKnowledgeForProgram(pName, pDept, p['Degree Level'] || 'Bachelor');

        const alignment = idx === 0 ? 'Strong Alignment' : idx === 1 ? 'Recommended Pathway' : 'Alternative Option';
        const badgeClass = idx === 0 ? '' : idx === 1 ? 'badge-recommended' : 'badge-alternative';
        const medal = idx === 0 ? '🥇 Primary Match' : idx === 1 ? '🥈 Parallel Path' : '🥉 Broader Perspective';

        const rawTuition = p['Price / Tuition'] || '10,000 EUR per year';
        const cleanTuition = rawTuition.includes('10,000') ? '€3,025 / yr' : rawTuition.includes('7,000') ? '€3,500 total' : '€3,025 / yr';

        const whyAppeared = generatePersonalizedWhy(p, idx);

        return `
          <article class="consultant-rank-card" data-program-name="${pName}">
            <div class="consultant-card-topbar">
              <span class="alignment-badge ${badgeClass}">${alignment}</span>
              <span class="consultant-card-medal">${medal}</span>
            </div>

            <div class="consultant-card-body">
              <span class="consultant-faculty-kicker">${pDept}</span>
              <h4 class="consultant-prog-title">
                <a href="${link}">${pName}</a>
              </h4>

              <!-- Why this appeared for you -->
              <div class="why-appeared-box">
                <div class="why-appeared-header">
                  <i class="fa-solid fa-sparkles text-coral"></i>
                  <span>Why This Appeared For You</span>
                </div>
                <p class="mb-0">${whyAppeared}</p>
              </div>

              <!-- What you may enjoy -->
              <div class="what-enjoy-box">
                <span class="what-enjoy-label">What You May Enjoy:</span>
                <div class="what-enjoy-tags">
                  ${know.enjoy.map(t => `<span class="enjoy-chip">${t}</span>`).join('')}
                </div>
              </div>

              <!-- Things to consider (Reality check) -->
              <div class="reality-check-box">
                <div class="reality-check-header">
                  <i class="fa-solid fa-triangle-exclamation text-coral"></i>
                  <span>Things To Consider:</span>
                </div>
                <ul class="reality-check-list">
                  ${know.considerations.map(c => `<li>${c}</li>`).join('')}
                </ul>
              </div>

              <!-- Tuition and Aid -->
              <div class="consultant-tuition-row">
                <div>
                  <span class="consultant-tuition-val">${cleanTuition}</span>
                  <small class="d-block text-muted" style="font-size: 11px;">With 50% International Aid</small>
                </div>
                <span class="consultant-scholarship-tag">50% Guaranteed Scholarship</span>
              </div>
            </div>

            <div class="consultant-card-footer">
              <button type="button" class="btn btn-outline-dark btn-sm btn-inspect-program" data-program-name="${pName}">
                <i class="fa-solid fa-diagram-project me-1"></i> View Curriculum
              </button>
              <a href="https://apply.cau.edu.tr/" target="_blank" rel="noopener noreferrer" class="consultant-apply-btn">
                Apply Online <i class="system-arrow ms-1" aria-hidden="true"></i>
              </a>
            </div>
          </article>
        `;
      }).join('');
    }

    // 3. Render Comparison Matrix Table
    renderComparisonTable(results);

    // 4. Render Career & Curriculum Section
    renderCareerAndCurriculum(results[0]?.program['Program Name']);
  };

  // Comparison Matrix Generator
  const renderComparisonTable = (results) => {
    const wrapper = document.querySelector('#comparisonTableWrapper');
    if (!wrapper || results.length === 0) return;

    const progs = results.map(r => r.program);
    const knowledges = progs.map(p => getKnowledgeForProgram(p['Program Name'], p['Department'], p['Degree Level'] || 'Bachelor'));

    wrapper.innerHTML = `
      <table class="comparison-table">
        <thead>
          <tr>
            <th>Evaluation Dimension</th>
            ${progs.map(p => `<th>${p['Program Name']}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Academic Department</th>
            ${progs.map(p => `<td>${p['Department'] || 'CAU Faculty'}</td>`).join('')}
          </tr>
          <tr>
            <th>Main Focus</th>
            ${knowledges.map(k => `<td><strong>${k.focus}</strong></td>`).join('')}
          </tr>
          <tr>
            <th>Programming Intensity</th>
            ${knowledges.map(k => {
              const cls = k.programming === 'High' ? 'table-tag-high' : k.programming === 'Medium' ? 'table-tag-med' : 'table-tag-low';
              return `<td><span class="${cls}">${k.programming}</span></td>`;
            }).join('')}
          </tr>
          <tr>
            <th>Mathematics Rigor</th>
            ${knowledges.map(k => {
              const cls = k.mathematics === 'High' ? 'table-tag-high' : k.mathematics === 'Medium' ? 'table-tag-med' : 'table-tag-low';
              return `<td><span class="${cls}">${k.mathematics}</span></td>`;
            }).join('')}
          </tr>
          <tr>
            <th>Design / Spatial Work</th>
            ${knowledges.map(k => {
              const cls = k.design === 'High' ? 'table-tag-high' : k.design === 'Medium' ? 'table-tag-med' : 'table-tag-low';
              return `<td><span class="${cls}">${k.design}</span></td>`;
            }).join('')}
          </tr>
          <tr>
            <th>Business &amp; Strategy</th>
            ${knowledges.map(k => {
              const cls = k.business === 'High' ? 'table-tag-high' : k.business === 'Medium' ? 'table-tag-med' : 'table-tag-low';
              return `<td><span class="${cls}">${k.business}</span></td>`;
            }).join('')}
          </tr>
          <tr>
            <th>Typical Duration</th>
            ${knowledges.map(k => `<td>${k.duration}</td>`).join('')}
          </tr>
          <tr>
            <th>Annual Tuition (With 50% Aid)</th>
            ${progs.map(p => {
              const raw = p['Price / Tuition'] || '10,000 EUR per year';
              const clean = raw.includes('10,000') ? '€3,025 / yr' : raw.includes('7,000') ? '€3,500 total' : '€3,025 / yr';
              return `<td><strong class="text-coral">${clean}</strong></td>`;
            }).join('')}
          </tr>
        </tbody>
      </table>
    `;
  };

  // Career & Curriculum Section
  const renderCareerAndCurriculum = (targetProgramName) => {
    const container = document.querySelector('#careerCurriculumContainer');
    if (!container) return;

    const activeName = targetProgramName || state.results[0]?.program['Program Name'] || 'Software Engineering';
    state.selectedDetailProgram = activeName;

    const matchedItem = state.results.find(r => r.program['Program Name'] === activeName) || state.results[0];
    const p = matchedItem?.program || { 'Program Name': activeName, Department: 'Faculty of Engineering & Architecture', 'Degree Level': 'Bachelor' };
    const know = getKnowledgeForProgram(p['Program Name'], p['Department'], p['Degree Level'] || 'Bachelor');

    // Tab buttons for switching between the top 3 programs
    const progTabsHtml = state.results.map(r => {
      const name = r.program['Program Name'];
      const isSel = name === activeName;
      return `
        <button type="button" class="btn ${isSel ? 'btn-dark' : 'btn-outline-dark'} btn-sm btn-cc-switch" data-pname="${name}">
          ${name}
        </button>
      `;
    }).join('');

    container.innerHTML = `
      <div style="grid-column: 1 / -1; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: -6px;">
        <span style="font-size: 13px; font-weight: 700; color: var(--prog-text);">Currently Inspecting:</span>
        <div class="d-flex gap-2 flex-wrap">
          ${progTabsHtml}
        </div>
      </div>

      <!-- Left Column: Career Pathways Tree -->
      <div class="career-tree-wrap">
        <h4 class="cc-card-title">
          <i class="fa-solid fa-diagram-project text-coral"></i>
          <span>What could this degree lead to?</span>
        </h4>
        <p class="text-muted mb-2" style="font-size: 13px;">
          Graduates of <strong>${p['Program Name']}</strong> qualify for diverse international roles across industry and enterprise:
        </p>

        <ul class="career-tree-branch">
          ${know.careerPaths.map(role => `
            <li class="career-tree-node">
              <i class="fa-solid fa-arrow-turn-down"></i>
              <span>${role}</span>
            </li>
          `).join('')}
        </ul>

        <div class="mt-3">
          <span class="what-enjoy-label d-block mb-2">Core Skills &amp; Competencies Acquired:</span>
          <div class="skills-tags-wrap">
            ${know.skills.map(s => `<span class="skill-chip">${s}</span>`).join('')}
          </div>
        </div>
      </div>

      <!-- Right Column: Curriculum Year Progression -->
      <div class="curriculum-timeline-wrap">
        <h4 class="cc-card-title">
          <i class="fa-solid fa-book-open-reader text-coral"></i>
          <span>What will you actually study?</span>
        </h4>
        <p class="text-muted mb-2" style="font-size: 13px;">
          Official European ECTS course structure progression from foundation to advanced capstone:
        </p>

        <div class="curriculum-stage">
          <span class="curriculum-stage-name">Foundation Level (Year 1)</span>
          <div class="curriculum-courses-list">
            ${know.curriculum.foundation.map(c => `<span class="course-chip">${c}</span>`).join('')}
          </div>
        </div>

        <div class="curriculum-stage mt-2">
          <span class="curriculum-stage-name">Core Departmental Level (Years 2 &amp; 3)</span>
          <div class="curriculum-courses-list">
            ${know.curriculum.core.map(c => `<span class="course-chip">${c}</span>`).join('')}
          </div>
        </div>

        <div class="curriculum-stage mt-2">
          <span class="curriculum-stage-name">Advanced &amp; Capstone Level (Year 4)</span>
          <div class="curriculum-courses-list">
            ${know.curriculum.advanced.map(c => `<span class="course-chip">${c}</span>`).join('')}
          </div>
        </div>

        <div class="p-3 mt-auto" style="background: var(--sys-surface-1); border-radius: var(--radius-sm); border: 1px solid var(--prog-border); font-size: 12px; line-height: 1.45;">
          <strong>In Simple Terms:</strong> You will begin with mathematical and computing essentials, progress into rigorous architectural and laboratory coursework, and conclude with a full graduation portfolio capstone.
        </div>
      </div>
    `;
  };

  // Ask AI to Explain Differences Handler
  const askAiExplainDiff = () => {
    const box = document.querySelector('#aiDiffExplanationBox');
    const textElem = document.querySelector('#aiDiffText');
    if (!box || !textElem || state.results.length < 2) return;

    box.hidden = false;
    const p1 = state.results[0].program['Program Name'];
    const p2 = state.results[1].program['Program Name'];
    const p3 = state.results[2]?.program['Program Name'] || 'MIS';

    const k1 = getKnowledgeForProgram(p1);
    const k2 = getKnowledgeForProgram(p2);
    const k3 = getKnowledgeForProgram(p3);

    textElem.innerHTML = `
      The biggest structural distinction between your top matches is where each degree balances software, system hardware, and organizational management:
      <br><br>
      • <strong>${p1}:</strong> Centers deeply on <em>${k1.focus}</em>. Programming intensity is <strong>${k1.programming}</strong>, designed specifically for students who want to build end-to-end applications.
      <br>
      • <strong>${p2}:</strong> Bridges into <em>${k2.focus}</em>, introducing <strong>${k2.programming}</strong> programming coupled with physical electronics and hardware mechanics.
      <br>
      • <strong>${p3}:</strong> Offers a strong <strong>${k3.business}</strong> strategic perspective, aligning technical tools with international business execution.
      <br><br>
      For your stated ambition to <strong>${state.goal}</strong> with a <strong>${state.learningStyle}</strong> learning profile, <strong>${p1}</strong> represents the most direct, practical academic vehicle.
    `;

    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  // Wire all events
  const init = () => {
    loadProfile();
    renderFieldCards();

    // Mode Switcher Buttons
    document.querySelector('#modeTabBrowse')?.addEventListener('click', () => setCatalogueMode('browse'));
    document.querySelector('#modeTabAiFinder')?.addEventListener('click', () => setCatalogueMode('ai-finder'));
    document.querySelector('#sidebarOpenAiFinderBtn')?.addEventListener('click', () => setCatalogueMode('ai-finder'));
    document.querySelector('#consoleCloseDeckBtn')?.addEventListener('click', () => setCatalogueMode('browse'));
    document.querySelector('#consoleStep1Cancel')?.addEventListener('click', () => setCatalogueMode('browse'));
    document.querySelector('#dossierReturnCatalogueBtn')?.addEventListener('click', () => setCatalogueMode('browse'));

    // Undecided Toggle
    const undecidedBtn = document.querySelector('#undecidedToggleBtn');
    const undecidedBox = document.querySelector('#undecidedGuidanceBox');
    undecidedBtn?.addEventListener('click', () => {
      if (undecidedBox) {
        undecidedBox.hidden = !undecidedBox.hidden;
      }
    });

    // Undecided Rapid Selection Cards
    document.querySelectorAll('.undecided-action-card').forEach(card => {
      card.addEventListener('click', () => {
        const preselect = (card.dataset.preselect || '').split(',');
        state.passions.clear();
        preselect.forEach(id => state.passions.add(id));
        renderFieldCards();
        if (undecidedBox) undecidedBox.hidden = true;
        // Smoothly progress to Step 2
        goToStep(2);
      });
    });

    // Step 1: Field Card Click
    const fieldsGrid = document.querySelector('#consoleFieldsGrid');
    fieldsGrid?.addEventListener('click', (e) => {
      const card = e.target.closest('.console-field-card');
      if (!card) return;
      const id = card.dataset.fieldId;
      if (state.passions.has(id)) {
        if (state.passions.size > 1) {
          state.passions.delete(id);
          card.classList.remove('is-selected');
        }
      } else {
        if (state.passions.size < 3) {
          state.passions.add(id);
          card.classList.add('is-selected');
        }
      }
      updatePassionsCounter();
    });

    document.querySelector('#consoleStep1Next')?.addEventListener('click', () => goToStep(2));

    // Step 2: Work Preference Click
    const workGrid = document.querySelector('#consoleWorkGrid');
    workGrid?.addEventListener('click', (e) => {
      const card = e.target.closest('.console-work-card');
      if (!card) return;
      workGrid.querySelectorAll('.console-work-card').forEach(c => c.classList.remove('is-selected'));
      card.classList.add('is-selected');
      state.work = card.dataset.work;
    });

    document.querySelector('#consoleStep2Back')?.addEventListener('click', () => goToStep(1));
    document.querySelector('#consoleStep2Next')?.addEventListener('click', () => goToStep(3));

    // Step 3: Learning Style Click
    const learningGrid = document.querySelector('#consoleLearningStylesGrid');
    learningGrid?.addEventListener('click', (e) => {
      const card = e.target.closest('.console-method-card');
      if (!card) return;
      learningGrid.querySelectorAll('.console-method-card').forEach(c => c.classList.remove('is-selected'));
      card.classList.add('is-selected');
      state.learningStyle = card.dataset.learningStyle;
    });

    document.querySelector('#consoleStep3Back')?.addEventListener('click', () => goToStep(2));
    document.querySelector('#consoleStep3Next')?.addEventListener('click', () => goToStep(4));

    // Step 4: Academic Background & Goal Click
    document.querySelector('#backgroundOptions')?.addEventListener('click', (e) => {
      const chip = e.target.closest('.matrix-chip');
      if (!chip) return;
      document.querySelectorAll('#backgroundOptions .matrix-chip').forEach(c => c.classList.remove('is-selected'));
      chip.classList.add('is-selected');
      state.background = chip.dataset.bg;
    });

    document.querySelector('#goalOptions')?.addEventListener('click', (e) => {
      const chip = e.target.closest('.matrix-chip');
      if (!chip) return;
      document.querySelectorAll('#goalOptions .matrix-chip').forEach(c => c.classList.remove('is-selected'));
      chip.classList.add('is-selected');
      state.goal = chip.dataset.goal;
    });

    document.querySelector('#consoleStep4Back')?.addEventListener('click', () => goToStep(3));
    document.querySelector('#consoleStep4Next')?.addEventListener('click', () => goToStep(5));

    // Step 5: Degree & Language Chips
    document.querySelector('#criteriaDegreeOptions')?.addEventListener('click', (e) => {
      const chip = e.target.closest('.criteria-chip');
      if (!chip) return;
      document.querySelectorAll('#criteriaDegreeOptions .criteria-chip').forEach(c => c.classList.remove('is-selected'));
      chip.classList.add('is-selected');
      state.degree = chip.dataset.degree;
    });

    document.querySelector('#criteriaLanguageOptions')?.addEventListener('click', (e) => {
      const chip = e.target.closest('.criteria-chip');
      if (!chip) return;
      document.querySelectorAll('#criteriaLanguageOptions .criteria-chip').forEach(c => c.classList.remove('is-selected'));
      chip.classList.add('is-selected');
      state.language = chip.dataset.language;
    });

    document.querySelector('#consoleStep5Back')?.addEventListener('click', () => goToStep(4));
    document.querySelector('#consoleStep5Generate')?.addEventListener('click', () => goToStep(6));

    // Step 6: Anchor Scrolls
    document.querySelector('#scrollToCompareBtn')?.addEventListener('click', () => {
      document.querySelector('#compareSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    document.querySelector('#scrollToAdmissionsBtn')?.addEventListener('click', () => {
      document.querySelector('#admissionsNextStepsSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Ask AI Explain Differences
    document.querySelector('#askAiExplainDiffBtn')?.addEventListener('click', askAiExplainDiff);

    // Curriculum inspection button inside match card
    document.querySelector('#dossierCardsGrid')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-inspect-program');
      if (!btn) return;
      const pName = btn.dataset.programName;
      renderCareerAndCurriculum(pName);
      document.querySelector('#careerCurriculumSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Career curriculum program switch tabs
    document.querySelector('#careerCurriculumContainer')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-cc-switch');
      if (!btn) return;
      const pName = btn.dataset.pname;
      renderCareerAndCurriculum(pName);
    });

    // Step 6: Retake & Filter Catalogue
    document.querySelector('#dossierRetakeBtn')?.addEventListener('click', () => goToStep(1));

    document.querySelector('#dossierFilterCatalogueBtn')?.addEventListener('click', () => {
      if (state.results.length > 0) {
        const topProgram = state.results[0].program['Program Name'];
        const searchInput = document.querySelector('#programSearchInput');
        if (searchInput) {
          searchInput.value = topProgram;
          searchInput.dispatchEvent(new Event('input'));
        }
      }
      setCatalogueMode('browse');
      const discovery = document.querySelector('#programDiscoverySection');
      if (discovery) discovery.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Direct Step Pills Click in Deck Header
    document.querySelectorAll('.console-step-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const targetStep = parseInt(pill.dataset.step, 10);
        if (targetStep < state.step || targetStep === 1) {
          goToStep(targetStep);
        }
      });
    });

    // Ask a Consultant prompt chips click
    document.querySelectorAll('.consultant-query-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.dataset.query;
        // If AI chat modal exists, open it and send query
        if (window.CAU_OPEN_AI_CHAT) {
          window.CAU_OPEN_AI_CHAT(query);
        } else {
          // Open WhatsApp with query pre-filled
          window.open(`https://wa.me/905488357171?text=${encodeURIComponent('Hello CAU Admissions Consultant: ' + query)}`, '_blank');
        }
      });
    });

    // Global listeners for any [data-open-smart-console] or [data-switch-to-ai-finder]
    document.querySelectorAll('[data-open-smart-console], [data-switch-to-ai-finder]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.location.pathname.includes('programs.html')) {
          setCatalogueMode('ai-finder');
        } else {
          window.location.href = '/programs.html?mode=ai-finder';
        }
      });
    });

    // Check URL parameters for mode
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'ai-finder') {
        setCatalogueMode('ai-finder');
      }
    } catch (_) {}
  };

  // Expose global interface
  window.CAU_CONSULTANT = {
    setCatalogueMode,
    goToStep,
    getProfile: () => ({ ...studentProfile }),
    computeRecommendations
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
