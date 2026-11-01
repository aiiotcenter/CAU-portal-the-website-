import { describe, it, expect } from "vitest";
import {
  computeCumulativeGPA,
  computeTermSummaries,
  calculateRequiredGPA,
  projectFutureGPA,
  convertScoreToLetterGrade,
  determineAcademicStanding,
  normalizeLetterGrade,
  roundGpa,
  convertUtcToTargetTime,
  localizeCourseSchedule,
  maskEmail,
  maskPhone,
  maskStudentId,
  sanitizeLeadPII,
  GRADE_POINT_MAP,
  isGradeEarned,
} from "./academicService";
import {
  StudentTranscriptItem,
  StudentTranscriptItemSchema,
  TranscriptSummarySchema,
  TermSummarySchema,
  CourseScheduleItem,
} from "@shared/university";
import type { LeadItem } from "../cms/storageEngine";

describe("Academic Service — Core GPA Computation Engine", () => {
  it("computes GPA correctly for standard passed courses and awards High Honors when GPA >= 3.50 (CAU Handbook)", () => {
    const transcripts: StudentTranscriptItem[] = [
      {
        id: "1",
        courseCode: "CS101",
        courseName: "Intro CS",
        credits: 4,
        ectsCredits: 6,
        term: "Fall 2024",
        numericGrade: 95,
        letterGrade: "A", // 4.0 -> 16 points
        status: "Completed",
      },
      {
        id: "2",
        courseCode: "MATH101",
        courseName: "Calculus",
        credits: 4,
        ectsCredits: 6,
        term: "Fall 2024",
        numericGrade: 85,
        letterGrade: "B", // 3.0 -> 12 points
        status: "Completed",
      },
    ];

    // (16 + 12) / 8 = 28 / 8 = 3.50
    // Per CAU Handbook: High Honor is 3.50 - 4.00
    const summary = computeCumulativeGPA(transcripts);
    expect(summary.creditsAttempted).toBe(8);
    expect(summary.creditsEarned).toBe(8);
    expect(summary.gpa).toBe(3.5);
    expect(summary.academicStanding).toBe("High Honors");
  });

  it("awards Dean's List (Honor) when 3.00 <= GPA < 3.50 per CAU Handbook", () => {
    // 4 credits of B+ (3.3 -> 13.2) + 4 credits of B (3.0 -> 12.0) = 25.2 / 8 = 3.15 GPA
    const transcripts: StudentTranscriptItem[] = [
      {
        id: "1",
        courseCode: "SENG101",
        courseName: "Intro SE",
        credits: 4,
        ectsCredits: 6,
        term: "Fall 2024",
        numericGrade: 82,
        letterGrade: "B+",
        status: "Completed",
      },
      {
        id: "2",
        courseCode: "MATH101",
        courseName: "Calculus I",
        credits: 4,
        ectsCredits: 6,
        term: "Fall 2024",
        numericGrade: 78,
        letterGrade: "B",
        status: "Completed",
      },
    ];

    const summary = computeCumulativeGPA(transcripts);
    expect(summary.creditsAttempted).toBe(8);
    expect(summary.creditsEarned).toBe(8);
    expect(summary.gpa).toBe(3.15);
    expect(summary.academicStanding).toBe("Dean's List");
  });

  it("awards Good Standing when 2.00 <= GPA < 3.00", () => {
    // 3 credits of C+ (2.3 -> 6.9) + 3 credits of C (2.0 -> 6.0) = 12.9 / 6 = 2.15 GPA
    const transcripts: StudentTranscriptItem[] = [
      {
        id: "1",
        courseCode: "PHYS101",
        courseName: "Physics",
        credits: 3,
        ectsCredits: 5,
        term: "Fall 2024",
        numericGrade: 67,
        letterGrade: "C+",
        status: "Completed",
      },
      {
        id: "2",
        courseCode: "HIST101",
        courseName: "History",
        credits: 3,
        ectsCredits: 5,
        term: "Fall 2024",
        numericGrade: 62,
        letterGrade: "C",
        status: "Completed",
      },
    ];

    const summary = computeCumulativeGPA(transcripts);
    expect(summary.gpa).toBe(2.15);
    expect(summary.academicStanding).toBe("Good Standing");
  });

  it("awards Academic Warning when 1.70 <= GPA < 2.00", () => {
    // 3 credits of C- (1.7 -> 5.1) + 3 credits of C (2.0 -> 6.0) = 11.1 / 6 = 1.85 GPA
    const transcripts: StudentTranscriptItem[] = [
      {
        id: "1",
        courseCode: "CHEM101",
        courseName: "General Chemistry",
        credits: 3,
        ectsCredits: 4,
        term: "Fall 2024",
        numericGrade: 57,
        letterGrade: "C-",
        status: "Completed",
      },
      {
        id: "2",
        courseCode: "MATH101",
        courseName: "Calculus",
        credits: 3,
        ectsCredits: 5,
        term: "Fall 2024",
        numericGrade: 62,
        letterGrade: "C",
        status: "Completed",
      },
    ];

    const summary = computeCumulativeGPA(transcripts);
    expect(summary.gpa).toBe(1.85);
    expect(summary.academicStanding).toBe("Academic Warning");
  });

  it("awards Academic Probation when GPA < 1.70", () => {
    // 4 credits of F (0.0) + 4 credits of D (1.0 -> 4.0) = 4.0 / 8 = 0.50 GPA
    const transcripts: StudentTranscriptItem[] = [
      {
        id: "1",
        courseCode: "MATH101",
        courseName: "Calculus I",
        credits: 4,
        ectsCredits: 6,
        term: "Fall 2024",
        numericGrade: 30,
        letterGrade: "F",
        status: "Completed",
      },
      {
        id: "2",
        courseCode: "PHYS101",
        courseName: "Physics",
        credits: 4,
        ectsCredits: 6,
        term: "Fall 2024",
        numericGrade: 48,
        letterGrade: "D",
        status: "Completed",
      },
    ];

    const summary = computeCumulativeGPA(transcripts);
    expect(summary.gpa).toBe(0.5);
    expect(summary.academicStanding).toBe("Academic Probation");
    expect(summary.creditsEarned).toBe(4); // Only the D earned credits
  });

  it("handles empty or null transcripts gracefully without division-by-zero", () => {
    const summaryEmpty = computeCumulativeGPA([]);
    expect(summaryEmpty.creditsAttempted).toBe(0);
    expect(summaryEmpty.creditsEarned).toBe(0);
    expect(summaryEmpty.gpa).toBe(0);
    expect(summaryEmpty.academicStanding).toBe("Not Computed");

    const summaryNull = computeCumulativeGPA(null as any);
    expect(summaryNull.creditsAttempted).toBe(0);
    expect(summaryNull.gpa).toBe(0);
    expect(summaryNull.academicStanding).toBe("Not Computed");
  });

  it("correctly excludes Withdrawn ('W') and Pass ('P') courses from GPA denominator", () => {
    const transcripts: StudentTranscriptItem[] = [
      {
        id: "1",
        courseCode: "ENG101",
        courseName: "English",
        credits: 3,
        ectsCredits: 4,
        term: "Fall 2024",
        numericGrade: 88,
        letterGrade: "B+", // 3.3 -> 9.9
        status: "Completed",
      },
      {
        id: "2",
        courseCode: "CAU100",
        courseName: "Orientation",
        credits: 1,
        ectsCredits: 2,
        term: "Fall 2024",
        numericGrade: 100,
        letterGrade: "P", // Pass -> credits earned, but excluded from GPA
        status: "Completed",
      },
      {
        id: "3",
        courseCode: "PHYS101",
        courseName: "Physics",
        credits: 4,
        ectsCredits: 6,
        term: "Fall 2024",
        numericGrade: null,
        letterGrade: "W", // Withdrawn -> excluded completely
        status: "Withdrawn",
      },
    ];

    // Graded: 3 credits of B+ (9.9 points) / 3 credits = 3.30
    // Attempted credits = 3
    // Earned credits = 3 (ENG101) + 1 (CAU100) = 4
    const summary = computeCumulativeGPA(transcripts);
    expect(summary.creditsAttempted).toBe(3);
    expect(summary.creditsEarned).toBe(4);
    expect(summary.gpa).toBe(3.3);
  });

  it("excludes courses with status 'Withdrawn' even if a letter grade is accidentally present", () => {
    const transcripts: StudentTranscriptItem[] = [
      {
        id: "1",
        courseCode: "MATH101",
        courseName: "Calculus",
        credits: 4,
        ectsCredits: 6,
        term: "Fall 2024",
        numericGrade: 90,
        letterGrade: "A",
        status: "Completed",
      },
      {
        id: "2",
        courseCode: "PHYS101",
        courseName: "Physics",
        credits: 4,
        ectsCredits: 6,
        term: "Fall 2024",
        numericGrade: 50,
        letterGrade: "D",
        status: "Withdrawn", // Withdrawn status overrides letter grade
      },
    ];

    const summary = computeCumulativeGPA(transcripts);
    expect(summary.creditsAttempted).toBe(4);
    expect(summary.creditsEarned).toBe(4);
    expect(summary.gpa).toBe(4.0);
  });

  it("includes Failed ('F') courses in attempted credits and quality points (0.0)", () => {
    const transcripts: StudentTranscriptItem[] = [
      {
        id: "1",
        courseCode: "MATH101",
        courseName: "Calculus I",
        credits: 4,
        ectsCredits: 6,
        term: "Fall 2024",
        numericGrade: 35,
        letterGrade: "F", // 0.0 points
        status: "Completed",
      },
      {
        id: "2",
        courseCode: "SENG101",
        courseName: "Intro SE",
        credits: 4,
        ectsCredits: 6,
        term: "Fall 2024",
        numericGrade: 75,
        letterGrade: "C", // 2.0 -> 8.0 points
        status: "Completed",
      },
    ];

    // (0 + 8.0) / 8 = 1.00 GPA -> Academic Probation
    const summary = computeCumulativeGPA(transcripts);
    expect(summary.creditsAttempted).toBe(8);
    expect(summary.creditsEarned).toBe(4); // Only the C is earned
    expect(summary.gpa).toBe(1.0);
    expect(summary.academicStanding).toBe("Academic Probation");
  });

  it("guards against floating point precision anomalies using Number.EPSILON", () => {
    // 3 credits of B- (2.7) = 8.1
    // 3 credits of C+ (2.3) = 6.9
    // Total points = 15.0 / 6 = 2.50
    const transcripts: StudentTranscriptItem[] = [
      {
        id: "1",
        courseCode: "COURSE1",
        courseName: "Course 1",
        credits: 3,
        ectsCredits: 5,
        term: "Spring 2025",
        numericGrade: 73,
        letterGrade: "B-",
        status: "Completed",
      },
      {
        id: "2",
        courseCode: "COURSE2",
        courseName: "Course 2",
        credits: 3,
        ectsCredits: 5,
        term: "Spring 2025",
        numericGrade: 68,
        letterGrade: "C+",
        status: "Completed",
      },
    ];

    const summary = computeCumulativeGPA(transcripts);
    expect(summary.gpa).toBe(2.5);
    expect(typeof summary.gpa).toBe("number");
  });

  it("normalizes lowercase letter grades, whitespace, and prevents NaN corruption", () => {
    const transcripts: StudentTranscriptItem[] = [
      {
        id: "1",
        courseCode: "CS101",
        courseName: "Computer Science",
        credits: 4,
        ectsCredits: 6,
        term: "Fall 2024",
        numericGrade: 95,
        letterGrade: " a " as any,
        status: "Completed",
      },
      {
        id: "2",
        courseCode: "MATH101",
        courseName: "Calculus",
        credits: 4,
        ectsCredits: 6,
        term: "Fall 2024",
        numericGrade: 83,
        letterGrade: "b+" as any,
        status: "Completed",
      },
    ];

    // (4.0 * 4 + 3.3 * 4) / 8 = (16 + 13.2) / 8 = 29.2 / 8 = 3.65
    const summary = computeCumulativeGPA(transcripts);
    expect(isNaN(summary.gpa)).toBe(false);
    expect(summary.gpa).toBe(3.65);
    expect(summary.academicStanding).toBe("High Honors");
  });

  it("computes dual institutional and ECTS credit-weighted GPA", () => {
    // Course 1: local 4 credits, ECTS 8 credits, grade A (4.0)
    // Course 2: local 2 credits, ECTS 2 credits, grade C (2.0)
    // Local GPA: (4*4.0 + 2*2.0) / 6 = 20 / 6 = 3.33
    // ECTS GPA: (8*4.0 + 2*2.0) / 10 = 36 / 10 = 3.60
    const transcripts: StudentTranscriptItem[] = [
      {
        id: "1",
        courseCode: "BIG_PROJECT",
        courseName: "Senior Capstone",
        credits: 4,
        ectsCredits: 8,
        term: "Spring 2025",
        numericGrade: 92,
        letterGrade: "A",
        status: "Completed",
      },
      {
        id: "2",
        courseCode: "LAB",
        courseName: "Practical Lab",
        credits: 2,
        ectsCredits: 2,
        term: "Spring 2025",
        numericGrade: 62,
        letterGrade: "C",
        status: "Completed",
      },
    ];

    const summary = computeCumulativeGPA(transcripts);
    expect(summary.gpa).toBe(3.33);
    expect(summary.ectsGpa).toBe(3.6);
    expect(summary.ectsCreditsAttempted).toBe(10);
    expect(summary.ectsCreditsEarned).toBe(10);
  });

  it("correctly implements course retake policy (replaces prior failed attempt)", () => {
    // Student takes MATH101 in Fall 2024 and fails (F, 4 credits, 0 points)
    // Student retakes MATH101 in Spring 2025 and passes (A, 4 credits, 16 points)
    const transcripts: StudentTranscriptItem[] = [
      {
        id: "1",
        courseCode: "MATH101",
        courseName: "Calculus I",
        credits: 4,
        ectsCredits: 6,
        term: "Fall 2024",
        numericGrade: 32,
        letterGrade: "F",
        status: "Completed",
      },
      {
        id: "2",
        courseCode: "MATH101",
        courseName: "Calculus I",
        credits: 4,
        ectsCredits: 6,
        term: "Spring 2025",
        numericGrade: 94,
        letterGrade: "A",
        status: "Completed",
      },
    ];

    // Under default repeatPolicy: "latest", the second attempt replaces the first
    const summary = computeCumulativeGPA(transcripts);
    expect(summary.creditsAttempted).toBe(4); // Not 8!
    expect(summary.creditsEarned).toBe(4);
    expect(summary.gpa).toBe(4.0);
    expect(summary.academicStanding).toBe("High Honors");

    // Under repeatPolicy: "all", both attempts are kept
    const summaryAll = computeCumulativeGPA(transcripts, { repeatPolicy: "all" });
    expect(summaryAll.creditsAttempted).toBe(8);
    expect(summaryAll.gpa).toBe(2.0);
  });

  it("can exclude in-progress courses from completed cumulative GPA audit", () => {
    const transcripts: StudentTranscriptItem[] = [
      {
        id: "1",
        courseCode: "COMPLETED1",
        courseName: "Done Course",
        credits: 3,
        ectsCredits: 5,
        term: "Fall 2024",
        numericGrade: 85,
        letterGrade: "B",
        status: "Completed",
      },
      {
        id: "2",
        courseCode: "IN_PROGRESS",
        courseName: "Current Course",
        credits: 3,
        ectsCredits: 5,
        term: "Spring 2025",
        numericGrade: 95,
        letterGrade: "A",
        status: "In Progress",
      },
    ];

    const summary = computeCumulativeGPA(transcripts, { includeInProgress: false });
    expect(summary.creditsAttempted).toBe(3);
    expect(summary.creditsEarned).toBe(3);
    expect(summary.gpa).toBe(3.0);
  });
});

