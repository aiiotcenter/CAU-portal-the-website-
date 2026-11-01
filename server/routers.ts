import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  CAU_ASSISTANT_SYSTEM_PROMPT,
  CAU_SOURCES,
  CAU_SOURCE_IDS,
  createFallbackAnswer,
  getFastPathAnswer,
  isCAUQuery,
  isConversationalQuestion,
  sourcesForIds,
} from "./assistant/knowledge";
import { AssistantQuota } from "./assistant/quota";
import { globalAssistantCache } from "./assistant/cache";
import { getSessionCookieOptions } from "./_core/cookies";
import { ENV } from "./_core/env";
import { invokeLLM } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { cmsRouter } from "./cms/cmsRouter";
import { universityRouter } from "./university/universityRouter";
import { 
  handleProgramFinder, 
  handleTuitionCalculator, 
  handleAdmissions, 
  handleApplicationProcess, 
  handleCyprusLife, 
  handleProgramExplainer, 
  handleAISearch,
  handleUniversityGuide,
  handleInternationalMode,
  handleCareerFinder,
  handleCampusAssistant,
  handleStudentPlanner
} from "./assistant/navigator";

const ASSISTANT_LIMIT = 60;
const ASSISTANT_WINDOW_MS = 5 * 60 * 1000;
const assistantQuota = new AssistantQuota({
  limit: ASSISTANT_LIMIT,
  windowMs: ASSISTANT_WINDOW_MS,
});

function assertAssistantQuota(clientKey: string) {
  if (!assistantQuota.take(clientKey)) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Please wait a few minutes before sending another CAU assistant question.",
    });
  }
}

