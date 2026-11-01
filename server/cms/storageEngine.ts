import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root directories
const projectRoot = path.resolve(__dirname, "../..");
const clientPublic = path.join(projectRoot, "client/public");
const distPublic = path.join(projectRoot, "dist/public");

// Ensure directory exists
function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Target replication folders — client/public (dev) and dist/public (production build)
const targetDirs = [clientPublic, distPublic];

// Atomic write helper
function atomicWriteJson(filename: string, data: unknown) {
  const jsonStr = JSON.stringify(data, null, 2);
  targetDirs.forEach((dir) => {
    ensureDir(dir);
    const dest = path.join(dir, filename);
    const tmp = `${dest}.tmp-${Date.now()}`;
    try {
      fs.writeFileSync(tmp, jsonStr, "utf8");
      fs.renameSync(tmp, dest);
    } catch (err) {
      console.error(`[CMS Storage] Failed writing to ${dest}:`, err);
      // Fallback direct write
      try {
        fs.writeFileSync(dest, jsonStr, "utf8");
      } catch (innerErr) {
        console.error(`[CMS Storage] Fallback direct write failed for ${dest}:`, innerErr);
      }
    }
  });
}

// Read JSON helper with fallback paths
function readJson<T>(filename: string, defaultVal: T): T {
  for (const dir of [clientPublic, distPublic]) {
    const filePath = path.join(dir, filename);
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, "utf8");
        return JSON.parse(raw) as T;
      } catch (err) {
        console.warn(`[CMS Storage] Could not parse ${filePath}:`, err);
      }
    }
  }
  return defaultVal;
}

// Data Type Definitions
export interface ProgramItem {
  Department: string;
  "Degree Level": string;
  "Program Name": string;
  "Program Details / Information"?: string;
  Duration: string;
  "Price / Tuition": string;
  Language: string;
  "Source URL"?: string;
  "Source Page Title"?: string;
  "Data Notes"?: string;
  slug: string;
  summary?: string;
  category?: string;
  billingBasis?: string;
  publishedTuition?: string;
  tuitionNotes?: string;
  status?: "active" | "draft" | "archived";
  updatedAt?: string;
}

export interface FacultyItem {
  order?: number;
  name: string;
  url?: string;
  title?: string;
  dean?: string;
  students?: string;
  programs?: string[];
  accreditation?: string;
  email?: string;
  phone?: string;
  updatedAt?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: "Academic" | "Campus Life" | "International" | "Research" | "Announcements";
  image: string;
  publishedAt: string;
  author: string;
  isFeatured?: boolean;
  status: "published" | "draft" | "archived";
}

export interface LeadItem {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  programOfInterest: string;
  degreeLevel?: string;
  notes?: string;
  status: "New" | "Contacted" | "Offer Sent" | "Enrolled" | "Closed";
  source: "Website Form" | "WhatsApp" | "AI Assistant" | "Direct Email";
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  announcementBanner: {
    enabled: boolean;
    text: string;
    linkText: string;
    linkUrl: string;
  };
  contact: {
    officialWhatsApp: string;
    admissionsEmail: string;
    generalPhone: string;
    campusAddress: string;
  };
  admissions: {
    activeTerm: string;
    applicationDeadline: string;
    internationalDiscountNotice: string;
  };
}

export interface AIAssistantLog {
  id: string;
  question: string;
  timestamp: string;
  resolved: boolean;
  userIp?: string;
  suggestedAction?: string;
}

export interface FastPathItem {
  id: string;
  questionKeywords: string[];
  answer: string;
  suggestedChips: string[];
  active: boolean;
}

// Default initial seeds
const defaultSettings: SiteSettings = {
  announcementBanner: {
    enabled: true,
    text: "Admissions for Academic Year 2026/2027 are officially open. 50%–100% Scholarships Available!",
    linkText: "Apply Now",
    linkUrl: "https://apply.cau.edu.tr/",
  },
  contact: {
    officialWhatsApp: "+90 548 835 71 71",
    admissionsEmail: "admission@cau.edu.tr",
    generalPhone: "+90 392 650 00 00",
    campusAddress: "Dr. Fazıl Küçük Caddesi No:80, Kyrenia, Turkish Republic of Northern Cyprus",
  },
  admissions: {
    activeTerm: "Fall 2026/27",
    applicationDeadline: "30 October 2026",
    internationalDiscountNotice: "All international admitted students receive a guaranteed 50% minimum tuition waiver.",
  },
};