describe("Numerical Grade to Letter Grade Conversion (convertScoreToLetterGrade)", () => {
  it("converts score ranges to appropriate LetterGrade including D+", () => {
    // A: 90 - 100
    expect(convertScoreToLetterGrade(100)).toBe("A");
    expect(convertScoreToLetterGrade(90)).toBe("A");

    // A-: 85 - 89
    expect(convertScoreToLetterGrade(89)).toBe("A-");
    expect(convertScoreToLetterGrade(85)).toBe("A-");

    // B+: 80 - 84
    expect(convertScoreToLetterGrade(84)).toBe("B+");
    expect(convertScoreToLetterGrade(80)).toBe("B+");

    // B: 75 - 79
    expect(convertScoreToLetterGrade(79)).toBe("B");
    expect(convertScoreToLetterGrade(75)).toBe("B");

    // B-: 70 - 74
    expect(convertScoreToLetterGrade(74)).toBe("B-");
    expect(convertScoreToLetterGrade(70)).toBe("B-");

    // C+: 65 - 69
    expect(convertScoreToLetterGrade(69)).toBe("C+");
    expect(convertScoreToLetterGrade(65)).toBe("C+");

    // C: 60 - 64
    expect(convertScoreToLetterGrade(64)).toBe("C");
    expect(convertScoreToLetterGrade(60)).toBe("C");

    // C-: 55 - 59
    expect(convertScoreToLetterGrade(59)).toBe("C-");
    expect(convertScoreToLetterGrade(55)).toBe("C-");

    // D+: 50 - 54 (1.30 quality points — Fixed missing grade bug)
    expect(convertScoreToLetterGrade(54)).toBe("D+");
    expect(convertScoreToLetterGrade(52)).toBe("D+");
    expect(convertScoreToLetterGrade(50)).toBe("D+");

    // D: 45 - 49 (1.00 quality point)
    expect(convertScoreToLetterGrade(49)).toBe("D");
    expect(convertScoreToLetterGrade(45)).toBe("D");

    // F: Below 45
    expect(convertScoreToLetterGrade(44)).toBe("F");
    expect(convertScoreToLetterGrade(20)).toBe("F");
    expect(convertScoreToLetterGrade(0)).toBe("F");
  });

  it("handles decimal scores and rounding boundaries cleanly", () => {
    expect(convertScoreToLetterGrade(89.6)).toBe("A"); // rounds to 90
    expect(convertScoreToLetterGrade(84.5)).toBe("A-"); // rounds to 85
    expect(convertScoreToLetterGrade(49.6)).toBe("D+"); // rounds to 50
    expect(convertScoreToLetterGrade(44.5)).toBe("D"); // rounds to 45
  });
});

