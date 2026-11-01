const fs = require('fs');
const path = require('path');

const ROOT = 'c:\\Users\\user\\Downloads\\cau-university-portable\\cau-university-portable\\cau-package';
const PUBLIC_PROGRAMS = path.join(ROOT, 'client', 'public', 'programs');
const CLIENT_PROGRAMS = path.join(ROOT, 'client', 'programs');
const DIST_PROGRAMS = path.join(ROOT, 'dist', 'public', 'programs');

// Catalog metadata and curated academic details
const catalog = require(path.join(ROOT, 'client', 'public', 'program-catalog.json'));

const facultyMapping = {
  'Faculty of Engineering and Architecture': {
    url: '/departments/faculty-of-engineering-and-architecture.html',
    defaultBanner: '/assets/unsplash-2.jpg',
    categoryLabel: 'ENGINEERING & ARCHITECTURE'
  },
  'Faculty of Dentistry': {
    url: '/departments/faculty-of-dentistry.html',
    defaultBanner: '/assets/unsplash-7.jpg',
    categoryLabel: 'DENTAL MEDICINE'
  },
  'Faculty of Health Sciences': {
    url: '/departments/faculty-of-health-sciences.html',
    defaultBanner: '/assets/unsplash-9.jpg',
    categoryLabel: 'HEALTH SCIENCES'
  },
  'Faculty of Humanities and Social Sciences': {
    url: '/departments/faculty-of-humanities-and-social-sciences.html',
    defaultBanner: '/assets/untitled2-9-ee2a180aac_80c7b714.png',
    categoryLabel: 'HUMANITIES & SOCIAL SCIENCES'
  },
  'Faculty of Law': {
    url: '/departments/faculty-of-law.html',
    defaultBanner: '/assets/unsplash-8.jpg',
    categoryLabel: 'LAW & JURISPRUDENCE'
  },
  'Faculty of Educational Sciences': {
    url: '/departments/faculty-of-educational-sciences.html',
    defaultBanner: '/assets/unsplash-4.jpg',
    categoryLabel: 'EDUCATIONAL SCIENCES'
  },
  'Faculty of Applied Sciences': {
    url: '/departments/faculty-of-applied-sciences.html',
    defaultBanner: '/assets/untitled2-11-88f245d7e3_5c234f69.jpg',
    categoryLabel: 'APPLIED SCIENCES'
  },
  'Graduate Programs — Master’s': {
    url: '/programs.html?degree=Master',
    defaultBanner: '/assets/unsplash-6.jpg',
    categoryLabel: 'GRADUATE STUDIES — MASTER’S'
  },
  'Graduate Programs — Ph.D.': {
    url: '/programs.html?degree=Ph.D.',
    defaultBanner: '/assets/unsplash-4.jpg',
    categoryLabel: 'POSTGRADUATE RESEARCH — PH.D.'
  },
  'Vocational Schools': {
    url: '/programs.html?degree=Associate',
    defaultBanner: '/assets/unsplash-9.jpg',
    categoryLabel: 'VOCATIONAL HIGHER SCHOOL'
  },
  'English Preparatory School': {
    url: '/international.html',
    defaultBanner: '/assets/unsplash-3.jpg',
    categoryLabel: 'LANGUAGE ACADEMY'
  }
};

