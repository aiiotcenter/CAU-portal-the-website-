import React, { useState } from "react";
import DashboardLayout from "./DashboardLayout";
import {
  Bot,
  Sparkles,
  Search,
  MessageSquare,
  Zap,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  Send,
  RefreshCw,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface FastPathRule {
  id: string;
  triggerKeywords: string[];
  topic: string;
  response: string;
  matchesCount: number;
  lastTriggered: string;
}

const initialRules: FastPathRule[] = [
  {
    id: "rule-1",
    triggerKeywords: ["tuition", "fees", "cost", "how much", "scholarship"],
    topic: "Tuition & 50% International Scholarship",
    response: "All accepted international undergraduate students at Cyprus Aydın University automatically receive a guaranteed 50% tuition scholarship! For example, Bachelor in Software Engineering is $3,200/year, and Dentistry is €11,500/year. Payment can be split into two installments per semester.",
    matchesCount: 642,
    lastTriggered: "12 mins ago",
  },
  {
    id: "rule-2",
    triggerKeywords: ["deadline", "apply", "intake", "fall", "spring"],
    topic: "Admissions Deadlines & Intakes",
    response: "Fall 2026 admissions are currently OPEN! Application deadline is September 15, 2026. Late applications can be accepted on special evaluation. Spring 2027 intake begins February 15, 2027.",
    matchesCount: 318,
    lastTriggered: "1 hour ago",
  },
  {
    id: "rule-3",
    triggerKeywords: ["visa", "transit", "turkey", "immigration", "embassy"],
    topic: "TRNC Student Visa & Transit Requirements",
    response: "International students do not need a TRNC visa in advance! You will obtain a student entry visa upon arrival at Ercan Airport (ECN) using your official CAU Acceptance Letter. Note: If flying via Turkey, you may require a Turkish transit visa depending on your nationality.",
    matchesCount: 284,
    lastTriggered: "3 hours ago",
  },
  {
    id: "rule-4",
    triggerKeywords: ["dormitory", "housing", "accommodation", "residence"],
    topic: "Campus Dormitories & Living Costs",
    response: "CAU provides modern student dormitories located within 5 minutes walking distance of Kyrenia Harbor campus. Room types include Single, Double, and Triple suites starting from $1,800/academic year, including Wi-Fi, 24/7 security, and utilities.",
    matchesCount: 195,
    lastTriggered: "5 hours ago",
  },
  {
    id: "rule-5",
    triggerKeywords: ["english", "prep", "toefl", "ielts", "exemption"],
    topic: "English Language Proficiency & Prep School",
    response: "Instruction is 100% in English for most faculties. Students without IELTS (min 5.5) or TOEFL (min 65) take the CAU English Proficiency Exam upon arrival. Those needing reinforcement attend CAU English Preparatory School for 1 or 2 semesters.",
    matchesCount: 156,
    lastTriggered: "Yesterday",
  },
];

const initialLogs = [
  { id: "log-1", query: "Can I pay my dentistry fees in two parts?",            matchedTopic: "Tuition & 50% International Scholarship",  confidence: "98%", source: "Website Chatbot", time: "4 mins ago",  status: "Answered" },
  { id: "log-2", query: "Do I need a transit visa through Istanbul airport?",   matchedTopic: "TRNC Student Visa & Transit Requirements",  confidence: "96%", source: "WhatsApp Bot",    time: "18 mins ago", status: "Answered" },
  { id: "log-3", query: "What is the tuition fee for Bachelor in Software Eng.",matchedTopic: "Tuition & 50% International Scholarship",  confidence: "99%", source: "Website Chatbot", time: "42 mins ago", status: "Answered" },
  { id: "log-4", query: "Is there a football team or gym on campus?",           matchedTopic: "Campus Dormitories & Living Costs",         confidence: "82%", source: "Website Chatbot", time: "1 hour ago",  status: "Answered" },
  { id: "log-5", query: "Can I transfer credits from my university in Jordan?", matchedTopic: "Admissions Deadlines & Intakes",            confidence: "78%", source: "WhatsApp Bot",    time: "2 hours ago", status: "Forwarded to Counselor" },
];

export default function AIAssistantPage() {
  const [rules]        = useState<FastPathRule[]>(initialRules);
  const [logs]         = useState(initialLogs);
  const [testQuery, setTestQuery]   = useState("");
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting]   = useState(false);
  const [searchRule, setSearchRule] = useState("");

  const handleTestBot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testQuery.trim()) return;
    setIsTesting(true);
    setTimeout(() => {
      const q       = testQuery.toLowerCase();
      const matched = rules.find((r) => r.triggerKeywords.some((k) => q.includes(k)));
      setTestResult(
        matched
          ? matched.response
          : `Cyprus Aydın University admissions representative has noted: "${testQuery}". For detailed faculty advisement, please email admissions@cau.edu.tr or call +90 392 650 00 00.`
      );
      setIsTesting(false);
    }, 400);
  };

  const filteredRules = rules.filter(
    (r) =>
      r.topic.toLowerCase().includes(searchRule.toLowerCase()) ||
      r.triggerKeywords.some((k) => k.toLowerCase().includes(searchRule.toLowerCase()))
  );

  const metrics = [
    { label: "Total Inquiries Handled", value: "1,595", sub: "↑ 14% vs last month",    subColor: "var(--color-success-fg)", icon: <Bot className="w-4 h-4" style={{ color: "var(--cau-brand)" }} /> },
    { label: "Fast-Path Accuracy",      value: "94.8%", sub: "Direct instant matches",  subColor: "var(--cau-text-secondary)", icon: <Zap className="w-4 h-4 text-amber-500" /> },
    { label: "Avg. Response Time",      value: "1.1s",  sub: "Real-time edge response", subColor: "var(--color-success-fg)", icon: <Clock className="w-4 h-4 text-blue-500" /> },
    { label: "Human Escalation Rate",   value: "5.2%",  sub: "Forwarded to counselors", subColor: "var(--cau-text-secondary)", icon: <MessageSquare className="w-4 h-4 text-purple-500" /> },
  ];

  return (
    <DashboardLayout
      title="AI Admissions Assistant & Knowledge Engine"
      subtitle="Supervise automated answers, manage fast-path knowledge responses, and inspect student chatbot conversations."
      action={
        <Button
          size="sm"
          onClick={() => toast.success("AI knowledge base synced across all student touchpoints")}
          className="text-xs font-semibold gap-1.5 text-white"
          style={{ backgroundColor: "var(--cau-brand)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--cau-brand-hover)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--cau-brand)"; }}
        >
          <RefreshCw className="w-3.5 h-3.5" /> Sync AI Knowledge
        </Button>
      }
    >
      {/* ── Health Metrics ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {metrics.map((m) => (
          <div key={m.label} className="ds-card p-4">
            <div className="flex items-center justify-between">
              <p className="ds-label">{m.label}</p>
              {m.icon}
            </div>
            <p className="ds-h1 text-2xl mt-2">{m.value}</p>
            <p className="text-[11px] mt-1 flex items-center gap-1 font-medium" style={{ color: m.subColor }}>
              {m.sub}
            </p>
          </div>
        ))}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── Left: Knowledge Base + Logs ── */}
        <div className="lg:col-span-7 space-y-4">

          {/* Fast-Path Knowledge Base */}
          <div className="ds-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="ds-h3">Fast-Path Knowledge Base</h3>
                <p className="ds-caption mt-0.5">
                  Pre-compiled official university answers that override LLM generation for instant, verified facts.
                </p>
              </div>
              <div className="relative w-48">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--cau-text-secondary)" }} />
                <Input
                  value={searchRule}
                  onChange={(e) => setSearchRule(e.target.value)}
                  placeholder="Filter topics..."
                  className="pl-8 text-xs h-8"
                  aria-label="Filter knowledge base rules"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredRules.length === 0 ? (
                <div className="ds-empty py-8">
                  <div className="ds-empty-icon"><HelpCircle className="w-5 h-5" /></div>
                  <p className="ds-caption">No rules match your filter.</p>
                </div>
              ) : (
                filteredRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-4 rounded-lg border transition-colors focus-within:ring-2 focus-within:ring-offset-1"
                    style={{ borderColor: "var(--cau-border)", backgroundColor: "color-mix(in srgb, var(--cau-surface-0) 60%, transparent)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(240,68,50,0.35)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--cau-border)"; }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="ds-h3 text-xs flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--cau-brand)" }} />
                        {rule.topic}
                      </div>
                      <span className="ds-badge ds-badge-success">{rule.matchesCount} triggers</span>
                    </div>

                    <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--cau-text-secondary)" }}>
                      {rule.response}
                    </p>

                    <div
                      className="flex items-center justify-between text-[11px] pt-2 border-t"
                      style={{ borderColor: "color-mix(in srgb, var(--cau-border) 60%, transparent)", color: "var(--cau-text-secondary)" }}
                    >
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="ds-label mr-1">Triggers:</span>
                        {rule.triggerKeywords.map((k) => (
                          <span
                            key={k}
                            className="px-1.5 py-0.5 rounded text-[10px] border font-mono"
                            style={{ backgroundColor: "var(--cau-surface-1)", borderColor: "var(--cau-border)" }}
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                      <span className="text-[10px] shrink-0">Active · {rule.lastTriggered}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Query Logs */}
          <div className="ds-card p-5">
            <h3 className="ds-h3 mb-1">Live Student Query Logs</h3>
            <p className="ds-caption mb-4">Real queries submitted through the homepage floating widget and WhatsApp gateway.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse" aria-label="AI assistant query logs">
                <thead>
                  <tr
                    className="border-b text-[10px] font-bold uppercase tracking-wider"
                    style={{ borderColor: "var(--cau-border)", color: "var(--cau-text-secondary)" }}
                  >
                    <th scope="col" className="py-2.5 px-3">Student Question</th>
                    <th scope="col" className="py-2.5 px-3">Matched Intent</th>
                    <th scope="col" className="py-2.5 px-3">Channel</th>
                    <th scope="col" className="py-2.5 px-3">Confidence</th>
                    <th scope="col" className="py-2.5 px-3 text-right">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-t transition-colors"
                      style={{ borderColor: "var(--cau-border)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--cau-surface-0)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = ""; }}
                    >
                      <td className="py-2.5 px-3 font-medium text-foreground max-w-xs truncate">"{log.query}"</td>
                      <td className="py-2.5 px-3 ds-caption">{log.matchedTopic}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded"
                          style={{ backgroundColor: "var(--cau-surface-2)", color: "var(--cau-text-secondary)" }}
                        >
                          {log.source}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-semibold" style={{ color: "var(--color-success-fg)" }}>
                        {log.confidence}
                      </td>
                      <td className="py-2.5 px-3 text-right ds-caption">{log.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Right: AI Sandbox ── */}
        <div className="lg:col-span-5 space-y-4">
          <div className="ds-card p-5 sticky top-6">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4" style={{ color: "var(--cau-brand)" }} />
              <h3 className="ds-h3">Assistant Testing Sandbox</h3>
            </div>
            <p className="ds-caption mb-4">
              Test queries in real-time to inspect how the system routes between knowledge rules and generative assistance.
            </p>

            <form onSubmit={handleTestBot} className="space-y-3">
              <div>
                <label htmlFor="ai-test-query" className="block text-xs font-semibold text-foreground mb-1">
                  Sample Student Inquiry:
                </label>
                <textarea
                  id="ai-test-query"
                  rows={3}
                  value={testQuery}
                  onChange={(e) => setTestQuery(e.target.value)}
                  placeholder="e.g. How much is tuition fee for dentistry? Are scholarships available?"
                  className="w-full text-xs p-3 rounded-lg border outline-none transition-all resize-none focus:ring-1"
                  style={{ borderColor: "var(--cau-border)", backgroundColor: "var(--cau-surface-0)" }}
                />
              </div>

              {/* Sample Prompts */}
              <div className="flex flex-wrap gap-1.5">
                {["Dentistry tuition?", "When is deadline for fall 2026?", "How to get student visa?", "Dormitory costs?"].map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => setTestQuery(sample)}
                    className="text-[10px] font-medium px-2 py-1 rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2"
                    style={{ backgroundColor: "var(--cau-surface-0)", borderColor: "var(--cau-border)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--cau-brand)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--cau-border)"; }}
                  >
                    {sample}
                  </button>
                ))}
              </div>

              <Button
                type="submit"
                disabled={isTesting || !testQuery.trim()}
                aria-busy={isTesting}
                className="w-full text-xs font-semibold gap-1.5 text-white"
                style={{ backgroundColor: "var(--cau-brand)" }}
                onMouseEnter={(e) => { if (!isTesting) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--cau-brand-hover)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--cau-brand)"; }}
              >
                {isTesting
                  ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Simulating AI Response…</>
                  : <><Send className="w-3.5 h-3.5" /> Simulate Response</>}
              </Button>
            </form>

            {/* Test Output */}
            {testResult && (
              <div
                className="mt-4 p-4 rounded-xl border animate-in fade-in"
                style={{ borderColor: "var(--color-success-border)", backgroundColor: "var(--color-success-bg)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: "var(--color-success-fg)" }}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Response Generated
                  </div>
                  <span className="text-[10px] font-mono" style={{ color: "var(--cau-text-secondary)" }}>0.32s latency</span>
                </div>
                <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">{testResult}</p>
              </div>
            )}

            {/* Integration Info */}
            <div
              className="pt-5 mt-5 border-t space-y-2"
              style={{ borderColor: "var(--cau-border)" }}
            >
              <h4 className="ds-label">Integration Endpoints</h4>
              <div
                className="p-3 rounded-lg text-xs space-y-1 font-mono"
                style={{ backgroundColor: "var(--cau-surface-0)" }}
              >
                <div className="flex justify-between" style={{ color: "var(--cau-text-secondary)" }}>
                  <span>Widget Embed:</span>
                  <span className="font-semibold" style={{ color: "var(--color-success-fg)" }}>Active (Homepage)</span>
                </div>
                <div className="flex justify-between" style={{ color: "var(--cau-text-secondary)" }}>
                  <span>WhatsApp Gateway:</span>
                  <span className="font-semibold" style={{ color: "var(--color-success-fg)" }}>+90 533 850 00 00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
