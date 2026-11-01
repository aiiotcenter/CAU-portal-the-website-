import { z } from "zod";

/**
 * University Role-Based Access Control (RBAC) definitions.
 * Higher education systems require distinct privilege tiers:
 * - admin: Full institutional control, catalog publishing, CRM leads, CMS settings.
 * - faculty: Academic roster management, grading, syllabus, departmental notices.
 * - student: Degree progress, transcript audits, schedule with timezone safety, billing.
 */
export const UserRoleSchema = z.enum(["admin", "faculty", "student"]);
export type UserRole = z.infer<typeof UserRoleSchema>;

/**
 * Standard Letter Grade scale following Turkish & Cypriot Higher Education Council (YÖK/YÖDAK)
 * and European Credit Transfer and Accumulation System (ECTS) conventions.
 */
export const LetterGradeSchema = z.enum([
  "A",   // 4.00 - Excellent
  "A-",  // 3.70 - Very Good
  "B+",  // 3.30 - Good
  "B",   // 3.00 - Good
  "B-",  // 2.70 - Satisfactory
  "C+",  // 2.30 - Satisfactory
  "C",   // 2.00 - Passing
  "C-",  // 1.70 - Conditional Pass
  "D+",  // 1.30 - Conditional Pass
  "D",   // 1.00 - Conditional Pass
  "F",   // 0.00 - Failing
  "W",   // Withdrawn (Excluded from GPA)
  "P",   // Pass / Non-credit (Excluded from GPA)
  "I",   // Incomplete (Excluded from GPA until resolved)
]);
export type LetterGrade = z.infer<typeof LetterGradeSchema>;

export const CourseStatusSchema = z.enum(["Completed", "In Progress", "Withdrawn", "Registered"]);
export type CourseStatus = z.infer<typeof CourseStatusSchema>;

/**
 * Academic Standing classification based on cumulative GPA.
 */
export const AcademicStandingSchema = z.enum([
  "High Honors",
  "Dean's List",
  "Good Standing",
  "Academic Warning",
  "Academic Probation",
  "Not Computed",
]);
export type AcademicStanding = z.infer<typeof AcademicStandingSchema>;

/**
 * Single Course Transcript Record schema.
 */
export const StudentTranscriptItemSchema = z.object({
  id: z.string(),
  courseCode: z.string().min(2),
  courseName: z.string().min(2),
  credits: z.number().int().positive(),
  ectsCredits: z.number().int().positive().default(6),
  term: z.string(),
  numericGrade: z.number().min(0).max(100).nullable(),
  letterGrade: LetterGradeSchema,
  status: CourseStatusSchema,
  instructor: z.string().optional(),
});
export type StudentTranscriptItem = z.infer<typeof StudentTranscriptItemSchema>;

/**
 * Term / Semester GPA Summary Record.
 */
export const TermSummarySchema = z.object({
  term: z.string(),
  creditsAttempted: z.number().nonnegative(),
  creditsEarned: z.number().nonnegative(),
  ectsCreditsAttempted: z.number().nonnegative().default(0),
  ectsCreditsEarned: z.number().nonnegative().default(0),
  gpa: z.number().min(0).max(4.0),
  ectsGpa: z.number().min(0).max(4.0).default(0),
  academicStanding: AcademicStandingSchema,
  courseCount: z.number().int().nonnegative(),
});
export type TermSummary = z.infer<typeof TermSummarySchema>;

/**
 * Validated Cumulative Transcript Audit Summary.
 */
export const TranscriptSummarySchema = z.object({
  studentId: z.string(),
  studentName: z.string(),
  program: z.string(),
  faculty: z.string(),
  catalogYear: z.string(),
  creditsAttempted: z.number().nonnegative(),
  creditsEarned: z.number().nonnegative(),
  totalDegreeCredits: z.number().positive().default(120),
  completionPercentage: z.number().min(0).max(100),
  gpa: z.number().min(0).max(4.0),
  academicStanding: AcademicStandingSchema,
  calculatedAt: z.string(),
  ectsCreditsAttempted: z.number().nonnegative().default(0),
  ectsCreditsEarned: z.number().nonnegative().default(0),
  ectsGpa: z.number().min(0).max(4.0).default(0),
  termSummaries: z.array(TermSummarySchema).optional(),
});
export type TranscriptSummary = z.infer<typeof TranscriptSummarySchema>;

