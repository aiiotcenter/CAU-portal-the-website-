/**
 * ==============================================================================
 * CYPRUS AYDIN UNIVERSITY (CAU) — CRYPTOGRAPHIC ARENA ACCESS HASHES
 * Generated via scripts/hash-arena-codes.mjs.
 * Plain-text vouchers are never stored or shipped to the public client.
 * ==============================================================================
 */

export const ARENA_SALT = 'CAU_ARENA_2026_SALT_';

export const ARENA_HASHES = [
  "8aca2809ccb6d89818d3867abd60af3e8da6c495381fbfeed25f9c77eb17db0b",
  "7a0e7f8b6dde10040ec09c6779756a2aa9e567e443e9b094d8d2c85cffc769b0",
  "f00306e2cbea14aec8a57df628cd452f48cded2fed72aa80f084e6e1a5b55ca7",
  "87c6dd008facc1d66aeaa1cf24ba516a7b96a6d2765ba5257f0e2f8f6e57415c",
  "7e0a724054b13606a662260e66117bb6c3fcc81fcc8528e9ffa85da1d108a257",
  "d7217c1a501bdedbc9e0e1d89d92892e110f8a90c97910925271e923b01347bb",
  "43c7accd0c392ae5b1d244db8780113cedc639f431d3ee2f83b8c70daf880d1e",
  "5597e745d1a45ae3fc281feec89b48e42103988dd86e9e0b69c0339f787825eb",
  "dceb9060e866fccbc877eba9189bdaa4bd5519e55499dd99750f5ac6613ab923",
  "345007aad9701c5935fd6028f78071138545d1156fa74bc64f1b40a667f9b824",
  "56dbb52901e77ea9751146d001d67d4a34dd47768a16c742ae08e6c8bd9724d5",
  "7f8e2c238af5ca8d2bee179595179e45ea3dd3bb7a3f743f1191913b50ddb724"
];

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
