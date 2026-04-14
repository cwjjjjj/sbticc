# SBTI Dark Redesign + React Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the SBTI personality test SPA from Vanilla JS to React with a dark, provocative visual design — all features preserved, zero regressions.

**Architecture:** Vite-based React SPA using Tailwind CSS for utility classes, Emotion for component-scoped styles, and Framer Motion for animations. Data definitions (types, questions, dimensions) are extracted verbatim from `main.js` into typed modules. The existing Vercel serverless API (`/api/*`) is untouched. The old `index.html` + `main.js` + `main.css` are replaced by the React build output.

**Tech Stack:** Vite, React 18, Tailwind CSS v3, Emotion, Framer Motion, qrcode-generator, Vercel

---

## File Structure

```
src/
├── main.tsx                        # ReactDOM.createRoot, domain redirect
├── App.tsx                         # Tab routing + quiz overlay state
├── index.css                       # Tailwind directives + global resets
├── theme/
│   └── tokens.ts                   # Design tokens (colors, fonts, radii)
├── data/
│   ├── dimensions.ts               # dimensionMeta, dimensionOrder, DIM_EXPLANATIONS
│   ├── questions.ts                # questions[], specialQuestions[]
│   ├── types.ts                    # TYPE_LIBRARY, NORMAL_TYPES, TYPE_RARITY
│   ├── typeImages.ts               # TYPE_IMAGES, SHARE_IMAGES
│   └── compatibility.ts            # COMPATIBILITY map
├── utils/
│   ├── matching.ts                 # sumToLevel, parsePattern, computeResult
│   ├── compare.ts                  # CompareUtil encode/decode
│   ├── shareCard.ts                # Canvas drawing for share/invite images
│   └── quiz.ts                     # shuffle, getVisibleQuestions
├── hooks/
│   ├── useQuiz.ts                  # Quiz state machine (answers, currentQ, progress)
│   ├── useRanking.ts               # Fetch /api/ranking
│   └── useLocalHistory.ts          # localStorage read/write for test history
├── components/
│   ├── Nav.tsx                     # Fixed top nav with glassmorphism
│   ├── Hero.tsx                    # Hero section + stats + ticker
│   ├── TypeCardsPreview.tsx        # Horizontal scrolling type cards
│   ├── ProfilesGallery.tsx         # Full type gallery with expand/collapse
│   ├── CompatTable.tsx             # Compatibility pair grid
│   ├── QuizOverlay.tsx             # Full-screen quiz overlay
│   ├── QuestionCard.tsx            # Single question with options
│   ├── ProgressBar.tsx             # Gradient progress bar
│   ├── Interstitial.tsx            # 5s countdown before results
│   ├── ResultPage.tsx              # Result display (poster, dims, compat, actions)
│   ├── DimList.tsx                 # 15-dimension score bars
│   ├── ShareModal.tsx              # Share image preview + download/share
│   ├── RankingPage.tsx             # Global ranking + local history
│   ├── ComparePage.tsx             # Two-person comparison
│   └── RadarChart.tsx              # Canvas radar chart
└── vite-env.d.ts
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json` (new React deps), `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `tailwind.config.js`, `postcss.config.js`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/vite-env.d.ts`, `index.html` (Vite entry)
- Preserve: `api/`, `images/`, `sw.js`, `public/` assets

- [ ] **Step 1: Create branch and init Vite project**

```bash
git checkout -b feat/dark-react-redesign
npm create vite@latest . -- --template react-ts
```

Since we're in an existing repo, manually create the files instead:

```bash
npm install react react-dom @emotion/react @emotion/styled framer-motion qrcode-generator
npm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

- [ ] **Step 2: Create vite.config.ts**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
    jsxImportSource: '@emotion/react',
  })],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "jsxImportSource": "@emotion/react",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Create tailwind.config.js**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#080808',
        surface: '#111111',
        'surface-2': '#1a1a1a',
        border: '#222222',
        accent: '#ff3b3b',
        warm: '#ffaa00',
        muted: '#666666',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"Noto Sans SC"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 5: Create src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&family=Noto+Sans+SC:wght@400;500;700;900&display=swap');

body {
  margin: 0;
  font-family: 'Noto Sans SC', -apple-system, sans-serif;
  background: #080808;
  color: #e8e8e8;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Noise overlay */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 9999;
  opacity: 0.4;
}
```

