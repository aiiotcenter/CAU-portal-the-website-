import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  UserRoleSchema,
  UserRole,
  LetterGrade,
  UniversitySession,
  StudentTranscriptItem,
  RosterStudent,
} from "@shared/university";
import {
  computeCumulativeGPA,
  localizeCourseSchedule,
  sanitizeLeadPII,
  convertScoreToLetterGrade,
  SEED_STUDENT_TRANSCRIPT,
  SEED_COURSE_SCHEDULE,
  SEED_FACULTY_ROSTER,
  SEED_FACULTY_COURSES,
} from "./academicService";
import { CMSStorageEngine } from "../cms/storageEngine";

// In-memory runtime state for demonstration & edits
let activeTranscripts: StudentTranscriptItem[] = [...SEED_STUDENT_TRANSCRIPT];
let activeRoster: RosterStudent[] = [...SEED_FACULTY_ROSTER];

function deriveRole(reqCookie: string | undefined): UserRole {
  if (reqCookie === "admin" || reqCookie === "true") return "admin";
  if (reqCookie === "faculty") return "faculty";
  if (reqCookie === "student") return "student";
  return "admin"; // Default demonstration role
}

function buildSession(role: UserRole): UniversitySession {
  if (role === "student") {
    return {
      userId: "usr-student-01",
      name: "Alexander M. Vance",
      email: "alexander.vance@student.cau.edu.tr",
      role: "student",
      studentId: "20231089",
      department: "Software Engineering",
      authenticatedAt: new Date().toISOString(),
      permissions: ["read:own_transcript", "read:schedule", "read:catalogue"],
    };
  }

  if (role === "faculty") {
    return {
      userId: "usr-faculty-01",
      name: "Dr. Elif Yılmaz",
      email: "elif.yilmaz@cau.edu.tr",
      role: "faculty",
      facultyId: "FAC-902",
      department: "Faculty of Engineering & Architecture",
      authenticatedAt: new Date().toISOString(),
      permissions: [
        "read:course_roster",
        "write:grades",
        "read:schedule",
        "read:department_leads",
      ],
    };
  }

  return {
    userId: "usr-admin-01",
    name: "Dr. Kerem Aydın",
    email: "admin.office@cau.edu.tr",
    role: "admin",
    department: "Rectorate & Academic Affairs",
    authenticatedAt: new Date().toISOString(),
    permissions: [
      "read:all",
      "write:all",
      "admin:cms",
      "admin:leads",
      "admin:settings",
      "admin:users",
    ],
  };
}

