import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export function useAcademicPortal() {
  const utils = trpc.useUtils();
  const [selectedTimezone, setSelectedTimezone] = useState<string>("Asia/Nicosia");
  const [unmaskRosterPii, setUnmaskRosterPii] = useState<boolean>(false);
  const [unmaskLeadsPii, setUnmaskLeadsPii] = useState<boolean>(false);

  // Student Transcript & GPA Query
  const transcriptQuery = trpc.university.academic.getTranscript.useQuery(undefined, {
    staleTime: 30 * 1000,
  });

  // Timezone-Aware Schedule Query
  const scheduleQuery = trpc.university.academic.getSchedule.useQuery(
    { timezone: selectedTimezone },
    { staleTime: 30 * 1000 }
  );

  // Faculty Courses Query
  const facultyCoursesQuery = trpc.university.academic.getCourses.useQuery(undefined, {
    staleTime: 60 * 1000,
  });

  // Faculty Roster Query with FERPA PII Masking
  const rosterQuery = trpc.university.academic.getRoster.useQuery(
    { unmaskPii: unmaskRosterPii },
    { staleTime: 15 * 1000 }
  );

  // Secure Leads Query with PII Masking
  const leadsQuery = trpc.university.leads.listSecure.useQuery(
    { forceUnmask: unmaskLeadsPii },
    { staleTime: 15 * 1000 }
  );

  // Submit Grade Mutation
  const submitGradeMutation = trpc.university.academic.submitGrade.useMutation({
    onSuccess: (data) => {
      toast.success(
        `Grade submitted for ${data.student.fullName}: ${data.student.computedLetterGrade} (${data.compositeScore}%)`
      );
      utils.university.academic.getRoster.invalidate();
    },
    onError: (err) => {
      toast.error(`Grade submission error: ${err.message}`);
    },
  });

  const submitGrade = (studentId: string, gradeType: "midterm" | "final" | "project", score: number) => {
    submitGradeMutation.mutate({ studentId, gradeType, score });
  };

  return {
    // Student
    transcripts: transcriptQuery.data?.transcripts ?? [],
    summary: transcriptQuery.data?.summary ?? null,
    isTranscriptLoading: transcriptQuery.isLoading,
    refetchTranscript: transcriptQuery.refetch,

    // Schedule
    schedule: scheduleQuery.data?.schedule ?? [],
    hasConflicts: scheduleQuery.data?.hasConflicts ?? false,
    selectedTimezone,
    setSelectedTimezone,
    isScheduleLoading: scheduleQuery.isLoading,

    // Faculty
    facultyCourses: facultyCoursesQuery.data ?? [],
    isFacultyCoursesLoading: facultyCoursesQuery.isLoading,
    roster: rosterQuery.data?.roster ?? [],
    isRosterLoading: rosterQuery.isLoading,
    unmaskRosterPii,
    setUnmaskRosterPii,
    submitGrade,
    isSubmittingGrade: submitGradeMutation.isPending,

    // Leads
    leads: leadsQuery.data?.leads ?? [],
    isLeadsLoading: leadsQuery.isLoading,
    unmaskLeadsPii,
    setUnmaskLeadsPii,
    refetchLeads: leadsQuery.refetch,
  };
}