// Curated content database for all 24 undergraduate programs
const programDetailsMap = {
  'software-engineering': {
    banner: '/assets/unsplash-5.jpg',
    subtitle: 'Design, engineer, and deploy scalable software systems, cloud-native architectures, and intelligent computing solutions in an international academic setting at Cyprus Aydin University.',
    lead: 'The Bachelor of Science in Software Engineering at Cyprus Aydin University educates engineers capable of architecting robust, scalable, and secure software solutions across every phase of the development lifecycle.',
    overview2: 'Our curriculum bridges computer science theory with modern industrial software practices. Students master object-oriented programming, data structures, cloud-native deployment (Docker, Kubernetes), distributed microservices, database design, and applied artificial intelligence.',
    overview3: 'Emphasizing hands-on engineering, coursework is reinforced by agile team sprints, version-controlled code repositories (Git/GitHub), automated testing pipelines, and industry-sponsored graduation capstone projects. Graduates emerge ready to step directly into global software teams, tech startups, and research institutions.',
    pillars: [
      { icon: 'fa-cloud', title: 'Cloud & Microservices', desc: 'Designing containerized microservice architectures, API gateways, serverless backends, and distributed systems on AWS and Azure.' },
      { icon: 'fa-brain', title: 'Applied AI & Big Data', desc: 'Integrating predictive machine learning models, neural networks, computer vision, and data engineering pipelines into live software.' },
      { icon: 'fa-shield-halved', title: 'DevSecOps & Quality', desc: 'Automated CI/CD workflows, unit/integration testing suites, vulnerability remediation, and enterprise software security standards.' }
    ],
    curriculum: [
      { year: 'Year 1: Foundations', ects: '60 ECTS', courses: ['Introduction to Computer Science & Logic', 'Object-Oriented Programming I & II (Java / Python)', 'Calculus for Engineers I & II', 'Discrete Computational Mathematics', 'Physics for Information Sciences', 'Academic Technical Writing & Communication'] },
      { year: 'Year 2: Core Engineering', ects: '60 ECTS', courses: ['Data Structures & Algorithm Analysis', 'Computer Architecture & Organization', 'Relational Database Management Systems (SQL)', 'Modern Web Technologies & Full-Stack Frameworks', 'Linear Algebra & Differential Equations', 'Probability & Statistics for Computer Engineers'] },
      { year: 'Year 3: Advanced Systems', ects: '60 ECTS', courses: ['Software Requirements Engineering & Modeling (UML)', 'Software Architecture, Patterns & Design', 'Operating Systems & Concurrency', 'Cloud Computing & Distributed Architectures', 'Fundamentals of Artificial Intelligence & Data Mining', 'Mobile Application Development (iOS / Android)'] },
      { year: 'Year 4: Capstone & Practice', ects: '60 ECTS', courses: ['Software Testing, Verification & QA Automation', 'Cybersecurity & Cryptographic Protocols', 'DevOps, CI/CD & Infrastructure as Code', 'Senior Software Engineering Capstone Project I & II', 'Mandatory Summer Industrial Internship', 'Software Project Management & Ethics'] }
    ],
    facilities: [
      { icon: 'fa-desktop', title: 'High-Performance Software Lab', desc: 'Equipped with dual-monitor developer workstations, gigabit networking, and local containerized deployment environments.' },
      { icon: 'fa-server', title: 'Cloud & Virtualization Cluster', desc: 'Dedicated server virtualization racks for experimenting with multi-node Docker Swarms, Kubernetes, and database sharding.' },
      { icon: 'fa-microchip', title: 'AI & Neural Computing Suite', desc: 'High-memory GPU rigs for machine learning training, computer vision benchmarking, and natural language processing models.' },
      { icon: 'fa-code-branch', title: 'Agile Project Sprints Room', desc: 'Interactive presentation displays, digital scrum boards, and collaborative breakout stations for team capstones.' }
    ],
    careers: [
      { icon: 'fa-code', title: 'Full-Stack Developer', desc: 'Architecting responsive client-facing web applications and high-throughput backend APIs.' },
      { icon: 'fa-cloud-arrow-up', title: 'Cloud / DevOps Engineer', desc: 'Building scalable cloud infrastructure, automated deployment pipelines, and Kubernetes clusters.' },
      { icon: 'fa-mobile-screen', title: 'Mobile App Engineer', desc: 'Developing native and cross-platform mobile experiences for iOS and Android.' },
      { icon: 'fa-database', title: 'Data & AI Engineer', desc: 'Implementing data pipelines, ETL workflows, and deploying production machine learning models.' },
      { icon: 'fa-bug-slash', title: 'QA Automation Lead', desc: 'Designing automated test suites, performance benchmark tests, and security audits.' },
      { icon: 'fa-diagram-project', title: 'Technical Product Lead', desc: 'Translating business vision into technical roadmaps, sprint backlogs, and software specifications.' }
    ]
  },

  'computer-engineering': {
    banner: '/assets/unsplash-2.jpg',
    subtitle: 'Master the convergence of hardware architecture, embedded systems, networking, and high-performance computing at Cyprus Aydin University.',
    lead: 'The Bachelor of Science in Computer Engineering bridges electronic hardware design with low-level systems programming, preparing engineers for microprocessor systems, robotics, and distributed architectures.',
    overview2: 'Students explore digital logic, computer organization, FPGA design, real-time operating systems, network protocols, and embedded software development with cutting-edge laboratory instruments.',
    overview3: 'Through hands-on bench experiments and senior design capstones, graduates possess the dual capability to engineer high-efficiency integrated circuits and develop robust firmware for modern IoT and computing devices.',
    pillars: [
      { icon: 'fa-microchip', title: 'Hardware-Software Integration', desc: 'Designing microprocessor architectures, FPGA logic, and low-level C/Assembly firmware.' },
      { icon: 'fa-network-wired', title: 'Distributed Networks & IoT', desc: 'Building enterprise network backbones, wireless sensor nodes, and secure IoT communication protocols.' },
      { icon: 'fa-robot', title: 'Embedded Robotic Control', desc: 'Interfacing microcontrollers with sensors, motor drivers, and real-time operating systems (RTOS).' }
    ],
    curriculum: [
      { year: 'Year 1: Foundations', ects: '60 ECTS', courses: ['Introduction to Computer Engineering', 'Calculus I & II', 'Digital Logic Design & Laboratory', 'Physics for Engineers I & II', 'Computer Programming (C / C++)', 'Technical Communication'] },
      { year: 'Year 2: Hardware & Software', ects: '60 ECTS', courses: ['Data Structures & Algorithms', 'Electric Circuits & Electronics', 'Computer Architecture & Assembly', 'Differential Equations & Linear Algebra', 'Discrete Mathematics', 'Database Management Systems'] },
      { year: 'Year 3: Embedded & Systems', ects: '60 ECTS', courses: ['Microprocessors & Embedded Systems Lab', 'Operating Systems & System Programming', 'Computer Networks & Internet Protocols', 'Signals & Systems', 'FPGA & VHDL Digital Design', 'Probability & Random Processes'] },
      { year: 'Year 4: Capstone & Advanced', ects: '60 ECTS', courses: ['Embedded Linux & Real-Time Systems', 'Network & Hardware Security', 'Senior Computer Engineering Capstone I & II', 'VLSI Design Fundamentals', 'Mandatory Summer Internship', 'Engineering Economics & Ethics'] }
    ],
    facilities: [
      { icon: 'fa-microchip', title: 'Embedded Systems & FPGA Lab', desc: 'Equipped with ARM Cortex development boards, Xilinx FPGA trainers, and logic analyzers.' },
      { icon: 'fa-bolt', title: 'Digital Electronics Lab', desc: 'Digital oscilloscopes, function generators, and surface-mount soldering workstations.' },
      { icon: 'fa-server', title: 'Network Routing & Switching Lab', desc: 'Cisco networking racks, managed routers, and virtualization servers.' },
      { icon: 'fa-desktop', title: 'High-Performance Computing Bench', desc: 'Multi-core developer workstations for compilation, hardware synthesis, and simulation.' }
    ],
    careers: [
      { icon: 'fa-microchip', title: 'Embedded Systems Engineer', desc: 'Developing firmware and driver software for automotive, medical, and aerospace systems.' },
      { icon: 'fa-network-wired', title: 'Network Infrastructure Architect', desc: 'Designing enterprise LAN/WAN topologies and secure data transmission protocols.' },
      { icon: 'fa-bolt', title: 'Hardware Verification Engineer', desc: 'Simulating and testing digital circuit designs, FPGAs, and silicon prototypes.' },
      { icon: 'fa-robot', title: 'Robotics & Automation Engineer', desc: 'Integrating sensors, actuators, and computer vision with industrial robots.' },
      { icon: 'fa-server', title: 'Systems Software Engineer', desc: 'Writing operating system kernels, device drivers, and real-time execution engines.' },
      { icon: 'fa-shield', title: 'Hardware Security Specialist', desc: 'Protecting embedded hardware against physical tampering, side-channel attacks, and exploits.' }
    ]
  },

  'architecture': {
    banner: '/assets/unsplash-3.jpg',
    subtitle: 'Cultivating visionary architects, sustainable spatial designers, and urban planners through studio-based Mediterranean education in Kyrenia.',
    lead: 'The Bachelor of Architecture at Cyprus Aydin University prepares architects who balance artistic sensitivity, technological proficiency, environmental sustainability, and historic cultural context.',
    overview2: 'Students learn in dedicated personal drafting ateliers, developing design solutions from conceptual hand sketches to 3D parametric models, BIM documentation, and physical structural scale mockups.',
    overview3: 'Anchored by our experienced international faculty and visiting master architects, students undertake comprehensive studio critiques, site visits across Cyprus, and urban regeneration projects.',
    pillars: [
      { icon: 'fa-compass-drafting', title: 'Atelier Design Culture', desc: 'Individual drafting desks, one-on-one desk critiques, and immersive studio project jury sessions.' },
      { icon: 'fa-leaf', title: 'Sustainable & Bioclimatic', desc: 'Energy-efficient passive solar architecture, Mediterranean climate adaptation, and green building materials.' },
      { icon: 'fa-cube', title: 'Digital BIM & Fabrication', desc: 'Advanced parametric drafting in Revit, Rhino, and Grasshopper with 3D laser-cut physical models.' }
    ],
    curriculum: [
      { year: 'Year 1: Form & Space', ects: '60 ECTS', courses: ['Basic Design Studio I & II', 'Architectural Drawing & Graphic Communication', 'Introduction to Architecture & History', 'Calculus for Architects', 'Statics & Strength of Materials', 'Visual Arts & Freehand Sketching'] },
      { year: 'Year 2: Construction & Place', ects: '60 ECTS', courses: ['Architectural Design Studio I & II', 'Building Materials & Construction Systems', 'Computer-Aided Architectural Design (CAD)', 'History of Western & Eastern Architecture', 'Environmental Control Systems (Thermal & Lighting)', 'Structural Behavior'] },
      { year: 'Year 3: Complex Typologies', ects: '60 ECTS', courses: ['Architectural Design Studio III & IV', 'Advanced Building Information Modeling (BIM)', 'Urban Design & Landscape Architecture', 'Reinforced Concrete & Steel Structures', 'Historic Preservation & Adaptive Reuse', 'Acoustics & Fire Safety'] },
      { year: 'Year 4: Graduation Thesis', ects: '60 ECTS', courses: ['Architectural Graduation Thesis Studio I & II', 'Construction Management & Cost Estimation', 'Professional Practice & Building Regulations', 'Contemporary Architectural Theory', 'Mandatory Office & Site Internship', 'Portfolio Exhibition'] }
    ],
    facilities: [
      { icon: 'fa-ruler-combined', title: 'Architectural Drafting Ateliers', desc: 'Spacious high-ceiling design studios with personal workstations and natural northern light.' },
      { icon: 'fa-cube', title: '3D Prototyping & Laser Workshop', desc: 'Precision laser cutters, 3D printers, hot-wire foam cutters, and model crafting tools.' },
      { icon: 'fa-vr-cardboard', title: 'Virtual Reality Walkthrough Lab', desc: 'VR headsets and visualization screens for immersive 1:1 scale architectural walk-ins.' },
      { icon: 'fa-book-open', title: 'Materials & Sample Library', desc: 'Extensive physical specimens of building cladding, acoustic tiles, and sustainable wood.' }
    ],
    careers: [
      { icon: 'fa-building', title: 'Licensed Architect', desc: 'Designing residential, commercial, cultural, and educational built environments.' },
      { icon: 'fa-city', title: 'Urban Planner & Designer', desc: 'Formulating city masterplans, pedestrian zoning, and sustainable public transit corridors.' },
      { icon: 'fa-laptop-code', title: 'BIM / Digital Design Manager', desc: 'Managing multi-disciplinary Building Information Modeling coordinates on mega-projects.' },
      { icon: 'fa-monument', title: 'Historic Restoration Architect', desc: 'Preserving, rehabilitating, and adaptively repurposing heritage architecture.' },
      { icon: 'fa-couch', title: 'Interior Spatial Designer', desc: 'Crafting atmospheric and ergonomic commercial interior fit-outs and retail spaces.' },
      { icon: 'fa-hard-hat', title: 'Project & Site Architect', desc: 'Supervising on-site construction execution, quality compliance, and contractor milestones.' }
    ]
  },

  'civil-engineering': {
    banner: '/assets/unsplash-2.jpg',
    subtitle: 'Build resilient infrastructure, earthquake-resistant structures, and sustainable transportation networks with world-class engineering training in Kyrenia.',
    lead: 'The Bachelor of Science in Civil Engineering equips engineers to design, construct, and manage essential infrastructure—from skyscrapers and bridges to highways, dams, and water networks.',
    overview2: 'Students master structural analysis, geotechnical mechanics, hydraulic systems, transportation planning, and construction materials testing in our fully equipped experimental laboratories.',
    overview3: 'With particular focus on seismic resilience and Mediterranean environmental conditions, graduates become licensed practitioners ready to lead major construction initiatives globally.',
    pillars: [
      { icon: 'fa-cubes', title: 'Structural & Seismic Engineering', desc: 'Designing reinforced concrete and steel structures resilient against severe earthquake ground motions.' },
      { icon: 'fa-mountain', title: 'Geotechnical Soil Mechanics', desc: 'Analyzing foundation load capacities, slope stability, deep excavations, and soil compaction.' },
      { icon: 'fa-faucet-drip', title: 'Hydraulics & Water Resources', desc: 'Developing municipal water networks, drainage systems, flood mitigation, and coastal works.' }
    ],
    curriculum: [
      { year: 'Year 1: Foundations', ects: '60 ECTS', courses: ['Introduction to Civil Engineering', 'Calculus I & II', 'Physics I & II', 'Engineering Mechanics: Statics', 'General Chemistry & Geology', 'CAD for Civil Engineers'] },
      { year: 'Year 2: Mechanics & Materials', ects: '60 ECTS', courses: ['Strength of Materials & Lab', 'Dynamics for Engineers', 'Fluid Mechanics & Hydraulics', 'Civil Engineering Materials & Concrete', 'Surveying & Topography Fieldwork', 'Differential Equations'] },
      { year: 'Year 3: Structural & Soil Analysis', ects: '60 ECTS', courses: ['Structural Analysis I & II', 'Soil Mechanics & Geotechnical Lab', 'Reinforced Concrete Design I', 'Highway & Transportation Engineering', 'Engineering Hydrology', 'Numerical Methods'] },
      { year: 'Year 4: Design & Construction', ects: '60 ECTS', courses: ['Design of Steel Structures', 'Foundation Engineering', 'Construction Management & Cost Estimation', 'Senior Civil Capstone Design Project', 'Mandatory Site & Office Internship', 'Engineering Ethics'] }
    ],
    facilities: [
      { icon: 'fa-cube', title: 'Materials & Concrete Testing Lab', desc: 'Hydraulic compression crushers, slump test cones, and concrete curing temperature tanks.' },
      { icon: 'fa-mound', title: 'Soil Mechanics & Geotechnics Lab', desc: 'Direct shear boxes, consolidation cells, sieve shakers, and Atterberg limit stations.' },
      { icon: 'fa-water', title: 'Fluid Mechanics & Hydraulics Flume', desc: 'Open-channel flow flumes, pipe friction manometers, and hydraulic pump test benches.' },
      { icon: 'fa-laptop', title: 'BIM & Structural Modeling Lab', desc: 'SAP2000, ETABS, AutoCAD, and Primavera project scheduling software.' }
    ],
    careers: [
      { icon: 'fa-building', title: 'Structural Design Engineer', desc: 'Calculating beam, column, and foundation loads for residential and commercial towers.' },
      { icon: 'fa-hard-hat', title: 'Construction Site Project Manager', desc: 'Directing subcontractors, quality compliance, schedule milestones, and on-site safety.' },
      { icon: 'fa-road', title: 'Transportation & Highway Engineer', desc: 'Planning highway interchanges, airport runways, and metropolitan traffic networks.' },
      { icon: 'fa-mountain', title: 'Geotechnical Engineering Consultant', desc: 'Evaluating foundation soil stability, bore logs, retaining walls, and piling.' },
      { icon: 'fa-droplet', title: 'Water Resources Engineer', desc: 'Engineering wastewater treatment plants, municipal pipelines, and flood barriers.' },
      { icon: 'fa-calculator', title: 'Quantity Surveyor & Cost Estimator', desc: 'Developing bill of quantities (BOQ), tender packages, and construction risk audits.' }
    ]
  },

  'electrical-and-electronics-engineering': {
    banner: '/assets/unsplash-2.jpg',
    subtitle: 'Harness power grids, renewable energy, telecommunications, and advanced electronic circuits through hands-on lab experimentation in Kyrenia.',
    lead: 'The Bachelor of Science in Electrical and Electronics Engineering develops innovators in renewable energy generation, high-frequency telecommunications, automation, and microelectronics.',
    overview2: 'Students gain mastery in circuit analysis, signal processing, electromagnetic field propagation, renewable photovoltaics, electric machines, and control systems using modern electronic test benches.',
    overview3: 'Graduates contribute directly to the global clean energy transition, high-speed 5G communications infrastructure, and semiconductor device manufacturing.',
    pillars: [
      { icon: 'fa-solar-panel', title: 'Renewable Power & Smart Grids', desc: 'Photovoltaic arrays, wind turbine conversion, smart metering, and electrical distribution.' },
      { icon: 'fa-tower-broadcast', title: 'Wireless Telecommunications', desc: 'Digital signal processing, RF microwave design, antenna arrays, and 5G cellular systems.' },
      { icon: 'fa-sliders', title: 'Control Systems & Automation', desc: 'PID controllers, feedback loop dynamics, industrial automation, and robotic actuators.' }
    ],
    curriculum: [
      { year: 'Year 1: Foundations', ects: '60 ECTS', courses: ['Electric Circuits I & Laboratory', 'Calculus I & II', 'Physics for Electrical Engineers', 'Computer Programming (C/C++)', 'Linear Algebra', 'Technical Drawing & CAD'] },
      { year: 'Year 2: Circuitry & Electronics', ects: '60 ECTS', courses: ['Electric Circuits II', 'Analog Electronics & Lab', 'Electromagnetic Field Theory', 'Differential Equations', 'Digital System Design', 'Signals & Systems'] },
      { year: 'Year 3: Power & Communications', ects: '60 ECTS', courses: ['Electrical Machines & Transformers', 'Power Systems Analysis', 'Communication Systems & DSP', 'Control Engineering & Lab', 'Microcontroller Interfacing', 'Probability & Random Variables'] },
      { year: 'Year 4: Specialization & Capstone', ects: '60 ECTS', courses: ['Renewable Energy Generation & Solar Grids', 'Microwave & Antenna Engineering', 'Senior Design Project I & II', 'Industrial Power Electronics', 'Mandatory Summer Practicum', 'Engineering Ethics'] }
    ],
    facilities: [
      { icon: 'fa-bolt', title: 'Power Systems & Machines Lab', desc: 'Three-phase generator benches, transformers, and photovoltaic test modules.' },
      { icon: 'fa-wave-square', title: 'Electronics & Signal Processing Lab', desc: 'Digital oscilloscopes, spectrum analyzers, and analog/digital breadboard trainers.' },
      { icon: 'fa-tower-cell', title: 'RF & Telecommunications Suite', desc: 'High-frequency signal generators, antenna propagation benches, and network analyzers.' },
      { icon: 'fa-microchip', title: 'Microcontroller & Control Lab', desc: 'PLC training modules, feedback motor controllers, and robotic arm testers.' }
    ],
    careers: [
      { icon: 'fa-bolt', title: 'Power Systems Engineer', desc: 'Designing high-voltage distribution networks, substations, and smart grid automation.' },
      { icon: 'fa-tower-broadcast', title: 'Telecommunications Engineer', desc: 'Developing cellular wireless backbones, microwave links, and satellite terminals.' },
      { icon: 'fa-solar-panel', title: 'Renewable Energy Specialist', desc: 'Sizing solar PV farms, wind turbine power electronics, and battery storage.' },
      { icon: 'fa-sliders', title: 'Automation & Control Engineer', desc: 'Programming industrial PLCs, SCADA interfaces, and robotic assembly systems.' },
      { icon: 'fa-microchip', title: 'Electronic Circuit Designer', desc: 'Designing printed circuit boards (PCBs), consumer electronics, and analog ICs.' },
      { icon: 'fa-car-battery', title: 'Electric Vehicle Systems Engineer', desc: 'Engineering EV power inverters, battery management systems (BMS), and charging hubs.' }
    ]
  },

  'information-security-engineering': {
    banner: '/assets/unsplash-5.jpg',
    subtitle: 'Defend critical digital infrastructure, audit network vulnerabilities, and master ethical hacking at Cyprus Aydin University in Kyrenia.',
    lead: 'The Bachelor of Science in Information Security Engineering trains cybersecurity professionals capable of safeguarding enterprise data, networks, and cloud platforms against sophisticated global threats.',
    overview2: 'Students gain deep technical competency in ethical hacking, penetration testing, cryptographic mathematics, network defense, secure coding, digital forensics, and cloud infrastructure compliance.',
    overview3: 'In our isolated Cyber Sandbox, students simulate real-time cyber attacks and defense drills (Red Team vs. Blue Team), mastering the tools required for immediate professional accreditation.',
    pillars: [
      { icon: 'fa-user-secret', title: 'Ethical Hacking & Penetration Testing', desc: 'Vulnerability assessment, exploit development, web app auditing, and reverse engineering.' },
      { icon: 'fa-shield-halved', title: 'Cyber Defense & Threat Intelligence', desc: 'SIEM monitoring, intrusion detection, firewall configuration, and automated incident response.' },
      { icon: 'fa-key', title: 'Applied Cryptography & Forensics', desc: 'Public-key cryptography, zero-knowledge proofs, blockchain security, and digital evidence recovery.' }
    ],
    curriculum: [
      { year: 'Year 1: Foundations', ects: '60 ECTS', courses: ['Introduction to Cyber Systems', 'Calculus I & II', 'Computer Programming (Python/C)', 'Discrete Mathematics & Logic', 'Linux System Administration', 'Digital Logic Design'] },
      { year: 'Year 2: Core Networks & Security', ects: '60 ECTS', courses: ['Data Structures & Algorithms', 'Computer Networks & TCP/IP Architecture', 'Applied Cryptography & Number Theory', 'Relational Database Security', 'Operating Systems & Shell Scripting', 'Probability & Statistics'] },
      { year: 'Year 3: Offensive & Defensive Cyber', ects: '60 ECTS', courses: ['Penetration Testing & Ethical Hacking', 'Network Security & Firewalls', 'Web Application Vulnerability Analysis', 'Secure Software Lifecycle & DevSecOps', 'Malware Analysis & Reverse Engineering', 'Cloud Security'] },
      { year: 'Year 4: Forensics & Capstone', ects: '60 ECTS', courses: ['Digital Forensics & Incident Response', 'Information Security Governance & ISO 27001', 'Senior Cybersecurity Capstone Project I & II', 'Cyber Warfare & Legal Compliance', 'Mandatory Security Internship', 'Ethical Standards'] }
    ],
    facilities: [
      { icon: 'fa-terminal', title: 'Isolated Cyber Attack/Defense Sandbox', desc: 'Air-gapped server environment for launching live exploit simulations and malware detonation.' },
      { icon: 'fa-magnifying-glass-chart', title: 'Digital Forensics Investigation Suite', desc: 'Write-blockers, disk imaging stations, and forensic memory analysis tools.' },
      { icon: 'fa-shield', title: 'SOC (Security Operations Center) Console', desc: 'Dual-display analyst consoles running SIEM log aggregators and threat intelligence feeds.' },
      { icon: 'fa-server', title: 'Cloud Infrastructure Security Testbed', desc: 'Kubernetes and AWS identity access management (IAM) penetration testing servers.' }
    ],
    careers: [
      { icon: 'fa-user-secret', title: 'Penetration Tester / Ethical Hacker', desc: 'Identifying exploitable vulnerabilities in client networks, APIs, and cloud services.' },
      { icon: 'fa-shield-halved', title: 'SOC Security Analyst', desc: 'Monitoring enterprise traffic, mitigating real-time cyber attacks, and conducting triage.' },
      { icon: 'fa-magnifying-glass', title: 'Digital Forensics Specialist', desc: 'Recovering digital evidence, analyzing ransomware artifacts, and providing legal reports.' },
      { icon: 'fa-lock', title: 'DevSecOps & Cloud Security Engineer', desc: 'Hardening Kubernetes pipelines, Docker containers, and automated security code scans.' },
      { icon: 'fa-file-shield', title: 'Cyber Risk & Compliance Officer', desc: 'Aligning enterprise architecture with ISO 27001, GDPR, and PCI-DSS compliance frameworks.' },
      { icon: 'fa-user-tie', title: 'Chief Information Security Officer (CISO)', desc: 'Directing strategic enterprise security policy and risk management for corporations.' }
    ]
  },

  'mechatronics-engineering': {
    banner: '/assets/unsplash-2.jpg',
    subtitle: 'Engineer the autonomous robots, smart actuators, and precision automated factories of the Industry 4.0 era at Cyprus Aydin University.',
    lead: 'The Bachelor of Science in Mechatronics Engineering combines mechanical engineering, electronics, computer science, and control theory into a unified discipline.',
    overview2: 'Students design robotic manipulators, automated manufacturing lines, drone guidance systems, and medical mechatronics using industrial PLCs, sensory arrays, and embedded microprocessors.',
    overview3: 'With extensive laboratory coursework in robotics kinematics and CNC manufacturing, graduates lead automation across the automotive, aerospace, healthcare, and smart consumer technology industries.',
    pillars: [
      { icon: 'fa-robot', title: 'Robotics & Autonomous Navigation', desc: 'Kinematic modeling, trajectory planning, LiDAR obstacle avoidance, and computer vision.' },
      { icon: 'fa-gears', title: 'Industrial PLC & Automation', desc: 'Programming programmable logic controllers, pneumatic logic, and SCADA industrial interfaces.' },
      { icon: 'fa-microchip', title: 'Sensory Fusion & Actuators', desc: 'Interfacing encoders, load cells, stepper/servo motors, and embedded PID controllers.' }
    ],
    curriculum: [
      { year: 'Year 1: Foundations', ects: '60 ECTS', courses: ['Introduction to Mechatronics', 'Calculus I & II', 'Physics I & II', 'Computer Programming (C/C++)', 'Engineering Statics', 'CAD Modeling for Mechanical Systems'] },
      { year: 'Year 2: Mechanics & Electronics', ects: '60 ECTS', courses: ['Dynamics & Kinematics', 'Electric Circuits & Electronics', 'Strength of Materials', 'Differential Equations & Linear Algebra', 'Digital Logic Design', 'Manufacturing Processes & Materials'] },
      { year: 'Year 3: Sensors, Actuators & Control', ects: '60 ECTS', courses: ['Control Systems Engineering', 'Sensors & Actuators for Mechatronics', 'Microcontrollers & Embedded Interfacing', 'Pneumatics & Hydraulics', 'Signals & Linear Systems', 'Thermodynamics'] },
      { year: 'Year 4: Robotics & Industrial Systems', ects: '60 ECTS', courses: ['Industrial Automation & PLC Programming', 'Robotics: Kinematics & Vision', 'Senior Mechatronics Capstone Design I & II', 'Machine Learning for Autonomous Systems', 'Mandatory Summer Internship', 'Engineering Ethics'] }
    ],
    facilities: [
      { icon: 'fa-robot', title: 'Autonomous Robotics & Vision Lab', desc: 'Multi-axis robotic arms, mobile rover platforms, and stereo vision cameras.' },
      { icon: 'fa-sliders', title: 'PLC & Pneumatics Automation Bench', desc: 'Siemens industrial PLCs, pneumatic cylinders, electro-valves, and conveyor simulators.' },
      { icon: 'fa-gears', title: 'CNC & Prototyping Workshop', desc: 'Computerized milling machines, 3D printers, and precision mechanical assembly stations.' },
      { icon: 'fa-wave-square', title: 'Sensory Measurement & Actuation Suite', desc: 'Optical encoders, torque sensors, strain gauges, and dynamometer motor testers.' }
    ],
    careers: [
      { icon: 'fa-robot', title: 'Robotics Design Engineer', desc: 'Developing automated robotic arms, agricultural drones, and autonomous guided vehicles (AGVs).' },
      { icon: 'fa-gears', title: 'Industrial Automation Specialist', desc: 'Programming assembly line PLCs, SCADA networks, and smart factory sensors.' },
      { icon: 'fa-car', title: 'Automotive & Autonomous Systems Engineer', desc: 'Designing electric vehicle drive controllers, ADAS sensor fusion, and powertrain electronics.' },
      { icon: 'fa-heart-pulse', title: 'Medical Mechatronics Specialist', desc: 'Building robotic surgical instruments, automated prosthetic limbs, and diagnostic devices.' },
      { icon: 'fa-plane', title: 'Aerospace Systems Specialist', desc: 'Engineering flight control actuators, gimbal stabilizers, and unmanned aerial vehicle autopilots.' },
      { icon: 'fa-microchip', title: 'Embedded Firmware Developer', desc: 'Writing motor driver firmware, sensor calibration libraries, and real-time control loops.' }
    ]
  },

  'interior-architecture-and-environmental-design': {
    banner: '/assets/unsplash-3.jpg',
    subtitle: 'Ergonomik mekan kurgusu, aydınlatma ve akustik tasarımı, sürdürülebilir iç mekan detayları ve çağdaş estetik vizyon.',
    lead: 'Kıbrıs Aydın Üniversitesi İç Mimarlık ve Çevre Tasarımı Bölümü, insan ölçeğine duyarlı, estetik ve işlevsel iç mekanlar üreten, çevre dostu malzeme teknolojilerine hakim iç mimarlar yetiştirir.',
    overview2: 'Öğrenciler temel tasarımdan mobilya detayına, aydınlatma-akustik hesaplarından tarihi yapıların yeniden işlevlendirilmesine kadar geniş bir perspektifte eğitim alır.',
    overview3: 'Atölye ortamında birebir masa kritikleriyle yürütülen projeler, 3D görselleştirme yazılımları (Revit, 3ds Max, Rhino) ve malzeme numune incelemeleriyle desteklenir.',
    pillars: [
      { icon: 'fa-compass-drafting', title: 'Birebir Atölye Kültürü', desc: 'Kişiye özel çizim masaları, jüri sunumları ve çağdaş mekan kurguları.' },
      { icon: 'fa-lightbulb', title: 'Aydınlatma ve Akustik', desc: 'Mekan atmosferini belirleyen ışık-gölge dengesi ve akustik yalıtım hesapları.' },
      { icon: 'fa-couch', title: 'Mobilya ve Detay Çözümleri', desc: 'Özel mobilya imalat detayları, malzeme dayanımı ve ergonomik standartlar.' }
    ],
    curriculum: [
      { year: '1. Yıl: Temel Tasarım', ects: '60 ECTS', courses: ['Temel Tasarım Stüdyosu I & II', 'Teknik Resim ve Perspektif', 'Mimarlık ve Sanat Tarihi', 'Çizim ve Anlatım Teknikleri', 'İç Mimarlığa Giriş', 'Matematik ve Geometri'] },
      { year: '2. Yıl: Mekan ve Malzeme', ects: '60 ECTS', courses: ['İç Mimari Tasarım Stüdyosu I & II', 'Yapı Elemanları ve Malzeme Bilgisi', 'Bilgisayar Destekli Tasarım (CAD / 3D)', 'Mobilya Tarihi ve Tasarımı', 'İç Mekanda Renk ve Doku', 'Çevre Kontrolü'] },
      { year: '3. Yıl: İleri Tipolojiler', ects: '60 ECTS', courses: ['İç Mimari Tasarım Stüdyosu III & IV', 'Aydınlatma ve Akustik Tasarımı', 'Detay ve İnce Yapı Bilgisi', 'Tarihi Mekanların Yenilenmesi', '3D Görselleştirme ve Render', 'Mesleki Hukuk'] },
      { year: '4. Yıl: Mezuniyet ve Uygulama', ects: '60 ECTS', courses: ['Mezuniyet Projesi Stüdyosu I & II', 'Şantiye Yönetimi ve Metraj Keşif', 'Mesleki Portfolyo Tasarımı', 'Zorunlu Ofis ve Şantiye Stajı', 'Meslek Etiği'] }
    ],
    facilities: [
      { icon: 'fa-ruler-combined', title: 'İç Mimarlık Çizim Atölyesi', desc: 'Geniş çalışma alanlarına sahip ferah tasarım stüdyoları.' },
      { icon: 'fa-swatchbook', title: 'Malzeme ve Doku Kütüphanesi', desc: 'Zemin, duvar, kumaş ve ahşap numune koleksiyonu.' },
      { icon: 'fa-cubes', title: 'Ahşap ve Maket Atölyesi', desc: 'Mobilya ölçekli modellerin ve mekan prototiplerinin üretildiği atölye.' },
      { icon: 'fa-display', title: '3D CAD ve Render Laboratuvarı', desc: 'Yüksek işlem gücüne sahip görselleştirme bilgisayarları.' }
    ],
    careers: [
      { icon: 'fa-couch', title: 'İç Mimar', desc: 'Konut, otel, ofis ve ticari mekanların konsept ve uygulama projelerini hazırlama.' },
      { icon: 'fa-paint-roller', title: 'Mekan ve Mağaza Tasarımcısı', desc: 'Perakende mağaza zincirleri ve showroom mekan tasarımları.' },
      { icon: 'fa-chair', title: 'Mobilya ve Ürün Tasarımcısı', desc: 'Özel üretim mobilya ve aydınlatma armatürleri tasarımı.' },
      { icon: 'fa-lightbulb', title: 'Aydınlatma Danışmanı', desc: 'Mimari ve kentsel mekanlar için aydınlatma konsept planlaması.' },
      { icon: 'fa-landmark', title: 'Restorasyon ve Yenileme Uzmanı', desc: 'Tarihi ve mevcut binaların çağdaş işleve uygun adaptasyonu.' },
      { icon: 'fa-hard-hat', title: 'Şantiye ve Uygulama Sorumlusu', desc: 'İç mekan şantiyelerinde uygulama ve imalat süreçlerini yönetme.' }
    ]
  },

  'dentistry': {
    banner: '/assets/unsplash-7.jpg',
    subtitle: 'Comprehensive 5-year integrated medical and dental education, high-fidelity phantom simulation, and direct clinical patient care in Kyrenia.',
    lead: 'The Faculty of Dentistry at Cyprus Aydin University prepares future dental surgeons through a rigorous 5-year curriculum integrating basic medical sciences, manual dexterity training, and clinical rotations.',
    overview2: 'Under Dean Prof. Dr. Cem Kurtoğlu, students train in computerized phantom simulation clinics, mastering tooth preparation and restorative protocols before progressing to supervised patient treatment.',
    overview3: 'Our modern dental facilities feature panoramic digital radiology, ultrasonic sterilization centers, and advanced dental prosthetics laboratories adhering to European medical council guidelines.',
    pillars: [
      { icon: 'fa-head-side-mask', title: 'Phantom Simulation Units', desc: 'Realistic dental mannequins simulating jaw ergonomics, lip resistance, and oral moisture.' },
      { icon: 'fa-tooth', title: 'Comprehensive Clinical Rotations', desc: 'Extensive chairside patient practice across endodontics, prosthetics, surgery, and periodontology.' },
      { icon: 'fa-x-ray', title: 'Digital Dental Imaging', desc: 'Low-dose panoramic radiology, 3D intraoral optical scanning, and computerized diagnosis.' }
    ],
    curriculum: [
      { year: 'Year 1: Basic Medical Sciences', ects: '60 ECTS', courses: ['Dental Anatomy & Morphology', 'Medical Biology & Genetics', 'Human Physiology', 'Medical Biochemistry', 'Medical First Aid & Emergency', 'Biostatistics'] },
      { year: 'Year 2: Preclinical Dexterity', ects: '60 ECTS', courses: ['Preclinical Restorative Dentistry', 'Dental Materials Science', 'General Pathology & Histology', 'Medical Microbiology', 'Head & Neck Topographic Anatomy', 'Pharmacology'] },
      { year: 'Year 3: Phantom Simulation', ects: '60 ECTS', courses: ['Phantom Head Clinical Simulation', 'Endodontics & Pulp Pathology', 'Periodontology Foundations', 'Oral Radiology & Imaging', 'Removable & Fixed Prosthodontics', 'Preventive Dentistry'] },
      { year: 'Year 4: Supervised Clinical Practice', ects: '60 ECTS', courses: ['Clinical Rotations in Restorative Dentistry', 'Oral & Maxillofacial Surgery I', 'Pediatric Dentistry (Pedodontics)', 'Clinical Prosthodontics', 'Orthodontics Fundamentals', 'Internal Medicine in Dentistry'] },
      { year: 'Year 5: Comprehensive Internship', ects: '60 ECTS', courses: ['Advanced Clinical Patient Care & Triage', 'Oral & Maxillofacial Surgery II', 'Advanced Implantology & Esthetic Dentistry', 'Dental Practice Management & Ethics', 'Graduation Clinical Defense', 'Emergency Dental Care'] }
    ],
    facilities: [
      { icon: 'fa-teeth', title: 'Phantom Head Simulation Clinic', desc: 'Equipped with computerized dental units where students hone tooth preparation and restorative technique.' },
      { icon: 'fa-microscope', title: 'Dental Materials & Prosthetics Lab', desc: 'Cast pouring, ceramic modeling, and polymer curing stations for prosthetic fabrication training.' },
      { icon: 'fa-shield-halved', title: 'Central Sterilization Unit', desc: 'Hospital-grade autoclave systems, ultrasonic cleaners, and sterile packing suites adhering to European protocols.' },
      { icon: 'fa-hospital-user', title: 'Clinical Consultation Suites', desc: 'Fully equipped dental treatment chairs for patient observation, hygiene procedures, and senior clinical rotations.' }
    ],
    careers: [
      { icon: 'fa-tooth', title: 'General Dental Surgeon (DDS)', desc: 'Conducting diagnosis, restorative treatment, extractions, and oral care in private or hospital clinics.' },
      { icon: 'fa-teeth-open', title: 'Oral & Maxillofacial Surgeon Track', desc: 'Pursuing specialization in surgical extractions, jaw reconstructions, and trauma care.' },
      { icon: 'fa-smile', title: 'Orthodontic Specialist Track', desc: 'Postgraduate pathway focused on malocclusion correction, brackets, and aligner therapies.' },
      { icon: 'fa-syringe', title: 'Endodontist Track', desc: 'Specializing in root canal therapy, dental trauma, and pulp preservation.' },
      { icon: 'fa-wand-magic-sparkles', title: 'Esthetic & Cosmetic Dentist', desc: 'Delivering smile design, ceramic veneers, whitening, and composite bonding.' },
      { icon: 'fa-hospital', title: 'Hospital Dental Clinic Director', desc: 'Directing dental departments within multidisciplinary medical centers and health complexes.' }
    ]
  },

  'nursing-english': {
    banner: '/assets/unsplash-9.jpg',
    subtitle: 'Global clinical nursing standards, patient-centred care, emergency triage, and healthcare leadership taught entirely in English.',
    lead: 'The Bachelor of Science in Nursing (English) at Cyprus Aydin University prepares healthcare professionals who integrate medical science, ethical empathy, and international best practices.',
    overview2: 'Students train in high-fidelity hospital simulation wards equipped with interactive patient mannequins, practicing wound management, medication calculation, vital sign stabilization, and clinical triage.',
    overview3: 'With clinical rotations conducted in leading medical centres and regional hospitals, graduates possess the qualifications and international language proficiency to practice globally.',
    pillars: [
      { icon: 'fa-heart-pulse', title: 'High-Fidelity Simulation', desc: 'Patient mannequins with programmable vital signs, respiratory distress, and cardiac arrhythmia.' },
      { icon: 'fa-hospital-user', title: 'Clinical Hospital Rotations', desc: 'Hands-on patient care semesters across emergency wards, ICUs, surgical suites, and pediatrics.' },
      { icon: 'fa-earth-europe', title: 'Global Healthcare Standards', desc: 'English medical terminology aligned with international nursing licensing examinations (NCLEX/OET).' }
    ],
    curriculum: [
      { year: 'Year 1: Medical Foundations', ects: '60 ECTS', courses: ['Anatomy & Physiology for Nurses', 'Fundamentals of Nursing Practice & Lab', 'Medical Biochemistry & Microbiology', 'Pharmacology for Healthcare', 'Health Assessment & Physical Examination', 'Professional Nursing Ethics'] },
      { year: 'Year 2: Acute & Surgical Care', ects: '60 ECTS', courses: ['Internal Medicine Nursing & Clinical', 'Surgical Nursing & Operating Room Practice', 'Pathophysiology of Disease', 'Nutrition & Dietetics', 'Infection Prevention & Control', 'Biostatistics in Health'] },
      { year: 'Year 3: Family & Mental Health', ects: '60 ECTS', courses: ['Obstetric & Gynecological Nursing', 'Pediatric Nursing & Child Development', 'Psychiatric & Mental Health Nursing', 'Public & Community Health Nursing', 'Epidemiology', 'Health Education & Communication'] },
      { year: 'Year 4: Clinical Internship & Leadership', ects: '60 ECTS', courses: ['Emergency & Intensive Care Nursing (ICU)', 'Nursing Management & Health Informatics', 'Senior Clinical Internship Practicum', 'Evidence-Based Nursing Practice', 'Senior Research Project', 'Disaster Nursing & First Aid'] }
    ],
    facilities: [
      { icon: 'fa-bed-pulse', title: 'Nursing Simulation Ward', desc: 'Hospital-grade beds, cardiac monitors, intravenous infusion pumps, and clinical dressing carts.' },
      { icon: 'fa-baby', title: 'Maternal & Child Health Lab', desc: 'Infant incubators, neonatal resuscitation models, and birthing simulation mannequins.' },
      { icon: 'fa-truck-medical', title: 'Emergency & Trauma Suite', desc: 'Triage simulation area for crash cart training, defibrillation, and advanced life support (ACLS).' },
      { icon: 'fa-microscope', title: 'Anatomy & Microbiology Lab', desc: 'Microscopes, histological preparations, and 3D organ specimens.' }
    ],
    careers: [
      { icon: 'fa-user-nurse', title: 'Registered Clinical Nurse (RN)', desc: 'Managing patient care plans, medication administration, and vital sign monitoring in hospitals.' },
      { icon: 'fa-heart-pulse', title: 'Critical Care / ICU Nurse', desc: 'Delivering continuous intensive care for critically ill patients in trauma and surgical ICUs.' },
      { icon: 'fa-hospital', title: 'Surgical Theatre Scrub Nurse', desc: 'Assisting surgeons during operations, maintaining sterile fields, and instrument handling.' },
      { icon: 'fa-baby', title: 'Pediatric & Neonatal Nurse', desc: 'Specialized medical nursing care for premature infants, children, and adolescents.' },
      { icon: 'fa-house-medical', title: 'Community & Public Health Nurse', desc: 'Coordinating immunization campaigns, maternal education, and chronic disease clinics.' },
      { icon: 'fa-chart-line', title: 'Nurse Manager & Administrator', desc: 'Supervising ward nursing teams, shift schedules, and hospital quality assurance protocols.' }
    ]
  },

  'nursing': {
    banner: '/assets/unsplash-9.jpg',
    subtitle: 'YÖK ve YÖDAK onaylı tam akredite müfredat, klinik beceri simülasyonları ve çok merkezli hastane stajları ile profesyonel hemşirelik eğitimi.',
    lead: 'Kıbrıs Aydın Üniversitesi Hemşirelik (Türkçe) Bölümü, bilimsel ilkeleri insani değerlerle harmanlayan, koruyucu, tedavi edici ve rehabilite edici sağlık hizmetlerinde yetkin hemşireler yetiştirir.',
    overview2: 'Öğrencilerimiz tam donanımlı laboratuvarlarımızda yüksek doğruluklu simülatörler üzerinde beceri kazanır; damar yolu açma, pansuman, EKG çekimi ve acil müdahale protokollerini öğrenir.',
    overview3: 'Türkiye ve KKTC’deki saygın devlet ve özel hastanelerde gerçekleştirilen kapsamlı klinik intörnlük programları, mezunlarımızın diplomalarının anında denkliğini ve istihdamını sağlar.',
    pillars: [
      { icon: 'fa-bed-pulse', title: 'Klinik Simülasyon Eğitimi', desc: 'Hastanelerin yoğun bakım ve servis ortamlarını birebir yansıtan simülasyon mankenleri.' },
      { icon: 'fa-hospital', title: 'Geniş Hastane Staj Ağı', desc: 'Genel cerrahi, dahiliye, pediatri ve psikiyatri kliniklerinde birebir hasta bakım stajı.' },
      { icon: 'fa-certificate', title: 'YÖK & YÖDAK Güvencesi', desc: 'Türkiye Cumhuriyeti ve KKTC sağlık mevzuatına tam uyumlu, denkliği onaylı diploma.' }
    ],
    curriculum: [
      { year: '1. Yıl: Temel Tıp Bilimleri', ects: '60 ECTS', courses: ['Hemşireliğe Giriş ve Temel İlkeler', 'İnsan Anatomisi ve Fizyolojisi', 'Tıbbi Mikrobiyoloji', 'Biyokimya ve Farmakoloji', 'Kişilerarası İlişkiler ve İletişim', 'İlk Yardım ve Acil Bakım'] },
      { year: '2. Yıl: Klinik Bakım Esasları', ects: '60 ECTS', courses: ['İç Hastalıkları Hemşireliği ve Stajı', 'Cerrahi Hastalıkları Hemşireliği ve Stajı', 'Patoloji', 'Sağlığın Değerlendirilmesi', 'Beslenme İlkeleri', 'Sağlık Hukuku ve Etik'] },
      { year: '3. Yıl: Özel Alan Hemşireliği', ects: '60 ECTS', courses: ['Doğum ve Kadın Hastalıkları Hemşireliği', 'Çocuk Sağlığı ve Hastalıkları Hemşireliği', 'Ruh Sağlığı ve Psikiyatri Hemşireliği', 'Halk Sağlığı Hemşireliği', 'Biyoistatistik', 'Epidemiyoloji'] },
      { year: '4. Yıl: İntörnlük ve Yönetim', ects: '60 ECTS', courses: ['Yoğun Bakım Hemşireliği', 'Hemşirelikte Yönetim ve Liderlik', 'Klinik İntörnlük Stajı (Tam Zamanlı)', 'Hemşirelikte Araştırma ve Mezuniyet Tezi', 'Mesleki İngilizce'] }
    ],
    facilities: [
      { icon: 'fa-bed-pulse', title: 'Hemşirelik Beceri Laboratuvarı', desc: 'Damar yolu, kateter ve pansuman eğitim maketleri ile donatılmış pratik salon.' },
      { icon: 'fa-heart-pulse', title: 'Yoğun Bakım ve Monitörizasyon Ünitesi', desc: 'Defibrilatörler, mekanik ventilatörler ve vital bulgu simülatörleri.' },
      { icon: 'fa-baby', title: 'Doğum ve Yenidoğan Bakım Odası', desc: 'Doğum masası, kuvöz ve fototerapi eğitim ekipmanları.' },
      { icon: 'fa-bone', title: 'Anatomi Maketleri Laboratuvarı', desc: 'İskelet, kas, dolaşım ve sinir sistemi 3 boyutlu anatomik modelleri.' }
    ],
    careers: [
      { icon: 'fa-user-nurse', title: 'Servis Hemşiresi', desc: 'Dahiliye, cerrahi ve onkoloji servislerinde hasta tedavi planını yürütme.' },
      { icon: 'fa-heart-pulse', title: 'Yoğun Bakım Hemşiresi', desc: 'Kritik durumdaki hastaların anlık takibi ve ileri yaşam desteği sağlama.' },
      { icon: 'fa-hospital', title: 'Ameliyathane Hemşiresi', desc: 'Cerrahi operasyonlarda steril alan yönetimi ve cerrah asistanlığı.' },
      { icon: 'fa-truck-medical', title: 'Acil Servis Hemşiresi', desc: 'Travma ve acil vakaların triyajı ve acil medikal müdahalesi.' },
      { icon: 'fa-house-medical', title: 'Toplum Sağlığı Hemşiresi', desc: 'Toplum sağlığı merkezlerinde aşılama, tarama ve gebe eğitimi.' },
      { icon: 'fa-user-tie', title: 'Başhemşire / Hemşirelik Hizmetleri Müdürü', desc: 'Hastane hemşirelik kadrolarının koordinasyonu ve kalite denetimi.' }
    ]
  },

  'physiotherapy-and-rehabilitation': {
    banner: '/assets/unsplash-9.jpg',
    subtitle: 'Hareket sistemi sağlığı, nörolojik ve ortopedik rehabilitasyon, sporcu performansı ve manuel terapi uzmanlığı.',
    lead: 'Kıbrıs Aydın Üniversitesi Fizyoterapi ve Rehabilitasyon Bölümü, doğuştan veya sonradan oluşan hareket kısıtlılıklarını bilimsel egzersiz ve modern teknolojiyle tedavi eden fizyoterapistler yetiştirir.',
    overview2: 'Eğitim müfredatımız elektroterapi cihazları, denge-koordinasyon sistemleri, hidroterapi simülasyonları ve ileri manuel terapi yöntemlerini kapsayan kapsamlı laboratuvar dersleriyle desteklenir.',
    overview3: 'Öğrencilerimiz 4 yıl boyunca ortopedi, nöroloji, pediatri, romatoloji ve sporcu sağlığı kliniklerinde vaka çözümleri yaparak mezuniyet sonrası bağımsız mesleki karar alma yetkinliğine ulaşır.',
    pillars: [
      { icon: 'fa-person-walking', title: 'Klinik Egzersiz ve Biyomekanik', desc: 'Postür analizi, kas kuvveti testleri, yürüme eğitimi ve terapötik egzersiz reçetelendirme.' },
      { icon: 'fa-bolt', title: 'İleri Elektroterapi Cihazları', desc: 'TENS, ultrason, lazer, manyetoterapi ve elektriksel stimülasyon uygulamaları.' },
      { icon: 'fa-medal', title: 'Sporcu Rehabilitasyonu', desc: 'Spor sakatlıklarının önlenmesi, sahaya dönüş rehabilitasyonu ve fonksiyonel atletik testler.' }
    ],
    curriculum: [
      { year: '1. Yıl: Anatomi ve Temeller', ects: '60 ECTS', courses: ['Fonksiyonel ve Topografik Anatomi', 'Tıbbi Fizyoloji', 'Fizyoterapiye Giriş ve Etik', 'Temel Fizik ve Biyofizik', 'Psikososyal Rehabilitasyon', 'Tıbbi Terminoloji'] },
      { year: '2. Yıl: Tedavi Modaliteleri', ects: '60 ECTS', courses: ['Temel ve Klinik Biyomekanik - Kinezyoloji', 'Elektroterapi I & II ve Laboratuvarı', 'Kas ve Eklem Değerlendirme Yöntemleri', 'Tedavi Edici Egzersiz Esasları', 'Masaj Teknikleri ve Manipülasyon', 'Dahili Tıp Bilimleri'] },
      { year: '3. Yıl: Özel Rehabilitasyon', ects: '60 ECTS', courses: ['Ortopedik Rehabilitasyon', 'Nörolojik Rehabilitasyon (İnme, MS, Parkinson)', 'Pediatrik Rehabilitasyon', 'Kardiyopulmoner Rehabilitasyon', 'Protez ve Ortez Rehabilitasyonu', 'Romatolojik Hastalıklarda FTR'] },
      { year: '4. Yıl: Klinik Uygulama & İntörnlük', ects: '60 ECTS', courses: ['Klinik Alan Uygulaması I & II (Hastanelerde Tam Zamanlı)', 'Sporcu Sağlığı ve Fizyoterapisi', 'Mesleki Deontoloji ve Yasal Sorumluluklar', 'Mezuniyet Araştırma Projesi', 'Yaz Klinik Stajı'] }
    ],
    facilities: [
      { icon: 'fa-dumbbell', title: 'Fizyoterapi ve Egzersiz Salonu', desc: 'Denge tahtaları, paralel barlar, direnç bantları ve postür analiz aynaları.' },
      { icon: 'fa-bolt', title: 'Elektroterapi Cihazları Laboratuvarı', desc: 'Kombine elektroterapi üniteleri, traksiyon masaları ve terapötik ultrasonlar.' },
      { icon: 'fa-person-cane', title: 'Yürüme ve Fonksiyonel Analiz Odası', desc: 'Gait ve postür değerlendirme kameraları ve basınç platformları.' },
      { icon: 'fa-wheelchair', title: 'Ortez ve Protez Uygulama Odası', desc: 'Destekleyici atel, tabanlık ve ortopedik cihaz uyumlandırma alanı.' }
    ],
    careers: [
      { icon: 'fa-user-doctor', title: 'Klinik Fizyoterapist', desc: 'Devlet veya özel hastanelerin fizik tedavi kliniklerinde tedavi programları yürütme.' },
      { icon: 'fa-medal', title: 'Spor Kulübü Fizyoterapisti', desc: 'Futbol, basketbol ve voleybol kulüplerinde sporcu yaralanmalarını tedavi etme.' },
      { icon: 'fa-brain', title: 'Nörolojik Rehabilitasyon Uzmanı', desc: 'İnme, felç ve omurilik yaralanmalı hastaların fonksiyonel kazanımını sağlama.' },
      { icon: 'fa-child', title: 'Pediatrik Fizyoterapist', desc: 'Serebral palsi ve gelişimsel motor geriliği olan çocuklara özel terapi sunma.' },
      { icon: 'fa-heart-pulse', title: 'Kardiyak ve Solunum Terapisti', desc: 'Kalp cerrahisi sonrası ve KOAH hastalarında solunum egzersizleri uygulama.' },
      { icon: 'fa-building-columns', title: 'Özel Rehabilitasyon Merkezi Yöneticisi', desc: 'Fizyoterapi ve sağlıklı yaşam merkezleri açma ve yönetme.' }
    ]
  },

  'business-administration': {
    banner: '/assets/unsplash-1.jpg',
    subtitle: 'Corporate strategy, international marketing, fintech investments, entrepreneurship, and global leadership taught in English in Kyrenia.',
    lead: 'The Bachelor of Arts in Business Administration at Cyprus Aydin University prepares dynamic managers and visionary entrepreneurs capable of steering organizations in competitive global markets.',
    overview2: 'Students master financial accounting, corporate strategy, digital marketing, supply chain management, organizational behavior, and international business law through real-world case analysis.',
    overview3: 'Anchored in Kyrenia’s international business hub, students engage in business plan competitions, mock financial trading, and executive guest lectures, gaining practical acumen for multinationals and startups.',
    pillars: [
      { icon: 'fa-chart-line', title: 'Strategic & Financial Acumen', desc: 'Corporate valuation, balance sheet forecasting, investment portfolio analysis, and risk management.' },
      { icon: 'fa-bullhorn', title: 'Digital Marketing & Growth', desc: 'Omnichannel brand strategy, consumer psychology, programmatic advertising, and data analytics.' },
      { icon: 'fa-rocket', title: 'Entrepreneurial Innovation', desc: 'Venture capital pitch decks, startup incubation, business model canvas, and lean operations.' }
    ],
    curriculum: [
      { year: 'Year 1: Foundations', ects: '60 ECTS', courses: ['Introduction to Business & Management', 'Principles of Microeconomics & Macroeconomics', 'Financial Accounting I & II', 'Business Mathematics & Statistics', 'Business Communication & Academic Writing', 'Information Technology for Business'] },
      { year: 'Year 2: Functional Management', ects: '60 ECTS', courses: ['Principles of Marketing', 'Corporate Finance & Valuation', 'Organizational Behavior', 'Managerial Accounting', 'Business Law & Corporate Governance', 'Operations Management & Supply Chain'] },
      { year: 'Year 3: Global Business & Strategy', ects: '60 ECTS', courses: ['International Business & Trade', 'Digital Marketing & E-Commerce', 'Human Resource Management', 'Consumer Behavior & Market Research', 'Financial Markets & Banking', 'Management Information Systems (MIS)'] },
      { year: 'Year 4: Leadership & Capstone', ects: '60 ECTS', courses: ['Strategic Management Capstone', 'Entrepreneurship & Innovation Lab', 'Corporate Social Responsibility & Ethics', 'Business Analytics & Decision Modeling', 'Mandatory Corporate Internship', 'Senior Graduation Project'] }
    ],
    facilities: [
      { icon: 'fa-chart-pie', title: 'Financial Markets Trading Suite', desc: 'Real-time financial tickers, Bloomberg terminal simulations, and portfolio modeling tools.' },
      { icon: 'fa-lightbulb', title: 'CAU Startup Incubator Room', desc: 'Collaborative breakout spaces for student pitch decks, business model canvases, and mentor meetups.' },
      { icon: 'fa-users', title: 'Executive Case Study Amphitheatre', desc: 'Tiered presentation lecture hall configured for Harvard-style business case discussions.' },
      { icon: 'fa-display', title: 'Business Analytics Computer Lab', desc: 'Equipped with SPSS, Power BI, Advanced Excel modeling, and enterprise ERP simulators.' }
    ],
    careers: [
      { icon: 'fa-briefcase', title: 'Business Development Manager', desc: 'Expanding commercial market reach, identifying client partnerships, and driving revenue.' },
      { icon: 'fa-chart-line', title: 'Corporate Financial Analyst', desc: 'Building capital allocation models, cash flow forecasts, and evaluating M&A opportunities.' },
      { icon: 'fa-bullhorn', title: 'Marketing Director / Brand Manager', desc: 'Developing global brand positioning, digital campaigns, and product launch roadmaps.' },
      { icon: 'fa-users-gear', title: 'Human Resources Strategist', desc: 'Directing talent acquisition, executive leadership development, and organizational culture.' },
      { icon: 'fa-rocket', title: 'Entrepreneur & Startup Founder', desc: 'Launching innovative commercial ventures and raising angel/venture capital funding.' },
      { icon: 'fa-network-wired', title: 'Supply Chain & Logistics Director', desc: 'Optimizing international procurement, warehousing, distribution, and freight logistics.' }
    ]
  },

  'international-relations': {
    banner: '/assets/untitled2-9-ee2a180aac_80c7b714.png',
    subtitle: 'Geopolitics, diplomacy, international security, multilateral treaties, and global conflict resolution studied from the Mediterranean crossroads.',
    lead: 'The Bachelor of Arts in International Relations at Cyprus Aydin University prepares analytical diplomats, policy analysts, and international governance experts.',
    overview2: 'Situated at the geopolitical crossroads of Europe, the Middle East, and the Mediterranean, students analyze foreign policy, international law, diplomatic history, security studies, and political economy.',
    overview3: 'Through regular Model United Nations conferences, diplomatic crisis simulations, and foreign ministry seminars, graduates develop sophisticated negotiation and intercultural leadership skills.',
    pillars: [
      { icon: 'fa-handshake-angle', title: 'Diplomacy & Crisis Simulation', desc: 'Model UN conferences, bilateral treaty negotiation drills, and diplomatic crisis wargaming.' },
      { icon: 'fa-scale-balanced', title: 'International Law & Treaties', desc: 'Sovereignty, humanitarian covenants, territorial maritime boundaries, and the UN charter.' },
      { icon: 'fa-globe', title: 'Geopolitics & Security Studies', desc: 'Energy politics, regional Mediterranean conflicts, defense alliances (NATO), and non-state actors.' }
    ],
    curriculum: [
      { year: 'Year 1: Foundations', ects: '60 ECTS', courses: ['Introduction to Political Science', 'History of World Civilizations', 'Foundations of International Relations', 'Introduction to Sociology & Culture', 'Academic Research & Argumentation', 'World Geography & Geopolitics'] },
      { year: 'Year 2: Theories & Diplomacy', ects: '60 ECTS', courses: ['Theories of International Relations', 'Diplomatic History (1648-1945)', 'Public International Law I & II', 'Comparative Government & Politics', 'International Political Economy (IPE)', 'Political Philosophy'] },
      { year: 'Year 3: Regional Politics & Security', ects: '60 ECTS', courses: ['Foreign Policy Analysis', 'Middle Eastern & Mediterranean Politics', 'European Union Politics & Integration', 'International Security & Terrorism', 'International Organizations & Global Governance', 'Research Methods'] },
      { year: 'Year 4: Capstone & Practice', ects: '60 ECTS', courses: ['Conflict Resolution & Peace Studies', 'Energy Geopolitics & Resources', 'Senior Graduation Research Thesis', 'Diplomatic Protocol & Negotiation', 'Mandatory NGO / Embassy / Ministry Internship', 'Contemporary World Issues'] }
    ],
    facilities: [
      { icon: 'fa-landmark-dome', title: 'Model UN Assembly Chamber', desc: 'Amphitheatre conference suite configured for mock UN general assemblies and treaty debates.' },
      { icon: 'fa-earth-americas', title: 'Geopolitical Mapping & Research Lab', desc: 'Digital geopolitical mapping displays and regional international relations archives.' },
      { icon: 'fa-book-atlas', title: 'Diplomatic Documents Library', desc: 'Official treaties, state department foreign relations records, and declassified archives.' },
      { icon: 'fa-comments', title: 'Bilateral Negotiation Suite', desc: 'Formal negotiation tables equipped with audio recording for mediation simulations.' }
    ],
    careers: [
      { icon: 'fa-user-tie', title: 'Diplomat / Foreign Service Officer', desc: 'Representing sovereign state interests at embassies, consulates, and bilateral summits.' },
      { icon: 'fa-chart-pie', title: 'Political Risk Analyst', desc: 'Advising multinational corporations on geopolitical volatility, sanctions, and regulatory changes.' },
      { icon: 'fa-hand-holding-heart', title: 'International NGO Director', desc: 'Managing humanitarian aid operations, refugee support programs, and civil society advocacy.' },
      { icon: 'fa-landmark', title: 'Intergovernmental Policy Advisor', desc: 'Working within United Nations agencies, the European Union, OECD, or regional councils.' },
      { icon: 'fa-newspaper', title: 'Foreign Affairs Journalist / Editor', desc: 'Investigating international conflicts, election outcomes, and global summits for news media.' },
      { icon: 'fa-graduation-cap', title: 'Academic Think-Tank Researcher', desc: 'Publishing policy white papers, strategic security doctrines, and geopolitical monographs.' }
    ]
  },

  'psychology': {
    banner: '/assets/untitled2-9-ee2a180aac_80c7b714.png',
    subtitle: 'Bilişsel süreçler, gelişim psikolojisi, klinik değerlendirme, psikopatoloji ve bilimsel araştırma metodolojisi.',
    lead: 'Kıbrıs Aydın Üniversitesi Psikoloji Bölümü, insan davranışını ve zihinsel süreçlerini bilimsel yöntemlerle inceleyen, etik ilkelere bağlı araştırmacı ve uygulamacı psikologlar yetiştirir.',
    overview2: 'Eğitim sürecinde öğrencilerimiz fizyolojik psikolojiden sosyal dinamiklere, çocuk ve ergen gelişiminden klinik görüşme becerilerine kadar kapsamlı bir teorik ve pratik donanım kazanır.',
    overview3: 'Tek yönlü aynalı gözlem odalarımız ve psikometrik test laboratuvarlarımızda vaka incelemeleri yapılır; öğrencilerimiz hastaneler, danışmanlık merkezleri ve kurumsal şirketlerde staj imkanı bulur.',
    pillars: [
      { icon: 'fa-brain', title: 'Bilişsel ve Nöropsikoloji', desc: 'Bellek, algı, dikkat süreçleri ve beynin davranışsal mekanizmalarının incelenmesi.' },
      { icon: 'fa-chart-simple', title: 'Psikometrik Ölçme ve Değerlendirme', desc: 'Standardize zeka, kişilik ve gelişim testlerinin uygulanması ve raporlanması.' },
      { icon: 'fa-comments', title: 'Klinik Gözlem ve Görüşme', desc: 'Danışan-psikolog iletişimi, vaka formülasyonu ve klinik süpervizyon hazırlığı.' }
    ],
    curriculum: [
      { year: '1. Yıl: Psikolojiye Giriş', ects: '60 ECTS', courses: ['Psikolojiye Giriş I & II', 'Sosyolojiye Giriş', 'Felsefe Tarihi', 'Temel İstatistik ve Olasılık', 'Akademik Yazım ve Eleştirel Düşünme', 'Fizyoloji ve Biyoloji'] },
      { year: '2. Yıl: Gelişim ve Zihin', ects: '60 ECTS', courses: ['Gelişim Psikolojisi I (Çocukluk)', 'Gelişim Psikolojisi II (Ergenlik-Yetişkinlik)', 'Bilişsel Psikoloji', 'Sosyal Psikoloji I & II', 'Fizyolojik Psikoloji ve Sinirbilim', 'Psikolojide Araştırma Yöntemleri'] },
      { year: '3. Yıl: Klinik ve Patoloji', ects: '60 ECTS', courses: ['Psikopatoloji I & II (Anormal Psikoloji)', 'Klinik Psikolojiye Giriş', 'Kişilik Kuramları', 'Öğrenme Psikolojisi', 'Deneysel Psikoloji ve Laboratuvar', 'Psikolojik Testler'] },
      { year: '4. Yıl: Uygulama ve Mezuniyet', ects: '60 ECTS', courses: ['Psikoterapötik Yaklaşımlar', 'Gözlem ve Görüşme Teknikleri', 'Zorunlu Kurum ve Klinik Stajı', 'Psikolojide Etik İlkeler', 'Mezuniyet Tezi ve Araştırma Projesi', 'Örgütsel Psikoloji'] }
    ],
    facilities: [
      { icon: 'fa-eye', title: 'Tek Yönlü Aynalı Gözlem Odası', desc: 'Bireysel görüşme ve çocuk oyun seanslarının dışarıdan izlenebildiği akustik oda.' },
      { icon: 'fa-clipboard-question', title: 'Psikometrik Test Laboratuvarı', desc: 'WISC-R, MMPI, Bender-Gestalt ve gelişim tarama test bataryaları.' },
      { icon: 'fa-laptop-code', title: 'Bilişsel ve İstatistiksel Analiz Lab', desc: 'SPSS ve R analiz yazılımları ile deney tasarımı ve veri modelleme.' },
      { icon: 'fa-couch', title: 'Danışma Simülasyon Salonu', desc: 'Rol oynama ve vaka simülasyonları için konforlu görüşme ortamı.' }
    ],
    careers: [
      { icon: 'fa-user-doctor', title: 'Psikolog', desc: 'Özel kliniklerde, danışmanlık merkezlerinde ve hastanelerde psikolojik değerlendirme yapma.' },
      { icon: 'fa-school', title: 'Okul ve Eğitim Psikoloğu', desc: 'K-12 okullarında öğrencilerin bilişsel ve duygusal gelişim süreçlerini takip etme.' },
      { icon: 'fa-briefcase', title: 'Endüstri / Örgüt Psikoloğu', desc: 'Kurumsal şirketlerde personel seçimi, mülakat, motivasyon ve liderlik testleri.' },
      { icon: 'fa-scale-balanced', title: 'Adli Psikolog', desc: 'Mahkemelerde çocuk ve yetişkin ifadeleri için bilirkişilik ve cezaevi danışmanlığı.' },
      { icon: 'fa-shield-heart', title: 'Sosyal Hizmet ve Aile Danışmanı', desc: 'Aile ve sosyal hizmet merkezlerinde kadın, çocuk ve yaşlı destek projeleri yönetme.' },
      { icon: 'fa-graduation-cap', title: 'Klinik Psikoloji Yüksek Lisans Adayı', desc: 'Klinik psikoloji uzmanlığı ile psikoterapist unvanı alma yolu.' }
    ]
  },

  'civil-aviation-management': {
    banner: '/assets/unsplash-1.jpg',
    subtitle: 'Airline fleet strategy, international aviation law (ICAO/IATA), flight dispatch, and airport terminal management taught in English in Kyrenia.',
    lead: 'The Bachelor of Science in Civil Aviation Management prepares future airline executives and airport operations managers in the dynamic commercial aerospace industry.',
    overview2: 'Students gain mastery in air transport economics, airport terminal capacity planning, flight crew scheduling, cargo logistics, international air law, and aviation safety management systems (SMS).',
    overview3: 'Benefiting from Northern Cyprus’s strategic aviation connections, students visit international airports, flight simulator centres, and air traffic control towers during their studies.',
    pillars: [
      { icon: 'fa-plane-departure', title: 'Airline Operations & Fleet Scheduling', desc: 'Optimizing flight routes, crew rotations, fuel efficiency, and fleet turnaround logistics.' },
      { icon: 'fa-passport', title: 'ICAO & IATA Regulatory Compliance', desc: 'International civil aviation protocols, bilateral air service agreements, and security mandates.' },
      { icon: 'fa-building', title: 'Airport Terminal Management', desc: 'Passenger check-in throughput, runway slot allocations, baggage logistics, and retail concession planning.' }
    ],
    curriculum: [
      { year: 'Year 1: Foundations', ects: '60 ECTS', courses: ['Introduction to Civil Aviation', 'Principles of Management', 'Micro & Macroeconomics', 'Aviation English & Communication', 'Business Mathematics', 'Information Systems for Aviation'] },
      { year: 'Year 2: Flight & Ground Operations', ects: '60 ECTS', courses: ['Air Transportation Management', 'Aviation Law & International Conventions', 'Airport Ground Handling Services', 'Flight Operations & Dispatch Foundations', 'Financial Accounting for Airlines', 'Aviation Meteorology'] },
      { year: 'Year 3: Commercial Airline Strategy', ects: '60 ECTS', courses: ['Airline Marketing & Revenue Management (Yield)', 'Aviation Safety Management Systems (SMS)', 'Air Cargo Logistics & Dangerous Goods', 'Airport Planning & Design Architecture', 'Human Factors in Aviation', 'Airline Fleet Planning'] },
      { year: 'Year 4: Executive Leadership & Capstone', ects: '60 ECTS', courses: ['Aviation Security & Crisis Management', 'Airline Strategic Alliances & Mergers', 'Senior Aviation Management Capstone Project', 'Air Traffic Control & Airspace Management', 'Mandatory Airport / Airline Internship', 'Aviation Ethics'] }
    ],
    facilities: [
      { icon: 'fa-plane', title: 'Flight Dispatch & Operations Simulator', desc: 'Computerized flight planning software calculating fuel burns, wind vectors, and alternate airports.' },
      { icon: 'fa-ticket', title: 'Airport Passenger Service Simulation', desc: 'Mock check-in counters with airline reservation systems (Amadeus / Sabre).' },
      { icon: 'fa-tower-observation', title: 'Air Traffic Simulation Room', desc: 'Visual tower radar displays and terminal airspace traffic flow monitors.' },
      { icon: 'fa-boxes-packing', title: 'Air Cargo Logistics Center', desc: 'Unit load device (ULD) planning software and weight/balance calculation workstations.' }
    ],
    careers: [
      { icon: 'fa-plane-departure', title: 'Airline Operations Supervisor', desc: 'Managing daily flight dispatch, turnaround coordination, and schedule adjustments.' },
      { icon: 'fa-building', title: 'Airport Terminal Duty Manager', desc: 'Overseeing passenger terminal services, security checkpoints, and baggage flow.' },
      { icon: 'fa-chart-line', title: 'Aviation Revenue & Pricing Analyst', desc: 'Modeling seat yield management, booking curves, and competitive ticket pricing.' },
      { icon: 'fa-boxes-packing', title: 'Air Cargo Logistics Manager', desc: 'Coordinating international air freight manifests, customs clearance, and courier fleets.' },
      { icon: 'fa-shield-halved', title: 'Aviation Safety & Compliance Auditor', desc: 'Conducting SMS risk assessments and ensuring compliance with ICAO/EASA standards.' },
      { icon: 'fa-handshake', title: 'Airport Concession & Marketing Director', desc: 'Negotiating duty-free retail leases, lounge partnerships, and airline landing contracts.' }
    ]
  },

  'banking-and-finance': {
    banner: '/assets/unsplash-1.jpg',
    subtitle: 'Investment portfolio management, algorithmic financial markets, commercial banking, risk analysis, and FinTech innovation taught in English.',
    lead: 'The Bachelor of Science in Banking and Finance prepares analytical professionals who understand the mechanisms of global capital markets, commercial banking, and financial technology.',
    overview2: 'Students master financial econometric modeling, credit risk analysis, corporate bond issuance, foreign exchange hedging, cryptocurrency dynamics, and central banking monetary policy.',
    overview3: 'In our financial trading suite, students execute real-time portfolio simulations and analyze asset pricing, graduating with the quantitative rigour demanded by global financial centers.',
    pillars: [
      { icon: 'fa-chart-pie', title: 'Investment & Portfolio Management', desc: 'Equities, fixed-income valuation, modern portfolio theory, and derivatives hedging.' },
      { icon: 'fa-building-columns', title: 'Commercial & Investment Banking', desc: 'Credit risk assessment, syndicated loans, M&A advisory, and Basel regulatory capital.' },
      { icon: 'fa-coins', title: 'FinTech & Digital Banking', desc: 'Blockchain assets, algorithmic high-frequency trading, and digital payment infrastructure.' }
    ],
    curriculum: [
      { year: 'Year 1: Foundations', ects: '60 ECTS', courses: ['Introduction to Finance', 'Microeconomics & Macroeconomics', 'Financial Accounting I & II', 'Mathematics for Finance & Calculus', 'Business Statistics & Data Analysis', 'Information Technology for Finance'] },
      { year: 'Year 2: Markets & Institutions', ects: '60 ECTS', courses: ['Financial Markets & Institutions', 'Corporate Finance', 'Money and Banking', 'Managerial Accounting', 'Econometrics I', 'Commercial Law & Financial Regulations'] },
      { year: 'Year 3: Applied Investment & Banking', ects: '60 ECTS', courses: ['Commercial Bank Management & Lending', 'Investment Analysis & Portfolio Management', 'Financial Derivatives: Futures & Options', 'International Finance & Exchange Rates', 'Applied Financial Econometrics', 'Credit Risk Modeling'] },
      { year: 'Year 4: FinTech & Senior Capstone', ects: '60 ECTS', courses: ['FinTech & Digital Currency Systems', 'Financial Risk Management & Basel Framework', 'Senior Finance Capstone Project', 'Behavioral Finance & Market Psychology', 'Mandatory Bank / Brokerage Internship', 'Financial Ethics & Standards'] }
    ],
    facilities: [
      { icon: 'fa-chart-line', title: 'Financial Markets Trading Suite', desc: 'Live tickers, portfolio simulators, and equity valuation modeling software.' },
      { icon: 'fa-calculator', title: 'Quantitative Econometrics Lab', desc: 'Terminals running EViews, Stata, Python, and R for econometric regression and backtesting.' },
      { icon: 'fa-building-columns', title: 'Commercial Banking Operations Room', desc: 'Core banking simulation software for loan underwriting and balance sheet stress testing.' },
      { icon: 'fa-shield', title: 'Risk Modeling & Valuation Lab', desc: 'Value-at-Risk (VaR) and Monte Carlo simulation tools for institutional portfolio stress tests.' }
    ],
    careers: [
      { icon: 'fa-chart-line', title: 'Investment Analyst', desc: 'Valuing public equities, corporate debt, and writing investment recommendation memos.' },
      { icon: 'fa-building-columns', title: 'Commercial Bank Credit Officer', desc: 'Underwriting corporate credit facilities, syndications, and assessing default probability.' },
      { icon: 'fa-shield-halved', title: 'Financial Risk Manager (FRM track)', desc: 'Managing market, liquidity, and credit risk exposure for financial institutions.' },
      { icon: 'fa-briefcase', title: 'Wealth & Portfolio Manager', desc: 'Structuring asset allocations and retirement funds for high-net-worth clients.' },
      { icon: 'fa-coins', title: 'FinTech Product Developer', desc: 'Designing digital banking apps, peer-to-peer lending platforms, and payment gateways.' },
      { icon: 'fa-landmark', title: 'Central Bank & Treasury Analyst', desc: 'Monitoring monetary transmission, inflation metrics, and sovereign debt markets.' }
    ]
  },

  'law': {
    banner: '/assets/unsplash-8.jpg',
    subtitle: 'Anayasa yargısı, medeni hukuk, borçlar hukuku, ceza adaleti, ticaret hukuku ve kurgusal mahkeme duruşmaları.',
    lead: 'Kıbrıs Aydın Üniversitesi Hukuk Fakültesi (Lisans), adaletin üstünlüğünü ve insan haklarını savunan, derin doktrin bilgisine ve etkili savunma yeteneğine sahip hukukçular yetiştirir.',
    overview2: 'Öğrencilerimiz 4 yıllık eğitim boyunca özel hukuk ve kamu hukuku disiplinlerinde analitik düşünme, içtihat tarama, hukuki metin yazma ve duruşma hitabeti becerileri kazanır.',
    overview3: 'Fakültemiz bünyesindeki tam donanımlı Kurgusal Mahkeme Salonu (Moot Court), duruşma pratiğini birinci elden yaşatarak mezunlarımızı avukatlık stajına, hakimlik-savcılık sınavlarına hazırlar.',
    pillars: [
      { icon: 'fa-gavel', title: 'Kurgusal Duruşma Eğitimi', desc: 'Hakim kürsüsü, iddia ve savunma makamlarıyla donatılmış salonda gerçek dava canlandırmaları.' },
      { icon: 'fa-book-bookmark', title: 'Zengin İçtihat ve Doktrin Kütüphanesi', desc: 'Yargıtay, Danıştay, Anayasa Mahkemesi kararları ve temel hukuk külliyatı.' },
      { icon: 'fa-scale-balanced', title: 'YÖK & YÖDAK Güvencesi', desc: 'Türkiye ve KKTC barolarında avukatlık stajı yapma hakkı sağlayan onaylı hukuk diploması.' }
    ],
    curriculum: [
      { year: '1. Yıl: Hukukun Temelleri', ects: '60 ECTS', courses: ['Hukuk Başlangıcı ve Metodolojisi', 'Anayasa Hukuku (Genel Esaslar ve Türk Anayasa Hukuku)', 'Roma Hukuku Tarihi ve İlkeleri', 'Medeni Hukuk (Giriş ve Kişiler Hukuku)', 'Hukuk Felsefesi ve Sosyolojisi', 'İktisada Giriş'] },
      { year: '2. Yıl: Özel ve Kamu Hukuku', ects: '60 ECTS', courses: ['Borçlar Hukuku Genel Hükümler I & II', 'Ceza Hukuku Genel Hükümler I & II', 'İdare Hukuku I & II', 'Medeni Hukuk: Aile ve Miras Hukuku', 'Devletler Umumi Hukuku (Uluslararası Hukuk)', 'Maliye ve Vergi Hukukuna Giriş'] },
      { year: '3. Yıl: İleri Hukuk Disiplinleri', ects: '60 ECTS', courses: ['Ticaret Hukuku (Ticari İşletme ve Şirketler)', 'Borçlar Hukuku Özel Hükümler', 'Ceza Hukuku Özel Hükümler', 'Medeni Usul Hukuku (Yargılama Hukuku)', 'İdari Yargılama Usul Hukuku', 'Eşya Hukuku (Ayni Haklar)'] },
      { year: '4. Yıl: Yargılama ve Uygulama', ects: '60 ECTS', courses: ['Ceza Muhakemesi Hukuku', 'İcra ve İflas Hukuku', 'İş ve Sosyal Güvenlik Hukuku', 'Kıymetli Evrak Hukuku & Sigorta Hukuku', 'Devletler Hususi Hukuku (Milletlerarası Özel Hukuk)', 'Kurgusal Duruşma ve Hukuk Kliniği Projesi'] }
    ],
    facilities: [
      { icon: 'fa-gavel', title: 'CAU Kurgusal Duruşma Salonu', desc: 'Yargılama heyeti kürsüsü, sanık ve tanık mahalli ile tam ölçekli duruşma salonu.' },
      { icon: 'fa-book', title: 'Hukuk İhtisas Kütüphanesi', desc: 'Türk ve uluslararası hukuk külliyatı, Kazancı ve Lexpera dijital hukuk veri tabanları.' },
      { icon: 'fa-handshake-simple', title: 'Arabuluculuk ve Müzakere Odası', desc: 'Alternatif uyuşmazlık çözümleri ve arabuluculuk simülasyonları için toplantı alanı.' },
      { icon: 'fa-landmark', title: 'Adalet ve İnsan Hakları Seminer Salonu', desc: 'Baro başkanları ve yüksek yargı mensuplarının ağırlandığı konferans amfisi.' }
    ],
    careers: [
      { icon: 'fa-gavel', title: 'Serbest Avukat', desc: 'Hukuk bürolarında müvekkilleri ceza, medeni, ticaret ve idari davalarda temsil etme.' },
      { icon: 'fa-scale-balanced', title: 'Hakim ve Cumhuriyet Savcısı', desc: 'Adli ve idari yargı sınavlarını kazanarak adalet saraylarında yargı görevini yürütme.' },
      { icon: 'fa-building', title: 'Şirket Hukuk Müşaviri', desc: 'Bankalar, holdingler ve çok uluslu şirketlerin sözleşmelerini ve dava süreçlerini yönetme.' },
      { icon: 'fa-signature', title: 'Noter', desc: 'Hukuki işlemlerin resmi geçerliliğini sağlama ve belgelendirme.' },
      { icon: 'fa-handshake', title: 'Uzman Arabulucu ve Hakem', desc: 'Ticari ve iş uyuşmazlıklarını mahkeme dışı müzakere yoluyla çözüme kavuşturma.' },
      { icon: 'fa-landmark', title: 'Kamuda Hukuk Uzmanı', desc: 'Bakanlıklar, BDDK, Rekabet Kurumu ve bağımsız regülasyon otoritelerinde hukuk uzmanlığı.' }
    ]
  },

  'international-law': {
    banner: '/assets/unsplash-8.jpg',
    subtitle: 'Public international law, transnational arbitration, maritime boundaries, human rights, and WTO trade agreements studied in English.',
    lead: 'The Bachelor of Laws (LL.B.) in International Law at Cyprus Aydin University prepares global legal practitioners skilled in transnational litigation, cross-border commerce, and multilateral diplomacy.',
    overview2: 'Taught entirely in English, students analyze international public treaties, maritime disputes, commercial arbitration rules (ICC, LCIA), foreign direct investment treaties, and human rights charters.',
    overview3: 'Students participate in international moot court tournaments (such as the Jessup and Willem C. Vis competitions) in our campus courtroom, cultivating cross-border advocacy mastery.',
    pillars: [
      { icon: 'fa-scale-balanced', title: 'Transnational Commercial Arbitration', desc: 'International contract drafting, investor-state dispute settlement (ISDS), and enforcement.' },
      { icon: 'fa-ship', title: 'Law of the Sea & Maritime Law', desc: 'Exclusive economic zones (EEZ), maritime boundary delimitation, and shipping transport law.' },
      { icon: 'fa-landmark', title: 'International Human Rights & Treaties', desc: 'Geneva Conventions, European Court of Human Rights jurisprudence, and international criminal law.' }
    ],
    curriculum: [
      { year: 'Year 1: Foundations of Law', ects: '60 ECTS', courses: ['Introduction to Legal Systems & Common Law', 'Constitutional Law & Principles of Governance', 'Public International Law I', 'Legal Research, Analysis & Citation', 'History of International Law', 'Foundations of Torts & Contracts'] },
      { year: 'Year 2: Public International Law', ects: '60 ECTS', courses: ['Public International Law II: State Responsibility', 'Law of the Sea & Maritime Law', 'International Human Rights Law', 'International Organizations (UN / EU / WTO)', 'Contract Law in International Commerce', 'Comparative Constitutional Systems'] },
      { year: 'Year 3: Commercial & Dispute Law', ects: '60 ECTS', courses: ['International Commercial Arbitration', 'Private International Law (Conflict of Laws)', 'World Trade Organization (WTO) Law', 'International Environmental Law', 'International Criminal & Humanitarian Law', 'Drafting International Legal Instruments'] },
      { year: 'Year 4: Capstone & Practice', ects: '60 ECTS', courses: ['Senior International Moot Court Capstone I & II', 'Cross-Border Mergers, Acquisitions & Investment', 'International Intellectual Property Law', 'Diplomatic & Consular Law', 'Mandatory Legal Internship', 'Legal Ethics'] }
    ],
    facilities: [
      { icon: 'fa-gavel', title: 'International Moot Court Chamber', desc: 'Configured for multi-arbitrator hearings and competitive international moot court simulations.' },
      { icon: 'fa-book-atlas', title: 'International Treaty & Jurisprudence Library', desc: 'ICJ reports, UN treaty series, arbitral award digests, and digital legal databases.' },
      { icon: 'fa-scale-balanced', title: 'Arbitration Deliberation Suite', desc: 'Confidential hearing rooms for simulated commercial arbitration and conciliation.' },
      { icon: 'fa-globe', title: 'Human Rights Legal Clinic', desc: 'Clinical research suite supporting international human rights documentation and amicus briefs.' }
    ],
    careers: [
      { icon: 'fa-scale-balanced', title: 'International Legal Counsel', desc: 'Drafting cross-border commercial joint ventures and compliance policies for multinationals.' },
      { icon: 'fa-gavel', title: 'Commercial Arbitration Specialist', desc: 'Representing claimants and respondents in institutional international arbitration proceedings.' },
      { icon: 'fa-ship', title: 'Maritime & Shipping Legal Advisor', desc: 'Advising maritime shipping fleets on charter parties, marine insurance, and boundary claims.' },
      { icon: 'fa-landmark', title: 'Diplomatic Legal Attaché', desc: 'Serving foreign ministries and diplomatic delegations on bilateral treaty ratifications.' },
      { icon: 'fa-hand-holding-heart', title: 'Human Rights Advocate', desc: 'Filing complaints before international regional human rights courts and tribunals.' },
      { icon: 'fa-shield', title: 'Corporate Compliance Officer', desc: 'Ensuring global corporate alignment with international anti-money laundering and trade sanctions.' }
    ]
  },

  'english-language-teaching': {
    banner: '/assets/unsplash-4.jpg',
    subtitle: 'Second language acquisition, applied linguistics, curriculum design, and innovative microteaching pedagogy taught in English.',
    lead: 'The Bachelor of Arts in English Language Teaching (ELT) at Cyprus Aydin University prepares certified English educators capable of inspiring language mastery across diverse international classrooms.',
    overview2: 'Students master modern pedagogical methodology, second language acquisition research, phonetics, English literature analysis, language assessment strategies, and educational technology.',
    overview3: 'In our Microteaching Video Laboratory, students conduct recorded simulation classes, receiving structured mentor feedback before undertaking comprehensive teaching internships in partner schools.',
    pillars: [
      { icon: 'fa-chalkboard-user', title: 'Microteaching Simulation', desc: 'Recorded lesson presentations with multi-angle cameras, vocal pacing reviews, and peer critiques.' },
      { icon: 'fa-language', title: 'Linguistics & Language Acquisition', desc: 'Phonetics, morphology, syntax, psycholinguistics, and bilingual cognitive development.' },
      { icon: 'fa-school', title: 'School Practicum Residencies', desc: 'Mandatory semester-long student-teaching practicum in accredited public and international schools.' }
    ],
    curriculum: [
      { year: 'Year 1: Language & Educational Basics', ects: '60 ECTS', courses: ['Contextual Grammar & Advanced Writing', 'Listening & Pronunciation (Phonetics)', 'Reading Skills & Literary Analysis', 'Introduction to Educational Sciences', 'Educational Psychology', 'Oral Communication Skills'] },
      { year: 'Year 2: Linguistics & Pedagogy', ects: '60 ECTS', courses: ['English Linguistics I & II', 'Second Language Acquisition Theories', 'Teaching English to Young Learners', 'Instructional Principles & Methods', 'Approaches to English Language Teaching', 'Turkish-English Translation Practice'] },
      { year: 'Year 3: Teaching Skills & Materials', ects: '60 ECTS', courses: ['Teaching Language Skills: Reading & Writing', 'Teaching Language Skills: Listening & Speaking', 'ELT Materials Development & Adaptation', 'Literature in English Teaching (Poetry & Drama)', 'Classroom Management in ELT', 'Language Assessment & Testing'] },
      { year: 'Year 4: Practicum & Capstone', ects: '60 ECTS', courses: ['School Experience Practicum I (Observation)', 'Teaching Practice Internship II (Live Teaching)', 'Special Education & Inclusive Classrooms', 'Research Methods in Applied Linguistics', 'Senior ELT Capstone Project', 'Educational Ethics & Counseling'] }
    ],
    facilities: [
      { icon: 'fa-video', title: 'Microteaching Simulation Studio', desc: 'Equipped with tracking cameras, smart boards, and digital review stations for teaching practice.' },
      { icon: 'fa-headphones', title: 'Language Acquisition Resource Lab', desc: 'Digital audio listening carrels, phonetics speech-analysis software, and graded reading libraries.' },
      { icon: 'fa-display', title: 'Digital Pedagogy & Media Suite', desc: 'Interactive whiteboards, podcast creation kits, and online lesson authoring tools.' },
      { icon: 'fa-book-open-reader', title: 'Curriculum & Textbook Design Lab', desc: 'Comprehensive archive of international ELT textbooks (Cambridge, Oxford) and workbooks.' }
    ],
    careers: [
      { icon: 'fa-chalkboard-user', title: 'English Teacher (K-12)', desc: 'Teaching English in public and private primary, middle, and high schools globally.' },
      { icon: 'fa-graduation-cap', title: 'University English Prep Instructor', desc: 'Delivering academic English for university preparatory schools and foundation years.' },
      { icon: 'fa-globe', title: 'International School Educator', desc: 'Teaching in IB (International Baccalaureate) and Cambridge accredited international schools.' },
      { icon: 'fa-book', title: 'Curriculum & Textbook Developer', desc: 'Designing English language coursebooks, digital workbooks, and pedagogical syllabi.' },
      { icon: 'fa-language', title: 'Language Assessment Specialist', desc: 'Creating and evaluating standardized English proficiency tests (IELTS, TOEFL, Cambridge).' },
      { icon: 'fa-laptop', title: 'EdTech Language Content Designer', desc: 'Authoring interactive e-learning modules, language learning mobile apps, and video courses.' }
    ]
  },

  'guidance-and-psychological-counselling': {
    banner: '/assets/unsplash-4.jpg',
    subtitle: 'Bireysel ve grupla psikolojik danışma, ergen gelişimi, okul rehberliği, kariyer danışmanlığı ve kriz müdahalesi.',
    lead: 'Kıbrıs Aydın Üniversitesi Rehberlik ve Psikolojik Danışmanlık (PDR) Bölümü, bireylerin kişisel, sosyal, eğitsel ve mesleki potansiyellerini en üst düzeyde gerçekleştirmelerine rehberlik eden uzmanlar yetiştirir.',
    overview2: 'Müfredatımız gelişim psikolojisi, danışma kuramları, test ve test dışı bireyi tanıma teknikleri, aile danışmanlığı ve kriz müdahalesi alanlarında kapsamlı teorik ve pratik derslerden oluşur.',
    overview3: 'Öğrencilerimiz fakültemiz bünyesindeki bireysel ve grupla danışma odalarında süpervizyon altında seans simülasyonları gerçekleştirir; okullarda staj yaparak sahaya tam donanımlı adım atar.',
    pillars: [
      { icon: 'fa-comments', title: 'Uygulamalı Danışma Seansları', desc: 'Kayıt ve süpervizyon altında yürütülen bireysel ve grupla psikolojik danışma simülasyonları.' },
      { icon: 'fa-clipboard-check', title: 'Ölçme ve Değerlendirme Yetkinliği', desc: 'Yetenek, ilgi, kişilik ve uyum testlerinin uygulanması, puanlanması ve raporlanması.' },
      { icon: 'fa-school', title: 'K-12 Okul Rehberlik Stajı', desc: 'Devlet ve özel okullarda rehberlik servislerinde haftalık zorunlu alan stajı.' }
    ],
    curriculum: [
      { year: '1. Yıl: Eğitim ve Psikoloji Temelleri', ects: '60 ECTS', courses: ['Rehberlik ve Psikolojik Danışmaya Giriş', 'Eğitimin Felsefi ve Sosyal Temelleri', 'Gelişim Psikolojisi I (Çocukluk)', 'Gelişim Psikolojisi II (Ergenlik ve Yetişkinlik)', 'Fizyolojik Psikoloji', 'Eğitim İstatistiği'] },
      { year: '2. Yıl: Kuramlar ve Değerlendirme', ects: '60 ECTS', courses: ['Psikolojik Danışma İlke ve Teknikleri', 'Psikolojik Danışma Kuramları', 'Bireyi Tanıma Teknikleri (Test Dışı)', 'Kişilik Kuramları ve Psikopatoloji', 'Sosyal Psikoloji', 'Öğrenme Psikolojisi'] },
      { year: '3. Yıl: Özel Alan Danışmanlığı', ects: '60 ECTS', courses: ['Grupla Psikolojik Danışma Kuram ve Uygulaması', 'Mesleki Rehberlik ve Kariyer Danışmanlığı', 'Aile Danışmanlığı ve Ebeveyn Eğitimi', 'Psikolojik Testler ve Ölçme Araçları', 'Özel Eğitim ve Kaynaştırma', 'Sınıf Yönetimi'] },
      { year: '4. Yıl: Süpervizyon ve Saha Stajı', ects: '60 ECTS', courses: ['Bireyle Psikolojik Danışma Uygulaması (Süpervizyonlu)', 'Okullarda RPD Alan Çalışması I & II (Staj)', 'Kriz Müdahalesi ve Travma Danışmanlığı', 'RPD’de Etik ve Yasal Konular', 'Mezuniyet Araştırma Projesi', 'Bağımlılık Danışmanlığı'] }
    ],
    facilities: [
      { icon: 'fa-comments', title: 'Bireysel Psikolojik Danışma Odası', desc: 'Ses yalıtımlı, kamera ve mikrofon donanımlı bireysel görüşme kabini.' },
      { icon: 'fa-users', title: 'Grupla Psikolojik Danışma Salonu', desc: 'Daire düzeninde grup etkileşim ve drama seansları için tasarlanmış salon.' },
      { icon: 'fa-clipboard-list', title: 'Psikometrik Test ve Envanter Arşivi', desc: 'Kariyer envanterleri, problem tarama listeleri ve zeka-yetenek testleri.' },
      { icon: 'fa-eye', title: 'Süpervizyon ve Gözlem Odası', desc: 'Öğretim üyelerinin danışma seanslarını canlı izleyip anında geri bildirim verdiği oda.' }
    ],
    careers: [
      { icon: 'fa-school', title: 'Okul Psikolojik Danışmanı / Rehber Öğretmen', desc: 'Anaokulu, ilkokul, ortaokul ve liselerde öğrencilere eğitsel ve kişisel rehberlik yapma.' },
      { icon: 'fa-building', title: 'RAM (Rehberlik ve Araştırma Merkezi) Uzmanı', desc: 'Özel eğitim ve tanılama merkezlerinde eğitsel değerlendirme yürütme.' },
      { icon: 'fa-house-user', title: 'Aile ve Evlilik Danışmanı', desc: 'Aile danışmanlığı merkezlerinde çiftlere ve ailelere ilişki desteği sağlama.' },
      { icon: 'fa-compass', title: 'Kariyer ve Tercih Danışmanı', desc: 'Öğrencilere üniversite ve kariyer tercih dönemlerinde profesyonel yol haritası çizme.' },
      { icon: 'fa-briefcase', title: 'Kurumsal İnsan Kaynakları Uzmanı', desc: 'Şirketlerde çalışan esenliği, oryantasyon, eğitim ve mülakat danışmanlığı.' },
      { icon: 'fa-heart-circle-check', title: 'Özel Danışmanlık Merkezi Yöneticisi', desc: 'Kendi danışmanlık merkezinde bireylere yaşam ve gelişim koçluğu/danışmanlığı verme.' }
    ]
  },

  'turkish-language-teaching': {
    banner: '/assets/unsplash-4.jpg',
    subtitle: 'Türk dili grameri, klasik ve çağdaş edebiyat, okuma-yazma pedagojisi, ders kitabı tasarımı ve yabancılara Türkçe öğretimi.',
    lead: 'Kıbrıs Aydın Üniversitesi Türkçe Öğretmenliği Bölümü, anadil bilincini aşılayan, Türk edebiyatının zengin birikimini çağdaş pedagojiyle aktaran eğitimciler yetiştirir.',
    overview2: 'Öğrencilerimiz Türk dilinin tarihi evrelerinden çağdaş dilbilgisi kurallarına, çocuk edebiyatından dört temel dil becerisinin (okuma, dinleme, konuşma, yazma) öğretimine kadar derinlemesine uzmanlaşır.',
    overview3: 'Mikroöğretim stüdyomuzda gerçekleştirilen örnek ders sunumları ve partner okullardaki öğretmenlik uygulamaları sayesinde mezunlarımız sınıf yönetimi ve müfredat aktarımında üstün yetkinlik kazanır.',
    pillars: [
      { icon: 'fa-book-open', title: 'Dört Temel Dil Becerisi Pedagojisi', desc: 'Okuduğunu anlama, yaratıcı yazma, etkili dinleme ve hitabet öğretim metodolojileri.' },
      { icon: 'fa-pen-nib', title: 'Edebiyat ve Dil Bilimi Derinliği', desc: 'Eski Türk edebiyatı, divan şiiri, halk edebiyatı ve çağdaş Türk edebiyatı tahlilleri.' },
      { icon: 'fa-globe', title: 'Yabancılara Türkçe Öğretimi (TÖMER)', desc: 'Farklı anadillere sahip yabancı öğrencilere Türkçe öğretim teknikleri ve materyal tasarımı.' }
    ],
    curriculum: [
      { year: '1. Yıl: Dil ve Edebiyat Temelleri', ects: '60 ECTS', courses: ['Türk Dil Bilgisi I (Ses ve Şekil Bilgisi)', 'Türk Dil Bilgisi II (Cümle Bilgisi)', 'Edebiyat Bilgi ve Kuramları I & II', 'Eğitime Giriş ve Eğitim Felsefesi', 'Eğitim Psikolojisi', 'Yazılı ve Sözlü Anlatım'] },
      { year: '2. Yıl: Tarih ve Dönemler', ects: '60 ECTS', courses: ['Eski Türk Edebiyatı I & II', 'Yeni Türk Edebiyatı I & II', 'Türk Halk Edebiyatı I & II', 'Çocuk Edebiyatı ve Medya', 'Genel Dilbilim Esasları', 'Öğretim İlke ve Yöntemleri'] },
      { year: '3. Yıl: Beceriler ve Yöntem', ects: '60 ECTS', courses: ['Anlama Teknikleri: Okuma ve Dinleme Öğretimi', 'Anlatma Teknikleri: Konuşma ve Yazma Öğretimi', 'Dil Bilgisi Öğretimi', 'Türkçe Ders Kitabı İncelemesi', 'Öğretim Teknolojileri ve Materyal Tasarımı', 'Eğitimde Ölçme ve Değerlendirme'] },
      { year: '4. Yıl: Öğretmenlik Uygulaması', ects: '60 ECTS', courses: ['Öğretmenlik Uygulaması I & II (Okullarda Staj)', 'Yabancılara Türkçe Öğretimi Yöntemleri', 'Türkçe Öğretiminde Tiyatro ve Yaratıcı Drama', 'Özel Eğitim ve Kapsayıcı Sınıflar', 'Sınıf Yönetimi', 'Öğretmenlik Meslek Etiği'] }
    ],
    facilities: [
      { icon: 'fa-chalkboard', title: 'Mikroöğretim Uygulama Sınıfı', desc: 'Akıllı tahta ve kamera kayıt sistemiyle örnek ders anlatımlarının yapıldığı salon.' },
      { icon: 'fa-book', title: 'Türk Dili ve Edebiyatı Kitaplığı', desc: 'Türk edebiyatı klasikleri, divanlar, antolojiler ve akademik dilbilim kaynakları.' },
      { icon: 'fa-feather', title: 'Yaratıcı Yazarlık ve Materyal Odası', desc: 'Ders çalışma kağıtları, dil kartları ve eğitici oyunların geliştirildiği atölye.' },
      { icon: 'fa-masks-theater', title: 'Drama ve Diksiyon Çalışma Salonu', desc: 'Metin canlandırması, tiyatro çalışmaları ve ses-nefes diksiyon egzersiz alanı.' }
    ],
    careers: [
      { icon: 'fa-chalkboard-user', title: 'Türkçe Öğretmeni (K-12)', desc: 'Devlet ve özel ortaokullarda Türkçe derslerini yürütme.' },
      { icon: 'fa-graduation-cap', title: 'Lise Türk Dili ve Edebiyatı Öğretmeni', desc: 'Ortaöğretim kurumlarında edebiyat ve dilbilgisi derslerini verme.' },
      { icon: 'fa-earth-europe', title: 'Yabancılara Türkçe Öğreticisi (TÖMER)', desc: 'Yurtiçi ve yurtdışı üniversite dil merkezlerinde yabancı öğrencilere Türkçe eğitimi verme.' },
      { icon: 'fa-pen-fancy', title: 'Ders Kitabı Yazarı ve Editör', desc: 'Eğitim yayın evlerinde Türkçe ders kitabı, test ve eğitim materyali hazırlama.' },
      { icon: 'fa-newspaper', title: 'Metin Yazarı ve Düzeltmen (Redaktör)', desc: 'Medya, yayıncılık ve reklam ajanslarında metin redaksiyonu ve tashih yapma.' },
      { icon: 'fa-user-tie', title: 'Özel Kurs ve Etüt Merkezi Yöneticisi', desc: 'Özel eğitim kurumlarında Türkçe zümre başkanlığı ve eğitim yöneticiliği.' }
    ]
  },

  'gastronomy-and-culinary-arts': {
    banner: '/assets/untitled2-11-88f245d7e3_5c234f69.jpg',
    subtitle: 'Mutfak sanatları, pastacılık, Akdeniz ve Osmanlı mutfak kültürü, gıda hijyeni, menü mühendisliği ve restoran yöneticiliği.',
    lead: 'Kıbrıs Aydın Üniversitesi Gastronomi ve Mutfak Sanatları Bölümü, yemek pişirme tekniklerini kültürel miras ve modern işletmecilik vizyonuyla buluşturan profesyonel şefler yetiştirir.',
    overview2: 'Her öğrenciye özel paslanmaz çelik endüstriyel tezgahların bulunduğu son teknoloji mutfaklarımızda; bıçak becerileri, soslar, et-balık pişirme teknikleri, pastacılık ve moleküler gastronomi öğretilir.',
    overview3: 'Kıbrıs’ın seçkin 5 yıldızlı tatil köylerinde ve Akdeniz restoranlarında gerçekleştirilen zorunlu yaz stajları, mezunlarımıza mezuniyetin hemen ardından uluslararası mutfak kapılarını aralar.',
    pillars: [
      { icon: 'fa-fire-burner', title: 'Bireysel Profesyonel Tezgahlar', desc: 'İndüksiyon ocaklar, profesyonel fırınlar ve kişisel şef bıçak setleriyle donatılmış mutfak.' },
      { icon: 'fa-bread-slice', title: 'Pastacılık ve Ekmekçilik Sanatı', desc: 'Isı kontrollü çikolata ve pasta odasında artisan ekmek ve tatlı üretimi.' },
      { icon: 'fa-utensils', title: 'Akdeniz ve Dünya Mutfakları', desc: 'Yerel Kıbrıs ve Ege lezzetlerinden Fransız, İtalyan ve Uzak Doğu mutfaklarına kapsamlı vizyon.' }
    ],
    curriculum: [
      { year: '1. Yıl: Mutfak Temelleri', ects: '60 ECTS', courses: ['Temel Mutfak Teknikleri I & II (Pratik)', 'Mutfak Hijyeni ve Gıda Güvenliği (HACCP)', 'Beslenme İlkeleri ve Gıda Kimyası', 'Gastronomiye Giriş ve Mutfak Tarihi', 'Genel İşletme', 'Mesleki Yabancı Dil I & II'] },
      { year: '2. Yıl: Teknik ve Pişirme Sanatı', ects: '60 ECTS', courses: ['Temel Pişirme Yöntemleri: Et, Tavuk ve Balık', 'Soğuk Mutfak ve Büfe Tasarımı', 'Temel Pastacılık ve Fırıncılık Esasları', 'Mutfak Maliyet Kontrolü ve Satın Alma', 'Gıda ve İçecek Servis Teknikleri', 'Akdeniz Mutfak Kültürü'] },
      { year: '3. Yıl: Dünya Mutfakları ve İleri Pastacılık', ects: '60 ECTS', courses: ['Dünya Mutfakları (Avrupa & Asya)', 'Osmanlı ve Türk Mutfak Mirası', 'İleri Pastacılık ve Çikolata Sanatı', 'Menü Planlama ve Mühendisliği', 'Ziyafet ve İkram (Catering) Yönetimi', 'Şarap ve İçecek Kültürü (Öncesi/Eşleşme)'] },
      { year: '4. Yıl: Yenilik ve Restoran Yönetimi', ects: '60 ECTS', courses: ['Moleküler Gastronomi ve Füzyon Mutfak', 'Restoran Kurulumu ve İşletmeciliği', 'Mezuniyet Tabağı Tasarım Projesi (Jüri Değerlendirmesi)', 'Yemek Fotoğrafçılığı ve Stilistliği', 'Zorunlu 5 Yıldızlı Otel / Restoran Stajı', 'Gastronomide Girişimcilik'] }
    ],
    facilities: [
      { icon: 'fa-kitchen-set', title: 'Endüstriyel Uygulama Mutfağı', desc: 'Aynalı demonstrasyon tavanı ve 20 bağımsız öğrenci şef istasyonu.' },
      { icon: 'fa-cake-candles', title: 'Pastacılık ve Çikolata Atölyesi', desc: 'Mermer tezgahlar, temperleme makineleri ve mayalama fırınları.' },
      { icon: 'fa-wine-glass', title: 'Servis ve Barista Simülasyon Salonu', desc: 'Restoran masa düzeni, şarap servisi ve espresso barista ekipmanları.' },
      { icon: 'fa-temperature-low', title: 'Soğuk Hava ve Depolama Üniteleri', desc: 'HACCP standartlarına uygun et, sebze ve kuru gıda muhafaza depoları.' }
    ],
    careers: [
      { icon: 'fa-hat-chef', title: 'Yönetici Şef (Executive Chef)', desc: 'Lüks otel ve restoran zincirlerinde mutfak operasyonlarını ve personeli yönetme.' },
      { icon: 'fa-utensils', title: 'Bölüm Şefi (Chef de Partie)', desc: 'Sıcak, soğuk veya ızgara istasyonlarında tabak hazırlama ve reçete uygulama.' },
      { icon: 'fa-cake-candles', title: 'Pastacı Şefi (Pastry Chef)', desc: 'Tatlı menüleri, artisan ekmekler, çikolata ve pasta tasarımları üretme.' },
      { icon: 'fa-building', title: 'Restoran İşletmecisi ve Girişimci', desc: 'Kendi fine-dining restoranını, kafesini veya butik fırınını kurma ve işletme.' },
      { icon: 'fa-clipboard-list', title: 'Yiyecek-İçecek (F&B) Müdürü', desc: 'Otellerde tüm restoran, bar ve ziyafet gelir-giderlerini koordine etme.' },
      { icon: 'fa-camera', title: 'Yemek Stilisti ve Gastronomi Yazarı', desc: 'Dergi, TV ve dijital medya için yemek fotoğrafçılığı ve lezzet eleştirmenliği.' }
    ]
  },

  'tourism-and-hospitality': {
    banner: '/assets/untitled2-11-88f245d7e3_5c234f69.jpg',
    subtitle: 'Resort hotel management, international hospitality marketing, front-office systems (Opera), guest relations, and tourism economics.',
    lead: 'The Bachelor of Applied Science in Tourism and Hospitality at Cyprus Aydin University prepares executive managers for the global hotel, luxury resort, and international leisure industries.',
    overview2: 'Located in the premier Mediterranean tourist destination of Kyrenia, students master resort operations, revenue management, front-office property systems, banqueting, and airline travel tourism.',
    overview3: 'Our industry-integrated curriculum guarantees summer management internships at partner 5-star beachfront luxury resorts, leading directly to international hospitality careers upon graduation.',
    pillars: [
      { icon: 'fa-hotel', title: 'Resort & Hotel Operations', desc: 'Rooms division management, housekeeping standards, front-office reservation systems, and guest loyalty.' },
      { icon: 'fa-chart-line', title: 'Revenue & Yield Optimization', desc: 'Dynamic room pricing, OTA distribution channels (Booking, Expedia), and banquet profitability.' },
      { icon: 'fa-umbrella-beach', title: 'Mediterranean Resort Practicum', desc: 'Hands-on management training within Cyprus’s thriving 5-star luxury hospitality sector.' }
    ],
    curriculum: [
      { year: 'Year 1: Hospitality Foundations', ects: '60 ECTS', courses: ['Introduction to Tourism & Hospitality Management', 'Principles of Management & Organization', 'Tourism Economics & Mediterranean Geography', 'Hospitality Accounting I', 'Business Communication & Hospitality English', 'Information Technology for Hotels'] },
      { year: 'Year 2: Operational Systems', ects: '60 ECTS', courses: ['Front Office Operations & Lab (Opera PMS)', 'Housekeeping Management & Sanitation', 'Food & Beverage Service Management', 'Hospitality Marketing & Sales', 'Cost Control in Hospitality', 'Human Resource Management in Tourism'] },
      { year: 'Year 3: Strategic Hospitality', ects: '60 ECTS', courses: ['Resort Planning, Development & Facilities', 'Revenue Management & Dynamic Pricing', 'Banqueting, Events & Convention Tourism (MICE)', 'Tourism Law, Safety & Consumer Rights', 'Consumer Behavior in Tourism', 'Cross-Cultural Communication'] },
      { year: 'Year 4: Executive Leadership & Capstone', ects: '60 ECTS', courses: ['Strategic Management in Hospitality', 'Sustainable Tourism & Eco-Resort Practices', 'Senior Hospitality Management Capstone Project', 'Hospitality Entrepreneurship & Innovation', 'Mandatory 5-Star Resort Summer Internship', 'Professional Ethics'] }
    ],
    facilities: [
      { icon: 'fa-bell-concierge', title: 'Hotel Front-Desk Simulation Suite', desc: 'Mock check-in lobby with automated reservation terminals running Opera PMS software.' },
      { icon: 'fa-wine-glass', title: 'Formal Dining & Mixology Studio', desc: 'Fine-dining banquet tables, silver service cutlery sets, and non-alcoholic cocktail stations.' },
      { icon: 'fa-bed', title: 'Model Hotel Guest Room', desc: 'Inspection suite for housekeeping standards, amenities staging, and room ergonomics.' },
      { icon: 'fa-computer', title: 'Tourism Distribution Computer Lab', desc: 'Global Distribution Systems (Amadeus / Sabre) terminals for travel booking simulations.' }
    ],
    careers: [
      { icon: 'fa-hotel', title: 'Hotel General Manager (GM)', desc: 'Directing full operations, profitability, guest satisfaction, and brand standards.' },
      { icon: 'fa-bell-concierge', title: 'Front Office Manager', desc: 'Supervising guest reception, VIP services, concierge teams, and room allocations.' },
      { icon: 'fa-utensils', title: 'Food & Beverage (F&B) Director', desc: 'Overseeing hotel restaurants, bars, room service, and banquet kitchen operations.' },
      { icon: 'fa-chart-line', title: 'Revenue & Yield Manager', desc: 'Maximizing RevPAR (Revenue Per Available Room) across digital reservation channels.' },
      { icon: 'fa-calendar-check', title: 'Event & Conference (MICE) Director', desc: 'Organizing international corporate summits, weddings, and convention banquets.' },
      { icon: 'fa-plane-departure', title: 'Tourism Destination & Marketing Executive', desc: 'Promoting national and regional tourism campaigns for travel boards and airlines.' }
    ]
  }
};

