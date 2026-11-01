export async function sha256(text) {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
  }
  // Node fallback
  const { createHash } = await import('node:crypto');
  return createHash('sha256').update(text).digest('hex');
}

// Prevent spreadsheet formula injection and handle quotes/newlines
export function csvCell(value) {
  let s = String(value ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
}

export function toCsv(headers, rows) {
  const lines = [headers.map(csvCell).join(",")];
  for (const r of rows) lines.push(r.map(csvCell).join(","));
  return "\uFEFF" + lines.join("\r\n"); // BOM so Excel reads Turkish characters
}

export function downloadText(filename, text, mime = "text/csv;charset=utf-8;") {
  if (typeof window === 'undefined') return;
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  const a = Object.assign(document.createElement("a"), { href: url, download: filename });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const cleanName = s =>
  String(s ?? "").normalize("NFKC").replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, 24);
