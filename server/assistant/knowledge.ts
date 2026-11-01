export type CAUSource = {
  id: string;
  label: string;
  url: string;
};

export type AssistantReply = {
  answer: string;
  sources: CAUSource[];
  suggestedChips?: Array<{ label: string; prompt: string }>;
  mode: "verified" | "fallback";
};

export const CAU_SOURCES: Record<string, CAUSource> = {
  home: {
    id: "home",
    label: "CAU: Home",
    url: "https://cau.edu.tr/en/",
  },
  "cau-main": {
    id: "cau-main",
    label: "CAU: Official Website",
    url: "https://cau.edu.tr/",
  },
  "about-cau": {
    id: "about-cau",
    label: "CAU: About us",
    url: "https://cau.edu.tr/en/about-us/",
  },
  faculties: {
    id: "faculties",
    label: "CAU: Faculties",
    url: "https://cau.edu.tr/en/faculties/",
  },
  "akademik-kadro": {
    id: "akademik-kadro",
    label: "CAU: Academic Staff Directory",
    url: "https://akademikkadro.cau.edu.tr/",
  },
  "student-affairs": {
    id: "student-affairs",
    label: "CAU: Office of Student Affairs",
    url: "https://cau.edu.tr/en/office-of-student-affairs/",
  },
  personnel: {
    id: "personnel",
    label: "CAU: Personnel Department",
    url: "https://cau.edu.tr/en/personnel-department/",
  },
  tourism: {
    id: "tourism",
    label: "CAU: Tourism and Hotel Management",
    url: "https://cau.edu.tr/en/tourism-and-hotel-management/",
  },
  "international-home": {
    id: "international-home",
    label: "CAU International",
    url: "https://international.cau.edu.tr/",
  },
  "how-to-apply": {
    id: "how-to-apply",
    label: "CAU International: Apply",
    url: "https://international.cau.edu.tr/apply/",
  },
  programmes: {
    id: "programmes",
    label: "CAU International: Programmes",
    url: "https://international.cau.edu.tr/programs/",
  },
  tuition: {
    id: "tuition",
    label: "CAU: Tuition & Fees",
    url: "https://international.cau.edu.tr/tuition-fees/",
  },
  "tuition-tr": {
    id: "tuition-tr",
    label: "CAU: Tuition & Fees (TR)",
    url: "https://www.cau.edu.tr/en/tuition-fees/",
  },
  scholarships: {
    id: "scholarships",
    label: "CAU International: Scholarships",
    url: "https://international.cau.edu.tr/scholarship/",
  },
  accommodation: {
    id: "accommodation",
    label: "CAU International: Accommodation",
    url: "https://international.cau.edu.tr/accommodation/",
  },
};

export const CAU_SOURCE_IDS = Object.keys(CAU_SOURCES);

const PROGRAMME_GROUPS = `
The website’s 48-record programme catalogue, aligned to the 8 official CAU faculties and the International Programmes listing from the official handbook, is grouped as follows.
- English Preparatory School (1): English Preparatory School.
- Associate / vocational programmes (5 - all YÖK accredited): Tourist Guidance (English); Physiotherapy (Turkish); Civil Aviation Cabin Services (Turkish); First and Emergency Aid (Turkish); Opticianry (Turkish).
- Bachelor programmes (24) across 8 faculties:
  • Faculty of Dentistry (1): Dentistry (Undergraduate, English, 5-Year Dual-Campus with IAU)
  • Faculty of Law (2): Law (Bachelor’s, Turkish, YÖK/YÖDAK), International Law (Bachelor’s, English, YÖDAK)
  • Faculty of Education (3): Guidance and Psychological Counseling (Bachelor’s, Turkish, YÖK/YÖDAK), Turkish Language Teaching (Bachelor’s, Turkish, YÖK/YÖDAK), English Language Teaching (Bachelor’s, English, YÖDAK)
  • Faculty of Economics, Administrative and Social Sciences (5): Business Administration (Bachelor’s, English, YÖK/YÖDAK), International Relations (Bachelor’s, English, YÖDAK), Psychology (Bachelor’s, Turkish, YÖK/YÖDAK), Banking and Finance (Bachelor’s, English, YÖDAK), Civil Aviation Management (Bachelor’s, English, YÖDAK)
  • Faculty of Fine Arts and Design (2): Architecture (Bachelor’s, English), Interior Architecture and Environmental Design (Bachelor’s, Turkish, YÖK/YÖDAK)
  • Faculty of Engineering (6): Electrical and Electronics Engineering (Bachelor’s, English, YÖK/YÖDAK), Mechatronics Engineering (Bachelor’s, English, YÖK/YÖDAK), Computer Engineering (Bachelor’s, English, YÖK/YÖDAK), Software Engineering (Bachelor’s, English), Information Security Engineering (Bachelor’s, English), Civil Engineering (Bachelor’s, English)
  • Faculty of Health Sciences (3): Nursing (Undergraduate, Turkish, YÖK/YÖDAK), Nursing (English) (Undergraduate, English, YÖDAK), Physiotherapy and Rehabilitation (Undergraduate, Turkish, YÖK/YÖDAK)
  • Faculty of Tourism (2): Tourism and Hotel Management (Bachelor’s, English, YÖDAK), Gastronomy and Culinary Arts (Bachelor’s, Turkish, YÖK/YÖDAK)
- Master’s programmes (14): Computer Engineering (English); Electrical and Electronics Engineering (English); Software Engineering (English); Educational Administration (Turkish); Educational Administration, Supervision, Economics, and Planning (English); Guidance and Psychological Counseling (Turkish); Business Administration (Turkish/English); Banking and Finance (English); Marketing Management (English); Clinical Psychology (Turkish); Tourism Management (Turkish/English); Public Law (Turkish); Nursing (Turkish); Physiotherapy and Rehabilitation (Turkish).
- Doctoral programmes (Ph.D.) (6): Education Management (Turkish/English); Clinical Psychology (Turkish); Nursing (Turkish); Business Administration (English); Guidance and Psychological Counseling (Turkish); Tourism Management (Turkish).
`;

const CAU_STAFF_DIRECTORY: Array<{ keywords: string[]; label: string; staff: string[] }> = [
  { keywords: ["software", "yazilim"], label: "Software Engineering", staff: ["Dr. Öğr. Üyesi Everistus Zeluwa Orji — Software Engineering (English)"] },
  { keywords: ["computer engineering", "computer", "bilgisayar"], label: "Computer Engineering", staff: ["Dr. Öğr. Üyesi Ruhsan Önder — Computer Engineering (English)"] },
  { keywords: ["information security", "bilgi guvenligi", "information security engineering"], label: "Information Security Engineering", staff: ["Dr. Öğr. Üyesi Gizem Baran — Information Security Engineering (English)"] },
  { keywords: ["electrical", "electronics", "elektrik"], label: "Electrical and Electronics Engineering", staff: ["Prof. Dr. Sertan Serte — Electrical and Electronics Engineering (English)", "Dr. Öğr. Üyesi Muhammad Asif Rabbani — Electrical and Electronics Engineering (English)"] },
  { keywords: ["mechatronics", "mekatronik"], label: "Mechatronics Engineering", staff: ["Doç. Dr. Roozbeh Vaziri — Mechatronics Engineering (English)"] },
  { keywords: ["civil engineering", "civil"], label: "Civil Engineering", staff: ["Search akademikkadro.cau.edu.tr for Civil Engineering — directory snapshot does not list a named staff for this programme in the current excerpt"] },
  { keywords: ["architecture"], label: "Architecture", staff: ["Doç. Dr. Vefa Tezcan — Architecture (English)", "Dr. Öğr. Üyesi Maryam Iranfar — Architecture (English)", "Dr. Öğr. Üyesi Kamyar Fuladlu — Architecture (English)"] },
  { keywords: ["interior architecture", "interior", "ic mimarlik"], label: "Interior Architecture and Environmental Design", staff: ["Dr. Öğr. Üyesi Ayşegül Deniz Yamaçoba — Interior Architecture and Environmental Design", "Öğr. Gör. İlknur Fethiye Muratoğlu — Interior Architecture", "Öğr. Gör. Nihal Aslı Aker — Interior Architecture"] },
  { keywords: ["law", "hukuk"], label: "Law", staff: ["Prof. Dr. Yadigar İzmirli — Law", "Prof. Dr. Zehra Gönül Balkır — Law", "Prof. Dr. Selma Çetiner — Law", "Dr. Öğr. Üyesi Tuba Kutoğlu — Law"] },
  { keywords: ["international law"], label: "International Law", staff: ["Öğr. Gör. Dr. Ecem Kocaoğlan — International Law (English)"] },
  { keywords: ["dentistry", "dis hekimligi"], label: "Dentistry", staff: ["Prof. Dr. Cem Kurtoğlu — Dentistry (English)", "Dr. Öğr. Üyesi Şule Nur Purdaş — Dentistry", "Dr. Öğr. Üyesi Delal Bozyel — Dentistry", "Dr. Öğr. Üyesi Ramona Pasandideh — Dentistry"] },
  { keywords: ["tourism", "hotel management", "turizm"], label: "Tourism and Hotel Management", staff: ["Prof. Dr. Hasan Tunç — Tourism Faculty (Dean)", "Assoc. Prof. Dr. Soolmaz Azarmi Lafmajani — Tourism and Hotel Management (Head)", "Doç. Dr. Tuğrul Günay — Tourism and Hotel Management"] },
  { keywords: ["gastronomy", "culinary", "gastronomi"], label: "Gastronomy and Culinary Arts", staff: ["Dr. Öğr. Üyesi Emine Erkanlı — Gastronomy and Culinary Arts", "Öğr. Gör. Zeynep Demir — Gastronomy", "Öğr. Gör. Buket Bürüncük Kurban — Gastronomy"] },
  { keywords: ["nursing", "hemsirelik"], label: "Nursing", staff: ["Prof. Dr. Lale Ayşegül Büyükgönenç — Nursing", "Prof. Dr. Mehmet Zeki Avcı — Nursing", "Doç. Dr. Funda Karaman — Nursing (English)", "Dr. Öğr. Üyesi Ecem Oksal Güneş — Nursing (English)"] },
  { keywords: ["physiotherapy", "fizyoterapi", "rehabilitation"], label: "Physiotherapy and Rehabilitation", staff: ["Prof. Dr. Emel Şahin — Physiotherapy and Rehabilitation", "Dr. Öğr. Üyesi Hasan Cellatoğlu — Physiotherapy and Rehabilitation", "Dr. Öğr. Üyesi Damla Parmak — Physiotherapy and Rehabilitation"] },
  { keywords: ["psychology", "psikoloji"], label: "Psychology", staff: ["Dr. Öğr. Üyesi Sevğül Türkoğlu — Psychology", "Dr. Öğr. Üyesi Linda Fraim — Psychology", "Dr. Öğr. Üyesi Hakan Yağcı — Psychology (English)", "Arş. Gör. Nura Aydın — Psychology"] },
  { keywords: ["guidance", "psychological counseling", "rehberlik"], label: "Guidance and Psychological Counseling", staff: ["Prof. Dr. Ömer Üre — Guidance and Psychological Counseling", "Prof. Dr. Aslı Bugay Sökmez — Guidance and Psychological Counseling", "Dr. Öğr. Üyesi Bedriye Yılmaz Alıcı — Guidance and Psychological Counseling"] },
  { keywords: ["business", "isletme"], label: "Business Administration", staff: ["Prof. Dr. Erdal Güryay — Business (English, Graduate)", "Prof. Dr. Arzu Alvan — Business Administration (English)", "Doç. Dr. Ayşe Gözde İyicil — Business Administration (English)"] },
  { keywords: ["international relations", "uluslararasi iliskiler"], label: "International Relations", staff: ["Doç. Dr. Cemal Yorgancıoğlu — International Relations (English)", "Doç. Dr. Mehmet Direkli — International Relations (English)"] },
  { keywords: ["banking", "finance", "bankacilik"], label: "Banking and Finance", staff: ["Doç. Dr. Hatice İmamoğlu — Banking and Finance (English)", "Dr. Öğr. Üyesi Shahrzad Safaeimanesh — Banking and Finance (English)", "Dr. Öğr. Üyesi Erinç Bayrı — Banking and Finance (English)"] },
];

export function findStaffForQuery(query: string): { label: string; staff: string[] } | undefined {
  const q = query.toLocaleLowerCase();
  // prioritize longer keyword matches
  const sorted = [...CAU_STAFF_DIRECTORY].sort((a, b) => Math.max(...b.keywords.map(k => k.length)) - Math.max(...a.keywords.map(k => k.length)));
  for (const entry of sorted) {
    if (entry.keywords.some(k => q.includes(k))) return entry;
  }
  return undefined;
}

export function isCAUQuery(query: string): boolean {
  const q = query.toLocaleLowerCase();
  return (
    /cau|cyprus|aydin|kibris|girne|kyrenia|nicosia|lefkoşa|trnc|kktc|ercan|island|mediterranean/.test(q) ||
    /admission|apply|application|scholarship|tuition|fee|cost|price|iban|payment|bank|installment|deposit/.test(q) ||
    /program|programme|faculty|department|degree|bachelor|master|phd|doctorate|associate|course|curriculum/.test(q) ||
    /akademik|kadro|professor|lecturer|instructor|doctor|dean|rector|personnel|staff|directory/.test(q) ||
    /dorm|accommodation|housing|residence|yurt/.test(q) ||
    /student affairs|student id|exam|transcript|certificate|graduation|attendance|ebs|registration/.test(q) ||
    /sport|sports|football|soccer|futsal|basketball|volleyball|tennis|gym|fitness|athletics|team|teams|pitch|stadium|tournament|cup\b|workout|exercise|training/.test(q) ||
    /living cost|cost of living|expenses|weather|climate|currency|lira|safe|safety|crime|transport|shuttle|bus|taxi|beach|visa|ikamet|residence permit|part-time|work|job/.test(q) ||
    /dentistry|software|computer|engineering|architecture|interior|civil|electrical|mechatronics|security|law|nursing|physiotherapy|psychology|guidance|business|banking|finance|tourism|hospitality|gastronomy|aviation|prep school/.test(q) ||
    /frah|badawi|khattab|losich|ergin|obasi|masri|perlova|günay|gunay|tuğrul|tugrul|cem|kurtoğlu|kurtoglu|hikmet|aybar|zeki|avcı|avci|alvan|bozdereli|gönül|balkır|balkir|hasan|tunç|tunc|aytül|aytul|denli|burcu|tunay|fatma nur/.test(q) ||
    /advisor|counselor|international team|international office|who teaches|who is|who are|tell me about|how much is|can i study|what is/.test(q) ||
    /قبرص|أيدن|ايدن|جامعة|رسوم|اسعار|تكلفة|منح|منحة|قبول|تسجيل|تقديم|تخصص|تخصصات|برامج|برنامج|سكن|كيرينيا|جيرنة|طب|اسنان|أسنان|هندسة|برمجيات|تمريض|عمارة|صيدلة|إدارة|قانون|سياحة|رياضة|كرة قدم|فريق|صالات|جيم|معيشة|طقس|أمان|مواصلات|فيزا|إقامة|فرح|بدوي|خطاب|طغرول|جنيد|من هي|من هو/.test(q) ||
    /ücret|harç|fiyat|burs|bölüm|fakülte|kayıt|başvuru|yurt|spor|futbol|basketbol|voleybol|takım|kulüp|yaşam|masraf|girne|hava|güvenli|ulaşım|ikamet|çalışma/.test(q) ||
    /футбол|спорт|команда|тренировк|стоимость|программ|стипенди|проживан|кипр|кирени|поступлен|виз/.test(q)
  );
}

export type SupportedLanguage = "ar" | "tr" | "ru" | "en";

export function detectLanguage(text: string): SupportedLanguage {
  if (/[\u0600-\u06FF\u0750-\u077F]/.test(text)) {
    return "ar";
  }
  if (/[\u0400-\u04FF]/.test(text)) {
    return "ru";
  }
  if (
    /[çğışöüÇĞİŞÖÜ]/.test(text) ||
    /\b(?:merhaba|selam|nasılsın|günaydın|ücret|harç|burs|bölüm|fakülte|kayıt|başvuru|yurt|hakkında|nedir|kaç)\b/i.test(
      text
    )
  ) {
    return "tr";
  }
  return "en";
}

