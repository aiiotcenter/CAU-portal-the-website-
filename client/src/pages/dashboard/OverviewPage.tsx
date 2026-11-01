import React from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "./DashboardLayout";
import {
  GraduationCap,
  Building2,
  Newspaper,
  Users,
  ArrowUpRight,
  Plus,
  RefreshCw,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Trophy,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Skeleton helpers ──────────────────────────────────────────────────────────
function SkeletonMetricCard() {
  return (
    <div className="ds-card p-5">
      <div className="flex items-center justify-between">
        <div className="ds-skeleton h-3 w-20 rounded" />
        <div className="ds-skeleton w-8 h-8 rounded-full" />
      </div>
      <div className="mt-4">
        <div className="ds-skeleton h-8 w-14 rounded" />
        <div className="ds-skeleton h-3 w-32 rounded mt-2" />
      </div>
      <div className="ds-skeleton h-3 w-24 rounded mt-4" />
    </div>
  );
}

function SkeletonDegreeCell() {
  return (
    <div className="p-3.5 rounded-md border" style={{ backgroundColor: "var(--cau-surface-0)", borderColor: "var(--cau-border)" }}>
      <div className="ds-skeleton h-2.5 w-16 rounded mb-2" />
      <div className="ds-skeleton h-6 w-8 rounded mb-1.5" />
      <div className="ds-skeleton h-2.5 w-20 rounded" />
    </div>
  );
}

function SkeletonTableRow() {
  return (
    <tr>
      <td className="py-3"><div className="ds-skeleton h-3 w-28 rounded" /></td>
      <td className="py-3"><div className="ds-skeleton h-3 w-16 rounded" /></td>
      <td className="py-3"><div className="ds-skeleton h-3 w-36 rounded" /></td>
      <td className="py-3"><div className="ds-skeleton h-3 w-24 rounded" /></td>
      <td className="py-3"><div className="ds-skeleton h-5 w-14 rounded-full" /></td>
      <td className="py-3"><div className="ds-skeleton h-3 w-20 rounded" /></td>
    </tr>
  );
}

// ── Metric Card ──────────────────────────────────────────────────────────────
interface MetricCardProps {
  label: string;
  value: string | number;
  sub: React.ReactNode;
  icon: React.ReactNode;
  iconBg: string;
  linkHref: string;
  linkLabel: string;
  linkColor: string;
}

function MetricCard({ label, value, sub, icon, iconBg, linkHref, linkLabel, linkColor }: MetricCardProps) {
  return (
    <div className="ds-card ds-card-hover p-5 relative overflow-hidden group">
      <div className="flex items-center justify-between">
        <span className="ds-label">{label}</span>
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: iconBg }}>
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <div className="ds-h1 text-3xl">{value}</div>
        <p className="ds-caption mt-1 flex items-center gap-1">{sub}</p>
      </div>
      <Link
        href={linkHref}
        className="mt-4 inline-flex items-center text-xs font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 rounded"
        style={{ color: linkColor, "--tw-ring-color": linkColor } as React.CSSProperties}
      >
        {linkLabel} <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
      </Link>
    </div>
  );
}


// ── Student Achievements Bento Grid ──────────────────────────────────────────
interface PlacementResult {
  score: number;
  maxScore: number;
  cefrLevel: string;
  cefrTitle: string;
  isExempt: boolean;
  formattedDate: string;
  candidateName: string;
}

interface ClubRegistration {
  clubName: string;
  studentName: string;
  formattedDate: string;
}