function renderHTML(prog) {
  const custom = programDetailsMap[prog.slug] || {};
  const faculty = facultyMapping[prog.Department] || {
    url: '/departments.html',
    defaultBanner: '/assets/unsplash-2.jpg',
    categoryLabel: 'ACADEMIC PROGRAMME'
  };

  const banner = custom.banner || prog.banner || faculty.defaultBanner;
  const subtitle = custom.subtitle || `${prog['Program Name']} at Cyprus Aydin University offers comprehensive theoretical education and applied laboratory practice.`;
  const lead = custom.lead || `${prog['Program Name']} at Cyprus Aydin University equips students with modern professional skills and academic foundations.`;
  const overview2 = custom.overview2 || `The curriculum integrates contemporary disciplinary methods, laboratory experiments, and industrial project experience in Kyrenia.`;
  const overview3 = custom.overview3 || `Under our distinguished academic faculty, students gain the analytical dexterity and ethical grounding required for successful international careers.`;

  const isAssociate = prog['Degree Level'] === 'Associate';
  const isMaster = prog['Degree Level'] === 'Master';
  const isPhD = prog['Degree Level'] === 'Ph.D.';
  const isPrep = prog['Degree Level'] === 'Preparatory';

  const duration = prog.Duration || (isAssociate ? '2 Years' : (isMaster ? '2 Years' : (isPhD ? '4 Years' : (isPrep ? '1 Year' : '4 Years'))));
  let defaultEcts = '240 ECTS';
  if (isAssociate || isMaster) defaultEcts = '120 ECTS';
  else if (isPrep) defaultEcts = '60 ECTS';
  else if (duration.includes('5')) defaultEcts = '300 ECTS';
  const ects = custom.ects || defaultEcts;

  const language = prog.Language || 'English';
  const tuition = prog['Price / Tuition'] || (isMaster ? '4,500 EUR total' : (isAssociate ? '4,000 EUR per year' : '10,000 EUR per year'));
  const accreditation = prog.accreditation || 'YÖDAK Accredited';

  const pillars = custom.pillars || (isAssociate ? [
    { icon: 'fa-wrench', title: 'Applied Technical Competence', desc: 'Practical hands-on training directly tailored to professional vocational standards.' },
    { icon: 'fa-hospital-user', title: 'Clinical & Field Practicums', desc: 'Supervised clinical rotations and industry workplace hours across Northern Cyprus.' },
    { icon: 'fa-certificate', title: 'Professional Certification', desc: 'Curriculum structured to prepare students for rapid job market integration.' }
  ] : (isMaster || isPhD ? [
    { icon: 'fa-microscope', title: 'Advanced Research Methodology', desc: 'Rigorous quantitative and qualitative methodologies for original scholarly investigation.' },
    { icon: 'fa-brain', title: 'Specialized Subject Mastery', desc: 'Deep dive into contemporary theories, case literature, and advanced domain paradigms.' },
    { icon: 'fa-scroll', title: 'Academic Publication & Defense', desc: 'Mentorship towards high-impact international journal submissions and thesis defense.' }
  ] : [
    { icon: 'fa-book-open', title: 'Rigorous Academic Foundation', desc: 'Comprehensive theoretical depth and applied problem-solving methodologies.' },
    { icon: 'fa-laptop-code', title: 'Hands-On Laboratory Practice', desc: 'Modern workstations, simulation software, and specialized equipment.' },
    { icon: 'fa-handshake', title: 'Industry Connections & Capstones', desc: 'Real-world internships, capstone design projects, and career placement support.' }
  ]));

  let defaultCurriculum = [
    { year: 'Year 1: Foundations', ects: '60 ECTS', courses: ['Introduction to Discipline', 'Calculus / Applied Mathematics', 'Core Foundational Sciences', 'Academic Writing & Communication', 'Computer Applications', 'Departmental Elective'] },
    { year: 'Year 2: Intermediate Systems', ects: '60 ECTS', courses: ['Disciplinary Principles I & II', 'Applied Laboratory Practice', 'Statistics & Research Methodology', 'Field-Specific Theory', 'Professional Ethics', 'Departmental Elective'] },
    { year: 'Year 3: Advanced Topics', ects: '60 ECTS', courses: ['Specialized Coursework I & II', 'Laboratory & Experimental Methods', 'Applied Project Design', 'Interdisciplinary Elective', 'Industry Case Studies', 'Summer Practicum'] },
    { year: 'Year 4: Capstone & Practice', ects: '60 ECTS', courses: ['Senior Graduation Project I & II', 'Advanced Departmental Seminar', 'Specialized Technical Elective', 'Industrial Internship Practicum', 'Professional Portfolio', 'Ethics & Leadership'] }
  ];

  if (isAssociate) {
    defaultCurriculum = [
      { year: 'Year 1: Core Vocational Foundations', ects: '60 ECTS', courses: ['Foundations of Discipline', 'Applied Practical Skills & Equipment', 'Occupational Health & Safety', 'Professional Communication & Terminology', 'Information Technologies', 'Core Vocational Elective'] },
      { year: 'Year 2: Advanced Practice & Practicum', ects: '60 ECTS', courses: ['Advanced Technical Practicum', 'Field Rotations & Clinical Hours', 'Industry Case Analysis', 'Graduation Vocational Project', 'Mandatory Summer Industrial Internship', 'Workplace Ethics & Readiness'] }
    ];
  } else if (isMaster) {
    defaultCurriculum = [
      { year: 'Year 1: Advanced Graduate Seminars', ects: '60 ECTS', courses: ['Advanced Research Methodologies & Ethics', 'Contemporary Theoretical Foundations', 'Quantitative & Qualitative Data Analysis', 'Advanced Graduate Elective I', 'Advanced Graduate Elective II', 'Master’s Thesis Proposal Seminar'] },
      { year: 'Year 2: Research Thesis & Defense', ects: '60 ECTS', courses: ['Independent Master’s Thesis Research I', 'Master’s Thesis Research II & Colloquium', 'Scholarly Writing & Manuscript Prep', 'Oral Thesis Defense before Academic Jury'] }
    ];
  } else if (isPhD) {
    defaultCurriculum = [
      { year: 'Year 1: Doctoral Seminars & Epistemology', ects: '60 ECTS', courses: ['Advanced Epistemology & Scholarly Inquiry', 'Doctoral Seminar in Subject Frontiers', 'Specialized Research Design Workshop', 'Doctoral Advanced Elective'] },
      { year: 'Year 2: Comprehensive Exam & Proposal', ects: '60 ECTS', courses: ['Doctoral Comprehensive Qualifying Exam', 'Ph.D. Dissertation Proposal Colloquium', 'Advanced Specialized Laboratory Research'] },
      { year: 'Year 3 & 4: Original Dissertation', ects: '120 ECTS', courses: ['Independent Doctoral Dissertation Research I-IV', 'Peer-Reviewed Journal Publication Requirement', 'Departmental Doctoral Defense Jury'] }
    ];
  } else if (isPrep) {
    defaultCurriculum = [
      { year: 'Semester 1: Foundation English', ects: '30 ECTS', courses: ['Integrated Language Skills (A2/B1)', 'Grammar & Core Vocabulary Acquisition', 'Listening Comprehension & Note Taking', 'Interactive Conversational Fluency'] },
      { year: 'Semester 2: Academic English', ects: '30 ECTS', courses: ['Academic Reading & Critical Analysis', 'Academic Writing & Research Essays', 'Public Speaking & Oral Presentations', 'CAU English Proficiency Exam Preparation'] }
    ];
  }

  const curriculum = custom.curriculum || defaultCurriculum;

  const facilities = custom.facilities || [
    { icon: 'fa-desktop', title: 'Specialized Computing Lab', desc: 'Modern workstations equipped with discipline-specific simulation and analysis software.' },
    { icon: 'fa-flask', title: 'Applied Experimental Facility', desc: 'Laboratory benches for empirical measurements, prototyping, and testing.' },
    { icon: 'fa-book', title: 'Subject Research Library', desc: 'Comprehensive access to print journals, digital databases, and academic literature.' },
    { icon: 'fa-users', title: 'Collaborative Project Room', desc: 'Breakout spaces configured for team brainstorming, presentations, and capstones.' }
  ];

  const careers = custom.careers || [
    { icon: 'fa-briefcase', title: 'Industry Specialist', desc: 'Executing professional technical or management responsibilities in leading organizations.' },
    { icon: 'fa-chart-line', title: 'Project & Operations Manager', desc: 'Leading cross-functional project teams, budgets, and operational roadmaps.' },
    { icon: 'fa-magnifying-glass', title: 'Research & Development Specialist', desc: 'Conducting advanced investigative studies and product development.' },
    { icon: 'fa-building', title: 'Corporate Consultant', desc: 'Advising enterprise clients on strategic, technical, and regulatory solutions.' },
    { icon: 'fa-rocket', title: 'Entrepreneur & Founder', desc: 'Launching private practices, consulting firms, or commercial startup ventures.' },
    { icon: 'fa-graduation-cap', title: 'Academic / Master’s Candidate', desc: 'Pursuing graduate master’s and doctoral degrees at top international universities.' }
  ];

  // Related programs in same department
  const relatedPrograms = catalog
    .filter(x => x.Department === prog.Department && x.slug !== prog.slug && x['Degree Level'] === prog['Degree Level'])
    .slice(0, 5)
    .map(x => `<li><a href="/programs/${x.slug}.html">${x['Program Name']} <small class="text-muted">${x.Duration || '4 Years'}</small></a></li>`)
    .join('\n                ');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="${prog['Program Name']} at Cyprus Aydin University in Kyrenia. ${prog['Degree Level']} program in ${language}. ${duration}. Accredited by ${accreditation}." />
  <title>${prog['Program Name']} | Cyprus Aydin University</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="/assets/vendor/fonts/space-grotesk.css" rel="stylesheet" />
  <link href="/assets/vendor/bootstrap/bootstrap.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="/assets/vendor/fontawesome/css/all.min.css" />
  <link rel="stylesheet" href="/style.css" />
  <link rel="stylesheet" href="/cau-navigation-theme.css" />
  <link rel="stylesheet" href="/cau-responsive.css" />
  <link rel="stylesheet" href="/program-details.css" />
  <link rel="icon" type="image/png" href="/assets/cau-mark_c0289719.png" />
  <meta property="og:site_name" content="Cyprus Aydin University" />
  <meta property="og:title" content="${prog['Program Name']} | Cyprus Aydin University" />
  <meta property="og:description" content="${prog['Program Name']} at Cyprus Aydin University. ${prog['Degree Level']} program in ${language}." />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
</head>
<body class="program-detail-page">
  <a class="skip-link" href="#main">Skip to main content</a>
  <header class="site-header container-xxl py-3 py-lg-4"></header>

  <main id="main" class="container-xxl program-detail-main">
    <section class="program-hero section-rule-top">
      <div class="program-hero-content">
        <div class="program-eyebrow-row">
          <div class="d-flex align-items-center gap-2">
            <span class="section-index">PROGRAMME DISCOVERY / ${faculty.categoryLabel}</span>
            <span class="program-badge">${prog['Degree Level']} · ${duration}</span>
          </div>
          <a class="program-back-link" href="${faculty.url}">
            <i class="fa-solid fa-arrow-left me-2"></i>Back to ${prog.Department}
          </a>
        </div>

        <h1>${prog['Program Name']}</h1>
        <p class="program-subtitle">${subtitle}</p>

        <div class="program-meta">
          <span><i class="fa-solid fa-graduation-cap" aria-hidden="true"></i> ${prog['Degree Level']} Degree</span>
          <span><i class="fa-solid fa-language" aria-hidden="true"></i> ${language}</span>
          <span><i class="fa-solid fa-clock" aria-hidden="true"></i> ${duration}</span>
          <span><i class="fa-solid fa-layer-group" aria-hidden="true"></i> ${ects}</span>
          <span><i class="fa-solid fa-euro-sign" aria-hidden="true"></i> ${tuition}</span>
          <span><i class="fa-solid fa-certificate" aria-hidden="true"></i> ${accreditation}</span>
        </div>

        <div class="program-banner-card">
          <img src="${banner}" alt="${prog['Program Name']} laboratory and facilities at CAU" />
          <div class="program-banner-caption">
            <p><i class="fa-solid fa-graduation-cap me-2" aria-hidden="true"></i>${prog['Program Name']} · ${prog.Department}</p>
            <span class="badge-kyrenia">Kyrenia Campus, TRNC</span>
          </div>
        </div>

        <div class="program-metrics-ribbon">
          <div class="program-metric-item">
            <strong>${duration.split(' ')[0]} ${duration.split(' ')[1] || 'Years'}</strong>
            <span>Curriculum Length</span>
            <small>Comprehensive European credit structure</small>
          </div>
          <div class="program-metric-item">
            <strong>${ects}</strong>
            <span>Academic Credits</span>
            <small>ECTS framework with international mobility</small>
          </div>
          <div class="program-metric-item">
            <strong>${language.includes('English') ? '100% English' : 'Turkish'}</strong>
            <span>Medium of Study</span>
            <small>Technical and academic language proficiency</small>
          </div>
          <div class="program-metric-item">
            <strong>${accreditation.split(' ')[0]}</strong>
            <span>Official Accreditation</span>
            <small>Recognized degree with international equivalency</small>
          </div>
        </div>
      </div>
    </section>

    <section class="program-content section-rule-top">
      <div class="row g-5">
        <div class="col-lg-8">
          <!-- Overview -->
          <article class="program-description">
            <div class="program-section-heading">
              <h2>About the Programme</h2>
              <span class="section-count">Overview &amp; Vision</span>
            </div>
            <p class="program-lead-paragraph">${lead}</p>
            <p>${overview2}</p>
            <p>${overview3}</p>
          </article>

          <!-- Core Pillars -->
          <div class="program-section-heading">
            <h2>Core Competencies</h2>
            <span class="section-count">Learning Pillars</span>
          </div>
          <div class="program-pillars-grid">
            ${pillars.map(p => `
            <div class="program-pillar-card">
              <div class="program-pillar-icon"><i class="fa-solid ${p.icon}" aria-hidden="true"></i></div>
              <h3>${p.title}</h3>
              <p>${p.desc}</p>
            </div>`).join('')}
          </div>

          <!-- Curriculum Road Map -->
          <section class="program-curriculum">
            <div class="program-section-heading">
              <h2>Curriculum Road Map</h2>
              <span class="section-count">${duration}</span>
            </div>

            <div class="curriculum-years-grid">
              ${curriculum.map(c => `
              <div class="curriculum-year-box">
                <div class="curriculum-year-header">
                  <h4>${c.year}</h4>
                  <span class="curriculum-ects-badge">${c.ects}</span>
                </div>
                <ul class="curriculum-course-list">
                  ${c.courses.map(course => `<li>${course}</li>`).join('\n                  ')}
                </ul>
              </div>`).join('')}
            </div>
          </section>

          <!-- Facilities -->
          <section class="department-facilities">
            <div class="department-section-heading">
              <h2>Laboratories &amp; Studios</h2>
              <span class="section-count">Infrastructure</span>
            </div>
            <div class="facilities-list-grid">
              ${facilities.map(f => `
              <div class="facility-box">
                <i class="fa-solid ${f.icon}" aria-hidden="true"></i>
                <div>
                  <h4>${f.title}</h4>
                  <p>${f.desc}</p>
                </div>
              </div>`).join('')}
            </div>
          </section>

          <!-- Career Paths -->
          <section class="program-career">
            <div class="program-section-heading">
              <h2>Career Opportunities</h2>
              <span class="section-count">Graduate Pathways</span>
            </div>
            <p>Graduates of the ${prog['Program Name']} programme at Cyprus Aydin University enter high-demand careers across their industry. The CAU Career Center provides active career guidance, internship placements, and corporate recruitment networking.</p>
            <div class="career-cards-grid">
              ${careers.map(car => `
              <div class="career-card">
                <h4><i class="fa-solid ${car.icon}"></i> ${car.title}</h4>
                <p>${car.desc}</p>
              </div>`).join('')}
            </div>
          </section>
        </div>

        <!-- Right Column (Sticky Sidebar) -->
        <aside class="col-lg-4">
          <div class="program-sidebar">

            <!-- Quick Facts Card -->
            <div class="sidebar-card sidebar-facts">
              <h3><i class="fa-solid fa-circle-info" aria-hidden="true"></i> Programme at a Glance</h3>
              <dl>
                <dt>Department</dt>
                <dd>${prog.Department}</dd>

                <dt>Degree Awarded</dt>
                <dd>${prog['Degree Level']} Degree</dd>

                <dt>Standard Duration</dt>
                <dd>${duration}</dd>

                <dt>Total Credits</dt>
                <dd>${ects}</dd>

                <dt>Language of Study</dt>
                <dd>${language}</dd>

                <dt>Standard Tuition</dt>
                <dd>${tuition}</dd>

                <dt>Accreditation</dt>
                <dd>${accreditation}</dd>

                <dt>Campus Location</dt>
                <dd>Kyrenia, Northern Cyprus</dd>
              </dl>
            </div>

            <!-- Admission Requirements -->
            <div class="sidebar-card">
              <h3><i class="fa-solid fa-clipboard-check" aria-hidden="true"></i> Admission Requirements</h3>
              <ul class="sidebar-requirements-list">
                <li><i class="fa-solid fa-check"></i> High school diploma or equivalent secondary education credential</li>
                <li><i class="fa-solid fa-check"></i> Language proficiency (${language.includes('English') ? 'English IELTS 5.5 / TOEFL 65 or CAU English Exam' : 'Turkish proficiency'})</li>
                <li><i class="fa-solid fa-check"></i> Valid passport copy and certified official transcripts</li>
                <li><i class="fa-solid fa-check"></i> Conditional acceptance letters issued within 48 hours</li>
              </ul>
              <a class="btn btn-coral w-100" href="https://apply.cau.edu.tr/" target="_blank" rel="noopener noreferrer">Start Application <i class="fa-solid fa-arrow-right ms-2" aria-hidden="true"></i></a>
            </div>

            <!-- Apply Card -->
            <div class="sidebar-card sidebar-card-cta">
              <h3><i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Admissions 2026/27</h3>
              <p>Applications are open for Fall 2026/27. Merit scholarships up to 100% are available for qualified international applicants.</p>
              <a class="sidebar-cta-btn" href="https://apply.cau.edu.tr/" target="_blank" rel="noopener noreferrer">Apply Now <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
              <a class="sidebar-whatsapp-btn" href="https://wa.me/905488357171" target="_blank" rel="noopener noreferrer">
                <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> WhatsApp Direct Line
              </a>
            </div>

            <!-- Related Programmes -->
            ${relatedPrograms ? `
            <div class="sidebar-card">
              <h3><i class="fa-solid fa-network-wired" aria-hidden="true"></i> Related Programmes</h3>
              <ul class="related-programs-nav">
                ${relatedPrograms}
                <li class="pt-2 border-top"><a href="/programs.html" class="fw-bold text-coral"><i class="fa-solid fa-list me-1"></i>All 48 Catalogued Degrees &rarr;</a></li>
              </ul>
            </div>` : ''}

          </div>
        </aside>
      </div>
    </section>
  </main>

  <div data-shared-footer></div>

  <script src="/assets/vendor/bootstrap/bootstrap.bundle.min.js"></script>
  <script src="/shared-footer.js"></script>
  <script src="/i18n.js"></script>
  <script src="/script.js"></script>
</body>
</html>`;
}

// Build unique map across all catalog items
const uniqueMap = new Map();
catalog.forEach(p => {
  if (p.slug && !uniqueMap.has(p.slug)) uniqueMap.set(p.slug, p);
});

// Write all unique programs into PUBLIC_PROGRAMS, CLIENT_PROGRAMS, DIST_PROGRAMS
let count = 0;
for (const [slug, prog] of uniqueMap.entries()) {
  const file = `${slug}.html`;
  const html = renderHTML(prog);
  fs.writeFileSync(path.join(PUBLIC_PROGRAMS, file), html, 'utf8');
  if (fs.existsSync(CLIENT_PROGRAMS)) {
    fs.writeFileSync(path.join(CLIENT_PROGRAMS, file), html, 'utf8');
  }
  if (fs.existsSync(DIST_PROGRAMS)) {
    fs.writeFileSync(path.join(DIST_PROGRAMS, file), html, 'utf8');
  }
  count++;
}

console.log(`Successfully upgraded all ${count} catalog program pages!`);
