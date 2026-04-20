import type { CompatEntry, CompatResult } from '../testConfig';

export const COMPATIBILITY: Record<string, CompatEntry> = {};

export function getCompatibility(a: string, b: string): CompatResult {
  // Strip A/T suffix and look up by main type
  const mainA = a.split('-')[0];
  const mainB = b.split('-')[0];
  const key = `${mainA}+${mainB}`;
  const reverseKey = `${mainB}+${mainA}`;
  const entry = COMPATIBILITY[key] ?? COMPATIBILITY[reverseKey];
  if (entry) return { type: entry.type, say: entry.say };
  if (mainA === mainB) return { type: 'mirror', say: '\u540c\u7c7b\u578b\u955c\u50cf\u3002' };
  return { type: 'normal', say: '\u666e\u901a\u7684\u5173\u7cfb\u3002' };
}