function responseText(content: unknown): string | undefined {
  if (typeof content === "string") return content;
  return undefined;
}

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  cms: cmsRouter,
  university: universityRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  assistant: router({
    navigator: publicProcedure
      .input(
        z.object({
          action: z.string(),
          payload: z.any().optional(),
          val: z.any().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const payload = input.payload !== undefined ? input.payload : input.val;
        const act = input.action.toLowerCase().trim();

        if (act === "program_finder" || act === "find_program") {
          return await handleProgramFinder(payload);
        } else if (act === "tuition_calculator" || act === "tuition" || act === "calculate_tuition") {
          return await handleTuitionCalculator(payload);
        } else if (act === "check_admissions" || act === "admissions") {
          return await handleAdmissions(payload);
        } else if (act === "application_process" || act === "application_assistant" || act === "apply") {
          return await handleApplicationProcess(payload);
        } else if (act === "cyprus_life" || act === "life_cyprus" || act === "living_in_cyprus") {
          return await handleCyprusLife(payload);
        } else if (act === "course_explainer" || act === "program_explainer" || act === "explain_program" || act === "explain") {
          return await handleProgramExplainer(payload);
        } else if (act === "search" || act === "ai_search") {
          return await handleAISearch(payload);
        } else if (act === "university_guide" || act === "guide" || act === "journey") {
          return await handleUniversityGuide(payload);
        } else if (act === "international_mode" || act === "international" || act === "country_guide") {
          return await handleInternationalMode(payload);
        } else if (act === "career_finder" || act === "career") {
          return await handleCareerFinder(payload);
        } else if (act === "campus_assistant" || act === "campus" || act === "facilities") {
          return await handleCampusAssistant(payload);
        } else if (act === "student_planner" || act === "planner" || act === "first_week") {
          return await handleStudentPlanner(payload);
        }
        return await handleProgramFinder(payload);
      }),
    ask: publicProcedure
      .input(
        z.object({
          question: z.string().trim().min(1).max(1000),
          history: z
            .array(
              z.object({
                role: z.enum(["user", "assistant"]),
                content: z.string().max(2000),
              })
            )
            .optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const clientKey = ctx.req.ip || "anonymous";
        assertAssistantQuota(clientKey);

        // Enforce maximum 30 words per message constraint
        const words = input.question.trim().split(/\s+/).filter(Boolean);
        if (words.length > 30) {
          return {
            answer: `Please keep your question to a maximum of 30 words (you entered ${words.length} words). Keeping questions concise helps me provide you with the most accurate official guidance for Cyprus Aydın University.`,
            sources: [CAU_SOURCES["about-cau"]],
            suggestedChips: [
              { label: "⚽ Football Team", prompt: "Is there any football team at CAU?" },
              { label: "💰 Tuition & Fees", prompt: "What are the tuition fees for international students?" },
              { label: "🌴 Living in Cyprus", prompt: "What is the cost of living in Kyrenia?" },
              { label: "📝 How to Apply", prompt: "How do I apply for international admission?" },
            ],
            mode: "verified" as const,
          };
        }

        const hasHistory = Array.isArray(input.history) && input.history.length > 0;
        const isGreeting = !hasHistory && isConversationalQuestion(input.question);
        console.log(`[CAU Assistant] Q: "${input.question}" from ${clientKey} (history: ${input.history?.length || 0}) isGreeting=${isGreeting}`);

        // Tier 1: In-Memory LRU Cache (< 1ms instant resolution)
        const cached = globalAssistantCache.get(input.question);
        if (cached) {
          console.log(`[CAU Assistant] -> IN-MEMORY CACHE HIT (<1ms): "${input.question}"`);
          return {
            answer: cached.answer,
            sources: sourcesForIds(cached.sourceIds),
            suggestedChips: cached.suggestedChips,
            actionLinks: cached.actionLinks,
            mode: "verified" as const,
          };
        }

        // Tier 2: Instant Fast-Path for Greetings & Direct Verified Matchers (< 2ms)
        const fastPath = getFastPathAnswer(input.question, input.history);
        if (fastPath) {
          console.log(`[CAU Assistant] -> fast-path verified answer (${fastPath.suggestedChips?.length || 0} chips): ${fastPath.answer.slice(0, 70)}`);
          globalAssistantCache.set(input.question, {
            answer: fastPath.answer,
            sourceIds: fastPath.sources?.map(s => s.id) || ["cau-main"],
            suggestedChips: fastPath.suggestedChips,
            mode: "verified",
          });
          return fastPath;
        }

        try {
          const rawHistory = Array.isArray(input.history) ? input.history : [];
          // Deduplicate if client already pushed the current question into history
          const historyMessages = rawHistory
            .filter((m, idx) => {
              if (idx === rawHistory.length - 1 && m.role === "user" && m.content?.trim() === input.question?.trim()) {
                return false;
              }
              return Boolean(m && typeof m.content === "string" && m.content.trim());
            })
            .slice(-6)
            .map(m => ({
              role: m.role as "user" | "assistant",
              content: m.content,
            }));

          console.log(`[CAU Assistant] -> invoking LLM (${ENV.llmModel || "gemini-3.1-flash-lite"}) for: "${input.question.slice(0, 60)}"`);
          const completion = await invokeLLM({
            model: ENV.llmModel || "gemini-3.1-flash-lite",
            max_tokens: 1200,
            messages: [
              { role: "system", content: CAU_ASSISTANT_SYSTEM_PROMPT },
              ...historyMessages,
              { role: "user", content: input.question },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "cau_verified_answer",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    answer: { type: "string" },
                    sourceIds: {
                      type: "array",
                      items: { type: "string", enum: CAU_SOURCE_IDS },
                    },
                  },
                  required: ["answer", "sourceIds"],
                  additionalProperties: false,
                },
              },
            },
          });

          const content = responseText(completion.choices[0]?.message.content);
          let answer = "";
          let sourceIds: string[] = [];

          if (content) {
            let clean = content.trim();
            if (clean.startsWith("```json")) {
              clean = clean.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
            } else if (clean.startsWith("```")) {
              clean = clean.replace(/^```\s*/, "").replace(/```\s*$/, "").trim();
            }

            try {
              const parsed = JSON.parse(clean);
              if (typeof parsed?.answer === "string") {
                answer = parsed.answer.trim();
              } else if (typeof parsed?.message === "string") {
                answer = parsed.message.trim();
              } else if (typeof parsed?.reply === "string") {
                answer = parsed.reply.trim();
              } else if (typeof parsed?.response === "string") {
                answer = parsed.response.trim();
              } else if (typeof parsed?.text === "string") {
                answer = parsed.text.trim();
              } else if (typeof parsed === "string") {
                answer = parsed.trim();
              } else if (parsed && typeof parsed === "object") {
                const vals = Object.values(parsed).filter(v => typeof v === "string" && v.trim().length > 0);
                if (vals.length > 0) answer = (vals[0] as string).trim();
              }

              sourceIds = Array.isArray(parsed?.sourceIds)
                ? parsed.sourceIds
                : isCAUQuery(input.question)
                ? ["cau-main", "about-cau"]
                : [];
            } catch {
              // Extract answer string via regex if JSON was truncated or malformed
              const match = clean.match(/"(?:answer|reply|message|text)"\s*:\s*"((?:[^"\\]|\\.)*)/);
              if (match) {
                try {
                  answer = JSON.parse(`"${match[1]}"`);
                } catch {
                  answer = match[1].replace(/\\n/g, "\n").replace(/\\"/g, '"').trim();
                }
              } else {
                // Direct text / markdown response from LLM
                answer = clean;
              }
              sourceIds = isCAUQuery(input.question) ? ["cau-main", "akademik-kadro"] : [];
            }
          }

          if (!answer) throw new Error("Assistant response did not contain an answer");

          console.log(`[CAU Assistant] <- Gemini LLM verified: ${answer.slice(0, 80)} sources=${JSON.stringify(sourceIds)}`);
          // Clean raw URLs/markdown links since official clickable source cards are rendered by the client UI
          const cleanAnswer = answer
            .replace(/\[([^\]]+)\]\(https?:\/\/[^\)]+\)/g, "$1")
            .replace(/https?:\/\/\S+/g, "")
            .trim();

          const suggestedChips = [
            { label: "Tuition & Fees", prompt: "How much is tuition for international students?" },
            { label: "Scholarships (Up to 100%)", prompt: "What scholarships are available?" },
            { label: "Browse Programmes", prompt: "What degree programmes are offered at CAU?" },
          ];

          // Save to in-memory cache for instant subsequent responses
          globalAssistantCache.set(input.question, {
            answer: cleanAnswer,
            sourceIds,
            suggestedChips,
            mode: "verified",
          });

          return {
            answer: cleanAnswer,
            sources: sourcesForIds(sourceIds),
            suggestedChips,
            mode: "verified" as const,
          };
        } catch (error) {
          console.error("[CAU Assistant] Falling back to local verified guidance:", error);
          const fb = createFallbackAnswer(input.question, input.history);
          console.log(`[CAU Assistant] <- fallback: ${fb.answer.slice(0, 80)}`);
          globalAssistantCache.set(input.question, {
            answer: fb.answer,
            sourceIds: fb.sources?.map(s => s.id) || ["cau-main"],
            suggestedChips: fb.suggestedChips,
            mode: "verified",
          });
          return fb;
        }
      }),
    generateEnglishQuestions: publicProcedure
      .input(
        z.object({
          level: z.string(),
          count: z.number().min(1).max(10).default(5),
          mode: z.enum(["ladder", "stage", "meme"]).default("stage")
        })
      )
      .mutation(async ({ input }) => {
        try {
          const completion = await invokeLLM({
            model: ENV.llmModel || "gemini-3-flash-preview",
            maxTokens: 3000,
            messages: [
              {
                role: "system",
                content: `You are an expert Cambridge ESOL & TOEFL test creator. Generate exactly ${input.count} English grammar/reading questions tailored to CEFR level ${input.level}. 
Theme: The questions should be themed around "Cyprus Aydin University" (CAU) campus life, engineering labs, dorms, faculties, scholarships, or general university pragmatics.
Format: Return a JSON array of question objects.
Types of questions you can mix: "cloze", "spot_error", "dialogue", "lexicon", "collocation", "reading".
For "spot_error", provide an "errorStem" string (with [A], [B], [C], [D] markers in text).
For "cloze", provide a "clozeStem" string (with [ _____ ] where the blank is).
For "dialogue", provide an array of {speaker, text}.
For "reading", provide a "passage" string.
The "q" property is the actual prompt asking the user what to do.
The "a" property must be an array of EXACTLY 4 string options.
The "c" property must be the integer index (0-3) of the correct option in the "a" array.
The "rationale" property must briefly explain why the answer is correct.`
              },
              { role: "user", content: `Generate ${input.count} questions for CEFR level ${input.level}. Make sure they are totally new and never seen before.` }
            ],
            responseFormat: {
              type: "json_schema",
              json_schema: {
                name: "english_questions",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    questions: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          type: { type: "string", enum: ["cloze", "spot_error", "dialogue", "lexicon", "collocation", "reading", "meme"] },
                          level: { type: "string" },
                          timeLimit: { type: "integer" },
                          clozeStem: { type: ["string", "null"] },
                          errorStem: { type: ["string", "null"] },
                          passage: { type: ["string", "null"] },
                          scenario: { type: ["string", "null"] },
                          dialogue: {
                            type: ["array", "null"],
                            items: {
                              type: "object",
                              properties: {
                                speaker: { type: "string" },
                                text: { type: "string" }
                              },
                              required: ["speaker", "text"],
                              additionalProperties: false
                            }
                          },
                          q: { type: "string" },
                          a: { 
                            type: "array",
                            items: { type: "string" }
                          },
                          c: { type: "integer" },
                          rationale: { type: "string" }
                        },
                        required: ["id", "type", "level", "timeLimit", "q", "a", "c", "rationale", "clozeStem", "errorStem", "passage", "scenario", "dialogue"],
                        additionalProperties: false
                      }
                    }
                  },
                  required: ["questions"],
                  additionalProperties: false
                }
              }
            }
          });
          const text = typeof completion.choices[0].message.content === "string" ? completion.choices[0].message.content : "";
          let clean = text.trim();
          if (clean.startsWith("```json")) {
            clean = clean.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
          } else if (clean.startsWith("```")) {
            clean = clean.replace(/^```\s*/, "").replace(/```\s*$/, "").trim();
          }
          const parsed = JSON.parse(clean);
          return { questions: parsed.questions };
        } catch (error) {
          console.error("AI Generation Error", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to generate questions" });
        }
      }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