- [ ] **Step 6: Create new index.html (Vite entry)**

Back up old `index.html` → `index.old.html`, then create new:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SBTI 人格测试</title>
  <!-- Monetag: In-Page Push -->
  <script>(function(s){s.dataset.zone='10859606',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))</script>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
  <script defer src="/_vercel/insights/script.js"></script>
  <script defer src="/_vercel/speed-insights/script.js"></script>
</body>
</html>
```

- [ ] **Step 7: Create src/main.tsx with domain redirect**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Domain redirect
if (window.location.hostname === 'sbticc.vercel.app') {
  window.location.replace(
    'https://sbti.jiligulu.xyz' + window.location.pathname + window.location.search + window.location.hash
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

- [ ] **Step 8: Create minimal src/App.tsx**

```tsx
export default function App() {
  return <div className="text-white p-8">SBTI React App — scaffolding works</div>
}
```

- [ ] **Step 9: Verify dev server starts**

```bash
npx vite --open
```

Expected: Browser opens, shows "SBTI React App — scaffolding works" on black background.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: scaffold Vite + React + Tailwind + Emotion + Framer Motion project"
```

---

### Task 2: Data Layer Migration

**Files:**
- Create: `src/data/dimensions.ts`, `src/data/questions.ts`, `src/data/types.ts`, `src/data/typeImages.ts`, `src/data/compatibility.ts`, `src/theme/tokens.ts`

Extract all data definitions verbatim from `main.js` lines 16–702 (dimensionMeta, questions, specialQuestions, TYPE_LIBRARY, TYPE_IMAGES, NORMAL_TYPES, DIM_EXPLANATIONS, TYPE_RARITY, COMPATIBILITY, SHARE_IMAGES). Add TypeScript types.

- [ ] **Step 1: Create src/data/dimensions.ts**

Copy `dimensionMeta` (lines 16-32), `dimensionOrder` (line 703), and `DIM_EXPLANATIONS` (lines 626-701) from `main.js` verbatim. Add types:

```ts
export interface DimensionInfo {
  name: string
  model: string
}

export const dimensionMeta: Record<string, DimensionInfo> = { /* copy from main.js */ }
export const dimensionOrder: string[] = [ /* copy from main.js */ ]
export const DIM_EXPLANATIONS: Record<string, Record<string, string>> = { /* copy from main.js */ }
```

- [ ] **Step 2: Create src/data/questions.ts**

Copy `questions` (lines 33-303) and `specialQuestions` (lines 305-328) from `main.js` verbatim. Add types:

```ts
export interface QuestionOption {
  label: string
  value: number
}

export interface Question {
  id: string
  dim?: string
  text: string
  options: QuestionOption[]
  special?: boolean
  kind?: string
}

export const questions: Question[] = [ /* copy from main.js */ ]
export const specialQuestions: Question[] = [ /* copy from main.js */ ]
export const DRUNK_TRIGGER_QUESTION_ID = 'drink_gate_q2'
```

- [ ] **Step 3: Create src/data/types.ts**

Copy `TYPE_LIBRARY` (lines 330-493), `NORMAL_TYPES` (lines 524-625), `TYPE_RARITY` (lines 1239-1267) from `main.js`. Add types:

```ts
export interface TypeDef {
  code: string
  cn: string
  intro: string
  desc: string
}

export interface NormalType {
  code: string
  pattern: string
}

export interface RarityInfo {
  pct: number
  stars: number
  label: string
}

export const TYPE_LIBRARY: Record<string, TypeDef> = { /* copy from main.js */ }
export const NORMAL_TYPES: NormalType[] = [ /* copy from main.js */ ]
export const TYPE_RARITY: Record<string, RarityInfo> = { /* copy from main.js */ }
```

- [ ] **Step 4: Create src/data/typeImages.ts**