describe("Credit Recognition & Passing Grade Helper (isGradeEarned)", () => {
  it("recognizes institutional passing grades (A through D, D+, C-, and P)", () => {
    expect(isGradeEarned("A")).toBe(true);
    expect(isGradeEarned("B+")).toBe(true);
    expect(isGradeEarned("C-")).toBe(true);
    expect(isGradeEarned("D+")).toBe(true);
    expect(isGradeEarned("D")).toBe(true);
    expect(isGradeEarned("P")).toBe(true);
  });

  it("returns false for non-earned / failing / incomplete grades", () => {
    expect(isGradeEarned("F")).toBe(false);
    expect(isGradeEarned("W")).toBe(false);
    expect(isGradeEarned("I")).toBe(false);
    expect(isGradeEarned("")).toBe(false);
  });
});

describe("Term-by-Term SGPA Summaries (computeTermSummaries)", () => {
  it("breaks down GPA and credits by academic term", () => {
    const transcripts: StudentTranscriptItem[] = [
      {
        id: "1",
        courseCode: "CS101",
        courseName: "CS 1",
        credits: 4,
        ectsCredits: 6,
        term: "Fall 2024",
        numericGrade: 95,
        letterGrade: "A",
        status: "Completed",
      },
      {
        id: "2",
        courseCode: "MATH101",
        courseName: "Calculus",
        credits: 4,
        ectsCredits: 6,
        term: "Fall 2024",
        numericGrade: 85,
        letterGrade: "B",
        status: "Completed",
      },
      {
        id: "3",
        courseCode: "SENG201",
        courseName: "OOP",
        credits: 4,
        ectsCredits: 6,
        term: "Spring 2025",
        numericGrade: 92,
        letterGrade: "A",
        status: "Completed",
      },
    ];

    const terms = computeTermSummaries(transcripts);
    expect(terms.length).toBe(2);

    const fall = terms.find((t) => t.term === "Fall 2024");
    expect(fall).toBeDefined();
    expect(fall!.creditsAttempted).toBe(8);
    expect(fall!.gpa).toBe(3.5);
    expect(fall!.academicStanding).toBe("High Honors");

    const spring = terms.find((t) => t.term === "Spring 2025");
    expect(spring).toBeDefined();
    expect(spring!.creditsAttempted).toBe(4);
    expect(spring!.gpa).toBe(4.0);
    expect(spring!.academicStanding).toBe("High Honors");
  });
});

