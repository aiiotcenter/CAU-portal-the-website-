import { ENV } from "./env";
import { findStaffForQuery, isCAUQuery } from "../assistant/knowledge";

export type Role = "system" | "user" | "assistant" | "tool" | "function";

export type TextContent = {
  type: "text";
  text: string;
};

export type ImageContent = {
  type: "image_url";
  image_url: {
    url: string;
    detail?: "auto" | "low" | "high";
  };
};

export type FileContent = {
  type: "file_url";
  file_url: {
    url: string;
    mime_type?: "audio/mpeg" | "audio/wav" | "application/pdf" | "audio/mp4" | "video/mp4" ;
  };
};

export type MessageContent = string | TextContent | ImageContent | FileContent;

export type Message = {
  role: Role;
  content: MessageContent | MessageContent[];
  name?: string;
  tool_call_id?: string;
};

export type Tool = {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
  };
};

export type ToolChoicePrimitive = "none" | "auto" | "required";
export type ToolChoiceByName = { name: string };
export type ToolChoiceExplicit = {
  type: "function";
  function: {
    name: string;
  };
};

export type ToolChoice =
  | ToolChoicePrimitive
  | ToolChoiceByName
  | ToolChoiceExplicit;

export type InvokeParams = {
  messages: Message[];
  tools?: Tool[];
  toolChoice?: ToolChoice;
  tool_choice?: ToolChoice;
  maxTokens?: number;
  max_tokens?: number;
  outputSchema?: OutputSchema;
  output_schema?: OutputSchema;
  responseFormat?: ResponseFormat;
  response_format?: ResponseFormat;
  model?: string;
  thinking?: Record<string, unknown>;
  reasoning?: Record<string, unknown>;
};

export type ToolCall = {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
};

export type InvokeResult = {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: Role;
      content: string | Array<TextContent | ImageContent | FileContent>;
      tool_calls?: ToolCall[];
    };
    finish_reason: string | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export type JsonSchema = {
  name: string;
  schema: Record<string, unknown>;
  strict?: boolean;
};

export type OutputSchema = JsonSchema;

export type ResponseFormat =
  | { type: "text" }
  | { type: "json_object" }
  | { type: "json_schema"; json_schema: JsonSchema };

const ensureArray = (
  value: MessageContent | MessageContent[]
): MessageContent[] => (Array.isArray(value) ? value : [value]);

const normalizeContentPart = (
  part: MessageContent
): TextContent | ImageContent | FileContent => {
  if (typeof part === "string") {
    return { type: "text", text: part };
  }

  if (part.type === "text") {
    return part;
  }

  if (part.type === "image_url") {
    return part;
  }

  if (part.type === "file_url") {
    return part;
  }

  throw new Error("Unsupported message content part");
};

const normalizeMessage = (message: Message) => {
  const { role, name, tool_call_id } = message;

  if (role === "tool" || role === "function") {
    const content = ensureArray(message.content)
      .map(part => (typeof part === "string" ? part : JSON.stringify(part)))
      .join("\n");

    return {
      role,
      name,
      tool_call_id,
      content,
    };
  }

  const contentParts = ensureArray(message.content).map(normalizeContentPart);

  // If there's only text content, collapse to a single string for compatibility
  if (contentParts.length === 1 && contentParts[0].type === "text") {
    return {
      role,
      name,
      content: contentParts[0].text,
    };
  }

  return {
    role,
    name,
    content: contentParts,
  };
};

const normalizeToolChoice = (
  toolChoice: ToolChoice | undefined,
  tools: Tool[] | undefined
): "none" | "auto" | ToolChoiceExplicit | undefined => {
  if (!toolChoice) return undefined;

  if (toolChoice === "none" || toolChoice === "auto") {
    return toolChoice;
  }

  if (toolChoice === "required") {
    if (!tools || tools.length === 0) {
      throw new Error(
        "tool_choice 'required' was provided but no tools were configured"
      );
    }

    if (tools.length > 1) {
      throw new Error(
        "tool_choice 'required' needs a single tool or specify the tool name explicitly"
      );
    }

    return {
      type: "function",
      function: { name: tools[0].function.name },
    };
  }

  if ("name" in toolChoice) {
    return {
      type: "function",
      function: { name: toolChoice.name },
    };
  }

  return toolChoice;
};

const isGeminiKey = () => {
  const key = ENV.geminiApiKey || ENV.forgeApiKey || "";
  return (
    key.startsWith("AIza") ||
    key.startsWith("AQ.") ||
    Boolean(ENV.geminiApiKey) ||
    ENV.forgeApiUrl.includes("generativelanguage.googleapis.com")
  );
};

