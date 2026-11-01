import React, { useState, useId } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { ShieldCheck, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [passkey, setPasskey]       = useState("");
  const [showPasskey, setShowPasskey] = useState(false);
  const passkeyId = useId();

  const loginMutation = trpc.cms.auth.login.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Welcome back to CAU CMS Console");
        setLocation("/dashboard");
      } else {
        toast.error(data.message || "Invalid administrator passkey");
      }
    },
    onError: (err) => toast.error(`Login error: ${err.message}`),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkey) return;
    loginMutation.mutate({ passkey });
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden"
      style={{ backgroundColor: "var(--cau-surface-0)", color: "var(--cau-text-primary)" }}
    >
      {/* Background ambient accents */}
      <div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: "var(--cau-brand-subtle)" }}
      />
      <div
        className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: "var(--cau-brand-subtle)" }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border shadow-sm mb-4 p-2 ds-card"
            style={{ backgroundColor: "var(--cau-surface-1)" }}
          >
            <img src="/assets/cau-mark_c0289719.png" alt="CAU Seal" className="w-full h-full object-contain" />
          </div>
          <h1 className="ds-h1 text-2xl">CAU CMS Admin Console</h1>
          <p className="ds-caption mt-1">Cyprus Aydın University Content Management System</p>
        </div>

        {/* Login Card */}
        <div className="ds-card p-8" style={{ boxShadow: "var(--shadow-panel)" }}>
          <div className="flex items-center gap-2 mb-6 text-xs" style={{ color: "var(--cau-text-secondary)" }}>
            <ShieldCheck className="w-4 h-4" style={{ color: "var(--cau-brand)" }} />
            <span>Secure administrative passkey authentication</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor={passkeyId} className="block text-xs font-semibold text-foreground mb-1.5">
                Administrator Passkey
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--cau-text-secondary)" }} />
                <Input
                  id={passkeyId}
                  type={showPasskey ? "text" : "password"}
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="Enter administrator passkey…"
                  required
                  autoFocus
                  autoComplete="current-password"
                  className="pl-9 pr-10 text-xs h-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasskey(!showPasskey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 focus-visible:outline-none focus-visible:ring-2 rounded"
                  style={{ color: "var(--cau-text-secondary)", "--tw-ring-color": "var(--cau-brand)" } as React.CSSProperties}
                  aria-label={showPasskey ? "Hide passkey" : "Show passkey"}
                  aria-controls={passkeyId}
                >
                  {showPasskey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] mt-2" style={{ color: "var(--cau-text-secondary)" }}>
                Default system passkey:{" "}
                <code
                  className="px-1.5 py-0.5 rounded font-mono"
                  style={{ backgroundColor: "var(--cau-surface-0)", color: "var(--cau-brand)" }}
                >
                  cau-admin-2026
                </code>{" "}
                or{" "}
                <code
                  className="px-1.5 py-0.5 rounded font-mono"
                  style={{ backgroundColor: "var(--cau-surface-0)", color: "var(--cau-brand)" }}
                >
                  admin
                </code>
              </p>
            </div>

            <Button
              type="submit"
              disabled={loginMutation.isPending || !passkey}
              aria-busy={loginMutation.isPending}
              className="w-full h-10 text-xs font-semibold gap-2 mt-2 text-white"
              style={{ backgroundColor: "var(--cau-brand)" }}
              onMouseEnter={(e) => { if (!loginMutation.isPending) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--cau-brand-hover)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--cau-brand)"; }}
            >
              {loginMutation.isPending
                ? "Authenticating…"
                : <><span>Access CMS Dashboard</span><ArrowRight className="w-4 h-4" /></>}
            </Button>
          </form>

          <div className="mt-6 pt-6 text-center" style={{ borderTop: "1px solid var(--cau-border)" }}>
            <a
              href="/"
              className="text-xs hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 rounded"
              style={{ color: "var(--cau-text-secondary)", "--tw-ring-color": "var(--cau-brand)" } as React.CSSProperties}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--cau-text-primary)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--cau-text-secondary)"; }}
            >
              ← Back to public university website
            </a>
          </div>
        </div>

        <div className="text-center mt-6 text-[11px]" style={{ color: "var(--cau-text-secondary)" }}>
          © {new Date().getFullYear()} Cyprus Aydın University. All rights reserved.
        </div>
      </div>
    </div>
  );
}