const defaultNews: NewsItem[] = [
  {
    id: "news-1",
    title: "Cyprus Aydın University Expands High-Tech Engineering & AI Research Labs",
    slug: "engineering-ai-research-labs-expansion",
    summary: "New state-of-the-art mechatronics and artificial intelligence computing facilities inaugurated at the Kyrenia campus.",
    content: "Cyprus Aydın University today officially opened its newly expanded Engineering and Computing Research Complex. Featuring high-performance GPU clusters, robotics testbeds, and biomedical simulation suites, the new facility directly serves undergraduate and postgraduate scholars.",
    category: "Academic",
    image: "/assets/untitled2-13-24f9b4bd8b_652e8d35.jpg",
    publishedAt: "2026-09-01",
    author: "Rectorate Communications",
    isFeatured: true,
    status: "published",
  },
  {
    id: "news-2",
    title: "Faculty of Dentistry Receives Enhanced Clinical Simulation Phantom Heads",
    slug: "dentistry-clinical-simulation-upgrade",
    summary: "Premier 5-year clinical dentistry programme introduces next-generation simulation suites for international cohorts.",
    content: "The CAU Faculty of Dentistry has installed next-generation simulation units to expand pre-clinical training for incoming students across Europe, Central Asia, and the Middle East.",
    category: "Academic",
    image: "/assets/untitled2-14-def7ddf464_580c9d6d.jpg",
    publishedAt: "2026-08-25",
    author: "Faculty of Dentistry",
    isFeatured: false,
    status: "published",
  },
  {
    id: "news-3",
    title: "Orientation Week for International Students Fall 2026 Announced",
    slug: "international-orientation-week-fall-2026",
    summary: "Comprehensive airport transfers, campus induction tours, Mediterranean cultural excursions, and student visa registration desks.",
    content: "The International Office has published the detailed schedule for Fall 2026 arrival and orientation. Free airport shuttle services from Ercan Airport (ECN) will run continuously throughout the arrivals period.",
    category: "Campus Life",
    image: "/assets/cau-campus-gate_e8b028bc.jpg",
    publishedAt: "2026-08-18",
    author: "International Office",
    isFeatured: false,
    status: "published",
  },
];

const defaultLeads: LeadItem[] = [
  {
    id: "lead-1",
    fullName: "Amina Al-Mansoor",
    email: "amina.m@example.com",
    phone: "+971 50 123 4567",
    country: "United Arab Emirates",
    programOfInterest: "Software Engineering",
    degreeLevel: "Bachelor",
    notes: "High school GPA 3.8. Inquired about SAT 85% scholarship criteria.",
    status: "Offer Sent",
    source: "Website Form",
    createdAt: "2026-09-04T10:15:00Z",
    updatedAt: "2026-09-05T14:30:00Z",
  },
  {
    id: "lead-2",
    fullName: "Tariq Mahmud",
    email: "tariq.mahmud@example.com",
    phone: "+90 533 821 4433",
    country: "Turkey",
    programOfInterest: "Dentistry",
    degreeLevel: "Bachelor",
    notes: "Interested in 5-year English Dentistry programme. WhatsApp followed up.",
    status: "Contacted",
    source: "WhatsApp",
    createdAt: "2026-09-05T08:45:00Z",
    updatedAt: "2026-09-05T09:10:00Z",
  },
  {
    id: "lead-3",
    fullName: "Ksenia Petrova",
    email: "ksenia.p@example.com",
    phone: "+7 916 555 0192",
    country: "Kazakhstan",
    programOfInterest: "Business Administration (MBA)",
    degreeLevel: "Master",
    notes: "Bachelor degree in Economics. Sent prospectus and fee evaluation sheet.",
    status: "New",
    source: "AI Assistant",
    createdAt: "2026-09-06T11:20:00Z",
    updatedAt: "2026-09-06T11:20:00Z",
  },
];

// Storage Engine Service
export class CMSStorageEngine {
  // Programmes
  static getPrograms(): ProgramItem[] {
    return readJson<ProgramItem[]>("program-catalog.json", []);
  }

  static savePrograms(programs: ProgramItem[]): void {
    atomicWriteJson("program-catalog.json", programs);
  }

  static getProgramBySlug(slug: string): ProgramItem | undefined {
    const list = this.getPrograms();
    return list.find((p) => p.slug === slug || p["Program Name"].toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug);
  }