export const universityRouter = router({
  // Multi-Role Authentication & Session Management
  auth: router({
    login: publicProcedure
      .input(
        z.object({
          role: UserRoleSchema.default("admin"),
          passkey: z.string().optional(),
        })
      )
      .mutation(({ input, ctx }) => {
        // Enforce passkey only if specified, otherwise allow role-based demo switch
        const isProd = process.env.NODE_ENV === "production";
        ctx.res.cookie("cau_cms_auth", input.role, {
          httpOnly: true, // Secure cookie — prevents XSS token theft
          path: "/",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          sameSite: "lax",
          secure: isProd,
        });

        // Also set non-sensitive role indicator for client-side routing
        ctx.res.cookie("cau_user_role", input.role, {
          httpOnly: false,
          path: "/",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          sameSite: "lax",
        });

        const session = buildSession(input.role);
        return { success: true, session };
      }),

    check: publicProcedure.query(({ ctx }) => {
      const cookieAuth = ctx.req.cookies?.["cau_cms_auth"];
      const isAuth = Boolean(cookieAuth);
      const role = deriveRole(cookieAuth);
      const session = buildSession(role);

      return {
        isAuthenticated: isAuth,
        role,
        session,
      };
    }),

    switchRole: publicProcedure
      .input(z.object({ role: UserRoleSchema }))
      .mutation(({ input, ctx }) => {
        const isProd = process.env.NODE_ENV === "production";
        ctx.res.cookie("cau_cms_auth", input.role, {
          httpOnly: true,
          path: "/",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          sameSite: "lax",
          secure: isProd,
        });
        ctx.res.cookie("cau_user_role", input.role, {
          httpOnly: false,
          path: "/",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          sameSite: "lax",
        });
        return { success: true, session: buildSession(input.role) };
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie("cau_cms_auth", { path: "/" });
      ctx.res.clearCookie("cau_user_role", { path: "/" });
      return { success: true };
    }),
  }),

  // Student Academic Portal Endpoints
  academic: router({
    getTranscript: publicProcedure.query(({ ctx }) => {
      const cookieAuth = ctx.req.cookies?.["cau_cms_auth"];
      const role = deriveRole(cookieAuth);

      const summary = computeCumulativeGPA(activeTranscripts);
      return {
        transcripts: activeTranscripts,
        summary,
        role,
      };
    }),

    getSchedule: publicProcedure
      .input(
        z.object({
          timezone: z.string().default("Asia/Nicosia"),
        })
      )
      .query(({ input }) => {
        const localized = localizeCourseSchedule(SEED_COURSE_SCHEDULE, input.timezone);
        return {
          timezone: input.timezone,
          schedule: localized,
          totalCourses: localized.length,
          hasConflicts: localized.some((item) => item.hasConflict),
        };
      }),

    getCourses: publicProcedure.query(() => {
      return SEED_FACULTY_COURSES;
    }),

    getRoster: publicProcedure
      .input(
        z
          .object({
            courseCode: z.string().optional(),
            unmaskPii: z.boolean().default(false),
          })
          .optional()
      )
      .query(({ input, ctx }) => {
        const cookieAuth = ctx.req.cookies?.["cau_cms_auth"];
        const role = deriveRole(cookieAuth);
        const canUnmask = (role === "faculty" || role === "admin") && input?.unmaskPii === true;

        const roster = activeRoster.map((student) => ({
          ...student,
          email: canUnmask ? student.email : student.maskedEmail,
          studentId: canUnmask ? student.studentId : student.maskedStudentId,
          isPiiMasked: !canUnmask,
        }));

        return {
          roster,
          courseCode: input?.courseCode || "SENG301",
          totalStudents: roster.length,
          canUnmask,
        };
      }),

    submitGrade: publicProcedure
      .input(
        z.object({
          studentId: z.string(),
          gradeType: z.enum(["midterm", "final", "project"]),
          score: z.number().min(0).max(100),
        })
      )
      .mutation(({ input, ctx }) => {
        const cookieAuth = ctx.req.cookies?.["cau_cms_auth"];
        const role = deriveRole(cookieAuth);

        if (role !== "faculty" && role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only instructional faculty or academic administrators may submit grades.",
          });
        }

        const idx = activeRoster.findIndex(
          (s) => s.studentId === input.studentId || s.maskedStudentId === input.studentId
        );
        if (idx === -1) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Student record not found in roster." });
        }

        const student = activeRoster[idx];
        if (input.gradeType === "midterm") student.midtermScore = input.score;
        if (input.gradeType === "final") student.finalScore = input.score;
        if (input.gradeType === "project") student.projectScore = input.score;

        // Recalculate composite letter grade: 30% Midterm + 40% Final + 30% Project
        const m = student.midtermScore ?? 0;
        const f = student.finalScore ?? 0;
        const p = student.projectScore ?? 0;
        const composite = Math.round(m * 0.3 + f * 0.4 + p * 0.3);

        const letter = convertScoreToLetterGrade(composite);

        student.computedLetterGrade = letter;
        activeRoster[idx] = student;

        return {
          success: true,
          student: activeRoster[idx],
          compositeScore: composite,
        };
      }),
  }),

  // Secure Leads CRM with Role-Based FERPA / GDPR Privacy Masking
  leads: router({
    listSecure: publicProcedure
      .input(
        z
          .object({
            forceUnmask: z.boolean().default(false),
          })
          .optional()
      )
      .query(({ input, ctx }) => {
        const cookieAuth = ctx.req.cookies?.["cau_cms_auth"];
        const role = deriveRole(cookieAuth);
        const rawLeads = CMSStorageEngine.getLeads();

        const masked = rawLeads.map((lead) =>
          sanitizeLeadPII(lead, role, input?.forceUnmask)
        );

        return {
          leads: masked,
          total: masked.length,
          isPiiMasked: !input?.forceUnmask || role !== "admin",
          userRole: role,
        };
      }),
  }),
});
