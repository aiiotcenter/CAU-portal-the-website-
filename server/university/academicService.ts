import {
  StudentTranscriptItem,
  TranscriptSummary,
  AcademicStanding,
  CourseScheduleItem,
  LocalizedScheduleItem,
  RosterStudent,
  FacultyCourse,
  MaskedLeadItem,
  UserRole,
  LetterGrade,
  TermSummary,
} from "@shared/university";
import type { LeadItem } from "../cms/storageEngine";

/**
 * Letter Grade to Grade Point Quality Mapping.
 * Turkish & European (ECTS / YÖK) Higher Education Standard.
 */
export const GRADE_POINT_MAP: Record<LetterGrade, number | null> = {
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  F: 0.0,
  W: null, // Withdrawn — Excluded from GPA
  P: null, // Pass — Credits earned, excluded from GPA points
  I: null, // Incomplete — Excluded until resolved
};

/**
 * Normalizes input letter grades (trims whitespace, converts to uppercase).
 * Returns null if unrecognized to prevent NaN floating-point pollution.
 */
export function normalizeLetterGrade(grade: string | null | undefined): LetterGrade | null {
  if (!grade || typeof grade !== "string") return null;
  const upper = grade.trim().toUpperCase();
  if (upper in GRADE_POINT_MAP) return upper as LetterGrade;
  return null;
}

/**
 * Convert numerical composite course score (0 - 100) to standard letter grade.
 * Follows Cyprus Aydın University & YÖK/YÖDAK standard grade thresholds.
 * Correctly includes D+ (1.30 quality points) for scores 50–54.
 */
export function convertScoreToLetterGrade(score: number): LetterGrade {
  if (typeof score !== "number" || isNaN(score)) return "F";
  const rounded = Math.round(score);
  if (rounded >= 90) return "A";
  if (rounded >= 85) return "A-";
  if (rounded >= 80) return "B+";
  if (rounded >= 75) return "B";
  if (rounded >= 70) return "B-";
  if (rounded >= 65) return "C+";
  if (rounded >= 60) return "C";
  if (rounded >= 55) return "C-";
  if (rounded >= 50) return "D+"; // 1.30 quality points
  if (rounded >= 45) return "D";  // 1.00 quality point
  return "F";
}

/**
 * Passing threshold for graduation credit recognition.
 * Minimum grade to earn institutional credits is 'D' (1.0) or 'P' (Pass).
 */
export function isGradeEarned(letterGrade: LetterGrade | string): boolean {
  if (!letterGrade) return false;
  const normalized = normalizeLetterGrade(letterGrade);
  if (!normalized) return false;
  if (normalized === "P") return true;
  const point = GRADE_POINT_MAP[normalized];
  return typeof point === "number" && point >= 1.0;
}

/**
 * Round GPA safely to 2 decimal places using Number.EPSILON to eliminate
 * IEEE-754 floating point representation anomalies.
 */
export function roundGpa(rawGpa: number): number {
  if (isNaN(rawGpa) || !isFinite(rawGpa)) return 0.0;
  return Math.round((rawGpa + Number.EPSILON) * 100) / 100;
}

/**
 * Determine official Academic Standing per CAU Student Handbook:
 * - GPA 3.50 – 4.00: High Honors (High Honor / Yüksek Onur)
 * - GPA 3.00 – 3.49: Dean's List (Honor / Onur)
 * - GPA 2.00 – 2.99: Good Standing (Satisfactory)
 * - GPA 1.70 – 1.99: Academic Warning (Conditional)
 * - GPA < 1.70: Academic Probation (Unsatisfactory)
 */
export function determineAcademicStanding(gpa: number, creditsAttempted: number): AcademicStanding {
  if (creditsAttempted <= 0) return "Not Computed";
  if (gpa >= 3.5) return "High Honors";
  if (gpa >= 3.0) return "Dean's List";
  if (gpa >= 2.0) return "Good Standing";
  if (gpa >= 1.7) return "Academic Warning";
  return "Academic Probation";
}

export interface GPAComputeOptions {
  studentMeta?: {
    studentId?: string;
    studentName?: string;
    program?: string;
    faculty?: string;
    catalogYear?: string;
    totalDegreeCredits?: number;
  };
  repeatPolicy?: "latest" | "highest" | "all";
  includeInProgress?: boolean;
}

/**
 * Compute Term-by-Term (Semester) SGPA summaries.
 */
