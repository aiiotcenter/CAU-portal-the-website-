import React, { useState, useEffect, useId } from "react";
import { trpc } from "@/lib/trpc";
import { X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ProgramEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  programToEdit?: any | null;
}

const degreeOptions   = ["Bachelor", "Master", "Ph.D.", "Associate", "Preparatory"];
const languageOptions = ["English (100%)", "Turkish", "English & Turkish"];
const durationOptions = ["4 Years", "2 Years", "5 Years", "1 Year", "3 Years"];

const facultyOptions = [
  "Faculty of Engineering and Architecture",
  "Faculty of Dentistry",
  "Faculty of Health Sciences",
  "Faculty of Humanities and Social Sciences",
  "Faculty of Law",
  "Faculty of Educational Sciences",
  "Faculty of Applied Sciences",
  "Vocational Schools",
  "English Preparatory School",
];

// Shared field class for consistent styling
const fieldCls = "w-full px-3.5 py-2.5 rounded-md border text-xs outline-none transition-colors bg-transparent focus:ring-1 appearance-none";
const fieldStyle = { borderColor: "var(--cau-border)" };

export default function ProgramEditorModal({ isOpen, onClose, onSuccess, programToEdit }: ProgramEditorModalProps) {
  const titleId = useId();
  const descId  = useId();

  const [formData, setFormData] = useState({
    "Program Name": "",
    Department:       "Faculty of Engineering and Architecture",
    "Degree Level":   "Bachelor",
    Duration:         "4 Years",
    "Price / Tuition":"10,000 EUR per year",
    publishedTuition: "10,000 EUR",
    Language:         "English (100%)",
    summary:          "",
    slug:             "",
    status:           "active" as "active" | "draft" | "archived",
  });

  useEffect(() => {
    if (programToEdit) {
      setFormData({
        "Program Name":    programToEdit["Program Name"] || "",
        Department:        programToEdit.Department || "Faculty of Engineering and Architecture",
        "Degree Level":    programToEdit["Degree Level"] || "Bachelor",
        Duration:          programToEdit.Duration || "4 Years",
        "Price / Tuition": programToEdit["Price / Tuition"] || "10,000 EUR per year",
        publishedTuition:  programToEdit.publishedTuition || "10,000 EUR",
        Language:          programToEdit.Language || "English (100%)",
        summary:           programToEdit.summary || programToEdit["Program Details / Information"] || "",
        slug:              programToEdit.slug || "",
        status:            programToEdit.status || "active",
      });
    } else {
      setFormData({
        "Program Name": "",
        Department:       "Faculty of Engineering and Architecture",
        "Degree Level":   "Bachelor",
        Duration:         "4 Years",
        "Price / Tuition":"10,000 EUR per year",
        publishedTuition: "10,000 EUR",
        Language:         "English (100%)",
        summary:          "",
        slug:             "",
        status:           "active",
      });
    }
  }, [programToEdit, isOpen]);

  const upsertMutation = trpc.cms.programs.upsert.useMutation({
    onSuccess: () => {
      toast.success(
        programToEdit
          ? `Programme "${formData["Program Name"]}" updated successfully!`
          : `Programme "${formData["Program Name"]}" added to live catalog!`
      );
      onSuccess();
      onClose();
    },
    onError: (err) => {
      toast.error(`Failed to save programme: ${err.message}`);
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData["Program Name"].trim()) {
      toast.error("Please provide a Program Name.");
      return;
    }
    const autoSlug =
      formData.slug.trim() ||
      formData["Program Name"]
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    upsertMutation.mutate({ ...formData, slug: autoSlug });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      aria-modal="true"
      role="dialog"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      <div className="ds-modal w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">

        {/* Header */}
        <div
          className="p-5 flex items-center justify-between border-b"
          style={{ borderColor: "var(--cau-border)" }}
        >
          <div>
            <span className="ds-label" style={{ color: "var(--cau-brand)" }}>
              {programToEdit ? "Edit Catalogue Item" : "New Academic Programme"}
            </span>
            <h2 id={titleId} className="ds-h2 mt-0.5">
              {programToEdit ? programToEdit["Program Name"] : "Add Programme to Catalog"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialogue"
            className="ds-btn-icon rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form
          id={descId}
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs"
        >

          {/* Programme Title */}
          <div>
            <label htmlFor="prog-name" className="block font-bold text-foreground mb-1.5">
              Programme Title <span style={{ color: "var(--cau-brand)" }}>*</span>
            </label>
            <Input
              id="prog-name"
              type="text"
              required
              value={formData["Program Name"]}
              onChange={(e) => setFormData({ ...formData, "Program Name": e.target.value })}
              placeholder="e.g. Software Engineering"
              className="text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Faculty */}
            <div>
              <label htmlFor="prog-dept" className="block font-bold text-foreground mb-1.5">
                Faculty / Department <span style={{ color: "var(--cau-brand)" }}>*</span>
              </label>
              <select
                id="prog-dept"
                value={formData.Department}
                onChange={(e) => setFormData({ ...formData, Department: e.target.value })}
                className={fieldCls}
                style={{ ...fieldStyle, backgroundColor: "var(--cau-surface-1)" }}
              >
                {facultyOptions.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            {/* Degree Level */}
            <div>
              <label htmlFor="prog-degree" className="block font-bold text-foreground mb-1.5">
                Degree Level <span style={{ color: "var(--cau-brand)" }}>*</span>
              </label>
              <select
                id="prog-degree"
                value={formData["Degree Level"]}
                onChange={(e) => setFormData({ ...formData, "Degree Level": e.target.value })}
                className={fieldCls}
                style={{ ...fieldStyle, backgroundColor: "var(--cau-surface-1)" }}
              >
                {degreeOptions.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Duration */}
            <div>
              <label htmlFor="prog-duration" className="block font-bold text-foreground mb-1.5">Duration</label>
              <select
                id="prog-duration"
                value={formData.Duration}
                onChange={(e) => setFormData({ ...formData, Duration: e.target.value })}
                className={fieldCls}
                style={{ ...fieldStyle, backgroundColor: "var(--cau-surface-1)" }}
              >
                {durationOptions.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* Language */}
            <div>
              <label htmlFor="prog-lang" className="block font-bold text-foreground mb-1.5">Language</label>
              <select
                id="prog-lang"
                value={formData.Language}
                onChange={(e) => setFormData({ ...formData, Language: e.target.value })}
                className={fieldCls}
                style={{ ...fieldStyle, backgroundColor: "var(--cau-surface-1)" }}
              >
                {languageOptions.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="prog-status" className="block font-bold text-foreground mb-1.5">Catalogue Status</label>
              <select
                id="prog-status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className={fieldCls + " font-semibold"}
                style={{ ...fieldStyle, backgroundColor: "var(--cau-surface-1)" }}
              >
                <option value="active">Active (Published)</option>
                <option value="draft">Draft (Hidden)</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tuition Schedule */}
            <div>
              <label htmlFor="prog-tuition" className="block font-bold text-foreground mb-1.5">Tuition Display Schedule</label>
              <Input
                id="prog-tuition"
                type="text"
                value={formData["Price / Tuition"]}
                onChange={(e) => setFormData({ ...formData, "Price / Tuition": e.target.value })}
                placeholder="e.g. 10,000 EUR per year"
                className="text-xs"
              />
            </div>

            {/* Published Tuition */}
            <div>
              <label htmlFor="prog-pub-tuition" className="block font-bold text-foreground mb-1.5">Base Published Tuition</label>
              <Input
                id="prog-pub-tuition"
                type="text"
                value={formData.publishedTuition}
                onChange={(e) => setFormData({ ...formData, publishedTuition: e.target.value })}
                placeholder="e.g. 10,000 EUR"
                className="text-xs"
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label htmlFor="prog-summary" className="block font-bold text-foreground mb-1.5">Programme Overview &amp; Curriculum Guidance</label>
            <textarea
              id="prog-summary"
              rows={4}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Describe core coursework, laboratory practice, accreditation, and career outcomes..."
              className={fieldCls + " leading-relaxed resize-none"}
              style={fieldStyle}
            />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="prog-slug" className="block font-bold text-foreground mb-1.5">
              URL Slug{" "}
              <span className="font-normal" style={{ color: "var(--cau-text-secondary)" }}>(Leave blank to auto-generate)</span>
            </label>
            <Input
              id="prog-slug"
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="software-engineering"
              className="text-xs font-mono"
            />
          </div>

          {/* Footer */}
          <div
            className="pt-4 flex items-center justify-end gap-3 border-t"
            style={{ borderColor: "var(--cau-border)" }}
          >
            <Button type="button" variant="outline" onClick={onClose} className="text-xs h-9">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={upsertMutation.isPending}
              aria-busy={upsertMutation.isPending}
              className="text-xs h-9 font-semibold text-white"
              style={{ backgroundColor: "var(--cau-brand)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--cau-brand-hover)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--cau-brand)"; }}
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              {upsertMutation.isPending ? "Saving…" : programToEdit ? "Save Changes" : "Create Programme"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