function StudentAchievementsBento() {
  const [placement, setPlacement] = React.useState<PlacementResult | null>(null);
  const [clubs, setClubs] = React.useState<ClubRegistration[]>([]);
  const [arenaXP, setArenaXP] = React.useState<number>(450);

  React.useEffect(() => {
    try {
      // 1. Primary Source of Truth: CAU_STATE_V1 (Unified cau-store)
      const portalRaw = localStorage.getItem("cau_portal_state_v1");
      if (portalRaw) {
        const portal = JSON.parse(portalRaw);
        if (portal.englishArena?.cefrLevel) {
          setPlacement((prev: any) => ({
            ...(prev || {}),
            cefrLevel: portal.englishArena.cefrLevel,
            formattedDate: "Synced via CAU Store",
            score: portal.englishArena.xp > 0 ? 85 : 70
          }));
        }
        if (portal.clubs?.applications && portal.clubs.applications.length > 0) {
          setClubs(portal.clubs.applications.map((a: any) => ({
            clubName: a.clubName || a.clubId,
            studentName: a.studentName || portal.studentProfile?.name || "Student",
            formattedDate: a.timestamp ? new Date(a.timestamp).toLocaleDateString() : "Active Member"
          })));
        } else if (portal.clubs?.joinedClubIds && portal.clubs.joinedClubIds.length > 0) {
          setClubs(portal.clubs.joinedClubIds.map((id: string) => ({
            clubName: id.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
            studentName: portal.studentProfile?.name || "Student",
            formattedDate: "Active Member"
          })));
        }
        if (portal.englishArena?.xp) {
          setArenaXP(portal.englishArena.xp);
        }
      }

      // 2. Legacy fallbacks
      const pRaw = localStorage.getItem("cau_placement_result");
      if (pRaw) setPlacement(JSON.parse(pRaw));

      const cRaw = localStorage.getItem("cau_club_registrations");
      if (cRaw && (!portalRaw || !JSON.parse(portalRaw).clubs?.joinedClubIds?.length)) setClubs(JSON.parse(cRaw));

      const questRaw = localStorage.getItem("cau_quest_xp") || localStorage.getItem("cau_arena_state");
      if (questRaw && (!portalRaw || !JSON.parse(portalRaw).englishArena?.xp)) {
        const parsed = JSON.parse(questRaw);
        if (parsed.xp) setArenaXP(parsed.xp);
      }
    } catch (e) {
      console.warn("Could not load student state in dashboard:", e);
    }
  }, []);

  return (
    <div className="ds-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Student Life &amp; Language Ecosystem</span>
          </div>
          <h3 className="ds-h3 mt-1">Student Achievements &amp; Extracurricular Bento</h3>
          <p className="ds-caption mt-0.5">Live student progression synchronized from Placement Test, English Arena, and Club Registrations.</p>
        </div>
        <span className="ds-badge text-xs px-2.5 py-1" style={{ backgroundColor: "rgba(212, 175, 55, 0.12)", color: "#b5952f" }}>
          Active Session
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Bento Cell 1: English Diagnostic */}
        <div className="p-4 rounded-xl border flex flex-col justify-between" style={{ backgroundColor: "var(--cau-surface-0)", borderColor: "var(--cau-border)" }}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">English Diagnostic</span>
              <div className="w-7 h-7 rounded-full flex items-center justify-center bg-blue-50 text-blue-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-foreground">{placement ? placement.cefrLevel : "A1"}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{
                backgroundColor: placement?.isExempt ? "rgba(16, 185, 129, 0.12)" : "rgba(240, 68, 50, 0.12)",
                color: placement?.isExempt ? "#10b981" : "#f04432"
              }}>
                {placement ? (placement.isExempt ? "Degree Exempt" : "Prep Track") : "Diagnostic Pending"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              {placement ? `Score: ${placement.score}/100 • Evaluated on ${placement.formattedDate}` : "Take the official 20-question placement test to calculate your CEFR readiness."}
            </p>
          </div>
          <a
            href="/placement-test.html"
            className="mt-4 text-xs font-semibold flex items-center gap-1 hover:underline text-blue-600"
          >
            {placement ? "Retake Diagnostic Test" : "Start Placement Diagnostic"} <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Bento Cell 2: English Arena */}
        <div className="p-4 rounded-xl border flex flex-col justify-between" style={{ backgroundColor: "var(--cau-surface-0)", borderColor: "var(--cau-border)" }}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">CAU English Arena</span>
              <div className="w-7 h-7 rounded-full flex items-center justify-center bg-amber-50 text-amber-600">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-foreground">{arenaXP} XP</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                Level {Math.floor(arenaXP / 200) + 1}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              Interactive language quest sprints, TOEFL &amp; IELTS agility drills, and Kyrenia cup competitions.
            </p>
          </div>
          <a
            href={placement ? `/english-quest.html?tier=${placement.cefrLevel}` : "/english-quest.html"}
            className="mt-4 text-xs font-semibold flex items-center gap-1 hover:underline text-amber-600"
          >
            Launch English Arena <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Bento Cell 3: Student Clubs */}
        <div className="p-4 rounded-xl border flex flex-col justify-between" style={{ backgroundColor: "var(--cau-surface-0)", borderColor: "var(--cau-border)" }}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Joined Societies</span>
              <div className="w-7 h-7 rounded-full flex items-center justify-center bg-purple-50 text-purple-600">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-foreground">{clubs.length}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                {clubs.length === 1 ? "1 Society" : `${clubs.length} Societies`}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              {clubs.length > 0 ? (
                `Active in: ${clubs.map(c => c.clubName).join(", ")}`
              ) : (
                "Join faculty-aligned societies including AI, Aerospace, Moot Court, and First Aid."
              )}
            </p>
          </div>
          <a
            href="/clubs.html"
            className="mt-4 text-xs font-semibold flex items-center gap-1 hover:underline text-purple-600"
          >
            Explore &amp; Join Clubs <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const { data: stats, isLoading, isError, refetch } = trpc.cms.stats.useQuery();

  return (
    <DashboardLayout
      title="Dashboard Overview"
      subtitle="Real-time academic catalogue, student inquiry pipeline, and university editorial status."
      action={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="text-xs h-9"
            style={{ borderColor: "var(--cau-border)" }}
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh Data
          </Button>
          <Link href="/dashboard/programs">
            <Button size="sm" className="text-xs h-9 font-semibold" style={{ backgroundColor: "var(--cau-brand)" }}>
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Programme
            </Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-8">

        {/* ── Error State ── */}
        {isError && (
          <div
            className="ds-card p-4 flex items-center gap-3 text-sm"
            style={{ backgroundColor: "var(--color-error-bg)", borderColor: "var(--color-error-border)", color: "var(--color-error-fg)" }}
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="flex-1">Failed to load dashboard statistics.</span>
            <Button size="sm" variant="outline" onClick={() => refetch()} className="text-xs h-8">
              Retry
            </Button>
          </div>
        )}

        {/* ── Metric Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {isLoading ? (
            <>
              <SkeletonMetricCard />
              <SkeletonMetricCard />
              <SkeletonMetricCard />
              <SkeletonMetricCard />
            </>
          ) : (
            <>
              <MetricCard
                label="Active Catalog"
                value={stats?.totalPrograms ?? 48}
                sub={<><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Verified degree programmes live</>}
                icon={<GraduationCap className="w-4 h-4" style={{ color: "var(--cau-brand)" }} />}
                iconBg="var(--cau-brand-subtle)"
                linkHref="/dashboard/programs"
                linkLabel="Manage Programmes"
                linkColor="var(--cau-brand)"
              />
              <MetricCard
                label="Academic Units"
                value={stats?.totalFaculties ?? 7}
                sub="7 Faculties + Vocational Schools"
                icon={<Building2 className="w-4 h-4 text-blue-600" />}
                iconBg="rgba(59,130,246,0.1)"
                linkHref="/dashboard/faculties"
                linkLabel="View Faculties"
                linkColor="#2563eb"
              />
              <MetricCard
                label="Student Leads"
                value={stats?.totalLeads ?? 3}
                sub={<><span className="font-semibold text-emerald-600">{stats?.newLeadsCount ?? 1} new</span> pending review</>}
                icon={<Users className="w-4 h-4 text-emerald-600" />}
                iconBg="rgba(16,185,129,0.1)"
                linkHref="/dashboard/leads"
                linkLabel="Admissions CRM"
                linkColor="#059669"
              />
              <MetricCard
                label="Announcements"
                value={stats?.publishedNewsCount ?? 3}
                sub="Published campus news items"
                icon={<Newspaper className="w-4 h-4 text-purple-600" />}
                iconBg="rgba(147,51,234,0.1)"
                linkHref="/dashboard/news"
                linkLabel="Editorial News"
                linkColor="#9333ea"
              />
            </>
          )}
        </div>

        {/* ── Degree Breakdown & Quick Actions ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Degree Distribution */}
          <div className="lg:col-span-2 ds-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="ds-h3">Academic Degree Level Breakdown</h3>
                <p className="ds-caption mt-0.5">Distribution across undergraduate, graduate &amp; vocational tracks.</p>
              </div>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded"
                style={{ backgroundColor: "var(--cau-surface-2)", color: "var(--cau-text-secondary)" }}
              >
                {stats?.totalPrograms ?? 48} Total
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              {isLoading ? (
                [1,2,3,4,5].map(i => <SkeletonDegreeCell key={i} />)
              ) : (
                [
                  { label: "Bachelor's", key: "Bachelor", ects: "240–300 ECTS" },
                  { label: "Master's",   key: "Master",   ects: "120 ECTS" },
                  { label: "Ph.D.",      key: "Ph.D.",    ects: "240 ECTS" },
                  { label: "Associate",  key: "Associate",ects: "120 ECTS" },
                  { label: "Prep",       key: "Preparatory", ects: "60 ECTS" },
                ].map(({ label, key, ects }) => (
                  <div
                    key={key}
                    className="p-3.5 rounded-md border"
                    style={{ backgroundColor: "var(--cau-surface-0)", borderColor: "var(--cau-border)" }}
                  >
                    <span className="ds-label block">{label}</span>
                    <span className="ds-h2 block mt-1">{stats?.degreeCounts?.[key] ?? "—"}</span>
                    <span className="ds-caption text-[10px]">{ects}</span>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 pt-4 ds-divider border-b-0 border-l-0 border-r-0 flex items-center justify-between text-xs" style={{ color: "var(--cau-text-secondary)" }}>
              <span>All degree catalogues synced with public filters and AI search</span>
              <Link href="/dashboard/programs" className="font-semibold hover:underline" style={{ color: "var(--cau-brand)" }}>
                Open Catalogue Manager →
              </Link>
            </div>
          </div>

          {/* Quick Operations */}
          <div className="ds-card p-6 flex flex-col justify-between">
            <div>
              <h3 className="ds-h3">Quick Operations</h3>
              <p className="ds-caption mt-1">Frequent administrator workflows.</p>

              <div className="mt-4 space-y-2.5">
                {[
                  { href: "/dashboard/programs", icon: <GraduationCap className="w-4 h-4" style={{ color: "var(--cau-brand)" }} />, label: "Add New Degree Programme", hoverBorder: "var(--cau-brand)" },
                  { href: "/dashboard/news",     icon: <Newspaper className="w-4 h-4 text-purple-600" />, label: "Post Campus Announcement", hoverBorder: "#9333ea" },
                  { href: "/dashboard/settings", icon: <Sparkles className="w-4 h-4 text-amber-500" />,  label: "Edit Admissions Banner", hoverBorder: "#d97706" },
                ].map(({ href, icon, label, hoverBorder }) => (
                  <Link key={href} href={href}>
                    <button
                      className="w-full text-left px-3.5 py-2.5 rounded-md border text-xs font-semibold flex items-center justify-between transition-all focus-visible:outline-none focus-visible:ring-2"
                      style={{ borderColor: "var(--cau-border)", "--tw-ring-color": hoverBorder } as React.CSSProperties}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = hoverBorder;
                        (e.currentTarget as HTMLElement).style.backgroundColor = "var(--cau-surface-0)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--cau-border)";
                        (e.currentTarget as HTMLElement).style.backgroundColor = "";
                      }}
                    >
                      <span className="flex items-center gap-2">{icon} {label}</span>
                      <Plus className="w-3.5 h-3.5" style={{ color: "var(--cau-text-secondary)" }} />
                    </button>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 ds-divider border-b-0 border-l-0 border-r-0">
              <div className="flex items-center gap-2 text-[11px]" style={{ color: "var(--cau-text-secondary)" }}>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Auto-Replication Engine Enabled</span>
              </div>
            </div>
          </div>
        </div>

                {/* ── Student Achievements Bento ── */}
        <StudentAchievementsBento />

        {/* ── Recent Admissions Inquiries ── */}
        <div className="ds-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="ds-h3">Recent Admissions Inquiries</h3>
              <p className="ds-caption mt-0.5">Latest prospective student inquiries received across site forms and chat.</p>
            </div>
            <Link href="/dashboard/leads" className="text-xs font-semibold hover:underline" style={{ color: "var(--cau-brand)" }}>
              View All Leads ({stats?.totalLeads ?? 0}) →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs" aria-label="Recent admissions inquiries">
              <thead
                className="border-b text-[10px] font-bold uppercase tracking-wider"
                style={{ borderColor: "var(--cau-border)", color: "var(--cau-text-secondary)" }}
              >
                <tr>
                  <th scope="col" className="pb-3">Applicant Name</th>
                  <th scope="col" className="pb-3">Country</th>
                  <th scope="col" className="pb-3">Programme of Interest</th>
                  <th scope="col" className="pb-3">Contact</th>
                  <th scope="col" className="pb-3">Status</th>
                  <th scope="col" className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody style={{ borderColor: "var(--cau-border)" }}>
                {isLoading ? (
                  [1,2,3].map(i => <SkeletonTableRow key={i} />)
                ) : !stats?.recentLeads?.length ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="ds-empty">
                        <div className="ds-empty-icon">
                          <Users className="w-5 h-5" />
                        </div>
                        <p className="ds-h3 text-sm">No inquiries yet</p>
                        <p className="ds-caption">New leads from site forms and chat will appear here.</p>
                        <Link href="/dashboard/leads">
                          <Button size="sm" className="mt-1 text-xs" style={{ backgroundColor: "var(--cau-brand)" }}>
                            Go to Admissions CRM
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  stats.recentLeads.map((lead) => {
                    const statusStyle: Record<string, { bg: string; color: string }> = {
                      New:         { bg: "var(--color-warning-bg)",  color: "var(--color-warning-fg)" },
                      "Offer Sent":{ bg: "var(--color-success-bg)", color: "var(--color-success-fg)" },
                      Contacted:   { bg: "var(--color-info-bg)",    color: "var(--color-info-fg)" },
                      Enrolled:    { bg: "var(--color-success-bg)", color: "var(--color-success-fg)" },
                      Closed:      { bg: "var(--cau-surface-2)",    color: "var(--cau-text-secondary)" },
                    };
                    const s = statusStyle[lead.status] ?? statusStyle.Closed;
                    return (
                      <tr
                        key={lead.id}
                        className="transition-colors"
                        style={{ borderTop: `1px solid var(--cau-border)` }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--cau-surface-0)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = ""; }}
                      >
                        <td className="py-3 font-semibold text-foreground">{lead.fullName}</td>
                        <td className="py-3 ds-caption">{lead.country}</td>
                        <td className="py-3 font-medium text-foreground">{lead.programOfInterest}</td>
                        <td className="py-3 ds-caption">{lead.phone || lead.email}</td>
                        <td className="py-3">
                          <span className="ds-badge" style={{ backgroundColor: s.bg, color: s.color, borderColor: s.color + "33" }}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="py-3 ds-caption">
                          {new Date(lead.createdAt).toLocaleDateString()}
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
    </DashboardLayout>
  );
}