async function invokeGemini(params: InvokeParams): Promise<InvokeResult> {
  const key = ENV.geminiApiKey || ENV.forgeApiKey;
  const modelName =
    params.model &&
    !params.model.includes("gpt") &&
    !params.model.includes("you.com")
      ? params.model
      : (ENV.llmModel || "gemini-3.1-flash-lite");

  let systemPrompt = "";
  const rawContents: Array<{
    role: "user" | "model";
    parts: Array<{ text: string }>;
  }> = [];

  for (const m of params.messages) {
    const textContent =
      typeof m.content === "string"
        ? m.content
        : Array.isArray(m.content)
        ? m.content
            .map(p => (typeof p === "string" ? p : (p as TextContent).text || ""))
            .join("\n")
        : "";

    if (m.role === "system") {
      systemPrompt = systemPrompt
        ? `${systemPrompt}\n\n${textContent}`
        : textContent;
    } else {
      const role = m.role === "user" ? "user" : "model";
      const trimmed = textContent.trim();
      if (!trimmed) continue;
      // Truncate older assistant history entries to 350 chars to prevent token overflow
      const textToKeep =
        role === "model" && trimmed.length > 400
          ? trimmed.slice(0, 350) + "..."
          : trimmed;
      rawContents.push({
        role,
        parts: [{ text: textToKeep }],
      });
    }
  }

  // Sanitize contents for Google Gemini multi-turn API specifications:
  // 1. Must start with a 'user' turn
  while (rawContents.length && rawContents[0].role !== "user") {
    rawContents.shift();
  }

  // 2. Must strictly alternate: merge or dedup consecutive turns with the same role
  const sanitizedContents: Array<{
    role: "user" | "model";
    parts: Array<{ text: string }>;
  }> = [];

  for (const item of rawContents) {
    if (!sanitizedContents.length) {
      sanitizedContents.push(item);
    } else {
      const prev = sanitizedContents[sanitizedContents.length - 1];
      if (prev.role === item.role) {
        if (prev.parts[0].text !== item.parts[0].text) {
          prev.parts[0].text += "\n" + item.parts[0].text;
        }
      } else {
        sanitizedContents.push(item);
      }
    }
  }

  // 3. Must end with a 'user' turn (the current user question)
  while (sanitizedContents.length && sanitizedContents[sanitizedContents.length - 1].role !== "user") {
    sanitizedContents.pop();
  }

  // 4. Cap at last 6 turns (3 complete round-trips) to stay well within free tier TPM limits
  const contents = sanitizedContents.slice(-6);

  const resolvedMaxTokens = params.max_tokens ?? params.maxTokens ?? 1200;
  const payload: Record<string, unknown> = {
    contents,
    generationConfig: {
      response_mime_type: "application/json",
      temperature: 0.2,
      maxOutputTokens: resolvedMaxTokens,
    },
  };

  const requestedSchema = (params.responseFormat?.type === "json_schema" ? params.responseFormat.json_schema : (params.response_format?.type === "json_schema" ? params.response_format.json_schema : undefined));

  if (systemPrompt) {
    let enrichedPrompt = `IMPORTANT INSTRUCTIONS:
1. CAU stands exclusively for Cyprus Aydın University (Kıbrıs Aydın Üniversitesi) located in Kyrenia (Girne), Northern Cyprus (TRNC). Never confuse CAU with Chung-Ang University or Clark Atlanta.
2. CONVERSATIONAL & NATURAL: Be warm, polite, and natural. For conversational greetings, pleasantries, or questions like "how are you", respond warmly and politely as a friendly, intelligent human assistant, then offer to help with CAU.
3. CONCISE & ACCURATE: For substantive questions about programs, tuition fees, scholarships, and campus facilities, be direct, concise, and accurate (provide key numbers and official details clearly).
4. ALWAYS reply in the EXACT same language as the visitor's latest message (e.g. if in Arabic, answer in fluent Arabic; if in Turkish, reply in Turkish; if in Russian, reply in Russian; if in English, reply in English).
5. SCOPE POLICY: You are an expert assistant dedicated exclusively to Cyprus Aydın University and student life in Cyprus. Answer questions about CAU (programs, tuition, scholarships, admissions, facilities) and student life in Cyprus.
6. OUT-OF-CONTEXT POLICY: If completely unrelated to CAU or studying in Cyprus (such as writing general code or cooking recipes), politely decline in 1 sentence and suggest CAU topics.`;

    if (requestedSchema) {
      enrichedPrompt += `\n7. Return ONLY a valid JSON object adhering strictly to this schema: ${JSON.stringify(requestedSchema.schema)}\n\n${systemPrompt}`;
    } else {
      enrichedPrompt += `\n7. Return a JSON object with the property "answer" containing your complete reply and "sourceIds" (array of strings).\n\n${systemPrompt}`;
    }

    payload.system_instruction = {
      parts: [{ text: enrichedPrompt }],
    };
  }

  // Multi-model failover cascade: prioritizes high-uptime, active models
  const candidateModels = Array.from(
    new Set([
      modelName || "gemini-3.1-flash-lite",
      "gemini-3.1-flash-lite",
      "gemini-3-flash-preview",
      "gemini-3.8-flash",
      "gemini-3.5-flash",
      "gemini-3.7-flash",
    ].filter(Boolean))
  );

  let lastError: unknown;
  for (const m of candidateModels) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${key}`;
    try {
      let response = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(25000),
      });

      // Spikes in demand on preview models are temporary: retry once with 1s backoff
      if (response.status === 503) {
        console.warn(`Gemini model ${m} returned 503 (high demand); retrying with 1s backoff...`);
        await sleep(1000);
        response = await fetch(url, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(25000),
        });
      }

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`Gemini model ${m} returned status ${response.status}: ${errText.slice(0, 120)}`);
        // Invalid API credentials: fail fast
        if (response.status === 401 || response.status === 403) {
          throw new Error(`Gemini API unauthorized (${response.status}): ${errText.slice(0, 100)}`);
        }
        // For 429, 503, 404, or other transient errors, failover to the next candidate model
        lastError = new Error(`Gemini ${m} returned HTTP ${response.status}: ${errText.slice(0, 80)}`);
        continue;
      }

      const data = (await response.json()) as {
        candidates?: Array<{
          content?: {
            parts?: Array<{ text?: string }>;
          };
        }>;
      };

      const candidateParts = data.candidates?.[0]?.content?.parts;
      let rawAnswer = candidateParts?.find(p => typeof p?.text === "string")?.text?.trim() || "{}";

      if (rawAnswer.startsWith("```json")) {
        rawAnswer = rawAnswer
          .replace(/^```json\s*/i, "")
          .replace(/```\s*$/, "")
          .trim();
      } else if (rawAnswer.startsWith("```")) {
        rawAnswer = rawAnswer
          .replace(/^```\s*/, "")
          .replace(/```\s*$/, "")
          .trim();
      }

      return {
        id: "gemini-" + Date.now(),
        created: Math.floor(Date.now() / 1000),
        model: m,
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: rawAnswer,
            },
            finish_reason: "stop",
          },
        ],
      };
    } catch (err) {
      console.warn(`Gemini model ${m} error or timeout:`, err);
      lastError = err;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("All Gemini models failed or timed out");
}