Copy `TYPE_IMAGES` (lines 494-522) and `SHARE_IMAGES` (lines 1622-1631) from `main.js`:

```ts
export const TYPE_IMAGES: Record<string, string> = { /* copy from main.js */ }
export const SHARE_IMAGES: Record<string, string> = { /* copy from main.js */ }
```

- [ ] **Step 5: Create src/data/compatibility.ts**

Copy `COMPATIBILITY` (lines 1944-1981) and `getCompatibility` function (lines 1983-1988):

```ts
export interface CompatEntry {
  type: 'soulmate' | 'rival'
  say: string
}

export const COMPATIBILITY: Record<string, CompatEntry> = { /* copy from main.js */ }

export function getCompatibility(codeA: string, codeB: string) {
  if (codeA === codeB) return { type: 'mirror' as const, say: '同类相遇，要么惺惺相惜，要么互相嫌弃' }
  return COMPATIBILITY[`${codeA}+${codeB}`] || COMPATIBILITY[`${codeB}+${codeA}`] || { type: 'normal' as const, say: '普通关系，相安无事' }
}
```

- [ ] **Step 6: Create src/theme/tokens.ts**

```ts
export const colors = {
  bg: '#080808',
  surface: '#111111',
  surface2: '#1a1a1a',
  border: '#222222',
  text: '#e8e8e8',
  muted: '#666666',
  accent: '#ff3b3b',
  accentGlow: 'rgba(255, 59, 59, 0.15)',
  warm: '#ffaa00',
} as const

export const fonts = {
  mono: '"JetBrains Mono", monospace',
  sans: '"Noto Sans SC", -apple-system, BlinkMacSystemFont, sans-serif',
} as const

export const PROD_BASE_URL = 'https://sbti.jiligulu.xyz'
```

- [ ] **Step 7: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 8: Commit**

```bash
git add src/data/ src/theme/
git commit -m "feat: migrate all data definitions and design tokens to typed modules"
```

---

### Task 3: Core Utils Migration

**Files:**
- Create: `src/utils/matching.ts`, `src/utils/quiz.ts`, `src/utils/compare.ts`

- [ ] **Step 1: Create src/utils/matching.ts**

Port `sumToLevel`, `levelNum`, `parsePattern`, `computeResult` from `main.js` lines 999-1093:

