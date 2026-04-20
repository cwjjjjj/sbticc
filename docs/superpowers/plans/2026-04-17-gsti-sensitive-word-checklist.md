# GSTI Sensitive Word + Pattern Audit

Date: 2026-04-17
Branch: `feat/gsti-gender-swap`

## Scope

- Source: `src/data/gsti/types.ts`
- Targets: 40 normal GSTI types, `UNDEF`, `HWDP`, and `NORMAL_TYPES` pattern vectors.

## Sensitive Word Scan

Command:

```bash
rg -n "娼|妓|粪|婊|贱|滚|日你|草你|死全家|不得好死|小.砸" src/data/gsti/types.ts
```

Result: no matches.

Additional high-risk scan:

```bash
rg -n "PUA|拳师|北京小灵|死|不得好死|妈宝男|凤凰男" src/data/gsti/types.ts
```

Result: only one neutral phrase matched: `生死` in `M_CTRL` description. No replacement needed.

## Symmetry Audit

Conclusion: pass.

- Male-user pool uses female-label stereotypes such as `M_GOLD`, `M_CTRL`, `M_HOOK`.
- Female-user pool uses male-label stereotypes such as `F_PHNX`, `F_DARK`, `F_BOSS`, `F_OCEA`.
- Both pools contain sharp but entertainment-framed criticism. Neither side uses direct hate speech, curses, or real-group attack slogans.
- Existing disclaimer is present in GenderPicker, GSTI home, and genderLocked ResultPage.

## Pattern Calibration

Issue found before calibration:

- Male pool: 20 entries, 18 unique patterns.
- Female pool: 20 entries, 8 unique patterns.
- All normal GSTI types: 40 entries, 22 unique patterns.

Fix:

- Converted GSTI patterns from binary `A/B` strings to ternary `L/M/H` strings to match `gstiConfig.sumToLevel`.
- Calibrated all 40 normal type patterns so every pair differs by at least 2 dimensions.

Verification script:

```bash
node - <<'NODE'
const fs=require('fs');
const s=fs.readFileSync('src/data/gsti/types.ts','utf8');
const arr=[...s.matchAll(/\{ code: '([^']+)', pattern: '([^']+)'/g)]
  .map(m=>({code:m[1], pattern:m[2]}))
  .filter(x=>x.code.startsWith('M_')||x.code.startsWith('F_'));
function h(a,b){let d=0; for(let i=0;i<a.length;i++) if(a[i]!==b[i]) d++; return d;}
for (const label of ['all','M_','F_']) {
  const pool = label === 'all' ? arr : arr.filter(x=>x.code.startsWith(label));
  const unique = new Set(pool.map(x=>x.pattern)).size;
  let min = 99; let pair = [];
  for (let i=0;i<pool.length;i++) for (let j=i+1;j<pool.length;j++) {
    const d=h(pool[i].pattern,pool[j].pattern);
    if (d<min) { min=d; pair=[pool[i].code,pool[j].code]; }
  }
  console.log(label, 'count', pool.length, 'unique', unique, 'minHamming', min, pair.join('+'));
}
console.log('invalid', arr.filter(x=>!/^[LMH]{6}$/.test(x.pattern)).length);
NODE
```

Result:

```text
all count 40 unique 40 minHamming 2 M_GOLD+M_TEAM
M_ count 20 unique 20 minHamming 2 M_GOLD+M_TEAM
F_ count 20 unique 20 minHamming 2 F_PHNX+F_STRG
invalid 0
```

## Algorithm Self-Test

Command: random-answer GSTI computeResult smoke via `npx tsx`.

Result sample:

```text
male: M_FBRO | M_WHIT | M_MALK | M_HUBY | M_FBRO
female: F_TOOL | F_KBGR | F_KBGR | F_MGIR | F_BRIC
unspecified: UNDEF | F_TOOL | M_CTRL | M_GOLD | F_KBGR
```

Conclusion:

- `male` stays inside `M_` pool.
- `female` stays inside `F_` pool.
- `unspecified` can hit mixed pool and the hidden `UNDEF` path.
- Browser-level poster/share visual smoke is deferred to Task 18 preview testing.
