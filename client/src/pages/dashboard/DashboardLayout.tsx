import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import {
  LayoutDashboard,
  GraduationCap,
  Building2,
  Newspaper,
  Users,
  Bot,
  Settings,
  ExternalLink,
  Sun,
  Moon,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const adminModules = [
  { label: "Overview",        path: "/dashboard",          icon: LayoutDashboard },
  { label: "Programmes",      path: "/dashboard/programs", icon: GraduationCap },
  { label: "Faculties & Staff", path: "/dashboard/faculties", icon: Building2 },
  { label: "News & Events",   path: "/dashboard/news",     icon: Newspaper },
  { label: "Admissions Leads",path: "/dashboard/leads",    icon: Users },
  { label: "AI Assistant",    path: "/dashboard/ai",       icon: Bot },
  { label: "Site Settings",   path: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children, title, subtitle, action }: DashboardLayoutProps) {
  const [location, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logoutMutation = trpc.cms.auth.logout.useMutation({
    onSuccess: () => {
      setLocation("/dashboard/login");
    },
  });

  return (
    <div className="min-h-screen text-foreground flex" style={{ backgroundColor: "var(--cau-surface-0)" }}>
      {/* WCAG 2.1 AA Bypass Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:text-white focus:font-semibold focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{ backgroundColor: "var(--cau-brand)" }}
      >
        Skip to main content
      </a>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar Navigation ── */}
      <aside
        id="sidebar-navigation"
        aria-label="Sidebar navigation"
        className={`w-64 flex flex-col fixed inset-y-0 z-40 transition-transform duration-200 lg:translate-x-0 ds-card rounded-none border-t-0 border-b-0 border-l-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 ds-divider border-t-0 border-r-0 border-l-0 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 group rounded-md focus-visible:outline-none focus-visible:ring-2"
            style={{ "--tw-ring-color": "var(--cau-brand)" } as React.CSSProperties}
          >
            <img
              src="/assets/cau-mark_c0289719.png"
              alt="Cyprus Aydın University Seal"
              className="w-8 h-8 object-contain"
            />
            <div>
              <div className="ds-h3 text-sm uppercase flex items-center gap-1.5" style={{ letterSpacing: "0.04em" }}>
                CAU CMS
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: "var(--cau-brand-subtle)", color: "var(--cau-brand)" }}
                >
                  v2.0
                </span>
              </div>
              <p className="ds-caption text-[11px]">Cyprus Aydın University</p>
            </div>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden h-8 w-8 p-0"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation sidebar"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto" aria-label="Main navigation">
          <div className="px-3 py-2 ds-label">Core Management Modules</div>
          {adminModules.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === "/dashboard"
                ? location === "/dashboard"
                : location.startsWith(item.path);

            return (
              <Link
                key={item.path}
                href={item.path}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2"
                style={
                  isActive
                    ? {
                        backgroundColor: "var(--cau-brand)",
                        color: "#ffffff",
                        boxShadow: "0 1px 4px rgba(240,68,50,0.3)",
                        "--tw-ring-color": "var(--cau-brand)",
                      } as React.CSSProperties
                    : {
                        color: "var(--cau-text-secondary)",
                        "--tw-ring-color": "var(--cau-brand)",
                      } as React.CSSProperties
                }
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "var(--cau-surface-2)";
                    (e.currentTarget as HTMLElement).style.color = "var(--cau-text-primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "";
                    (e.currentTarget as HTMLElement).style.color = "var(--cau-text-secondary)";
                  }
                }}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Live Shortcuts & Footer */}
        <div className="p-3 ds-divider border-b-0 border-l-0 border-r-0 space-y-1">
          <div className="px-3 py-1 ds-label">Live Preview</div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2"
            style={{ color: "var(--cau-text-secondary)", "--tw-ring-color": "var(--cau-brand)" } as React.CSSProperties}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "var(--cau-surface-2)";
              (e.currentTarget as HTMLElement).style.color = "var(--cau-text-primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "";
              (e.currentTarget as HTMLElement).style.color = "var(--cau-text-secondary)";
            }}
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" /> Homepage
            </span>
            <span className="text-[10px] font-semibold" style={{ color: "var(--cau-brand)" }}>View ↗</span>
          </a>
          <a
            href="/programs.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2"
            style={{ color: "var(--cau-text-secondary)", "--tw-ring-color": "var(--cau-brand)" } as React.CSSProperties}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "var(--cau-surface-2)";
              (e.currentTarget as HTMLElement).style.color = "var(--cau-text-primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "";
              (e.currentTarget as HTMLElement).style.color = "var(--cau-text-secondary)";
            }}
          >
            <span className="flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5" /> Catalog
            </span>
            <span className="text-[10px] font-semibold" style={{ color: "var(--cau-brand)" }}>View ↗</span>
          </a>

          <div className="pt-2 flex items-center justify-between ds-divider border-b-0 border-l-0 border-r-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleTheme?.()}
              className="h-8 px-2 text-xs focus-visible:ring-2"
              title="Toggle theme (Light / Dark)"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              style={{ "--tw-ring-color": "var(--cau-brand)" } as React.CSSProperties}
            >
              {theme === "dark"
                ? <Sun className="w-4 h-4 text-amber-400" />
                : <Moon className="w-4 h-4" style={{ color: "var(--cau-text-secondary)" }} />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              className="h-8 px-2 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 focus-visible:ring-2 focus-visible:ring-rose-500"
              aria-label="Log out of administrator session"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* ── Main Content Container ── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top App Bar */}
        <header
          className="h-16 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between backdrop-blur-md border-b"
          style={{
            backgroundColor: "color-mix(in srgb, var(--cau-surface-1) 90%, transparent)",
            borderColor: "var(--cau-border)",
          }}
        >
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden h-9 w-9 p-0 focus-visible:ring-2"
              onClick={() => setMobileMenuOpen(true)}
              aria-expanded={mobileMenuOpen}
              aria-controls="sidebar-navigation"
              aria-label="Open navigation sidebar"
              style={{ "--tw-ring-color": "var(--cau-brand)" } as React.CSSProperties}
            >
              <Menu className="w-5 h-5" />
            </Button>

            <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs" style={{ color: "var(--cau-text-secondary)" }}>
              <span>CAU CMS</span>
              <ChevronRight className="w-3 h-3" />
              <span className="font-semibold text-foreground">{title}</span>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-semibold border"
              style={{
                color: "var(--color-success-fg)",
                backgroundColor: "var(--color-success-bg)",
                borderColor: "var(--color-success-border)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Server Active
            </div>

            <div className="flex items-center gap-2 pl-4" style={{ borderLeft: "1px solid var(--cau-border)" }}>
              <div
                className="w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-xs"
                style={{ backgroundColor: "var(--cau-brand)" }}
              >
                A
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold leading-none">Admin User</p>
                <p className="text-[10px]" style={{ color: "var(--cau-text-secondary)" }}>Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Header & Action Bar */}
        <div className="p-4 sm:p-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="ds-h1">{title}</h1>
            {subtitle && (
              <p className="ds-caption mt-1 max-w-2xl">{subtitle}</p>
            )}
          </div>
          {action && <div className="flex items-center gap-3 shrink-0">{action}</div>}
        </div>

        {/* Accessible Main Landmark */}
        <main id="main-content" tabIndex={-1} className="flex-1 p-4 sm:p-8 pt-2 focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