```ts
import { dimensionMeta, dimensionOrder, DIM_EXPLANATIONS } from '../data/dimensions'
import { questions } from '../data/questions'
import { TYPE_LIBRARY, NORMAL_TYPES } from '../data/types'

export function sumToLevel(score: number): string {
  if (score <= 3) return 'L'
  if (score === 4) return 'M'
  return 'H'
}

export function levelNum(level: string): number {
  return { L: 1, M: 2, H: 3 }[level] ?? 2
}

export function parsePattern(pattern: string): string[] {
  return pattern.replace(/-/g, '').split('')
}

export interface ComputeResultOutput {
  rawScores: Record<string, number>
  levels: Record<string, string>
  ranked: Array<any>
  bestNormal: any
  finalType: any
  modeKicker: string
  badge: string
  sub: string
  special: boolean
  secondaryType: any
}

export function computeResult(
  answers: Record<string, number>,
  drunkTriggered: boolean,
  debugForceType: string | null
): ComputeResultOutput {
  const rawScores: Record<string, number> = {}
  const levels: Record<string, string> = {}
  Object.keys(dimensionMeta).forEach(dim => { rawScores[dim] = 0 })

  questions.forEach(q => {
    rawScores[q.dim!] += Number(answers[q.id] || 0)
  })

  Object.entries(rawScores).forEach(([dim, score]) => {
    levels[dim] = sumToLevel(score)
  })

  const userVector = dimensionOrder.map(dim => levelNum(levels[dim]))
  const ranked = NORMAL_TYPES.map(type => {
    const vector = parsePattern(type.pattern).map(levelNum)
    let distance = 0
    let exact = 0
    for (let i = 0; i < vector.length; i++) {
      const diff = Math.abs(userVector[i] - vector[i])
      distance += diff
      if (diff === 0) exact += 1
    }
    const similarity = Math.max(0, Math.round((1 - distance / 30) * 100))
    return { ...type, ...TYPE_LIBRARY[type.code], distance, exact, similarity }
  }).sort((a, b) => {
    if (a.distance !== b.distance) return a.distance - b.distance
    if (b.exact !== a.exact) return b.exact - a.exact
    return b.similarity - a.similarity
  })

  const bestNormal = ranked[0]

  let finalType: any
  let modeKicker = '你的主类型'
  let badge = `匹配度 ${bestNormal.similarity}% · 精准命中 ${bestNormal.exact}/15 维`
  let sub = '维度命中度较高，当前结果可视为你的第一人格画像。'
  let special = false
  let secondaryType = null

  if (debugForceType && TYPE_LIBRARY[debugForceType]) {
    finalType = { ...TYPE_LIBRARY[debugForceType], similarity: 100, exact: 15, distance: 0 }
    modeKicker = '调试指定人格'
    badge = '调试模式 · 手动指定'
    sub = '当前结果由调试工具栏手动指定，非答题匹配。'
    special = true
  } else if (drunkTriggered) {
    finalType = TYPE_LIBRARY.DRUNK
    secondaryType = bestNormal
    modeKicker = '隐藏人格已激活'
    badge = '匹配度 100% · 酒精异常因子已接管'
    sub = '乙醇亲和性过强，系统已直接跳过常规人格审判。'
    special = true
  } else if (bestNormal.similarity < 60) {
    finalType = TYPE_LIBRARY.HHHH
    modeKicker = '系统强制兜底'
    badge = `标准人格库最高匹配仅 ${bestNormal.similarity}%`
    sub = '标准人格库对你的脑回路集体罢工了，于是系统把你强制分配给了 HHHH。'
    special = true
  } else {
    finalType = bestNormal
  }

  return { rawScores, levels, ranked, bestNormal, finalType, modeKicker, badge, sub, special, secondaryType }
}
```

- [ ] **Step 2: Create src/utils/quiz.ts**

Port `shuffle`, `getVisibleQuestions` from `main.js` lines 854-870:

```ts
import { questions, specialQuestions } from '../data/questions'
import type { Question } from '../data/questions'

export function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function buildShuffledQuestions(): Question[] {
  const shuffledRegular = shuffle(questions)
  const insertIndex = Math.floor(Math.random() * shuffledRegular.length) + 1
  return [
    ...shuffledRegular.slice(0, insertIndex),
    specialQuestions[0],
    ...shuffledRegular.slice(insertIndex),
  ]
}

export function getVisibleQuestions(
  shuffledQuestions: Question[],
  answers: Record<string, number>
): Question[] {
  const visible = [...shuffledQuestions]
  const gateIndex = visible.findIndex(q => q.id === 'drink_gate_q1')
  if (gateIndex !== -1 && answers['drink_gate_q1'] === 3) {
    visible.splice(gateIndex + 1, 0, specialQuestions[1])
  }
  return visible
}
```

- [ ] **Step 3: Create src/utils/compare.ts**

Port `CompareUtil` from `main.js` lines 2020-2038:

```ts
import { dimensionOrder } from '../data/dimensions'

const levelToNum: Record<string, number> = { L: 0, M: 1, H: 2 }
const numToLevel = ['L', 'M', 'H']

export function encodeCompare(code: string, levels: Record<string, string>, similarity: number): string {
  const dimStr = dimensionOrder.map(d => levelToNum[levels[d]]).join('')
  return btoa(JSON.stringify({ c: code, d: dimStr, s: similarity }))
}

export interface DecodedCompare {
  code: string
  levels: Record<string, string>
  similarity: number
}

export function decodeCompare(b64: string): DecodedCompare | null {
  try {
    const obj = JSON.parse(atob(b64))
    const levels: Record<string, string> = {}
    dimensionOrder.forEach((d, i) => {
      levels[d] = numToLevel[parseInt(obj.d[i])]
    })
    return { code: obj.c, levels, similarity: obj.s }
  } catch {
    return null
  }
}
```

