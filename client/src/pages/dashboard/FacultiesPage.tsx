import React, { useState, useId } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "./DashboardLayout";
import { Building2, User, Award, Edit3, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// ── Skeleton Card ─────────────────────────────────────────────────────────────
function SkeletonFacultyCard() {
  return (
    <div className="ds-card p-5 flex flex-col justify-between min-h-[180px]">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="ds-skeleton h-2.5 w-20 rounded" />
          <div className="ds-skeleton w-6 h-6 rounded" />
        </div>
        <div className="ds-skeleton h-4 w-48 rounded mt-2 mb-4" />
        <div className="space-y-2">
          <div className="ds-skeleton h-3 w-36 rounded" />
          <div className="ds-skeleton h-3 w-44 rounded" />
        </div>
      </div>
      <div className="mt-5 pt-3 border-t flex items-center justify-between" style={{ borderColor: "var(--cau-border)" }}>
        <div className="ds-skeleton h-2.5 w-24 rounded" />
        <div className="ds-skeleton h-2.5 w-20 rounded" />
      </div>
    </div>
  );
}

export default function FacultiesPage() {
  const { data: faculties, isLoading, refetch } = trpc.cms.faculties.list.useQuery();
  const [editingFaculty, setEditingFaculty] = useState<any | null>(null);
  const titleId = useId();

  const updateMutation = trpc.cms.faculties.update.useMutation({
    onSuccess: () => {
      toast.success("Faculty details updated successfully.");
      refetch();
      setEditingFaculty(null);
    },
    onError: (err) => {
      toast.error(`Update failed: ${err.message}`);
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaculty) return;
    updateMutation.mutate({
      name:          editingFaculty.name,
      dean:          editingFaculty.dean,
      email:         editingFaculty.email,
      phone:         editingFaculty.phone,
      accreditation: editingFaculty.accreditation,
    });
  };

  return (
    <DashboardLayout
      title="Faculties & Academic Units"
      subtitle="7 Faculties and Vocational Schools governing CAU's 48 verified degree catalogues."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading ? (
            [1,2,3,4,5,6].map(i => <SkeletonFacultyCard key={i} />)
          ) : !faculties?.length ? (
            <div className="col-span-3">
              <div className="ds-card ds-empty">
                <div className="ds-empty-icon">
                  <Building2 className="w-6 h-6" />
                </div>
                <p className="ds-h3 text-sm">No faculties found</p>
                <p className="ds-caption">Faculty data will appear here once loaded from the server.</p>
              </div>
            </div>
          ) : (
            faculties.map((faculty) => (
              <div key={faculty.name} className="ds-card ds-card-hover p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="ds-label" style={{ color: "var(--cau-brand)" }}>Academic Unit</span>
                    <button
                      type="button"
                      onClick={() => setEditingFaculty(faculty)}
                      className="ds-btn-icon"
                      title="Edit faculty leadership"
                      aria-label={`Edit ${faculty.name} leadership details`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h3 className="ds-h3 mt-1">{faculty.name}</h3>

                  <div className="mt-4 space-y-2 text-xs" style={{ color: "var(--cau-text-secondary)" }}>
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-foreground shrink-0" />
                      <span>
                        Dean: <strong className="text-foreground">{faculty.dean || "Office of the Dean"}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{faculty.accreditation || "YÖK / YÖDAK Accredited"}</span>
                    </div>
                    {faculty.students && (
                      <div className="text-[11px] pt-1">
                        Active Enrolment:{" "}
                        <strong className="text-foreground">{faculty.students}</strong>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className="mt-5 pt-3 border-t flex items-center justify-between text-[11px]"
                  style={{ borderColor: "var(--cau-border)" }}
                >
                  <span style={{ color: "var(--cau-text-secondary)" }}>
                    {faculty.programs?.length ? `${faculty.programs.length} Major Tracks` : "Multi-Departmental"}
                  </span>
                  <span className="font-semibold" style={{ color: "var(--cau-brand)" }}>Verified Deanery</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Edit Faculty Modal ── */}
      {editingFaculty && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          aria-modal="true"
          role="dialog"
          aria-labelledby={titleId}
        >
          <div className="ds-modal w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
            <div
              className="flex items-center justify-between pb-3 border-b mb-4"
              style={{ borderColor: "var(--cau-border)" }}
            >
              <h3 id={titleId} className="ds-h3">Edit Faculty Leadership</h3>
              <button
                type="button"
                onClick={() => setEditingFaculty(null)}
                aria-label="Close edit dialogue"
                className="ds-btn-icon rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label htmlFor="fac-name" className="block font-bold text-foreground mb-1">Faculty Name</label>
                <Input
                  id="fac-name"
                  type="text"
                  disabled
                  value={editingFaculty.name}
                  className="text-xs bg-muted cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="fac-dean" className="block font-bold text-foreground mb-1">Dean / Academic Head</label>
                <Input
                  id="fac-dean"
                  type="text"
                  value={editingFaculty.dean || ""}
                  onChange={(e) => setEditingFaculty({ ...editingFaculty, dean: e.target.value })}
                  placeholder="e.g. Prof. Dr. Hikmet Ş. Aybar"
                  className="text-xs"
                />
              </div>

              <div>
                <label htmlFor="fac-email" className="block font-bold text-foreground mb-1">Official Contact Email</label>
                <Input
                  id="fac-email"
                  type="email"
                  value={editingFaculty.email || ""}
                  onChange={(e) => setEditingFaculty({ ...editingFaculty, email: e.target.value })}
                  placeholder="deanery@cau.edu.tr"
                  className="text-xs"
                />
              </div>

              <div>
                <label htmlFor="fac-phone" className="block font-bold text-foreground mb-1">Office Telephone Extension</label>
                <Input
                  id="fac-phone"
                  type="text"
                  value={editingFaculty.phone || ""}
                  onChange={(e) => setEditingFaculty({ ...editingFaculty, phone: e.target.value })}
                  placeholder="+90 392 650 00 00 Ext: 1200"
                  className="text-xs"
                />
              </div>

              <div>
                <label htmlFor="fac-accred" className="block font-bold text-foreground mb-1">Accreditation Notes</label>
                <Input
                  id="fac-accred"
                  type="text"
                  value={editingFaculty.accreditation || ""}
                  onChange={(e) => setEditingFaculty({ ...editingFaculty, accreditation: e.target.value })}
                  placeholder="YÖK, YÖDAK"
                  className="text-xs"
                />
              </div>

              <div
                className="pt-3 border-t flex justify-end gap-2"
                style={{ borderColor: "var(--cau-border)" }}
              >
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingFaculty(null)}
                  className="text-xs h-8"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={updateMutation.isPending}
                  aria-busy={updateMutation.isPending}
                  className="text-xs h-8 font-semibold text-white"
                  style={{ backgroundColor: "var(--cau-brand)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--cau-brand-hover)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--cau-brand)"; }}
                >
                  {updateMutation.isPending ? "Saving…" : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
