const NS = "cau-eng-hub:v2:";
const memory = new Map(); // fallback when localStorage is blocked
let warned = false;

function storageOk() {
  try {
    const k = NS + "__t";
    localStorage.setItem(k, "1");
    localStorage.removeItem(k);
    return true;
  } catch { return false; }
}
const OK = typeof window !== 'undefined' ? storageOk() : false;

export const store = {
  get(key, fallback) {
    try {
      const raw = OK ? localStorage.getItem(NS + key) : memory.get(key);
      return raw == null ? structuredClone(fallback) : JSON.parse(raw);
    } catch { return structuredClone(fallback); }
  },
  set(key, value) {
    const raw = JSON.stringify(value);
    if (!OK) {
      memory.set(key, raw);
      if (!warned) { warned = true; console.warn("Storage blocked: progress will not persist."); }
      return false;
    }
    try { localStorage.setItem(NS + key, raw); return true; }
    catch { return false; } // quota exceeded
  },
  update(key, fallback, fn) {
    const next = fn(this.get(key, fallback));
    this.set(key, next);
    return next;
  },
  exportAll() {
    const out = {};
    if (OK) {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k.startsWith(NS)) out[k.slice(NS.length)] = JSON.parse(localStorage.getItem(k));
      }
    } else memory.forEach((v, k) => (out[k] = JSON.parse(v)));
    return out;
  },
  importAll(obj) {
    if (!obj || typeof obj !== "object" || obj.meta?.schema !== 2) throw new Error("Invalid profile file");
    for (const [k, v] of Object.entries(obj)) this.set(k, v);
  },
};

// One-time migration from v1 keys (best effort)
export function migrateV1() {
  if (store.get("meta", {}).schema === 2) return;
  try {
    const oldName = localStorage.getItem("cauCurrentStudentName");
    if (oldName) store.update("profile", {}, p => ({ ...p, name: oldName }));
  } catch {}
  store.set("meta", { schema: 2 });
}