- [ ] **Step 4: Verify compilation**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add src/utils/
git commit -m "feat: migrate core logic (matching, quiz, compare) to typed utils"
```

---

### Task 4: Hooks

**Files:**
- Create: `src/hooks/useQuiz.ts`, `src/hooks/useRanking.ts`, `src/hooks/useLocalHistory.ts`

- [ ] **Step 1: Create src/hooks/useQuiz.ts**

```ts
import { useState, useCallback, useMemo } from 'react'
import { buildShuffledQuestions, getVisibleQuestions } from '../utils/quiz'
import { computeResult } from '../utils/matching'
import { DRUNK_TRIGGER_QUESTION_ID } from '../data/questions'
import type { Question } from '../data/questions'

export function useQuiz() {
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [currentQ, setCurrentQ] = useState(0)
  const [previewMode, setPreviewMode] = useState(false)
  const [debugForceType, setDebugForceType] = useState<string | null>(null)

  const visibleQuestions = useMemo(
    () => shuffledQuestions.length > 0 ? getVisibleQuestions(shuffledQuestions, answers) : [],
    [shuffledQuestions, answers]
  )

  const totalQuestions = visibleQuestions.length
  const answeredCount = visibleQuestions.filter(q => answers[q.id] !== undefined).length
  const allAnswered = answeredCount === totalQuestions && totalQuestions > 0
  const progress = totalQuestions ? (answeredCount / totalQuestions) * 100 : 0

  const currentQuestion = visibleQuestions[currentQ] ?? null

  const startQuiz = useCallback((preview = false) => {
    setPreviewMode(preview)
    setAnswers({})
    setCurrentQ(0)
    setDebugForceType(null)
    setShuffledQuestions(buildShuffledQuestions())
  }, [])

  const answer = useCallback((questionId: string, value: number) => {
    setAnswers(prev => {
      const next = { ...prev, [questionId]: value }
      // Clear drink_gate_q2 if q1 answer is not 3
      if (questionId === 'drink_gate_q1' && value !== 3) {
        delete next['drink_gate_q2']
      }
      return next
    })
  }, [])

  const goNext = useCallback(() => {
    setCurrentQ(prev => Math.min(prev + 1, visibleQuestions.length - 1))
  }, [visibleQuestions.length])

  const goPrev = useCallback(() => {
    setCurrentQ(prev => Math.max(prev - 1, 0))
  }, [])

  const drunkTriggered = answers[DRUNK_TRIGGER_QUESTION_ID] === 2

  const getResult = useCallback(() => {
    return computeResult(answers, drunkTriggered, debugForceType)
  }, [answers, drunkTriggered, debugForceType])

  return {
    shuffledQuestions, visibleQuestions, answers, currentQ, currentQuestion,
    previewMode, debugForceType, totalQuestions, answeredCount, allAnswered, progress,
    startQuiz, answer, goNext, goPrev, setCurrentQ, setDebugForceType, getResult, drunkTriggered,
  }
}
```

- [ ] **Step 2: Create src/hooks/useRanking.ts**

```ts
import { useState, useCallback } from 'react'

interface RankingItem {
  code: string
  count: number
}

interface RankingData {
  list: RankingItem[]
  total: number
}

export function useRanking() {
  const [data, setData] = useState<RankingData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const fetchRanking = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('/api/ranking')
      const json = await res.json()
      setData(json)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, fetchRanking }
}
```

- [ ] **Step 3: Create src/hooks/useLocalHistory.ts**

```ts
import { useState, useCallback } from 'react'

const LOCAL_HISTORY_KEY = 'sbti_history'
const LOCAL_STATS_KEY = 'sbti_local_stats'

interface HistoryEntry {
  code: string
  time: number
}