describe("Target GPA & What-If Simulation Utilities", () => {
  it("calculates required future GPA to reach a target cumulative GPA", () => {
    // Current: 30 credits with 2.80 GPA = 84 quality points
    // Target: 3.00 CGPA across 45 credits (15 upcoming credits)
    // Target points: 45 * 3.00 = 135 points
    // Needed points: 135 - 84 = 51 points / 15 credits = 3.40 required GPA
    const result = calculateRequiredGPA(30, 2.8, 3.0, 15);
    expect(result.isAchievable).toBe(true);
    expect(result.requiredGPA).toBe(3.4);
    expect(result.message).toContain("3.40");
  });

  it("detects when target GPA is impossible within given upcoming credits (> 4.00)", () => {
    // Current: 90 credits with 2.00 GPA = 180 quality points
    // Target: 3.50 CGPA with only 15 upcoming credits
    // Target points: 105 * 3.50 = 367.5 points
    // Needed points: 367.5 - 180 = 187.5 / 15 credits = 12.50 required GPA!
    const result = calculateRequiredGPA(90, 2.0, 3.5, 15);
    expect(result.isAchievable).toBe(false);
    expect(result.requiredGPA).toBeGreaterThan(4.0);
    expect(result.message).toContain("exceeds the institutional maximum");
  });

  it("detects when target GPA is already secured", () => {
    const result = calculateRequiredGPA(60, 3.8, 3.0, 15);
    expect(result.isAchievable).toBe(true);
    expect(result.requiredGPA).toBe(0.0);
    expect(result.message).toContain("already secured");
  });

  it("projects future GPA accurately with planned courses", () => {
    const current: StudentTranscriptItem[] = [
      {
        id: "1",
        courseCode: "SENG101",
        courseName: "Intro SE",
        credits: 4,
        ectsCredits: 6,
        term: "Fall 2024",
        numericGrade: 85,
        letterGrade: "B", // 3.0 -> 12 points
        status: "Completed",
      },
    ];

    const planned = [
      { credits: 4, expectedGrade: "A" as const }, // 4.0 -> 16 points
    ];

    // (12 + 16) / 8 = 28 / 8 = 3.50 -> High Honors
    const projection = projectFutureGPA(current, planned);
    expect(projection.creditsAttempted).toBe(8);
    expect(projection.gpa).toBe(3.5);
    expect(projection.academicStanding).toBe("High Honors");
  });
});

