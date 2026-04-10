# SBTI Taro 多端迁移实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有 SBTI 人格测试从纯 HTML/CSS/JS 迁移到 Taro + React + TypeScript + Tailwind CSS，支持 H5 和微信小程序双端。

**Architecture:** Monorepo（pnpm workspace），`packages/api` 保留现有 Vercel Functions，`packages/taro-app` 为 Taro 前端。前端通过 `Taro.request` 调用现有 API，数据常量从 `main.js` 提取为 TypeScript 模块。

**Tech Stack:** Taro 3.x, React 18, TypeScript, Tailwind CSS, weapp-tailwindcss, pnpm workspace

---

### Task 1: Monorepo 骨架搭建

**Files:**
- Create: `pnpm-workspace.yaml`
- Modify: `package.json` (根目录)
- Move: `api/` → `packages/api/`

- [ ] **Step 1: 创建 pnpm-workspace.yaml**

```yaml
packages:
  - 'packages/*'
```

- [ ] **Step 2: 移动 API 到 packages 目录**

```bash
mkdir -p packages
mv api packages/api
```

- [ ] **Step 3: 更新根目录 package.json**

```json
{
  "name": "sbti",
  "private": true,
  "scripts": {
    "dev:h5": "cd packages/taro-app && pnpm dev:h5",
    "dev:weapp": "cd packages/taro-app && pnpm dev:weapp",
    "build:h5": "cd packages/taro-app && pnpm build:h5",
    "build:weapp": "cd packages/taro-app && pnpm build:weapp"
  }
}
```

- [ ] **Step 4: 在 packages/api 创建 package.json**

```json
{
  "name": "@sbti/api",
  "private": true,
  "dependencies": {
    "@upstash/redis": "^1.37.0"
  }
}
```

- [ ] **Step 5: 创建 Vercel 配置文件 vercel.json（根目录）**

确保 Vercel 仍能找到 API functions：

```json
{
  "functions": {
    "packages/api/*.js": {
      "memory": 128
    }
  },
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/packages/api/$1" }
  ]
}
```

- [ ] **Step 6: 安装 pnpm 并初始化**

```bash
pnpm install
```

- [ ] **Step 7: Commit**

```bash
git add pnpm-workspace.yaml package.json packages/api/
git commit -m "chore: restructure to pnpm monorepo, move api to packages/"
```

---

### Task 2: 初始化 Taro 项目

**Files:**
- Create: `packages/taro-app/` (Taro 项目)

- [ ] **Step 1: 用 Taro CLI 创建项目**

```bash
cd packages
npx @tarojs/cli init taro-app --template default --typescript --css none
```

选择 React 框架。如果 CLI 交互式提问：
- 框架: React
- CSS 预处理: None（我们用 Tailwind）
- 包管理: pnpm

- [ ] **Step 2: 安装 Tailwind CSS 及 weapp-tailwindcss**

```bash
cd packages/taro-app
pnpm add -D tailwindcss postcss autoprefixer weapp-tailwindcss
npx tailwindcss init -p
```

- [ ] **Step 3: 配置 tailwind.config.ts**

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#304034',
        'primary-light': '#4d6a53',
        bg: '#f5f0e8',
        'bg-card': '#fffdf7',
        accent: '#b8860b',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 4: 配置 postcss.config.js**

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 5: 在 Taro 项目配置中集成 weapp-tailwindcss**

修改 `config/index.ts`，添加 weapp-tailwindcss 插件：

```ts
import { defineConfig } from '@tarojs/cli'
import { UnifiedWebpackPluginV5 } from 'weapp-tailwindcss/webpack'

export default defineConfig({
  // ... 其他配置
  mini: {
    webpackChain(chain) {
      chain.plugin('weapp-tailwindcss').use(UnifiedWebpackPluginV5, [{
        appType: 'taro',
      }])
    },
  },
})
```

- [ ] **Step 6: 创建全局样式入口 src/app.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

在 `src/app.ts` 中引入：

```ts
import './app.css'
```

- [ ] **Step 7: 验证 H5 开发服务器启动**

```bash
pnpm dev:h5
```

预期：浏览器可打开默认 Taro 页面。

- [ ] **Step 8: Commit**

```bash
git add packages/taro-app/
git commit -m "feat: initialize Taro project with React, TypeScript, Tailwind CSS"
```

---

### Task 3: 提取静态数据为 TypeScript 常量

**Files:**
- Create: `packages/taro-app/src/constants/dimensions.ts`
- Create: `packages/taro-app/src/constants/questions.ts`
- Create: `packages/taro-app/src/constants/personalities.ts`
- Create: `packages/taro-app/src/constants/compatibility.ts`
- Create: `packages/taro-app/src/constants/rarity.ts`
- Create: `packages/taro-app/src/constants/index.ts`

- [ ] **Step 1: 创建类型定义 `packages/taro-app/src/types/index.ts`**

```ts
export interface DimensionMeta {
  name: string
  model: string
}

export interface Question {
  id: string
  dim: string
  text: string
  options: { label: string; value: number }[]
}

export interface SpecialQuestion {
  id: string
  special: true
  kind: string
  text: string
  options: { label: string; value: number }[]
}

export interface PersonalityType {
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

export interface CompatInfo {
  type: 'soulmate' | 'rival'
  say: string
}

export type DimensionLevel = 'L' | 'M' | 'H'

export interface TestResult {
  rawScores: Record<string, number>
  levels: Record<string, DimensionLevel>
  ranked: Array<NormalType & PersonalityType & { distance: number; exact: number; similarity: number }>
  bestNormal: NormalType & PersonalityType & { distance: number; exact: number; similarity: number }
  finalType: PersonalityType & { similarity?: number }
  modeKicker: string
  badge: string
  sub: string
  special: boolean
  secondaryType: (NormalType & PersonalityType & { distance: number; exact: number; similarity: number }) | null
}
```

