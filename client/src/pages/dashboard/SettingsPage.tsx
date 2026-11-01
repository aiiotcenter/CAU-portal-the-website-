import React, { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import { trpc } from "@/lib/trpc";
import {
  Save,
  Bell,
  Phone,
  Mail,
  MapPin,
  Calendar,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// ── Skeleton Section ──────────────────────────────────────────────────────────
function SkeletonSection({ rows = 2 }: { rows?: number }) {
  return (
    <div className="ds-card p-6">
      <div className="flex items-center gap-2 pb-4 mb-4 border-b" style={{ borderColor: "var(--cau-border)" }}>
        <div className="ds-skeleton w-4 h-4 rounded" />
        <div className="ds-skeleton h-4 w-48 rounded" />
      </div>
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="ds-skeleton h-3 w-24 rounded" />
            <div className="ds-skeleton h-9 w-full rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Section Card wrapper ──────────────────────────────────────────────────────
function SectionCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="ds-card p-6">
      <div className="flex items-center gap-2 pb-4 mb-4 border-b" style={{ borderColor: "var(--cau-border)" }}>
        <div style={{ color: "var(--cau-brand)" }}>{icon}</div>
        <h3 className="ds-h3">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { data: settings, isLoading, isError, refetch } = trpc.cms.settings.get.useQuery();

  const [formData, setFormData] = useState({
    announcementBanner: { enabled: true, text: "", linkText: "", linkUrl: "" },
    contact:  { officialWhatsApp: "", admissionsEmail: "", generalPhone: "", campusAddress: "" },
    admissions: { activeTerm: "", applicationDeadline: "", internationalDiscountNotice: "" },
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        announcementBanner: {
          enabled:  settings.announcementBanner?.enabled ?? true,
          text:     settings.announcementBanner?.text ?? "",
          linkText: settings.announcementBanner?.linkText ?? "",
          linkUrl:  settings.announcementBanner?.linkUrl ?? "",
        },
        contact: {
          officialWhatsApp: settings.contact?.officialWhatsApp ?? "",
          admissionsEmail:  settings.contact?.admissionsEmail ?? "",
          generalPhone:     settings.contact?.generalPhone ?? "",
          campusAddress:    settings.contact?.campusAddress ?? "",
        },
        admissions: {
          activeTerm:                   settings.admissions?.activeTerm ?? "",
          applicationDeadline:          settings.admissions?.applicationDeadline ?? "",
          internationalDiscountNotice:   settings.admissions?.internationalDiscountNotice ?? "",
        },
      });
    }
  }, [settings]);

  const updateMutation = trpc.cms.settings.update.useMutation({
    onSuccess: () => {
      toast.success("Site configuration saved and broadcast to all live pages");
      refetch();
    },
    onError: (err) => toast.error(`Error saving settings: ${err.message}`),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const setB = (key: string, value: any) =>
    setFormData({ ...formData, announcementBanner: { ...formData.announcementBanner, [key]: value } });
  const setC = (key: string, value: string) =>
    setFormData({ ...formData, contact: { ...formData.contact, [key]: value } });
  const setA = (key: string, value: string) =>
    setFormData({ ...formData, admissions: { ...formData.admissions, [key]: value } });

  return (
    <DashboardLayout
      title="Global Site & Admissions Configuration"
      subtitle="Control the campus announcement bar, admissions contact channels, deadlines, and scholarship notifications."
      action={
        <Button
          onClick={handleSubmit}
          disabled={updateMutation.isPending}
          className="text-xs font-semibold gap-1.5 text-white"
          style={{ backgroundColor: "var(--cau-brand)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--cau-brand-hover)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--cau-brand)"; }}
          aria-busy={updateMutation.isPending}
        >
          {updateMutation.isPending
            ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving Settings…</>
            : <><Save className="w-3.5 h-3.5" /> Save Configuration</>}
        </Button>
      }
    >
      {/* Error State */}
      {isError && (
        <div
          className="ds-card p-4 flex items-center gap-3 text-sm mb-6"
          style={{ backgroundColor: "var(--color-error-bg)", borderColor: "var(--color-error-border)", color: "var(--color-error-fg)" }}
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="flex-1">Failed to load site settings.</span>
          <Button size="sm" variant="outline" onClick={() => refetch()} className="text-xs h-8">Retry</Button>
        </div>
      )}

      {isLoading ? (
        <div className="max-w-4xl space-y-6">
          <SkeletonSection rows={4} />
          <SkeletonSection rows={2} />
          <SkeletonSection rows={4} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">

          {/* ── Section 1: Announcement Banner ── */}
          <SectionCard icon={<Bell className="w-4 h-4" />} title="Campus Announcement Banner">
            <div className="space-y-4 text-xs">
              {/* Toggle */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="banner-enabled"
                  checked={formData.announcementBanner.enabled}
                  onCheckedChange={(checked) => setB("enabled", !!checked)}
                />
                <Label htmlFor="banner-enabled" className="text-xs font-semibold cursor-pointer">
                  Display on Homepage
                </Label>
              </div>

              <div>
                <label htmlFor="banner-text" className="block font-semibold mb-1 text-foreground">Banner Text Message</label>
                <Input
                  id="banner-text"
                  value={formData.announcementBanner.text}
                  onChange={(e) => setB("text", e.target.value)}
                  placeholder="e.g. Fall 2026 International Applications Open - 50% Scholarship Guaranteed"
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="banner-link-text" className="block font-semibold mb-1 text-foreground">Call-to-Action Link Text</label>
                  <Input
                    id="banner-link-text"
                    value={formData.announcementBanner.linkText}
                    onChange={(e) => setB("linkText", e.target.value)}
                    placeholder="e.g. Apply Now"
                    className="text-xs"
                  />
                </div>
                <div>
                  <label htmlFor="banner-link-url" className="block font-semibold mb-1 text-foreground">Link Destination URL</label>
                  <Input
                    id="banner-link-url"
                    value={formData.announcementBanner.linkUrl}
                    onChange={(e) => setB("linkUrl", e.target.value)}
                    placeholder="e.g. #apply or /programs.html"
                    className="text-xs"
                  />
                </div>
              </div>

              {/* Live Preview */}
              {formData.announcementBanner.enabled && (
                <div
                  className="mt-3 p-3 rounded-lg flex items-center justify-between text-xs"
                  style={{ backgroundColor: "var(--cau-text-primary)", color: "#ffffff" }}
                  aria-label="Banner preview"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--cau-brand)" }} />
                    <span>{formData.announcementBanner.text || "Announcement banner text goes here…"}</span>
                  </div>
                  {formData.announcementBanner.linkText && (
                    <span className="font-semibold underline underline-offset-2" style={{ color: "var(--cau-brand)" }}>
                      {formData.announcementBanner.linkText} ↗
                    </span>
                  )}
                </div>
              )}
            </div>
          </SectionCard>

          {/* ── Section 2: Admissions Intake ── */}
          <SectionCard icon={<Calendar className="w-4 h-4" />} title="Admissions Intake & Policies">
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="adm-term" className="block font-semibold mb-1 text-foreground">Current Active Term</label>
                  <Input
                    id="adm-term"
                    value={formData.admissions.activeTerm}
                    onChange={(e) => setA("activeTerm", e.target.value)}
                    placeholder="e.g. Fall 2026 / 2027"
                    className="text-xs"
                  />
                </div>
                <div>
                  <label htmlFor="adm-deadline" className="block font-semibold mb-1 text-foreground">Standard Application Deadline</label>
                  <Input
                    id="adm-deadline"
                    value={formData.admissions.applicationDeadline}
                    onChange={(e) => setA("applicationDeadline", e.target.value)}
                    placeholder="e.g. September 15, 2026"
                    className="text-xs"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="adm-scholarship" className="block font-semibold mb-1 text-foreground">Automatic Scholarship Notice</label>
                <Input
                  id="adm-scholarship"
                  value={formData.admissions.internationalDiscountNotice}
                  onChange={(e) => setA("internationalDiscountNotice", e.target.value)}
                  placeholder="e.g. 50% Tuition Scholarship Automatically Applied"
                  className="text-xs"
                />
              </div>
            </div>
          </SectionCard>

          {/* ── Section 3: Official Contact ── */}
          <SectionCard icon={<Phone className="w-4 h-4" />} title="Official University Contact Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label htmlFor="ct-whatsapp" className="block font-semibold mb-1 text-foreground">Official WhatsApp Hotline</label>
                <Input
                  id="ct-whatsapp"
                  value={formData.contact.officialWhatsApp}
                  onChange={(e) => setC("officialWhatsApp", e.target.value)}
                  placeholder="+90 533 850 00 00"
                  className="text-xs"
                />
                <p className="text-[10px] mt-1" style={{ color: "var(--cau-text-secondary)" }}>
                  Connected to the public WhatsApp floating button
                </p>
              </div>

              <div>
                <label htmlFor="ct-email" className="block font-semibold mb-1 text-foreground">Admissions Office Email</label>
                <Input
                  id="ct-email"
                  type="email"
                  value={formData.contact.admissionsEmail}
                  onChange={(e) => setC("admissionsEmail", e.target.value)}
                  placeholder="admissions@cau.edu.tr"
                  className="text-xs"
                />
              </div>

              <div>
                <label htmlFor="ct-phone" className="block font-semibold mb-1 text-foreground">Campus Switchboard Phone</label>
                <Input
                  id="ct-phone"
                  value={formData.contact.generalPhone}
                  onChange={(e) => setC("generalPhone", e.target.value)}
                  placeholder="+90 392 650 00 00"
                  className="text-xs"
                />
              </div>

              <div>
                <label htmlFor="ct-address" className="block font-semibold mb-1 text-foreground">Official Campus Address</label>
                <Input
                  id="ct-address"
                  value={formData.contact.campusAddress}
                  onChange={(e) => setC("campusAddress", e.target.value)}
                  placeholder="Kyrenia Harbor Campus, Kyrenia, TRNC"
                  className="text-xs"
                />
              </div>
            </div>
          </SectionCard>

          {/* Footer Save Button */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              aria-busy={updateMutation.isPending}
              className="text-xs font-semibold px-6 text-white"
              style={{ backgroundColor: "var(--cau-brand)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--cau-brand-hover)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--cau-brand)"; }}
            >
              {updateMutation.isPending ? "Saving…" : "Save All Site Settings"}
            </Button>
          </div>
        </form>
      )}
    </DashboardLayout>
  );
}