export function computeTermSummaries(
  transcripts: StudentTranscriptItem[],
  options?: GPAComputeOptions
): TermSummary[] {
  const safeTranscripts = Array.isArray(transcripts) ? transcripts : [];
  const termMap = new Map<string, StudentTranscriptItem[]>();

  for (const item of safeTranscripts) {
    if (!item) continue;
    const term = item.term || "General";
    if (!termMap.has(term)) termMap.set(term, []);
    termMap.get(term)!.push(item);
  }

  const summaries: TermSummary[] = [];

  for (const [term, items] of Array.from(termMap.entries())) {
    let termQualityPoints = 0;
    let termAttempted = 0;
    let termEarned = 0;
    let termEctsQualityPoints = 0;
    let termEctsAttempted = 0;
    let termEctsEarned = 0;
    let validCourseCount = 0;

    for (const course of items) {
      if (!course || typeof course.credits !== "number" || course.credits <= 0) continue;
      const letter = normalizeLetterGrade(course.letterGrade);
      if (!letter || letter === "W" || course.status === "Withdrawn") continue;
      if (course.status === "In Progress" && options?.includeInProgress === false) continue;

      const credits = course.credits;
      const ects = typeof course.ectsCredits === "number" && course.ectsCredits > 0 ? course.ectsCredits : 6;
      const point = GRADE_POINT_MAP[letter];

      if (typeof point === "number") {
        termAttempted += credits;
        termQualityPoints += point * credits;
        termEctsAttempted += ects;
        termEctsQualityPoints += point * ects;
      }

      if (isGradeEarned(letter)) {
        termEarned += credits;
        termEctsEarned += ects;
      }

      validCourseCount++;
    }

    const gpa = termAttempted > 0 ? roundGpa(termQualityPoints / termAttempted) : 0.0;
    const ectsGpa = termEctsAttempted > 0 ? roundGpa(termEctsQualityPoints / termEctsAttempted) : 0.0;
    const standing = determineAcademicStanding(gpa, termAttempted);

    summaries.push({
      term,
      creditsAttempted: termAttempted,
      creditsEarned: termEarned,
      ectsCreditsAttempted: termEctsAttempted,
      ectsCreditsEarned: termEctsEarned,
      gpa,
      ectsGpa,
      academicStanding: standing,
      courseCount: validCourseCount,
    });
  }

  return summaries;
}

/**
 * Resilient Cumulative GPA & Academic Standing computation engine.
 * Guards against:
 * 1. Zero credits or empty transcript arrays (division-by-zero).
 * 2. Transcripts with only non-credit / Withdrawn ('W') courses.
 * 3. Decimal precision floating-point drift (Number.EPSILON).
 * 4. Incomplete / null course inputs & lowercase grade normalization.
 * 5. Course repeats / retake replacements according to institutional policy.
 * 6. ECTS and local institutional credit dual calculation.
 */