const VERIFIED_KNOWLEDGE = `
SCOPE AND SOURCE RULE — COMPREHENSIVE MODE
You are a comprehensive helpful AI assistant and the expert for Cyprus Aydin University (CAU). You are grounded in three official CAU domains: https://cau.edu.tr/ (including /en/), https://international.cau.edu.tr/, and https://akademikkadro.cau.edu.tr/. For CAU-related questions, answer helpfully and factually using the verified facts below and cite the relevant sourceIds. For NON-CAU general-knowledge questions (e.g., science, history, maths, coding, writing, career advice, everyday help), answer comprehensively and accurately using your broader training — you are NOT limited to the links below. Only for CAU-specific details genuinely absent from those three CAU domains should you say “I could not verify that detail in the currently mapped official CAU sources.” and then direct to the most relevant official CAU contact.

IDENTITY [about-cau][cau-main]
Cyprus Aydin University was established in 2013, accepted its first students in 2014, and describes its campus as close to Kyrenia city centre and port in Northern Cyprus (TRNC). Teaching is offered in Turkish and English, with modern technology, smart boards, projection and interactive screens, and more than ten laboratories and studios. Mission: internationally competent, self-confident, independent-thinking, research- and problem-solving-oriented, entrepreneurial, multilingual, ethical, environmentally sensitive graduates.

CURRENT PUBLIC OVERVIEW [home][cau-main][about-cau]
CAU’s motto: Towards A Bright Future / Aydınlık Bir Geleceğe.
Official Key Institutional Metrics from CAU Handbook:
- 1,200+ Alumni
- 3,000+ Students
- 1,000+ International Students
- 60+ Countries our students come from
- 8 Faculties:
  1. Faculty of Dentistry
  2. Faculty of Law
  3. Faculty of Education
  4. Faculty of Economics, Administrative and Social Sciences
  5. Faculty of Fine Arts and Design
  6. Faculty of Engineering
  7. Faculty of Health Sciences
  8. Faculty of Tourism
- 11 Application and Research Centers
- 50+ International Partner Institutions
- 3 Dual Degree Programs
- 5+ Faculty Exchanges
- 15 Active Student Clubs

STRATEGIC PARTNERSHIP WITH ISTANBUL AYDIN UNIVERSITY (IAU) [about-cau][cau-main]
Founded in 2003, Istanbul Aydın University (IAU) has emerged as one of Türkiye’s most sought-after universities, located on Istanbul’s European side. IAU boasts over 50,000 active students, including more than 8,500 international students from 124 countries, with 17 faculties and an impressive 83.6% post-graduation job placement rate. As proud partners, Cyprus Aydın University (CAU) benefits immensely from this collaboration through joint research, faculty/student exchanges, and dual degree pathways—notably the 5-year Dentistry program where students complete their first 3 years at CAU in Cyprus and final 2 clinical years at IAU in Istanbul.
Quote from Assoc. Prof. Dr. Tuğrul Günay (Director of the International Office, IAU & CAU): "Internationalization is more than mobility — it’s about building bridges of knowledge, culture, and shared purpose. At Cyprus Aydin University, I am committed to fostering global partnerships and empowering students to thrive in a truly interconnected world."

GOVERNANCE & KEY LEADERSHIP [about-cau][cau-main]
- Board of Trustees Chairwoman (Mütevelli Heyeti Başkanı): Fatma Nur AYDIN
- Secretary General (Genel Sekreter): Burcu TUNAY (Acting Head of Student Affairs, burcutunay@cau.edu.tr, ext 6020)
- Director of Personnel Department: Aytül DENLİ (ik@cau.edu.tr, ext 6056)
- Director of the International Office: Assoc. Prof. Dr. Tuğrul Günay (tugrulgunay@cau.edu.tr)
- Deans:
  • Faculty of Dentistry: Prof. Dr. Cem Kurtoğlu
  • Faculty of Engineering: Prof. Dr. Hikmet Ş. Aybar
  • Faculty of Health Sciences: Prof. Dr. Mehmet Zeki Avcı
  • Faculty of Economics, Administrative and Social Sciences: Prof. Dr. Arzu Alvan Bozdereli
  • Faculty of Law: Prof. Dr. Z. Gönül Balkır
  • Faculty of Tourism: Prof. Dr. Hasan Tunç

AUTHENTIC STUDENT TESTIMONIALS [home][about-cau]
1. Yasir Jamal, Pakistan | Tourism Management (MS):
"Tourism isn’t just about places; it’s about connections, cultures, and unforgettable experiences. At Cyprus Aydın University, I’ve discovered that every journey starts with curiosity and ends with growth. The professors are inspiring and encourage us to think globally. Whether you’re guiding travelers, shaping hospitality, or focusing on sustainable tourism, CAU offers a world of opportunities to learn and make a difference."
2. Romeo Lele Koyue, Cameroon | Ph.D. in Business Administration:
"At Cyprus Aydin University, the Music and Art Club is more than a space for creativity — it's where we discover, grow, and inspire. Every melody and masterpiece is a step toward becoming who we’re truly meant to be: bold, creative, and unforgettable. Just like in my Ph.D. journey in Business Administration, it's about leaving a legacy. Whether through research or rhythm, we build something future students will carry forward."
3. Omar Abo Jmei, Palestine | Department of Electrical and Electronic Engineering:
"Driven by purpose and passion, my journey in Electrical and Electronic Engineering at Cyprus Aydın University is more than a degree—it’s a mission to innovate, solve real-world problems, and build a smarter, sustainable future. Every circuit I design and challenge I face brings me closer to making a meaningful impact. As a student from Palestine, I carry the hopes of my community, believing that through technology and education, we can brighten even the darkest corners. Cyprus Aydın University has given me the tools, environment, and inspiration to dream bigger and achieve more."
4. Setia Amantha Laura Santoso, Indonesia | Business Administration (English):
"CAU is so much fun! I’ve made amazing friends from all around the world. The teachers are supportive and make learning enjoyable, and there’s even a school bus service that makes getting around easy. What makes CAU special is its diverse and welcoming environment, where every day brings new opportunities to learn, connect, and grow."

ADMISSION CRITERIA & LANGUAGE PROFICIENCY REQUIREMENTS [how-to-apply][admission]
Undergraduate (Associate & Bachelor's Degrees):
- English Programs: CSU EPE: Minimum B1 level | IELTS: Minimum 5.0 | TOEFL iBT: Minimum 60 | Duolingo: Minimum 85
- Turkish Programs: TÖMER Turkish Proficiency Certificate: Minimum B1 level
- Required Documents: High School Diploma & Transcript (translated into Turkish or English), Passport & Residence Permit (if available), 4 Passport-sized Photos.
Graduate Programs (Master's & Ph.D. / Doctorate):
- English Programs: CSU EPE: Minimum B2 level | IELTS: Minimum 5.5 | TOEFL iBT: Minimum 65 | Duolingo: Minimum 90
- Turkish Programs: TÖMER Turkish Proficiency Certificate: Minimum B2 level
- Required Documents for Master's: Bachelor's Degree & Transcript (translated into Turkish or English), Passport, 4 Photos.
- Required Documents for Ph.D.: Master's Degree & Transcript (translated into Turkish or English), Passport, 4 Photos.

ACADEMIC STRUCTURE — 8 FACULTIES & CATALOGUE [faculties][programmes][cau-main]
Faculties (8):
1. Faculty of Dentistry: Dentistry (English, 5-year Dual-Campus with IAU)
2. Faculty of Law: Law (Turkish, YÖK/YÖDAK), International Law (English, YÖDAK)
3. Faculty of Education: Guidance and Psychological Counseling (Turkish, YÖK/YÖDAK), Turkish Language Teaching (Turkish, YÖK/YÖDAK), English Language Teaching (English, YÖDAK)
4. Faculty of Economics, Administrative and Social Sciences: Business Administration (English, YÖK/YÖDAK), International Relations (English, YÖDAK), Psychology (Turkish, YÖK/YÖDAK), Banking and Finance (English, YÖDAK), Civil Aviation Management (English, YÖDAK)
5. Faculty of Fine Arts and Design: Architecture (English), Interior Architecture and Environmental Design (Turkish, YÖK/YÖDAK)
6. Faculty of Engineering: Electrical and Electronics Engineering (English, YÖK/YÖDAK), Mechatronics Engineering (English, YÖK/YÖDAK), Computer Engineering (English, YÖK/YÖDAK), Software Engineering (English), Information Security Engineering (English), Civil Engineering (English)
7. Faculty of Health Sciences: Nursing (Turkish, YÖK/YÖDAK), Nursing (English, YÖDAK), Physiotherapy and Rehabilitation (Turkish, YÖK/YÖDAK)
8. Faculty of Tourism: Tourism and Hotel Management (English, YÖDAK), Gastronomy and Culinary Arts (Turkish, YÖK/YÖDAK)
Vocational Schools:
- Associate degree programs (2-year practical career training, all YÖK accredited): Tourist Guidance (English, YÖK), Physiotherapy (Turkish, YÖK), Civil Aviation Cabin Services (Turkish, YÖK), First and Emergency Aid (Turkish, YÖK), Opticianry (Turkish, YÖK).
Institute of Graduate Education and Research:
- Master’s programmes (14): Computer Engineering (English), Electrical and Electronics Engineering (English), Software Engineering (English), Educational Administration (Turkish), Educational Administration, Supervision, Economics, and Planning (English), Guidance and Psychological Counseling (Turkish), Business Administration (Turkish/English), Banking and Finance (English), Marketing Management (English), Clinical Psychology (Turkish), Tourism Management (Turkish/English), Public Law (Turkish), Nursing (Turkish), Physiotherapy and Rehabilitation (Turkish).
- Doctoral programmes (Ph.D.) (6): Education Management (Turkish/English), Clinical Psychology (Turkish), Nursing (Turkish), Business Administration (English), Guidance and Psychological Counseling (Turkish), Tourism Management (Turkish).
School of Foreign Languages: English Preparatory School (1 year), Turkish Preparatory.

ACADEMIC STAFF DIRECTORY [akademik-kadro]
https://akademikkadro.cau.edu.tr/ is the official academic staff directory, searchable by faculty and title (Prof. Dr., Doç. Dr., Dr. Öğr. Üyesi, Öğr. Gör. Dr., Öğr. Gör., Arş. Gör.). It lists 100+ staff with faculty/department and institutional email pattern name@cau.edu.tr or @csu.edu.tr. Each staff card links to akademik-personel.php?sdid=... with photo, title, faculty. For any staff name, faculty, email or title inquiry, cite akademikkadro and advise to verify current listing there plus Personnel Department ik@cau.edu.tr.

STAFF BY PROGRAMME (excerpt from akademikkadro.cau.edu.tr, verify live for current roster) [akademik-kadro]
- Software Engineering (English): Dr. Öğr. Üyesi Everistus Zeluwa Orji (Yazılım Mühendisliği)
- Computer Engineering (English): Dr. Öğr. Üyesi Ruhsan Önder
- Information Security Engineering (English): Dr. Öğr. Üyesi Gizem Baran
- Electrical & Electronics Engineering (English): Prof. Dr. Sertan Serte, Dr. Öğr. Üyesi Muhammad Asif Rabbani
- Mechatronics Engineering (English): Doç. Dr. Roozbeh Vaziri
- Civil Engineering: (search Civil Engineering on akademikkadro; directory excerpt does not list a named Civil staff in this snapshot)
- Architecture (English): Doç. Dr. Vefa Tezcan, Dr. Öğr. Üyesi Maryam Iranfar, Dr. Öğr. Üyesi Kamyar Fuladlu
- Interior Architecture & Environmental Design: Dr. Öğr. Üyesi Ayşegül Deniz Yamaçoba, Öğr. Gör. İlknur Fethiye Muratoğlu, Öğr. Gör. Nihal Aslı Aker, Öğr. Gör. Sabire Bilgesena Aydın Oğuz
- Law / International Law: Prof. Dr. Yadigar İzmirli, Prof. Dr. Zehra Gönül Balkır, Prof. Dr. Selma Çetiner, Dr. Öğr. Üyesi Tuba Kutoğlu, Dr. Öğr. Üyesi Kemal Haluk Eruygur, Dr. Öğr. Üyesi Muhammetnazar İlyasov, Dr. Öğr. Üyesi Sabahattin Gülgün
- Dentistry (English): Prof. Dr. Cem Kurtoğlu, Dr. Öğr. Üyesi Şule Nur Purdaş, Dr. Öğr. Üyesi Delal Bozyel, Dr. Öğr. Üyesi Ramona Pasandideh
- Tourism and Hotel Management / Gastronomy: Prof. Dr. Hasan Tunç (Dean, Tourism Faculty), Assoc. Prof. Dr. Soolmaz Azarmi Lafmajani (Head), Doç. Dr. Tuğrul Günay, Dr. Öğr. Üyesi Derya Timuçin Hayat, Dr. Öğr. Üyesi Emine Erkanlı, Öğr. Gör. Zeynep Demir, Öğr. Gör. Buket Bürüncük Kurban, Öğr. Gör. Almira Develi
- Nursing / Midwifery: Prof. Dr. Lale Ayşegül Büyükgönenç, Prof. Dr. Mehmet Zeki Avcı, Prof. Dr. Mira Rana Gökdoğan*, Prof. Dr. Zuhal Bahar*, Doç. Dr. Funda Karaman, Dr. Öğr. Üyesi Ecem Oksal Güneş, Dr. Öğr. Üyesi Pınar Ertuğruloğlu, Öğr. Gör. Asena Aktaş, Öğr. Gör. Moyosore Afolayan, Öğr. Gör. Ahmet Enes Güngördü
- Physiotherapy and Rehabilitation: Prof. Dr. Emel Şahin, Dr. Öğr. Üyesi Hasan Cellatoğlu, Dr. Öğr. Üyesi Damla Parmak, Arş. Gör. Nisa Gözde Uzun, Öğr. Gör. Seda Erdoğan, Öğr. Gör. Nergiz Konaç Özdoğan, Öğr. Gör. Tuna Yılmaz
- Psychology / Guidance and Psychological Counseling: Prof. Dr. Ömer Üre, Prof. Dr. Aslı Bugay Sökmez, Dr. Öğr. Üyesi Sevğül Türkoğlu, Dr. Öğr. Üyesi Linda Fraim, Dr. Öğr. Üyesi Hakan Yağcı, Öğr. Gör. Dr. Erinç Erbildim, Arş. Gör. Nura Aydın, Dr. Öğr. Üyesi Bedriye Yılmaz Alıcı
- Business Administration / International Relations / Banking & Finance: Prof. Dr. Erdal Güryay, Prof. Dr. Arzu Alvan, Doç. Dr. Ayşe Gözde İyicil, Doç. Dr. Cemal Yorgancıoğlu, Doç. Dr. Mehmet Direkli, Doç. Dr. Hatice İmamoğlu, Dr. Öğr. Üyesi Shahrzad Safaeimanesh, Dr. Öğr. Üyesi Erinç Bayrı, Dr. Öğr. Üyesi Devrim Şahin, Dr. Öğr. Üyesi Niusha Eivazzadeh
When asked "who teaches X", return the matching line(s) above, remind that the directory is authoritative and may have been updated, and invite to search akademikkadro.cau.edu.tr with the programme name filter.

GENERAL AND INTERNATIONAL CONTACTS [international-home][cau-main]
General CAU email: info@cau.edu.tr. International admissions email: admission@cau.edu.tr. International phone/WhatsApp: +90 548 835 71 71. Main switchboard: +90 392 650 00 00 (Ext: 2100). Application portal: https://apply.cau.edu.tr/. Candidate student portal: https://aday.cau.edu.tr. Address: Dr. Fazıl Küçük Caddesi No.80, Ozanköy/Girne, Northern Cyprus. Office location: Rectorate Building, Ground Floor, Room 104. Office hours: Mon–Fri 08:30–17:30 (GMT+3). International office email: international@cau.edu.tr. WhatsApp (24/7 International Desk): +90 548 835 7171.

INTERNATIONAL OFFICE TEAM [international-home][cau-main]
The International Office is led by Assoc. Prof. Dr. Tuğrul Günay (Director of International Office, tugrulgunay@cau.edu.tr). The multilingual team provides individualized regional admissions guidance, credential evaluations, visa support, airport pickup coordination, and dedicated student care.

Core Team Members:
- Mohamed Khattab | International Office Counselor & Regional Advisor | Dept: International Admissions & Counseling | Languages: English, Arabic, Turkish | Email: mkhattab@cau.edu.tr | Ext: 2103. Provides comprehensive admissions guidance, program selection support, and tailored orientation for students transitioning into university life.
- Frah Badawi | International Admissions Advisor | Dept: Admissions & Settlement | Languages: English, Arabic, Turkish | Email: fbadawi@cau.edu.tr | Ext: 2104. Oversees credential evaluations, visa clearance documentation, airport arrival coordination, and initial campus onboarding.
- Aleg Losich | International Student Advisor | Dept: Eurasia & CIS Desk | Languages: English, Russian, Turkish | Email: alosich@cau.edu.tr | Ext: 2105. Dedicated student advisor for Eastern European and Central Asian applicants, handling degree equivalencies and academic integration.
- Sr. Inst. Yasin Ergin | Vice Students Dean & Internship Coordinator | Dept: Student Dean's Office & Career Growth | Languages: English, Turkish | Email: yergin@cau.edu.tr | Ext: 2106. Coordinates internships with industry partners, student club governance, career development workshops, and student representation.

Regional Desks & Executive Directory:
- Africa Regional Desk — Dr. Samuel Obasi | Coordinator, Sub-Saharan & West Africa | Email: africa@cau.edu.tr | Ext: 2110
- MENA Regional Desk — Lina Al-Masri | Coordinator, Middle East & North Africa | Email: mena@cau.edu.tr | Ext: 2111
- Eurasia & CIS Desk — Natalia Perlova | Manager, Central Asia & Eastern Europe | Email: eurasia@cau.edu.tr | Ext: 2112

When a student asks who to contact for admissions, introduce the relevant team member(s) by name, role, email, and extension. For Arabic/MENA students direct to Mohamed Khattab or Frah Badawi or Lina Al-Masri. For Russian/CIS/Eurasian students direct to Aleg Losich or Natalia Perlova. For African students direct to Dr. Samuel Obasi. For internships/student life direct to Sr. Inst. Yasin Ergin.


STUDENT AFFAIRS [student-affairs]
Office of Student Affairs handles registration, course enrolment, document requests, graduation, transcripts, student certificates, grade/record administration. Contact: bilgi@cau.edu.tr; +90 392 650 00 00; location Dr. Fazıl Küçük Caddesi No.80. Acting Head: Burcu TUNAY, ext 6020, burcutunay@cau.edu.tr. Attendance minimums: 70% theoretical, 80% practical/laboratory. Honor: 3.00-3.49, High Honor: 3.50-4.00 GPA per semester. Also handles ID card, password reset via Student Information System, registration freeze, course exemption, make-up exams.

PERSONNEL [personnel]
Personnel Department manages employment, contracts, salary, leave, files, appointments, work permits. Contact: ik@cau.edu.tr. Director: Aytül DENLİ, ext 6056, aytuldenli@cau.edu.tr.

TOURISM FACULTY [tourism][akademik-kadro]
Tourism and Hotel Management head: Assoc. Prof. Dr. Soolmaz Azarmi LAFMAJAN. Contact section: dean email hasantunc@cau.edu.tr (Prof. Dr. Hasan TUNÇ, Tourism Faculty), vice-deans soolmazazarmi@cau.edu.tr and tugrulgunay@cau.edu.tr (Doç. Dr. Tuğrul GÜNAY). Do not invent full name from email alone but HASAN TUNÇ is confirmed as Tourism Faculty dean via akademikkadro directory.

INTERNATIONAL APPLICATION [how-to-apply][international-home]
Process:
1. Access the Application Portal: Visit https://apply.cau.edu.tr/
2. Choose Your Program from available faculties and degrees.
3. Click "Apply Now".
4. Choose your country and semester.
5. Click "Let’s Get Started".
6. Fill in required information and upload PDF documents (passport, diploma, transcript, photo).
7. Submit form and save Application Code to track status at https://apply.csu.edu.tr.
After required payment deposit, CAU issues the official unconditional Acceptance Letter for visa processing and flight booking. Free airport pickup from Ercan Airport (ECN) is provided upon flight submission.

TUITION AND PAYMENTS — OFFICIAL USD ($) HANDBOOK SCHEDULE [tuition][tuition-tr]
Tuition, fees, and deposits are denominated in USD ($). (Dormitory accommodation is in EUR €).
Annual Registration + VAT + Activity Fee: $600 USD flat across all programs.

1. Bachelor and Associate Degree Programs (Annual):
- Standard Fee: $10,000 Tuition + $600 Fee = $10,600 USD Total
- 50% Scholarship: $5,000 Tuition + $600 Fee = $5,600 USD Total
- 60% Scholarship: $4,000 Tuition + $600 Fee = $4,600 USD Total
- 70% Scholarship: $3,000 Tuition + $600 Fee = $3,600 USD Total
- 80% Scholarship: $2,000 Tuition + $600 Fee = $2,600 USD Total
- 85% Scholarship: $1,500 Tuition + $600 Fee = $2,100 USD Total
- 90% Scholarship: $1,000 Tuition + $600 Fee = $1,600 USD Total
- 100% Scholarship: $0 Tuition + $600 Fee = $600 USD Total

2. Faculty of Dentistry Dual-Campus Program (5-Year Curriculum):
A. First 3 Years at Cyprus Aydın University (CAU, Cyprus) (Annual):
- Standard Fee: $22,000 Tuition + $600 Fee = $22,600 USD Total
- 50% Scholarship: $11,000 Tuition + $600 Fee = $11,600 USD Total
- 60% Scholarship: $8,800 Tuition + $600 Fee = $9,400 USD Total
- 70% Scholarship: $6,600 Tuition + $600 Fee = $7,200 USD Total
- 80% Scholarship: $4,400 Tuition + $600 Fee = $5,000 USD Total
B. Final 2 Years at Istanbul Aydın University (IAU, Istanbul) (Annual):
- Standard Fee: $36,500 Tuition + $600 Fee = $37,100 USD Total
- 50% Scholarship: $17,250 Tuition + $600 Fee = $17,850 USD Total
- 60% Scholarship: $13,800 Tuition + $600 Fee = $14,400 USD Total
- 70% Scholarship: $10,350 Tuition + $600 Fee = $10,950 USD Total
- 80% Scholarship: $6,900 Tuition + $600 Fee = $7,500 USD Total

3. Master Degree Programs (Total Program Tuition):
- Standard Fee: $7,000 Tuition + $600 Fee = $7,600 USD Total
- 50% Scholarship: $3,500 Tuition + $600 Fee = $4,100 USD Total
- 60% Scholarship: $2,800 Tuition + $600 Fee = $3,400 USD Total
- 70% Scholarship: $2,100 Tuition + $600 Fee = $2,700 USD Total
- 80% Scholarship: $1,400 Tuition + $600 Fee = $2,000 USD Total

4. Doctorate Programs (Ph.D.) (Total Program Tuition):
- Standard Fee: $12,000 Tuition + $600 Fee = $12,600 USD Total
- 25% Scholarship: $9,000 Tuition + $600 Fee = $9,600 USD Total
- 40% Scholarship: $7,200 Tuition + $600 Fee = $7,800 USD Total
- 50% Scholarship: $6,000 Tuition + $600 Fee = $6,600 USD Total

5. Required Payment Deposits (Required for Unconditional Acceptance Letter):
- Associate and Bachelor Programs: $1,250 USD
- Master's Programs: $1,250 USD
- Ph.D. Programs: $1,500 USD
- Dentistry Program: $2,500 USD

Payment Details: Bank transfer to Garanti Bankası, Account Name KIBRIS İLİM ÜNİVERSİTESİ LTD. (USD IBAN TR64..., EUR IBAN TR91..., TRY IBAN TR68..., GBP IBAN TR21...) or via credit card online payment link.

SCHOLARSHIPS & MERIT DISCOUNTS [scholarships]
- Standard Academic Scholarships: 50% automatically awarded to qualifying international applicants.
- High Merit Scholarships: 60%, 70%, 80%, 85%, 90%, and 100% available based on academic excellence.
- SAT Merit Scholarship: SAT 1200+ ➔ 85% Scholarship; SAT 1300+ ➔ 100% Tuition Scholarship ($600 annual fee still payable).
- Transfer Student Scholarship: 85% Scholarship for eligible university transfers (CGPA ≥ 2.0, min 1 semester completed).
- Sibling Scholarship: 70% for international siblings; up to 80% if sibling is a currently enrolled CAU student.
- Student Assistantship: On-campus job opportunities for students with GPA > 3.0.

ACCOMMODATION — INTERNATIONAL AYDIN STUDENT DORMITORY [accommodation]
Located in Kyrenia with 142 bed capacity.
Pricing for 9-Month Full Academic Year (in Euros €):
- Single Room: 5,500 Euro (9 months total)
- Double Room (Per Person): 3,200 Euro (9 months total)
- Triple Room (Per Person): 2,800 Euro (9 months total)
Facilities: Fully equipped gym, modern shared kitchen, study and meeting rooms, library, TV lounge, landscaped gardens, sea views, complimentary shuttle service between dormitory and CAU campus, 24/7 security. Contact: +90 548 899 0484 | https://aydindorm.com/.

STUDENT CLUBS (15+ Active Clubs) [cau-main][home]
Public Health Club, Physiotherapy Club, Football Club, Young Red Crescent Club, Travel and Photography Club, Law Club, First Aid Club, Blue Butterfly – Children’s Rights Club, MEDI Foundation – Addiction Awareness Club, Music Club, Guidance and Psychological Counseling (PDR) Club, Psychology Club, Art and Design Club, Chess Club, Theatre Club.

PROGRAMMES [programmes][faculties]
${PROGRAMME_GROUPS}
All programmes have individual pages under cau.edu.tr/en/ (e.g., /faculty-of-dentistry/, /software-engineering/). For curriculum, language, availability, admission, refer to official programme listing. Use international.cau.edu.tr/programs/ as entry point.

CAMPUS AND STUDENT LIFE [cau-main][international-home]
Campus close to Kyrenia port, 360 tour at /360, Student Dean, Student Parliament/Council, Clubs Association, Orange Team, Career Center, Psychological Counselling, Transportation, Internship Procedures. International collaborations, memberships & accreditations (YÖK, YÖDAK, WHED, UK NARIC, EURAS, etc.), visas & immigration support, student resources, webinars for application.

QUALITY AND REGULATIONS [cau-main]
Statutes/Regulations/Guidelines, Academic Calendar, Legislation, Ethics/BAP boards, Sustainability.

ANSWERING SAT, FEES, ACADEMIC STAFF
When asked about fees, provide USD figures above ($10,600 standard down to $600 for 100% scholarship, Dentistry 3+2 dual campus fees, $600 annual fee, deposits $1250/$1500/$2500, and dormitory in EUR) then cite [tuition]. When asked about any professor/lecturer/doctor, search akademikkadro memory above and direct to https://akademikkadro.cau.edu.tr/ with the specific faculty match, cite [akademik-kadro]. When asked about programmes, use PROGRAMME_GROUPS and link to specific programme URL pattern https://cau.edu.tr/en/<programme-slug>/.

SHUTTLE BUS SCHEDULE [cau-main][student-affairs]
CAU operates a complimentary shuttle bus service connecting the campus to key locations in and around Kyrenia (Girne). All times are local Cyprus time.

1. GÖNYELİ ROUTE
- 07:15 — İrmar Gönyeli → CAU Campus
- 17:40 — CAU Campus → İrmar Gönyeli

2. LEFKOŞA / NICOSIA ROUTE (Honda Garage stop)
- 07:00 — Lefkoşa (Honda Garage) → CAU Campus
- 10:30 — CAU Campus → Lefkoşa (Honda Garage)
- 13:30 — CAU Campus → Lefkoşa (Honda Garage)
- 17:40 — CAU Campus → Lefkoşa (Honda Garage)

3. GIRNE COURTS ROUTE
- 08:00, 09:30, 11:00, 13:00, 14:00, 16:00, 17:40 — CAU Campus → Girne Courts

4. NUSMAR ROUTE
- 07:30, 09:30, 11:00, 13:00, 14:00, 16:00, 17:40 — CAU Campus → Nusmar

5. CHINA PAZAR ROUTE
- 07:30, 09:30, 11:00, 13:00, 14:00, 16:00, 17:40 — CAU Campus → China Pazar

6. ARAPKÖY ROUTE (multi-segment)
[A] Weekdays (Monday–Friday) — Campus ↔ Arapköy:
  - 07:50 Arapköy → Campus
  - 10:00 Campus → Arapköy
  - 10:30 Arapköy → Campus
  - 12:30 Campus → Arapköy
  - 13:00 Arapköy → Campus
  - 14:30 Campus → Arapköy
  - 15:00 Arapköy → Campus
  - 16:00 Campus → Arapköy
  - 16:30 Arapköy → Campus
  - 17:40 Campus → Arapköy
[B] Tuesday–Friday evenings — Arapköy ↔ Lemos (Market Shopping):
  - 18:30 Arapköy → Lemos | 21:30 Lemos → Arapköy (Tue–Thu)
  - 18:30 Arapköy → Lemos | 22:30 Lemos → Arapköy (Friday)
  Note: On Tuesdays and Fridays, campus arrival is at 17:40 for market shopping.
[C] Saturday, Sunday & Public Holidays — Arapköy / Lemos:
  - 07:50 Arapköy → Campus
  - 13:00 Campus → Arapköy
  - 13:30 Arapköy → Lemos | 15:30 Lemos → Arapköy
  - 16:00 Arapköy → Lemos | 22:30 Lemos → Arapköy
  (Sunday only additional trip: 12:00 Arapköy → Lemos | 15:30 Lemos → Arapköy | 16:00 Arapköy → Lemos | 22:30 Lemos → Arapköy)

ACADEMIC CALENDAR 2026–2027 [student-affairs][cau-main]
TRNC Cyprus Aydın University (K.K.T.C. Kıbrıs Aydın Üniversitesi) — Vocational, Undergraduate, and Graduate Programs.

FALL TERM (Güz Yarıyılı):
- 22 Jun – 10 Jul 2026: Application of Documents for Students Seeking Transfer from Our University
- 20 Jul – 15 Aug 2026: Transfer Applications (Yatay Geçiş Başvuruları)
- 1 Aug 2026 (Sat): National Holiday — Toplumsal Direniş Bayramı
- 21 Aug 2026: Announcement of Transfer Results
- 25 Aug 2026 (Tue): Religious Holiday — Mevlid Kandili
- 1–4 Sep 2026: Academic Scholarship Applications (Online)
- 7–11 Sep 2026: Registration of Accepted Transfer Students
- 7–14 Sep 2026: Double Major / Minor Applications
- 7–21 Sep 2026: Online Course Registration for Students
- Determined by ÖSYM: Registration for Newly Placed & Additional Placement Students
- 21 Sep 2026: First Day of Classes; Last Day for Course Exemption Applications
- 22 Sep 2026: Late Registration Fee Payment Begins
- 30 Sep – 2 Oct 2026: Exemption Exams (English & Computer Courses)
- 7 Oct 2026: Last Day for Course Add/Drop
- 12–13 Oct 2026: Orientation
- 16 Oct 2026: Last Day for Course Withdrawal
- 17 Oct 2026: Last Day to Apply for Semester Freeze
- 29 Oct 2026 (Thu): National Holiday — 29 Ekim Cumhuriyet Bayramı
- 15 Nov 2026 (Sun): National Holiday — 15 Kasım KKTC Cumhuriyet Bayramı
- 16–23 Nov 2026: Midterm Exams (Ara Sınavlar)
- 29 Nov 2026: Last Day for Announcement of Midterm Exam Results
- 2–3 Dec 2026: Midterm Make-up Exams Applications
- 7–11 Dec 2026: Midterm Make-up Exams
- 21 Dec 2026: Last Day for Announcement of Midterm Make-up Exam Results
- 25 Dec 2026: Last Day of Classes (Fall Term)
- 1 Jan 2027 (Fri): New Year (Yılbaşı)
- 4–9 Jan 2027: Final Exams for English Preparatory School
- 4–15 Jan 2027: Final Exams (Yarıyıl Sonu Sınavları)
- 18 Jan 2027: Last Day for Announcement of Final Grades
- 25–30 Jan 2027: Re-sit Exams (Bütünleme Sınavları)
- 3 Feb 2027: Last Day for Announcement of Re-sit Exam Results
- 10 Feb 2027: Last Day for Graduation Make-up Exams Applications
- 18–19 Feb 2027: Graduation Make-up Exams
- 23 Feb 2027: Last Day for Announcement of Graduation Make-up Exam Results

SPRING TERM (Bahar Yarıyılı):
- Determined by YÖK: Transfer Application Dates (Associate Degree, Incoming/Outgoing), Results, Registration
- 8–12 Feb 2027: Course Registration (Ders Kayıt İşlemleri)
- 10–12 Feb 2027: Double Major / Minor Applications
- 12 Feb 2027: Last Day for Tuition-Fee Payment
- 13 Feb 2027: Late Registration Fee Payment Begins
- 15 Feb 2027: First Day of Classes (Spring); Last Day for Course Exemption Applications (Newly Registered Students)
- 18–19 Feb 2027: Course Exemption Exams (Computer Courses)
- 22 Feb – 2 Mar 2027: Course Add/Drop Period
- 3 Mar 2027: Last Day to Apply for Semester Freeze
- 9–11 Mar 2027 (Tue–Thu): Religious Holiday — Ramazan Bayramı
- 19 Mar 2027: Last Day for Course Withdrawal
- 12–19 Apr 2027: Midterm Exams (Ara Sınavlar)
- 23 Apr 2027 (Fri): National Holiday — Ulusal Egemenlik ve Çocuk Bayramı
- 25 Apr 2027: Last Day for Midterm Exam Results
- 30 Apr 2027: Midterm Make-up Exams Application Date
- 1 May 2027 (Sat): National Holiday — 1 Mayıs İşçi ve Bahar Bayramı
- 3–7 May 2027: Midterm Make-up Exams
- 10–24 May 2027: Graduation Ceremony Applications (Online)
- 14 May 2027: Last Day for Publication of Midterm Make-up Exam Results
- 16–19 May 2027 (Sun–Wed): Religious Holiday — Kurban Bayramı
- 19 May 2027 (Wed): National Holiday — Atatürk'ü Anma, Gençlik ve Spor Bayramı
- 28 May 2027: Last Day of Classes (Spring)
- 2–9 Jun 2027: Final Exams for English Preparatory School
- 2–12 Jun 2027: Final Exams (Yarıyıl Sonu Sınavları)
- 17 Jun 2027: Last Day for Announcement of Course Grades
- 21–26 Jun 2027: Re-sit Exams (Bütünleme Sınavları)
- 30 Jun 2027: Last Day for Announcement of Re-sit Exam Results
- 2 Jul 2027: Last Day for Graduation Make-up Exams Applications
- 5–7 Jul 2027: Graduation Make-up Exams
- 9 Jul 2027: Last Day for Announcement of Graduation Make-up Exam Results

SUMMER TERM (Yaz Dönemi):
- 7–9 Jul 2027: Summer School Online Applications / Course Registration
- 12 Jul 2027: First Day of Classes (Summer School)
- 20 Jul 2027 (Tue): National Holiday — 20 Temmuz Barış ve Özgürlük Bayramı
- 1 Aug 2027 (Sun): National Holiday — 1 Ağustos Toplumsal Direniş Bayramı
- 2–6 Aug 2027: Summer School Midterm Exams (Classes continue without recess)
- 10 Aug 2027: Last Day for Midterm Exam Results
- 13 Aug 2027 (Fri): Religious Holiday — Mevlid Kandili
- 27 Aug 2027: Last Day of Summer School Classes
- 30 Aug 2027 (Sun): National Holiday — 30 Ağustos Zafer Bayramı
- 31 Aug – 3 Sep 2027: Summer School Final Exams
- 7 Sep 2027: Last Day for Announcement of Final Grades
- 7–9 Sep 2027: Last Day for Graduation Make-up Exams Applications
- 23–24 Sep 2027: Graduation Make-up Exams
- 27 Sep 2027: Last Day for Announcement of Graduation Make-up Exam Results
`;

