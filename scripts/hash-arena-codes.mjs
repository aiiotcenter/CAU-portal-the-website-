import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SALT = 'CAU_ARENA_2026_SALT_';

// Default master cohort codes for CAU Prep School 2026
const masterCodes = [
  'CAU-ARENA-2026',
  'PREP-KYRENIA-2026',
  'CAU-HONORS-2026',
  'CAU-DEAN-2026',
  'CYPRUS-AYDIN-2026',
  'CAU-GLOBAL-2026',
  'CAU-STUDENT-2026',
  'CAU-ENGLISH-2026',
  'ARENA-CHAMPION-2026',
  'KYRENIA-ELITE-2026',
  'CAU-PREP-2026',
  'CAU-2026-PASS'
];

// Check if any additional codes file exists
const candidatePaths = [
  path.join(__dirname, '../CAU_English_Arena_Codes.txt'),
  path.join(__dirname, '../../CAU_English_Arena_Codes.txt'),
  path.join(__dirname, '../docs/archive/CAU_English_Arena_Codes.txt')
];

const foundCodes = new Set(masterCodes);

for (const p of candidatePaths) {
  if (fs.existsSync(p)) {
    console.log(`Found codes reference at ${p}`);
    const text = fs.readFileSync(p, 'utf8');
    // Extract any code-like tokens
    const matches = text.match(/[A-Z0-9]{3,}-[A-Z0-9]{3,}-[A-Z0-9]{3,}/g);
    if (matches) {
      matches.forEach(m => foundCodes.add(m));
    }
    // Also look for specific PASS / CODE matches
    const codeMatches = text.match(/(?:CODE|KEY|PASS):\s*([A-Za-z0-9\-_]+)/gi);
    if (codeMatches) {
      codeMatches.forEach(m => {
        const val = m.split(':')[1]?.trim();
        if (val) foundCodes.add(val.toUpperCase());
      });
    }
  }
}

console.log(`Hashing ${foundCodes.size} unique access codes with salt '${SALT}'...`);

const hashes = Array.from(foundCodes).map(code => {
  const normalized = SALT + code.trim().toUpperCase();
  return crypto.createHash('sha256').update(normalized).digest('hex');
});

// Output ES Module client/js/arena-hashes.js
const outputJs = `/**
 * ==============================================================================
 * CYPRUS AYDIN UNIVERSITY (CAU) — CRYPTOGRAPHIC ARENA ACCESS HASHES
 * Generated via scripts/hash-arena-codes.mjs.
 * Plain-text vouchers are never stored or shipped to the public client.
 * ==============================================================================
 */

export const ARENA_SALT = '${SALT}';

export const ARENA_HASHES = ${JSON.stringify(hashes, null, 2)};

export const ARENA_HASHES_SET = new Set(ARENA_HASHES);

/**
 * Validates a user-entered code against salted SHA-256 hashes via Web Crypto API
 * @param {string} rawInput
 * @returns {Promise<boolean>}
 */
export async function verifyArenaCode(rawInput) {
  if (!rawInput || typeof rawInput !== 'string') return false;
  const trimmed = rawInput.trim().toUpperCase();
  if (!trimmed) return false;

  try {
    const normalized = ARENA_SALT + trimmed;
    const msgBuffer = new TextEncoder().encode(normalized);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashHex = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    return ARENA_HASHES_SET.has(hashHex);
  } catch (err) {
    console.error('Error during crypto.subtle verification:', err);
    return false;
  }
}

// Global window attachment for non-module usage
if (typeof window !== 'undefined') {
  window.ARENA_SALT = ARENA_SALT;
  window.ARENA_HASHES = ARENA_HASHES;
  window.verifyArenaCode = verifyArenaCode;
}
`;

const dest1 = path.join(__dirname, '../client/js/arena-hashes.js');
fs.writeFileSync(dest1, outputJs, 'utf8');

const dest2 = path.join(__dirname, '../client/public/js/arena-hashes.js');
fs.mkdirSync(path.dirname(dest2), { recursive: true });
fs.writeFileSync(dest2, outputJs, 'utf8');

const dest3 = path.join(__dirname, '../client/scripts/arena-hashes.js');
fs.writeFileSync(dest3, outputJs, 'utf8');

console.log('Successfully generated arena-hashes.js in client/js, client/public/js, and client/scripts!');