export function computeCumulativeGPA(
  transcripts: StudentTranscriptItem[],
  optionsOrMeta?: GPAComputeOptions | GPAComputeOptions["studentMeta"]
): TranscriptSummary {
  const safeTranscripts = Array.isArray(transcripts) ? transcripts : [];

  const options: GPAComputeOptions =
    optionsOrMeta && ("repeatPolicy" in optionsOrMeta || "includeInProgress" in optionsOrMeta || "studentMeta" in optionsOrMeta)
      ? (optionsOrMeta as GPAComputeOptions)
      : { studentMeta: optionsOrMeta as GPAComputeOptions["studentMeta"] };

  const repeatPolicy = options.repeatPolicy || "latest";
  const studentMeta = options.studentMeta;

  // Handle repeated course codes if repeatPolicy is "latest" or "highest"
  let processedCourses: StudentTranscriptItem[] = [];

  if (repeatPolicy === "all") {
    processedCourses = safeTranscripts;
  } else {
    const courseMap = new Map<string, StudentTranscriptItem[]>();
    for (const c of safeTranscripts) {
      if (!c) continue;
      const code = (c.courseCode || "").trim().toUpperCase();
      if (!code) {
        processedCourses.push(c);
        continue;
      }
      if (!courseMap.has(code)) courseMap.set(code, []);
      courseMap.get(code)!.push(c);
    }

    for (const [, attempts] of Array.from(courseMap.entries())) {
      if (attempts.length === 1) {
        processedCourses.push(attempts[0]);
      } else if (repeatPolicy === "latest") {
        processedCourses.push(attempts[attempts.length - 1]);
      } else if (repeatPolicy === "highest") {
        let best = attempts[0];
        let bestPts = -1;
        for (const att of attempts) {
          const letter = normalizeLetterGrade(att.letterGrade);
          const pts = letter ? (GRADE_POINT_MAP[letter] ?? -1) : -1;
          if (pts > bestPts) {
            bestPts = pts;
            best = att;
          }
        }
        processedCourses.push(best);
      }
    }
  }

  let totalQualityPoints = 0;
  let creditsAttempted = 0;
  let creditsEarned = 0;
  let totalEctsQualityPoints = 0;
  let ectsCreditsAttempted = 0;
  let ectsCreditsEarned = 0;

  for (const course of processedCourses) {
    if (!course || typeof course.credits !== "number" || course.credits <= 0) {
      continue;
    }

    const letter = normalizeLetterGrade(course.letterGrade);
    if (!letter) continue;

    // Withdrawn courses never count toward attempted or earned credits
    if (letter === "W" || course.status === "Withdrawn") {
      continue;
    }

    // In-progress courses: exclude if explicitly configured
    if (course.status === "In Progress" && options.includeInProgress === false) {
      continue;
    }

    const credits = course.credits;
    const ects = typeof course.ectsCredits === "number" && course.ectsCredits > 0 ? course.ectsCredits : 6;
    const gradePoint = GRADE_POINT_MAP[letter];

    // Attempted credits include all graded courses (A through F)
    if (typeof gradePoint === "number") {
      creditsAttempted += credits;
      totalQualityPoints += gradePoint * credits;
      ectsCreditsAttempted += ects;
      totalEctsQualityPoints += gradePoint * ects;
    }

    // Credits earned are courses passed with D or above, or Pass (P)
    if (isGradeEarned(letter)) {
      creditsEarned += credits;
      ectsCreditsEarned += ects;
    }
  }

  const gpa = creditsAttempted > 0 ? roundGpa(totalQualityPoints / creditsAttempted) : 0.0;
  const ectsGpa = ectsCreditsAttempted > 0 ? roundGpa(totalEctsQualityPoints / ectsCreditsAttempted) : 0.0;
  const standing = determineAcademicStanding(gpa, creditsAttempted);

  const totalDegreeCredits = studentMeta?.totalDegreeCredits ?? 120;
  const completionPercentage = Math.min(
    100,
    Math.round((creditsEarned / totalDegreeCredits) * 100)
  );

  const termSummaries = computeTermSummaries(safeTranscripts, options);

  return {
    studentId: studentMeta?.studentId ?? "20231089",
    studentName: studentMeta?.studentName ?? "Alexander M. Vance",
    program: studentMeta?.program ?? "B.Sc. Software Engineering",
    faculty: studentMeta?.faculty ?? "Faculty of Engineering & Architecture",
    catalogYear: studentMeta?.catalogYear ?? "2023-2024",
    creditsAttempted,
    creditsEarned,
    totalDegreeCredits,
    completionPercentage,
    gpa,
    academicStanding: standing,
    calculatedAt: new Date().toISOString(),
    ectsCreditsAttempted,
    ectsCreditsEarned,
    ectsGpa,
    termSummaries,
  };
}

/**
 * Calculate GPA required in upcoming credits to achieve a target cumulative GPA.
 */