const isYouComKey = () => {
  const key = ENV.forgeApiKey || "";
  return (
    key.startsWith("ydc-") ||
    key.startsWith("you-") ||
    ENV.forgeApiUrl.includes("you.com") ||
    ENV.forgeApiUrl.includes("ydc-index")
  );
};

const resolveApiUrl = () => {
  const base = (ENV.forgeApiUrl || "").trim().replace(/\/+$/, "");
  if (!base) return "";
  if (base.endsWith("/chat/completions")) return base;
  if (base.endsWith("/v1") || base.endsWith("/openai")) {
    return `${base}/chat/completions`;
  }
  return `${base}/v1/chat/completions`;
};

const assertApiKey = () => {
  if (!ENV.forgeApiKey && !ENV.geminiApiKey) {
    throw new Error("Neither GEMINI_API_KEY nor OPENAI_API_KEY is configured");
  }
};

function extractQueryFromMessages(messages: Message[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.role === "user") {
      const c = m.content;
      if (typeof c === "string") return c;
      if (Array.isArray(c)) {
        const text = c.map(p => typeof p === "string" ? p : (p as TextContent).text || "").join(" ");
        if (text.trim()) return text;
      }
    }
  }
  const last = messages[messages.length - 1];
  if (typeof last.content === "string") return last.content;
  return "Hello";
}

