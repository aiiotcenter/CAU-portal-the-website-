import React, { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "./DashboardLayout";
import ProgramEditorModal from "./ProgramEditorModal";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  GraduationCap,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

// ── Skeleton row ──────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr>
      <td className="py-3.5 px-4">
        <div className="ds-skeleton h-3.5 w-44 rounded mb-1.5" />
        <div className="ds-skeleton h-2.5 w-28 rounded" />
      </td>
      <td className="py-3.5 px-4"><div className="ds-skeleton h-3 w-36 rounded" /></td>
      <td className="py-3.5 px-4"><div className="ds-skeleton h-5 w-16 rounded-full" /></td>
      <td className="py-3.5 px-4"><div className="ds-skeleton h-3 w-20 rounded" /></td>
      <td className="py-3.5 px-4"><div className="ds-skeleton h-3 w-20 rounded" /></td>
      <td className="py-3.5 px-4"><div className="ds-skeleton h-5 w-14 rounded-full" /></td>
      <td className="py-3.5 px-4"><div className="ds-skeleton h-6 w-20 rounded ml-auto" /></td>
    </tr>
  );
}

const degreeFilters = [
  { label: "All Levels", value: "all" },
  { label: "Bachelor's", value: "Bachelor" },
  { label: "Master's",   value: "Master" },
  { label: "Doctorate",  value: "Ph.D." },
  { label: "Vocational", value: "Associate" },
  { label: "Prep School",value: "Preparatory" },
];