export function calculateRequiredGPA(
  currentCreditsAttempted: number,
  currentGPA: number,
  targetGPA: number,
  upcomingCredits: number
): {
  requiredGPA: number;
  isAchievable: boolean;
  message: string;
} {
  if (upcomingCredits <= 0) {
    const isAchieved = currentGPA >= targetGPA;
    return {
      requiredGPA: currentGPA,
      isAchievable: isAchieved,
      message: isAchieved
        ? "Target GPA already achieved with current completed credits."
        : "Cannot alter cumulative GPA without additional completed credits.",
    };
  }

  const currentPoints = Math.max(0, currentCreditsAttempted) * Math.max(0, currentGPA);
  const totalTargetCredits = Math.max(0, currentCreditsAttempted) + upcomingCredits;
  const targetTotalPoints = totalTargetCredits * targetGPA;
  const neededPoints = targetTotalPoints - currentPoints;
  const rawRequired = neededPoints / upcomingCredits;
  const roundedRequired = roundGpa(rawRequired);

  if (roundedRequired <= 0) {
    return {
      requiredGPA: 0.0,
      isAchievable: true,
      message: `Target GPA of ${targetGPA.toFixed(2)} is already secured. Even a 0.00 GPA in the next ${upcomingCredits} credits maintains target.`,
    };
  }

  if (roundedRequired > 4.0) {
    return {
      requiredGPA: roundedRequired,
      isAchievable: false,
      message: `Target GPA of ${targetGPA.toFixed(2)} requires a ${roundedRequired.toFixed(2)} semester GPA across ${upcomingCredits} credits, which exceeds the institutional maximum of 4.00. More credits are needed to raise CGPA.`,
    };
  }

  return {
    requiredGPA: roundedRequired,
    isAchievable: true,
    message: `You need a minimum ${roundedRequired.toFixed(2)} GPA across your upcoming ${upcomingCredits} credits to achieve a ${targetGPA.toFixed(2)} cumulative GPA.`,
  };
}

/**
 * Project cumulative GPA given planned upcoming courses.
 */
export function projectFutureGPA(
  currentTranscripts: StudentTranscriptItem[],
  plannedCourses: {
    courseCode?: string;
    courseName?: string;
    credits: number;
    ectsCredits?: number;
    expectedGrade: LetterGrade | string;
  }[],
  options?: GPAComputeOptions
): TranscriptSummary {
  const simulatedItems: StudentTranscriptItem[] = (currentTranscripts || []).slice();

  let idCounter = 1;
  for (const pc of plannedCourses) {
    const normalized = normalizeLetterGrade(pc.expectedGrade) || "C";
    simulatedItems.push({
      id: `SIM-${idCounter++}`,
      courseCode: pc.courseCode || `PLANNED-${idCounter}`,
      courseName: pc.courseName || "Planned Course",
      credits: pc.credits,
      ectsCredits: pc.ectsCredits || 6,
      term: "Projected Term",
      numericGrade: null,
      letterGrade: normalized,
      status: "Completed",
    });
  }

  return computeCumulativeGPA(simulatedItems, options);
}

/**
 * Timezone Offset Map relative to UTC (in hours).
 * Handled for the university portal to eliminate client-side timezone discrepancies.
 */
export const TIMEZONE_OFFSETS: Record<string, number> = {
  UTC: 0,
  "Asia/Nicosia": 3, // Cyprus Campus Standard (EEST / UTC+3)
  "Europe/London": 1, // British Summer Time (BST)
  "Europe/Berlin": 2, // Central European Time (CEST)
  "Asia/Dubai": 4, // Gulf Standard Time (GST)
  "Africa/Lagos": 1, // West Africa Time (WAT)
  "Africa/Cairo": 3, // Eastern European Time (EET)
  "Asia/Karachi": 5, // Pakistan Standard Time (PKT)
  "America/New_York": -4, // Eastern Daylight Time (EDT)
};

/**
 * Convert UTC 24h format time ("HH:MM") to target timezone ("HH:MM").
 */