- [ ] **Step 2: 从 main.js 提取 dimensionMeta 和 dimensionOrder 到 dimensions.ts**

从 `main.js:1-17` 和 `main.js:688` 提取 `dimensionMeta`、`dimensionOrder`、`DIM_EXPLANATIONS`（`main.js:611-687`）。

```ts
import { DimensionMeta } from '../types'

export const dimensionMeta: Record<string, DimensionMeta> = {
  S1: { name: 'S1 自尊自信', model: '自我模型' },
  S2: { name: 'S2 自我清晰度', model: '自我模型' },
  // ... 完整复制 main.js:1-17
}

export const dimensionOrder = ['S1', 'S2', 'S3', 'E1', 'E2', 'E3', 'A1', 'A2', 'A3', 'Ac1', 'Ac2', 'Ac3', 'So1', 'So2', 'So3'] as const

export const DIM_EXPLANATIONS: Record<string, Record<string, string>> = {
  // ... 完整复制 main.js:611-687
}
```

- [ ] **Step 3: 提取 questions 和 specialQuestions 到 questions.ts**

从 `main.js:18-313` 提取。

```ts
import { Question, SpecialQuestion } from '../types'

export const questions: Question[] = [
  // ... 完整复制 main.js:18-289 的 questions 数组
]

export const specialQuestions: SpecialQuestion[] = [
  // ... 完整复制 main.js:290-313 的 specialQuestions 数组
]

export const DRUNK_TRIGGER_QUESTION_ID = 'drink_gate_q2'
```

- [ ] **Step 4: 提取 TYPE_LIBRARY、NORMAL_TYPES、TYPE_IMAGES 到 personalities.ts**

从 `main.js:315-610` 提取。

```ts
import { PersonalityType, NormalType } from '../types'

export const TYPE_LIBRARY: Record<string, PersonalityType> = {
  // ... 完整复制 main.js:315-478
}

export const NORMAL_TYPES: NormalType[] = [
  // ... 完整复制 main.js:509-610
]

export const TYPE_IMAGES: Record<string, string> = {
  // 路径改为 Taro 资源引用方式
  "IMSB": require("../assets/images/IMSB.png"),
  "BOSS": require("../assets/images/BOSS.png"),
  // ... 所有 27 种
}
```

注意：图片需要从原项目 `images/` 目录复制到 `packages/taro-app/src/assets/images/`。

- [ ] **Step 5: 提取 TYPE_RARITY 到 rarity.ts**

从 `main.js:1068-1096` 提取。

```ts
import { RarityInfo } from '../types'

export const TYPE_RARITY: Record<string, RarityInfo> = {
  // ... 完整复制 main.js:1068-1096
}
```

- [ ] **Step 6: 提取 COMPATIBILITY 到 compatibility.ts**

从 `main.js:1479-1516` 提取。

```ts
import { CompatInfo } from '../types'

export const COMPATIBILITY: Record<string, CompatInfo> = {
  // ... 完整复制 main.js:1479-1516
}

export function getCompatibility(codeA: string, codeB: string) {
  if (codeA === codeB) return { type: 'mirror' as const, say: '同类相遇，要么惺惺相惜，要么互相嫌弃' }
  return COMPATIBILITY[`${codeA}+${codeB}`] || COMPATIBILITY[`${codeB}+${codeA}`] || { type: 'normal' as const, say: '普通关系，相安无事' }
}
```

- [ ] **Step 7: 创建 constants/index.ts 统一导出**

```ts
export * from './dimensions'
export * from './questions'
export * from './personalities'
export * from './rarity'
export * from './compatibility'
```

- [ ] **Step 8: 复制图片资源**

```bash
cp -r ../../images packages/taro-app/src/assets/images
```

- [ ] **Step 9: Commit**

```bash
git add packages/taro-app/src/constants/ packages/taro-app/src/types/ packages/taro-app/src/assets/
git commit -m "feat: extract data constants and types from main.js to TypeScript modules"
```

---

### Task 4: 核心逻辑 — 测试计算引擎

**Files:**
- Create: `packages/taro-app/src/utils/compute.ts`
- Create: `packages/taro-app/src/utils/shuffle.ts`

- [ ] **Step 1: 创建 shuffle 工具函数**

```ts
// packages/taro-app/src/utils/shuffle.ts
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
```

- [ ] **Step 2: 创建计算引擎 compute.ts**

从 `main.js:877-965` 提取 `computeResult` 逻辑：