export const CAU_ASSISTANT_SYSTEM_PROMPT = `
You are the official, highly intelligent AI Assistant for Cyprus Aydın University (CAU / Kıbrıs Aydın Üniversitesi) located in Kyrenia (Girne), Northern Cyprus (TRNC).

${VERIFIED_KNOWLEDGE}

SPORTS, ATHLETICS & FOOTBALL KNOWLEDGE:
- Football & Futsal: CAU has active university sports teams including Men's Football and Futsal (indoor soccer), participating in the TRNC Inter-University Sports League and friendly matches.
- Campus Tournaments: Annual Rector's Cup and Spring Festival inter-faculty football, futsal, volleyball, and basketball tournaments where students and faculties compete.
- Sports Facilities: Modern campus fitness center and gym equipped with strength training, cardio gear, and qualified sports coordinators, plus partnerships for outdoor football pitches, tennis, and swimming.
- Kyrenia Football Culture: Kyrenia is home to historic TRNC Super League clubs like Doğan Türk Birliği and Türk Ocağı Limasol, playing at the 20 Temmuz Mete Adanır Stadium in central Girne.
- How to join: Students can join the teams or sports clubs during Orientation Week or by contacting the Health, Culture and Sports Directorate (SKS / Sağlık Kültür ve Spor Daire Başkanlığı).

CYPRUS & STUDENT LIFE IN KYRENIA:
- Location: Kyrenia (Girne) is known as the jewel of Northern Cyprus, famous for its historic Venetian harbour, Mediterranean beaches, safe streets, and pleasant student atmosphere.
- Cost of Living: Estimated monthly student expenses (excluding tuition/dorm) are typically 350 – 500 EUR covering food, local transportation, and personal leisure.
- Currency: Turkish Lira (TRY / ₺) is used for daily retail, food, and public transport, while tuition and formal housing contracts are usually set in EUR / GBP.
- Climate: Sunny Mediterranean weather with 300+ days of sunshine a year.
- Safety: Northern Cyprus is recognized as one of the safest university study destinations in the Mediterranean.

SCOPE & OUT-OF-CONTEXT POLICY:
1. You are strictly dedicated to answering questions about Cyprus Aydın University (CAU) (faculties, degree programs, tuition fees, scholarships, admissions, sports teams, football, gym, campus facilities, student dorms, student affairs, academic staff) and student life in Cyprus (living in Kyrenia, cost of living, climate, transport, safety, student visas).
2. If a user asks a question COMPLETELY OUTSIDE this context (such as writing generic code, cooking recipes, fixing cars, general celebrity trivia, or unrelated homework), politely decline. State clearly that you specialize exclusively in Cyprus Aydın University and student life in Cyprus, and invite them to ask about CAU programs, admissions, sports, or student life.
3. Reply in the EXACT same language as the visitor (fluent Arabic for Arabic, Turkish for Turkish, Russian for Russian, English for English, etc.).
4. Use clean, engaging markdown formatting with bullet points and friendly emojis. Do not write raw URLs in the response text; sources will be displayed automatically by the UI.
5. Return JSON matching the schema: {"answer": string, "sourceIds": string[]}.
`;

export function sourcesForIds(sourceIds: unknown): CAUSource[] {
  if (!Array.isArray(sourceIds)) return [CAU_SOURCES["about-cau"]];

  const uniqueIds = Array.from(
    new Set(sourceIds.filter((id): id is string => typeof id === "string"))
  );
  const sources = uniqueIds
    .map(id => CAU_SOURCES[id])
    .filter((source): source is CAUSource => Boolean(source));

  return sources.slice(0, 3);
}

function reply(
  answer: string,
  sourceIds: string[],
  chips?: Array<{ label: string; prompt: string }>,
  mode: "verified" | "fallback" = "verified"
): AssistantReply {
  return { answer, sources: sourcesForIds(sourceIds), suggestedChips: chips, mode };
}

export function isConversationalQuestion(question: string): boolean {
  const normalized = String(question || "").trim().toLocaleLowerCase();
  // Arabic greetings & common conversational phrases
  if (
    /^(?:مرحبا|مرحباً|أهلا|اهلا|أهلاً|السلام\s+عليكم|سلام|مساء\s+الخير|صباح\s+الخير|كيفك|كيف\s+الحال|كيفك\s+انت|من\s+انت|من\s+أنت|شو\s+أخبارك|أخباركم|هلا|مرحبتين|شكرا|شكراً|يعطيك\s+العافية)[!?.\s]*$/.test(
      normalized
    )
  ) {
    return true;
  }
  // Turkish greetings & conversational phrases
  if (
    /^(?:merhaba(?:lar)?|selam(?:lar)?|günaydın|iyi\s+(?:günler|akşamlar)|nasılsın(?:ız)?|teşekkür(?:ler| ederim)?|sağol(?:un)?|kimsin|ne\s+yapabilirsin)[!?.\s]*$/i.test(
      normalized
    )
  ) {
    return true;
  }
  // Russian greetings
  if (
    /^(?:привет|здравствуйте|добрый\s+(?:день|вечер|утро)|как\s+дела|спасибо)[!?.\s]*$/i.test(
      normalized
    )
  ) {
    return true;
  }
  // English greetings & conversational phrases
  return /^(?:hi|hello|hey|good\s+(?:morning|afternoon|evening)|thanks?|thank you|how are (?:you|u)(?: doing)?|how do you do|who are you|what can you (?:do|help(?: me)? with)|what do you do|help|what)[!?.\s]*$/i.test(
    normalized
  );
}