export default function ProgramsPage() {
  const [searchTerm, setSearchTerm]     = useState("");
  const [degreeFilter, setDegreeFilter] = useState("all");
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ slug: string; name: string } | null>(null);

  const { data: programs, isLoading, isError, refetch } = trpc.cms.programs.list.useQuery({
    search: searchTerm || undefined,
    degree: degreeFilter !== "all" ? degreeFilter : undefined,
  });

  const deleteMutation = trpc.cms.programs.delete.useMutation({
    onSuccess: () => {
      toast.success("Programme removed from catalogue.");
      setDeleteTarget(null);
      refetch();
    },
    onError: (err) => {
      toast.error(`Delete failed: ${err.message}`);
    },
  });

  const handleEdit   = (program: any) => { setSelectedProgram(program); setIsModalOpen(true); };
  const handleCreate = ()              => { setSelectedProgram(null);    setIsModalOpen(true); };

  // Status badge helper
  const statusBadge = (status: string | undefined) => {
    if (!status || status === "active")
      return { bg: "var(--color-success-bg)", color: "var(--color-success-fg)", border: "var(--color-success-border)", label: status ?? "Active" };
    if (status === "draft")
      return { bg: "var(--color-warning-bg)", color: "var(--color-warning-fg)", border: "var(--color-warning-border)", label: "Draft" };
    return { bg: "var(--color-error-bg)", color: "var(--color-error-fg)", border: "var(--color-error-border)", label: status };
  };

  return (
    <DashboardLayout
      title="Academic Catalog & Programmes"
      subtitle="Configure degrees, faculty structures, tuition fees, and degree requirements."
      action={
        <Button
          onClick={handleCreate}
          size="sm"
          className="text-xs h-9 font-semibold text-white"
          style={{ backgroundColor: "var(--cau-brand)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--cau-brand-hover)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--cau-brand)"; }}
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" /> Add New Programme
        </Button>
      }
    >
      <div className="space-y-5">

        {/* Error State */}
        {isError && (
          <div
            className="ds-card p-4 flex items-center gap-3 text-sm"
            style={{ backgroundColor: "var(--color-error-bg)", borderColor: "var(--color-error-border)", color: "var(--color-error-fg)" }}
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="flex-1">Failed to load programmes. Check your server connection.</span>
            <Button size="sm" variant="outline" onClick={() => refetch()} className="text-xs h-8">Retry</Button>
          </div>
        )}

        {/* Search & Filter Toolbar */}
        <div className="ds-card p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--cau-text-secondary)" }} />
            <Input
              type="text"
              placeholder="Search programmes by name, department, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {degreeFilters.map((df) => (
              <button
                key={df.value}
                onClick={() => setDegreeFilter(df.value)}
                aria-pressed={degreeFilter === df.value}
                className="ds-pill"
                style={degreeFilter === df.value ? { backgroundColor: "var(--cau-text-primary)", color: "var(--cau-surface-1)" } : undefined}
              >
                {df.label}
              </button>
            ))}
          </div>
        </div>

        {/* Programmes Table */}
        <div className="ds-card overflow-hidden">
          <div
            className="p-4 border-b flex items-center justify-between text-xs"
            style={{ borderColor: "var(--cau-border)", color: "var(--cau-text-secondary)" }}
          >
            <span>
              Showing <strong className="text-foreground font-semibold">{programs?.length ?? 0}</strong> programmes
            </span>
            <span>Live synchronized with public /programs.html discovery</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs" aria-label="Academic programmes catalogue">
              <thead
                className="text-[10px] font-bold uppercase tracking-wider border-b"
                style={{ backgroundColor: "var(--cau-surface-0)", borderColor: "var(--cau-border)", color: "var(--cau-text-secondary)" }}
              >
                <tr>
                  <th scope="col" className="py-3 px-4">Programme Name</th>
                  <th scope="col" className="py-3 px-4">Faculty &amp; School</th>
                  <th scope="col" className="py-3 px-4">Degree</th>
                  <th scope="col" className="py-3 px-4">Duration &amp; Lang</th>
                  <th scope="col" className="py-3 px-4">Tuition</th>
                  <th scope="col" className="py-3 px-4">Status</th>
                  <th scope="col" className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [1,2,3,4,5,6,7,8].map(i => <SkeletonRow key={i} />)
                ) : !programs?.length ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="ds-empty">
                        <div className="ds-empty-icon">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <p className="ds-h3 text-sm">No programmes found</p>
                        <p className="ds-caption max-w-xs">
                          {searchTerm || degreeFilter !== "all"
                            ? "Try adjusting your search or filter."
                            : "Add your first degree programme to get started."}
                        </p>
                        {!searchTerm && degreeFilter === "all" && (
                          <Button
                            size="sm"
                            className="mt-1 text-xs text-white"
                            style={{ backgroundColor: "var(--cau-brand)" }}
                            onClick={handleCreate}
                          >
                            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Programme
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  programs.map((program) => {
                    const slug = program.slug || program["Program Name"].toLowerCase().replace(/[^a-z0-9]+/g, "-");
                    const badge = statusBadge(program.status);
                    return (
                      <tr
                        key={slug}
                        className="transition-colors border-t"
                        style={{ borderColor: "var(--cau-border)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--cau-surface-0)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = ""; }}
                      >
                        <td className="py-3.5 px-4">
                          <div className="ds-h3 text-[13px]">{program["Program Name"]}</div>
                          <span className="font-mono text-[10px]" style={{ color: "var(--cau-text-secondary)" }}>/{slug}.html</span>
                        </td>
                        <td className="py-3.5 px-4 max-w-[200px] truncate" style={{ color: "var(--cau-text-secondary)" }}>
                          {program.Department}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="ds-badge ds-badge-brand uppercase tracking-wide text-[10px]">
                            {program["Degree Level"]}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 ds-caption">
                          {program.Duration ?? "4 Years"} · {program.Language ?? "English"}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-foreground">
                          {program.publishedTuition ?? program["Price / Tuition"] ?? "10,000 EUR"}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="ds-badge" style={{ backgroundColor: badge.bg, color: badge.color, borderColor: badge.border }}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <a
                              href={`/programs.html?q=${encodeURIComponent(program["Program Name"])}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ds-btn-icon"
                              title="View in public catalogue"
                              aria-label={`View ${program["Program Name"]} on public site`}
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              type="button"
                              onClick={() => handleEdit(program)}
                              className="ds-btn-icon text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                              title="Edit programme"
                              aria-label={`Edit ${program["Program Name"]}`}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget({ slug, name: program["Program Name"] })}
                              className="ds-btn-icon text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                              title="Delete programme"
                              aria-label={`Delete ${program["Program Name"]}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Accessible Delete Confirmation ── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Programme</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>"{deleteTarget?.name}"</strong> from the live academic catalogue?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && deleteMutation.mutate({ slug: deleteTarget.slug })}
              className="bg-rose-600 hover:bg-rose-700 text-white focus-visible:ring-rose-500"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting…" : "Yes, Delete Programme"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Editor Modal */}
      <ProgramEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => refetch()}
        programToEdit={selectedProgram}
      />
    </DashboardLayout>
  );
}
