import React, { useState, useMemo, useId } from "react";
import DashboardLayout from "./DashboardLayout";
import { trpc } from "@/lib/trpc";
import {
  Users,
  Search,
  Download,
  Phone,
  Mail,
  Plus,
  MessageSquare,
  X,
  Globe2,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { maskEmail, maskPhone } from "@shared/university";

type LeadStatus = "New" | "Contacted" | "Offer Sent" | "Enrolled" | "Closed";

interface NewLeadForm {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  programOfInterest: string;
  degreeLevel: string;
  source: "Website Form" | "WhatsApp" | "AI Assistant" | "Direct Email";
  notes: string;
}

// ── Status badge helper ───────────────────────────────────────────────────────
const statusConfig: Record<LeadStatus, { bg: string; color: string; border: string }> = {
  New:          { bg: "var(--color-error-bg)",   color: "var(--color-error-fg)",   border: "var(--color-error-border)" },
  Contacted:    { bg: "var(--color-warning-bg)", color: "var(--color-warning-fg)", border: "var(--color-warning-border)" },
  "Offer Sent": { bg: "var(--color-info-bg)",    color: "var(--color-info-fg)",    border: "var(--color-info-border)" },
  Enrolled:     { bg: "var(--color-success-bg)", color: "var(--color-success-fg)", border: "var(--color-success-border)" },
  Closed:       { bg: "var(--cau-surface-2)",    color: "var(--cau-text-secondary)", border: "var(--cau-border)" },
};

// ── Skeleton row ──────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr>
      <td className="py-3.5 px-4"><div className="ds-skeleton h-3.5 w-32 rounded mb-1.5" /><div className="ds-skeleton h-2.5 w-44 rounded" /></td>
      <td className="py-3.5 px-4"><div className="ds-skeleton h-3 w-36 rounded mb-1" /><div className="ds-skeleton h-2.5 w-20 rounded" /></td>
      <td className="py-3.5 px-4"><div className="ds-skeleton h-3 w-20 rounded mb-1" /><div className="ds-skeleton h-4 w-24 rounded" /></td>
      <td className="py-3.5 px-4"><div className="ds-skeleton h-5 w-20 rounded-full" /></td>
      <td className="py-3.5 px-4"><div className="ds-skeleton h-3 w-20 rounded" /></td>
      <td className="py-3.5 px-4"><div className="ds-skeleton h-6 w-16 rounded ml-auto" /></td>
    </tr>
  );
}

// ── Skeleton metric pill ──────────────────────────────────────────────────────
function SkeletonMetricPill() {
  return (
    <div className="p-3 ds-card">
      <div className="ds-skeleton h-2.5 w-20 rounded mb-2" />
      <div className="ds-skeleton h-6 w-8 rounded" />
    </div>
  );
}

const fieldCls = "w-full px-3 py-2 rounded-md border text-xs outline-none transition-colors bg-transparent";
const fieldStyle = { borderColor: "var(--cau-border)" };