describe("Schedule Localizer — Timezone Awareness & Conflict Detection", () => {
  it("converts canonical UTC times to campus timezone (Asia/Nicosia UTC+3)", () => {
    // 06:00 UTC -> 09:00 EEST
    expect(convertUtcToTargetTime("06:00", "Asia/Nicosia")).toBe("09:00");
    // 10:30 UTC -> 13:30 EEST
    expect(convertUtcToTargetTime("10:30", "Asia/Nicosia")).toBe("13:30");
  });

  it("converts canonical UTC times to student international timezones", () => {
    // 08:00 UTC -> London (BST UTC+1) = 09:00
    expect(convertUtcToTargetTime("08:00", "Europe/London")).toBe("09:00");
    // 08:00 UTC -> Dubai (GST UTC+4) = 12:00
    expect(convertUtcToTargetTime("08:00", "Asia/Dubai")).toBe("12:00");
    // 08:00 UTC -> Lagos (WAT UTC+1) = 09:00
    expect(convertUtcToTargetTime("08:00", "Africa/Lagos")).toBe("09:00");
  });

  it("detects schedule time conflicts on the same day", () => {
    const schedules: CourseScheduleItem[] = [
      {
        id: "1",
        courseCode: "CS101",
        courseTitle: "Intro CS",
        facultyName: "Dr. A",
        classroom: "Room 101",
        building: "Main Hall",
        dayOfWeek: "Monday",
        startTimeUtc: "07:00",
        endTimeUtc: "08:50",
        modality: "On-Campus",
      },
      {
        id: "2",
        courseCode: "MATH201",
        courseTitle: "Linear Algebra",
        facultyName: "Dr. B",
        classroom: "Room 102",
        building: "Main Hall",
        dayOfWeek: "Monday",
        startTimeUtc: "08:00", // Overlaps with CS101 (07:00 - 08:50)
        endTimeUtc: "09:50",
        modality: "On-Campus",
      },
      {
        id: "3",
        courseCode: "PHYS101",
        courseTitle: "Physics",
        facultyName: "Dr. C",
        classroom: "Room 103",
        building: "Main Hall",
        dayOfWeek: "Tuesday", // Different day -> no conflict
        startTimeUtc: "08:00",
        endTimeUtc: "09:50",
        modality: "On-Campus",
      },
    ];

    const localized = localizeCourseSchedule(schedules, "Asia/Nicosia");
    expect(localized[0].hasConflict).toBe(true);
    expect(localized[1].hasConflict).toBe(true);
    expect(localized[2].hasConflict).toBe(false);
  });
});