export function convertUtcToTargetTime(utcTime: string, targetTz: string): string {
  const [hoursStr, minutesStr] = utcTime.split(":");
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  const offset = TIMEZONE_OFFSETS[targetTz] ?? TIMEZONE_OFFSETS["Asia/Nicosia"];
  let targetHours = (hours + offset) % 24;
  if (targetHours < 0) {
    targetHours += 24;
  }

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${pad(targetHours)}:${pad(minutes)}`;
}

/**
 * Localize a list of canonical UTC class schedules to a student/faculty requested timezone.
 * Detects overlapping schedule conflicts.
 */
export function localizeCourseSchedule(
  scheduleItems: CourseScheduleItem[],
  targetTimezone: string = "Asia/Nicosia"
): LocalizedScheduleItem[] {
  const resolvedTz = TIMEZONE_OFFSETS[targetTimezone] !== undefined ? targetTimezone : "Asia/Nicosia";

  // First pass: localize times
  const localized = scheduleItems.map((item) => {
    const localStart = convertUtcToTargetTime(item.startTimeUtc, resolvedTz);
    const localEnd = convertUtcToTargetTime(item.endTimeUtc, resolvedTz);
    const campusStart = convertUtcToTargetTime(item.startTimeUtc, "Asia/Nicosia");
    const campusEnd = convertUtcToTargetTime(item.endTimeUtc, "Asia/Nicosia");

    return {
      ...item,
      localStartTime: localStart,
      localEndTime: localEnd,
      targetTimezone: resolvedTz,
      campusStartTime: campusStart,
      campusEndTime: campusEnd,
      hasConflict: false,
    };
  });

  // Second pass: conflict detection (overlapping times on the same day)
  for (let i = 0; i < localized.length; i++) {
    for (let j = i + 1; j < localized.length; j++) {
      const a = localized[i];
      const b = localized[j];

      if (a.dayOfWeek === b.dayOfWeek) {
        // Convert to minutes for easy overlap check
        const toMin = (t: string) => {
          const [h, m] = t.split(":").map(Number);
          return h * 60 + m;
        };

        const aStart = toMin(a.startTimeUtc);
        const aEnd = toMin(a.endTimeUtc);
        const bStart = toMin(b.startTimeUtc);
        const bEnd = toMin(b.endTimeUtc);

        // Overlap condition: startA < endB && endA > startB
        if (aStart < bEnd && aEnd > bStart) {
          localized[i].hasConflict = true;
          localized[j].hasConflict = true;
        }
      }
    }
  }

  return localized;
}

/**
 * FERPA / GDPR Compliant PII Masking Utilities.
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return "***@***.com";
  const [local, domain] = email.split("@");
  if (local.length <= 2) {
    return `${local[0]}***@${domain}`;
  }
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

export function maskPhone(phone: string): string {
  if (!phone) return "+*** *** ***";
  const cleaned = phone.trim();
  if (cleaned.length <= 6) return "+*** ***";
  // Keep first 4 and last 2 characters
  const start = cleaned.slice(0, 7);
  const end = cleaned.slice(-2);
  return `${start} *** **${end}`;
}

export function maskStudentId(id: string): string {
  if (!id) return "********";
  const clean = id.trim();
  if (clean.length <= 4) return "****";
  const start = clean.slice(0, 4);
  const end = clean.slice(-2);
  return `${start}****${end}`;
}

/**
 * Sanitize Lead PII based on user role.
 * Faculty and unauthenticated viewers only receive masked contact info.
 */
export function sanitizeLeadPII(
  lead: LeadItem,
  role: UserRole = "admin",
  forceUnmask = false
): MaskedLeadItem {
  const isPrivileged = role === "admin" && forceUnmask;

  return {
    id: lead.id,
    fullName: lead.fullName,
    email: isPrivileged ? lead.email : maskEmail(lead.email),
    maskedEmail: maskEmail(lead.email),
    phone: isPrivileged ? lead.phone : maskPhone(lead.phone),
    maskedPhone: maskPhone(lead.phone),
    country: lead.country,
    programOfInterest: lead.programOfInterest,
    degreeLevel: lead.degreeLevel || "Bachelor",
    status: lead.status,
    source: lead.source,
    notes: lead.notes,
    createdAt: lead.createdAt,
    isPiiMasked: !isPrivileged,
  };
}

/**
 * Canonical Seed Data for Testing & Demonstration.
 */
export const SEED_STUDENT_TRANSCRIPT: StudentTranscriptItem[] = [
  {
    id: "TR-101",
    courseCode: "SENG101",
    courseName: "Introduction to Software Engineering",
    credits: 4,
    ectsCredits: 6,
    term: "Fall 2024",
    numericGrade: 94,
    letterGrade: "A",
    status: "Completed",
    instructor: "Dr. Elif Yılmaz",
  },
  {
    id: "TR-102",
    courseCode: "MATH101",
    courseName: "Calculus for Engineers I",
    credits: 4,
    ectsCredits: 6,
    term: "Fall 2024",
    numericGrade: 88,
    letterGrade: "B+",
    status: "Completed",
    instructor: "Prof. Mehmet Kaya",
  },
  {
    id: "TR-103",
    courseCode: "PHYS101",
    courseName: "Physics for Computing Systems",
    credits: 3,
    ectsCredits: 5,
    term: "Fall 2024",
    numericGrade: 83,
    letterGrade: "B",
    status: "Completed",
    instructor: "Dr. Ayşe Demir",
  },
  {
    id: "TR-104",
    courseCode: "ENG101",
    courseName: "Academic English Writing & Oral Skills",
    credits: 3,
    ectsCredits: 4,
    term: "Fall 2024",
    numericGrade: 91,
    letterGrade: "A-",
    status: "Completed",
    instructor: "Lect. Sarah Jenkins",
  },
  {
    id: "TR-105",
    courseCode: "CAU100",
    courseName: "Cyprus History & University Orientation",
    credits: 1,
    ectsCredits: 2,
    term: "Fall 2024",
    numericGrade: 100,
    letterGrade: "P", // Pass / non-credit for GPA calculation
    status: "Completed",
    instructor: "Dean of Student Affairs",
  },
  {
    id: "TR-201",
    courseCode: "SENG201",
    courseName: "Object-Oriented Programming & Data Structures",
    credits: 4,
    ectsCredits: 6,
    term: "Spring 2025",
    numericGrade: 96,
    letterGrade: "A",
    status: "Completed",
    instructor: "Dr. Elif Yılmaz",
  },
  {
    id: "TR-202",
    courseCode: "MATH102",
    courseName: "Discrete Mathematics & Logic",
    credits: 3,
    ectsCredits: 5,
    term: "Spring 2025",
    numericGrade: 86,
    letterGrade: "B+",
    status: "Completed",
    instructor: "Prof. Mehmet Kaya",
  },
  {
    id: "TR-203",
    courseCode: "SENG202",
    courseName: "Database Systems & Architecture",
    credits: 4,
    ectsCredits: 6,
    term: "Spring 2025",
    numericGrade: 90,
    letterGrade: "A-",
    status: "Completed",
    instructor: "Assoc. Prof. Can Özdemir",
  },
  {
    id: "TR-204",
    courseCode: "ECON101",
    courseName: "Principles of Microeconomics",
    credits: 3,
    ectsCredits: 4,
    term: "Spring 2025",
    numericGrade: null,
    letterGrade: "W", // Withdrawn
    status: "Withdrawn",
    instructor: "Dr. Zeynep Arslan",
  },
  {
    id: "TR-301",
    courseCode: "SENG301",
    courseName: "Software Architecture & Cloud Systems",
    credits: 4,
    ectsCredits: 6,
    term: "Fall 2025",
    numericGrade: 92,
    letterGrade: "A",
    status: "In Progress",
    instructor: "Dr. Elif Yılmaz",
  },
];

export const SEED_COURSE_SCHEDULE: CourseScheduleItem[] = [
  {
    id: "SCH-1",
    courseCode: "SENG301",
    courseTitle: "Software Architecture & Cloud Systems",
    facultyName: "Dr. Elif Yılmaz",
    classroom: "Tech Lab 3 (ENG-304)",
    building: "Faculty of Engineering Building",
    dayOfWeek: "Monday",
    startTimeUtc: "06:00", // 09:00 Cyprus EEST (UTC+3)
    endTimeUtc: "07:50",   // 10:50 Cyprus EEST (UTC+3)
    modality: "On-Campus",
  },
  {
    id: "SCH-2",
    courseCode: "SENG202",
    courseTitle: "Database Management & Distributed Stores",
    facultyName: "Assoc. Prof. Can Özdemir",
    classroom: "Amphitheatre Blue (AMPHI-B)",
    building: "Central Lecture Complex",
    dayOfWeek: "Tuesday",
    startTimeUtc: "08:00", // 11:00 Cyprus EEST (UTC+3)
    endTimeUtc: "09:50",   // 12:50 Cyprus EEST (UTC+3)
    modality: "Hybrid",
    meetingUrl: "https://meet.cau.edu.tr/seng202-lecture",
  },
  {
    id: "SCH-3",
    courseCode: "MATH201",
    courseTitle: "Linear Algebra & Vector Spaces",
    facultyName: "Prof. Mehmet Kaya",
    classroom: "Room 102 (SCI-102)",
    building: "Science & Arts Hall",
    dayOfWeek: "Wednesday",
    startTimeUtc: "07:00", // 10:00 Cyprus EEST (UTC+3)
    endTimeUtc: "08:50",   // 11:50 Cyprus EEST (UTC+3)
    modality: "On-Campus",
  },
  {
    id: "SCH-4",
    courseCode: "SENG305",
    courseTitle: "Web Applications & Cyber Security",
    facultyName: "Dr. Michael Chen",
    classroom: "Cyber Security Sandbox (CS-201)",
    building: "Innovation & Robotics Centre",
    dayOfWeek: "Thursday",
    startTimeUtc: "10:00", // 13:00 Cyprus EEST (UTC+3)
    endTimeUtc: "11:50",   // 14:50 Cyprus EEST (UTC+3)
    modality: "On-Campus",
  },
  {
    id: "SCH-5",
    courseCode: "SENG390",
    courseTitle: "Software Capstone Colloquium",
    facultyName: "Dr. Elif Yılmaz",
    classroom: "Conference Room Alpha",
    building: "Rectorate Wing A",
    dayOfWeek: "Friday",
    startTimeUtc: "06:30", // 09:30 Cyprus EEST (UTC+3)
    endTimeUtc: "08:00",   // 11:00 Cyprus EEST (UTC+3)
    modality: "Online Sync",
    meetingUrl: "https://meet.cau.edu.tr/capstone-colloquium",
  },
];

export const SEED_FACULTY_ROSTER: RosterStudent[] = [
  {
    studentId: "20231089",
    maskedStudentId: maskStudentId("20231089"),
    fullName: "Alexander M. Vance",
    email: "alexander.vance@student.cau.edu.tr",
    maskedEmail: maskEmail("alexander.vance@student.cau.edu.tr"),
    program: "B.Sc. Software Engineering",
    term: "Year 3 - Semester 5",
    attendanceRate: 95,
    midtermScore: 92,
    finalScore: 94,
    projectScore: 98,
    computedLetterGrade: "A",
  },
  {
    studentId: "20231045",
    maskedStudentId: maskStudentId("20231045"),
    fullName: "Fatima Al-Mansoor",
    email: "fatima.mansoor@student.cau.edu.tr",
    maskedEmail: maskEmail("fatima.mansoor@student.cau.edu.tr"),
    program: "B.Sc. Software Engineering",
    term: "Year 3 - Semester 5",
    attendanceRate: 98,
    midtermScore: 95,
    finalScore: 97,
    projectScore: 96,
    computedLetterGrade: "A",
  },
  {
    studentId: "20231102",
    maskedStudentId: maskStudentId("20231102"),
    fullName: "Dmitri Volkov",
    email: "dmitri.volkov@student.cau.edu.tr",
    maskedEmail: maskEmail("dmitri.volkov@student.cau.edu.tr"),
    program: "B.Sc. Computer Engineering",
    term: "Year 3 - Semester 5",
    attendanceRate: 88,
    midtermScore: 78,
    finalScore: 84,
    projectScore: 82,
    computedLetterGrade: "B+",
  },
  {
    studentId: "20231215",
    maskedStudentId: maskStudentId("20231215"),
    fullName: "Amina Adeleke",
    email: "amina.adeleke@student.cau.edu.tr",
    maskedEmail: maskEmail("amina.adeleke@student.cau.edu.tr"),
    program: "B.Sc. Software Engineering",
    term: "Year 3 - Semester 5",
    attendanceRate: 92,
    midtermScore: 89,
    finalScore: 91,
    projectScore: 93,
    computedLetterGrade: "A-",
  },
  {
    studentId: "20231077",
    maskedStudentId: maskStudentId("20231077"),
    fullName: "Burak Yılmaz",
    email: "burak.yilmaz@student.cau.edu.tr",
    maskedEmail: maskEmail("burak.yilmaz@student.cau.edu.tr"),
    program: "B.Sc. Information Systems",
    term: "Year 3 - Semester 5",
    attendanceRate: 74,
    midtermScore: 58,
    finalScore: 64,
    projectScore: 70,
    computedLetterGrade: "C",
  },
];

export const SEED_FACULTY_COURSES: FacultyCourse[] = [
  {
    id: "FC-301",
    courseCode: "SENG301",
    courseTitle: "Software Architecture & Cloud Systems",
    department: "Department of Software Engineering",
    semester: "Fall 2026",
    enrolledStudentsCount: 38,
    maxCapacity: 45,
    schedule: "Mon 09:00 - 10:50, Wed 14:00 - 15:50",
    room: "Tech Lab 3 (ENG-304)",
  },
  {
    id: "FC-201",
    courseCode: "SENG201",
    courseTitle: "Object-Oriented Programming & Data Structures",
    department: "Department of Software Engineering",
    semester: "Fall 2026",
    enrolledStudentsCount: 62,
    maxCapacity: 70,
    schedule: "Tue 10:00 - 11:50, Thu 10:00 - 11:50",
    room: "Amphitheatre Red (AMPHI-A)",
  },
];