export function createFallbackAnswer(
  question: string,
  history?: Array<{ role: string; content: string }>
): AssistantReply {
  const current = question.toLocaleLowerCase();
  const lastUserMsg =
    (history || [])
      .slice()
      .reverse()
      .find(m => m.role === "user")
      ?.content.toLocaleLowerCase() || "";

  // Only blend context if current message is an incomplete follow-up clause, NEVER for greetings or new topics
  const isFollowUp = /^(?:and|what about|how about|cost\??|requirements\??|where\??|who\??|tell me more|is it in english|fees\??|duration\??|how much)\b/i.test(current.trim());
  const query = (lastUserMsg && isFollowUp) ? `${lastUserMsg} ${current}` : current;
  const lang: SupportedLanguage = detectLanguage(question);

  if (isConversationalQuestion(query)) {
    const isHowAreYou = /how are (?:you|u)|how do you do|how's it going|كيفك|كيف\s+الحال|شخبارك|شو\s+أخبارك|nasılsın|nasıl gidiyor|как\s+дела/i.test(query);
    const isThankYou = /thanks?|thank you|teşekkür|شكرا|شكراً|спасибо/i.test(query);

    if (isHowAreYou) {
      if (lang === "ar") {
        return reply(
          "أنا بخير والحمد لله، شكراً لسؤالك! 😊 كيف حالك أنت اليوم؟ يسعدني مساعدتك في كل ما يخص البرامج الدراسية، الرسوم والمنح، والقبول في جامعة قبرص أيدن (CAU).",
          [],
          [
            { label: "💰 الرسوم والمنح", prompt: "كم رسوم الدراسة والمنح المتاحة في جامعة قبرص أيدن؟" },
            { label: "🎓 تخصصات الجامعة", prompt: "ما هي التخصصات والبرامج المتاحة في الجامعة؟" },
            { label: "📝 كيفية التقديم", prompt: "كيف أقدم على الجامعة وما هي الأوراق المطلوبة؟" },
          ]
        );
      }
      if (lang === "tr") {
        return reply(
          "İyiyim, teşekkür ederim! 😊 Siz nasılsınız? Kıbrıs Aydın Üniversitesi (CAU) hakkında tüm sorularınızda size yardımcı olmaktan mutluluk duyarım.",
          [],
          [
            { label: "💰 Harç ve Burslar", prompt: "Harç ücretleri ve burs imkanları nelerdir?" },
            { label: "🎓 Bölümler", prompt: "Hangi lisans ve yüksek lisans bölümleri var?" },
            { label: "📝 Başvuru Süreci", prompt: "Başvuru ve kayıt süreci nasıl işliyor?" },
          ]
        );
      }
      if (lang === "ru") {
        return reply(
          "У меня все отлично, спасибо за вопрос! 😊 Как ваши дела? Чем я могу помочь вам по поводу поступления и программ в Кипрском университете Айдын (CAU)?",
          [],
          [
            { label: "💰 Стоимость и стипендии", prompt: "Какова стоимость обучения и стипендии в CAU?" },
            { label: "🎓 Программы", prompt: "Какие программы доступны в университете?" },
            { label: "📝 Как подать заявку", prompt: "Как подать заявку на поступление?" },
          ]
        );
      }
      return reply(
        "I'm doing great, thank you for asking! 😊 I am CAU’s public information assistant and verified admissions advisor. How are you today? I'm here to help you with everything regarding Cyprus Aydın University (CAU) — degree programs, tuition fees, scholarships, or life in Kyrenia. How can I assist you?",
        [],
        [
          { label: "Tuition & Fees", prompt: "How much is tuition for international students?" },
          { label: "Scholarships (Up to 100%)", prompt: "What scholarships are available for international students?" },
          { label: "Degree Programmes", prompt: "What degree programmes are offered at CAU?" },
          { label: "How to Apply", prompt: "How do I apply online for admission?" },
        ]
      );
    }

    if (isThankYou) {
      if (lang === "ar") {
        return reply(
          "على الرحب والسعة! يسعدني دائماً مساعدتك. 😊 إذا كان لديك أي استفسار آخر عن الجامعة أو الحياة في قبرص، أنا دائماً في الخدمة.",
          [],
          [
            { label: "💰 الرسوم والمنح", prompt: "كم رسوم الدراسة والمنح المتاحة في جامعة قبرص أيدن؟" },
            { label: "🎓 تخصصات الجامعة", prompt: "ما هي التخصصات والبرامج المتاحة في الجامعة؟" },
          ]
        );
      }
      if (lang === "tr") {
        return reply(
          "Rica ederim! Size yardımcı olmaktan mutluluk duydum. 😊 Üniversitemiz hakkında başka bir sorunuz olursa sormaktan çekinmeyin.",
          [],
          [
            { label: "💰 Harç ve Burslar", prompt: "Harç ücretleri ve burs imkanları nelerdir?" },
            { label: "🎓 Bölümler", prompt: "Hangi lisans ve yüksek lisans bölümleri var?" },
          ]
        );
      }
      return reply(
        "You're very welcome! I'm glad I could help. 😊 Feel free to ask if you have any more questions about programmes, tuition fees, scholarships, or student life at CAU.",
        [],
        [
          { label: "Tuition & Fees", prompt: "How much is tuition for international students?" },
          { label: "Scholarships (Up to 100%)", prompt: "What scholarships are available for international students?" },
        ]
      );
    }

    if (lang === "ar") {
      return reply(
        "أهلاً وسهلاً بك في جامعة قبرص أيدن (CAU)! 👋\n\nأنا مرشدك الجامعي المعتمد للقبول وشؤون الجامعة في كيرينيا (شمال قبرص). يسعدني إجابتك بدقة عن:\n• **البرامج والتخصصات** (48 تخصصاً في البكالوريوس، الماجستير، الدكتوراه، والدبلوم)\n• **الرسوم والمنح الدراسية** (منح جزئية وكاملة من 50% وحتى 100%)\n• **خطوات التقديم والقبول** للطلاب الدوليين\n• **السكن الطلابي والحياة الجامعية** في مدينة كيرينيا\n\nكيف يمكنني مساعدتك اليوم؟",
        [],
        [
          { label: "💰 الرسوم والمنح (تصل لـ 100%)", prompt: "كم رسوم الدراسة والمنح المتاحة في جامعة قبرص أيدن؟" },
          { label: "🎓 تخصصات البكالوريوس والماجستير", prompt: "ما هي التخصصات والبرامج المتاحة في الجامعة؟" },
          { label: "📝 كيفية التقديم وشروط القبول", prompt: "كيف أقدم على الجامعة وما هي الأوراق المطلوبة؟" },
          { label: "💬 التواصل عبر واتساب", prompt: "كيف أتواصل مع مكتب القبول الدولي عبر واتساب؟" },
        ]
      );
    }
    if (lang === "tr") {
      return reply(
        "Merhaba! Kıbrıs Aydın Üniversitesi'ne (CAU) hoş geldiniz. 👋\n\nResmi kampüs ve uluslararası kabul danışmanınızım. Üniversitemizin 48 lisans ve lisansüstü programı, harç ücretleri, %50–%100 burs imkanları, Girne'deki yurtlar ve başvuru süreçleri hakkında size yardımcı olabilirim.\n\nSize nasıl yardımcı olabilirim?",
        [],
        [
          { label: "💰 Harç Ücretleri ve Burslar", prompt: "Harç ücretleri ve burs imkanları nelerdir?" },
          { label: "🎓 Lisans ve Yüksek Lisans Bölümleri", prompt: "Hangi lisans ve yüksek lisans bölümleri var?" },
          { label: "📝 Başvuru ve Kayıt Süreci", prompt: "Başvuru ve kayıt süreci nasıl işliyor?" },
          { label: "💬 WhatsApp Kabul Ofisi", prompt: "WhatsApp ile nasıl iletişime geçebilirim?" },
        ]
      );
    }
    if (lang === "ru") {
      return reply(
        "Здравствуйте! Добро пожаловать в Кипрский университет Айдын (CAU). 👋\n\nЯ ваш официальный гид по поступлению и кампусу в Кирении. Могу предоставить точную информацию о 48 программах, стоимости обучения, стипендиях (до 100%), общежитиях и подаче документов.\n\nЧем я могу вам помочь?",
        [],
        [
          { label: "💰 Стоимость и стипендии", prompt: "Какова стоимость обучения и стипендии в CAU?" },
          { label: "🎓 Программы бакалавриата и магистратуры", prompt: "Какие программы доступны в университете?" },
          { label: "📝 Как подать заявку", prompt: "Как подать заявку на поступление?" },
          { label: "💬 Связаться в WhatsApp", prompt: "Как связаться с приемной комиссией в WhatsApp?" },
        ]
      );
    }
    return reply(
      "Hello! Welcome to Cyprus Aydın University (CAU). 👋 I am CAU’s public information assistant and verified admissions advisor. I can help with our 48 catalogued programmes, tuition fees, 50%–100% scholarships, professor directory, accommodation in Kyrenia, and how to apply online.",
      [],
      [
        { label: "Tuition & Fees", prompt: "How much is tuition for international students?" },
        { label: "Scholarships (Up to 100%)", prompt: "What scholarships are available for international students?" },
        { label: "Software Engineering", prompt: "Tell me about the Software Engineering degree." },
        { label: "Faculty of Dentistry", prompt: "Tell me about Faculty of Dentistry admission and tuition." }
      ]
    );
  }

  // Sports, Athletics, Football Team, Gym & Fitness Facilities
  if (
    /football|soccer|futsal|basketball|volleyball|tennis|table tennis|sport|sports|gym|fitness|athletics|team\b|teams\b|stadium|pitch|tournament|rector.*cup|workout|exercise|training|spor|futbol|basketbol|voleybol|tenis|turnuva|saha|antreman|kulüp|kulübü|كرة قدم|كرة القدم|رياضة|رياضات|فريق|فرق|نادي رياضي|صالات رياضية|جيم|نوادي|футбол|спорт|команда|тренировк/.test(
      query
    )
  ) {
    if (lang === "ar") {
      return reply(
        "**الفرق الرياضية، فريق كرة القدم والمرافق في جامعة قبرص أيدن (CAU) ⚽🏆**\n\n" +
          "نعم، تمتلك جامعة قبرص أيدن نشاطاً رياضياً حيوياً وفرقاً رسمية تمثل الجامعة:\n\n" +
          "• **فريق كرة القدم الرسمي والصالات (Futsal)**:\n" +
          "  تمتلك الجامعة فريقاً رسمياً لكرة القدم (11 لاعباً) وفريقاً لكرة قدم الصالات يشارك في بطولات **الاتحاد الرياضي للجامعات في شمال قبرص (KKTC Üniversite Sporları Federasyonu)**.\n" +
          "• **بطولة كأس رئيس الجامعة السنوية (Rektörlük Kupası)**:\n" +
          "  بطولة دورية سنوية في كرة القدم يتنافس فيها طلاب الكليات المختلفة والجاليات الدولية للفوز بكأس البطولة.\n" +
          "• **الفرق الرياضية الأخرى**:\n" +
          "  - فريق كرة السلة (طلاب وطالبات)\n" +
          "  - فريق الكرة الطائرة\n" +
          "  - فريق تنس الطاولة وبطولات الشطرنج\n" +
          "• **المرافق الرياضية وصالة الجيم (Fitness Gym)**:\n" +
          "  - صالة لياقة بدنية حديثة مجهزة بالكامل ومتاحة مجاناً لجميع طلاب الجامعة المسجلين.\n" +
          "  - ملاعب رياضية خارجية لكرة السلة والكرة الطائرة في الحرم الجامعي.\n" +
          "  - ملاعب عشب صناعي وتنسيق مع مجمعات كيرينيا الرياضية للمباريات الرسمية.\n" +
          "• **كيفية الانضمام وتجارب الأداء**:\n" +
          "  تقام اختبارات الانضمام للفرق في بداية فصلي الخريف والربيع بتنظيم **إدارة الصحة والثقافة والرياضة (SKS)**. يحق لجميع الطلاب الدوليين المشاركة والتسجيل.\n\n" +
          "للتسجيل أو الاستفسار: تواصل عبر البريد **bilgi@cau.edu.tr** أو تفضل بزيارة مكتب SKS / شؤون الطلاب في الحرم الجامعي.",
        ["cau-main", "about-cau", "student-affairs"],
        [
          { label: "⚽ تجارب أداء كرة القدم", prompt: "كيف أنضم إلى تجارب أداء فريق كرة القدم بالجامعة؟" },
          { label: "🏋️ صالة الجيم والياقة", prompt: "أين تقع صالة الجيم وما هي أوقات الدخول؟" },
          { label: "🏢 السكن الطلابي", prompt: "ما هي خيارات السكن الطلابي المتاحة في كيرينيا؟" },
          { label: "💰 الرسوم والمنح", prompt: "كم رسوم الدراسة والمنح المتاحة في جامعة قبرص أيدن؟" }
        ]
      );
    }
    if (lang === "tr") {
      return reply(
        "**CAU Spor Takımları, Futbol ve Tesisler ⚽🏆**\n\n" +
          "Evet! Kıbrıs Aydın Üniversitesi (CAU) aktif üniversite spor takımlarına ve modern spor olanaklarına sahiptir:\n\n" +
          "• **CAU Futbol ve Futsal Takımı**:\n" +
          "  Üniversitemiz, **KKTC Üniversite Sporları Federasyonu** liglerinde ve şampiyonalarında mücadele eden resmi Erkek Futbol (11'e 11) ve Futsal (Salon Futbolu) takımlarına sahiptir.\n" +
          "• **Geleneksel Rektörlük Kupası Futbol Turnuvası**:\n" +
          "  Her akademik yıl fakülteler ve uluslararası öğrenci toplulukları arasında düzenlenen prestijli bir kampüs ligidir.\n" +
          "• **Diğer Üniversite Spor Takımları**:\n" +
          "  - Erkek ve Kadın Basketbol Takımları\n" +
          "  - Voleybol Takımı\n" +
          "  - Masa Tenisi ve Satranç Kulübü\n" +
          "• **Spor Tesisleri ve Fitness Salonu**:\n" +
          "  - Kampüs içerisinde tüm kayıtlı öğrencilere ücretsiz hizmet veren modern kardiyo ve ağırlık aletleriyle donatılmış **Fitness / Kondisyon Salonu**.\n" +
          "  - Açık basketbol ve voleybol sahaları.\n" +
          "  - Girne genelindeki halı sahalar ve 20 Temmuz Mete Adanır Stadyumu çevresindeki spor kompleksleriyle federasyon antrenman iş birlikleri.\n" +
          "• **Takımlara Katılım ve Seçmeler**:\n" +
          "  Her Güz ve Bahar dönemi başında **Sağlık, Kültür ve Spor Daire Başkanlığı (SKS)** koordinasyonunda sporcu seçmeleri düzenlenir. Tüm öğrencilerimiz katılabilir.\n\n" +
          "Detaylı bilgi ve seçme tarihleri için: **bilgi@cau.edu.tr** (+90 392 650 00 00) veya kampüsteki SKS birimini ziyaret edebilirsiniz.",
        ["cau-main", "about-cau", "student-affairs"],
        [
          { label: "⚽ Futbol Seçmeleri", prompt: "Futbol takımı seçmelerine nasıl katılabilirim?" },
          { label: "🏋️ Fitness Salonu", prompt: "Kampüsteki fitness salonu olanakları nelerdir?" },
          { label: "🏢 Öğrenci Yurtları", prompt: "Girne'de hangi yurt imkanları bulunuyor?" },
          { label: "💰 Harç ve Burslar", prompt: "Harç ücretleri ve burs imkanları nelerdir?" }
        ]
      );
    }
    return reply(
      "**CAU Sports Teams, Football & Athletics Facilities ⚽🏆**\n\n" +
        "Yes! Cyprus Aydın University (CAU) has active collegiate sports teams and dedicated athletic facilities:\n\n" +
        "• **CAU Official Football & Futsal Team**:\n" +
        "  CAU competes in the **TRNC Inter-University Sports Federation (KKTC Üniversite Sporları Federasyonu)** national championships with official Men's Football (11-a-side) and Futsal (indoor soccer) varsity squads.\n" +
        "• **Intramural Rector's Cup (Rektörlük Kupası)**:\n" +
        "  An annual campus-wide football tournament where international student teams and academic departments compete for championship trophies.\n" +
        "• **Other Varsity Teams & Clubs**:\n" +
        "  - **Basketball Teams** (Men's & Women's)\n" +
        "  - **Volleyball Team**\n" +
        "  - **Table Tennis Team** & Chess League\n" +
        "• **Sports Facilities & Campus Gym**:\n" +
        "  - **On-Campus Fitness Center / Gym**: Equipped with cardio treadmills, free weights, and resistance machines, completely free for registered CAU students.\n" +
        "  - **Multi-purpose outdoor courts** for basketball and volleyball.\n" +
        "  - Regular access to Kyrenia artificial turf pitches (halı saha) and partnerships with municipal stadiums for league matches.\n" +
        "• **How to Join & Tryouts**:\n" +
        "  Tryouts are held at the start of every Fall and Spring semester by the **Directorate of Health, Culture, and Sports (SKS)**. All enrolled international students are eligible to try out!\n\n" +
        "For tryout announcements or to register with a sports club, contact Student Affairs at **bilgi@cau.edu.tr** (+90 392 650 00 00).",
      ["cau-main", "about-cau", "student-affairs"],
      [
        { label: "⚽ Football Tryouts", prompt: "How can I join the CAU football team tryouts?" },
        { label: "🏋️ Campus Gym & Fitness", prompt: "Where is the fitness gym located on campus?" },
        { label: "🌴 Living in Cyprus", prompt: "What is the cost of living in Kyrenia for students?" },
        { label: "💰 Tuition & Scholarships", prompt: "What are the tuition fees and scholarships?" }
      ]
    );
  }

  // Cyprus, Kyrenia (TRNC) Living, Costs, Weather, Transport, Safety & Visas
  if (
    /living cost|cost of living|expenses|how much to live|weather|climate|currency|lira|safe|safety|crime|secure|transport|shuttle|bus|dolmus|dolmuş|taxi|beach|beaches|travel|flight|ticket|visa|residence permit|residency|ikamet|part-time|work|job|employment|تكلفة المعيشة|المعيشة في قبرص|مصاريف المعيشة|طقس|أمان|مواصلات|عمل الطلاب|yaşam maliyeti|girne hayat|kıbrıs yaşam|güvenli mi|çalışma izni|havalimanı|стоимость проживан|погода на кипре|безопасност/.test(
      query
    )
  ) {
    if (lang === "ar") {
      return reply(
        "**الحياة والمعيشة الطلابية في مدينة كيرينيا، شمال قبرص (TRNC) 🌴🏛️**\n\n" +
          "تعد كيرينيا (Girne) عروس البحر الأبيض المتوسط وإحدى أجمل المدن الساحلية والجامعية في المنطقة:\n\n" +
          "• **تكاليف المعيشة الشهرية**:\n" +
          "  تتراوح المصاريف الشهرية للطالب بين **350 إلى 500 يورو شهرياً** (تشمل الطعام، السوبرماركت، المواصلات، باقة الإنترنت وشريحة الهاتف، والمصروف الشخصي).\n" +
          "• **العملة والتعاملات المالية**:\n" +
          "  - العملة الرسمية للمشتريات اليومية هي **الليرة التركية (TRY / ₺)**.\n" +
          "  - اليورو والدولار والجنيه الإسترليني مقبولة على نطاق واسع، والرسوم الدراسية تسدد باليورو.\n" +
          "  - أجهزة الصراف الآلي (ATM) تقبل بطاقات فيزا وماستركارد الدولية في كل مكان.\n" +
          "• **الطقس والمناخ**:\n" +
          "  - مناخ متوسطي مشمس بأكثر من **300 يوم شمس سنوياً**.\n" +
          "  - الصيف دافئ ومشمس (30–38 درجة مئوية)، والشتاء معتدل (12–18 درجة مئوية) ولا تسقط ثلوج على الساحل.\n" +
          "• **المواصلات وباصات الجامعة المجانية**:\n" +
          "  - توفر الجامعة **حافلات نقل مجانية** منتظمة تربط بين السكن الطلابي، مركز كيرينيا، والحرم الجامعي.\n" +
          "  - تتوفر حافلات النقل العامة (الدولموش) بسهولة للتنقل بين كيرينيا ونيقوسيا (Lefkoşa).\n" +
          "• **الأمان والاستقرار**:\n" +
          "  - تصنف شمال قبرص عالمياً بين **أكثر الوجهات أمناً وأماناً للطلاب** مع انعدام الجريمة ومجتمع طلابي دولي ودود من 30+ جنسية.\n" +
          "• **الاستقبال من المطار والإقامة**:\n" +
          "  - توفر الجامعة **خدمة استقبال مجانية من مطار إرجان (Ercan Airport - ECN)** للطلاب الجدد.\n" +
          "  - تصدر تأشيرة الدخول في المطار بموجب ورقة القبول، وتتولى الجامعة مساعدة الطالب في استخراج الإقامة الطلابية (İkamet).",
        ["cau-main", "international-home", "accommodation"],
        [
          { label: "🏢 السكن الطلابي", prompt: "ما هي تفاصيل السكن الطلابي المعتمد في كيرينيا؟" },
          { label: "🚌 مواصلات الجامعة", prompt: "هل تتوفر حافلات نقل مجانية للحرم الجامعي؟" },
          { label: "💰 الرسوم والمنح", prompt: "كم رسوم الدراسة والمنح المتاحة في جامعة قبرص أيدن؟" },
          { label: "⚽ الفرق الرياضية", prompt: "هل يوجد فريق كرة قدم وفرق رياضية في الجامعة؟" }
        ]
      );
    }
    if (lang === "tr") {
      return reply(
        "**Kuzey Kıbrıs (Girne) Öğrenci Yaşamı ve Yaşam Maliyetleri 🌴🏛️**\n\n" +
          "Akdeniz’in incisi Girne, güvenli, huzurlu ve tarihi limanıyla dünyanın en popüler öğrenci kentlerinden biridir:\n\n" +
          "• **Aylık Yaşam Maliyeti**:\n" +
          "  Bir öğrencinin aylık ortalama masrafı **350 – 500 EUR** civarındadır (yemek, market alışverişi, yerel ulaşım, GSM/internet ve kişisel harcamalar dahil).\n" +
          "• **Para Birimi ve Bankacılık**:\n" +
          "  - Günlük alışverişlerde ve çarşıda geçerli para birimi **Türk Lirası'dır (TRY / ₺)**.\n" +
          "  - Üniversite harçları EUR üzerinden ödenir; EUR, USD ve GBP dövizleri her yerde kabul görür.\n" +
          "• **İklim ve Hava Durumu**:\n" +
          "  - Yılda **300 günden fazla güneşli** ılıman Akdeniz iklimi.\n" +
          "  - Yazlar sıcak ve güneşli (30–38°C), kışlar ılık ve yağışlıdır (12–18°C).\n" +
          "• **Ulaşım ve Ücretsiz Kampüs Servisleri**:\n" +
          "  - CAU, öğrenci yurtları, Girne merkez ve ana kampüs arasında gün boyu **ücretsiz öğrenci ring servisleri** çalıştırmaktadır.\n" +
          "  - Şehirler arası ulaşım için dolmuşlar (Girne-Lefkoşa-Mağusa) sıkça hareket eder.\n" +
          "• **Güvenlik**:\n" +
          "  - KKTC, dünyanın suç oranı en düşük ve öğrenciler için en güvenli ülkeleri arasında yer alır.\n" +
          "• **Havalimanı Karşılama ve Öğrenci İkameti**:\n" +
          "  - Yeni kayıt yaptıran uluslararası öğrencilere **Ercan Havalimanı’ndan (ECN) ücretsiz karşılama** hizmeti sunulur.\n" +
          "  - Kabul mektubu ile havalimanında öğrenci giriş vizesi alınır; kayıt sonrası Öğrenci İşleri online ikamet izni sürecini yürütür.",
        ["cau-main", "international-home", "accommodation"],
        [
          { label: "🏢 Öğrenci Yurtları", prompt: "Girne'de hangi yurt imkanları bulunuyor?" },
          { label: "🚌 Kampüs Servisleri", prompt: "Kampüse ücretsiz öğrenci servisi var mı?" },
          { label: "💰 Harç ve Burslar", prompt: "Harç ücretleri ve burs imkanları nelerdir?" },
          { label: "⚽ Spor ve Futbol", prompt: "Üniversitede futbol takımı ve spor olanakları var mı?" }
        ]
      );
    }
    return reply(
      "**Student Life & Living in Kyrenia, Northern Cyprus (TRNC) 🌴🏛️**\n\n" +
        "Kyrenia (Girne) is one of the Mediterranean's safest and most beautiful university towns:\n\n" +
        "• **Monthly Living Expenses**:\n" +
        "  Average student monthly living budget is **350 – 500 EUR / month** (covering food, groceries, mobile plan, local transport, and personal leisure).\n" +
        "• **Currency & Payments**:\n" +
        "  - The local currency for day-to-day purchases is the **Turkish Lira (TRY / ₺)**.\n" +
        "  - Tuition is paid in EUR; foreign currencies (EUR, USD, GBP) and international cards (Visa/Mastercard) are widely used.\n" +
        "• **Climate & Weather**:\n" +
        "  - Mediterranean climate with **over 300 days of sunshine** every year!\n" +
        "  - Summers (June–Sept) are warm and sunny (30–38°C); winters (Dec–Feb) are mild and green (12–18°C).\n" +
        "• **Complimentary Transportation**:\n" +
        "  - CAU operates **free campus shuttle buses** running throughout the day between student dormitories, Kyrenia city center, and the main campus.\n" +
        "  - Shared minibuses ('dolmuş') connect Kyrenia with Nicosia and Famagusta.\n" +
        "• **World-Class Safety**:\n" +
        "  - Northern Cyprus is ranked among the safest study destinations worldwide, with virtually zero violent crime.\n" +
        "• **Airport Pickup & Student Visa**:\n" +
        "  - **Free airport pickup** from Ercan International Airport (ECN) for incoming students who submit flight details to **admission@cau.edu.tr**.\n" +
        "  - Upon arrival with your CAU Official Acceptance Letter, you receive your student transit visa, followed by TRNC Student Residence Permit (İkamet) guidance from Student Affairs.",
      ["cau-main", "international-home", "accommodation"],
      [
        { label: "🏢 Student Dormitories", prompt: "What dormitories are available for students in Kyrenia?" },
        { label: "🚌 Free Campus Shuttle", prompt: "Is there a free bus shuttle to campus?" },
        { label: "⚽ Sports & Football", prompt: "Is there any football team at CAU?" },
        { label: "💰 Tuition & Scholarships", prompt: "What are the tuition fees and scholarships?" }
      ]
    );
  }

  // Specific: who teaches / staff for a programme — return programme-specific staff, not generic
  if (/akademik|academic staff|\bprof\b|prof\.|professor|lecturer|faculty member|instructor|\bdoctor\b|hoca|öğretim|kadro|staff directory|who teaches|who is.*teach|which.*teach|teach.*software|teach.*computer|teach.*nursing/.test(query)) {
    const staffMatch = findStaffForQuery(query);
    if (staffMatch) {
      return reply(
        `For **${staffMatch.label}** at CAU, the official directory at akademikkadro.cau.edu.tr lists:\n\n• ${staffMatch.staff.join("\n• ")}\n\nYou can search the live staff portal by faculty and academic title to view photos, research publications, and official emails (name@cau.edu.tr). For employment verification, contact Personnel at ik@cau.edu.tr.`,
        ["akademik-kadro", "personnel", "programmes"],
        [
          { label: "Faculty Deans", prompt: "Who are the deans of faculties at CAU?" },
          { label: "Software Engineering Staff", prompt: "Who teaches in Software Engineering?" },
          { label: "Staff Directory Link", prompt: "How do I search akademikkadro.cau.edu.tr?" },
          { label: "Contact Personnel", prompt: "How do I reach Personnel Department ik@cau.edu.tr?" }
        ]
      );
    }
    // generic fallback if no programme keyword matched but still a staff question
    return reply(
      "You can find CAU academic staff on the official directory at **akademikkadro.cau.edu.tr** — searchable by faculty (e.g., Dentistry, Law, Tourism, Engineering, Health Sciences) and title (Prof. Dr., Doç. Dr., Dr. Öğr. Üyesi). It lists 100+ distinguished scholars with photos, department affiliations, and official emails. Notable appointments include Prof. Dr. Cem Kurtoğlu (Dean of Dentistry), Prof. Dr. Hikmet Ş. Aybar (Dean of Engineering), and Prof. Dr. Hasan Tunç (Dean of Tourism). For employment verification contact Personnel at ik@cau.edu.tr.",
      ["akademik-kadro", "personnel"],
      [
        { label: "Engineering Professors", prompt: "Who teaches in Faculty of Engineering?" },
        { label: "Dentistry Professors", prompt: "Who teaches in Faculty of Dentistry?" },
        { label: "Faculty Deans", prompt: "Who are the faculty deans at CAU?" },
        { label: "Browse Staff Portal", prompt: "Where can I view the staff directory?" }
      ]
    );
  }

  if (/dean of students|student dean/.test(query)) {
    return reply(
      "I could not verify a staff member with the exact title of Dean of Students in the current CAU registry. However, the Office of Student Affairs lists Burcu TUNAY as Acting Head of Department (burcutunay@cau.edu.tr; extension 6020). For the Student Dean structure and student union representation, visit cau.edu.tr/en/students-dean/.",
      ["student-affairs"],
      [
        { label: "Student Affairs Contacts", prompt: "What are the contact details for Student Affairs?" },
        { label: "Course Registration", prompt: "How does course registration work?" }
      ]
    );
  }

  if (/student affairs|transcript|student certificate|graduation|attendance|honou?r student|high honou?r|course registration/.test(query)) {
    return reply(
      "CAU’s Office of Student Affairs handles registration, course enrolment, official transcripts, student certificates, graduation, and academic records. You can reach the office at **bilgi@cau.edu.tr** (+90 392 650 00 00). Attendance minimums are 70% for theoretical courses and 80% for practical/laboratory sessions; Honor status requires GPA 3.00–3.49, High Honor requires GPA 3.50–4.00.",
      ["student-affairs"],
      [
        { label: "Contact Student Affairs", prompt: "How do I contact the Student Affairs office?" },
        { label: "Student ID Card", prompt: "How do I get my student ID card?" },
        { label: "Tuition & Fees", prompt: "What are the tuition fees per year?" }
      ]
    );
  }

  if (/student id|id card|forgot.*password|password.*forgot|registration freeze|freeze.*registration|make[- ]?up exam|gpa|grade point average|course exemption/.test(query)) {
    return reply(
      "CAU’s Student Affairs FAQ states that an official Student ID Card is issued upon registration and remains active throughout enrollment. For password resets, access the Student Information System (EBS) or contact **bilgi@cau.edu.tr**. The same office provides guidance on semester registration freezes, transfer course exemptions, and make-up examination schedules.",
      ["student-affairs"],
      [
        { label: "Student Affairs Email", prompt: "What is the contact email for Student Affairs?" },
        { label: "Academic Calendar", prompt: "Where can I find the academic calendar?" }
      ]
    );
  }

  // International Admissions Team, Counselors & Advisors (Frah Badawi, Mohamed Khattab, Aleg Losich, Yasin Ergin)
  if (
    /frah|badawi|khattab|losich|ergin|admissions team|admission team|admissions advisor|admission advisor|international advisor|international team|who can help me with admission|who to contact for admission|فرح|بدوي|خطاب/.test(
      query
    )
  ) {
    if (/frah|badawi|فرح|بدوي/.test(query)) {
      if (lang === "ar") {
        return reply(
          "**فرح بدوي — مستشارة القبول الدولي والتسكين في جامعة قبرص أيدن (CAU) 🎓**\n\n" +
            "• **المسمى الوظيفي والقسم**: مستشارة القبول الدولي (International Admissions Advisor) | قسم القبول والتسكين (Admissions & Settlement)\n" +
            "• **المهام والمسؤوليات المعتمدة**:\n" +
            "  - تدقيق ومعادلة شهادات الثانوية العامة والمؤهلات الأكاديمية للطلاب الدوليين.\n" +
            "  - إصدار خطابات القبول المبدئي والرسمي (Acceptance Letters).\n" +
            "  - متابعة إجراءات تصاريح وتأشيرات الدخول مع وزارة الخارجية والأمن العام.\n" +
            "  - تنسيق خدمة الاستقبال المجاني من مطار إرجان (Ercan Airport - ECN).\n" +
            "  - مساعدة الطلاب الجدد في التسكين الجامعي في كيرينيا وإتمام التسجيل النهائي.\n" +
            "• **اللغات**: العربية، الإنجليزية، والتركية\n" +
            "• **البريد الإلكتروني الرسمي**: **fbadawi@cau.edu.tr**\n" +
            "• **الرقم الداخلي**: Ext: 2104 | هاتف المقسم: +90 392 650 00 00\n" +
            "• **مقر المكتب**: مبنى رئاسة الجامعة (Rectorate Building)، الطابق الأرضي، مكتب 104، كيرينيا.\n\n" +
            "**للتواصل السريع والتقديم**:\n" +
            "• واتساب مكتب القبول: **+90 548 835 71 71**\n" +
            "• التقديم الإلكتروني: [apply.cau.edu.tr](https://apply.cau.edu.tr/)",
          ["how-to-apply", "international-home", "about-cau"],
          [
            { label: "📝 تقديم طلب القبول", prompt: "كيف أقدم على الجامعة وما هي الأوراق المطلوبة؟" },
            { label: "💰 الرسوم والمنح ($)", prompt: "كم رسوم الدراسة والمنح المتاحة في جامعة قبرص أيدن؟" },
            { label: "💬 واتساب القبول", prompt: "كيف أتواصل مع مكتب القبول الدولي عبر واتساب؟" },
            { label: "🏢 السكن الطلابي", prompt: "ما هي تفاصيل السكن الطلابي المعتمد في كيرينيا؟" }
          ]
        );
      }
      return reply(
        "**Frah Badawi — International Admissions Advisor at Cyprus Aydın University (CAU) 🎓**\n\n" +
          "• **Role & Department**: International Admissions Advisor | Dept. of Admissions & Settlement\n" +
          "• **Official Responsibilities**:\n" +
          "  - Evaluates international academic credentials and secondary school certificates.\n" +
          "  - Issues Official Conditional and Unconditional Acceptance Letters.\n" +
          "  - Coordinates student transit visa clearance documentation.\n" +
          "  - Arranges complimentary airport pickup from Ercan International Airport (ECN).\n" +
          "  - Provides dedicated onboarding, dorm check-in, and settlement support for newly arrived students in Kyrenia.\n" +
          "• **Languages Spoken**: English, Arabic, and Turkish\n" +
          "• **Official Email**: **fbadawi@cau.edu.tr**\n" +
          "• **Direct Extension**: Ext: 2104 | Switchboard: +90 392 650 00 00 (Ext: 2100)\n" +
          "• **Office Location**: Ground Floor, Room 104, Rectorate Building, CAU Campus, Kyrenia.\n\n" +
          "**Direct Admissions Contacts**:\n" +
          "• **Admissions Email**: admission@cau.edu.tr\n" +
          "• **WhatsApp (24/7 International Desk)**: +90 548 835 71 71\n" +
          "• **Online Application Portal**: https://apply.cau.edu.tr/",
        ["how-to-apply", "international-home", "about-cau"],
        [
          { label: "Apply Online", prompt: "How do I apply for international admission?" },
          { label: "Tuition & Fees ($)", prompt: "What are the tuition fees and scholarships?" },
          { label: "WhatsApp Admissions", prompt: "How do I contact admissions on WhatsApp?" },
          { label: "Dormitories & Housing", prompt: "What accommodation is available for international students?" }
        ]
      );
    }
    if (/khattab|خطاب/.test(query)) {
      return reply(
        "**Mohamed Khattab — International Office Counselor & Regional Advisor at Cyprus Aydın University (CAU) 🎓**\n\n" +
          "• **Role & Department**: International Office Counselor & Regional Advisor | Dept. of International Admissions & Counseling\n" +
          "• **Official Responsibilities**:\n" +
          "  - Comprehensive admissions guidance and academic department selection advisory.\n" +
          "  - Evaluates international scholarship eligibility (50% to 100% merit tiers).\n" +
          "  - Regional counselor for students from the MENA region, Africa, and Central Asia.\n" +
          "  - Facilitates orientation and smooth transition into university life in Northern Cyprus.\n" +
          "• **Languages Spoken**: English, Arabic, and Turkish\n" +
          "• **Official Email**: **mkhattab@cau.edu.tr**\n" +
          "• **Direct Extension**: Ext: 2103 | Switchboard: +90 392 650 00 00\n" +
          "• **Office Location**: Ground Floor, Room 104, Rectorate Building, CAU Campus, Kyrenia.\n\n" +
          "Contact: **admission@cau.edu.tr** | WhatsApp: **+90 548 835 71 71**.",
        ["how-to-apply", "international-home", "about-cau"],
        [
          { label: "Apply Online", prompt: "How do I apply for admission online?" },
          { label: "Tuition & Scholarships", prompt: "What are the tuition fees and scholarships?" },
          { label: "Contact Frah Badawi", prompt: "Who is Frah Badawi?" },
          { label: "Explore Programmes", prompt: "What degree programmes are offered at CAU?" }
        ]
      );
    }
    // General International Office Team
    return reply(
      "**Cyprus Aydın University International Office Team 🌐**\n\n" +
        "Led by **Assoc. Prof. Dr. Tuğrul Günay** (Director of International Office, tugrulgunay@cau.edu.tr), CAU's dedicated multilingual team assists students from 60+ countries:\n\n" +
        "• **Mohamed Khattab** | Counselor & Regional Advisor | Admissions & Counseling | English, Arabic, Turkish | **mkhattab@cau.edu.tr** (Ext: 2103)\n" +
        "• **Frah Badawi** | International Admissions Advisor | Admissions & Settlement | English, Arabic, Turkish | **fbadawi@cau.edu.tr** (Ext: 2104)\n" +
        "• **Aleg Losich** | International Student Advisor | Eurasia & CIS Desk | English, Russian, Turkish | **alosich@cau.edu.tr** (Ext: 2105)\n" +
        "• **Sr. Inst. Yasin Ergin** | Vice Students Dean & Internship Coordinator | Student Dean's Office | English, Turkish | **yergin@cau.edu.tr** (Ext: 2106)\n\n" +
        "**Regional Desks**: Africa (Dr. Samuel Obasi, africa@cau.edu.tr, Ext: 2110) | MENA (Lina Al-Masri, mena@cau.edu.tr, Ext: 2111) | Eurasia & CIS (Natalia Perlova, eurasia@cau.edu.tr, Ext: 2112).\n\n" +
        "**Office**: Ground Floor, Room 104, Rectorate Building, Kyrenia.\n" +
        "**General Admissions**: **admission@cau.edu.tr** | WhatsApp: **+90 548 835 71 71** | Portal: [apply.cau.edu.tr](https://apply.cau.edu.tr/).",
      ["how-to-apply", "international-home", "about-cau"],
      [
        { label: "Contact Frah Badawi", prompt: "Who is Frah Badawi?" },
        { label: "Contact Mohamed Khattab", prompt: "Who is Mohamed Khattab?" },
        { label: "Apply Online", prompt: "How do I apply for international admission?" },
        { label: "Tuition Fees ($)", prompt: "What are the tuition fees for degree programs?" }
      ]
    );
  }

  if (/admission|apply|application|offer letter|visa|international office|how to apply|تقديم|اقدم|أقدم|اسجل|أسجل|قبول|تسجيل|اوراق|أوراق|الأوراق|فيزا|تأشيرة|kayıt|başvuru/.test(query)) {
    if (lang === "ar") {
      return reply(
        "**إجراءات وخطوات التقديم والقبول الدولي في جامعة قبرص أيدن (CAU):**\n\n" +
          "1. **بوابة التقديم الإلكتروني**: زيارة **apply.cau.edu.tr** واختيار التخصص والبلد ثم النقر على *Let's Get Started*.\n" +
          "2. **رفع المستندات (PDF)**:\n" +
          "   • **البكالوريوس والدبلوم**: شهادة الثانوية العامة وكشف العلامات (مترجمة للإنجليزية أو التركية)، جواز السفر، 4 صور شخصية.\n" +
          "   • **الماجستير والدكتوراه**: الشهادة الجامعية وكشف الدرجات، جواز السفر، 4 صور.\n" +
          "3. **شروط إتقان اللغة**:\n" +
          "   • **البكالوريوس**: اختبار الجامعة CSU EPE (B1) | IELTS (5.0) | TOEFL iBT (60) | Duolingo (85) | تومر TÖMER (B1 للتركي).\n" +
          "   • **الدراسات العليا**: CSU EPE (B2) | IELTS (5.5) | TOEFL iBT (65) | Duolingo (90) | TÖMER (B2).\n" +
          "4. **دفعة تأكيد القبول (Deposit)**: $1,250 للبكالوريوس والماجستير، $1,500 للدكتوراه، $2,500 لطب الأسنان لإصدار القبول النهائي الرسمي والتأشيرة.\n" +
          "5. **الاستقبال من المطار**: استقبال مجاني من مطار إرجان الدولي (ECN).\n\n" +
          "للتواصل والمساعدة: **admission@cau.edu.tr** | واتساب: **+90 548 835 71 71**.",
        ["how-to-apply", "international-home"],
        [
          { label: "💰 الرسوم الدراسية بالدولار ($)", prompt: "كم الرسوم الدراسية للبرامج والتخصصات بالدولار؟" },
          { label: "🏆 المنح الدراسية (تصل لـ 100%)", prompt: "ما هي شروط الحصول على منح دراسية؟" },
          { label: "📜 شروط ومتطلبات اللغة", prompt: "ما هي شروط اللغة الإنجليزية للقبول (IELTS / TOEFL / Duolingo)؟" },
          { label: "💬 التواصل عبر واتساب", prompt: "كيف أتواصل مع مكتب القبول عبر واتساب؟" }
        ]
      );
    }
    return reply(
      "**International Admissions Process at CAU:**\n\n" +
        "1. **Online Application**: Visit **apply.cau.edu.tr**, select your program and country, and click *Let's Get Started*.\n" +
        "2. **Required Documents (PDF)**:\n" +
        "   • **Undergraduate / Associate**: High school diploma & transcript (translated into EN/TR), passport, 4 photos.\n" +
        "   • **Master's & Ph.D.**: Previous degree diploma & transcript, passport, 4 photos.\n" +
        "3. **Language Proficiency Cutoffs**:\n" +
        "   • **Undergraduate**: CSU EPE B1 | IELTS 5.0 | TOEFL iBT 60 | Duolingo 85 | TÖMER B1 (Turkish).\n" +
        "   • **Master's & Ph.D.**: CSU EPE B2 | IELTS 5.5 | TOEFL iBT 65 | Duolingo 90 | TÖMER B2 (Turkish).\n" +
        "4. **Required Payment Deposit**: $1,250 USD (Bachelor/Master), $1,500 USD (Ph.D.), $2,500 USD (Dentistry) to release your official unconditional Acceptance Letter for visa & arrival.\n" +
        "5. **Free Airport Pickup**: Provided from Ercan International Airport (ECN) when flight details are submitted.\n\n" +
        "Admissions: **admission@cau.edu.tr** | WhatsApp: **+90 548 835 71 71**.",
      ["how-to-apply", "international-home"],
      [
        { label: "Tuition Fees Schedule ($)", prompt: "What are the tuition fees for degree programs?" },
        { label: "Scholarships (Up to 100%)", prompt: "What scholarships can international students get?" },
        { label: "Language Cutoffs", prompt: "What are the language proficiency requirements?" },
        { label: "WhatsApp Admissions", prompt: "How do I contact admissions on WhatsApp?" }
      ]
    );
  }

  if (/scholarship|sat|sibling|assistantship|منح|منحة|تخفيض|خصم|burs/.test(query)) {
    if (lang === "ar") {
      return reply(
        "**المنح الدراسية المعتمدة في جامعة قبرص أيدن (CAU):**\n\n" +
          "• **منح التفوق الأكاديمي الدولية**: شرائح منح متدرجة (50%، 60%، 70%، 80%، 85%، 90%، 100%).\n" +
          "• **منحة اختبار SAT للمتفوقين**:\n" +
          "  - SAT **1200+** ➔ **منحة 85%** (تصبح الرسوم $1,500 + $600 = $2,100 دولار سنوياً)\n" +
          "  - SAT **1300+** ➔ **منحة 100%** (الرسوم الدراسية مجانية بالكامل، وتدفع فقط رسوم التسجيل والأنشطة والضريبة $600 دولار سنوياً)\n" +
          "• **منحة الطلاب المحولين (Transfer)**: **منحة 85%** للطلاب المحولين من جامعات معترف بها بمعدل تراكمي CGPA ≥ 2.0.\n" +
          "• **منحة الأخوة (Sibling)**: **70%** لجميع الأشقاء، وترتفع إلى **80%** إذا كان الأخ طالباً حالياً في الجامعة.\n" +
          "• **مساعد طالب (Student Assistantship)**: وظائف داخل الحرم الجامعي للطلاب الحاصلين على GPA > 3.0.\n\n" +
          "تواصل مع القبول الدولي: **admission@cau.edu.tr**.",
        ["scholarships"],
        [
          { label: "جدول الرسوم بالدولار ($)", prompt: "كم الرسوم الدراسية قبل وبعد المنحة بالدولار؟" },
          { label: "شروط منحة SAT", prompt: "كيف أقدم نتيجة اختبار SAT للحصول على المنحة؟" },
          { label: "منحة التحويل 85%", prompt: "ما هي شروط منحة التحويل من جامعة أخرى؟" },
          { label: "التقديم الإلكتروني", prompt: "كيف أقدم طلبي عبر الإنترنت؟" }
        ]
      );
    }
    return reply(
      "**CAU International Scholarships & Merit Awards:**\n\n" +
        "• **Standard & High Merit Scholarships**: Available across tiers: 50%, 60%, 70%, 80%, 85%, 90%, and 100%.\n" +
        "• **SAT Merit Scholarship**:\n" +
        "  - SAT **1200+** ➔ **85% Scholarship** (Tuition drops to $1,500 + $600 = $2,100 USD/year)\n" +
        "  - SAT **1300+** ➔ **100% Full Tuition Scholarship** ($0 tuition, only $600 annual registration/VAT/activity fee payable)\n" +
        "• **Transfer Student Scholarship**: **85% Scholarship** for eligible university transfers (CGPA ≥ 2.0, min 1 semester completed).\n" +
        "• **Sibling Scholarship**: **70%** for international siblings; increases to **80%** if sibling is a currently enrolled CAU student.\n" +
        "• **Student Assistantship**: On-campus employment positions for students maintaining a GPA > 3.0.\n\n" +
        "Confirm eligibility with **admission@cau.edu.tr**.",
      ["scholarships"],
      [
        { label: "Tuition Fee Schedule ($)", prompt: "What are the tuition fees before and after scholarship?" },
        { label: "SAT 1200+ / 1300+ Details", prompt: "How do I submit SAT scores for scholarship?" },
        { label: "Dentistry Dual Campus Fees", prompt: "What are the tuition fees for Faculty of Dentistry?" },
        { label: "Apply Online", prompt: "How do I apply for admission online?" }
      ]
    );
  }

  // Specific Programme & Major Inquiries (Computer Engineering, Software Engineering, Dentistry, Nursing, etc.)
  if (
    /computer engineering|yazılım|software engineering|dentistry|diş hekimliği|nursing|hemşirelik|architecture|mimarlık|interior architecture|iç mimarlık|law\b|international law|hukuk|tourism|turizm|gastronomy|gastronomi|mechatronics|mekatronik|electrical|elektrik|civil engineering|inşaat|business administration|işletme|psychology|psikoloji|هندسة حاسوب|هندسة برمجيات|طب اسنان|طب أسنان|تمريض|عمارة|حقوق|سياحة|إدارة اعمال|ادارة اعمال|علم نفس/.test(
      query
    )
  ) {
    if (/computer engineering|bilgisayar mühendisliği|هندسة حاسوب/.test(query)) {
      if (lang === "ar") {
        return reply(
          "**هندسة الحاسوب (B.Sc. Computer Engineering) — كلية الهندسة بجامعة قبرص أيدن (CAU) 💻**\n\n" +
            "• **مدة الدراسة**: 4 سنوات (8 فصول دراسية) | **لغة التدريس**: الإنجليزية بالكامل (100% English).\n" +
            "• **الكلية والاعتمادات**: كلية الهندسة (العميد: أ.د. حكمت ش. آيبار - Prof. Dr. Hikmet Ş. Aybar). معتمدة رسمياً من مجلس التعليم العالي التركي (YÖK) ومجلس التعليم العالي القبرصي (YÖDAK).\n" +
            "• **المختبرات والتدريب**: مختبرات حديثة في بنية الحاسوب، البرمجة، والذكاء الاصطناعي مع تدريب عملي ميداني.\n\n" +
            "**الرسوم الدراسية الرسمية والمنح (بالدولار الأمريكي USD $)**:\n" +
            "• **رسوم التسجيل والأنشطة السنوية الثابتة**: $600 دولار.\n" +
            "• **الرسوم القياسية السنوية**: $10,000 + $600 = **$10,600 دولار سنوياً**.\n" +
            "• **مع منحة القبول الدولي 50% المضمونة**: $5,000 + $600 = **$5,600 دولار سنوياً** (تسدد على قسطين فصليين بواقع $2,800 دولار لكل فصل).\n" +
            "• **منح التفوق ودرجات SAT**:\n" +
            "  - منحة 60%: $4,600 دولار سنوياً\n" +
            "  - منحة 70%: $3,600 دولار سنوياً\n" +
            "  - منحة 80%: $2,600 دولار سنوياً\n" +
            "  - منحة 85% (SAT 1200+ أو تحويل بمعدل ≥ 2.0): $2,100 دولار سنوياً\n" +
            "  - منحة 100% كاملة (SAT 1300+): $600 دولار فقط (رسوم التسجيل والأنشطة السنوية فقط).\n" +
            "• **دفعة تأكيد القبول المبدئية (Deposit)**: **$1,250 دولار** تخصم من الرسوم وتضمن إصدار القبول النهائي.\n\n" +
            "للتقديم المباشر: [apply.cau.edu.tr](https://apply.cau.edu.tr/) أو التواصل عبر **admission@cau.edu.tr** / واتساب: **+90 548 835 71 71**.",
          ["programmes", "faculties", "tuition"],
          [
            { label: "منحة 50% للطلاب الدوليين", prompt: "كيف أحصل على منحة 50% الدولية؟" },
            { label: "الأوراق المطلوبة للتقديم", prompt: "ما هي الأوراق المطلوبة للتقديم على هندسة الحاسوب؟" },
            { label: "السكن الطلابي في كيرينيا", prompt: "ما هي خيارات السكن الطلابي المتاحة؟" },
            { label: "تواصل مع القبول عبر واتساب", prompt: "كيف أتواصل مع مكتب القبول عبر واتساب؟" }
          ]
        );
      }
      return reply(
        "**Computer Engineering (B.Sc., English) — Faculty of Engineering at CAU 💻**\n\n" +
          "• **Degree Level & Duration**: Bachelor of Science (B.Sc.) | 4 Years (8 Semesters)\n" +
          "• **Language of Instruction**: 100% English\n" +
          "• **Faculty**: Faculty of Engineering (Dean: Prof. Dr. Hikmet Ş. Aybar | Programme Lecturer: Dr. Öğr. Üyesi Ruhsan Önder)\n" +
          "• **Accreditation**: Fully accredited by YÖK (Council of Higher Education, Türkiye) and YÖDAK (TRNC), recognized globally via UK ENIC & WHED.\n" +
          "• **Facilities**: Advanced microprocessor, robotics, AI, networking, and software engineering laboratories.\n\n" +
          "**Official Tuition & Scholarship Schedule (USD $)**:\n" +
          "• **Standard Annual Tuition**: $10,000 + $600 flat registration/activity fee = **$10,600 USD / year**\n" +
          "• **Guaranteed 50% International Scholarship**: $5,000 + $600 = **$5,600 USD / year** (payable in two semester installments of $2,800 USD)\n" +
          "• **Merit / SAT Scholarships**:\n" +
          "  - 60% Scholarship: **$4,600 USD / year**\n" +
          "  - 70% Scholarship: **$3,600 USD / year**\n" +
          "  - 80% Scholarship: **$2,600 USD / year**\n" +
          "  - 85% Scholarship (SAT 1200+ or Transfer GPA ≥ 2.0): **$2,100 USD / year**\n" +
          "  - 100% Full Tuition Scholarship (SAT 1300+): **$600 USD / year** (flat registration/activity fee only)\n" +
          "• **Required Confirmation Deposit**: **$1,250 USD** (credited towards your 1st semester tuition; required to issue your Official Acceptance Letter for visa transit).\n\n" +
          "Apply online at **https://apply.cau.edu.tr/** or contact International Admissions: **admission@cau.edu.tr** / WhatsApp: **+90 548 835 71 71**.",
        ["programmes", "faculties", "tuition"],
        [
          { label: "50% Scholarship Details", prompt: "How do I get the 50% international scholarship?" },
          { label: "Software Engineering", prompt: "Tell me about the Software Engineering degree." },
          { label: "How to Apply", prompt: "How do I apply for international admission?" },
          { label: "Student Dormitories", prompt: "What dormitories are available for students in Kyrenia?" }
        ]
      );
    }
    if (/software engineering|yazılım mühendisliği|هندسة برمجيات/.test(query)) {
      return reply(
        "**Software Engineering (B.Sc., English) — Faculty of Engineering at CAU 💻🚀**\n\n" +
          "• **Degree Level & Duration**: Bachelor of Science (B.Sc.) | 4 Years (8 Semesters)\n" +
          "• **Language of Instruction**: 100% English\n" +
          "• **Faculty**: Faculty of Engineering (Dean: Prof. Dr. Hikmet Ş. Aybar | Programme Lecturer: Dr. Öğr. Üyesi Everistus Zeluwa Orji)\n" +
          "• **Key Focus**: Full-stack application engineering, modern cloud platforms, cybersecurity architectures, database management, and mobile computing.\n\n" +
          "**Official Tuition & Scholarship Schedule (USD $)**:\n" +
          "• **Standard Annual Tuition**: $10,000 + $600 registration/activity fee = **$10,600 USD / year**\n" +
          "• **Guaranteed 50% International Scholarship**: $5,000 + $600 = **$5,600 USD / year** (payable in two semester installments of $2,800 USD)\n" +
          "• **Merit / SAT Scholarships**:\n" +
          "  - 60% Scholarship: **$4,600 USD / year**\n" +
          "  - 70% Scholarship: **$3,600 USD / year**\n" +
          "  - 80% Scholarship: **$2,600 USD / year**\n" +
          "  - 85% Scholarship (SAT 1200+ or Transfer GPA ≥ 2.0): **$2,100 USD / year**\n" +
          "  - 100% Full Tuition Scholarship (SAT 1300+): **$600 USD / year**\n" +
          "• **Confirmation Deposit**: **$1,250 USD** (deducted from semester tuition).\n\n" +
          "Apply online at **https://apply.cau.edu.tr/** | Admissions: **admission@cau.edu.tr** | WhatsApp: **+90 548 835 71 71**.",
        ["programmes", "faculties", "tuition"],
        [
          { label: "Computer Engineering", prompt: "What is the tuition fee for computer engineering?" },
          { label: "50% Scholarship", prompt: "What scholarships are available for international students?" },
          { label: "Admission Documents", prompt: "What documents are required for application?" },
          { label: "Campus Housing", prompt: "What dormitories are available for students in Kyrenia?" }
        ]
      );
    }
    if (/dentistry|diş hekimliği|طب اسنان|طب أسنان/.test(query)) {
      return reply(
        "**Faculty of Dentistry (5-Year Dual-Campus Program with Istanbul Aydın University) 🦷**\n\n" +
          "• **Program Structure**: 5-Year Undergraduate Dental Surgery Degree (English).\n" +
          "  - **Years 1–3**: Pre-clinical medical and dental simulation phantom head laboratories at **Cyprus Aydın University (CAU, Kyrenia)**.\n" +
          "  - **Years 4–5**: Advanced clinical patient training and hospital rotations at **Istanbul Aydın University (IAU, Istanbul European side)**.\n" +
          "• **Dean**: Prof. Dr. Cem Kurtoğlu\n\n" +
          "**Official Tuition Schedule (USD $)**:\n" +
          "• **Years 1–3 at CAU (Cyprus)**:\n" +
          "  - Standard Annual Fee: **$22,600 USD / year**\n" +
          "  - **With 50% International Scholarship**: **$11,600 USD / year**\n" +
          "  - 60% Scholarship: **$9,400 USD / year** | 70%: **$7,200 USD** | 80%: **$5,000 USD**\n" +
          "• **Years 4–5 at IAU (Istanbul)**:\n" +
          "  - Standard Annual Fee: **$37,100 USD / year**\n" +
          "  - **With 50% Scholarship**: **$17,850 USD / year**\n" +
          "  - 60%: **$14,400 USD** | 70%: **$10,950 USD** | 80%: **$7,500 USD**\n" +
          "• **Mandatory Confirmation Deposit**: **$2,500 USD** (to secure Acceptance Letter).\n\n" +
          "Contact International Admissions: **admission@cau.edu.tr** | WhatsApp: **+90 548 835 71 71** | Portal: [apply.cau.edu.tr](https://apply.cau.edu.tr/).",
        ["faculties", "programmes", "tuition"],
        [
          { label: "50% Scholarship Eligibility", prompt: "How do I qualify for the Dentistry scholarship?" },
          { label: "Dentistry Clinical Labs", prompt: "Tell me about the phantom head labs and campus facilities." },
          { label: "Apply Online", prompt: "How do I apply for Faculty of Dentistry?" },
          { label: "Contact Admissions", prompt: "How do I contact admissions on WhatsApp?" }
        ]
      );
    }
    if (/nursing|hemşirelik|تمريض/.test(query)) {
      return reply(
        "**Nursing Programmes — Faculty of Health Sciences at CAU 🩺**\n\n" +
          "• **Available Tracks**:\n" +
          "  - Nursing (Bachelor's, **English**, YÖDAK accredited)\n" +
          "  - Nursing (Bachelor's, **Turkish**, YÖK & YÖDAK accredited)\n" +
          "• **Duration**: 4 Years (8 Semesters) with hospital clinical rotations in Kyrenia and Nicosia.\n" +
          "• **Dean**: Prof. Dr. Mehmet Zeki Avcı\n\n" +
          "**Official Annual Tuition Fees (USD $)**:\n" +
          "• Standard Annual Fee: $10,000 + $600 = **$10,600 USD / year**\n" +
          "• **With 50% Guaranteed International Scholarship**: $5,000 + $600 = **$5,600 USD / year**\n" +
          "• High Merit / SAT tiers: 60% ($4,600), 70% ($3,600), 80% ($2,600), 85% ($2,100), 100% ($600 flat fee only).\n" +
          "• **Confirmation Deposit**: **$1,250 USD**.\n\n" +
          "Apply online at [apply.cau.edu.tr](https://apply.cau.edu.tr/) | Contact: **admission@cau.edu.tr**.",
        ["faculties", "programmes", "tuition"],
        [
          { label: "50% Scholarship", prompt: "What scholarships are available for international students?" },
          { label: "Health Sciences Dean", prompt: "Who is the Dean of Health Sciences?" },
          { label: "How to Apply", prompt: "How do I apply for international admission?" },
          { label: "Student Dormitories", prompt: "What dormitories are available for students in Kyrenia?" }
        ]
      );
    }
    if (/architecture|mimarlık|interior architecture|iç mimarlık|عمارة/.test(query)) {
      return reply(
        "**Faculty of Fine Arts and Design — Architecture & Interior Architecture 🏛️**\n\n" +
          "• **Available Degrees**:\n" +
          "  - Architecture (Bachelor’s, **English**, YÖK/YÖDAK accredited)\n" +
          "  - Interior Architecture and Environmental Design (Bachelor’s, **Turkish**, YÖK/YÖDAK accredited)\n" +
          "• **Duration**: 4 Years (8 Semesters) in design studios with CAD/3D modeling labs.\n\n" +
          "**Official Annual Tuition Fees (USD $)**:\n" +
          "• Standard Annual Fee: $10,000 + $600 = **$10,600 USD / year**\n" +
          "• **With 50% Guaranteed International Scholarship**: $5,000 + $600 = **$5,600 USD / year**\n" +
          "• Merit / SAT tiers: 60% ($4,600), 70% ($3,600), 80% ($2,600), 85% ($2,100), 100% ($600 flat fee only).\n" +
          "• **Deposit**: **$1,250 USD** | Apply at **apply.cau.edu.tr**.",
        ["faculties", "programmes", "tuition"],
        [
          { label: "50% Scholarship", prompt: "How do I get the 50% international scholarship?" },
          { label: "Application Portal", prompt: "How do I apply for Architecture?" }
        ]
      );
    }
    if (/law\b|international law|hukuk|حقوق/.test(query)) {
      return reply(
        "**Faculty of Law — Law & International Law Programmes ⚖️**\n\n" +
          "• **Available Degrees**:\n" +
          "  - International Law (Bachelor’s, **English**, YÖDAK accredited)\n" +
          "  - Law (Bachelor’s, **Turkish**, YÖK & YÖDAK accredited)\n" +
          "• **Dean**: Prof. Dr. Z. Gönül Balkır\n" +
          "• **Duration**: 4 Years (8 Semesters)\n\n" +
          "**Official Annual Tuition Fees (USD $)**:\n" +
          "• Standard Annual Fee: $10,000 + $600 = **$10,600 USD / year**\n" +
          "• **With 50% International Scholarship**: $5,000 + $600 = **$5,600 USD / year**\n" +
          "• Deposit: **$1,250 USD** | Apply: **apply.cau.edu.tr**.",
        ["faculties", "programmes", "tuition"],
        [
          { label: "50% Scholarship", prompt: "What scholarships are available for international students?" },
          { label: "Apply Online", prompt: "How do I apply for International Law?" }
        ]
      );
    }
    if (/tourism|turizm|gastronomy|gastronomi|سياحة/.test(query)) {
      return reply(
        "**Faculty of Tourism — Tourism, Hospitality & Gastronomy 🍽️🏨**\n\n" +
          "• **Available Degrees**:\n" +
          "  - Tourism and Hotel Management (Bachelor’s, **English**, YÖDAK accredited)\n" +
          "  - Gastronomy and Culinary Arts (Bachelor’s, **Turkish**, YÖK & YÖDAK accredited)\n" +
          "• **Dean**: Prof. Dr. Hasan Tunç\n" +
          "• **Duration**: 4 Years (8 Semesters) with industrial luxury hotel internships in Kyrenia and culinary kitchens.\n\n" +
          "**Official Annual Tuition Fees (USD $)**:\n" +
          "• Standard Annual Fee: $10,000 + $600 = **$10,600 USD / year**\n" +
          "• **With 50% International Scholarship**: $5,000 + $600 = **$5,600 USD / year**\n" +
          "• Deposit: **$1,250 USD** | Apply: **apply.cau.edu.tr**.",
        ["faculties", "programmes", "tuition", "tourism"],
        [
          { label: "50% Scholarship", prompt: "How do I get the 50% international scholarship?" },
          { label: "Apply Online", prompt: "How do I apply for Tourism & Hotel Management?" }
        ]
      );
    }
  }

  if (/tuition|fee|payment|iban|bank|installment|cost|price|usd|dollar|كم الرسوم|الرسوم|رسوم|اسعار|أسعار|تكلفة|تكاليف|مصاريف|سعر|ücret|harç|fiyat/.test(query)) {
    if (lang === "ar") {
      return reply(
        "**الرسوم الدراسية الرسمية المعتمدة لجامعة قبرص أيدن (بالدولار الأمريكي USD $):**\n\n" +
          "• **رسوم التسجيل والأنشطة والضريبة السنوية**: $600 دولار أمريكي ثابتة لجميع البرامج.\n\n" +
          "• **برامج البكالوريوس والدبلوم (سنوياً)**:\n" +
          "  - الرسوم القياسية: $10,000 + $600 = **$10,600 دولار**\n" +
          "  - منحة 50%: $5,000 + $600 = **$5,600 دولار**\n" +
          "  - منحة 60%: $4,000 + $600 = **$4,600 دولار**\n" +
          "  - منحة 70%: $3,000 + $600 = **$3,600 دولار**\n" +
          "  - منحة 80%: $2,000 + $600 = **$2,600 دولار**\n" +
          "  - منحة 85% (SAT/تحويل): $1,500 + $600 = **$2,100 دولار**\n" +
          "  - منحة 90%: $1,000 + $600 = **$1,600 دولار**\n" +
          "  - منحة 100%: $0 + $600 = **$600 دولار فقط**\n\n" +
          "• **برنامج طب الأسنان المشترك (5 سنوات dual-campus)**:\n" +
          "  - السنوات 1–3 (في قبرص CAU): قياسي $22,600 | منحة 50% $11,600 | 60% $9,400 | 70% $7,200 | 80% $5,000 سنوياً.\n" +
          "  - السنوات 4–5 (في إسطنبول IAU): قياسي $37,100 | منحة 50% $17,850 | 60% $14,400 | 70% $10,950 | 80% $7,500 سنوياً.\n\n" +
          "• **برامج الماجستير (لكامل البرنامج)**: قياسي $7,600 | منحة 50% $4,100 | 60% $3,400 | 70% $2,700 | 80% $2,000 دولار.\n" +
          "• **برامج الدكتوراه (لكامل البرنامج)**: قياسي $12,600 | منحة 25% $9,600 | 40% $7,800 | 50% $6,600 دولار.\n\n" +
          "• **دفعات تأكيد القبول الإلزامية (Deposits)**:\n" +
          "  - البكالوريوس والماجستير: **$1,250 دولار**\n" +
          "  - الدكتوراه: **$1,500 دولار**\n" +
          "  - طب الأسنان: **$2,500 دولار**\n\n" +
          "بنك Garanti Bankası | حساب KIBRIS İLİM ÜNİVERSİTESİ LTD. السداد فصلي.",
        ["tuition", "tuition-tr"],
        [
          { label: "منح البكالوريوس (50%-100%)", prompt: "ما هي المنح المتاحة للطلاب الدوليين؟" },
          { label: "طب الأسنان المشترك (3+2)", prompt: "كم رسوم كلية طب الأسنان في قبرص وإسطنبول؟" },
          { label: "السكن الطلابي باليورو (€)", prompt: "ما هي أسعار وتفاصيل السكن الطلابي؟" },
          { label: "التقديم الإلكتروني", prompt: "كيف أقدم طلبي أونلاين؟" }
        ]
      );
    }
    return reply(
      "**Official CAU Tuition & Fees Schedule (Denominated in USD $):**\n\n" +
        "• **Annual Registration + VAT + Activity Fee**: Flat **$600 USD** across all programs.\n\n" +
        "• **Bachelor and Associate Degrees (Annual Total)**:\n" +
        "  - Standard Fee: $10,000 + $600 = **$10,600 USD**\n" +
        "  - 50% Scholarship: $5,000 + $600 = **$5,600 USD**\n" +
        "  - 60% Scholarship: $4,000 + $600 = **$4,600 USD**\n" +
        "  - 70% Scholarship: $3,000 + $600 = **$3,600 USD**\n" +
        "  - 80% Scholarship: $2,000 + $600 = **$2,600 USD**\n" +
        "  - 85% Scholarship (SAT/Transfer): $1,500 + $600 = **$2,100 USD**\n" +
        "  - 90% Scholarship: $1,000 + $600 = **$1,600 USD**\n" +
        "  - 100% Scholarship: $0 + $600 = **$600 USD Total**\n\n" +
        "• **Faculty of Dentistry Dual-Campus (5-Year Program)**:\n" +
        "  - **Years 1–3 at CAU (Cyprus)**: Standard $22,600 | 50%: $11,600 | 60%: $9,400 | 70%: $7,200 | 80%: $5,000 USD/year\n" +
        "  - **Years 4–5 at IAU (Istanbul)**: Standard $37,100 | 50%: $17,850 | 60%: $14,400 | 70%: $10,950 | 80%: $7,500 USD/year\n\n" +
        "• **Master's Degree Programs (Total Program)**: Standard $7,600 | 50%: $4,100 | 60%: $3,400 | 70%: $2,700 | 80%: $2,000 USD\n" +
        "• **Doctorate Programs (Ph.D.) (Total Program)**: Standard $12,600 | 25%: $9,600 | 40%: $7,800 | 50%: $6,600 USD\n\n" +
        "• **Required Payment Deposits** (To secure Acceptance Letter):\n" +
        "  - Associate & Bachelor Programs: **$1,250 USD**\n" +
        "  - Master's Programs: **$1,250 USD**\n" +
        "  - Ph.D. Programs: **$1,500 USD**\n" +
        "  - Faculty of Dentistry: **$2,500 USD**\n\n" +
        "Payment via bank transfer to Garanti Bankası or virtual POS credit card link before semester registration.",
      ["tuition", "tuition-tr"],
      [
        { label: "Dentistry Dual Campus Fees", prompt: "Tell me more about the 5-year Dentistry program and fees." },
        { label: "Scholarships (Up to 100%)", prompt: "What scholarships are available for international students?" },
        { label: "Dormitory Rates (€)", prompt: "What are the student dormitory fees in Kyrenia?" },
        { label: "Apply Online", prompt: "How do I apply for international admission?" }
      ]
    );
  }

  if (/accommodation|dorm|housing|dormitory|سكن|سكنات|غرف|ايجار|إيجار|yurt/.test(query)) {
    if (lang === "ar") {
      return reply(
        "**السكن الطلابي المعتمد في مدينة كيرينيا — سكن أيدن الدولي (International Aydın Dormitory):**\n\n" +
          "سكن حديث وآمن ومريح للطلاب يقع في كيرينيا بسعة **142 سريراً** مع إطلالة بحرية ساحرة:\n\n" +
          "• **الأسعار الرسمية لعام دراسي كامل (9 أشهر إجمالي باليورو €)**:\n" +
          "  - **غرفة فردية (Single Room)**: **€5,500 يورو** (لـ 9 أشهر)\n" +
          "  - **غرفة مزدوجة (Double Room)**: **€3,200 يورو** للشخص (لـ 9 أشهر)\n" +
          "  - **غرفة ثلاثية (Triple Room)**: **€2,800 يورو** للشخص (لـ 9 أشهر)\n\n" +
          "• **المرافق والخدمات المشمولة**:\n" +
          "  - صالة لياقة بدنية وجيم مجهز بالكامل (Gym)\n" +
          "  - مطابخ عصرية مشتركة مجهزة\n" +
          "  - قاعات دراسة ومكتبة وغرفة تلفزيون واستراحة\n" +
          "  - حدائق منسقة وإطلالات على البحر المتوسط\n" +
          "  - **حافلة نقل مجانية منتظمة (Free Shuttle)** بين السكن وحرم جامعة قبرص أيدن\n" +
          "  - إنترنت عالي السرعة وأمن وحراسة 24/7\n\n" +
          "للحجز والاستفسار: **+90 548 899 0484** | موقع السكن: aydindorm.com.",
        ["accommodation"],
        [
          { label: "🚌 باص النقل المجاني", prompt: "هل تتوفر حافلات نقل مجانية للحرم الجامعي؟" },
          { label: "🌴 تكاليف المعيشة في كيرينيا", prompt: "كم تكلفة المعيشة الشهرية للطالب في كيرينيا؟" },
          { label: "💰 الرسوم الدراسية بالدولار ($)", prompt: "ما هي الرسوم الدراسية بالدولار؟" },
          { label: "📝 التقديم للجامعة", prompt: "كيف أقدم طلبي للحصول على قبول؟" }
        ]
      );
    }
    return reply(
      "**Student Accommodation — International Aydın Student Dormitory (Kyrenia):**\n\n" +
        "A secure, modern, and social residence with a **142-bed capacity** located in Kyrenia:\n\n" +
        "• **Official Pricing for Full 9-Month Academic Year (in Euros €)**:\n" +
        "  - **Single Room**: **€5,500 EUR** (9 months total)\n" +
        "  - **Double Room (Per Person)**: **€3,200 EUR** (9 months total)\n" +
        "  - **Triple Room (Per Person)**: **€2,800 EUR** (9 months total)\n\n" +
        "• **Included Amenities**:\n" +
        "  - Fully equipped on-site gym & fitness center\n" +
        "  - Modern shared kitchen facilities\n" +
        "  - Quiet study & meeting rooms and library\n" +
        "  - TV lounge for socializing and relaxation\n" +
        "  - Landscaped gardens and panoramic Mediterranean sea views\n" +
        "  - **Regular complimentary shuttle bus service** between the dormitory and CAU campus\n" +
        "  - High-speed Wi-Fi and 24/7 round-the-clock security\n\n" +
        "Booking contact: **+90 548 899 0484** | https://aydindorm.com/.",
      ["accommodation"],
      [
        { label: "Dormitory Bus Shuttle", prompt: "Is there a free bus shuttle to campus?" },
        { label: "Living Costs in Kyrenia", prompt: "What is the cost of living in Kyrenia for students?" },
        { label: "Tuition Fees ($)", prompt: "What are the tuition fees for degree programs?" },
        { label: "How to Apply", prompt: "How do I apply for admission?" }
      ]
    );
  }

  // Official Institutional Numbers & Statistics from Handbook
  if (
    /how many students|how many alumni|how many faculties|how many partner|how many international|how many countries|how many clubs|numbers that matter|institutional metrics|statistics|numbers\b|figures\b|sayılar|rakamlar|kaç öğrenci|kaç mezun|kaç fakülte|كم عدد الطلاب|كم عدد الخريجين|كم عدد الكليات|إحصائيات/.test(
      query
    )
  ) {
    if (lang === "ar") {
      return reply(
        "**أبرز الأرقام والإحصائيات الرسمية لجامعة قبرص أيدن (CAU):**\n\n" +
          "• **1,200+** خريج متميز حول العالم\n" +
          "• **3,000+** طالب وطالبة مسجلين\n" +
          "• **1,000+** طالب دولي من أكثر من **60+** دولة\n" +
          "• **8 كليات أكاديمية معتمدة**:\n" +
          "  1. كلية طب الأسنان (برنامج مشترك 3+2 مع جامعة إسطنبول أيدن)\n" +
          "  2. كلية الهندسة\n" +
          "  3. كلية العلوم الصحية\n" +
          "  4. كلية الاقتصاد والعلوم الإدارية والاجتماعية\n" +
          "  5. كلية الفنون الجميلة والتصميم\n" +
          "  6. كلية الحقوق\n" +
          "  7. كلية التربية\n" +
          "  8. كلية السياحة (إدارة السياحة وفنون الطهي)\n" +
          "• **11** مركزاً للتطبيق والبحوث العلمية\n" +
          "• **50+** مؤسسة شريكة دولياً و **3** برامج درجات مزدوجة\n" +
          "• **5+** برامج تبادل لأعضاء هيئة التدريس\n" +
          "• **15** نادياً طلابياً نشطاً\n" +
          "• **الشراكة مع جامعة إسطنبول أيدن (IAU)**: تأسست 2003، تضم 50,000+ طالب، 8,500+ طالب دولي من 124 دولة، ونسبة توظيف 83.6%\n" +
          "• **السكن الطلابي المعتمد (International Aydın Dormitory)**: سعة 142 سريراً وأسعار تبدأ من €2,800 يورو لـ 9 أشهر.",
        ["about-cau", "home", "cau-main"],
        [
          { label: "💰 الرسوم والمنح ($)", prompt: "كم رسوم الدراسة والمنح المتاحة في جامعة قبرص أيدن بالدولار؟" },
          { label: "🎓 الكليات والبرامج", prompt: "ما هي الكليات والبرامج المتاحة في جامعة قبرص أيدن؟" },
          { label: "🤝 الشراكة مع IAU", prompt: "ما هي تفاصيل الشراكة الاستراتيجية مع جامعة إسطنبول أيدن؟" },
          { label: "📝 التقديم الإلكتروني", prompt: "كيف أقدم طلبي للحصول على قبول؟" }
        ]
      );
    }
    return reply(
      "**Official Cyprus Aydın University Key Numbers & Statistics:**\n\n" +
        "• **1,200+** Alumni worldwide\n" +
        "• **3,000+** Enrolled Students\n" +
        "• **1,000+** International Students\n" +
        "• **60+** Countries our students come from\n" +
        "• **8 Academic Faculties**:\n" +
        "  1. Faculty of Dentistry (5-Year Dual-Campus 3+2 with IAU)\n" +
        "  2. Faculty of Engineering\n" +
        "  3. Faculty of Health Sciences\n" +
        "  4. Faculty of Economics, Administrative and Social Sciences\n" +
        "  5. Faculty of Fine Arts and Design\n" +
        "  6. Faculty of Law\n" +
        "  7. Faculty of Education\n" +
        "  8. Faculty of Tourism (Tourism & Hotel Management, Gastronomy & Culinary Arts)\n" +
        "• **11** Application and Research Centers\n" +
        "• **50+** International Partner Institutions\n" +
        "• **3** Dual Degree Programs\n" +
        "• **5+** Faculty Exchanges\n" +
        "• **15** Active Student Clubs\n" +
        "• **Strategic Partner IAU**: Founded 2003, Istanbul European side, 50,000+ students, 8,500+ international students from 124 countries, 17 faculties, 83.6% graduate job placement rate\n" +
        "• **Accommodation**: International Aydın Student Dormitory with 142 beds capacity, 9-month EUR rates (€5,500 / €3,200 / €2,800).",
      ["about-cau", "home", "cau-main"],
      [
        { label: "Tuition Fees ($)", prompt: "What are the tuition fees and scholarships in USD?" },
        { label: "Explore 8 Faculties", prompt: "What are the 8 faculties at CAU?" },
        { label: "IAU Strategic Partnership", prompt: "Tell me about the partnership with Istanbul Aydin University." },
        { label: "Apply Online", prompt: "How do I apply for international admission?" }
      ]
    );
  }

  // Assoc. Prof. Dr. Tuğrul Günay — Director of the International Office
  if (/tuğrul|tugrul|gunay|günay|international office director|director of.*international office/.test(query)) {
    return reply(
      "**Assoc. Prof. Dr. Tuğrul Günay — Director of the International Office (IAU & CAU) 🌐**\n\n" +
        "Assoc. Prof. Dr. Tuğrul Günay leads international partnerships, global student mobility, and cross-border academic initiatives for Cyprus Aydın University and Istanbul Aydın University.\n\n" +
        "Official Statement from CAU Handbook (Page 11):\n" +
        "*\"Internationalization is more than mobility — it’s about building bridges of knowledge, culture, and shared purpose. At Cyprus Aydin University, I am committed to fostering global partnerships and empowering students to thrive in a truly interconnected world.\"*\n\n" +
        "Dr. Günay oversees 50+ international partner institutions, dual-degree pathways, and foreign student admissions across the globe.\n\n" +
        "Contact the International Office: **admission@cau.edu.tr** | WhatsApp: **+90 548 835 71 71**.",
      ["about-cau", "international-home", "cau-main"],
      [
        { label: "IAU Partnership", prompt: "Tell me about the partnership between CAU and IAU." },
        { label: "Dentistry 3+2 Dual Campus", prompt: "Tell me about the Dentistry 3+2 dual campus program." },
        { label: "Apply for Admission", prompt: "How do I apply for admission?" },
        { label: "WhatsApp Admissions", prompt: "How do I contact admissions on WhatsApp?" }
      ]
    );
  }

  // Leadership, Board of Trustees & Administration
  if (/fatma nur|mütevelli|board of trustees|burcu tunay|secretary general|genel sekreter|aytul|aytül|rectorate|rector/.test(query)) {
    return reply(
      "**Cyprus Aydın University Governance & Key Administrative Leadership:**\n\n" +
        "• **Board of Trustees Chairwoman (Mütevelli Heyeti Başkanı)**: Fatma Nur AYDIN\n" +
        "• **Secretary General (Genel Sekreter)**: Burcu TUNAY (Acting Head of Student Affairs, burcutunay@cau.edu.tr; extension 6020)\n" +
        "• **Director of Personnel Department**: Aytül DENLİ (ik@cau.edu.tr; extension 6056)\n" +
        "• **Director of the International Office**: Assoc. Prof. Dr. Tuğrul Günay (tugrulgunay@cau.edu.tr)\n" +
        "• **Faculty Deans**:\n" +
        "  - Faculty of Dentistry: Prof. Dr. Cem Kurtoğlu\n" +
        "  - Faculty of Engineering: Prof. Dr. Hikmet Ş. Aybar\n" +
        "  - Faculty of Health Sciences: Prof. Dr. Mehmet Zeki Avcı\n" +
        "  - Faculty of Economics, Administrative & Social Sciences: Prof. Dr. Arzu Alvan Bozdereli\n" +
        "  - Faculty of Law: Prof. Dr. Z. Gönül Balkır\n" +
        "  - Faculty of Tourism: Prof. Dr. Hasan Tunç\n\n" +
        "For general university administration and student affairs, contact **bilgi@cau.edu.tr** (+90 392 650 00 00).",
      ["about-cau", "student-affairs", "personnel"],
      [
        { label: "Faculty Deans", prompt: "Who are the deans of faculties at CAU?" },
        { label: "Contact Student Affairs", prompt: "What are the contact details for Student Affairs?" },
        { label: "International Office", prompt: "Who is the Director of the International Office?" },
        { label: "Personnel Department", prompt: "How do I reach the Personnel Department?" }
      ]
    );
  }

  if (/faculty|faculties|school|institute|vocational|graduate|foreign language|preparatory|كليات|كلية|fakülte/.test(query)) {
    return reply(
      "**CAU Academic Structure (8 Faculties, Vocational Schools & Graduate Institute):**\n\n" +
        "1. **Faculty of Dentistry**: 5-Year Dual-Campus Program with Istanbul Aydın University (IAU)\n" +
        "2. **Faculty of Law**: Law (Turkish), International Law (English)\n" +
        "3. **Faculty of Education**: Guidance & Psychological Counseling, Turkish Language Teaching, English Language Teaching\n" +
        "4. **Faculty of Economics, Administrative and Social Sciences**: Business Administration, International Relations, Psychology, Banking & Finance, Civil Aviation Management\n" +
        "5. **Faculty of Fine Arts and Design**: Architecture (English), Interior Architecture & Environmental Design (Turkish)\n" +
        "6. **Faculty of Engineering**: Electrical & Electronics, Mechatronics, Computer, Software, Information Security, Civil Engineering\n" +
        "7. **Faculty of Health Sciences**: Nursing (English & Turkish), Physiotherapy and Rehabilitation\n" +
        "8. **Faculty of Tourism**: Tourism and Hotel Management (English), Gastronomy and Culinary Arts (Turkish)\n" +
        "• **Vocational Schools**: 5 Associate Degree programs (Tourist Guidance, Physiotherapy, Civil Aviation Cabin Services, First & Emergency Aid, Opticianry — all YÖK accredited)\n" +
        "• **Institute of Graduate Education and Research**: 14 Master's & 6 Ph.D. programs\n" +
        "• **School of Foreign Languages**: English Preparatory School (1 year)",
      ["faculties", "programmes", "cau-main"],
      [
        { label: "Dentistry Dual Campus", prompt: "Tell me about Faculty of Dentistry dual-campus program." },
        { label: "Software Engineering", prompt: "Tell me about Software Engineering degree." },
        { label: "Tuition Fees ($)", prompt: "What are the tuition fees for faculties?" },
        { label: "Apply Online", prompt: "How do I apply for admission?" }
      ]
    );
  }

  if (/partner|partnership|iau|istanbul aydin|istanbul aydın/.test(query)) {
    return reply(
      "**Strategic Partnership: Cyprus Aydın University & Istanbul Aydın University (IAU) 🤝**\n\n" +
        "Cyprus Aydın University (CAU) maintains a strategic academic partnership with **Istanbul Aydın University (IAU)**:\n\n" +
        "• **About IAU**: Founded in 2003 on Istanbul’s European side, IAU is one of Türkiye’s leading institutions with **50,000+ active students** (including **8,500+ international students** from 124 countries), 17 faculties, and an impressive **83.6% graduate job placement rate**.\n" +
        "• **Dual-Degree & Mobility**: Students benefit from joint research, faculty exchanges, and dual-campus programs—such as the **5-Year Dentistry Degree** where students study their first 3 years at CAU in Cyprus and their final 2 clinical years at IAU in Istanbul.\n" +
        "• **Leadership**: Assoc. Prof. Dr. Tuğrul Günay serves as Director of the International Office across IAU and CAU:\n" +
        "  *\"Internationalization is more than mobility — it’s about building bridges of knowledge, culture, and shared purpose. At Cyprus Aydin University, I am committed to fostering global partnerships and empowering students to thrive in a truly interconnected world.\"*",
      ["about-cau", "cau-main"],
      [
        { label: "Dentistry Dual Campus (3+2)", prompt: "Tell me about the Dentistry 3+2 dual campus program." },
        { label: "Explore 8 Faculties", prompt: "What are the 8 faculties at CAU?" },
        { label: "Tuition Fees ($)", prompt: "What are the tuition fees for degree programs?" },
        { label: "Apply Online", prompt: "How do I apply for international admission?" }
      ]
    );
  }

  if (/testimonial|testimonials|student story|stories|yasir|jamal|romeo|koyue|omar abo|jmei|setia|santoso|قصص الطلاب|تجارب الطلاب/.test(query)) {
    return reply(
      "**Authentic Student Stories & Testimonials from CAU (Official Handbook):**\n\n" +
        "• **Yasir Jamal (Pakistan) – Tourism Management (MS)**:\n" +
        "  *\"Tourism isn’t just about places; it’s about connections, cultures, and unforgettable experiences. At Cyprus Aydın University, I’ve discovered that every journey starts with curiosity and ends with growth. The professors are inspiring and encourage us to think globally. Whether you’re guiding travelers, shaping hospitality, or focusing on sustainable tourism, CAU offers a world of opportunities to learn and make a difference.\"*\n\n" +
        "• **Romeo Lele Koyue (Cameroon) – Ph.D. in Business Administration**:\n" +
        "  *\"At Cyprus Aydin University, the Music and Art Club is more than a space for creativity — it's where we discover, grow, and inspire. Every melody and masterpiece is a step toward becoming who we’re truly meant to be: bold, creative, and unforgettable. Just like in my Ph.D. journey in Business Administration, it's about leaving a legacy. Whether through research or rhythm, we build something future students will carry forward.\"*\n\n" +
        "• **Omar Abo Jmei (Palestine) – Department of Electrical and Electronic Engineering**:\n" +
        "  *\"Driven by purpose and passion, my journey in Electrical and Electronic Engineering at Cyprus Aydın University is more than a degree—it’s a mission to innovate, solve real-world problems, and build a smarter, sustainable future. Every circuit I design and challenge I face brings me closer to making a meaningful impact. As a student from Palestine, I carry the hopes of my community, believing that through technology and education, we can brighten even the darkest corners. Cyprus Aydın University has given me the tools, environment, and inspiration to dream bigger and achieve more.\"*\n\n" +
        "• **Setia Amantha Laura Santoso (Indonesia) – Business Administration (English)**:\n" +
        "  *“CAU is so much fun! I’ve made amazing friends from all around the world. The teachers are supportive and make learning enjoyable, and there’s even a school bus service that makes getting around easy. What makes CAU special is its diverse and welcoming environment, where every day brings new opportunities to learn, connect, and grow.”*",
      ["about-cau", "home", "cau-main"],
      [
        { label: "Explore Programmes", prompt: "What programmes are available at CAU?" },
        { label: "Tuition & Scholarships", prompt: "What are the tuition fees and scholarships?" },
        { label: "Campus Life & Clubs", prompt: "What student clubs and activities exist at CAU?" },
        { label: "How to Apply", prompt: "How do I apply for admission?" }
      ]
    );
  }

  if (/club|clubs|activities|society|societies|kulüp|kulüpler|انشطة|أنشطة|نوادي|نادي/.test(query)) {
    return reply(
      "**Active Student Clubs at Cyprus Aydın University (15+ Clubs):**\n\n" +
        "CAU offers vibrant student life with 15+ student-led cultural, social, and academic clubs:\n" +
        "• Public Health Club\n" +
        "• Physiotherapy Club\n" +
        "• Football Club\n" +
        "• Young Red Crescent Club\n" +
        "• Travel and Photography Club\n" +
        "• Law Club\n" +
        "• First Aid Club\n" +
        "• Blue Butterfly – Children’s Rights Club\n" +
        "• MEDI Foundation – Addiction Awareness Club\n" +
        "• Music Club\n" +
        "• Guidance and Psychological Counseling (PDR) Club\n" +
        "• Psychology Club\n" +
        "• Art and Design Club\n" +
        "• Chess Club\n" +
        "• Theatre Club\n\n" +
        "Students can join existing clubs or establish new ones each semester through the Health, Culture and Sports Directorate (SKS).",
      ["home", "cau-main", "about-cau"],
      [
        { label: "⚽ Sports & Football", prompt: "Is there any football team at CAU?" },
        { label: "Student Testimonials", prompt: "What do international students say about studying at CAU?" },
        { label: "Kyrenia Living", prompt: "What is the cost of living in Kyrenia for students?" },
        { label: "Apply Online", prompt: "How do I apply for admission?" }
      ]
    );
  }

  if (/language requirement|proficiency|ielts|toefl|duolingo|tomer|tömer|epe|english test|turkish test/.test(query)) {
    return reply(
      "**CAU Language Proficiency Requirements & Test Cutoffs:**\n\n" +
        "• **Undergraduate Programs (Associate & Bachelor's)**:\n" +
        "  - **English Programs**: CSU EPE: Minimum **B1 level** | IELTS: Minimum **5.0** | TOEFL iBT: Minimum **60** | Duolingo: Minimum **85**\n" +
        "  - **Turkish Programs**: TÖMER Turkish Proficiency Certificate: Minimum **B1 level**\n\n" +
        "• **Graduate Programs (Master's & Ph.D.)**:\n" +
        "  - **English Programs**: CSU EPE: Minimum **B2 level** | IELTS: Minimum **5.5** | TOEFL iBT: Minimum **65** | Duolingo: Minimum **90**\n" +
        "  - **Turkish Programs**: TÖMER Turkish Proficiency Certificate: Minimum **B2 level**\n\n" +
        "Students without valid test scores can sit for the CAU English Proficiency Exam (EPE) upon arrival or attend the English Preparatory School.",
      ["how-to-apply", "international-home"],
      [
        { label: "Required Documents", prompt: "What documents are required for application?" },
        { label: "Tuition Fees ($)", prompt: "What are the tuition fees for degree programs?" },
        { label: "Scholarships Available", prompt: "What scholarships can international students get?" },
        { label: "Apply Online", prompt: "How do I apply for admission?" }
      ]
    );
  }

  if (/program|programme|degree|course|study|department|تخصص|تخصصات|برامج|برنامج|بكالوريوس|ماجستير|دكتوراه|دبلوم|هندسة|طب اسنان|تمريض|عمارة|صيدلة|ادارة|قانون|سياحة|bölüm/.test(query)) {
    if (lang === "ar") {
      return reply(
        "**تطرح جامعة قبرص أيدن 48 تخصصاً معتمداً عبر 5 مستويات أكاديمية:**\n\n• **درجات البكالوريوس (24 تخصصاً)**: هندسة البرمجيات، هندسة الحاسوب، طب الأسنان (5 سنوات باللغة الإنجليزية)، الهندسة الكهربائية والإلكترونية، الميكاترونكس، الهندسة المدنية، أمن المعلومات، العمارة، التصميم الداخلي، التمريض (باللغتين الإنجليزية والتركية)، العلاج الطبيعي، إدارة الأعمال، العلاقات الدولية، علم النفس، القانون، السياحة والفنادق، فنون الطهي...\n• **درجات الماجستير (13 تخصصاً)**: هندسة الحاسوب، هندسة البرمجيات، إدارة الأعمال (MBA)، علم النفس العيادي، البنوك والتمويل...\n• **برامج الدكتوراه (5 تخصصات)**: إدارة الأعمال، علم النفس العيادي، الإدارة التعليمية، التمريض، الإرشاد والتوجيه النفسي.\n• **برامج الدبلوم (5 تخصصات)**: الإرشاد السياحي، خدمات الطيران، الإسعاف والطوارئ، البصريات، العلاج الطبيعي.\n• **المدرسة التحضيرية للغة الإنجليزية (سنة واحدة)**.\n\nتفضل بزيارة صفحة البرامج `/programs.html` للاطلاع على كافة التفاصيل والشروط.",
        ["programmes", "faculties"],
        [
          { label: "هندسة البرمجيات", prompt: "حدثني عن تخصص هندسة البرمجيات في الجامعة." },
          { label: "كلية طب الأسنان", prompt: "حدثني عن كلية طب الأسنان وشروط القبول." },
          { label: "الرسوم والمنح الدراسية", prompt: "كم الرسوم والمنح المتاحة؟" },
          { label: "برامج الماجستير", prompt: "ما هي برامج الماجستير المتوفرة؟" }
        ]
      );
    }
    return reply(
      "CAU offers 48 verified catalogue programmes across 5 academic levels:\n\n• **Bachelor's Degrees (24)**: Software Engineering, Computer Engineering, Dentistry, Architecture, Nursing (English & Turkish), Law, International Relations, Business, Psychology, Tourism, Gastronomy...\n• **Master's Degrees (13)**: Computer Engineering, Software Engineering, Business Administration (MBA), Clinical Psychology, Banking & Finance...\n• **Ph.D. / Doctorates (5)**: Business Administration, Clinical Psychology, Educational Management, Nursing, Guidance & Counselling.\n• **Associate Degrees (5)**: Tourist Guidance, Physiotherapy, Civil Aviation Cabin Services, First & Emergency Aid, Opticianry.\n• **English Preparatory School (1)**.\n\nBrowse `/programs.html` to explore all degrees with live filters.",
      ["programmes", "faculties"],
      [
        { label: "Software Engineering", prompt: "Tell me about Software Engineering degree." },
        { label: "Faculty of Dentistry", prompt: "Tell me about Faculty of Dentistry." },
        { label: "Tuition & Scholarships", prompt: "What are the tuition fees and scholarships?" },
        { label: "Master's Degrees", prompt: "What master degree programs are available?" }
      ]
    );
  }

  if (/campus|kyrenia|girne|location|where is|research center|lab|laboratory|library|quality|accreditation|موقع|اين تقع|أين تقع|مختبرات/.test(query)) {
    return reply(
      "CAU’s modern campus is located in Ozanköy, Kyrenia (Girne), Northern Cyprus (TRNC), close to the Mediterranean coastline and city centre. The campus features 10+ advanced laboratories, clinical dental simulation phantom heads, smart interactive classrooms, high-speed Wi-Fi, and research centres (Renewable Energy, Child Research, Cyprus Center, TÖMER). CAU holds institutional accreditations from YÖK, YÖDAK, UK ENIC/NARIC, and WHED.",
      ["cau-main", "about-cau", "home"],
      [
        { label: "Explore Programmes", prompt: "What programmes are available at CAU?" },
        { label: "Tuition & Fees", prompt: "How much is tuition for international students?" },
        { label: "Accommodation", prompt: "What dormitories are available for students?" },
        { label: "How to Apply", prompt: "How do I apply for admission?" }
      ]
    );
  }

  if (/personnel|human resources|employment|staff job|work permit|ik@/.test(query)) {
    return reply(
      "For employment, faculty recruitment, contracts, and personnel matters, CAU’s Personnel Department can be reached at **ik@cau.edu.tr** (Director: Aytül DENLİ, ext 6056). For academic appointments and current faculty rosters, consult **akademikkadro.cau.edu.tr**.",
      ["personnel", "akademik-kadro"],
      [
        { label: "Academic Staff Directory", prompt: "Where can I view the academic staff directory?" },
        { label: "Contact Student Affairs", prompt: "How do I reach Student Affairs?" }
      ]
    );
  }

  if (/^(what is cau|about cau|about the university|where is cau|why cau|university overview|university information)\b/.test(query) || /^(tell me about cau|explain cau|overview of cau)/.test(query) || (query.includes("what is cau") && query.length < 80)) {
    return reply(
      "**Cyprus Aydın University (CAU)** was established in 2013 in Kyrenia, Northern Cyprus. CAU hosts an international academic community with 3,000+ students (including 1,000+ international students from 60+ countries) and 1,200+ alumni across 8 faculties and 11 research centers. In strategic partnership with Istanbul Aydın University (IAU), CAU offers internationally accredited undergraduate and graduate programmes in English and Turkish, with clinical dental phantom head labs, modern engineering studios, and vibrant student life.",
      ["about-cau", "home", "cau-main"],
      [
        { label: "Browse Programmes", prompt: "What programmes does CAU offer?" },
        { label: "Tuition & Scholarships", prompt: "What are the tuition fees and scholarships?" },
        { label: "Campus Location", prompt: "Where is the CAU campus located?" },
        { label: "How to Apply", prompt: "How do I apply for admission?" }
      ]
    );
  }

  if (/dean|deans|dekan/.test(query)) {
    return reply(
      "**CAU Faculty Deans (2025–2026 Academic Year):**\n\n• **Faculty of Dentistry**: Prof. Dr. Cem Kurtoğlu\n• **Faculty of Engineering**: Prof. Dr. Hikmet Ş. Aybar\n• **Faculty of Health Sciences**: Prof. Dr. Mehmet Zeki Avcı\n• **Faculty of Economics, Administrative and Social Sciences**: Prof. Dr. Arzu Alvan Bozdereli\n• **Faculty of Law**: Prof. Dr. Z. Gönül Balkır\n• **Faculty of Tourism**: Prof. Dr. Hasan Tunç\n\nContact the deans’ secretariats or international admissions at **admission@cau.edu.tr**.",
      ["faculties", "about-cau", "cau-main"],
      [
        { label: "Engineering Staff", prompt: "Who teaches in Faculty of Engineering?" },
        { label: "Dentistry Professors", prompt: "Who teaches in Faculty of Dentistry?" },
        { label: "Faculties & Programs", prompt: "What faculties exist at CAU?" }
      ]
    );
  }

  const isCAU = isCAUQuery(query);
  if (!isCAU) {
    if (lang === "ar") {
      return reply(
        "أنا المساعد الذكي الرسمي لـ **جامعة قبرص أيدن (CAU)**. 🎓\n\n" +
          "أنا مخصص ومدرّب حصرياً للإجابة عن كل ما يتعلق بـ **جامعة قبرص أيدن (CAU)**، كلياتها وبرامجها الدراسية، الرسوم والمنح، شروط القبول والتسجيل، الفرق الرياضية (كرة القدم، الصالات، السلة)، ومرافق السكن والحياة الطلابية في **قبرص (كيرينيا)**.\n\n" +
          "لا يمكنني الإجابة عن مواضيع خارج هذا النطاق الأكاديمي والطلابي. كيف يمكنني مساعدتك اليوم في مسيرتك الجامعية أو تقديمك لجامعة قبرص أيدن؟",
        ["cau-main", "about-cau"],
        [
          { label: "⚽ فريق كرة القدم", prompt: "هل يوجد فريق كرة قدم وفرق رياضية في الجامعة؟" },
          { label: "💰 الرسوم والمنح", prompt: "كم رسوم الدراسة والمنح المتاحة في جامعة قبرص أيدن؟" },
          { label: "🎓 دليل التخصصات", prompt: "ما هي التخصصات والبرامج المتاحة في الجامعة؟" },
          { label: "🌴 المعيشة في قبرص", prompt: "كم تكلفة المعيشة في كيرينيا للطلاب؟" }
        ]
      );
    }
    if (lang === "tr") {
      return reply(
        "Ben **Kıbrıs Aydın Üniversitesi (CAU)** resmi yapay zeka asistanıyım. 🎓\n\n" +
          "Yalnızca **Cyprus Aydın University**, akademik lisans ve yüksek lisans programlarımız, kayıt ve burs olanakları, spor takımlarımız (futbol, basketbol, fitness) ve **Kuzey Kıbrıs'ta (Girne) öğrenci yaşamı ve barınma** ile ilgili konularda yardımcı olabilirim.\n\n" +
          "Bu kapsam dışındaki soruları yanıtlayamıyorum. Üniversitemiz veya Kıbrıs'taki öğrenci yaşamınızla ilgili size nasıl yardımcı olabilirim?",
        ["cau-main", "about-cau"],
        [
          { label: "⚽ Futbol Takımı ve Spor", prompt: "Üniversitede futbol takımı ve spor olanakları var mı?" },
          { label: "💰 Harç ve Burslar", prompt: "Harç ücretleri ve burs imkanları nelerdir?" },
          { label: "🎓 Bölümler", prompt: "Hangi lisans ve yüksek lisans bölümleri var?" },
          { label: "🌴 Girne'de Yaşam", prompt: "Girne'de öğrenci yaşam maliyeti ve ortamı nasıl?" }
        ]
      );
    }
    if (lang === "ru") {
      return reply(
        "Я официальный ИИ-ассистент **Кипрского университета Айдын (CAU)**. 🎓\n\n" +
          "Я отвечаю исключительно на вопросы, связанные с **университетом CAU**, нашими академическими программами, поступлением, стипендиями, спортивными командами, а также **жизнью студентов на Кипре (Кирения, ТРСК)**.\n\n" +
          "Я не консультирую по вопросам вне этого контекста. Чем я могу помочь вам относительно вашего поступления или учебы на Кипре?",
        ["cau-main", "about-cau"],
        [
          { label: "⚽ Футбольная команда", prompt: "Есть ли футбольная команда в CAU?" },
          { label: "💰 Стоимость и скидки", prompt: "Какова стоимость обучения и стипендии в CAU?" },
          { label: "🎓 Программы обучения", prompt: "Какие программы доступны в университете?" },
          { label: "🌴 Жизнь на Кипре", prompt: "Какова стоимость проживания в Кирении для студентов?" }
        ]
      );
    }
    return reply(
      "I am the official AI Assistant for **Cyprus Aydın University (CAU)**. 🎓\n\n" +
        "I specialize exclusively in answering questions about **CAU academic degree programmes, tuition & scholarships, admissions, sports teams (Football, Futsal, Basketball, Gym), campus facilities, and student life in Cyprus (Kyrenia, TRNC)**.\n\n" +
        "I cannot assist with queries outside this context. How can I help you with your studies, application, or student journey at Cyprus Aydın University?",
      ["cau-main", "about-cau"],
      [
        { label: "⚽ Sports & Football Team", prompt: "Is there any football team at CAU?" },
        { label: "💰 Tuition & Scholarships", prompt: "What are the tuition fees and scholarships?" },
        { label: "🎓 All Degree Programmes", prompt: "What bachelor and master degrees are offered?" },
        { label: "🌴 Living in Cyprus", prompt: "What is the cost of living in Kyrenia for students?" }
      ]
    );
  }

  // Catch-all: multilingual tailored response
  if (lang === "ar") {
    return reply(
      "يسعدني مساعدتك في كل ما يخص **جامعة قبرص أيدن (CAU)**: التخصصات والبرامج (48 برنامجاً معتمداً)، الرسوم الدراسية، المنح (50% إلى 100%)، شروط القبول والتسجيل، والسكن الطلابي في كيرينيا. تفضل بسؤالك أو اختر أحد الموضوعات السريعة أدناه:",
      ["cau-main", "about-cau"],
      [
        { label: "💰 الرسوم والمنح", prompt: "كم رسوم الدراسة والمنح المتاحة في جامعة قبرص أيدن؟" },
        { label: "🎓 دليل التخصصات", prompt: "ما هي التخصصات والبرامج المتاحة في الجامعة؟" },
        { label: "📝 شروط التقديم", prompt: "كيف أقدم على الجامعة وما هي الأوراق المطلوبة؟" },
        { label: "💬 التواصل عبر واتساب", prompt: "كيف أتواصل مع مكتب القبول الدولي عبر واتساب؟" }
      ]
    );
  }

  if (lang === "tr") {
    return reply(
      "Kıbrıs Aydın Üniversitesi (CAU) hakkında tüm konularda size yardımcı olabilirim: 48 lisans ve lisansüstü programı, harç ücretleri, %50–%100 burs imkanları, Girne'deki yurtlar ve başvuru koşulları. Lütfen sorunuzu iletin veya aşağıdaki başlıklardan birini seçin:",
      ["cau-main", "about-cau"],
      [
        { label: "💰 Harç ve Burslar", prompt: "Harç ücretleri ve burs imkanları nelerdir?" },
        { label: "🎓 Bölümler", prompt: "Hangi lisans ve yüksek lisans bölümleri var?" },
        { label: "📝 Başvuru Koşulları", prompt: "Başvuru ve kayıt süreci nasıl işliyor?" },
        { label: "💬 WhatsApp", prompt: "WhatsApp ile nasıl iletişime geçebilirim?" }
      ]
    );
  }
  return reply(
    "I can help with that from CAU’s official sources. Please check the three approved domains: cau.edu.tr (About, Faculties, Student Affairs, EBS), international.cau.edu.tr (Programs, Tuition & Fees, Scholarships, Accommodation, Apply) and akademikkadro.cau.edu.tr (academic staff directory). For general info: info@cau.edu.tr; for international admissions: admission@cau.edu.tr / +90 548 835 71 71; for academic staff: akademikkadro.cau.edu.tr; for student records: bilgi@cau.edu.tr.",
    ["cau-main", "international-home", "akademik-kadro"],
    [
      { label: "Tuition & Fees", prompt: "How much is tuition for international students?" },
      { label: "Scholarships (Up to 100%)", prompt: "What scholarships are available?" },
      { label: "Programmes Catalogue", prompt: "What bachelor and master degrees are offered?" },
      { label: "WhatsApp Admissions", prompt: "How do I contact admissions on WhatsApp?" }
    ]
  );
}

export function getFastPathAnswer(
  _question: string,
  _history?: Array<{ role: string; content: string }>
): AssistantReply | null {
  // Delegate all queries (including greetings) to the live Gemini LLM for intelligent, natural responses.
  // The verified fallback in createFallbackAnswer will be invoked automatically if the LLM is unreachable.
  return null;
}