  static upsertProgram(program: ProgramItem): ProgramItem {
    const list = this.getPrograms();
    if (!program.slug) {
      program.slug = program["Program Name"].toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    program.updatedAt = new Date().toISOString();
    if (!program.status) program.status = "active";

    const idx = list.findIndex((p) => p.slug === program.slug || p["Program Name"] === program["Program Name"]);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...program };
    } else {
      list.unshift(program);
    }
    this.savePrograms(list);
    return program;
  }

  static deleteProgram(slug: string): boolean {
    const list = this.getPrograms();
    const initialLen = list.length;
    const filtered = list.filter((p) => p.slug !== slug && p["Program Name"] !== slug);
    if (filtered.length !== initialLen) {
      this.savePrograms(filtered);
      return true;
    }
    return false;
  }

  // Faculties
  static getFaculties(): FacultyItem[] {
    return readJson<FacultyItem[]>("faculties.json", []);
  }

  static saveFaculties(faculties: FacultyItem[]): void {
    atomicWriteJson("faculties.json", faculties);
  }

  static updateFaculty(name: string, updates: Partial<FacultyItem>): FacultyItem | null {
    const list = this.getFaculties();
    const idx = list.findIndex((f) => f.name.toLowerCase() === name.toLowerCase());
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
      this.saveFaculties(list);
      return list[idx];
    }
    return null;
  }

  // News
  static getNews(): NewsItem[] {
    const news = readJson<NewsItem[]>("news.json", []);
    if (!news.length) {
      this.saveNews(defaultNews);
      return defaultNews;
    }
    return news;
  }

  static saveNews(news: NewsItem[]): void {
    atomicWriteJson("news.json", news);
  }

  static upsertNews(item: Omit<NewsItem, "id"> & { id?: string }): NewsItem {
    const list = this.getNews();
    const id = item.id || `news-${Date.now()}`;
    const slug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const newsItem: NewsItem = {
      ...item,
      id,
      slug,
      publishedAt: item.publishedAt || new Date().toISOString().split("T")[0],
    };

    const idx = list.findIndex((n) => n.id === id);
    if (idx >= 0) {
      list[idx] = newsItem;
    } else {
      list.unshift(newsItem);
    }
    this.saveNews(list);
    return newsItem;
  }

  static deleteNews(id: string): boolean {
    const list = this.getNews();
    const filtered = list.filter((n) => n.id !== id);
    if (filtered.length !== list.length) {
      this.saveNews(filtered);
      return true;
    }
    return false;
  }

  // Leads
  static getLeads(): LeadItem[] {
    const leads = readJson<LeadItem[]>("leads.json", []);
    if (!leads.length) {
      this.saveLeads(defaultLeads);
      return defaultLeads;
    }
    return leads;
  }

  static saveLeads(leads: LeadItem[]): void {
    atomicWriteJson("leads.json", leads);
  }

  static createLead(lead: Omit<LeadItem, "id" | "createdAt" | "updatedAt">): LeadItem {
    const list = this.getLeads();
    const newLead: LeadItem = {
      ...lead,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    list.unshift(newLead);
    this.saveLeads(list);
    return newLead;
  }

  static updateLeadStatus(id: string, status: LeadItem["status"], notes?: string): LeadItem | null {
    const list = this.getLeads();
    const idx = list.findIndex((l) => l.id === id);
    if (idx >= 0) {
      list[idx].status = status;
      if (notes !== undefined) list[idx].notes = notes;
      list[idx].updatedAt = new Date().toISOString();
      this.saveLeads(list);
      return list[idx];
    }
    return null;
  }

  // Site Settings
  static getSettings(): SiteSettings {
    return readJson<SiteSettings>("settings.json", defaultSettings);
  }

  static updateSettings(settings: Partial<SiteSettings>): SiteSettings {
    const current = this.getSettings();
    const updated: SiteSettings = {
      announcementBanner: { ...current.announcementBanner, ...settings.announcementBanner },
      contact: { ...current.contact, ...settings.contact },
      admissions: { ...current.admissions, ...settings.admissions },
    };
    atomicWriteJson("settings.json", updated);
    return updated;
  }

  // Dashboard Stats Aggregator
  static getStats() {
    const programs = this.getPrograms();
    const faculties = this.getFaculties();
    const news = this.getNews();
    const leads = this.getLeads();

    const degreeCounts = programs.reduce((acc, p) => {
      const deg = p["Degree Level"] || "Other";
      acc[deg] = (acc[deg] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const newLeadsCount = leads.filter((l) => l.status === "New").length;
    const publishedNewsCount = news.filter((n) => n.status === "published").length;

    return {
      totalPrograms: programs.length,
      degreeCounts,
      totalFaculties: faculties.length || 7,
      totalNews: news.length,
      publishedNewsCount,
      totalLeads: leads.length,
      newLeadsCount,
      recentLeads: leads.slice(0, 5),
      recentNews: news.slice(0, 4),
    };
  }
}