export function useLocalHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem(LOCAL_HISTORY_KEY) || '[]') }
    catch { return [] }
  })

  const [stats, setStats] = useState<Record<string, number>>(() => {
    try { return JSON.parse(localStorage.getItem(LOCAL_STATS_KEY) || '{}') }
    catch { return {} }
  })

  const saveResult = useCallback((typeCode: string) => {
    // Remote
    fetch('/api/record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: typeCode }),
    }).catch(() => {})

    // Local stats
    setStats(prev => {
      const next = { ...prev, [typeCode]: (prev[typeCode] || 0) + 1 }
      try { localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(next)) } catch {}
      return next
    })

    // Local history
    setHistory(prev => {
      const next = [...prev, { code: typeCode, time: Date.now() }].slice(-100)
      try { localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  return { history, stats, saveResult }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/hooks/
git commit -m "feat: add React hooks for quiz, ranking, and local history"
```

---

### Task 5: Navigation + App Shell

**Files:**
- Create: `src/components/Nav.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create src/components/Nav.tsx**

Full dark glassmorphism nav with tab switching and CTA button. Uses Tailwind for layout, Emotion for glassmorphism.

- [ ] **Step 2: Update src/App.tsx with tab routing + state**

Wire up tab switching (home, profiles, compat, ranking), quiz overlay visibility, result/compare screen state. Hash routing for `#test` debug mode and `#compare=` links.

- [ ] **Step 3: Verify in browser**

- [ ] **Step 4: Commit**

```bash
git add src/components/Nav.tsx src/App.tsx
git commit -m "feat: add dark nav bar and app shell with tab routing"
```

---

### Task 6: Hero + TypeCardsPreview

**Files:**
- Create: `src/components/Hero.tsx`, `src/components/TypeCardsPreview.tsx`

- [ ] **Step 1: Build Hero.tsx**

Giant SBTI title, gradient divider, provocative copy, stats row (from /api/ranking data), CTA button, "不敢？那就算了" dare text, live ticker animation (AnimatePresence for cycling through random types).

- [ ] **Step 2: Build TypeCardsPreview.tsx**

Horizontal scrolling cards with Framer Motion stagger entrance + hover lift. Each card shows type code (colored), CN name, rarity badge, percentage.

- [ ] **Step 3: Wire into App.tsx home tab**

- [ ] **Step 4: Verify visual match with mockup**

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.tsx src/components/TypeCardsPreview.tsx src/App.tsx
git commit -m "feat: add dark hero section with stats, ticker, and type cards preview"
```

---

### Task 7: Quiz Flow

**Files:**
- Create: `src/components/QuizOverlay.tsx`, `src/components/QuestionCard.tsx`, `src/components/ProgressBar.tsx`

- [ ] **Step 1: Build ProgressBar.tsx**

Gradient bar (red→orange), numeric progress text.

- [ ] **Step 2: Build QuestionCard.tsx**

Single question display with option cards. Framer Motion slide transition between questions. Options highlight on hover, selected state with red accent border. Auto-advance after 300ms delay on selection.

- [ ] **Step 3: Build QuizOverlay.tsx**

Full-screen dark overlay. Renders ProgressBar + QuestionCard + prev/next nav + submit button. Uses `useQuiz` hook. Submit button triggers interstitial or direct result.

- [ ] **Step 4: Wire into App.tsx**

- [ ] **Step 5: Test quiz flow end-to-end**

Verify: questions render, answers record, progress updates, special drink question appears when q1=3, submit enables when all answered.

- [ ] **Step 6: Commit**

```bash
git add src/components/QuizOverlay.tsx src/components/QuestionCard.tsx src/components/ProgressBar.tsx
git commit -m "feat: add immersive dark quiz flow with slide transitions"
```

---

### Task 8: Interstitial + Result Page

**Files:**
- Create: `src/components/Interstitial.tsx`, `src/components/ResultPage.tsx`, `src/components/DimList.tsx`

- [ ] **Step 1: Build Interstitial.tsx**

5-second countdown overlay ("结果生成中..."), skip button appears after countdown. Framer Motion fade in/out.

- [ ] **Step 2: Build DimList.tsx**

15 dimension score bars with L/M/H levels, colored fills, explanations from DIM_EXPLANATIONS.

- [ ] **Step 3: Build ResultPage.tsx**

Full result display: poster image, type info (kicker, code, cn, match badge, sub), description, DimList, compatibility results (soulmate/rival from COMPATIBILITY), fun note, author details (collapsible), action buttons (share, invite compare, restart, home). Framer Motion stagger entrance for all sections.

Must call `saveResult()` from `useLocalHistory` when result renders (unless debug mode).

- [ ] **Step 4: Test result flow**

Complete a quiz, verify result calculation matches original logic, verify all sections render, verify saveResult API call fires.

- [ ] **Step 5: Commit**

```bash
git add src/components/Interstitial.tsx src/components/ResultPage.tsx src/components/DimList.tsx
git commit -m "feat: add result page with dim scores, compat display, and stagger animations"
```

---

### Task 9: Share Card + Share Modal

**Files:**
- Create: `src/utils/shareCard.ts`, `src/utils/qr.ts`, `src/components/ShareModal.tsx`

- [ ] **Step 1: Create src/utils/qr.ts**

```ts
import qrcode from 'qrcode-generator'

export function generateQR(url: string): string {
  const qr = qrcode(0, 'M')
  qr.addData(url)
  qr.make()
  return qr.createDataURL(4, 0)
}
```

- [ ] **Step 2: Create src/utils/shareCard.ts**

Port the entire `drawShareCard` function from `main.js` lines 1685-1852, plus `wrapText` and image loading helpers. Update colors to dark theme. Keep Canvas direct-draw approach.

- [ ] **Step 3: Build ShareModal.tsx**

Modal overlay with share image preview, download button (creates `<a>` blob download), copy link button (clipboard API), native share button (navigator.share). Port from `main.js` lines 1855-1940.

- [ ] **Step 4: Wire share and invite buttons from ResultPage**

- [ ] **Step 5: Test share image generation and download**

- [ ] **Step 6: Commit**

```bash
git add src/utils/shareCard.ts src/utils/qr.ts src/components/ShareModal.tsx
git commit -m "feat: add canvas share card generation and share modal"
```

---

### Task 10: Ranking + Local History

**Files:**
- Create: `src/components/RankingPage.tsx`

- [ ] **Step 1: Build RankingPage.tsx**

Two sections: global ranking (from `/api/ranking`) and local history (from localStorage). Stats cards, rank list with gold/silver/bronze colors, bar fills. Uses `useRanking` and `useLocalHistory` hooks. Port logic from `main.js` lines 1399-1495.

- [ ] **Step 2: Wire into App.tsx ranking tab**

Trigger `fetchRanking()` when tab activates.

- [ ] **Step 3: Test ranking data display**

- [ ] **Step 4: Commit**

```bash
git add src/components/RankingPage.tsx
git commit -m "feat: add ranking page with global leaderboard and local history"
```

---

### Task 11: Profiles Gallery + Compatibility Table

**Files:**
- Create: `src/components/ProfilesGallery.tsx`, `src/components/CompatTable.tsx`

- [ ] **Step 1: Build ProfilesGallery.tsx**

Grid of all type cards with images, code, CN name, rarity badge, intro, desc (expandable). Rarity toggle (theoretical vs real from ranking API). Port from `main.js` lines 1270-1312.

- [ ] **Step 2: Build CompatTable.tsx**

Grid of all compatibility pairs. Soulmate (pink) / rival (amber) badges. Port from `main.js` lines 1991-2017.

- [ ] **Step 3: Wire into home tab (below hero) and dedicated tabs**

- [ ] **Step 4: Commit**

```bash
git add src/components/ProfilesGallery.tsx src/components/CompatTable.tsx
git commit -m "feat: add profiles gallery with rarity toggle and compatibility table"
```

---

### Task 12: Compare Page + Radar Chart

**Files:**
- Create: `src/components/ComparePage.tsx`, `src/components/RadarChart.tsx`

- [ ] **Step 1: Build RadarChart.tsx**

Canvas-based radar chart, port `drawRadarChart` from `main.js` lines 2044-2120. Accept two data arrays + labels, draw overlapping polygons in accent colors. Update to dark theme colors.

- [ ] **Step 2: Build ComparePage.tsx**

VS layout: two person cards with avatars, type codes, CN names. Radar chart overlay. Similarity percentage. Compat comment. "生成对比分享图" and "我也要测" buttons. Port URL hash decoding from `#compare=` route.

- [ ] **Step 3: Wire into App.tsx hash routing**

On page load, check `window.location.hash` for `#compare=<base64>`. If found, decode and show compare page.

- [ ] **Step 4: Test compare flow with encoded URL**

- [ ] **Step 5: Commit**

```bash
git add src/components/ComparePage.tsx src/components/RadarChart.tsx
git commit -m "feat: add compare page with radar chart overlay and URL sharing"
```

---

### Task 13: Debug Toolbar + Edge Cases

**Files:**
- Modify: `src/App.tsx`, `src/components/ResultPage.tsx`

- [ ] **Step 1: Add debug toolbar to ResultPage**

Only visible on test domain (`hostname.includes('sbticc-test')`). Type picker dropdown, random reroll, share/invite test buttons. Port from `main.js` lines 1497-1551.

- [ ] **Step 2: Add #test debug route**

On test domain or `#test` hash: auto-fill random answers, jump to result. Port from `main.js` lines 1553-1568.

- [ ] **Step 3: Add vConsole for test domain**

Dynamically import vConsole on test domains.

- [ ] **Step 4: Add paywall code (commented/disabled)**

Keep paywall overlay code structure in ResultPage, commented out as in current codebase. Preserve `isPaid` state, `unlockPaywall`, `checkPaidFromUrl`, `startPayment`, `startStripeCheckout`, `showChinesePaymentModal` — all as disabled code that can be re-enabled.

- [ ] **Step 5: Commit**

```bash
git add src/components/ResultPage.tsx src/App.tsx
git commit -m "feat: add debug toolbar, #test route, and preserved paywall structure"
```

---

### Task 14: Final Polish + Vercel Config

**Files:**
- Create: `vercel.json`
- Modify: `package.json`

- [ ] **Step 1: Create vercel.json for SPA + API routing**

```json
{
  "buildCommand": "vite build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

- [ ] **Step 2: Update package.json scripts**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

- [ ] **Step 3: Ensure images/ directory is accessible**

Move `images/` to `public/images/` so Vite serves them statically. Update all image paths in `typeImages.ts` from `./images/` to `/images/`.

- [ ] **Step 4: Back up old files**

```bash
mkdir -p old/
mv main.js old/main.js.bak
mv main.css old/main.css.bak
```

- [ ] **Step 5: Build and verify**

```bash
npm run build
npx vite preview
```

- [ ] **Step 6: Commit**

```bash
git add vercel.json package.json public/ old/ src/
git commit -m "feat: add Vercel config, move static assets, back up old files"
```

---

### Task 15: Playwright E2E Testing

**Files:** None created — this is manual verification via Playwright MCP.

- [ ] **Step 1: Start dev server and open in Playwright**

- [ ] **Step 2: Test home page**

Verify: nav renders, hero with stats, type cards scroll, profiles gallery, compat table.

- [ ] **Step 3: Test quiz flow**

Click "开始测试", answer all questions, verify progress bar updates, verify submit enables.

- [ ] **Step 4: Test result page**

Submit quiz, verify interstitial countdown, verify result renders with type name, dims, compat.

- [ ] **Step 5: Test share image**

Click "生成分享图", verify modal opens with image preview, test download.

- [ ] **Step 6: Test ranking tab**

Switch to ranking tab, verify API call, verify ranking list renders.

- [ ] **Step 7: Test compare flow**

From result, click "邀请好友对比", verify compare URL generation. Navigate to a `#compare=` URL, verify compare page renders.

- [ ] **Step 8: Test #test debug mode**

Navigate to `#test`, verify auto-fill and result display.

- [ ] **Step 9: Test mobile responsiveness**

Resize browser to 375px width, verify all pages render correctly.

- [ ] **Step 10: Fix any issues found, commit**

```bash
git add -A
git commit -m "fix: resolve issues found during Playwright testing"
```