```ts
// packages/taro-app/src/utils/compute.ts
import { dimensionMeta, dimensionOrder, DRUNK_TRIGGER_QUESTION_ID } from '../constants/dimensions'
import { questions } from '../constants/questions'
import { TYPE_LIBRARY, NORMAL_TYPES } from '../constants/personalities'
import type { DimensionLevel, TestResult } from '../types'

function sumToLevel(score: number): DimensionLevel {
  if (score <= 3) return 'L'
  if (score === 4) return 'M'
  return 'H'
}

function levelNum(level: string): number {
  return { L: 1, M: 2, H: 3 }[level] || 2
}

function parsePattern(pattern: string): string[] {
  return pattern.replace(/-/g, '').split('')
}

export function computeResult(answers: Record<string, number>): TestResult {
  const rawScores: Record<string, number> = {}
  const levels: Record<string, DimensionLevel> = {}
  Object.keys(dimensionMeta).forEach(dim => { rawScores[dim] = 0 })

  questions.forEach(q => {
    rawScores[q.dim] += Number(answers[q.id] || 0)
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
  const drunkTriggered = answers[DRUNK_TRIGGER_QUESTION_ID] === 2

  let finalType: any
  let modeKicker = '你的主类型'
  let badge = `匹配度 ${bestNormal.similarity}% · 精准命中 ${bestNormal.exact}/15 维`
  let sub = '维度命中度较高，当前结果可视为你的第一人格画像。'
  let special = false
  let secondaryType = null

  if (drunkTriggered) {
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

- [ ] **Step 3: Commit**

```bash
git add packages/taro-app/src/utils/
git commit -m "feat: implement test computation engine (computeResult, shuffle)"
```

---

### Task 5: 工具函数 — request、storage

**Files:**
- Create: `packages/taro-app/src/utils/request.ts`
- Create: `packages/taro-app/src/utils/storage.ts`

- [ ] **Step 1: 创建 request.ts**

```ts
import Taro from '@tarojs/taro'

const BASE_URL = process.env.TARO_APP_API_BASE || ''

export async function request<T = any>(options: {
  url: string
  method?: 'GET' | 'POST'
  data?: any
}): Promise<T> {
  const { url, method = 'GET', data } = options
  const res = await Taro.request({
    url: `${BASE_URL}${url}`,
    method,
    data,
    header: {
      'Content-Type': 'application/json',
    },
  })
  return res.data as T
}
```

- [ ] **Step 2: 创建 storage.ts**

```ts
import Taro from '@tarojs/taro'

const LOCAL_HISTORY_KEY = 'sbti_history'
const LOCAL_STATS_KEY = 'sbti_local_stats'

interface HistoryItem {
  code: string
  time: number
}

export function saveResult(typeCode: string) {
  // 保存统计
  try {
    const stats = Taro.getStorageSync(LOCAL_STATS_KEY) || {}
    stats[typeCode] = (stats[typeCode] || 0) + 1
    Taro.setStorageSync(LOCAL_STATS_KEY, stats)
  } catch (e) {}

  // 保存历史
  try {
    let history: HistoryItem[] = Taro.getStorageSync(LOCAL_HISTORY_KEY) || []
    history.push({ code: typeCode, time: Date.now() })
    if (history.length > 100) history = history.slice(-100)
    Taro.setStorageSync(LOCAL_HISTORY_KEY, history)
  } catch (e) {}
}

export function getLocalStats(): Record<string, number> {
  try { return Taro.getStorageSync(LOCAL_STATS_KEY) || {} }
  catch (e) { return {} }
}

export function getLocalHistory(): HistoryItem[] {
  try { return Taro.getStorageSync(LOCAL_HISTORY_KEY) || [] }
  catch (e) { return [] }
}
```

- [ ] **Step 3: Commit**

```bash
git add packages/taro-app/src/utils/
git commit -m "feat: add request and storage utility functions"
```

---

### Task 6: Taro 全局配置 — TabBar 和路由

**Files:**
- Modify: `packages/taro-app/src/app.config.ts`
- Modify: `packages/taro-app/src/app.tsx`

- [ ] **Step 1: 配置 app.config.ts**

```ts
export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/profiles/index',
    'pages/compat/index',
    'pages/ranking/index',
    'pages/test/index',
    'pages/result/index',
  ],
  tabBar: {
    color: '#6a786f',
    selectedColor: '#304034',
    backgroundColor: '#fffdf7',
    borderStyle: 'white',
    list: [
      { pagePath: 'pages/home/index', text: '首页' },
      { pagePath: 'pages/profiles/index', text: '人格' },
      { pagePath: 'pages/compat/index', text: '相性' },
      { pagePath: 'pages/ranking/index', text: '排行' },
    ],
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fffdf7',
    navigationBarTitleText: 'SBTI 人格测试',
    navigationBarTextStyle: 'black',
    backgroundColor: '#f5f0e8',
  },
})
```

- [ ] **Step 2: 配置 app.tsx**

```tsx
import { PropsWithChildren } from 'react'
import './app.css'

function App({ children }: PropsWithChildren) {
  return <>{children}</>
}