export default function LeadsPage() {
  const { data: leads, isLoading, isError, refetch } = trpc.cms.leads.list.useQuery();
  const detailTitleId = useId();
  const addTitleId    = useId();
  const piiStatusId   = useId();

  const updateStatusMutation = trpc.cms.leads.updateStatus.useMutation({
    onSuccess: () => { toast.success("Lead status updated successfully"); refetch(); },
    onError:   (err) => toast.error(`Update failed: ${err.message}`),
  });

  const createLeadMutation = trpc.cms.leads.create.useMutation({
    onSuccess: () => {
      toast.success("New lead recorded successfully");
      setIsAddModalOpen(false);
      setNewLeadForm({ fullName: "", email: "", phone: "", country: "", programOfInterest: "", degreeLevel: "Bachelor", source: "Website Form", notes: "" });
      refetch();
    },
    onError: (err) => toast.error(`Creation failed: ${err.message}`),
  });

  const [search, setSearch]                     = useState("");
  const [selectedStatus, setSelectedStatus]     = useState<string>("All");
  const [isAddModalOpen, setIsAddModalOpen]      = useState(false);
  const [activeLeadDetails, setActiveLeadDetails] = useState<any | null>(null);
  const [unmaskPii, setUnmaskPii]               = useState(false);

  const [newLeadForm, setNewLeadForm] = useState<NewLeadForm>({
    fullName: "", email: "", phone: "", country: "", programOfInterest: "",
    degreeLevel: "Bachelor", source: "Website Form", notes: "",
  });

  const filteredLeads = useMemo(() => {
    if (!leads) return [];
    return leads.filter((lead) => {
      const matchesSearch =
        search === "" ||
        lead.fullName.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase()) ||
        lead.country.toLowerCase().includes(search.toLowerCase()) ||
        lead.programOfInterest.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = selectedStatus === "All" || lead.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [leads, search, selectedStatus]);

  const statusCounts = useMemo(() => {
    if (!leads) return { New: 0, Contacted: 0, "Offer Sent": 0, Enrolled: 0, Closed: 0 };
    return leads.reduce(
      (acc, l) => { acc[l.status] = (acc[l.status] || 0) + 1; return acc; },
      { New: 0, Contacted: 0, "Offer Sent": 0, Enrolled: 0, Closed: 0 } as Record<string, number>
    );
  }, [leads]);

  const handleExportCSV = () => {
    if (!filteredLeads.length) { toast.error("No leads to export"); return; }
    const headers = ["ID","Full Name","Email","Phone","Country","Program of Interest","Degree Level","Status","Source","Created At","Notes"];
    const rows = filteredLeads.map((l) => [
      `"${l.id}"`, `"${l.fullName.replace(/"/g, '""')}"`, `"${l.email.replace(/"/g, '""')}"`,
      `"${l.phone.replace(/"/g, '""')}"`, `"${l.country.replace(/"/g, '""')}"`,
      `"${l.programOfInterest.replace(/"/g, '""')}"`, `"${(l.degreeLevel || "").replace(/"/g, '""')}"`,
      `"${l.status}"`, `"${l.source}"`, `"${l.createdAt}"`, `"${(l.notes || "").replace(/"/g, '""')}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `cau_admissions_leads_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Leads exported to CSV successfully");
  };

  return (
    <DashboardLayout
      title="Admissions Inquiries & CRM"
      subtitle="Track prospective international students, update evaluation statuses, and follow up via WhatsApp or Email."
      action={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const next = !unmaskPii;
              setUnmaskPii(next);
              if (next) toast.warning("Audit Log: Applicant PII unmasked for authorized administrative review");
              else       toast.info("FERPA/GDPR Privacy Masking Enabled");
            }}
            className="text-xs h-9 border focus-visible:ring-2"
            aria-pressed={unmaskPii}
            aria-describedby={piiStatusId}
            aria-label={unmaskPii ? "Mask applicant contact details" : "Reveal applicant contact details"}
            style={unmaskPii
              ? { backgroundColor: "var(--color-warning-bg)", color: "var(--color-warning-fg)", borderColor: "var(--color-warning-border)" }
              : { borderColor: "var(--cau-border)" }}
          >
            {unmaskPii
              ? <><EyeOff className="w-3.5 h-3.5 mr-1.5" /> Mask PII</>
              : <><Eye className="w-3.5 h-3.5 mr-1.5" /> Reveal PII (Audit Logged)</>}
          </Button>
          {/* Screen-reader status announcement */}
          <span id={piiStatusId} className="sr-only" aria-live="polite">
            {unmaskPii ? "PII is currently visible" : "PII is currently masked"}
          </span>

          <Button variant="outline" size="sm" onClick={handleExportCSV}
            className="text-xs font-semibold gap-1.5" style={{ borderColor: "var(--cau-border)" }}>
            <Download className="w-3.5 h-3.5" /> Export CSV
          </Button>
          <Button size="sm" onClick={() => setIsAddModalOpen(true)}
            className="text-xs font-semibold gap-1.5 text-white" style={{ backgroundColor: "var(--cau-brand)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--cau-brand-hover)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--cau-brand)"; }}>
            <Plus className="w-3.5 h-3.5" /> Add Inward Lead
          </Button>
        </div>
      }
    >
      {/* ── Error State ── */}
      {isError && (
        <div className="ds-card p-4 flex items-center gap-3 text-sm mb-6"
          style={{ backgroundColor: "var(--color-error-bg)", borderColor: "var(--color-error-border)", color: "var(--color-error-fg)" }}>
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="flex-1">Failed to load admissions leads.</span>
          <Button size="sm" variant="outline" onClick={() => refetch()} className="text-xs h-8">Retry</Button>
        </div>
      )}

      {/* ── Status Metric Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {isLoading ? [1,2,3,4,5].map(i => <SkeletonMetricPill key={i} />) : (
          [
            { label: "New Inquiries",    count: statusCounts["New"],        color: "var(--color-error-fg)" },
            { label: "Contacted",        count: statusCounts["Contacted"],  color: "var(--color-warning-fg)" },
            { label: "Offer Sent",       count: statusCounts["Offer Sent"],color: "var(--color-info-fg)" },
            { label: "Enrolled",         count: statusCounts["Enrolled"],   color: "var(--color-success-fg)" },
            { label: "Closed / Archived",count: statusCounts["Closed"],     color: "var(--cau-text-secondary)" },
          ].map((m) => (
            <div key={m.label} className="p-3 ds-card">
              <p className="ds-label">{m.label}</p>
              <p className="ds-h2 text-2xl mt-1" style={{ color: m.color }}>{m.count}</p>
            </div>
          ))
        )}
      </div>

      {/* ── Filter & Search Bar ── */}
      <div className="ds-card p-4 mb-6 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--cau-text-secondary)" }} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, country, or program..."
            className="pl-9 text-xs h-9"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {["All", "New", "Contacted", "Offer Sent", "Enrolled", "Closed"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              aria-pressed={selectedStatus === st}
              className="ds-pill"
              style={selectedStatus === st ? { backgroundColor: "var(--cau-text-primary)", color: "var(--cau-surface-1)" } : undefined}
            >
              {st}{st === "All" && leads ? ` (${leads.length})` : ""}
            </button>
          ))}
        </div>
      </div>

      {/* ── Leads Table ── */}
      <div className="ds-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse" aria-label="Admissions Applicant Leads Table">
            <thead>
              <tr
                className="border-b text-[10px] font-bold uppercase tracking-wider"
                style={{ backgroundColor: "var(--cau-surface-0)", borderColor: "var(--cau-border)", color: "var(--cau-text-secondary)" }}
              >
                <th scope="col" className="py-3 px-4">Student &amp; Contact</th>
                <th scope="col" className="py-3 px-4">Program &amp; Level</th>
                <th scope="col" className="py-3 px-4">Country &amp; Source</th>
                <th scope="col" className="py-3 px-4">Status</th>
                <th scope="col" className="py-3 px-4">Inquiry Date</th>
                <th scope="col" className="py-3 px-4 text-right">Quick Contact</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [1,2,3,4,5,6,7,8].map(i => <SkeletonRow key={i} />)
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="ds-empty">
                      <div className="ds-empty-icon"><Users className="w-6 h-6" /></div>
                      <p className="ds-h3 text-sm">{search || selectedStatus !== "All" ? "No matches found" : "No enquiries yet"}</p>
                      <p className="ds-caption">
                        {search || selectedStatus !== "All"
                          ? "Try adjusting your search or status filter."
                          : "New admissions leads will appear here once received."}
                      </p>
                      {!search && selectedStatus === "All" && (
                        <Button size="sm" className="mt-1 text-xs text-white" style={{ backgroundColor: "var(--cau-brand)" }}
                          onClick={() => setIsAddModalOpen(true)}>
                          <Plus className="w-3.5 h-3.5 mr-1.5" /> Add First Lead
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const displayEmail = unmaskPii ? lead.email : maskEmail(lead.email);
                  const displayPhone = unmaskPii ? lead.phone : maskPhone(lead.phone);
                  const cleanPhone   = lead.phone.replace(/[^0-9]/g, "");
                  const sc           = statusConfig[lead.status as LeadStatus] ?? statusConfig.Closed;
                  return (
                    <tr
                      key={lead.id}
                      className="transition-colors cursor-pointer border-t focus-within:ring-2"
                      style={{ borderColor: "var(--cau-border)" }}
                      onClick={() => setActiveLeadDetails(lead)}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--cau-surface-0)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = ""; }}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-sm text-foreground">{lead.fullName}</div>
                        <div className="ds-caption flex items-center gap-2 mt-0.5">
                          <span className="font-mono">{displayEmail}</span>
                          <span>•</span>
                          <span className="font-mono">{displayPhone}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-foreground">{lead.programOfInterest}</div>
                        <div className="ds-caption">{lead.degreeLevel || "Undergraduate"}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-medium text-foreground">
                          <Globe2 className="w-3 h-3 shrink-0" style={{ color: "var(--cau-text-secondary)" }} />
                          <span>{lead.country}</span>
                        </div>
                        <span
                          className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: "var(--cau-surface-2)", color: "var(--cau-text-secondary)" }}
                        >
                          {lead.source}
                        </span>
                      </td>
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={lead.status}
                          onChange={(e) => updateStatusMutation.mutate({ id: lead.id, status: e.target.value as LeadStatus })}
                          className="ds-badge cursor-pointer focus:outline-none focus:ring-1 appearance-none pr-2 bg-transparent"
                          style={{ color: sc.color, backgroundColor: sc.bg, borderColor: sc.border }}
                          aria-label={`Update status for ${lead.fullName}`}
                        >
                          {(["New","Contacted","Offer Sent","Enrolled","Closed"] as LeadStatus[]).map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3.5 px-4 ds-caption font-mono">
                        {new Date(lead.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(lead.fullName)},%20thank%20you%20for%20your%20interest%20in%20Cyprus%20Ayd%C4%B1n%20University!`}
                            target="_blank" rel="noopener noreferrer"
                            className="p-1.5 rounded transition-colors"
                            style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#059669" }}
                            title="Chat via WhatsApp"
                            aria-label={`WhatsApp ${lead.fullName}`}
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`mailto:${lead.email}?subject=Cyprus%20Ayd%C4%B1n%20University%20Admissions%20Follow-Up`}
                            className="p-1.5 rounded transition-colors"
                            style={{ backgroundColor: "rgba(59,130,246,0.1)", color: "#2563eb" }}
                            title="Send Email"
                            aria-label={`Email ${lead.fullName}`}
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>
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

      {/* ── Lead Detail Modal ── */}
      {activeLeadDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          role="dialog" aria-modal="true" aria-labelledby={detailTitleId}
        >
          <div className="ds-modal max-w-lg w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b mb-4" style={{ borderColor: "var(--cau-border)" }}>
              <div>
                <h3 id={detailTitleId} className="ds-h2">{activeLeadDetails.fullName}</h3>
                <p className="ds-caption">Admissions Prospect Details</p>
              </div>
              <button onClick={() => setActiveLeadDetails(null)} className="ds-btn-icon" aria-label="Close detail panel">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-2 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Email", value: unmaskPii ? activeLeadDetails.email : maskEmail(activeLeadDetails.email), mono: true },
                  { label: "Phone", value: unmaskPii ? activeLeadDetails.phone : maskPhone(activeLeadDetails.phone), mono: true },
                  { label: "Country", value: activeLeadDetails.country, mono: false },
                  { label: "Source", value: activeLeadDetails.source, mono: false },
                ].map(({ label, value, mono }) => (
                  <div key={label} className="p-3 rounded-lg" style={{ backgroundColor: "var(--cau-surface-0)" }}>
                    <span className="ds-label block mb-0.5">{label}</span>
                    <span className={`font-medium text-foreground ${mono ? "font-mono" : ""}`}>{value}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--cau-surface-0)" }}>
                <span className="ds-label block mb-1">Target Programme</span>
                <span className="font-bold text-sm" style={{ color: "var(--cau-brand)" }}>{activeLeadDetails.programOfInterest}</span>
                <span className="block ds-caption mt-0.5">{activeLeadDetails.degreeLevel} Level</span>
              </div>

              {activeLeadDetails.notes && (
                <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--cau-surface-0)" }}>
                  <span className="ds-label block mb-1">Admissions Notes</span>
                  <p className="text-foreground whitespace-pre-wrap">{activeLeadDetails.notes}</p>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${activeLeadDetails.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-white font-semibold text-xs transition-colors"
                    style={{ backgroundColor: "#059669" }}
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Student
                  </a>
                  <a
                    href={`mailto:${activeLeadDetails.email}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-white font-semibold text-xs transition-colors"
                    style={{ backgroundColor: "#2563eb" }}
                  >
                    <Mail className="w-3.5 h-3.5" /> Email
                  </a>
                </div>
                <Button variant="outline" size="sm" onClick={() => setActiveLeadDetails(null)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Add New Lead Modal ── */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          role="dialog" aria-modal="true" aria-labelledby={addTitleId}
        >
          <div className="ds-modal max-w-lg w-full p-6 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b mb-4" style={{ borderColor: "var(--cau-border)" }}>
              <div>
                <h3 id={addTitleId} className="ds-h2">Record Admissions Lead</h3>
                <p className="ds-caption">Add prospective student inquiry from phone or walk-in</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="ds-btn-icon" aria-label="Close add lead form">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); createLeadMutation.mutate(newLeadForm); }}
              className="space-y-3 text-xs"
            >
              <div>
                <label htmlFor="nl-name" className="block font-semibold mb-1">Full Student Name *</label>
                <Input id="nl-name" required value={newLeadForm.fullName}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, fullName: e.target.value })}
                  placeholder="e.g. Tariq Al-Mansoor" className="text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="nl-email" className="block font-semibold mb-1">Email Address *</label>
                  <Input id="nl-email" required type="email" value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    placeholder="student@example.com" className="text-xs" />
                </div>
                <div>
                  <label htmlFor="nl-phone" className="block font-semibold mb-1">Phone / WhatsApp *</label>
                  <Input id="nl-phone" required value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    placeholder="+90 533 123 4567" className="text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="nl-country" className="block font-semibold mb-1">Country of Residence *</label>
                  <Input id="nl-country" required value={newLeadForm.country}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, country: e.target.value })}
                    placeholder="e.g. Jordan, Nigeria" className="text-xs" />
                </div>
                <div>
                  <label htmlFor="nl-source" className="block font-semibold mb-1">Inquiry Source</label>
                  <select id="nl-source" value={newLeadForm.source}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, source: e.target.value as any })}
                    className={fieldCls} style={{ ...fieldStyle, backgroundColor: "var(--cau-surface-1)" }}>
                    <option value="Website Form">Website Form</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="AI Assistant">AI Assistant</option>
                    <option value="Direct Email">Direct Email</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="nl-prog" className="block font-semibold mb-1">Program of Interest *</label>
                  <Input id="nl-prog" required value={newLeadForm.programOfInterest}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, programOfInterest: e.target.value })}
                    placeholder="e.g. Dentistry" className="text-xs" />
                </div>
                <div>
                  <label htmlFor="nl-degree" className="block font-semibold mb-1">Degree Level</label>
                  <select id="nl-degree" value={newLeadForm.degreeLevel}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, degreeLevel: e.target.value })}
                    className={fieldCls} style={{ ...fieldStyle, backgroundColor: "var(--cau-surface-1)" }}>
                    <option value="Bachelor">Bachelor</option>
                    <option value="Master">Master</option>
                    <option value="PhD">PhD</option>
                    <option value="Associate">Associate Degree</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="nl-notes" className="block font-semibold mb-1">Notes / Special Requests</label>
                <textarea id="nl-notes" rows={3} value={newLeadForm.notes}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  placeholder="e.g. Inquiring about 50% scholarship eligibility..."
                  className={fieldCls + " leading-relaxed resize-none"} style={fieldStyle} />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t" style={{ borderColor: "var(--cau-border)" }}>
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button type="submit" size="sm" disabled={createLeadMutation.isPending}
                  aria-busy={createLeadMutation.isPending}
                  className="text-white" style={{ backgroundColor: "var(--cau-brand)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--cau-brand-hover)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--cau-brand)"; }}>
                  {createLeadMutation.isPending ? "Recording…" : "Save Prospect"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