/**
 * Class Modality for Higher-Ed portals.
 */
export const ClassModalitySchema = z.enum(["On-Campus", "Hybrid", "Online Sync", "Online Async"]);
export type ClassModality = z.infer<typeof ClassModalitySchema>;

export const DayOfWeekSchema = z.enum([
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]);
export type DayOfWeek = z.infer<typeof DayOfWeekSchema>;

/**
 * Course Schedule specification in canonical UTC.
 */
export const CourseScheduleItemSchema = z.object({
  id: z.string(),
  courseCode: z.string(),
  courseTitle: z.string(),
  facultyName: z.string(),
  classroom: z.string(),
  building: z.string(),
  dayOfWeek: DayOfWeekSchema,
  startTimeUtc: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Must be HH:MM in 24h UTC"),
  endTimeUtc: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Must be HH:MM in 24h UTC"),
  modality: ClassModalitySchema,
  meetingUrl: z.string().url().optional(),
});
export type CourseScheduleItem = z.infer<typeof CourseScheduleItemSchema>;

/**
 * Localized schedule rendered according to student/faculty timezone preference.
 */
export const LocalizedScheduleItemSchema = CourseScheduleItemSchema.extend({
  localStartTime: z.string(),
  localEndTime: z.string(),
  targetTimezone: z.string(),
  hasConflict: z.boolean().default(false),
  campusStartTime: z.string(),
  campusEndTime: z.string(),
});
export type LocalizedScheduleItem = z.infer<typeof LocalizedScheduleItemSchema>;

/**
 * Student roster entry for Faculty view with FERPA/GDPR masking support.
 */
export const RosterStudentSchema = z.object({
  studentId: z.string(),
  maskedStudentId: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  maskedEmail: z.string(),
  program: z.string(),
  term: z.string(),
  attendanceRate: z.number().min(0).max(100),
  midtermScore: z.number().min(0).max(100).nullable(),
  finalScore: z.number().min(0).max(100).nullable(),
  projectScore: z.number().min(0).max(100).nullable(),
  computedLetterGrade: LetterGradeSchema.nullable(),
});
export type RosterStudent = z.infer<typeof RosterStudentSchema>;

/**
 * Faculty course assignment.
 */
export const FacultyCourseSchema = z.object({
  id: z.string(),
  courseCode: z.string(),
  courseTitle: z.string(),
  department: z.string(),
  semester: z.string(),
  enrolledStudentsCount: z.number().int().nonnegative(),
  maxCapacity: z.number().int().positive(),
  schedule: z.string(),
  room: z.string(),
  syllabusUrl: z.string().optional(),
});
export type FacultyCourse = z.infer<typeof FacultyCourseSchema>;

/**
 * Lead item with FERPA/GDPR privacy sanitization metadata.
 */
export const MaskedLeadItemSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string(),
  maskedEmail: z.string(),
  phone: z.string(),
  maskedPhone: z.string(),
  country: z.string(),
  programOfInterest: z.string(),
  degreeLevel: z.string(),
  status: z.enum(["New", "Contacted", "Offer Sent", "Enrolled", "Closed"]),
  source: z.string(),
  notes: z.string().optional(),
  createdAt: z.string(),
  isPiiMasked: z.boolean(),
});
export type MaskedLeadItem = z.infer<typeof MaskedLeadItemSchema>;

/**
 * Standard Authenticated University Session.
 */
export const UniversitySessionSchema = z.object({
  userId: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: UserRoleSchema,
  department: z.string().optional(),
  studentId: z.string().optional(),
  facultyId: z.string().optional(),
  authenticatedAt: z.string(),
  permissions: z.array(z.string()),
});
export type UniversitySession = z.infer<typeof UniversitySessionSchema>;

/**
 * FERPA / GDPR Privacy Masking Utilities.
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