describe("Data Isolation & FERPA/GDPR PII Masking", () => {
  it("masks student and applicant emails properly", () => {
    expect(maskEmail("alexander.vance@student.cau.edu.tr")).toBe("a***e@student.cau.edu.tr");
    expect(maskEmail("jo@cau.edu.tr")).toBe("j***@cau.edu.tr");
    expect(maskEmail("")).toBe("***@***.com");
  });

  it("masks phone numbers properly", () => {
    expect(maskPhone("+90 533 888 1234")).toBe("+90 533 *** **34");
    expect(maskPhone("")).toBe("+*** *** ***");
  });

  it("masks student IDs properly", () => {
    expect(maskStudentId("20231089")).toBe("2023****89");
    expect(maskStudentId("12345")).toBe("1234****45");
  });

  it("sanitizes lead contact info for unprivileged views", () => {
    const rawLead: LeadItem = {
      id: "LEAD-001",
      fullName: "Tariq Mansoor",
      email: "tariq.mansoor@example.com",
      phone: "+90 533 111 2233",
      country: "Jordan",
      programOfInterest: "Software Engineering B.Sc.",
      degreeLevel: "Bachelor",
      status: "New",
      source: "Website Form",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // For faculty or unprivileged role: masked
    const masked = sanitizeLeadPII(rawLead, "faculty");
    expect(masked.isPiiMasked).toBe(true);
    expect(masked.email).toContain("***");
    expect(masked.phone).toContain("***");

    // For admin with forceUnmask=true: revealed
    const unmasked = sanitizeLeadPII(rawLead, "admin", true);
    expect(unmasked.isPiiMasked).toBe(false);
    expect(unmasked.email).toBe("tariq.mansoor@example.com");
    expect(unmasked.phone).toBe("+90 533 111 2233");
  });
});

describe("Runtime Zod Validation of Academic Entities", () => {
  it("accepts valid transcript records", () => {
    const valid = {
      id: "TR-VALID",
      courseCode: "SENG201",
      courseName: "Data Structures",
      credits: 4,
      ectsCredits: 6,
      term: "Spring 2025",
      numericGrade: 88,
      letterGrade: "B+",
      status: "Completed",
    };

    const parsed = StudentTranscriptItemSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
  });

  it("rejects invalid letter grades or negative credits", () => {
    const invalid = {
      id: "TR-INVALID",
      courseCode: "SENG201",
      courseName: "Data Structures",
      credits: -2, // Invalid
      ectsCredits: 6,
      term: "Spring 2025",
      numericGrade: 88,
      letterGrade: "Z+", // Invalid grade
      status: "Completed",
    };

    const parsed = StudentTranscriptItemSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });

  it("validates TranscriptSummary against TranscriptSummarySchema", () => {
    const transcripts: StudentTranscriptItem[] = [
      {
        id: "1",
        courseCode: "CS101",
        courseName: "Intro CS",
        credits: 4,
        ectsCredits: 6,
        term: "Fall 2024",
        numericGrade: 95,
        letterGrade: "A",
        status: "Completed",
      },
    ];

    const summary = computeCumulativeGPA(transcripts);
    const parsed = TranscriptSummarySchema.safeParse(summary);
    expect(parsed.success).toBe(true);
  });

  it("validates TermSummary against TermSummarySchema", () => {
    const transcripts: StudentTranscriptItem[] = [
      {
        id: "1",
        courseCode: "CS101",
        courseName: "Intro CS",
        credits: 4,
        ectsCredits: 6,
        term: "Fall 2024",
        numericGrade: 95,
        letterGrade: "A",
        status: "Completed",
      },
    ];

    const terms = computeTermSummaries(transcripts);
    const parsed = TermSummarySchema.safeParse(terms[0]);
    expect(parsed.success).toBe(true);
  });
});
