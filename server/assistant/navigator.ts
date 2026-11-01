import { z } from "zod";
import { invokeLLM } from "../_core/llm";
import { ENV } from "../_core/env";
import { CMSStorageEngine } from "../cms/storageEngine";
import { CAU_ASSISTANT_SYSTEM_PROMPT } from "./knowledge";

export const CAU_NAVIGATOR_PROMPT = `You are the official CAU AI Navigator for Cyprus Aydın University (CAU) in Kyrenia, Northern Cyprus.
Your job is to strictly use the provided CAU official catalog and handbook data to assist prospective and current students.
Never invent programs or fees not present in CAU data. If not found, say so politely.`;

// Helper to sanitize payload whether it's an object or string
function parseQuery(payload: any): string {
  if (typeof payload === "string") return payload;
  if (payload && typeof payload === "object") {
    return payload.query || payload.val || payload.text || payload.search || JSON.stringify(payload);
  }
  return "";
}

// 1. AI Program Finder
export async function handleProgramFinder(payload: any) {
  const queryStr = parseQuery(payload);
  const programs = CMSStorageEngine.getPrograms();
  const minimalCatalog = programs.map((p) => ({
    slug: p.slug,
    name: p["Program Name"],
    degree: p["Degree Level"],
    language: p.Language,
    department: p.Department,
    summary: p.summary,
  }));

  let matches: Array<{ slug: string; name: string; matchPercentage: number; reason: string; degree: string }> = [];

  try {
    const completion = await invokeLLM({
      model: ENV.llmModel || "gemini-3.7-flash",
      max_tokens: 1000,
      messages: [
        {
          role: "system",
          content: `${CAU_NAVIGATOR_PROMPT}\n\nPROGRAM CATALOG:\n${JSON.stringify(minimalCatalog)}\n\nAnalyze the student's interest and pick the top 3 best matching programs from the catalog with percentage (60-98%) and a brief reason grounded in the curriculum.`,
        },
        { role: "user", content: `Match programs for: ${queryStr}` },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "program_finder_results",
          strict: true,
          schema: {
            type: "object",
            properties: {
              matches: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    slug: { type: "string" },
                    name: { type: "string" },
                    matchPercentage: { type: "number" },
                    reason: { type: "string" },
                    degree: { type: "string" },
                  },
                  required: ["slug", "name", "matchPercentage", "reason", "degree"],
                  additionalProperties: false,
                },
              },
            },
            required: ["matches"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = completion.choices[0]?.message.content;
    const parsed = JSON.parse(typeof content === "string" ? content : "{}");
    if (Array.isArray(parsed.matches) && parsed.matches.length > 0) {
      matches = parsed.matches;
    }
  } catch (err) {
    console.warn("[Navigator] Program finder LLM fallback:", err);
  }

  // Deterministic catalog fallback if LLM returned empty
  if (!matches.length) {
    const lower = queryStr.toLowerCase();
    const scored = minimalCatalog
      .map((p) => {
        let score = 50;
        const text = `${p.name} ${p.department} ${p.summary || ""}`.toLowerCase();
        if (lower.split(/\s+/).some((w) => w.length > 3 && text.includes(w))) score += 35;
        if (lower.includes("tech") || lower.includes("software") || lower.includes("computer")) {
          if (text.includes("software") || text.includes("computer") || text.includes("security")) score += 40;
        }
        if (lower.includes("business") || lower.includes("manage") || lower.includes("finance")) {
          if (text.includes("business") || text.includes("banking") || text.includes("finance")) score += 40;
        }
        return { ...p, score: Math.min(score, 95) };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    matches = scored.map((s, idx) => ({
      slug: s.slug,
      name: s.name,
      matchPercentage: idx === 0 ? 94 : idx === 1 ? 86 : 78,
      reason: `Directly aligns with your interest in ${queryStr} through courses in ${s.department}.`,
      degree: s.degree || "Bachelor's",
    }));
  }

  const html = `
<div class="cau-navigator-result">
  <div style="font-weight:700; margin-bottom:8px; font-size:14.5px;">🎓 Top Matching CAU Programs for You:</div>
  <div style="display:flex; flex-direction:column; gap:8px;">
    ${matches
      .map(
        (m, idx) => `
      <div style="background:var(--cau-chat-bg,#fff); border:1px solid var(--cau-chat-chip-border,#e5e7eb); border-radius:8px; padding:10px 12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <a href="/programs/${m.slug}.html" target="_blank" style="font-weight:700; color:var(--cau-chat-primary,#f04432); text-decoration:underline; font-size:13.5px;">
            ${idx === 0 ? "🥇 " : idx === 1 ? "🥈 " : "🥉 "}${m.name}
          </a>
          <span style="font-size:11.5px; font-weight:700; background:rgba(240,68,50,0.1); color:var(--cau-chat-primary,#f04432); padding:2px 8px; border-radius:12px;">
            ${m.matchPercentage}% Match
          </span>
        </div>
        <div style="font-size:12px; color:var(--cau-chat-muted,#5e6065); line-height:1.4;">${m.reason}</div>
        <div style="margin-top:6px; font-size:11px; color:var(--cau-chat-text,#111);"><strong>Degree:</strong> ${m.degree || "Bachelor"} · <strong>Campus:</strong> Kyrenia</div>
      </div>`
      )
      .join("")}
  </div>
</div>`;

  const answer = `Based on your interest in "${queryStr}", here are your best matching CAU programs:\n` +
    matches.map((m, i) => `${i + 1}. **${m.name}** (${m.matchPercentage}% Match) — ${m.reason}`).join("\n");

  return {
    data: { matches },
    html,
    answer,
    suggestedChips: [
      { label: "💰 Calculate Tuition", action: "tuition_calculator", prompt: `How much does ${matches[0]?.name || "Software Engineering"} cost?` },
      { label: "📄 Explain Curriculum", action: "course_explainer", prompt: `Explain the courses and difficulty of ${matches[0]?.name || "Software Engineering"}` },
      { label: "📝 How to Apply", action: "application_process", prompt: `What are the application steps for ${matches[0]?.name || "Software Engineering"}?` },
    ],
  };
}

// 2. AI Explain This Program & Course Explainer
export async function handleProgramExplainer(payload: any) {
  const queryStr = parseQuery(payload);
  const slug = (payload && typeof payload === "object" ? payload.slug : "") || "";
  const programs = CMSStorageEngine.getPrograms();
  const program = programs.find((p) => p.slug === slug || queryStr.toLowerCase().includes(p.slug) || queryStr.toLowerCase().includes(p["Program Name"].toLowerCase()));

  const programName = program ? program["Program Name"] : (slug || queryStr);
  const degree = program ? program["Degree Level"] : "Bachelor";
  const duration = program ? program.Duration : "4 Years";
  const fee = program ? (program["Price / Tuition"] || "10,000 USD/year (50%–100% scholarships available)") : "$10,000 USD/yr (up to 100% scholarship)";

  const isCourseQuery = /data structures|operating systems|algorithm|calculus|database|network|circuit|machine learning|physics|chemistry/i.test(queryStr);

  let explanation = "";
  let highlights: string[] = [];

  try {
    const completion = await invokeLLM({
      model: ENV.llmModel || "gemini-3.7-flash",
      max_tokens: 1000,
      messages: [
        {
          role: "system",
          content: `${CAU_NAVIGATOR_PROMPT}\n\nPROGRAM/COURSE DATA:\n${JSON.stringify(program || { name: programName, degree, duration, fee })}\n\nExplain this program or course concisely: what students learn, difficulty level, career relevance, and prerequisites.`,
        },
        { role: "user", content: `Explain: ${queryStr}` },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "explainer_result",
          strict: true,
          schema: {
            type: "object",
            properties: {
              explanation: { type: "string" },
              highlights: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: ["explanation", "highlights"],
            additionalProperties: false,
          },
        },
      },
    });
    const rawContent = completion.choices[0]?.message.content;
    const contentStr = typeof rawContent === "string" ? rawContent : "";
    const parsed = JSON.parse(contentStr || "{}");
    if (parsed.explanation) {
      explanation = parsed.explanation;
      highlights = parsed.highlights || [];
    }
  } catch (err) {
    console.warn("[Navigator] Explainer LLM fallback:", err);
  }

  if (!explanation) {
    if (isCourseQuery) {
      explanation = `**${queryStr}** is a core foundational course at Cyprus Aydın University. It equips students with practical problem-solving methods, modern software or engineering tools, and theoretical principles required for advanced research and industry capstone projects.`;
      highlights = ["Prerequisites: Foundational computing and mathematics", "Difficulty: Moderate to Rigorous", "Career Relevance: Fundamental skill evaluated in technical job interviews"];
    } else {
      explanation = `**${programName}** at Cyprus Aydın University is a comprehensive ${degree} program designed to bridge theoretical fundamentals with hands-on industrial practice in Kyrenia.`;
      highlights = [
        `Duration: ${duration} (${(program as any)?.ECTS || "240 ECTS"})`,
        `Language: ${program?.Language || "English"}`,
        `Accreditation: YÖDAK & YÖK Recognised`,
        `Dual-Degree / Partner Exchange opportunities through Istanbul Aydın University (IAU)`,
      ];
    }
  }

  const html = `
<div class="cau-navigator-result">
  <div style="font-weight:700; font-size:14.5px; color:var(--cau-chat-primary,#f04432); margin-bottom:6px;">
    📚 ${isCourseQuery ? "Course Overview" : "Program Profile"}: ${programName}
  </div>
  <p style="font-size:13px; line-height:1.45; margin-bottom:8px;">${explanation}</p>
  <div style="background:var(--cau-chat-bg,#fff); border:1px solid var(--cau-chat-chip-border,#e5e7eb); border-radius:8px; padding:8px 12px; font-size:12px;">
    <strong style="display:block; margin-bottom:4px; font-size:11px; text-transform:uppercase; color:var(--cau-chat-muted,#666);">Key Details:</strong>
    <ul style="margin:0; padding-left:16px;">
      ${highlights.map((h) => `<li style="margin-bottom:2px;">${h}</li>`).join("")}
    </ul>
  </div>
  ${program ? `<div style="margin-top:8px;"><a href="/programs/${program.slug}.html" target="_blank" style="font-size:12px; color:var(--cau-chat-primary,#f04432); font-weight:700; text-decoration:underline;">View Full Curriculum &amp; Faculty →</a></div>` : ""}
</div>`;

  return {
    data: { programName, explanation, highlights },
    html,
    answer: `${explanation}\n\n` + highlights.map((h) => `• ${h}`).join("\n"),
    suggestedChips: [
      { label: "💰 Calculate Tuition", action: "tuition_calculator", prompt: `How much is tuition for ${programName}?` },
      { label: "📝 Admission Requirements", action: "check_admissions", prompt: `What are the admission requirements for ${programName}?` },
      { label: "💬 WhatsApp Advisor", prompt: `Can I speak to an admissions advisor about ${programName}?` },
    ],
  };
}

// 3. AI Tuition Calculator
export async function handleTuitionCalculator(payload: any) {
  const queryStr = parseQuery(payload);
  const lower = queryStr.toLowerCase();

  let programType = "Bachelor";
  if (lower.includes("dentist") || lower.includes("diş")) programType = "Dentistry";
  else if (lower.includes("master") || lower.includes("mba") || lower.includes("msc") || lower.includes("m.s.")) programType = "Master";
  else if (lower.includes("phd") || lower.includes("doctorate") || lower.includes("doktora")) programType = "PhD";

  let scholarshipPercent = 50;
  if (lower.includes("100%")) scholarshipPercent = 100;
  else if (lower.includes("90%")) scholarshipPercent = 90;
  else if (lower.includes("85%")) scholarshipPercent = 85;
  else if (lower.includes("80%")) scholarshipPercent = 80;
  else if (lower.includes("70%")) scholarshipPercent = 70;
  else if (lower.includes("60%")) scholarshipPercent = 60;
  else if (lower.includes("sat 1300") || lower.includes("sat 1400")) scholarshipPercent = 100;
  else if (lower.includes("sat 1200") || lower.includes("transfer")) scholarshipPercent = 85;

  let baseTuition = 10000;
  const fixedFee = 600; // Registration, VAT, and student activity
  let deposit = 1250;

  if (programType === "Dentistry") {
    baseTuition = 22000;
    deposit = 2500;
  } else if (programType === "Master") {
    baseTuition = 7000; // Total program
  } else if (programType === "PhD") {
    baseTuition = 12000; // Total program
    deposit = 1500;
  }

  const discountedTuition = Math.round(baseTuition * (1 - scholarshipPercent / 100));
  const estimatedTotal = discountedTuition + fixedFee;

  const html = `
<div class="cau-navigator-result">
  <div style="font-weight:700; font-size:14.5px; color:var(--cau-chat-primary,#f04432); margin-bottom:8px;">
    🧮 CAU Official Tuition Breakdown (${programType} Degree)
  </div>
  <div style="background:var(--cau-chat-bg,#fff); border:1px solid var(--cau-chat-chip-border,#e5e7eb); border-radius:8px; padding:12px; font-size:13px; line-height:1.5;">
    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
      <span>Standard Published Tuition:</span>
      <strong>$${baseTuition.toLocaleString()} USD</strong>
    </div>
    <div style="display:flex; justify-content:space-between; margin-bottom:4px; color:#16a34a;">
      <span>Merit Scholarship (${scholarshipPercent}% Waiver):</span>
      <strong>-$${(baseTuition - discountedTuition).toLocaleString()} USD</strong>
    </div>
    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
      <span>Net Tuition Payable:</span>
      <strong>$${discountedTuition.toLocaleString()} USD</strong>
    </div>
    <div style="display:flex; justify-content:space-between; margin-bottom:6px; color:var(--cau-chat-muted,#666); font-size:12px;">
      <span>Annual Registration &amp; VAT Fee:</span>
      <span>+$${fixedFee} USD</span>
    </div>
    <div style="border-top:1px solid var(--cau-chat-chip-border,#e5e7eb); padding-top:6px; display:flex; justify-content:space-between; font-size:14px; font-weight:700; color:var(--cau-chat-primary,#f04432);">
      <span>Estimated Net Total:</span>
      <span>$${estimatedTotal.toLocaleString()} USD</span>
    </div>
  </div>
  <div style="margin-top:8px; font-size:12px; color:var(--cau-chat-muted,#5e6065); line-height:1.4;">
    • <strong>Unconditional Offer Deposit:</strong> $${deposit.toLocaleString()} USD (credited toward first semester).<br/>
    • <strong>Installment Plan:</strong> Remaining tuition can be paid in 2 equal semester installments.<br/>
    • <strong>Dormitory:</strong> International Aydın Dormitory priced separately in Euros (€2,800 – €5,500/yr).
  </div>
</div>`;

  const answer = `**Official CAU Tuition Estimate (${programType})**:\n\n` +
    `• Standard Tuition: **$${baseTuition.toLocaleString()} USD**\n` +
    `• With ${scholarshipPercent}% Scholarship: **$${discountedTuition.toLocaleString()} USD**\n` +
    `• Annual Registration & VAT: **$${fixedFee} USD**\n` +
    `• **Net Total Payable: $${estimatedTotal.toLocaleString()} USD**\n` +
    `• Initial Unconditional Deposit: $${deposit.toLocaleString()} USD.`;

  return {
    data: { programType, scholarshipPercent, baseTuition, discountedTuition, fixedFee, estimatedTotal, deposit },
    html,
    answer,
    suggestedChips: [
      { label: "🏆 Check 85%–100% SAT Rules", prompt: "How do I qualify for 85% or 100% SAT scholarship?" },
      { label: "📝 Start Online Application", action: "application_process", prompt: "How do I apply for this program?" },
      { label: "🏢 Dormitory Pricing (€)", prompt: "What are the dormitory prices in Kyrenia?" },
    ],
  };
}

// 4. AI University Guide (Step-by-step student journey)
export async function handleUniversityGuide(payload: any) {
  const steps = [
    { num: 1, title: "Online Application", desc: "Submit passport and certificates on apply.cau.edu.tr to get Conditional Acceptance.", link: "https://international.cau.edu.tr/apply/" },
    { num: 2, title: "Deposit & Visa Letter", desc: "Pay $1,250 USD deposit to receive Official Acceptance Letter for Ercan Airport transit visa.", link: "https://international.cau.edu.tr/tuition-fees/" },
    { num: 3, title: "Free Airport Pickup", desc: "Send flight details to admission@cau.edu.tr for complimentary transfer from Ercan (ECN).", link: "/contact.html" },
    { num: 4, title: "Dormitory Check-in", desc: "Settle into International Aydın Student Residence in Kyrenia with free campus shuttles.", link: "https://international.cau.edu.tr/accommodation/" },
    { num: 5, title: "Final Registration", desc: "Submit original certificates at Student Affairs (Burcu TUNAY) and get Student ID.", link: "/about.html" },
    { num: 6, title: "TRNC Residence Permit (İkamet)", desc: "University guides you through the official online student residence permit portal.", link: "/student-life.html" },
    { num: 7, title: "Orientation & Classes", desc: "Take English exam (if needed), join club fairs, and begin academic courses.", link: "/programs.html" },
  ];

  const html = `
<div class="cau-navigator-result">
  <div style="font-weight:700; font-size:14.5px; color:var(--cau-chat-primary,#f04432); margin-bottom:8px;">
    🧭 Your Complete CAU Student Journey (Admission to First Class)
  </div>
  <div style="display:flex; flex-direction:column; gap:6px;">
    ${steps
      .map(
        (s) => `
      <div style="display:flex; gap:10px; background:var(--cau-chat-bg,#fff); border:1px solid var(--cau-chat-chip-border,#e5e7eb); border-radius:8px; padding:8px 10px; font-size:12.5px;">
        <span style="display:grid; place-items:center; width:22px; height:22px; border-radius:50%; background:var(--cau-chat-primary,#f04432); color:#fff; font-size:11px; font-weight:700; flex-shrink:0;">${s.num}</span>
        <div style="flex:1;">
          <div style="font-weight:700;">${s.title}</div>
          <div style="font-size:11.5px; color:var(--cau-chat-muted,#666);">${s.desc}</div>
        </div>
      </div>`
      )
      .join("")}
  </div>
</div>`;

  const answer = `**Your Step-by-Step CAU Student Journey:**\n\n` +
    steps.map((s) => `${s.num}. **${s.title}**: ${s.desc}`).join("\n");

  return {
    data: { steps },
    html,
    answer,
    suggestedChips: [
      { label: "📝 Required Application Documents", action: "application_process", prompt: "What documents do I need to apply?" },
      { label: "💰 Tuition & Deposit Details", action: "tuition_calculator", prompt: "What is the tuition deposit amount?" },
      { label: "🏢 Dormitory Accommodation", prompt: "Tell me about student dormitories in Kyrenia." },
    ],
  };
}

// 5. “I'm an International Student” Mode (Country-specific Guidance)
export async function handleInternationalMode(payload: any) {
  const queryStr = parseQuery(payload);
  const lower = queryStr.toLowerCase();

  let country = "International";
  let certificate = "High School Graduation Certificate & Transcript";
  let notes = "Verified by Ministry of Education or Apostille.";

  if (lower.includes("nigeria") || lower.includes("west africa")) {
    country = "Nigeria 🇳🇬";
    certificate = "WAEC / NECO Senior School Certificate Examination (SSCE)";
    notes = "Minimum 5 credits including English and Mathematics. Scratch cards accepted for online verification.";
  } else if (lower.includes("pakistan")) {
    country = "Pakistan 🇵🇰";
    certificate = "HSSC (Intermediate) / F.Sc / FA Certificate & Mark Sheet";
    notes = "Attested by IBCC (Inter Board Committee of Chairmen). Valid for Bachelor entry.";
  } else if (lower.includes("yemen")) {
    country = "Yemen 🇾🇪";
    certificate = "Al-Thanawiya (General Secondary Education Certificate)";
    notes = "Minimum passing percentage in scientific or literary stream. Translated to English or Turkish.";
  } else if (lower.includes("india")) {
    country = "India 🇮🇳";
    certificate = "Higher Secondary Certificate (HSC) / 10+2 All India Senior School Certificate";
    notes = "CBSE, ICSE, or State Boards accepted with minimum 50% aggregate.";
  } else if (lower.includes("syria") || lower.includes("jordan") || lower.includes("palestine") || lower.includes("iraq")) {
    country = "Middle East / Arab Nations";
    certificate = "Tawjihi / Baccalaureate / Secondary School Certificate";
    notes = "Original Arabic certificate plus certified English or Turkish translation.";
  } else if (lower.includes("russia") || lower.includes("kazakhstan") || lower.includes("uzbekistan")) {
    country = "CIS Countries";
    certificate = "Attestat o Srednem Obshchem Obrazovanii";
    notes = "Official apostilled copy with notarized translation.";
  }

  const html = `
<div class="cau-navigator-result">
  <div style="font-weight:700; font-size:14.5px; color:var(--cau-chat-primary,#f04432); margin-bottom:8px;">
    🌍 International Pathway: ${country}
  </div>
  <div style="background:var(--cau-chat-bg,#fff); border:1px solid var(--cau-chat-chip-border,#e5e7eb); border-radius:8px; padding:10px 12px; font-size:12.5px; line-height:1.45;">
    <div style="margin-bottom:6px;"><strong>📜 Accepted High School Certificate:</strong><br/>${certificate}</div>
    <div style="margin-bottom:6px;"><strong>🔍 Verification &amp; Equivalency:</strong><br/>${notes}</div>
    <div style="margin-bottom:6px;"><strong>✈️ Visa &amp; Transit:</strong><br/>Transit flight via Turkey to Ercan Airport (ECN). No TRNC transit visa required if remaining in airport transit area with CAU Acceptance Letter.</div>
    <div><strong>🎁 Airport Assistance:</strong><br/>Free airport pickup from Ercan (ECN) upon submitting flight details to admission@cau.edu.tr.</div>
  </div>
</div>`;

  const answer = `**Country-Specific Guidance for ${country}**:\n\n` +
    `• **Required Certificate**: ${certificate}\n` +
    `• **Requirements**: ${notes}\n` +
    `• **Transit & Visa**: Travel via Turkey to Ercan (ECN) with CAU Acceptance Letter.\n` +
    `• **Airport Transfer**: Free pickup provided by CAU.`;

  return {
    data: { country, certificate, notes },
    html,
    answer,
    suggestedChips: [
      { label: "📝 Application Checklist", action: "application_process", prompt: `What documents do I need to submit from ${country}?` },
      { label: "💰 Scholarship Availability", prompt: `What scholarships are available for students from ${country}?` },
      { label: "💬 Chat on WhatsApp", prompt: "Can I get an advisor to check my certificate on WhatsApp?" },
    ],
  };
}

// 6. AI Application Assistant (Interactive Checklist)
export async function handleApplicationProcess(payload: any) {
  const checklist = [
    { item: "Valid International Passport (Bio-data page)", required: true, icon: "☑" },
    { item: "High School Diploma / Secondary School Certificate", required: true, icon: "☑" },
    { item: "Official Academic Transcripts / Statement of Results", required: true, icon: "☑" },
    { item: "English Proficiency (IELTS 5.0 / Duolingo 85 or take CAU EPE on campus)", required: false, icon: "☐" },
    { item: "4 Passport-Sized Biometric Photographs (White background)", required: true, icon: "☑" },
    { item: "$1,250 USD Deposit (Secures Unconditional Acceptance & Transit Visa)", required: true, icon: "☑" },
  ];

  const html = `
<div class="cau-navigator-result">
  <div style="font-weight:700; font-size:14.5px; color:var(--cau-chat-primary,#f04432); margin-bottom:8px;">
    📝 Your Official CAU Application Checklist
  </div>
  <div style="background:var(--cau-chat-bg,#fff); border:1px solid var(--cau-chat-chip-border,#e5e7eb); border-radius:8px; padding:10px 12px; font-size:12.5px;">
    <div style="display:flex; flex-direction:column; gap:6px;">
      ${checklist
        .map(
          (c) => `
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:14px; color:${c.required ? 'var(--cau-chat-primary,#f04432)' : 'var(--cau-chat-muted,#666)'}; font-weight:700;">${c.icon}</span>
          <span style="flex:1;">${c.item}</span>
          ${c.required ? '<span style="font-size:10px; background:#fee2e2; color:#ef4444; padding:1px 6px; border-radius:4px; font-weight:600;">Required</span>' : '<span style="font-size:10px; background:#f3f4f6; color:#6b7280; padding:1px 6px; border-radius:4px;">Optional</span>'}
        </div>`
        )
        .join("")}
    </div>
    <div style="margin-top:10px; padding-top:8px; border-top:1px solid var(--cau-chat-chip-border,#e5e7eb); display:flex; justify-content:space-between; align-items:center;">
      <span style="font-size:11.5px; color:var(--cau-chat-muted,#666);">Submissions processed within 24–48 hours</span>
      <a href="https://international.cau.edu.tr/apply/" target="_blank" style="display:inline-block; background:var(--cau-chat-primary,#f04432); color:#fff; padding:5px 12px; border-radius:6px; font-size:12px; font-weight:700; text-decoration:none;">Open Portal ↗</a>
    </div>
  </div>
</div>`;

  const answer = `**Official CAU Application Checklist:**\n\n` +
    checklist.map((c) => `${c.icon} ${c.item} ${c.required ? "*(Required)*" : "*(Optional / Can take on campus)*"}`).join("\n") +
    `\n\nSubmit your documents directly at **apply.cau.edu.tr** or email **admission@cau.edu.tr**.`;

  return {
    data: { checklist },
    html,
    answer,
    suggestedChips: [
      { label: "💰 Calculate Net Tuition", action: "tuition_calculator", prompt: "How much is tuition with scholarships?" },
      { label: "🌍 Country Document Guidelines", action: "international_mode", prompt: "What are the guidelines for my country?" },
      { label: "💬 WhatsApp Admissions", prompt: "Can I send my documents to an advisor on WhatsApp?" },
    ],
  };
}

// 8. AI Semantic Search
export async function handleAISearch(payload: any) {
  const queryStr = parseQuery(payload);
  const programs = CMSStorageEngine.getPrograms();

  const minimalPrograms = programs.map((p) => ({
    slug: p.slug,
    name: p["Program Name"],
    degree: p["Degree Level"],
    department: p.Department,
  }));

  let answer = "";
  let links: Array<{ title: string; url: string }> = [];

  try {
    const completion = await invokeLLM({
      model: ENV.llmModel || "gemini-3.7-flash",
      max_tokens: 1000,
      messages: [
        {
          role: "system",
          content: `${CAU_NAVIGATOR_PROMPT}\n\nPROGRAMS CATALOG:\n${JSON.stringify(minimalPrograms)}\n\nYou are CAU's Semantic AI Search. Return an informative summary answering the query and top 3-5 relevant URLs from the CAU website (e.g. /programs/<slug>.html, /programs.html, /admission.html, /tuition.html, /scholarships.html).`,
        },
        { role: "user", content: `Search: ${queryStr}` },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "ai_search_results",
          strict: true,
          schema: {
            type: "object",
            properties: {
              answer: { type: "string" },
              links: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    url: { type: "string" },
                  },
                  required: ["title", "url"],
                  additionalProperties: false,
                },
              },
            },
            required: ["answer", "links"],
            additionalProperties: false,
          },
        },
      },
    });

    const rawContent = completion.choices[0]?.message.content;
    const contentStr = typeof rawContent === "string" ? rawContent : "";
    const parsed = JSON.parse(contentStr || "{}");
    if (parsed.answer) {
      answer = parsed.answer;
      links = parsed.links || [];
    }
  } catch (err) {
    console.warn("[Navigator] Search LLM fallback:", err);
  }

  if (!links.length) {
    const lower = queryStr.toLowerCase();
    const matched = programs.filter((p) => {
      const t = `${p["Program Name"]} ${p.Department} ${p["Degree Level"]}`.toLowerCase();
      return lower.split(/\s+/).some((w) => w.length > 3 && t.includes(w));
    });

    if (matched.length) {
      links = matched.slice(0, 4).map((p) => ({
        title: `${p["Program Name"]} (${p["Degree Level"]})`,
        url: `/programs/${p.slug}.html`,
      }));
      answer = `Found ${matched.length} programs matching "${queryStr}" at Cyprus Aydın University.`;
    } else {
      links = [
        { title: "All Degree Programmes", url: "/programs.html" },
        { title: "International Admissions", url: "https://international.cau.edu.tr/apply/" },
        { title: "Tuition & Fees Schedule", url: "https://international.cau.edu.tr/tuition-fees/" },
      ];
      answer = `Here are the official pages related to "${queryStr}" at Cyprus Aydın University.`;
    }
  }

  const html = `
<div class="cau-navigator-result">
  <div style="font-weight:700; font-size:14px; margin-bottom:6px;">🔍 AI Search Results for "${queryStr}":</div>
  <p style="font-size:13px; margin-bottom:8px; line-height:1.4;">${answer}</p>
  <div style="display:flex; flex-direction:column; gap:4px;">
    ${links
      .map(
        (l) => `
      <a href="${l.url}" target="_blank" style="display:flex; justify-content:space-between; align-items:center; background:var(--cau-chat-bg,#fff); border:1px solid var(--cau-chat-chip-border,#e5e7eb); padding:8px 10px; border-radius:6px; text-decoration:none; color:inherit; font-size:12.5px;">
        <span style="font-weight:600; color:var(--cau-chat-primary,#f04432);">${l.title}</span>
        <span style="font-size:11px; color:var(--cau-chat-muted,#666);">View Page ↗</span>
      </a>`
      )
      .join("")}
  </div>
</div>`;

  return {
    data: { answer, links },
    html,
    answer: `${answer}\n\n` + links.map((l) => `• [${l.title}](${l.url})`).join("\n"),
    suggestedChips: [
      { label: "🎓 Find Best Match", action: "program_finder", prompt: `Help me choose between these programs for ${queryStr}` },
      { label: "💰 Tuition for these programs", action: "tuition_calculator", prompt: "How much are tuition fees for these?" },
    ],
  };
}

// 9. AI Career → Degree Finder
export async function handleCareerFinder(payload: any) {
  const queryStr = parseQuery(payload);
  const careerMap: Record<string, { degrees: string[]; skills: string[] }> = {
    "ux designer": { degrees: ["Software Engineering", "Architecture", "Interior Architecture"], skills: ["UI/UX Prototyping", "Figma", "Design Systems", "Usability Testing", "Frontend Web"] },
    "software engineer": { degrees: ["Software Engineering", "Computer Engineering", "Information Security Engineering"], skills: ["Full-Stack Development", "Algorithms", "Cloud (Docker/K8s)", "Databases", "DevOps"] },
    "data scientist": { degrees: ["Software Engineering", "Computer Engineering", "Banking & Finance"], skills: ["Python", "Machine Learning", "Statistical Modeling", "SQL", "Big Data"] },
    "cybersecurity analyst": { degrees: ["Information Security Engineering", "Computer Engineering"], skills: ["Network Defense", "Cryptography", "Penetration Testing", "Security Auditing"] },
    "architect": { degrees: ["Architecture", "Interior Architecture & Environmental Design"], skills: ["AutoCAD / Revit", "Structural Design", "Sustainable Building", "3D Visualization"] },
    "hospital manager": { degrees: ["Health Management", "Business Administration (MBA)", "Nursing"], skills: ["Healthcare Operations", "Health Law", "Staff Management", "Quality Accreditation"] },
    "diplomat / international analyst": { degrees: ["International Relations", "International Law", "Public Law"], skills: ["Foreign Policy Analysis", "Diplomatic Protocol", "Conflict Resolution", "International Treaties"] },
    "hotel manager": { degrees: ["Tourism and Hospitality Management", "Gastronomy & Culinary Arts"], skills: ["Resort Operations", "Hospitality Finance", "Food & Beverage Management", "Guest Experience"] },
  };

  const lower = queryStr.toLowerCase();
  let matchedKey = Object.keys(careerMap).find((k) => lower.includes(k) || k.includes(lower));

  if (!matchedKey) {
    if (lower.includes("design") || lower.includes("ux") || lower.includes("ui")) matchedKey = "ux designer";
    else if (lower.includes("code") || lower.includes("dev") || lower.includes("program")) matchedKey = "software engineer";
    else if (lower.includes("data") || lower.includes("ai")) matchedKey = "data scientist";
    else if (lower.includes("security") || lower.includes("hacker")) matchedKey = "cybersecurity analyst";
    else if (lower.includes("hotel") || lower.includes("tour")) matchedKey = "hotel manager";
    else if (lower.includes("law") || lower.includes("politic")) matchedKey = "diplomat / international analyst";
    else matchedKey = "software engineer";
  }

  const pathway = careerMap[matchedKey];
  const title = matchedKey.charAt(0).toUpperCase() + matchedKey.slice(1);

  const html = `
<div class="cau-navigator-result">
  <div style="font-weight:700; font-size:14.5px; color:var(--cau-chat-primary,#f04432); margin-bottom:6px;">
    🎯 Career Pathway: ${title}
  </div>
  <p style="font-size:12.5px; line-height:1.4; margin-bottom:8px;">To become a successful <strong>${title}</strong>, Cyprus Aydın University recommends the following academic pathways and core competencies:</p>
  <div style="background:var(--cau-chat-bg,#fff); border:1px solid var(--cau-chat-chip-border,#e5e7eb); border-radius:8px; padding:10px 12px; font-size:12.5px;">
    <strong style="color:var(--cau-chat-primary,#f04432); display:block; margin-bottom:4px;">Recommended CAU Degree Programs:</strong>
    <ul style="margin:0 0 8px; padding-left:16px;">
      ${pathway.degrees.map((d) => `<li><strong>${d}</strong></li>`).join("")}
    </ul>
    <strong style="color:var(--cau-chat-muted,#666); display:block; margin-bottom:4px; font-size:11.5px; text-transform:uppercase;">Skills You Will Master at CAU:</strong>
    <div style="display:flex; flex-wrap:wrap; gap:4px;">
      ${pathway.skills.map((s) => `<span style="background:rgba(240,68,50,0.08); color:var(--cau-chat-primary,#f04432); padding:2px 8px; border-radius:4px; font-size:11px; font-weight:600;">${s}</span>`).join("")}
    </div>
  </div>
</div>`;

  const answer = `**Career Pathway for ${title}:**\n\n` +
    `• **Recommended CAU Degrees**: ${pathway.degrees.join(", ")}\n` +
    `• **Skills Developed**: ${pathway.skills.join(" · ")}\n` +
    `• CAU Career Center provides active corporate networking, internship placements, and CV preparation.`;

  return {
    data: { career: title, pathway },
    html,
    answer,
    suggestedChips: [
      { label: `🎓 Explore ${pathway.degrees[0]}`, action: "course_explainer", prompt: `Tell me about ${pathway.degrees[0]}` },
      { label: "💰 Calculate Tuition", action: "tuition_calculator", prompt: `How much is tuition for ${pathway.degrees[0]}?` },
      { label: "📝 How to Apply", action: "application_process", prompt: "How do I apply?" },
    ],
  };
}

// 10. AI Campus Assistant (Locations, Library, Printing)
export async function handleCampusAssistant(payload: any) {
  const queryStr = parseQuery(payload);
  const lower = queryStr.toLowerCase();

  let title = "Campus Facilities & Services";
  let location = "Cyprus Aydın University Campus, Dr. Fazıl Küçük Cad. No:80, Ozanköy / Girne";
  let hours = "General Campus: 08:00 – 22:00 Daily";
  let details = "Full student amenities, free Wi-Fi, cafeterias, and complimentary shuttle stops.";

  if (lower.includes("library") || lower.includes("kütüphane") || lower.includes("study") || lower.includes("book")) {
    title = "📍 Central University Library";
    location = "Academic Building A, 2nd Floor";
    hours = "Mon – Fri: 08:00 – 22:00 | Saturday: 09:00 – 18:00 | Sunday: 10:00 – 16:00";
    details = "Quiet study cubicles, collaborative project pods, digital catalog access, and free printing stations for enrolled students.";
  } else if (lower.includes("print") || lower.includes("copy") || lower.includes("fotokopi")) {
    title = "🖨️ Printing & Photocopying Center";
    location = "Student Activity Center (Ground Floor) & Library 2nd Floor";
    hours = "Mon – Fri: 08:30 – 18:00";
    details = "High-speed document printing, color poster printing for architecture and design students, binding, and laminating services.";
  } else if (lower.includes("international office") || lower.includes("admission") || lower.includes("tuğrul")) {
    title = "🏛️ International Admissions Office";
    location = "Administration Building, 1st Floor (Office 104)";
    hours = "Mon – Fri: 08:30 – 17:30";
    details = "Headed by Assoc. Prof. Dr. Tuğrul Günay. Manages acceptance letters, visa documentation, and airport reception.";
  } else if (lower.includes("tuition") || lower.includes("pay") || lower.includes("accounting") || lower.includes("cashier") || lower.includes("fee")) {
    title = "💳 Tuition & Cashier Office (Mali İşler)";
    location = "Administration Building, Ground Floor";
    hours = "Mon – Fri: 08:30 – 16:30";
    details = "Official receipt issuance, semester installment setup, bank deposit slip validation, and scholarship verification.";
  } else if (lower.includes("shuttle") || lower.includes("bus") || lower.includes("transport")) {
    title = "🚌 Free CAU Shuttle Bus Service";
    location = "Main Campus Gate, Aydın Dormitory, and Kyrenia City Center";
    hours = "Every 30–45 minutes from 07:45 to 22:00";
    details = "Free transportation for all registered CAU students between university dormitories, city center, and teaching faculties. View full schedules and live GPS tracking at <a href='/shuttle' style='color:var(--cau-chat-primary,#f04432);font-weight:600;'>Campus Shuttles</a>.";
  }

  const html = `
<div class="cau-navigator-result">
  <div style="font-weight:700; font-size:14.5px; color:var(--cau-chat-primary,#f04432); margin-bottom:6px;">
    ${title}
  </div>
  <div style="background:var(--cau-chat-bg,#fff); border:1px solid var(--cau-chat-chip-border,#e5e7eb); border-radius:8px; padding:10px 12px; font-size:12.5px; line-height:1.45;">
    <div style="margin-bottom:4px;"><strong>📍 Location:</strong> ${location}</div>
    <div style="margin-bottom:4px;"><strong>🕒 Operating Hours:</strong> ${hours}</div>
    <div><strong>ℹ️ Services:</strong> ${details}</div>
  </div>
</div>`;

  const answer = `**${title}**\n\n• **Location**: ${location}\n• **Hours**: ${hours}\n• **Services**: ${details}`;

  return {
    data: { title, location, hours, details },
    html,
    answer,
    suggestedChips: [
      { label: "🚌 Free Shuttle Timetable", prompt: "What are the campus shuttle bus timings?" },
      { label: "🏢 Student Dormitory Details", prompt: "Where are the student dormitories located?" },
      { label: "💬 Contact Office on WhatsApp", prompt: "Can I get the WhatsApp contact for campus offices?" },
    ],
  };
}

// 11. AI Student Planner (First-week checklist)
export async function handleStudentPlanner(payload: any) {
  const tasks = [
    { text: "Check in at International Aydın Student Residence (Kyrenia)", priority: "Immediate", done: true },
    { text: "Submit original certificates & 4 passport photos at Student Affairs (Burcu TUNAY)", priority: "Day 1", done: false },
    { text: "Collect official CAU Student ID Card and activate institutional email (@cau.edu.tr)", priority: "Day 1–2", done: false },
    { text: "Take CAU English Proficiency Exam (CSU EPE) or submit IELTS/Duolingo scores", priority: "Day 2", done: false },
    { text: "Meet your Academic Department Advisor and approve semester course timetable", priority: "Day 3", done: false },
    { text: "Apply for TRNC Student Residence Permit (İkamet) with university certificate", priority: "Week 1", done: false },
    { text: "Attend Campus Orientation Day & join 15+ student clubs (Sports, Music, Law...)", priority: "Week 1", done: false },
  ];

  const html = `
<div class="cau-navigator-result">
  <div style="font-weight:700; font-size:14.5px; color:var(--cau-chat-primary,#f04432); margin-bottom:6px;">
    📅 Your Official CAU First-Week Checklist
  </div>
  <p style="font-size:12.5px; margin-bottom:8px; line-height:1.4;">Welcome to Cyprus Aydın University! Here is your step-by-step onboarding plan for your first week in Kyrenia:</p>
  <div style="background:var(--cau-chat-bg,#fff); border:1px solid var(--cau-chat-chip-border,#e5e7eb); border-radius:8px; padding:10px 12px; font-size:12.5px;">
    <div style="display:flex; flex-direction:column; gap:6px;">
      ${tasks
        .map(
          (t) => `
        <div style="display:flex; align-items:flex-start; gap:8px;">
          <input type="checkbox" ${t.done ? "checked" : ""} style="margin-top:3px; accent-color:var(--cau-chat-primary,#f04432);" />
          <div style="flex:1; line-height:1.35;">
            <span>${t.text}</span>
            <span style="display:inline-block; font-size:10px; background:#f3f4f6; color:#4b5563; padding:1px 5px; border-radius:4px; margin-left:4px;">${t.priority}</span>
          </div>
        </div>`
        )
        .join("")}
    </div>
  </div>
</div>`;

  const answer = `**Your First-Week CAU Checklist:**\n\n` +
    tasks.map((t) => `☐ [${t.priority}] ${t.text}`).join("\n");

  return {
    data: { tasks },
    html,
    answer,
    suggestedChips: [
      { label: "📍 Where is Student Affairs?", action: "campus_assistant", prompt: "Where is the student affairs office?" },
      { label: "🚌 Shuttle Bus Timetable", prompt: "What is the shuttle schedule between dorms and campus?" },
      { label: "🌴 Cost of Living in Kyrenia", action: "cyprus_life", prompt: "What are the living expenses for my first month?" },
    ],
  };
}

// 12. Admission Requirements & Cyprus Life
export async function handleAdmissions(payload: any) {
  const queryStr = parseQuery(payload);
  const html = `
<div class="cau-navigator-result">
  <div style="font-weight:700; font-size:14.5px; color:var(--cau-chat-primary,#f04432); margin-bottom:6px;">
    📋 CAU Official Admission Requirements
  </div>
  <div style="background:var(--cau-chat-bg,#fff); border:1px solid var(--cau-chat-chip-border,#e5e7eb); border-radius:8px; padding:10px 12px; font-size:12.5px; line-height:1.45;">
    <strong style="display:block; margin-bottom:4px; color:var(--cau-chat-primary,#f04432);">1. Undergraduate (Bachelor / Associate):</strong>
    • High school diploma with minimum 50% passing grade.<br/>
    • English cutoff: IELTS 5.0, Duolingo 85, TOEFL 60, or take CAU EPE on campus.<br/>
    • No SAT/ACT mandatory, but SAT 1200+ awards <strong>85% Scholarship</strong> and SAT 1300+ awards <strong>100% Scholarship</strong>.<br/><br/>
    <strong style="display:block; margin-bottom:4px; color:var(--cau-chat-primary,#f04432);">2. Graduate (Master's / Ph.D.):</strong>
    • Bachelor's Degree certificate and official transcript (CGPA ≥ 2.0 / 4.0).<br/>
    • English cutoff: IELTS 5.5, Duolingo 90, or CAU EPE B2 level.<br/>
    • Ph.D. applicants require a Master's thesis/diploma and brief statement of purpose.
  </div>
</div>`;

  const answer = `**Official CAU Admission Requirements:**\n\n` +
    `• **Undergraduate**: High school certificate, transcript, passport copy. English: IELTS 5.0, Duolingo 85, or take CAU EPE on campus. SAT 1200+ = 85% scholarship, SAT 1300+ = 100% scholarship.\n` +
    `• **Master's**: Bachelor's diploma (CGPA ≥ 2.0/4.0), transcript, passport. English: IELTS 5.5 or Duolingo 90.\n` +
    `• **Ph.D.**: Master's degree, transcript, statement of purpose.`;

  return {
    data: { query: queryStr },
    html,
    answer,
    suggestedChips: [
      { label: "📝 Application Checklist", action: "application_process", prompt: "What documents do I need to prepare?" },
      { label: "💰 Calculate Tuition", action: "tuition_calculator", prompt: "What are the tuition fees?" },
      { label: "💬 WhatsApp Admissions", prompt: "Can I verify my eligibility on WhatsApp?" },
    ],
  };
}

export async function handleCyprusLife(payload: any) {
  const html = `
<div class="cau-navigator-result">
  <div style="font-weight:700; font-size:14.5px; color:var(--cau-chat-primary,#f04432); margin-bottom:6px;">
    🌴 Student Life & Living in Kyrenia, Cyprus
  </div>
  <div style="background:var(--cau-chat-bg,#fff); border:1px solid var(--cau-chat-chip-border,#e5e7eb); border-radius:8px; padding:10px 12px; font-size:12.5px; line-height:1.45;">
    • <strong>Monthly Student Budget:</strong> €350 – €500 EUR covers food, groceries, local transport, and personal leisure.<br/>
    • <strong>Safety:</strong> Northern Cyprus ranks among the safest destinations globally with near-zero violent crime.<br/>
    • <strong>Climate:</strong> Mediterranean sunshine with over 300 sunny days per year and clean beaches.<br/>
    • <strong>Free Campus Shuttles:</strong> Complimentary regular buses connect dorms, Kyrenia harbor, and CAU campus.<br/>
    • <strong>Accommodation:</strong> International Aydın Dormitory (€2,800 to €5,500/9 months) with on-site gym, study rooms, and 24/7 security.
  </div>
</div>`;

  const answer = `**Living in Kyrenia, Cyprus (TRNC):**\n\n` +
    `• **Monthly Expenses**: €350 – €500 EUR/month.\n` +
    `• **Safety**: Ranked among the safest study destinations worldwide.\n` +
    `• **Transportation**: Free university shuttles daily.\n` +
    `• **Weather**: 300+ days of Mediterranean sunshine.\n` +
    `• **Housing**: On-campus/approved dorms from €2,800 EUR per 9 months.`;

  return {
    data: {},
    html,
    answer,
    suggestedChips: [
      { label: "🏢 Dormitory Room Options", prompt: "What are the room options at International Aydın Dormitory?" },
      { label: "🚌 Free Shuttle Timetable", action: "campus_assistant", prompt: "What are the shuttle bus routes?" },
      { label: "⚽ Sports Teams & Gym", prompt: "Is there a football team and gym at CAU?" },
    ],
  };
}