async function invokeYouCom(params: InvokeParams): Promise<InvokeResult> {
  const rawQuery = extractQueryFromMessages(params.messages);
  const queryForCheck = rawQuery.toLocaleLowerCase();

  // For CAU-specific queries, return verified CAU data directly (You.com web search confuses CAU with Clark Atlanta / Christian-Albrechts)
  if (isCAUQuery(rawQuery)) {
    // Staff-specific
    if (/akademik|academic staff|\bprof\b|prof\.|professor|lecturer|faculty member|instructor|\bdoctor\b|hoca|öğretim|kadro|staff directory|who teaches|who is.*teach|which.*teach|teach.*software|teach.*computer|teach.*nursing/.test(queryForCheck)) {
      const hit = findStaffForQuery(rawQuery);
      if (hit) {
        const json = JSON.stringify({ answer: `For ${hit.label} at CAU, the directory at akademikkadro.cau.edu.tr lists: ${hit.staff.join("; ")}. Search the directory with the programme/faculty filter to see photos, titles and official email (name@cau.edu.tr), and verify the current roster live. For verification contact ik@cau.edu.tr.`, sourceIds: ["akademik-kadro","personnel","programmes"] });
        return { id: "youcom-cau-staff-"+Date.now(), created: Math.floor(Date.now()/1000), model: "you.com-answer-cau-verified", choices: [{ index: 0, message: { role: "assistant", content: json }, finish_reason: "stop" }] };
      }
    }
    // Numbers and institutional statistics
    if (/how many students|how many alumni|how many faculties|how many partner|how many international|how many countries|how many clubs|numbers that matter|statistics|numbers\b|figures\b|sayılar|rakamlar|kaç öğrenci|kaç mezun|kaç fakülte|كم عدد/.test(queryForCheck)) {
      const json = JSON.stringify({
        answer: "Key Official CAU Numbers from Handbook: 1,200+ Alumni; 3,000+ Students; 1,000+ International Students; 60+ Countries our students come from; 8 Academic Faculties; 11 Application & Research Centers; 50+ International Partner Institutions; 3 Dual Degree Programs; 5+ Faculty Exchanges; 15 Active Student Clubs. Strategic partner Istanbul Aydın University (IAU): Founded 2003, European side of Istanbul, 50,000+ students, 8,500+ international students from 124 countries, 17 faculties, 83.6% job placement rate. Dormitory capacity: 142 beds.",
        sourceIds: ["about-cau", "home", "cau-main"]
      });
      return { id: "youcom-cau-numbers-"+Date.now(), created: Math.floor(Date.now()/1000), model: "you.com-answer-cau-verified", choices: [{ index: 0, message: { role: "assistant", content: json }, finish_reason: "stop" }] };
    }
    // Director of International Office — Assoc. Prof. Dr. Tuğrul Günay
    if (/tuğrul|tugrul|gunay|günay|international office director/.test(queryForCheck)) {
      const json = JSON.stringify({
        answer: "Assoc. Prof. Dr. Tuğrul Günay is the Director of the International Office for Cyprus Aydın University (CAU) and Istanbul Aydın University (IAU). Official quote from Handbook (Page 11): \"Internationalization is more than mobility — it’s about building bridges of knowledge, culture, and shared purpose. At Cyprus Aydin University, I am committed to fostering global partnerships and empowering students to thrive in a truly interconnected world.\" Dr. Günay leads international student recruitment across 60+ countries and manages 50+ global partner institutions. Contact: admission@cau.edu.tr / +90 548 835 71 71.",
        sourceIds: ["about-cau", "international-home", "cau-main"]
      });
      return { id: "youcom-cau-tugrul-"+Date.now(), created: Math.floor(Date.now()/1000), model: "you.com-answer-cau-verified", choices: [{ index: 0, message: { role: "assistant", content: json }, finish_reason: "stop" }] };
    }
    // Student Testimonials
    if (/testimonial|testimonials|yasir|jamal|romeo|koyue|omar abo|jmei|setia|santoso/.test(queryForCheck)) {
      const json = JSON.stringify({
        answer: "Authentic CAU Student Stories from Handbook: 1) Yasir Jamal (Pakistan, MS Tourism Management): \"Tourism isn’t just about places; it’s about connections, cultures, and unforgettable experiences. At CAU, the professors are inspiring and encourage us to think globally.\"; 2) Romeo Lele Koyue (Cameroon, Ph.D. Business Administration): \"At CAU, the Music and Art Club is more than a space for creativity — it's where we discover, grow, and inspire. Just like in my Ph.D. journey, it's about leaving a legacy.\"; 3) Omar Abo Jmei (Palestine, Electrical & Electronic Engineering): \"My journey at CAU is more than a degree—it’s a mission to innovate, solve real-world problems, and build a smarter, sustainable future.\"; 4) Setia Amantha Laura Santoso (Indonesia, Business Administration English): \"CAU is so much fun! I’ve made amazing friends from all around the world. The teachers are supportive and there’s even a school bus service.\"",
        sourceIds: ["about-cau", "home", "cau-main"]
      });
      return { id: "youcom-cau-testimonials-"+Date.now(), created: Math.floor(Date.now()/1000), model: "you.com-answer-cau-verified", choices: [{ index: 0, message: { role: "assistant", content: json }, finish_reason: "stop" }] };
    }
    // Leadership & Governance
    if (/fatma nur|mütevelli|board of trustees|burcu tunay|secretary general|genel sekreter|aytul|aytül/.test(queryForCheck)) {
      const json = JSON.stringify({
        answer: "CAU Governance & Key Leadership: Board of Trustees Chairwoman (Mütevelli Heyeti Başkanı): Fatma Nur AYDIN; Secretary General: Burcu TUNAY (burcutunay@cau.edu.tr, ext 6020); Personnel Director: Aytül DENLİ (ik@cau.edu.tr, ext 6056); International Office Director: Assoc. Prof. Dr. Tuğrul Günay (tugrulgunay@cau.edu.tr); Deans: Prof. Dr. Cem Kurtoğlu (Dentistry), Prof. Dr. Hikmet Ş. Aybar (Engineering), Prof. Dr. Mehmet Zeki Avcı (Health Sciences), Prof. Dr. Arzu Alvan Bozdereli (Economics, Administrative & Social Sciences), Prof. Dr. Z. Gönül Balkır (Law), Prof. Dr. Hasan Tunç (Tourism).",
        sourceIds: ["about-cau", "student-affairs", "personnel"]
      });
      return { id: "youcom-cau-leadership-"+Date.now(), created: Math.floor(Date.now()/1000), model: "you.com-answer-cau-verified", choices: [{ index: 0, message: { role: "assistant", content: json }, finish_reason: "stop" }] };
    }
    if (/tuition|fee|payment|iban|bank|installment|cost|price|usd|dollar|eur/.test(queryForCheck)) {
      const json = JSON.stringify({ answer: "Per CAU Official Handbook Schedule (in USD $): Annual Registration + VAT + Activity Fee flat $600 USD. Associate & Bachelor standard tuition $10,000 + $600 = $10,600 USD/year (50% scholarship: $5,600; 60%: $4,600; 70%: $3,600; 80%: $2,600; 85% SAT/Transfer: $2,100; 90%: $1,600; 100%: $600). Dentistry Dual-Campus (5-Year): Years 1–3 at CAU (Cyprus) $22,600 USD ($11,600 at 50%); Years 4–5 at IAU (Istanbul) $37,100 USD ($17,850 at 50%). Master's total: $7,600 USD ($4,100 at 50%). Ph.D. total: $12,600 USD ($6,600 at 50%). Mandatory deposits: $1,250 USD (Bachelor/Master), $1,500 USD (Ph.D.), $2,500 USD (Dentistry). Dormitory (in EUR): International Aydın Student Dormitory 9-month academic year: Single €5,500, Double €3,200, Triple €2,800. Payment via Garanti Bank (USD, EUR, TRY, GBP IBANs) or online card link before registration.", sourceIds: ["tuition","tuition-tr","scholarships"] });
      return { id: "youcom-cau-tuition-"+Date.now(), created: Math.floor(Date.now()/1000), model: "you.com-answer-cau-verified", choices: [{ index: 0, message: { role: "assistant", content: json }, finish_reason: "stop" }] };
    }
    if (/scholarship|sat|sibling|assistantship/.test(queryForCheck)) {
      const json = JSON.stringify({ answer: "CAU International Scholarships: Merit tiers from 50% to 100%. SAT 1200+ awards 85% scholarship ($2,100 USD/year total); SAT 1300+ awards 100% full tuition scholarship ($600 USD annual fee only). University transfer students (CGPA >= 2.0) receive 85% scholarship. International siblings receive 70% (up to 80% if sibling is currently enrolled). On-campus student assistantships available for GPA > 3.0. Contact: admission@cau.edu.tr.", sourceIds: ["scholarships"] });
      return { id: "youcom-cau-scholarship-"+Date.now(), created: Math.floor(Date.now()/1000), model: "you.com-answer-cau-verified", choices: [{ index: 0, message: { role: "assistant", content: json }, finish_reason: "stop" }] };
    }
    if (/faculty|faculties/.test(queryForCheck) && !/faculty member/.test(queryForCheck)) {
      const json = JSON.stringify({ answer: "Cyprus Aydın University features 8 Academic Faculties: 1) Faculty of Dentistry (Dean Prof. Dr. Cem Kurtoğlu, 5-year Dual-Campus with IAU); 2) Faculty of Law (Dean Prof. Dr. Z. Gönül Balkır, Law TR, International Law EN); 3) Faculty of Education (Guidance TR, Turkish Language TR, English Language EN); 4) Faculty of Economics, Administrative and Social Sciences (Dean Prof. Dr. Arzu Alvan Bozdereli, Business EN, IR EN, Psychology TR, Banking EN, Civil Aviation Management EN); 5) Faculty of Fine Arts and Design (Architecture EN, Interior Architecture TR); 6) Faculty of Engineering (Dean Prof. Dr. Hikmet Ş. Aybar, Electrical EN, Mechatronics EN, Computer EN, Software EN, Information Security EN, Civil EN); 7) Faculty of Health Sciences (Dean Prof. Dr. Mehmet Zeki Avcı, Nursing TR, Nursing EN, Physiotherapy TR); 8) Faculty of Tourism (Dean Prof. Dr. Hasan Tunç, Tourism & Hotel Management EN, Gastronomy TR). Also includes 5 Associate Degree programs (all YÖK accredited), 14 Master's, 6 Ph.D., 11 research centers, and 15 active student clubs.", sourceIds: ["faculties","cau-main","programmes"] });
      return { id: "youcom-cau-faculties-"+Date.now(), created: Math.floor(Date.now()/1000), model: "you.com-answer-cau-verified", choices: [{ index: 0, message: { role: "assistant", content: json }, finish_reason: "stop" }] };
    }
    if (/program|programme|dentistry|nursing|physiotherapy|rehabilitation|tourism|hospitality|gastronomy|law|engineering|architecture|psychology|business|international relations|banking|civil aviation|software|computer|electrical|mechatronics|information security|civil engineering/.test(queryForCheck)) {
      // Check for specific faculty programs
      if (/dentistry/.test(queryForCheck)) {
        const json = JSON.stringify({ answer: "Faculty of Dentistry at CAU offers Dentistry (Undergraduate, English) in a prestigious 5-year Dual-Campus format: Years 1–3 at CAU (Cyprus) and Years 4–5 at Istanbul Aydın University (IAU, Istanbul). Dean Prof. Dr. Cem Kurtoğlu. Tuition: Years 1–3 at CAU: $22,600 USD standard ($11,600 USD with 50% scholarship); Years 4–5 at IAU: $37,100 USD standard ($17,850 USD with 50% scholarship). Required deposit: $2,500 USD.", sourceIds: ["faculties","programmes","cau-main"] });
        return { id: "youcom-cau-dentistry-"+Date.now(), created: Math.floor(Date.now()/1000), model: "you.com-answer-cau-verified", choices: [{ index: 0, message: { role: "assistant", content: json }, finish_reason: "stop" }] };
      }
      if (/nursing/.test(queryForCheck)) {
        const json = JSON.stringify({ answer: "Faculty of Health Sciences at CAU offers: Nursing (Turkish, YÖK/YÖDAK), Nursing (English, YÖDAK), and Physiotherapy and Rehabilitation (Turkish, YÖK/YÖDAK). Dean Prof. Dr. Mehmet Zeki Avcı. Standard annual fee: $10,600 USD ($5,600 USD with 50% scholarship; down to $600 USD with 100% scholarship). 4-year degree with clinical rotations.", sourceIds: ["faculties","programmes"] });
        return { id: "youcom-cau-nursing-"+Date.now(), created: Math.floor(Date.now()/1000), model: "you.com-answer-cau-verified", choices: [{ index: 0, message: { role: "assistant", content: json }, finish_reason: "stop" }] };
      }
      if (/tourism|hospitality|gastronomy/.test(queryForCheck)) {
        const json = JSON.stringify({ answer: "Faculty of Tourism at CAU offers Tourism and Hotel Management (Bachelor’s, English, YÖDAK) and Gastronomy and Culinary Arts (Bachelor’s, Turkish, YÖK/YÖDAK). Dean Prof. Dr. Hasan Tunç. Standard tuition is $10,000 + $600 = $10,600 USD/year ($5,600 USD with guaranteed 50% international scholarship; down to $600 USD with 100% scholarship). Includes hands-on culinary kitchens and luxury hotel internships.", sourceIds: ["faculties","programmes"] });
        return { id: "youcom-cau-tourism-"+Date.now(), created: Math.floor(Date.now()/1000), model: "you.com-answer-cau-verified", choices: [{ index: 0, message: { role: "assistant", content: json }, finish_reason: "stop" }] };
      }
      // Generic program list
      const json = JSON.stringify({ answer: "CAU’s 48-record programme catalogue across 8 faculties: English Preparatory School (1); 5 Associate degrees (Tourist Guidance, Physiotherapy, Civil Aviation Cabin Services, First & Emergency Aid, Opticianry — all YÖK accredited); 24 Bachelor degrees (Dentistry 5-yr dual-campus, Software Engineering, Computer, Electrical, Mechatronics, Civil, Information Security, Architecture, Interior Architecture, Nursing TR/EN, Physiotherapy, Law TR, International Law EN, Business Administration, IR, Psychology, Banking, Civil Aviation Management, Guidance TR, Turkish Teaching, English Teaching, Tourism & Hotel Management, Gastronomy); 14 Master’s; and 6 Ph.D. programmes. Undergraduate standard tuition is $10,600 USD/year ($5,600 with 50% scholarship down to $600 USD with 100% scholarship).", sourceIds: ["programmes","faculties","cau-main"] });
      return { id: "youcom-cau-programs-"+Date.now(), created: Math.floor(Date.now()/1000), model: "you.com-answer-cau-verified", choices: [{ index: 0, message: { role: "assistant", content: json }, finish_reason: "stop" }] };
    }
    // For other CAU queries, still use You.com but disambiguate to avoid Clark Atlanta / Christian-Albrechts
    // Append "Cyprus Aydin University" to query for CAU context
  }

  // You.com Answer API: query max 400 chars, no extra fields — disambiguate CAU
  const baseQuery = isCAUQuery(rawQuery) && !rawQuery.toLocaleLowerCase().includes("cyprus aydin") ? `${rawQuery} Cyprus Aydin University` : rawQuery;
  const query = baseQuery.slice(0, 380).trim() || baseQuery.slice(0, 380);
  const response = await fetchWithBackoff("https://api.you.com/v1/answer", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${ENV.forgeApiKey}`,
    },
    body: JSON.stringify({ query }),
  });
  if (!response.ok) {
    const t = await response.text();
    throw new Error(`You.com Answer API failed: ${response.status} ${t}`);
  }
  const data = await response.json() as { answer?: string; results?: unknown };
  const answer = typeof data.answer === "string" && data.answer.trim().length > 0 ? data.answer.trim() : query;
  // Build JSON schema compatible payload for CAU routers (answer + sourceIds)
  const isCAU = /cau|cyprus|aydin|kibris|admission|scholarship|tuition|program|faculty|akademik|kadro|professor|dorm|kyrenia|girne|software|nursing|law|dentistry|tourism|engineering/i.test(query);
  // For CAU we still want to hint at akademık-kadro etc, but You.com will have provided general answer; we mix CAU citation
  const sourceIds: string[] = isCAU ? ["akademik-kadro", "cau-main"] : [];
  const jsonPayload = JSON.stringify({ answer: answer.replace(/https?:\/\/\S+/g, "").slice(0, 1200), sourceIds });
  return {
    id: "youcom-" + Date.now(),
    created: Math.floor(Date.now()/1000),
    model: "you.com-answer",
    choices: [{ index: 0, message: { role: "assistant", content: jsonPayload }, finish_reason: "stop" }],
  };
}

const normalizeResponseFormat = ({
  responseFormat,
  response_format,
  outputSchema,
  output_schema,
}: {
  responseFormat?: ResponseFormat;
  response_format?: ResponseFormat;
  outputSchema?: OutputSchema;
  output_schema?: OutputSchema;
}):
  | { type: "json_schema"; json_schema: JsonSchema }
  | { type: "text" }
  | { type: "json_object" }
  | undefined => {
  const explicitFormat = responseFormat || response_format;
  if (explicitFormat) {
    if (
      explicitFormat.type === "json_schema" &&
      !explicitFormat.json_schema?.schema
    ) {
      throw new Error(
        "responseFormat json_schema requires a defined schema object"
      );
    }
    return explicitFormat;
  }

  const schema = outputSchema || output_schema;
  if (!schema) return undefined;

  if (!schema.name || !schema.schema) {
    throw new Error("outputSchema requires both name and schema");
  }

  return {
    type: "json_schema",
    json_schema: {
      name: schema.name,
      schema: schema.schema,
      ...(typeof schema.strict === "boolean" ? { strict: schema.strict } : {}),
    },
  };
};

const RETRY_MAX_RETRIES = 4;
const RETRY_BASE_DELAY_MS = 500;
const RETRY_MAX_DELAY_MS = 30_000;
const REQUEST_TIMEOUT_MS = 20_000;

type FetchInit = NonNullable<Parameters<typeof fetch>[1]>;

const sleep = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

const parseRetryAfter = (value: string | null): number | undefined => {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
  const at = Date.parse(value);
  return Number.isNaN(at) ? undefined : Math.max(0, at - Date.now());
};

// Equal-jitter exponential backoff. The cap/2 floor guarantees a minimum
// delay so a misbehaving caller loop slows down instead of hammering the
// upstream while it keeps returning errors.
const computeBackoffDelay = (
  attempt: number,
  retryAfterMs?: number
): number => {
  const cap = Math.min(RETRY_BASE_DELAY_MS * 2 ** attempt, RETRY_MAX_DELAY_MS);
  const jittered = cap / 2 + Math.random() * (cap / 2);
  return Math.min(Math.max(jittered, retryAfterMs ?? 0), RETRY_MAX_DELAY_MS);
};

// Retries non-2xx responses and network errors with exponential backoff, then
// returns the final Response so callers keep their existing error handling.
const fetchWithBackoff = async (
  url: string,
  init: FetchInit
): Promise<Response> => {
  let lastError: unknown;
  const deadline = Date.now() + REQUEST_TIMEOUT_MS;

  for (let attempt = 0; attempt <= RETRY_MAX_RETRIES; attempt++) {
    const remainingMs = deadline - Date.now();
    if (remainingMs <= 0) {
      throw new Error("LLM request timed out");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), remainingMs);
    try {
      const response = await fetch(url, { ...init, signal: controller.signal });
      clearTimeout(timeout);
      if (response.ok || attempt === RETRY_MAX_RETRIES) {
        return response;
      }

      const retryAfterMs = parseRetryAfter(
        response.headers.get("retry-after")
      );
      try {
        await response.body?.cancel();
      } catch {
        // Body already settled; nothing to clean up.
      }
      console.warn(
        `LLM request retry ${attempt + 1}/${RETRY_MAX_RETRIES} after status ${response.status}`
      );
      await sleep(Math.min(computeBackoffDelay(attempt, retryAfterMs), Math.max(0, deadline - Date.now())));
    } catch (error) {
      clearTimeout(timeout);
      lastError = error;
      if (attempt === RETRY_MAX_RETRIES) throw error;
      const err = error as { code?: string; cause?: { code?: string } };
      const code = err?.code || err?.cause?.code;
      if (code === "ENOTFOUND" || code === "ECONNREFUSED") {
        throw error;
      }
      console.warn(
        `LLM request retry ${attempt + 1}/${RETRY_MAX_RETRIES} after network error`
      );
      await sleep(Math.min(computeBackoffDelay(attempt), Math.max(0, deadline - Date.now())));
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("LLM request failed after exhausting retries");
};

export async function invokeLLM(params: InvokeParams): Promise<InvokeResult> {
  assertApiKey();
  if (isGeminiKey()) {
    return invokeGemini(params);
  }
  if (isYouComKey()) {
    return invokeYouCom(params);
  }

  const apiUrl = resolveApiUrl();
  if (!apiUrl) {
    throw new Error("No upstream LLM URL configured; falling back to local verified guidance");
  }

  const {
    messages,
    tools,
    toolChoice,
    tool_choice,
    outputSchema,
    output_schema,
    responseFormat,
    response_format,
    model,
    thinking,
    reasoning,
    maxTokens,
    max_tokens,
  } = params;

  const payload: Record<string, unknown> = {
    messages: messages.map(normalizeMessage),
  };

  if (model) {
    payload.model = model;
  }

  if (tools && tools.length > 0) {
    payload.tools = tools;
  }

  const normalizedToolChoice = normalizeToolChoice(
    toolChoice || tool_choice,
    tools
  );
  if (normalizedToolChoice) {
    payload.tool_choice = normalizedToolChoice;
  }

  const resolvedMaxTokens = max_tokens ?? maxTokens;
  if (typeof resolvedMaxTokens === "number") {
    payload.max_tokens = resolvedMaxTokens;
  }

  if (thinking) {
    payload.thinking = thinking;
  }
  if (reasoning) {
    payload.reasoning = reasoning;
  }

  const normalizedResponseFormat = normalizeResponseFormat({
    responseFormat,
    response_format,
    outputSchema,
    output_schema,
  });

  if (normalizedResponseFormat) {
    payload.response_format = normalizedResponseFormat;
  }

  const response = await fetchWithBackoff(apiUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${ENV.forgeApiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `LLM invoke failed: ${response.status} ${response.statusText} – ${errorText}`
    );
  }

  return (await response.json()) as InvokeResult;
}

export type ModelInfo = {
  id: string;
  object: string;
  created: number;
  owned_by: string;
};

export type ModelsResponse = {
  object: string;
  data: ModelInfo[];
};

export async function listLLMModels(): Promise<ModelsResponse> {
  assertApiKey();

  const url = ENV.forgeApiUrl && ENV.forgeApiUrl.trim().length > 0
    ? `${ENV.forgeApiUrl.replace(/\/$/, "")}/v1/models`
    : "https://forge.manus.im/v1/models";

  const response = await fetchWithBackoff(url, {
    headers: { authorization: `Bearer ${ENV.forgeApiKey}` },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `List LLM models failed: ${response.status} ${response.statusText} – ${errorText}`
    );
  }

  return (await response.json()) as ModelsResponse;
}