export default App
```

- [ ] **Step 3: 创建页面骨架文件**

为每个页面创建空的 index.tsx 和 index.config.ts：

`pages/home/index.tsx`:
```tsx
export default function Home() {
  return <view className="min-h-screen bg-bg">首页</view>
}
```

`pages/home/index.config.ts`:
```ts
export default definePageConfig({ navigationBarTitleText: '首页' })
```

同样为 profiles、compat、ranking、test、result 创建骨架。

- [ ] **Step 4: 验证 TabBar 导航正常**

```bash
cd packages/taro-app && pnpm dev:h5
```

预期：底部 4 个 Tab 可以切换，各页面显示占位内容。

- [ ] **Step 5: Commit**

```bash
git add packages/taro-app/src/
git commit -m "feat: configure Taro app routes, TabBar, and page skeletons"
```

---

### Task 7: 首页 — Hero + 人格一览

**Files:**
- Modify: `packages/taro-app/src/pages/home/index.tsx`
- Create: `packages/taro-app/src/components/PersonalityCard/index.tsx`

- [ ] **Step 1: 创建 PersonalityCard 组件**

```tsx
import { useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { TYPE_IMAGES } from '../../constants/personalities'
import { TYPE_RARITY } from '../../constants/rarity'

interface Props {
  code: string
  cn: string
  intro: string
  desc: string
}

export default function PersonalityCard({ code, cn, intro, desc }: Props) {
  const [expanded, setExpanded] = useState(false)
  const rarity = TYPE_RARITY[code]
  const imgSrc = TYPE_IMAGES[code]

  return (
    <View className="bg-bg-card rounded-xl p-4 mb-3 border border-[#e8e3d8]">
      {imgSrc && (
        <Image src={imgSrc} className="w-full h-40 rounded-lg mb-3" mode="aspectFill" />
      )}
      <View className="flex items-center gap-2 mb-2">
        <Text className="text-lg font-bold text-primary">{code}</Text>
        <Text className="text-sm text-primary-light">{cn}</Text>
      </View>
      {rarity && (
        <View className="inline-block px-2 py-0.5 rounded text-xs mb-2 bg-[#fff8e1] text-accent border border-[#ffe082]">
          {'★'.repeat(Math.min(rarity.stars, 4))} {rarity.label} {rarity.pct}%
        </View>
      )}
      <Text className="text-sm text-primary-light block mb-2">{intro}</Text>
      {expanded && (
        <Text className="text-sm text-[#6a786f] leading-relaxed block mb-2">{desc}</Text>
      )}
      <Text
        className="text-sm text-accent cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? '收起' : '展开全文'}
      </Text>
    </View>
  )
}
```

- [ ] **Step 2: 实现首页**

```tsx
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { TYPE_LIBRARY } from '../../constants/personalities'
import PersonalityCard from '../../components/PersonalityCard'

export default function Home() {
  const handleStart = () => {
    Taro.navigateTo({ url: '/pages/test/index' })
  }

  return (
    <View className="min-h-screen bg-bg px-4 pb-20">
      {/* Hero */}
      <View className="bg-bg-card rounded-xl p-6 mt-4 text-center border border-[#e8e3d8]">
        <Text className="text-2xl font-bold text-primary block mb-4">
          MBTI已经过时，SBTI来了。
        </Text>
        <View
          className="bg-primary text-white px-6 py-3 rounded-lg inline-block text-base font-medium"
          onClick={handleStart}
        >
          开始测试
        </View>
      </View>

      {/* 人格一览 */}
      <View className="mt-4">
        <Text className="text-xl font-bold text-primary text-center block mb-4">
          全部人格一览
        </Text>
        {Object.values(TYPE_LIBRARY).map(t => (
          <PersonalityCard key={t.code} code={t.code} cn={t.cn} intro={t.intro} desc={t.desc} />
        ))}
      </View>
    </View>
  )
}
```

- [ ] **Step 3: 验证首页渲染**

```bash
pnpm dev:h5
```

预期：首页显示 Hero 区域和 27 个人格卡片列表。

- [ ] **Step 4: Commit**

```bash
git add packages/taro-app/src/
git commit -m "feat: implement home page with Hero and PersonalityCard list"
```

---

### Task 8: 测试流程页 — 逐题答题

**Files:**
- Modify: `packages/taro-app/src/pages/test/index.tsx`
- Create: `packages/taro-app/src/hooks/useTest.ts`

- [ ] **Step 1: 创建 useTest hook**

将测试流程状态管理封装为 hook，逻辑来自 `main.js:692-875`：

```tsx
import { useState, useMemo, useCallback } from 'react'
import { questions, specialQuestions, DRUNK_TRIGGER_QUESTION_ID } from '../constants/questions'
import { shuffle } from '../utils/shuffle'
import type { Question, SpecialQuestion } from '../types'

export function useTest() {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [currentQ, setCurrentQ] = useState(0)

  const shuffledQuestions = useMemo(() => {
    const shuffled = shuffle(questions)
    const insertIndex = Math.floor(Math.random() * shuffled.length) + 1
    return [
      ...shuffled.slice(0, insertIndex),
      specialQuestions[0],
      ...shuffled.slice(insertIndex),
    ] as (Question | SpecialQuestion)[]
  }, [])

  const visibleQuestions = useMemo(() => {
    const visible = [...shuffledQuestions]
    const gateIndex = visible.findIndex(q => q.id === 'drink_gate_q1')
    if (gateIndex !== -1 && answers['drink_gate_q1'] === 3) {
      visible.splice(gateIndex + 1, 0, specialQuestions[1])
    }
    return visible
  }, [shuffledQuestions, answers])

  const total = visibleQuestions.length
  const done = visibleQuestions.filter(q => answers[q.id] !== undefined).length
  const progress = total ? (done / total) * 100 : 0
  const isComplete = done === total && total > 0
  const currentQuestion = visibleQuestions[currentQ]

  const answer = useCallback((questionId: string, value: number) => {
    setAnswers(prev => {
      const next = { ...prev, [questionId]: value }
      if (questionId === 'drink_gate_q1' && value !== 3) {
        delete next['drink_gate_q2']
      }
      return next
    })
    // 自动进入下一题
    setTimeout(() => {
      setCurrentQ(prev => Math.min(prev + 1, visibleQuestions.length - 1))
    }, 300)
  }, [visibleQuestions.length])

  const prev = useCallback(() => {
    setCurrentQ(q => Math.max(0, q - 1))
  }, [])

  const next = useCallback(() => {
    if (answers[currentQuestion?.id] !== undefined) {
      setCurrentQ(q => Math.min(q + 1, visibleQuestions.length - 1))
    }
  }, [answers, currentQuestion, visibleQuestions.length])

  return {
    currentQ, currentQuestion, visibleQuestions,
    answers, total, done, progress, isComplete,
    answer, prev, next,
  }
}
```

- [ ] **Step 2: 实现测试页面**

```tsx
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useTest } from '../../hooks/useTest'
import { computeResult } from '../../utils/compute'
import { saveResult } from '../../utils/storage'
import { request } from '../../utils/request'

