import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Always ensure .env in the project root is loaded and overrides any stale inherited process.env
try {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: true });
  } else {
    dotenv.config({ override: true });
  }
} catch {
  dotenv.config({ override: true });
}

export const ENV = {
  get appId() {
    return process.env.VITE_APP_ID ?? "";
  },
  get cookieSecret() {
    return process.env.JWT_SECRET ?? "";
  },
  get databaseUrl() {
    return process.env.DATABASE_URL ?? "";
  },
  get oAuthServerUrl() {
    return process.env.OAUTH_SERVER_URL ?? "";
  },
  get ownerOpenId() {
    return process.env.OWNER_OPEN_ID ?? "";
  },
  get isProduction() {
    return process.env.NODE_ENV === "production";
  },
  get geminiApiKey() {
    const geminiKey = process.env.GEMINI_API_KEY || "";
    const openAiKey = process.env.OPENAI_API_KEY || "";
    if (geminiKey.startsWith("AQ.")) return geminiKey;
    if (openAiKey.startsWith("AQ.")) return openAiKey;
    if (geminiKey.startsWith("AIza") || geminiKey.length > 20) return geminiKey;
    if (openAiKey.startsWith("AIza") || openAiKey.length > 20) return openAiKey;
    return geminiKey;
  },
  get forgeApiUrl() {
    return (
      process.env.BUILT_IN_FORGE_API_URL ||
      process.env.OPENAI_API_URL ||
      process.env.LLM_API_URL ||
      process.env.ANTHROPIC_API_URL ||
      ""
    );
  },
  get forgeApiKey() {
    return (
      process.env.GEMINI_API_KEY ||
      process.env.BUILT_IN_FORGE_API_KEY ||
      process.env.OPENAI_API_KEY ||
      process.env.LLM_API_KEY ||
      process.env.ANTHROPIC_API_KEY ||
      ""
    );
  },
  get llmModel() {
    return process.env.LLM_MODEL || process.env.OPENAI_MODEL || "";
  },
};
