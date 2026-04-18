/**
 * FSI Pattern Uniqueness Self-Check
 * ----------------------------------
 * Verifies that the 18 NORMAL_TYPES pattern vectors in
 * `src/data/fsi/types.ts` are all unique AND that the minimum
 * Hamming distance between any two patterns is >= 2.
 *
 * Run:
 *   npx tsx scripts/fsi-pattern-check.ts
 *
 * Exits non-zero on failure so the script can gate CI if desired.
 */

import { NORMAL_TYPES } from '../src/data/fsi/types';

const PATTERN_LEN = 6;
const MIN_HAMMING_REQUIRED = 2;

function main(): void {
  const seen = new Map<string, string>();
  const dupes: Array<[string, string, string]> = [];
  for (const t of NORMAL_TYPES) {
    const prev = seen.get(t.pattern);
    if (prev !== undefined) dupes.push([prev, t.code, t.pattern]);
    else seen.set(t.pattern, t.code);
  }

  let minDist = Number.POSITIVE_INFINITY;
  let minPair: [string, string] | null = null;
  for (let i = 0; i < NORMAL_TYPES.length; i++) {
    for (let j = i + 1; j < NORMAL_TYPES.length; j++) {
      const a = NORMAL_TYPES[i].pattern;
      const b = NORMAL_TYPES[j].pattern;
      let d = 0;
      for (let k = 0; k < PATTERN_LEN; k++) {
        if (a[k] !== b[k]) d++;
      }
      if (d < minDist) {
        minDist = d;
        minPair = [NORMAL_TYPES[i].code, NORMAL_TYPES[j].code];
      }
    }
  }

  console.log(`total: ${NORMAL_TYPES.length}`);
  console.log(`unique: ${seen.size}`);
  console.log(`dupes: ${JSON.stringify(dupes)}`);
  console.log(`min hamming distance: ${minDist}${minPair ? ` (pair: ${minPair[0]} vs ${minPair[1]})` : ''}`);

  const uniqueOk = dupes.length === 0 && seen.size === NORMAL_TYPES.length;
  const hammingOk = minDist >= MIN_HAMMING_REQUIRED;

  if (uniqueOk && hammingOk) {
    console.log(`\nPASS: ${NORMAL_TYPES.length}/${NORMAL_TYPES.length} patterns unique, min Hamming = ${minDist} (>= ${MIN_HAMMING_REQUIRED}).`);
    process.exit(0);
  } else {
    console.error('\nFAIL:');
    if (!uniqueOk) console.error(`  - duplicate patterns found: ${JSON.stringify(dupes)}`);
    if (!hammingOk) console.error(`  - min Hamming distance ${minDist} < required ${MIN_HAMMING_REQUIRED}`);
    process.exit(1);
  }
}

main();
