import { bus } from "./events.js";
import { store } from "./store.js";

let dict = {}, lang = "en";

export async function initI18n() {
  if (typeof navigator !== 'undefined') {
    lang = store.get("profile", {}).lang || (navigator.language?.startsWith("tr") ? "tr" : "en");
  }
  await setLang(lang);
}

export async function setLang(next) {
  try {
    const res = await fetch(`data/i18n/${next}.json`);
    dict = await res.json();
  } catch(e) {
    dict = {};
  }
  lang = next;
  if (typeof document !== 'undefined') {
    document.documentElement.lang = next;
    apply();
  }
  store.update("profile", {}, p => ({ ...p, lang: next }));
  bus.emit("lang:changed", { lang });
}

export const t = (key, vars = {}) =>
  (dict[key] ?? key).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

export function apply(root = document) {
  if (!root || !root.querySelectorAll) return;
  root.querySelectorAll("[data-i18n]").forEach(n => (n.textContent = t(n.dataset.i18n)));
  root.querySelectorAll("[data-i18n-aria]").forEach(n => n.setAttribute("aria-label", t(n.dataset.i18nAria)));
}