export default function TestPage() {
  const {
    currentQ, currentQuestion, answers,
    total, done, progress, isComplete,
    answer, prev, next,
  } = useTest()

  if (!currentQuestion) return null

  const optionCodes = ['A', 'B', 'C', 'D']

  const handleSubmit = async () => {
    const result = computeResult(answers)
    const typeCode = result.finalType.code

    // 保存到本地和远程
    saveResult(typeCode)
    try {
      await request({ url: '/api/record', method: 'POST', data: { type: typeCode } })
    } catch (e) {}

    // 跳转结果页，传递答案数据
    Taro.setStorageSync('sbti_current_answers', answers)
    Taro.navigateTo({ url: '/pages/result/index' })
  }

  return (
    <View className="min-h-screen bg-bg px-4 py-4">
      {/* 进度条 */}
      <View className="bg-[#e8e3d8] rounded-full h-2 mb-2">
        <View className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
      </View>
      <Text className="text-xs text-[#6a786f] text-center block mb-4">{done} / {total}</Text>

      {/* 题目卡 */}
      <View className="bg-bg-card rounded-xl p-5 border border-[#e8e3d8]">
        <View className="flex justify-between mb-3">
          <Text className="text-xs bg-primary text-white px-2 py-0.5 rounded">
            第 {currentQ + 1} / {total} 题
          </Text>
        </View>
        <Text className="text-base text-primary leading-relaxed block mb-4">
          {currentQuestion.text}
        </Text>
        <View className="space-y-2">
          {currentQuestion.options.map((opt, i) => {
            const selected = answers[currentQuestion.id] === opt.value
            return (
              <View
                key={i}
                className={`flex items-center p-3 rounded-lg border cursor-pointer ${
                  selected
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-primary border-[#e8e3d8]'
                }`}
                onClick={() => answer(currentQuestion.id, opt.value)}
              >
                <Text className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 ${
                  selected ? 'bg-white text-primary' : 'bg-[#f5f0e8] text-primary-light'
                }`}>
                  {optionCodes[i]}
                </Text>
                <Text className="text-sm flex-1">{opt.label}</Text>
              </View>
            )
          })}
        </View>
      </View>

      {/* 导航按钮 */}
      <View className="flex justify-between mt-4">
        <View
          className={`px-4 py-2 rounded-lg text-sm ${currentQ > 0 ? 'bg-[#e8e3d8] text-primary' : 'bg-[#f0ede6] text-[#c0bbb0]'}`}
          onClick={currentQ > 0 ? prev : undefined}
        >
          上一题
        </View>
        {currentQ < total - 1 ? (
          <View
            className={`px-4 py-2 rounded-lg text-sm ${answers[currentQuestion.id] !== undefined ? 'bg-primary text-white' : 'bg-[#f0ede6] text-[#c0bbb0]'}`}
            onClick={answers[currentQuestion.id] !== undefined ? next : undefined}
          >
            下一题
          </View>
        ) : (
          <View
            className={`px-6 py-2 rounded-lg text-sm font-medium ${isComplete ? 'bg-primary text-white' : 'bg-[#f0ede6] text-[#c0bbb0]'}`}
            onClick={isComplete ? handleSubmit : undefined}
          >
            查看结果
          </View>
        )}
      </View>

      {/* 提示 */}
      <Text className="text-xs text-[#6a786f] text-center block mt-4">
        {isComplete ? '都做完了。现在可以把你的电子魂魄交给结果页审判。' : '全选完才会放行。'}
      </Text>
    </View>
  )
}
```

- [ ] **Step 3: 配置测试页路由**

`pages/test/index.config.ts`:
```ts
export default definePageConfig({
  navigationBarTitleText: '答题中',
  disableScroll: false,
})
```

- [ ] **Step 4: 验证测试流程**

```bash
pnpm dev:h5
```

预期：从首页点击"开始测试"进入测试页，逐题答题，选择后自动跳转下一题。

- [ ] **Step 5: Commit**

```bash
git add packages/taro-app/src/
git commit -m "feat: implement test page with paged question flow"
```

---

### Task 9: 结果页

**Files:**
- Modify: `packages/taro-app/src/pages/result/index.tsx`

- [ ] **Step 1: 实现结果页**

```tsx
import { useMemo } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { computeResult } from '../../utils/compute'
import { dimensionOrder, dimensionMeta, DIM_EXPLANATIONS } from '../../constants/dimensions'
import { TYPE_IMAGES } from '../../constants/personalities'
import { getCompatibility } from '../../constants/compatibility'
import { COMPATIBILITY } from '../../constants/compatibility'
import { TYPE_LIBRARY } from '../../constants/personalities'

export default function ResultPage() {
  const result = useMemo(() => {
    const answers = Taro.getStorageSync('sbti_current_answers') || {}
    return computeResult(answers)
  }, [])

  const type = result.finalType
  const imgSrc = TYPE_IMAGES[type.code]

  // 相性数据
  const soulmates: Array<{ code: string; say: string }> = []
  const rivals: Array<{ code: string; say: string }> = []
  Object.keys(COMPATIBILITY).forEach(key => {
    const parts = key.split('+')
    const c = COMPATIBILITY[key]
    if (parts[0] === type.code || parts[1] === type.code) {
      const other = parts[0] === type.code ? parts[1] : parts[0]
      if (c.type === 'soulmate') soulmates.push({ code: other, say: c.say })
      if (c.type === 'rival') rivals.push({ code: other, say: c.say })
    }
  })

  const handleRestart = () => {
    Taro.navigateTo({ url: '/pages/test/index' })
  }

  const handleHome = () => {
    Taro.switchTab({ url: '/pages/home/index' })
  }

  return (
    <View className="min-h-screen bg-bg px-4 py-4 pb-20">
      {/* 主结果卡 */}
      <View className="bg-bg-card rounded-xl p-6 border border-[#e8e3d8] text-center">
        <Text className="text-xs text-accent block mb-1">{result.modeKicker}</Text>
        {imgSrc && (
          <Image src={imgSrc} className="w-32 h-32 mx-auto my-3 rounded-xl" mode="aspectFill" />
        )}
        <Text className="text-2xl font-bold text-primary block mb-2">
          {type.code}（{type.cn}）
        </Text>
        <Text className="text-xs bg-[#f5f0e8] text-primary-light px-3 py-1 rounded-full inline-block mb-3">
          {result.badge}
        </Text>
        <Text className="text-sm text-[#6a786f] block mb-3">{result.sub}</Text>
        <Text className="text-sm text-primary leading-relaxed block">{type.desc}</Text>
      </View>

      {/* 15 维度详情 */}
      <View className="bg-bg-card rounded-xl p-4 mt-4 border border-[#e8e3d8]">
        <Text className="text-lg font-bold text-primary block mb-3">维度分析</Text>
        {dimensionOrder.map(dim => {
          const level = result.levels[dim]
          const explanation = DIM_EXPLANATIONS[dim][level]
          return (
            <View key={dim} className="mb-3 pb-3 border-b border-[#f0ede6] last:border-b-0">
              <View className="flex justify-between mb-1">
                <Text className="text-sm font-medium text-primary">{dimensionMeta[dim].name}</Text>
                <Text className="text-xs text-accent">{level} / {result.rawScores[dim]}分</Text>
              </View>
              <Text className="text-xs text-[#6a786f]">{explanation}</Text>
            </View>
          )
        })}
      </View>

      {/* 相性结果 */}
      {(soulmates.length > 0 || rivals.length > 0) && (
        <View className="bg-bg-card rounded-xl p-4 mt-4 border border-[#e8e3d8]">
          <Text className="text-lg font-bold text-primary block mb-3">你的人格相性</Text>
          {soulmates.map(s => (
            <View key={s.code} className="mb-2 p-2 bg-[#fce4ec] rounded-lg">
              <Text className="text-sm">💕 {s.code}（{TYPE_LIBRARY[s.code]?.cn}）— {s.say}</Text>
            </View>
          ))}
          {rivals.map(r => (
            <View key={r.code} className="mb-2 p-2 bg-[#fff8e1] rounded-lg">
              <Text className="text-sm">⚔️ {r.code}（{TYPE_LIBRARY[r.code]?.cn}）— {r.say}</Text>
            </View>
          ))}
        </View>
      )}

      {/* 免责声明 */}
      <Text className="text-xs text-[#a09a8f] text-center block mt-4 mb-4">
        {result.special
          ? '本测试仅供娱乐。隐藏人格和傻乐兜底都属于作者故意埋的损招，请勿当真。'
          : '本测试仅供娱乐，别拿它当诊断、面试、相亲或人生判决书。'}
      </Text>

      {/* 操作按钮 */}
      <View className="flex gap-3 mt-2">
        <View
          className="flex-1 bg-[#e8e3d8] text-primary text-center py-3 rounded-lg text-sm"
          onClick={handleHome}
        >
          回到首页
        </View>
        <View
          className="flex-1 bg-primary text-white text-center py-3 rounded-lg text-sm"
          onClick={handleRestart}
        >
          再测一次
        </View>
      </View>
    </View>
  )
}
```

- [ ] **Step 2: 配置结果页**

`pages/result/index.config.ts`:
```ts
export default definePageConfig({ navigationBarTitleText: '测试结果' })
```

- [ ] **Step 3: 验证完整测试流程**

完成全部答题 → 点击查看结果 → 显示结果页，包含人格类型、维度分析、相性。

- [ ] **Step 4: Commit**

```bash
git add packages/taro-app/src/
git commit -m "feat: implement result page with personality, dimensions, and compatibility"
```

---

### Task 10: 排行榜页

**Files:**
- Modify: `packages/taro-app/src/pages/ranking/index.tsx`

- [ ] **Step 1: 实现排行榜页**

```tsx
import { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { request } from '../../utils/request'
import { getLocalHistory, getLocalStats } from '../../utils/storage'
import { TYPE_LIBRARY } from '../../constants/personalities'
import { TYPE_RARITY } from '../../constants/rarity'

interface RankItem { code: string; count: number }
interface RankData { total: number; list: RankItem[] }

export default function RankingPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<RankData | null>(null)

  useEffect(() => {
    request<RankData>({ url: '/api/ranking' })
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const history = getLocalHistory()
  const stats = getLocalStats()
  const recentHistory = [...history].reverse().slice(0, 20)

  return (
    <View className="min-h-screen bg-bg px-4 py-4 pb-20">
      {/* 全站排行 */}
      <View className="bg-bg-card rounded-xl p-4 border border-[#e8e3d8]">
        <Text className="text-lg font-bold text-primary block mb-3">全站排行</Text>
        {loading ? (
          <Text className="text-sm text-[#6a786f] text-center block py-8">加载中...</Text>
        ) : !data || data.list.length === 0 ? (
          <Text className="text-sm text-[#6a786f] text-center block py-8">暂无数据</Text>
        ) : (
          <>
            <View className="flex justify-between mb-3 text-xs text-[#6a786f]">
              <Text>共 {data.total} 人参与</Text>
              <Text>覆盖 {data.list.length} 种人格</Text>
            </View>
            {data.list.map((item, i) => {
              const lib = TYPE_LIBRARY[item.code]
              const maxCount = data.list[0].count
              const pct = Math.round((item.count / maxCount) * 100)
              return (
                <View key={item.code} className="flex items-center mb-2">
                  <Text className="w-6 text-sm text-[#6a786f] text-center">{i + 1}</Text>
                  <View className="flex-1 ml-2">
                    <View className="flex items-center gap-1 mb-1">
                      <Text className="text-sm font-medium text-primary">{item.code}</Text>
                      <Text className="text-xs text-primary-light">{lib?.cn}</Text>
                    </View>
                    <View className="bg-[#f0ede6] rounded-full h-1.5">
                      <View className="bg-primary h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                    </View>
                  </View>
                  <Text className="ml-2 text-xs text-[#6a786f]">{item.count} 次</Text>
                </View>
              )
            })}
          </>
        )}
      </View>

      {/* 本地历史 */}
      <View className="bg-bg-card rounded-xl p-4 mt-4 border border-[#e8e3d8]">
        <Text className="text-lg font-bold text-primary block mb-3">我的测试记录</Text>
        {history.length === 0 ? (
          <View className="text-center py-6">
            <Text className="text-sm text-[#6a786f] block mb-3">还没有测试记录</Text>
            <View
              className="bg-primary text-white px-4 py-2 rounded-lg inline-block text-sm"
              onClick={() => Taro.navigateTo({ url: '/pages/test/index' })}
            >
              去测试
            </View>
          </View>
        ) : (
          <>
            <View className="flex justify-between mb-3 text-xs text-[#6a786f]">
              <Text>共 {history.length} 次</Text>
              <Text>解锁 {Object.keys(stats).length} 种</Text>
            </View>
            {recentHistory.map((item, i) => {
              const lib = TYPE_LIBRARY[item.code]
              const rarity = TYPE_RARITY[item.code]
              const d = new Date(item.time)
              const timeStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
              return (
                <View key={i} className="flex justify-between items-center py-2 border-b border-[#f0ede6] last:border-b-0">
                  <View>
                    <Text className="text-sm font-medium text-primary">{item.code}</Text>
                    <Text className="text-xs text-primary-light ml-1">{lib?.cn}</Text>
                  </View>
                  <View className="flex items-center gap-2">
                    {rarity && <Text className="text-xs text-accent">{rarity.label}</Text>}
                    <Text className="text-xs text-[#a09a8f]">{timeStr}</Text>
                  </View>
                </View>
              )
            })}
          </>
        )}
      </View>
    </View>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/taro-app/src/pages/ranking/
git commit -m "feat: implement ranking page with global stats and local history"
```

---

### Task 11: 人格介绍页 + 相性页

**Files:**
- Modify: `packages/taro-app/src/pages/profiles/index.tsx`
- Modify: `packages/taro-app/src/pages/compat/index.tsx`

- [ ] **Step 1: 实现人格介绍页**

```tsx
import { View, Text } from '@tarojs/components'
import { TYPE_LIBRARY } from '../../constants/personalities'
import PersonalityCard from '../../components/PersonalityCard'

export default function ProfilesPage() {
  return (
    <View className="min-h-screen bg-bg px-4 py-4 pb-20">
      <Text className="text-xl font-bold text-primary text-center block mb-4">全部人格介绍</Text>
      {Object.values(TYPE_LIBRARY).map(t => (
        <PersonalityCard key={t.code} code={t.code} cn={t.cn} intro={t.intro} desc={t.desc} />
      ))}
    </View>
  )
}
```

- [ ] **Step 2: 实现相性页**

```tsx
import { View, Text } from '@tarojs/components'
import { COMPATIBILITY } from '../../constants/compatibility'
import { TYPE_LIBRARY } from '../../constants/personalities'

const typeIcons = { soulmate: '💕', rival: '⚔️' }
const typeLabels = { soulmate: '天生一对', rival: '欢喜冤家' }
const typeBg = { soulmate: 'bg-[#fce4ec]', rival: 'bg-[#fff8e1]' }

export default function CompatPage() {
  return (
    <View className="min-h-screen bg-bg px-4 py-4 pb-20">
      <Text className="text-xl font-bold text-primary text-center block mb-4">人格相性表</Text>
      {Object.entries(COMPATIBILITY).map(([key, c]) => {
        const [codeA, codeB] = key.split('+')
        return (
          <View key={key} className="bg-bg-card rounded-xl p-4 mb-3 border border-[#e8e3d8]">
            <View className="flex items-center justify-center gap-2 mb-2">
              <Text className="text-sm font-bold text-primary">{codeA}</Text>
              <Text className="text-xs text-[#a09a8f]">×</Text>
              <Text className="text-sm font-bold text-primary">{codeB}</Text>
            </View>
            <View className={`${typeBg[c.type]} px-2 py-1 rounded text-center mb-2`}>
              <Text className="text-xs">{typeIcons[c.type]} {typeLabels[c.type]}</Text>
            </View>
            <Text className="text-xs text-[#6a786f] text-center block">{c.say}</Text>
          </View>
        )
      })}
    </View>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add packages/taro-app/src/pages/profiles/ packages/taro-app/src/pages/compat/
git commit -m "feat: implement profiles page and compatibility page"
```

---

### Task 12: 小程序分享功能

**Files:**
- Create: `packages/taro-app/src/utils/share.ts`
- Modify: `packages/taro-app/src/pages/result/index.tsx` (添加分享按钮)

- [ ] **Step 1: 创建 share 工具函数**

```ts
import Taro from '@tarojs/taro'
import { TYPE_IMAGES } from '../constants/personalities'

// 小程序端：使用 onShareAppMessage
// H5 端：使用 Canvas 绘制 + 下载

export function saveImageToAlbum(tempFilePath: string) {
  if (process.env.TARO_ENV === 'weapp') {
    Taro.saveImageToPhotosAlbum({ filePath: tempFilePath })
      .then(() => Taro.showToast({ title: '已保存到相册', icon: 'success' }))
      .catch(() => Taro.showToast({ title: '保存失败', icon: 'none' }))
  } else {
    // H5: 下载图片
    const a = document.createElement('a')
    a.href = tempFilePath
    a.download = 'sbti-result.png'
    a.click()
  }
}
```

- [ ] **Step 2: 在结果页添加分享配置**

在 `pages/result/index.tsx` 中添加小程序分享支持：

```tsx
import { useShareAppMessage } from '@tarojs/taro'

// 在 ResultPage 组件内部添加：
useShareAppMessage(() => ({
  title: `我是${type.code}（${type.cn}），来测测你是什么人格！`,
  path: '/pages/home/index',
}))
```

- [ ] **Step 3: 在结果页添加保存/分享按钮**

在结果页操作按钮区域添加：

```tsx
<View className="flex gap-3 mt-2">
  <View className="flex-1 bg-[#e8e3d8] text-primary text-center py-3 rounded-lg text-sm" onClick={handleHome}>
    回到首页
  </View>
  {process.env.TARO_ENV === 'weapp' && (
    <Button openType="share" className="flex-1 bg-accent text-white text-center py-3 rounded-lg text-sm border-0">
      分享给好友
    </Button>
  )}
  <View className="flex-1 bg-primary text-white text-center py-3 rounded-lg text-sm" onClick={handleRestart}>
    再测一次
  </View>
</View>
```

- [ ] **Step 4: Commit**

```bash
git add packages/taro-app/src/
git commit -m "feat: add share functionality for WeChat mini-program and H5"
```

---

### Task 13: H5 端验证与调试

**Files:**
- 无新建文件，调试和修复现有代码

- [ ] **Step 1: 启动 H5 开发服务器并全流程验证**

```bash
cd packages/taro-app && pnpm dev:h5
```

验证清单：
- 首页 TabBar 导航正常
- 首页人格一览展开/收起正常
- 点击"开始测试"进入答题页
- 逐题答题、上/下一题导航正常
- 特殊题（饮酒门控）触发正常
- 全部答完后提交按钮可用
- 结果页显示正确人格类型
- 维度分析列表正确
- 排行榜 API 数据加载
- 本地历史记录正常
- 相性表显示正常

- [ ] **Step 2: 修复发现的问题**

根据测试结果修复 bug。

- [ ] **Step 3: Commit**

```bash
git add packages/taro-app/
git commit -m "fix: H5 端全流程调试修复"
```

---

### Task 14: 微信小程序编译与适配

**Files:**
- Modify: `packages/taro-app/project.config.json` (小程序配置)
- 可能需要调整部分组件的跨端兼容

- [ ] **Step 1: 编译微信小程序**

```bash
cd packages/taro-app && pnpm build:weapp
```

- [ ] **Step 2: 在微信开发者工具中打开**

打开 `packages/taro-app/dist` 目录。

检查项：
- TabBar 正常显示
- 页面导航正常
- Tailwind 样式正确渲染（weapp-tailwindcss 转换正常）
- 图片资源加载正常

- [ ] **Step 3: 配置域名白名单**

在微信小程序后台配置合法域名：
- request 域名：`sbti.fancc.de5.net`（或你的 API 域名）

- [ ] **Step 4: 修复小程序端特有问题**

常见问题：
- `View` onClick 需要换成 `onTap`（Taro 自动处理）
- 图片路径需要确认编译后正确
- `inline-block` 等 CSS 可能需要调整

- [ ] **Step 5: Commit**

```bash
git add packages/taro-app/
git commit -m "feat: configure and adapt for WeChat mini-program"
```

---

### Task 15: 样式精调与视觉一致性

**Files:**
- 修改各页面和组件的 Tailwind className

- [ ] **Step 1: 对比原版 H5 和 Taro H5 的视觉差异**

原版使用的配色方案：
- 主色: `#304034`
- 背景: `#f5f0e8`
- 卡片: `#fffdf7`
- 边框: `#e8e3d8`
- 副文字: `#6a786f`
- 强调: `#b8860b`

确认 Tailwind 配置的自定义颜色已覆盖这些值。

- [ ] **Step 2: 调整间距、字号、圆角等细节**

逐页检查：
- Hero 区域高度和内边距
- 人格卡片的图片比例
- 答题页的选项间距
- 结果页的信息层级
- 排行榜的进度条样式

- [ ] **Step 3: 确认两端样式一致**

同时运行 H5 和小程序预览，对比视觉效果。

- [ ] **Step 4: Commit**

```bash
git add packages/taro-app/
git commit -m "style: polish UI to match original design across H5 and mini-program"
```
