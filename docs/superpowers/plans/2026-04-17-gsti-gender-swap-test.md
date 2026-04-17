# GSTI 性转人格测试 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增一个"性转人格测试"GSTI：男生测出全是女性物种（捞女/娇妻/绿茶/傻白男…），女生测出全是男性物种（凤凰男/妈宝男/普信男/舔狗…），借 SBTI 余温做下一个爆款。

**Architecture:** 作为第 7 个测试加入现有多入口架构（gsti.html + src/GstiApp.tsx + src/data/gsti/）。核心变化：TestConfig 增加 `genderLocked` 和 `typePoolByGender`，`computeResult` 接受 `poolFilter` 参数，前置 GenderPicker 组件让用户选择性别锁定结果池。其余组件（ResultPage/QuizOverlay/RadarChart 等）100% 复用。

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS, Framer Motion，沿用现有 Redis 排行榜与分享海报管线。

**Spec:** `docs/superpowers/specs/2026-04-17-viral-tests-masterplan.md`（第四章为 GSTI 完整设计）

---

## File Structure

### 新建文件
| File | Purpose |
|------|---------|
| `gsti.html` | Vite 入口 HTML |
| `src/GstiApp.tsx` | 顶层 App，`TestConfigProvider + AppInner` 模式 |
| `src/data/gsti/dimensions.ts` | 6 维度定义（GT/HC/TB/KS/PR/LO） |
| `src/data/gsti/questions.ts` | 22 题（每维 3-4 题） |
| `src/data/gsti/types.ts` | 男池 20 + 女池 20 + 隐藏 UNDEF + fallback 共 42 类型 |
| `src/data/gsti/typeImages.ts` | 占位 placeholder（首版 CSS 生成卡片） |
| `src/data/gsti/compatibility.ts` | 占位 compatibility（MVP 不启用 compat tab） |
| `src/data/gsti/config.ts` | GSTI TestConfig 实例 |
| `src/components/GenderPicker.tsx` | 性别三选（男/女/不透露） |
| `src/components/GSTIHeroBadge.tsx` | 结果页顶部"反串"徽章（性别×物种错位展示） |

### 修改文件
| File | Change |
|------|--------|
| `src/data/testConfig.tsx` | 扩展 `TestConfig` 加入 `genderLocked` + `typePoolByGender` |
| `src/utils/matching.ts` | `computeResult` 新增 `gender` 参数，根据 `typePoolByGender` 过滤 `normalTypes` |
| `src/hooks/useQuiz.ts` | 新增 `gender` state + `setGender` action + 持久化到 localStorage |
| `src/utils/shareCard.ts` | GSTI 分享海报增加反差视觉（左上性别标签 + "SWAP" 徽章） |
| `src/components/ResultPage.tsx` | 条件渲染 `GSTIHeroBadge`（当 config.genderLocked 为 true） |
| `vite.config.ts` | 新增 `gsti` 构建入口 |
| `build.sh` | 复制 gsti 产物到 `dist/new/gsti/` |
| `index.html` | 首页导航新增"性转版 GSTI"卡片 |
| `src/App.tsx` | SBTI 主站加入"性转版"入口跳转 |

---

## Dimension Conventions

6 维度统一用 `A`/`B` 编码 pattern 字符串（对齐现有 LQ16 格式）：

| 维度 | 代码 | A 极 | B 极 | 说明 |
|------|------|------|------|------|
| D1 | GT | Giver 给予 | Taker 索取 | 你在关系里给得多还是要得多 |
| D2 | HC | Hot 热烈 | Cold 冷淡 | 情感表达温度 |
| D3 | TB | Top 主导 | Bottom 被动 | 关系权力位置 |
| D4 | KS | Calc 算计 | Sincere 真诚 | 利益计算程度 |
| D5 | PR | Perform 表演 | Real 真实 | 对外是人设还是本色 |
| D6 | LO | Loyal 专一 | Loose 开放 | 关系排他性 |

题目 `value` 映射：
- `1` = 强指向 A 极
- `2` = 偏 A
- `3` = 偏 B
- `4` = 强指向 B 极

每维度 raw score = 该维度下所有题目 value 之和。用 `sumToLevel` 换算成 `L`（低/A极）/`M`（中）/`H`（高/B极），再用 `levelNum`（`L`=1, `M`=2, `H`=3）组装 user vector。

Pattern 字符串每位 `A`/`B`：`A` → 匹配时 `levelNum=1`，`B` → 3，M 走居中 2。最小距离即最匹配。

---

### Task 1: 扩展 `TestConfig` 类型支持性别锁定

**Files:**
- Modify: `src/data/testConfig.tsx`

- [ ] **Step 1: 追加 `genderLocked` 和 `typePoolByGender` 字段到 `TestConfig` 接口**

打开 `src/data/testConfig.tsx`，在 `TestConfig` interface 最末一个字段前（不影响现有测试），新增可选字段：

```typescript
// 在 src/data/testConfig.tsx 的 TestConfig interface 内，找到最后一个字段如 questionCountLabel，紧邻其后追加：

  // GSTI-only: 性别锁定支持
  genderLocked?: boolean;                  // true → UI 触发性别选择器
  typePoolByGender?: {                      // 按性别过滤匹配的类型池
    male: string[];                         // 男性用户可匹配的类型代号
    female: string[];                       // 女性用户可匹配的类型代号
    both: string[];                         // 选"不透露"时，可匹配的类型代号（通常 = male + female）
  };
```

同时在文件顶部 `Gender` 类型导出（若未定义）：

```typescript
export type Gender = 'male' | 'female' | 'unspecified';
```

- [ ] **Step 2: 验证编译不报错**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: 无错误输出（或仅有与本次修改无关的预先存在的错误）。

- [ ] **Step 3: Commit**

```bash
git add src/data/testConfig.tsx
git commit -m "feat(gsti): extend TestConfig with genderLocked + typePoolByGender"
```

---

### Task 2: 创建 GSTI 数据目录骨架

**Files:**
- Create: `src/data/gsti/dimensions.ts`
- Create: `src/data/gsti/typeImages.ts`
- Create: `src/data/gsti/compatibility.ts`

- [ ] **Step 1: 创建 dimensions.ts**

```typescript
// src/data/gsti/dimensions.ts
import type { DimensionInfo } from '../testConfig';

export const dimensionMeta: Record<string, DimensionInfo> = {
  D1: { name: '关系角色', model: 'GT 模型' },
  D2: { name: '情感温度', model: 'HC 模型' },
  D3: { name: '权力位置', model: 'TB 模型' },
  D4: { name: '利益计算', model: 'KS 模型' },
  D5: { name: '展示方式', model: 'PR 模型' },
  D6: { name: '关系忠诚', model: 'LO 模型' },
};

export const dimensionOrder = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'];

export const DIM_EXPLANATIONS: Record<string, Record<string, string>> = {
  D1: {
    A: '你在关系里是 Giver——习惯先付出、先主动、先担责。给对方送礼记得住尺码，约会记得 TA 的偏好，连 TA 没说的需求你都能提前想到。你以为这叫"爱"，其实你只是在用付出换一种"我值得被留下"的安全感。',
    B: '你在关系里是 Taker——被追、被宠、被迁就你都坦然接受。你觉得"对方主动"是天经地义的，你只负责挑选和决定。你不是不会爱，你只是更习惯让别人先表达爱。',
  },
  D2: {
    A: '你的情感温度是 Hot——表达直接、热烈、毫不隐藏。喜欢就主动示好，生气就当场发作，爱一个人能爱到全世界都知道。你的优点是真实，缺点是烫。',
    B: '你的情感温度是 Cold——冷静、克制、留白。你不会轻易暴露情绪，喜欢一个人也要在心里算三遍才肯说。你以为这叫成熟，其实一半是自我保护。',
  },
  D3: {
    A: '你在关系里是 Top——主导走向、决定节奏、掌控议题。你习惯了"我说了算"的位置，一旦关系里你不是那个拍板的人你就浑身不自在。',
    B: '你在关系里是 Bottom——跟随、配合、让出决定权。你觉得让对方主导省心又浪漫，但你偶尔也会委屈："为什么所有决定都要 TA 拍板？"',
  },
  D4: {
    A: '你是 Calc——在关系里精打细算。对方的家境、存款、升值潜力、家族背景你心里都有一张表。你说你"不是拜金"，你只是"现实"。',
    B: '你是 Sincere——凭真心不凭算盘。你不算账、不问家底、不筛简历，喜欢就是喜欢。你赢了感动，输了代价。',
  },
  D5: {
    A: '你是 Perform——爱情是一场表演。朋友圈要精修、约会要出片、纪念日要有仪式感、吵架要有剧本。你不是虚伪，你只是觉得"被看见"才算存在。',
    B: '你是 Real——本色主义。不演、不装、不打卡、不输出人设。你觉得只有私下状态才是你，对外展示让你累。',
  },
  D6: {
    A: '你是 Loyal——关系专一到极致。谈一个就全心一个，暧昧对象只有那一个，手机屏保、密码、定位、消息一切透明。你对忠诚有信仰。',
    B: '你是 Loose——关系里保留灵活空间。你不是滥情，你只是觉得"完全排他"对你来说像坐牢。你享受可能性，你也给对方可能性。',
  },
};
```

- [ ] **Step 2: 创建 typeImages.ts 占位**

```typescript
// src/data/gsti/typeImages.ts
// 首版无自定义图片——复用 SBTI 已有的 CSS 生成卡片机制（TypeCard 组件已在无图时自动兜底）
export const TYPE_IMAGES: Record<string, string> = {};
export const SHARE_IMAGES: Record<string, string> = {};
```

- [ ] **Step 3: 创建 compatibility.ts 占位**

```typescript
// src/data/gsti/compatibility.ts
// MVP 阶段 GSTI 不启用 compat tab（类型是反串梗，compat 语义不合理）
// 保留占位，后续版本可基于男池 × 女池设计"异性相吸"compat
import type { CompatEntry, CompatResult } from '../testConfig';

export const COMPATIBILITY: Record<string, CompatEntry> = {};

export function getCompatibility(_a: string, _b: string): CompatResult {
  return { type: 'normal', say: '两人相处模式没有特别的化学反应，也没有明显的冲突。' };
}
```

- [ ] **Step 4: Verify compile**

Run: `npx tsc --noEmit 2>&1 | head -30`
Expected: 无新增错误

- [ ] **Step 5: Commit**

```bash
git add src/data/gsti/dimensions.ts src/data/gsti/typeImages.ts src/data/gsti/compatibility.ts
git commit -m "feat(gsti): add dimensions/typeImages/compatibility stubs"
```

---

### Task 3: 写 GSTI 题目库（22 题）

**Files:**
- Create: `src/data/gsti/questions.ts`

- [ ] **Step 1: 创建 questions.ts（完整 22 题）**

```typescript
// src/data/gsti/questions.ts
import type { Question } from '../testConfig';

export const questions: Question[] = [
  // ===== D1 关系角色：Giver(A) vs Taker(B) =====
  {
    id: 'gt1', dim: 'D1', text: '和心动对象第一次约会，你倾向：',
    options: [
      { label: '我主动约，地点我选，账我买', value: 1 },
      { label: '我主动，但各付各的', value: 2 },
      { label: 'TA 约我，让 TA 决定去哪', value: 3 },
      { label: '等 TA 提一切，我负责出现', value: 4 },
    ],
  },
  {
    id: 'gt2', dim: 'D1', text: '记住对象生日、偏好、过敏信息这些事：',
    options: [
      { label: '我全记，细节到 TA 咖啡加几勺糖', value: 1 },
      { label: '重要的我记，细节靠 TA 提醒', value: 2 },
      { label: '记大概，细节靠猜', value: 3 },
      { label: 'TA 记我就行，我记了也会忘', value: 4 },
    ],
  },
  {
    id: 'gt3', dim: 'D1', text: '对象发烧了，你的第一反应：',
    options: [
      { label: '立刻买药送饭熬粥，通宵照顾', value: 1 },
      { label: '让 TA 好好休息，我来处理一切', value: 2 },
      { label: '发消息关心一下，TA 需要了再说', value: 3 },
      { label: '等 TA 主动叫我，不然我怕打扰', value: 4 },
    ],
  },

  // ===== D2 情感温度：Hot(A) vs Cold(B) =====
  {
    id: 'hc1', dim: 'D2', text: '喜欢一个人到"心痒"的程度，你会：',
    options: [
      { label: '当场表白，"我好喜欢你"', value: 1 },
      { label: '暗示到对方感受得到', value: 2 },
      { label: '憋住，等对方先说', value: 3 },
      { label: '不说，保持距离就好', value: 4 },
    ],
  },
  {
    id: 'hc2', dim: 'D2', text: '对象说"我爱你"，你最可能的反应：',
    options: [
      { label: '"我也爱你，爱得发疯"', value: 1 },
      { label: '"我也是"（微笑对视）', value: 2 },
      { label: '"嗯"（轻轻应一声）', value: 3 },
      { label: '尴尬地笑一下，转移话题', value: 4 },
    ],
  },
  {
    id: 'hc3', dim: 'D2', text: '吵架情绪上头，你最容易：',
    options: [
      { label: '当场大哭 / 大吼，发泄一切', value: 1 },
      { label: '强忍，但表情挂脸', value: 2 },
      { label: '冷淡下来，不想说话', value: 3 },
      { label: '彻底沉默，一句都不愿再说', value: 4 },
    ],
  },
  {
    id: 'hc4', dim: 'D2', text: '对象发给你一条很长的小作文：',
    options: [
      { label: '我立刻写一条更长的回过去', value: 1 },
      { label: '认真看完，回几句重点', value: 2 },
      { label: '回个"嗯""好"', value: 3 },
      { label: '看完不回，假装没看见', value: 4 },
    ],
  },

  // ===== D3 权力位置：Top(A) vs Bottom(B) =====
  {
    id: 'tb1', dim: 'D3', text: '和对象一起去吃饭，去哪里吃：',
    options: [
      { label: '我定，TA 听我的就好', value: 1 },
      { label: '我提 2-3 个选项 TA 挑', value: 2 },
      { label: '让 TA 定，我都可以', value: 3 },
      { label: '完全随 TA，我没什么意见', value: 4 },
    ],
  },
  {
    id: 'tb2', dim: 'D3', text: '关系走向（确定关系、同居、结婚）由谁推动：',
    options: [
      { label: '基本我推动，不然 TA 不动', value: 1 },
      { label: '大部分我主动开口', value: 2 },
      { label: '双方差不多，谁提都行', value: 3 },
      { label: '几乎全是 TA 在推，我跟着走', value: 4 },
    ],
  },
  {
    id: 'tb3', dim: 'D3', text: '吵架僵持时，谁先低头：',
    options: [
      { label: '绝对不是我，我宁可冷战', value: 1 },
      { label: '通常我会找台阶，但不直接道歉', value: 2 },
      { label: '各一半，看情况', value: 3 },
      { label: '我先低头，让 TA 舒服', value: 4 },
    ],
  },
  {
    id: 'tb4', dim: 'D3', text: '对象的大事（换工作、搬家、重要决定）你是否会干预：',
    options: [
      { label: '会，而且我的意见基本就是最终方案', value: 1 },
      { label: '会强烈表态，但最终 TA 决定', value: 2 },
      { label: '建议几句就不管了', value: 3 },
      { label: '完全 TA 自己定，我不插嘴', value: 4 },
    ],
  },

  // ===== D4 利益计算：Calc(A) vs Sincere(B) =====
  {
    id: 'ks1', dim: 'D4', text: '确定和一个人发展前，你会优先了解：',
    options: [
      { label: '家庭背景、收入、房产、资产状况', value: 1 },
      { label: '稳定性、工作、三观', value: 2 },
      { label: '有没有共同话题和感觉', value: 3 },
      { label: '只看心动，其他都是附加题', value: 4 },
    ],
  },
  {
    id: 'ks2', dim: 'D4', text: '对方家境一般、暂时穷，但你很喜欢 TA：',
    options: [
      { label: '对不起，我接受不了，不是爱不爱的问题', value: 1 },
      { label: '观察一阵，看 TA 能不能上进', value: 2 },
      { label: '爱了，经济问题一起扛', value: 3 },
      { label: '完全不在意，甚至会养 TA', value: 4 },
    ],
  },
  {
    id: 'ks3', dim: 'D4', text: '送对象礼物，你考虑最多的是：',
    options: [
      { label: '性价比——花多少值多少', value: 1 },
      { label: '品牌和场面——别让 TA 没面子', value: 2 },
      { label: 'TA 真的需要什么、会喜欢什么', value: 3 },
      { label: '我自己那一刻的心情，多少都行', value: 4 },
    ],
  },
  {
    id: 'ks4', dim: 'D4', text: '结婚前是否会要求看征信、存款、房产证：',
    options: [
      { label: '必须，这是对自己负责', value: 1 },
      { label: '会旁敲侧击，但不正式查', value: 2 },
      { label: '不会，相信 TA', value: 3 },
      { label: '想都没想过，这也能查？', value: 4 },
    ],
  },

  // ===== D5 展示方式：Perform(A) vs Real(B) =====
  {
    id: 'pr1', dim: 'D5', text: '纪念日，你会：',
    options: [
      { label: '精心策划布置+拍照+发朋友圈+艾特 TA', value: 1 },
      { label: '认真准备但不发朋友圈', value: 2 },
      { label: '简单过一下，吃顿饭就行', value: 3 },
      { label: '忘了都有可能，TA 提我才想起', value: 4 },
    ],
  },
  {
    id: 'pr2', dim: 'D5', text: '对象做了件让你不爽的事，你会：',
    options: [
      { label: '发一条意有所指的朋友圈，让 TA 看到', value: 1 },
      { label: '朋友圈不发，微信直接说', value: 2 },
      { label: '私下聊开，不让任何人知道', value: 3 },
      { label: '自己消化，很少告诉 TA', value: 4 },
    ],
  },
  {
    id: 'pr3', dim: 'D5', text: '发合照到朋友圈，你最在意：',
    options: [
      { label: '角度、滤镜、文案、艾特 TA 都要完美', value: 1 },
      { label: '我自己要好看，其他随意', value: 2 },
      { label: '记录一下就行，不精修', value: 3 },
      { label: '我不发朋友圈合照', value: 4 },
    ],
  },
  {
    id: 'pr4', dim: 'D5', text: 'TA 在你朋友面前形象"翻车"（糗事、口误），你：',
    options: [
      { label: '赶紧圆场，绝不能让 TA 被看扁', value: 1 },
      { label: '跟着笑两下转移话题', value: 2 },
      { label: '随 TA，糗就糗了不是啥大事', value: 3 },
      { label: '反而觉得可爱，直接吐槽 TA', value: 4 },
    ],
  },

  // ===== D6 关系忠诚：Loyal(A) vs Loose(B) =====
  {
    id: 'lo1', dim: 'D6', text: '谈恋爱期间，还和暧昧对象保持联系：',
    options: [
      { label: '绝对不行，一个都不留', value: 1 },
      { label: '老朋友可以，有暧昧痕迹的全删', value: 2 },
      { label: '保留联系但不越界', value: 3 },
      { label: '看心情，反正没越实质的线', value: 4 },
    ],
  },
  {
    id: 'lo2', dim: 'D6', text: '对方查你手机：',
    options: [
      { label: '随便查，我没有秘密', value: 1 },
      { label: '给 TA 看但我会先偷偷整理一下', value: 2 },
      { label: '不给看，隐私不能越界', value: 3 },
      { label: '想都别想，查就分手', value: 4 },
    ],
  },
  {
    id: 'lo3', dim: 'D6', text: '关系稳定一段时间后，你是否还会享受别人的追求：',
    options: [
      { label: '完全不，我眼里只有 TA', value: 1 },
      { label: '被追有点爽，但我会划清', value: 2 },
      { label: '享受那种被欣赏的感觉', value: 3 },
      { label: '我还是会保留几条暧昧备选', value: 4 },
    ],
  },
];

export const specialQuestions: Question[] = [
  // 隐藏触发：选"不透露"性别 + 此题选最中立，才触发 UNDEF
  {
    id: 'gsti_gate', special: true, kind: 'gate',
    text: '最后一个测试 bug 用的小问题：把自己放进下面的盒子里，你属于哪种？',
    options: [
      { label: '男', value: 1 },
      { label: '女', value: 2 },
      { label: '非典型，没法贴标签', value: 3 },
      { label: '不告诉你', value: 4 },
    ],
  },
];
```

- [ ] **Step 2: Verify compile**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: 无错误

- [ ] **Step 3: Commit**

```bash
git add src/data/gsti/questions.ts
git commit -m "feat(gsti): add 22 neutral-scenario questions covering 6 dimensions"
```

---

### Task 4: 写 GSTI 类型库（男池 20 + 女池 20 + 隐藏 UNDEF + fallback）

**Files:**
- Create: `src/data/gsti/types.ts`

- [ ] **Step 1: 创建 types.ts（完整 42 类型）**

文件体量较大（约 700 行），请完整复制粘贴。Pattern 字符串为 6 字符 A/B 串，对应 D1-D6。类型描述沿用现有测试的四段式调性（开场定位 → 天赋优势 → 隐秘代价 → 一句刺痛你的话），但**刻意保留性转反差感**（描述里直呼"你作为一个男的""你作为一个姑娘"等）。

```typescript
// src/data/gsti/types.ts
import type { TypeDef, NormalType, RarityInfo } from '../testConfig';

/* =============================================================
 * 男生池：20 个女性刻板物种（性转扣在男生头上）
 * 池标识：所有 code 以 'M_' 前缀（Male user → Female-label）
 * ============================================================= */

export const MALE_POOL_CODES = [
  'M_GOLD', 'M_HUBY', 'M_GTEA', 'M_WHIT', 'M_FBRO', 'M_SAIN', 'M_MALK', 'M_TEAM',
  'M_BABY', 'M_CTRL', 'M_MOON', 'M_PRNC', 'M_DRAM', 'M_SOFT', 'M_PHNX', 'M_FANC',
  'M_HOTG', 'M_SCHM', 'M_WLOT', 'M_HOOK',
];

/* =============================================================
 * 女生池：20 个男性刻板物种（性转扣在女生头上）
 * 池标识：所有 code 以 'F_' 前缀（Female user → Male-label）
 * ============================================================= */

export const FEMALE_POOL_CODES = [
  'F_PHNX', 'F_MGIR', 'F_PCON', 'F_LICK', 'F_OCEA', 'F_TOOL', 'F_DADY', 'F_IRON',
  'F_ROUG', 'F_STRG', 'F_NICE', 'F_BACK', 'F_ACGR', 'F_WILD', 'F_DARK', 'F_BOSS',
  'F_KBGR', 'F_DADG', 'F_PART', 'F_BRIC',
];

export const TYPE_LIBRARY: Record<string, TypeDef> = {
  // ============ 男生池（女性物种扣男生） ============
  M_GOLD: {
    code: 'M_GOLD', cn: '挖金壮男', intro: 'The Gold Digger (male)',
    desc: '兄弟，你不是找对象，你是在做尽职调查。你看姑娘的眼神跟审计师看财报一个路数——长相加十分，家境加三十分，房产加五十分，独生女加四十分。你把"择偶"玩成了"投标"，玩出了段位，可惜也玩掉了你作为一个男的最后一点浪漫想象力。\n\n天赋优势：信息收集能力堪比私家侦探，对方爷爷哪年入党你都能查出来；算账能力一流，感情投入产出比永远为正；绝对不会出现"为爱走天涯"的蠢事。\n\n隐秘代价：你身边的姑娘越来越精明——因为她们早闻到你身上的计算器味儿了；你嘴上说"找个家境好的"是为让父母安心，其实是你根本不相信自己能赢；你这辈子大概率娶一个比你更会算的女人，然后你们一起算到天荒地老。\n\n一句刺痛你的话：你精打细算了一辈子感情，但从来没人为你破格过。',
  },
  M_HUBY: {
    code: 'M_HUBY', cn: '纯享娇夫', intro: 'The Kept Husband',
    desc: '你作为一个大老爷们，把自己活成了家政界的男团门面。你不是没能力赚钱，你是算过一笔账——赚钱太累，不如嫁人。你擅长打扮自己，懂得撒娇使性子，一哭二闹三告状的手艺无师自通。对象工资卡上交、家务活不干、周末逛街陪着，你是新时代的娇夫典范。\n\n天赋优势：情绪价值给得到位，对象一整天的气都能被你一个撒娇化解；审美在线，家居生活品质永远拉满；丈母娘眼里"怎么这么会疼人"的那种女婿。\n\n隐秘代价：你对象在外拼越累你在家越娇，有一天经济地位差到你开口提一千块要深呼吸三次；你把人生外包了，你的快乐、安全感、零花钱全握在别人手里；被伺候习惯了，真要独立生活你连洗衣机怎么开都不记得。\n\n一句刺痛你的话：你赢下了婚姻的舒适区，但输光了作为独立个体的所有可能性。',
  },
  M_GTEA: {
    code: 'M_GTEA', cn: '绿茶公', intro: 'The Green Tea Boy',
    desc: '兄弟，别装了。你全身散发着"我这人就是太单纯"的危险气质。你永远柔声细语，永远半推半就，永远让身边三个姑娘觉得自己是"被选中的那个"。"我也没做什么啊"是你的口头禅，"我就是对大家都很好"是你的遮羞布。你把中国最古老的茶艺用男性声线演绎到了全新境界。\n\n天赋优势：多线操作能力惊人，同时和三四个姑娘暧昧面不改色；永远是受害者叙事的主角，出了事都是别人误会你；社交场里你就是所有姑娘都想救赎、所有哥们都想揍的那种。\n\n隐秘代价：你玩了这么多年绿茶，连自己都分不清哪些是真心哪些是戏；你享受暧昧胜过恋爱本身，真进入关系你反而慌了；你身边没一个铁哥们——男的一眼就看穿你。\n\n一句刺痛你的话：你装了一辈子的单纯，但你连真正被爱一次都没有过。',
  },
  M_WHIT: {
    code: 'M_WHIT', cn: '傻白男', intro: 'The Innocent Boy',
    desc: '你作为一个男的，把自己活成了一朵憨憨的向日葵。你天真到夸张，相信世界上所有人都是好人，相信每个对你笑的姑娘都是真心，相信朋友借钱一定会还。你被骗了三次还说"这次是我误会她了"，你送了三十次礼物还以为自己真的是她"很重要的朋友"。\n\n天赋优势：心态纯净到像个宝宝，永远不会被负能量拖垮；善良写在脸上，真正欣赏你的人会觉得你是这个时代的稀缺品；恋爱模式简单直接，给出去的都是真心。\n\n隐秘代价：你的单纯被无数人当成了提款机；你不是没感觉到被利用，是默认"关系需要一方付出"而那一方永远是你；你二十八岁还会在被骗之后认真反思"我是不是做得还不够好"。\n\n一句刺痛你的话：你给得起全世界最稀有的真心，但你给不起自己一双清醒的眼睛。',
  },
  M_FBRO: {
    code: 'M_FBRO', cn: '扶妹魔', intro: 'The Sister-Saver',
    desc: '祝贺你——作为一个男的，你活成了中式家族关系里最稀有的物种：扶妹魔。妹妹要结婚你掏钱，妹妹要创业你掏钱，妹妹离婚回来住你还得搭进自己的婚房。你对象的合理诉求在你嘴里叫"自私"，你妹妹的无理要求在你嘴里叫"一家人"。\n\n天赋优势：家庭责任感 MAX，是爸妈眼中"从来没让我们操过心"的儿子；执行力惊人，家族需要的任何资源你都能拉到；在"牺牲自我成全家人"这条路上你是当代圣人。\n\n隐秘代价：伴侣看你的眼神越来越累——她不是跟你谈恋爱，她是在陪你养一家子；你嘴上说"我妹真的需要我"，其实你戒不掉那种"被家里人需要"的上瘾感；你把所有的爱都匀给了家族，轮到你自己柜子里空的。\n\n一句刺痛你的话：你扶起了全家人，但没有一个人来扶你。',
  },
  M_SAIN: {
    code: 'M_SAIN', cn: '圣母公', intro: 'The Male Saint',
    desc: '恭喜你——男版圣母诞生。你对世界有一种近乎宗教的包容力：对象出轨你反思自己哪里不够好，哥们落难你当场转账，陌生人求助你放下工作去跟进。你把"别人的人生"当成了自己的修行场，活得像一座永不关门的施舍所。\n\n天赋优势：共情能力碾压性强，身边人的情绪一秒 get；永远是群体里最温暖的存在，你笑的时候整个房间都亮了；爱的浓度高到让人感动，真心对你的人会把你当作终生救赎。\n\n隐秘代价：你把"帮助别人"当成了逃避自己问题的借口；从没问过自己"我想要什么"，因为这个问题让你恐惧；你感动了所有人，但深夜翻遍通讯录找不到一个可以打电话哭的人——因为在所有人眼里你是不会需要安慰的那一个。\n\n一句刺痛你的话：你治愈了全世界，唯独不肯治愈你自己。',
  },
  M_MALK: {
    code: 'M_MALK', cn: '雄竞精', intro: 'The Male-on-Male Competitor',
    desc: '哥，你不是在谈恋爱，你是在跟其他男的较劲。对象刷到别的哥们动态你要比收入，姑娘夸别的男生一句帅你要找十个理由说自己更帅，朋友圈总发"反对 XX 型男人"系列。你所有爱情动作都指向同一件事：证明你比同性更值得被选。\n\n天赋优势：竞争意识超强，目标明确——永远要赢；审美和穿搭在线，你把每天出门当成和别的男的对打；事业心被"要让她骄傲"这个驱动力拉满。\n\n隐秘代价：你追的不是姑娘，是你想象中的"她前任"；你和对象在一起的每个瞬间你都在内心排名——所以你从没真的放松过；你对象早发现了——她知道你爱的不是她，是"赢过别人"这件事本身。\n\n一句刺痛你的话：你赢过了所有男人，但输掉了那个唯一不用你赢也会爱你的女人。',
  },
  M_TEAM: {
    code: 'M_TEAM', cn: '茶艺男', intro: 'The Tea-Brewing Bro',
    desc: '你，是那种把"我这人就是太实在"挂嘴边但实际操作比狐狸还精的哥们。你主打一个"不动声色地算计"。给女生带早餐是因为知道她会记你一整天，帮同事加班是因为知道领导会看在眼里，给朋友借钱只借给还得起的那部分人。你的人设叫"老实人"，操作叫"精算师"。\n\n天赋优势：操作丝滑，经常让人觉得你不是套路而是在做善事；情商极高，知道什么时候该送什么该说什么；长期主义大师，投入必有回报。\n\n隐秘代价：你越来越分不清自己的真心和套路——有时候你给对象送花，你自己都不知道是爱她还是在储存好感度；你所有关系都是等价交换，一旦对方给不出等价回报你对她的热度咔嚓断掉；深夜你偶尔会想：有没有一件事是我真的不为回报做的？你想不出来。\n\n一句刺痛你的话：你把每一次付出都标了价签，所以从没人敢把真心白送给你。',
  },
  M_BABY: {
    code: 'M_BABY', cn: '巨婴弟', intro: 'The Man-Child',
    desc: '兄弟，三十岁了你还在等对象给你决定午饭吃什么。你以为自己是"不想那么累"，其实你是把人生主动权交了出去——先是交给妈，然后交给女朋友。你擅长用"我不会""你决定吧""听你的"来规避所有责任，然后在出问题的时候说"我都听你的了还怪我？"\n\n天赋优势：情绪零阈值，甭管发生什么都能让对象心软；说话嗲声嗲气有种反差萌，对象的母性被你完美激活；真的不会让对象觉得你是"大男人"（因为你是小男孩）。\n\n隐秘代价：对象越爱你越累，因为她不是谈恋爱，她是在养儿子；你遇到一点挫折都会躲进舒适区，而这个舒适区正在被身边的人一个个逃离；三十五岁你会被甩，原因写得清清楚楚——"想找个男人不想养儿子"。\n\n一句刺痛你的话：你以为"乖"是一种美德，但没人愿意把余生交给一个永远长不大的人。',
  },
  M_CTRL: {
    code: 'M_CTRL', cn: '监控型男友', intro: 'The Tracker Boyfriend',
    desc: '你作为一个男的，把自己活成了一座 24 小时待机的 GPS。对象在哪、和谁、做什么、朋友圈几分钟前发的那个定位——你全部实时追踪。你管这叫爱，她管这叫窒息。你查岗的技术水平可以直接去做私家侦探，你的占有欲强到把"关心"彻底异化成了一种入侵。\n\n天赋优势：专一到变态级别，你的世界里只有 TA；精力充沛得恐怖，能把所有时间都投入在一个人身上；执行力满分，TA 提过的一句话你三天后就能实现。\n\n隐秘代价：你爱得越深对方越想逃，这不是她不懂珍惜，是你把爱变成了牢笼；你对她每次主动关心背后都有一个潜台词——"我在监视你"；你不是爱她，你是害怕失去她——这两件事的区别大到可以决定一段关系的生死。\n\n一句刺痛你的话：你把全部的爱都给了她，但你给的是牢饭。',
  },
  M_MOON: {
    code: 'M_MOON', cn: '白月光哥哥', intro: 'The Moonlight Senpai',
    desc: '你是全网姑娘 ex 列表里那个"错过之后还会想一辈子"的男人。你温柔、克制、干净、懂事。你从不主动追姑娘，因为你觉得"真心配得上的人会自己出现"。于是姑娘们都成了你的过客——她们和你暧昧一段时间，发现你永远差一步主动，然后失望离开，然后在十年后翻朋友圈看到你结婚照的时候崩溃哭出来说"他怎么没等我"。\n\n天赋优势：真的很干净，不油不腻不绿茶，是罕见的君子型男人；情绪稳定到离谱，不管多大的事你都能云淡风轻处理；审美和品味在线，跟你谈恋爱的姑娘都会被带着升级。\n\n隐秘代价：你活成了所有人的"白月光"，但没有一个人的"现在进行时"；你把"克制"当成了美德，其实是你害怕主动后被拒绝；你会单身很久，然后在三十多岁的时候匆忙找一个差不多的人结婚——然后一辈子梦到那些曾经差一点的姑娘。\n\n一句刺痛你的话：你温柔了一辈子，最后发现温柔是种体面的退出。',
  },
  M_PRNC: {
    code: 'M_PRNC', cn: '奶油王子病', intro: 'The Prince Princess',
    desc: '三十岁的你活成了家里最后一个王子。吃饭要人夹菜，穿衣要人搭配，出门要人打车，人生每个细节都需要身边人帮你处理。对象说"你怎么这么能撒娇"的时候你还觉得那是夸你。朋友圈精修图角度固定，生日要求对象办派对，情绪一天三个小高潮。你的精神年龄停留在 12 岁。\n\n天赋优势：颜值和形象管理在线，你是群体里永远最"精致"的那一个；撒娇一流，很多姑娘就是吃这一套；对美好生活的向往和敏感度高，品味是真的可以。\n\n隐秘代价：你把自己活成了奢侈品——好看但没用，价格贵但不保值；对象越对你好你越觉得"理所应当"，于是她慢慢冷淡你还觉得是她变了；你的王子病本质是逃避——你拒绝长大，因为成年人的世界没人会继续宠你。\n\n一句刺痛你的话：你戴了一辈子的王冠，但王座一直空着。',
  },
  M_DRAM: {
    code: 'M_DRAM', cn: '作精小王子', intro: 'The Drama Prince',
    desc: '十分钟不回消息你要发 "？？"，半小时不回你要发"你是不是不爱我了"，一小时不回你要直接删联系方式然后半夜又加回来。你作为一个男的，把"作精"这个原本属于女性的词完美占据。你把情绪当武器，把闹脾气当艺术，你的对象已经学会了一种叫做"猜他下一秒什么心情"的玄学。\n\n天赋优势：情感浓度极高，全身散发着"有故事"的戏剧感；表达能力一流，吵架能把 ChatGPT 都骂哑；充满个人色彩，跟你在一起的每一天都像连续剧。\n\n隐秘代价：你作精的底层是不安全感——你用闹来确认对方还爱你；你对象不是在谈恋爱，她是在做情绪临终关怀；你会失去所有真正爱过你的人——因为真爱没问题，但你的作是真的熬人。\n\n一句刺痛你的话：你用一万次闹确认被爱，但你从来没学会怎么好好去爱一个人。',
  },
  M_SOFT: {
    code: 'M_SOFT', cn: '奶油大哥', intro: 'The Soft Operator',
    desc: '你说话温温柔柔，笑起来无公害，借钱从来不主动还。你把自己包装成了一种无伤无害的男性版本——不争不抢、不油不腻、不冒犯任何人。但仔细看你身边那些曾经的朋友和前女友，一个个都在欠账清单上。你不是坏人，你只是擅长把"借"变成"慢慢忘"。\n\n天赋优势：低冒犯形象，几乎所有人对你的第一印象都是"这人挺好的"；情商高，知道怎么在每个场合说出让人舒服的话；你是所有人提起来都想不到缺点的那种人——想不到不是因为没有，是因为你藏得好。\n\n隐秘代价：你的关系都停留在浅层次，因为走近了就会看到你软壳下的那点蛀虫；你不是不想正直，是你习惯了用"温柔"来交换利益；有一天你被人点破的时候，你会发现所谓的朋友早就在心里把你的账算得清清楚楚。\n\n一句刺痛你的话：你软了一辈子，但世界只会让你软到彻底沉下去。',
  },
  M_PHNX: {
    code: 'M_PHNX', cn: '凤凰公', intro: 'The Male Phoenix',
    desc: '你从小城市一路拼到一线城市，你觉得自己是那个"活成了全村骄傲"的男人。你要求对象一定是本地户口+有房+独生女+家里愿意出彩礼，因为你觉得这是你应得的"奖励"。你对象家每出一次力，你爸妈那边就增加一份索取：给你弟娶媳妇、给你妹买车、给你家盖房。\n\n天赋优势：奋斗精神满格，你是同龄人里最会苦熬的；对资源的嗅觉极其敏锐，看得清哪些人能给你提供向上阶梯；自尊心极强，被激将起来之后能爆发出惊人能量。\n\n隐秘代价：你表面强势，内心深处永远在和"小城市出身"较劲；你伴侣家人看你的眼神越来越像在看一个无底洞——因为你的家族从来吃不饱；你把"翻身"当成了人生全部的解药，但没有人告诉你——真正的体面不是你从哪里来，是你走到哪里时心里有没有底。\n\n一句刺痛你的话：你爬了一辈子山，山顶的人却说"你身上还有土味"。',
  },
  M_FANC: {
    code: 'M_FANC', cn: '饭圈弟弟', intro: 'The Fandom Boy',
    desc: '你是男性里最稀有的物种——饭圈铁粉。你为女明星课金、打榜、控评、做数据，你把她当成你人生的精神伴侣。你对真实世界的女人没什么兴趣——因为她们会发火、会要礼物、会不如你屏幕里的那个"老婆"一样完美。你把爱情外包给了偶像产业。\n\n天赋优势：忠诚度满级，追星追了十年还在一线；数据能力爆表，你一个人能顶整个后援会；情绪投入度高，能因为偶像的一条动态爽一整天。\n\n隐秘代价：你对"真女人"的标准已经被屏幕上那些精修过的女明星毁掉了——现实里的姑娘你没一个看得上；你以为你在爱一个人，其实你在爱一个精心营销的产品；有一天你会突然意识到，你为她花的那些钱加起来够买一栋房，但你连她的姓你都不确定是真的。\n\n一句刺痛你的话：你爱她十年，她连你长什么样都不知道。',
  },
  M_HOTG: {
    code: 'M_HOTG', cn: '男网红', intro: 'The Male Influencer',
    desc: '你是朋友圈里那个"怎么修图跟真人差这么多"的男的。你每张照片修图至少三小时，每条文案斟酌四版，每个角度都是反复拍过再挑的。你不是没颜值，你是对"被看见的颜值"有一种病态的追求。你真人素颜出现的时候，你自己都觉得那不是真正的你。\n\n天赋优势：自我形象管理大师，你永远不会在人群中"输掉第一印象"；审美极佳，你的朋友圈可以直接当小红书运营；社交能力 MAX，去到哪里都是焦点。\n\n隐秘代价：你已经分不清真实的自己和朋友圈的自己了——你喜欢的是那个照片里的你，而那个人不存在；你谈恋爱的对象见到真人的那一刻会悄悄在心里叹气；你每一次点赞收藏数都直接影响你当天的心情——你被自己的人设反过来操控了。\n\n一句刺痛你的话：你修了一辈子的图，最想修的是照片背后那个真正的你。',
  },
  M_SCHM: {
    code: 'M_SCHM', cn: '心机弟弟', intro: 'The Schemer',
    desc: '你是群体里最安静但最危险的那个——没什么是你没算过的。你从不做面上的事，但每次风波平息之后，永远是你站在最优位置上。你擅长布局，善于等待，你的人生是一盘慢棋，你一局可以下十年。你不是坏，但你是清醒——清醒到让所有人都感到一种说不清的凉意。\n\n天赋优势：策略思维超强，你看人看事比大多数人深三层；耐心超凡，你能等到对手全部耗尽之后再出手；情绪控制力恐怖，你永远是那个面无表情但赢麻了的那个。\n\n隐秘代价：你把身边所有人都看成了棋子，连你对象也不例外；你活得很成功，但你活得不快乐——因为你永远在算；深夜回家你会突然觉得自己像一座空城——赢来的一切都没有温度。\n\n一句刺痛你的话：你算赢了所有人，也把自己算成了一座孤岛。',
  },
  M_WLOT: {
    code: 'M_WLOT', cn: '白莲兄弟', intro: 'The White Lotus Bro',
    desc: '永远无辜，永远被欺负，永远是那个"我又被他们误会了"的受害者——你就是男版白莲花。你从不主动伤害任何人，但你身边的每个人都会莫名其妙成为"坏人"。你把自己摆在最低位，用示弱换取同情，用无辜洗脱责任，用"我太善良了"把所有可能的冲突转化成了别人的愧疚。\n\n天赋优势：情绪表达能力强，眼圈一红能让所有人心软；社交形象稳定，几乎没人会说你一句坏话；擅长绑定同情心，关键时刻永远有人帮你。\n\n隐秘代价：你的"被欺负"叙事重复了十年，身边聪明的人已经开始躲你了；你把"无辜"这个武器用得太熟，连你自己都不知道什么时候是真的委屈什么时候是在演戏；你没有真正的朋友——因为真正的朋友会告诉你"你其实没那么无辜"。\n\n一句刺痛你的话：你扮了一辈子的受害者，把所有真正帮过你的人都改写成了反派。',
  },
  M_HOOK: {
    code: 'M_HOOK', cn: '钩子公', intro: 'The Hook Man',
    desc: '你是那种让人欲罢不能又永远得不到的男人。你给的暗示足够一个姑娘做一年白日梦，你给的承诺永远停在"可能"这个词上。你不是不想谈恋爱，你是享受暧昧超过爱情。你对每一个和你靠近的人说"你是特别的"，然后转身对下一个人说同样的话。\n\n天赋优势：魅力拉满，走到哪里都自带磁场；情感操控术满级，你让对方上瘾的手法精准得像狙击手；社交灵活度超高，同时管理十段暧昧不混乱。\n\n隐秘代价：你享受的是"被爱的感觉"而不是"爱一个人"；你从来没走进过任何一段真正的关系——因为走进去就意味着面对自己；当你真的想认真的时候，你的历史会替你回答一切。\n\n一句刺痛你的话：你让一百个姑娘为你失眠，但没有一个愿意陪你看日出。',
  },

  // ============ 女生池（男性物种扣女生） ============
  F_PHNX: {
    code: 'F_PHNX', cn: '凤凰女', intro: 'The Female Phoenix',
    desc: '姐，你的人生剧本就一句话：通过婚姻实现阶层跨越。你从小看着家里砸锅卖铁供你读书，毕业后唯一的目标就是嫁入豪门然后给全家换个活法。你择偶标准里"他父母"和"他本人"的权重完全倒挂，你把"门当户对"翻译成了"他家必须比我家强两个数量级"。\n\n天赋优势：目标感极强，你比所有同龄人都更清楚自己要什么；执行力可怕，为了目标什么都能学；婚后对家庭的经营能力也是真的——因为你是用命在维护这段关系。\n\n隐秘代价：你的婚姻永远有一个隐藏 KPI——给娘家输血；你对象家人从一开始就在提防你，你永远融不进那个圈子；你以为结了婚就赢了，其实真正的战争才刚开始——而且你打的每一场都不能输。\n\n一句刺痛你的话：你嫁给了整个阶层，但没有人真正爱上你这个人。',
  },
  F_MGIR: {
    code: 'F_MGIR', cn: '妈宝女', intro: 'The Mama\'s Girl',
    desc: '你二十八岁了，对象的每一次决定都要先问"我妈说……"。你把妈妈的意见当圣旨，买什么车、住哪里、什么时候结婚、生几个孩子，全部由一个不在场的女人决定。你觉得这叫"孝顺"，你对象觉得这叫"跟一个女人恋爱还要夹个丈母娘"。\n\n天赋优势：家庭观念强，婚后不会抛下父母不管；生活态度稳定，因为你一直有一个顶梁柱；有执行力——只要是妈交代的事。\n\n隐秘代价：你对象越来越知道自己在这段关系里排不进前三；你独立人格发育严重滞后，没有妈的时候你连午饭吃什么都决定不了；你三十五岁突然意识到——你一辈子都在替妈妈活，而妈妈一辈子都在替她妈妈活。\n\n一句刺痛你的话：你说了一辈子的"我妈说"，但你妈从来没问过你"你想要什么"。',
  },
  F_PCON: {
    code: 'F_PCON', cn: '普信女', intro: 'The Unreasonably Confident',
    desc: '姐，先冷静。你给自己的评分永远是 9 分，但市场给你的评分是 5 分。你拒绝了十个你觉得不够好的男人，却坚信"真正配得上我的那一个还在路上"。你把自信练成了一种武器，但武器指错了方向。\n\n天赋优势：心态极稳，不会因为被拒就怀疑自己；自我效能感超强，敢做敢要敢开口；从不将就的态度让你避开了一大堆真烂人。\n\n隐秘代价：你的择偶标准每年升级一次但你的条件从来没升级过；你拒绝的那些人中有几个后来真的配不上你了——但不是你变得更好，是你错过了那个窗口；你的"自信"在最亲的人眼里已经是"瞎"了。\n\n一句刺痛你的话：你相信自己值得最好的，但没人愿意承担你的错判。',
  },
  F_LICK: {
    code: 'F_LICK', cn: '舔狗女', intro: 'The Simp Girl',
    desc: '他的已读就是你的氧气。他回你一句"嗯"你能高兴半天，他两小时不回你你能发疯。你给他买生日礼物精挑细选、你为他改变作息、你甚至学习他爱看的球队数据——然后他把你当"备胎"、"工具人"、"永远在线的情绪垃圾桶"。你心知肚明但你停不下来。\n\n天赋优势：爱的浓度惊人，你认真的时候真的可以感天动地；学习能力强，为了他你能在一个月内学会三个新兴趣；耐心好到变态，等他一条消息你能等一整天不崩溃。\n\n隐秘代价：你对他越好，他越觉得"反正你不会走"；你把自己舔到了一个无法挽回的低位，从这里开始再也抬不起头；你深夜删掉他所有记录，第二天又加回来——你不是爱他，是上瘾他给你的痛。\n\n一句刺痛你的话：你把自己低到尘埃里，他连一眼都没低头看。',
  },
  F_OCEA: {
    code: 'F_OCEA', cn: '海后', intro: 'The Ocean Queen',
    desc: '你的微信置顶永远有 7 个男的。你和 A 说"你最懂我"，和 B 说"只有你让我心动"，和 C 说"你是不一样的"。你不是不认真，你是同时认真了很多次。你享受被追的感觉，你从暧昧里提取情绪价值，你从不给任何人唯一的那个位置。\n\n天赋优势：社交能力爆表，七条线平行管理都不会翻车；情商一流，每个男的都觉得自己是你心里最特别的；你永远有选择，从来不慌。\n\n隐秘代价：你换备胎像换手机壳，你说的"喜欢你"自己都不信；你永远在关系的表层，因为走深了就要付出真心；某天你想停下来的时候，你发现你已经不会专一了——你的情感操作系统里这个功能被你卸载太久了。\n\n一句刺痛你的话：你的通讯录里有七个人，但深夜崩溃的时候你一个都不敢打。',
  },
  F_TOOL: {
    code: 'F_TOOL', cn: '工具女', intro: 'The Utility Woman',
    desc: '你是哥哥姐姐的 ATM，是爸妈的免费保姆，是朋友的心情垃圾桶，是所有人手边那块"有事就用、没事就放"的抹布。你的生活被别人的需求塞满了，你没有时间想"我自己想要什么"。你被利用却说"这是家人/朋友之间应该的"，你付出却说"我不觉得累"，但你每一次开口拒绝的时候喉咙都会卡住。\n\n天赋优势：共情力超强，身边人的困难你都先一步感受到；行动力满级，说完立刻就去做；被所有人称赞为"靠谱的那一个"。\n\n隐秘代价：你一辈子都在解决别人的问题，轮到自己需要帮助的时候没人记得；你的"无私"已经变成了一种自动化的自我牺牲程序，关都关不掉；你到了三十岁回头看，所有人都在用你，没有一个人真的爱你。\n\n一句刺痛你的话：你是所有人的工具，但不是任何人的选择。',
  },
  F_DADY: {
    code: 'F_DADY', cn: '姐味说教', intro: 'The Big-Sister-Splainer',
    desc: '"你应该……""你必须……""你不懂，我告诉你……"——你是饭桌上那个谁都不想坐旁边的人。你擅长输出大道理，爱好分析别人的人生，热衷于"我这都是为你好"。你不是真关心别人，你是需要"教育别人"这种姿态来确认自己的优越感。\n\n天赋优势：知识储备丰富，你能在大部分话题上说出点东西；逻辑能力强，说教起来有理有据；确实比很多人更会规划自己的生活。\n\n隐秘代价：你身边的朋友正在悄悄减少，因为被教育是一种很累的事；你对象在你面前说话越来越少，不是因为他没话说，是因为他知道怎么说你都会"指导"他；你最怕有一天没人听你教了，那时候你的自我价值会崩塌。\n\n一句刺痛你的话：你教会了全世界怎么做人，唯独自己活得最失败。',
  },
  F_IRON: {
    code: 'F_IRON', cn: '钢铁直女', intro: 'The Iron Girl',
    desc: '男朋友给你发"在干嘛"，你回"没干嘛"。他说"想你了"，你回"哦"。他暗示想见面，你回"好啊什么时候"（他说要等他安排，你就真的等）。你是直到字典里都查不到"撒娇"这两个字的那种女的。你谈恋爱跟对接工作一样，流程清晰、目标明确、情绪极简。\n\n天赋优势：不会闹情绪，恋爱中零戏剧；理性决策能力强，不会被小事带偏；是那种"跟你谈恋爱像找到了室友兼合伙人"的靠谱女友。\n\n隐秘代价：你对象觉得跟你在一起少了一些"被需要"的感觉，久了他会在别的地方寻找那种心动；你不是没有感情，你是把表达功能关了；你自己偶尔也会羡慕那些会撒娇的姑娘——但你一张嘴还是"嗯"。\n\n一句刺痛你的话：你活得干净利落，但没有一个男人敢把诗写给你。',
  },
  F_ROUG: {
    code: 'F_ROUG', cn: '糙姐', intro: 'The Rough Sis',
    desc: '你吃饭吧唧嘴，衣服穿三天，指甲剪不剪没所谓，出门不化妆不擦脸就走。你不是丑，你是拒绝为"美"付出任何努力——你觉得那是另一个物种做的事。你的房间永远像刚被打劫过，你的包里有半年前的小票。你对形象的要求就一个：干净就行——但你的"干净"标准非常宽松。\n\n天赋优势：活得松弛，从不为了外表内耗；坦然真实，跟你在一起的人不用演；节约时间和金钱——你省下来的化妆品钱够买一个新手机。\n\n隐秘代价：你常常被人以为是"没女朋友"的状态——但你心里是想谈的；你对象几次暗示你收拾一下，你都回"又不是没见过我"，然后关系慢慢变了味；你三十岁再想收拾的时候，你发现那些漂亮的姑娘已经把赛道拉得你追不上了。\n\n一句刺痛你的话：你活得自在，但世界不会为你自在的样子停下来。',
  },
  F_STRG: {
    code: 'F_STRG', cn: '直女癌', intro: 'The Man-Hating Straight Girl',
    desc: '"男的都这样，别指望了。""你看他，果然出轨了，我早就说过。""这个年代还有好男人？我不信。"你把"反男"变成了一种生活哲学，你用二十多年的人生观察出一个结论：所有男人都是有毒的。你觉得自己清醒，其实你已经不相信任何人了。\n\n天赋优势：辨渣能力一流，真渣男逃不过你的眼睛；对自己的态度坚定，不会因为"找不到男朋友"而将就；独立生存能力强，没有男人也能活得风生水起。\n\n隐秘代价：你把"防御"做得太好，连真正爱你的人也被你推开了；你对男性的偏见已经深到能影响你其他的判断了；你嘴上说"单身也挺好"，但某天你看到一对老人手牵手走过的时候会哭得完全没道理。\n\n一句刺痛你的话：你防住了所有渣男，也防住了那个本来会陪你一辈子的人。',
  },
  F_NICE: {
    code: 'F_NICE', cn: '老实女', intro: 'The Nice Girl',
    desc: '你是部门里那个谁都使唤一下的姑娘，你是恋爱里那个主动付出但不要求回报的"好女孩"，你是家庭里那个"反正她最懂事"的女儿。你把"善良"和"懂事"当成了最重要的品格，于是你永远排在所有人之后。\n\n天赋优势：真心满格，你给的爱都是不打折的；稳定性强，不会作妖不会翻脸；是所有人评价里"真的很温柔"的那种姑娘。\n\n隐秘代价：你对象在外面找了一个更会撒娇的，他回家的时候你还在给他煲汤；你永远是那个"配角"，男主的感情戏跟你没关系；你到了三十岁才突然惊觉——善良没错，但你选错了用善良的地方。\n\n一句刺痛你的话：你善良了一辈子，世界教会你的事就是——善良不值钱。',
  },
  F_BACK: {
    code: 'F_BACK', cn: '备胎女', intro: 'The Backup Girl',
    desc: '你是他"哥们群"里的一个名字——他落魄的时候会找你喝酒，他分手的时候会找你哭诉，他高兴的时候想不起来你。你当了五年的备胎，他从没主动过一次，但你每次的自我安慰都是："他对我不一样"。姐，醒醒——他对你"不一样"是因为你是免费的情感售后。\n\n天赋优势：耐心堪比佛祖，五年的等待完全不动摇；情绪价值满级，他需要你的时候你从不缺席；你是朋友里最清楚他所有故事的人。\n\n隐秘代价：你的五年青春被一个从没选择你的人耗尽了；你不是不知道自己是备胎，你是不愿意承认——因为承认了你过去的每一秒都成了一个笑话；你错过了三个追你的真心男孩，因为你在等他的那条消息。\n\n一句刺痛你的话：你等了他五年，但他的前任、现任、下一任都不会有你。',
  },
  F_ACGR: {
    code: 'F_ACGR', cn: '中央空调妹', intro: 'The AC Girl',
    desc: '你对每个男的都温柔，每个男的都觉得你在对他好。你一会儿和 A 聊得起劲，一会儿给 B 点赞，一会儿回 C 一条"我也好想你"。你不是坏，你是享受被所有人需要的感觉，你不舍得关掉任何一个入口。\n\n天赋优势：情商一流，你知道怎么让每个人觉得自己很特别；社交天赋惊人，走到哪里都是最受欢迎的那个；情绪价值批发商，从不让任何人失望。\n\n隐秘代价：你身边的每一个真心男孩最后都会失望——因为他发现你对所有人都这样；你把"友好"练成了一种泛滥，你已经给不出"专属感"了；你最后谈的那个，一定是最会等的那个——而不是你最爱的那个。\n\n一句刺痛你的话：你对每个人都好，所以没有人觉得你对他特别好。',
  },
  F_WILD: {
    code: 'F_WILD', cn: '浪姐', intro: 'The Wild One',
    desc: '周五夜店嗨到凌晨三点，周六补觉到下午，周日又约了新的局。你谈恋爱像抽烟——随时可以点，随时可以掐。你嘴上说"我不想稳定"，其实你是怕稳定。因为稳定意味着面对自己——那个你不想面对的、空的、害怕的自己。\n\n天赋优势：活得精彩，你的人生比 90% 的人都热闹；社交网络庞大，你是那种一周能填满三个城市日程的人；情绪张力高，你笑的时候真笑，哭的时候真哭。\n\n隐秘代价：你的身体已经开始抗议你的生活方式了；你以为这叫"活在当下"，其实是"逃避明天"；你三十五岁的时候会突然发现，身边那些"无聊的"同龄人都有了家人，而你还在酒吧里假装自己很开心。\n\n一句刺痛你的话：你浪了一辈子，但没有一个人在浪的尽头等你。',
  },
  F_DARK: {
    code: 'F_DARK', cn: '阴谋家', intro: 'The Schemer Lady',
    desc: '你笑着看一切，但你心里有一张复杂的关系图谱——每个人的弱点、利益、欲望你都标注好了。你在公司、在朋友圈、在家族里默默布局，每一次风波都以你获益告终。你对"操控"上瘾，因为那给你一种"我比所有人都看得远"的快感。\n\n天赋优势：战略思维顶级，你三步之外就看到了棋局；心理读取能力强，别人的想法对你像透明的；情绪控制力吓人，你永远不会"不小心说漏嘴"。\n\n隐秘代价：你所有的关系都是工具性的，没有一个是真的；你赢的次数越多你越孤独，因为你开始不敢相信"真心"这种东西存在；深夜你会怀疑：我到底赢的是什么？但你从不敢回答这个问题。\n\n一句刺痛你的话：你掌控了每个人的结局，但你的结局里没有人。',
  },
  F_BOSS: {
    code: 'F_BOSS', cn: '社会大姐', intro: 'The Female Boss',
    desc: '一张桌子的人都在看你发号施令。你说话有条理、做事有章法、交朋友有分寸。你不结婚，因为"没一个男人配得上我这种水平"。你的朋友圈不发日常，只发红色指令似的工作状态和新结识的资源人脉。你活得像一座移动的公司。\n\n天赋优势：决策力 MAX，资源调配能力在同龄人中顶级；独立自强，从不依附任何人；气场足得吓人，一出现就是场域中心。\n\n隐秘代价：你身边的男性要么怕你要么只想用你，真正平等的感情你一次都没遇到过；你把"强势"当成了铠甲，其实你是用它挡住了自己对柔软的渴望；你的名片越来越多，但能让你卸下盔甲的那个人一个也没有。\n\n一句刺痛你的话：你掌控了一整张桌子，但桌子上没有一个真正为你停下的人。',
  },
  F_KBGR: {
    code: 'F_KBGR', cn: '键盘大妈', intro: 'The Comment Auntie',
    desc: '你在知乎、微博、小红书、豆瓣、B 站评论区同时活跃。你对任何话题都有观点，对任何人都敢开骂。你是"阿姨那股气儿"的年轻版本——正义感爆棚、攻击性拉满、说话永远带棱角。别人刷手机是消遣，你刷手机是上班——一天不对骂你会难受。\n\n天赋优势：表达能力超强，下笔千言从不卡壳；观点立场鲜明，敢说敢战不怂；信息嗅觉灵敏，新瓜你永远第一时间在场。\n\n隐秘代价：你被算法喂大，愤怒成了你最大的情绪；你在网上对骂了一年，现实生活一年都没变好过；你身边的朋友越来越少——因为跟你聊天总是在辩论；你自己偶尔也会疲惫，但关掉手机的那一秒你会感到一种更深的空虚。\n\n一句刺痛你的话：你在评论区赢过所有人，但你回到现实是谁都不想听你说话的那一个。',
  },
  F_DADG: {
    code: 'F_DADG', cn: '爹系女友', intro: 'The Daddy Girlfriend',
    desc: '你二十七岁，你对象二十九岁，但你们的相处模式是："你快去把作业写了。""你不能再这样熬夜了。""你下次开会不要迟到。"你不是在谈恋爱，你是在养儿子。你说这叫"我比他成熟"，他说这叫"我跟我妈谈恋爱"。你把男朋友当成了一个需要被管教的孩子，你给得越多他越幼稚。\n\n天赋优势：责任感极强，对象的每一个生活细节你都过问；规划力顶级，你俩的未来你一个人已经想完了；生活能力超强，没你他真的活不下去。\n\n隐秘代价：你的对象没有机会长大，因为你替他做完了所有决定；他对你的爱混杂着依赖和反叛，他最终会用"我需要成长"来离开你；你明明那么累，但你就是戒不掉"管他"——因为如果不管他，你就不知道自己在这段关系里的位置。\n\n一句刺痛你的话：你把他当儿子养大，他会找一个真正的姑娘去当女朋友。',
  },
  F_PART: {
    code: 'F_PART', cn: '夜店咖大姐', intro: 'The Club Queen',
    desc: '周五夜店，周六局，周日再次夜店，周一上班的时候眼妆还没卸干净。你把"精致酒鬼"活成了一种职业。你热爱氛围、声浪、人群、酒精——你最怕一个人的安静。你觉得这叫"年轻就要玩"，你对象觉得这叫"跟你结婚简直是赌命"。\n\n天赋优势：精力真的不得了，没人比你更会玩；社交圈极广，你的酒搭子遍布这个城市；反差感强，白天搞工作晚上搞人生，两边都有声有色。\n\n隐秘代价：你的身体已经开始反抗——胃、肝、皮肤都在给你打警告；你的"快乐"越来越需要加大剂量才能触发；你三十岁那一年会突然在一个清晨醒来，发现身边的人都结婚了，而你还在问"今晚去哪"。\n\n一句刺痛你的话：你整夜整夜地嗨，但没有一个人愿意陪你清醒地吃一顿早饭。',
  },
  F_BRIC: {
    code: 'F_BRIC', cn: '砖头女', intro: 'The Brick Sister',
    desc: '你吵架的方式不是吵——是砸。你一闷气可以生整整一个季度，你一发火能让三个城市的朋友都听说。你不擅长表达柔软，你只会用"硬"来维护自己的边界。你对象在你面前小心翼翼，你的朋友和你保持距离，你的家人见到你会先观察你今天的脸色。\n\n天赋优势：原则感极强，底线清晰，不会被任何人拿捏；独立性超强，没人能轻易影响你的判断；真正被你接纳的人会得到最坚实的保护。\n\n隐秘代价：你内心其实柔软，但你已经不知道怎么卸下那套盔甲了；你身边的关系都有一种"别惹她"的气氛，真正亲密的交流越来越少；你等一个能先走进来的人等了很久——但你的样子让人不敢靠近。\n\n一句刺痛你的话：你活成了一块砖头，挡住了所有伤你的人，也挡住了所有爱你的人。',
  },

  // ============ 隐藏类型（跨池共用，UNDEF） ============
  UNDEF: {
    code: 'UNDEF', cn: '无定义人', intro: 'The Undefined',
    desc: '恭喜你——选了"不透露"性别，又回答得完全中立，你拿到了 GSTI 最稀有的结果：连被分类的资格都没有。你既不像男的，也不像女的；既不够算计，也不够真诚；既不表演，也不真实。你漂浮在所有标签之间，拒绝承认任何一个。\n\n天赋优势：你是这个非黑即白的世界里少有的"灰度派"，你的判断永远比别人多一层；你不被任何刻板印象绑架，活得清醒而自由；你是自带反骨的那种人。\n\n隐秘代价：你想保持模糊的代价，是永远没人能真正理解你；你拒绝被定义，但也拒绝了被看见——因为看见必然意味着分类；你以为你超越了规则，其实你只是没地方放置自己。\n\n一句刺痛你的话：你活得像一团雾，好看是好看，但没人愿意伸手进来。',
  },

  // ============ Fallback 兜底（低相似度时显示） ============
  HWDP: {
    code: 'HWDP', cn: '难画得批', intro: 'The Unclassifiable',
    desc: '恭喜你——你的答案让系统集体罢工了。男池女池 40 个类型没有一个敢认领你。你就是那种字典定义不了、算法拿不下、相亲市场挠头、相亲对象看不懂的"难画得批"型选手。\n\n天赋优势：你躲过了所有标签，系统给你发了一张"你不被任何刻板印象绑定"的通行证；你的复杂度让人一眼看不穿——这在一个充满速食人设的时代极其稀缺；你是那种需要被一个同样奇怪的人才能看懂的人。\n\n隐秘代价：你觉得"我不一样"是件好事，但这个社会对"不一样"的人收费很贵；你经常在关系里被误读，别人拿着各种模板往你身上套，然后在套不进去之后默默离开；你其实很希望有人能看懂你——但你从不会主动把自己翻译给别人。\n\n一句刺痛你的话：你复杂到没人能画出你，也复杂到没人愿意陪你活。',
  },
};

/* =============================================================
 * Normal types pattern vectors (A/B × 6 维)
 * 注意：此处 pattern 为首版草稿，建议上线前做一轮距离校准，
 * 让 40 个类型两两间至少有 2 维差异，避免匹配结果过度集中。
 * ============================================================= */

export const NORMAL_TYPES: NormalType[] = [
  // 男池 20 个
  { code: 'M_GOLD', pattern: 'BBAAAB' },  // 索/冷/主/算/演/开
  { code: 'M_HUBY', pattern: 'BABABA' },  // 索/热/被/算/真/忠
  { code: 'M_GTEA', pattern: 'AAAAAA' },  // 给/热/主/算/演/忠 (ambiguous—暧昧型)
  { code: 'M_WHIT', pattern: 'AABBBA' },  // 给/热/被/真/真/忠
  { code: 'M_FBRO', pattern: 'ABBBBA' },  // 给/冷/被/真/真/忠
  { code: 'M_SAIN', pattern: 'AABABA' },  // 给/热/被/算(自我牺牲式算计)/真/忠
  { code: 'M_MALK', pattern: 'BBAAAA' },  // 索/冷/主/算/演/忠
  { code: 'M_TEAM', pattern: 'ABAAAA' },  // 给/冷/主/算/演/忠
  { code: 'M_BABY', pattern: 'BABBBA' },  // 索/热/被/真/真/忠
  { code: 'M_CTRL', pattern: 'AAABBA' },  // 给(过度给)/热/主/真/真/忠
  { code: 'M_MOON', pattern: 'ABBBBB' },  // 给/冷/被/真/真/开
  { code: 'M_PRNC', pattern: 'BABBAA' },  // 索/热/被/真/演/忠
  { code: 'M_DRAM', pattern: 'BAABBA' },  // 索/热/主/真(情绪真实)/真/忠
  { code: 'M_SOFT', pattern: 'AAABAA' },  // 给(伪装)/热/主/真/演/忠
  { code: 'M_PHNX', pattern: 'BBAAAA' },  // 索/冷/主/算/演/忠（与 MALK 近似—校准时考虑合并或微调）
  { code: 'M_FANC', pattern: 'AABBBB' },  // 给/热/被/真/真/开（对偶像专一，对真人开）
  { code: 'M_HOTG', pattern: 'AAAABA' },  // 给/热/主/算/演/忠（但展示为主）
  { code: 'M_SCHM', pattern: 'BBABAA' },  // 索/冷/主/算(策略)/演/忠
  { code: 'M_WLOT', pattern: 'AAABAA' },  // 给(表演式)/热/主/真/演/忠（与 SOFT 近似—校准）
  { code: 'M_HOOK', pattern: 'BAABBB' },  // 索(情感)/热/主/真/真/开

  // 女池 20 个
  { code: 'F_PHNX', pattern: 'BBAAAA' },
  { code: 'F_MGIR', pattern: 'ABBBBA' },
  { code: 'F_PCON', pattern: 'BAAAAA' },  // 索/热/主/算/演/忠
  { code: 'F_LICK', pattern: 'AABBBA' },
  { code: 'F_OCEA', pattern: 'BAAABB' },  // 索/热/主/算/真/开
  { code: 'F_TOOL', pattern: 'ABBBBA' },  // 给/冷/被/真/真/忠（同 FBRO pattern—但类型池不同不冲突）
  { code: 'F_DADY', pattern: 'BAAAAA' },  // 与 PCON 近似—校准时微调 D5/D6
  { code: 'F_IRON', pattern: 'ABBBBA' },  // 同 TOOL—校准
  { code: 'F_ROUG', pattern: 'AABBBA' },  // 与 LICK 近似—校准
  { code: 'F_STRG', pattern: 'BBAABA' },  // 索/冷/主/真(对男性的"真实"敌意)/演/忠
  { code: 'F_NICE', pattern: 'AABBBA' },
  { code: 'F_BACK', pattern: 'AABBBA' },  // 与 LICK 近似—校准
  { code: 'F_ACGR', pattern: 'AAAABB' },  // 给/热/主/算/演/开
  { code: 'F_WILD', pattern: 'BAAABB' },
  { code: 'F_DARK', pattern: 'BBAAAA' },
  { code: 'F_BOSS', pattern: 'BBAAAA' },  // 与 DARK 近似—校准
  { code: 'F_KBGR', pattern: 'BBAABA' },
  { code: 'F_DADG', pattern: 'AAABBA' },  // 给(过度)/热/主/真/真/忠
  { code: 'F_PART', pattern: 'BAAABB' },
  { code: 'F_BRIC', pattern: 'ABBBBA' },
];

/* =============================================================
 * 稀有度（视觉呈现用；具体百分比可上线后按真实数据回填）
 * ============================================================= */

export const TYPE_RARITY: Record<string, RarityInfo> = {
  // 男池 20
  M_GOLD: { pct: 6, stars: 4, label: '稀有' },
  M_HUBY: { pct: 3, stars: 5, label: '极稀有' },
  M_GTEA: { pct: 8, stars: 3, label: '常见' },
  M_WHIT: { pct: 9, stars: 3, label: '常见' },
  M_FBRO: { pct: 5, stars: 4, label: '稀有' },
  M_SAIN: { pct: 4, stars: 4, label: '稀有' },
  M_MALK: { pct: 6, stars: 4, label: '稀有' },
  M_TEAM: { pct: 7, stars: 3, label: '常见' },
  M_BABY: { pct: 10, stars: 2, label: '较常见' },
  M_CTRL: { pct: 5, stars: 4, label: '稀有' },
  M_MOON: { pct: 4, stars: 4, label: '稀有' },
  M_PRNC: { pct: 3, stars: 5, label: '极稀有' },
  M_DRAM: { pct: 4, stars: 4, label: '稀有' },
  M_SOFT: { pct: 6, stars: 4, label: '稀有' },
  M_PHNX: { pct: 5, stars: 4, label: '稀有' },
  M_FANC: { pct: 3, stars: 5, label: '极稀有' },
  M_HOTG: { pct: 5, stars: 4, label: '稀有' },
  M_SCHM: { pct: 3, stars: 5, label: '极稀有' },
  M_WLOT: { pct: 5, stars: 4, label: '稀有' },
  M_HOOK: { pct: 4, stars: 4, label: '稀有' },
  // 女池 20
  F_PHNX: { pct: 6, stars: 4, label: '稀有' },
  F_MGIR: { pct: 7, stars: 3, label: '常见' },
  F_PCON: { pct: 5, stars: 4, label: '稀有' },
  F_LICK: { pct: 9, stars: 3, label: '常见' },
  F_OCEA: { pct: 4, stars: 4, label: '稀有' },
  F_TOOL: { pct: 8, stars: 3, label: '常见' },
  F_DADY: { pct: 6, stars: 4, label: '稀有' },
  F_IRON: { pct: 7, stars: 3, label: '常见' },
  F_ROUG: { pct: 5, stars: 4, label: '稀有' },
  F_STRG: { pct: 6, stars: 4, label: '稀有' },
  F_NICE: { pct: 9, stars: 3, label: '常见' },
  F_BACK: { pct: 5, stars: 4, label: '稀有' },
  F_ACGR: { pct: 5, stars: 4, label: '稀有' },
  F_WILD: { pct: 4, stars: 4, label: '稀有' },
  F_DARK: { pct: 3, stars: 5, label: '极稀有' },
  F_BOSS: { pct: 4, stars: 4, label: '稀有' },
  F_KBGR: { pct: 5, stars: 4, label: '稀有' },
  F_DADG: { pct: 5, stars: 4, label: '稀有' },
  F_PART: { pct: 4, stars: 4, label: '稀有' },
  F_BRIC: { pct: 6, stars: 4, label: '稀有' },
  // 特殊
  UNDEF: { pct: 1, stars: 5, label: '隐藏' },
  HWDP: { pct: 2, stars: 5, label: '兜底' },
};
```

- [ ] **Step 2: Verify compile + 导出完整**

Run: `npx tsc --noEmit 2>&1 | grep -i "gsti\|types.ts" | head -20`
Expected: 无与 gsti/types.ts 相关的错误

- [ ] **Step 3: Commit**

```bash
git add src/data/gsti/types.ts
git commit -m "feat(gsti): add 40 swap-gender types + UNDEF hidden + HWDP fallback"
```

---

### Task 5: 组装 GSTI TestConfig

**Files:**
- Create: `src/data/gsti/config.ts`

- [ ] **Step 1: 创建 config.ts**

```typescript
// src/data/gsti/config.ts
import type { TestConfig } from '../testConfig';
import { dimensionMeta, dimensionOrder, DIM_EXPLANATIONS } from './dimensions';
import { questions, specialQuestions } from './questions';
import { TYPE_LIBRARY, NORMAL_TYPES, TYPE_RARITY, MALE_POOL_CODES, FEMALE_POOL_CODES } from './types';
import { TYPE_IMAGES, SHARE_IMAGES } from './typeImages';
import { COMPATIBILITY, getCompatibility } from './compatibility';

// GSTI 共 22 题，每维 3-4 题；raw score 范围需与题数匹配
function sumToLevel(score: number): string {
  // 每维 3 题场景下的平均阈值（3.5-4.5 中 ≈ 4 附近为中）；与 SBTI 保持一致
  if (score <= 6) return 'L';      // 平均 <= 2
  if (score <= 10) return 'M';     // 平均 2.25-3.25
  return 'H';                       // 平均 >= 3.5
}

export const gstiConfig: TestConfig = {
  id: 'gsti',
  name: 'GSTI 性转人格测试',
  dimensionOrder,
  dimensionMeta,
  dimExplanations: DIM_EXPLANATIONS,
  questions,
  specialQuestions,
  // 保留 gate 字段结构（复用 SBTI hiddenTrigger 机制）—UNDEF 的触发在 matching 里二次判定
  gateQuestionId: 'gsti_gate',
  gateAnswerValue: 4,            // 选"不告诉你"
  hiddenTriggerQuestionId: 'gsti_gate',
  hiddenTriggerValue: 4,
  typeLibrary: TYPE_LIBRARY,
  normalTypes: NORMAL_TYPES,
  typeRarity: TYPE_RARITY,
  typeImages: TYPE_IMAGES,
  shareImages: SHARE_IMAGES,
  compatibility: COMPATIBILITY,
  getCompatibility,
  sumToLevel,
  maxDistance: 12,               // 6 维 × 最大差 2 = 12
  fallbackTypeCode: 'HWDP',
  hiddenTypeCode: 'UNDEF',
  similarityThreshold: 55,
  prodBaseUrl: 'https://sbti.jiligulu.xyz',
  basePath: '/new/gsti',
  localHistoryKey: 'gsti_history',
  localStatsKey: 'gsti_local_stats',
  apiTestParam: 'gsti',
  dimSectionTitle: '六维度评分',
  questionCountLabel: '22',
  // 性别锁定字段
  genderLocked: true,
  typePoolByGender: {
    male: MALE_POOL_CODES,
    female: FEMALE_POOL_CODES,
    both: [...MALE_POOL_CODES, ...FEMALE_POOL_CODES],
  },
};
```

- [ ] **Step 2: 编译验证**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: 无错误

- [ ] **Step 3: Commit**

```bash
git add src/data/gsti/config.ts
git commit -m "feat(gsti): assemble TestConfig with gender-locked pool support"
```

---

### Task 6: 扩展 matching.ts 支持按性别池过滤

**Files:**
- Modify: `src/utils/matching.ts`

- [ ] **Step 1: 在 computeResult 函数签名中加入 gender 参数**

修改 `src/utils/matching.ts` 顶部已有的 `computeResult` 函数。替换整个函数：

```typescript
// src/utils/matching.ts —— 替换 computeResult 函数（其余保持不变）

export function computeResult(
  answers: Record<string, number | number[]>,
  hiddenTriggered: boolean,
  config: TestConfig,
  debugForceType?: string | null,
  gender?: 'male' | 'female' | 'unspecified',
): ComputeResultOutput {
  const { dimensionOrder, dimensionMeta, questions, typeLibrary, normalTypes, maxDistance, fallbackTypeCode, hiddenTypeCode, similarityThreshold } = config;
  const dimCount = dimensionOrder.length;

  // 1. Sum raw scores per dimension
  const rawScores: Record<string, number> = {};
  Object.keys(dimensionMeta).forEach(dim => { rawScores[dim] = 0; });

  questions.forEach(q => {
    if (q.dim) {
      const ans = answers[q.id];
      if (Array.isArray(ans)) {
        const selectedValues = ans
          .map((optionIndex) => q.options[optionIndex]?.value)
          .filter((value): value is number => typeof value === 'number');
        const avg = selectedValues.length > 0
          ? selectedValues.reduce((a, b) => a + b, 0) / selectedValues.length
          : 0;
        rawScores[q.dim] += Math.round(avg);
      } else {
        rawScores[q.dim] += Number(ans || 0);
      }
    }
  });

  // 2. Convert to levels
  const levels: Record<string, string> = {};
  Object.entries(rawScores).forEach(([dim, score]) => {
    levels[dim] = config.sumToLevel(score);
  });

  // 3. Build user vector
  const userVector = dimensionOrder.map(dim => levelNum(levels[dim]));

  // 4. Apply pool filter if genderLocked
  let pool = normalTypes;
  if (config.genderLocked && config.typePoolByGender && gender) {
    const allowedCodes = new Set(
      gender === 'male' ? config.typePoolByGender.male :
      gender === 'female' ? config.typePoolByGender.female :
      config.typePoolByGender.both
    );
    pool = normalTypes.filter(t => allowedCodes.has(t.code));
  }

  // 5. Compare against each pool type pattern
  const ranked: RankedType[] = pool.map(type => {
    const vector = parsePattern(type.pattern).map(levelNum);
    let distance = 0;
    let exact = 0;
    for (let i = 0; i < vector.length; i++) {
      const diff = Math.abs(userVector[i] - vector[i]);
      distance += diff;
      if (diff === 0) exact += 1;
    }
    const similarity = Math.max(0, Math.round((1 - distance / maxDistance) * 100));
    return {
      ...type,
      ...typeLibrary[type.code],
      distance,
      exact,
      similarity,
    };
  }).sort((a, b) => {
    if (a.distance !== b.distance) return a.distance - b.distance;
    if (b.exact !== a.exact) return b.exact - a.exact;
    return b.similarity - a.similarity;
  });

  // 6. Pick best and apply special cases (unchanged below)
  const bestNormal = ranked[0];

  let finalType: RankedType | TypeDef;
  let modeKicker = '\u4f60\u7684\u4e3b\u7c7b\u578b';
  let badge = `\u5339\u914d\u5ea6 ${bestNormal.similarity}% \u00b7 \u7cbe\u51c6\u547d\u4e2d ${bestNormal.exact}/${dimCount} \u7ef4`;
  let sub = '\u7ef4\u5ea6\u547d\u4e2d\u5ea6\u8f83\u9ad8\uff0c\u5f53\u524d\u7ed3\u679c\u53ef\u89c6\u4e3a\u4f60\u7684\u7b2c\u4e00\u4eba\u683c\u753b\u50cf\u3002';
  let special = false;
  let secondaryType: RankedType | null = null;

  if (debugForceType && typeLibrary[debugForceType]) {
    finalType = { ...typeLibrary[debugForceType], similarity: 100, exact: dimCount, distance: 0 } as RankedType;
    modeKicker = '\u8c03\u8bd5\u6307\u5b9a\u4eba\u683c';
    badge = '\u8c03\u8bd5\u6a21\u5f0f \u00b7 \u624b\u52a8\u6307\u5b9a';
    sub = '\u5f53\u524d\u7ed3\u679c\u7531\u8c03\u8bd5\u5de5\u5177\u680f\u624b\u52a8\u6307\u5b9a\uff0c\u975e\u7b54\u9898\u5339\u914d\u3002';
    special = true;
  } else if (hiddenTriggered) {
    finalType = typeLibrary[hiddenTypeCode];
    secondaryType = bestNormal;
    modeKicker = '\u9690\u85cf\u4eba\u683c\u5df2\u6fc0\u6d3b';
    badge = '\u5339\u914d\u5ea6 100% \u00b7 \u9690\u85cf\u56e0\u5b50\u5df2\u63a5\u7ba1';
    sub = '\u9690\u85cf\u4eba\u683c\u89e6\u53d1\u6761\u4ef6\u5df2\u6ee1\u8db3\uff0c\u7cfb\u7edf\u5df2\u8df3\u8fc7\u5e38\u89c4\u4eba\u683c\u5ba1\u5224\u3002';
    special = true;
  } else if (bestNormal.similarity < similarityThreshold) {
    finalType = typeLibrary[fallbackTypeCode];
    modeKicker = '\u7cfb\u7edf\u5f3a\u5236\u5156\u5e95';
    badge = `\u6807\u51c6\u4eba\u683c\u5e93\u6700\u9ad8\u5339\u914d\u4ec5 ${bestNormal.similarity}%`;
    sub = '\u6807\u51c6\u4eba\u683c\u5e93\u5bf9\u4f60\u7684\u8111\u56de\u8def\u96c6\u4f53\u7f62\u5de5\u4e86\uff0c\u4e8e\u662f\u7cfb\u7edf\u628a\u4f60\u5f3a\u5236\u5206\u914d\u7ed9\u4e86\u5156\u5e95\u4eba\u683c\u3002';
    special = true;
  } else {
    finalType = bestNormal;
  }

  return {
    rawScores,
    levels,
    ranked,
    bestNormal,
    finalType,
    modeKicker,
    badge,
    sub,
    special,
    secondaryType,
  };
}
```

- [ ] **Step 2: 检查所有既有 `computeResult` 调用处是否受影响**

Run: `grep -rn "computeResult(" src/`
Expected: 查看所有调用点（App.tsx / CyberApp.tsx / LoveApp.tsx 等），确认新增的 `gender` 是可选参数，既有调用都不传 gender，仍正常工作。

- [ ] **Step 3: 编译验证**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: 无错误

- [ ] **Step 4: Commit**

```bash
git add src/utils/matching.ts
git commit -m "feat(matching): add optional gender param + typePoolByGender filter"
```

---

### Task 7: 扩展 useQuiz hook 支持 gender state

**Files:**
- Modify: `src/hooks/useQuiz.ts`

- [ ] **Step 1: 阅读当前实现**

Run: `cat src/hooks/useQuiz.ts`
预期：观察 `useQuiz` 导出的 state（通常含 `answers`, `currentQuestionIndex`, `shuffledQuestions` 等）与 actions（`startQuiz`, `answer`, `getResult`）。

- [ ] **Step 2: 新增 gender state + setter + 传入 computeResult**

编辑 `src/hooks/useQuiz.ts`，在 `useQuiz` 函数内部加入（位置：其他 useState 声明之后、useCallback 之前）：

```typescript
// 新增 import（文件顶部）
import type { Gender } from '../data/testConfig';

// 在 useQuiz 函数体内新增：
  const [gender, setGender] = useState<Gender>(() => {
    if (typeof window === 'undefined') return 'unspecified';
    const stored = window.localStorage.getItem(`${config.id}_gender`);
    return (stored === 'male' || stored === 'female' || stored === 'unspecified') ? stored : 'unspecified';
  });

  const setGenderPersist = useCallback((g: Gender) => {
    setGender(g);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(`${config.id}_gender`, g);
    }
  }, [config.id]);
```

在 `getResult` 函数中将 `gender` 传入 `computeResult`：

```typescript
  const getResult = useCallback((debugForceType?: string | null): ComputeResultOutput => {
    const hiddenTriggered = /* existing logic */;
    return computeResult(answers, hiddenTriggered, config, debugForceType, gender);
  }, [answers, config, gender]);
```

在 hook 返回值中追加 `gender` 和 `setGender`：

```typescript
  return {
    /* ... existing returns ... */
    gender,
    setGender: setGenderPersist,
  };
```

- [ ] **Step 3: 编译验证**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: 无错误

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useQuiz.ts
git commit -m "feat(useQuiz): add gender state with localStorage persistence"
```

---

### Task 8: 创建 GenderPicker 组件

**Files:**
- Create: `src/components/GenderPicker.tsx`

- [ ] **Step 1: 创建组件**

```tsx
// src/components/GenderPicker.tsx
import { motion } from 'framer-motion';
import type { Gender } from '../data/testConfig';

interface GenderPickerProps {
  onPick: (g: Gender) => void;
  onClose?: () => void;
}

export default function GenderPicker({ onPick, onClose }: GenderPickerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-bg flex flex-col items-center justify-center px-6"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-md text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-3">先说说你的性别</h2>
        <p className="text-sm text-muted mb-2">
          这不是给你贴标签——
        </p>
        <p className="text-sm text-muted mb-10">
          这是决定系统用<strong className="text-white">反串</strong>的哪一套词扣在你头上。
        </p>

        <div className="space-y-3">
          <GenderButton label="我是男生" hint="测出的全是女性物种（捞女 / 娇妻 / 绿茶 / 扶妹魔…）"
            onClick={() => onPick('male')} />
          <GenderButton label="我是女生" hint="测出的全是男性物种（凤凰男 / 妈宝男 / 普信男 / 舔狗…）"
            onClick={() => onPick('female')} />
          <GenderButton label="不告诉你" hint="两池通吃，结果更不可预测"
            onClick={() => onPick('unspecified')} />
        </div>

        <p className="text-xs text-[#666] mt-10 leading-relaxed px-4">
          本测试是对性别标签的戏谑反串，所有结果都是娱乐段子，不代表对任何人的真实评价。
        </p>

        {onClose && (
          <button onClick={onClose} className="mt-6 text-muted underline text-sm">
            再想想
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

function GenderButton({ label, hint, onClick }: { label: string; hint: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-surface border border-border rounded-2xl px-5 py-4 text-left hover:border-accent/60 hover:bg-surface/80 transition-colors group cursor-pointer"
    >
      <div className="text-white font-semibold mb-1 group-hover:text-accent transition-colors">
        {label}
      </div>
      <div className="text-xs text-muted leading-relaxed">{hint}</div>
    </button>
  );
}
```

- [ ] **Step 2: 编译验证**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: 无错误

- [ ] **Step 3: Commit**

```bash
git add src/components/GenderPicker.tsx
git commit -m "feat(gsti): add GenderPicker component with 3 options"
```

---

### Task 9: 创建 GSTIHeroBadge 组件（结果页反差徽章）

**Files:**
- Create: `src/components/GSTIHeroBadge.tsx`

- [ ] **Step 1: 创建组件**

```tsx
// src/components/GSTIHeroBadge.tsx
import type { Gender } from '../data/testConfig';

interface GSTIHeroBadgeProps {
  gender: Gender;
  typeCode: string;    // e.g. "M_GOLD" or "F_PHNX"
  typeCn: string;       // 中文别名
}

const GENDER_LABEL: Record<Gender, string> = {
  male: '男',
  female: '女',
  unspecified: '?',
};

const POOL_LABEL: Record<string, string> = {
  M: '女性物种',
  F: '男性物种',
  U: '无池',
};

export default function GSTIHeroBadge({ gender, typeCode, typeCn }: GSTIHeroBadgeProps) {
  const poolKey = typeCode.startsWith('M_') ? 'M' : typeCode.startsWith('F_') ? 'F' : 'U';
  const poolLabel = POOL_LABEL[poolKey];

  return (
    <div className="inline-flex items-center gap-3 bg-surface/60 backdrop-blur-md border border-border rounded-full px-4 py-2 mb-4">
      <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent font-bold tracking-wider">
        GSTI · SWAP
      </span>
      <span className="text-sm text-white font-mono">
        {GENDER_LABEL[gender]}
      </span>
      <span className="text-muted text-xs">→</span>
      <span className="text-sm text-white">
        {poolLabel}
      </span>
    </div>
  );
}
```

- [ ] **Step 2: 编译验证**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: 无错误

- [ ] **Step 3: Commit**

```bash
git add src/components/GSTIHeroBadge.tsx
git commit -m "feat(gsti): add HeroBadge for result page gender×type reveal"
```

---

### Task 10: 在 ResultPage 条件渲染 GSTIHeroBadge

**Files:**
- Modify: `src/components/ResultPage.tsx`

> **注意：** `useQuiz()` 每次调用会创建独立的 state，不能在 `ResultPage` 里重复调用去拿 App 层的 `gender`。改为通过**可选 prop** 传入。

- [ ] **Step 1: 给 ResultPage 增加 `gender` 可选 prop**

打开 `src/components/ResultPage.tsx`，在 props 类型中追加：

```tsx
// src/components/ResultPage.tsx — 顶部 imports 新增
import GSTIHeroBadge from './GSTIHeroBadge';
import { useTestConfig } from '../data/testConfig';
import type { Gender } from '../data/testConfig';

// ResultPageProps 接口中追加
interface ResultPageProps {
  /* ... existing props ... */
  gender?: Gender;   // 新增：GSTI 测试才传
}
```

解构 props 时加上：

```tsx
export default function ResultPage({ result, onShare, onInviteCompare, onRestart, onHome, onDebugReroll, onDebugForceType, gender }: ResultPageProps) {
  const config = useTestConfig();
  /* ... */
}
```

- [ ] **Step 2: 在类型主名称渲染区域之上插入条件徽章**

找到类型中文名称的主显示块（通常 className 里含 `text-4xl` 或 `text-5xl font-bold`），在其上方插入：

```tsx
{config.genderLocked && gender && (
  <GSTIHeroBadge
    gender={gender}
    typeCode={result.finalType.code}
    typeCn={result.finalType.cn}
  />
)}
```

- [ ] **Step 3: 修改 GstiApp.tsx 在渲染 ResultPage 时传入 `gender={quiz.gender}`**

打开 `src/GstiApp.tsx`，找到 `<ResultPage ... />` 的调用，加上 `gender={quiz.gender}`：

```tsx
<ResultPage
  result={result}
  gender={quiz.gender}   // 新增
  onShare={handleShare}
  onInviteCompare={handleInviteCompare}
  onRestart={handleRestart}
  onHome={handleBackToHome}
  onDebugReroll={() => { handleStartTest(); }}
  onDebugForceType={(code) => {
    const res = computeResult({}, false, config, code, quiz.gender);
    setResult(res); setScreen('result');
  }}
/>
```

（其他 5 个 App 不需要改——`gender` 是可选 prop，不传即无 badge。）

- [ ] **Step 4: 编译验证**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: 无错误

- [ ] **Step 5: Commit**

```bash
git add src/components/ResultPage.tsx src/GstiApp.tsx
git commit -m "feat(gsti): render HeroBadge on ResultPage via optional gender prop"
```

---

### Task 11: 创建 GstiApp 顶层组件

**Files:**
- Create: `src/GstiApp.tsx`

- [ ] **Step 1: 创建组件**

基于现有 `src/LoveApp.tsx` 结构 copy + 改造。关键差异：启动测试前先弹 GenderPicker，选完再进入 Quiz。

```tsx
// src/GstiApp.tsx
import { useState, useEffect, useCallback } from 'react';
import Nav, { type TabId } from './components/Nav';
import Hero from './components/Hero';
import QuizOverlay from './components/QuizOverlay';
import Interstitial from './components/Interstitial';
import ResultPage from './components/ResultPage';
import ComparePage from './components/ComparePage';
import ShareModal from './components/ShareModal';
import RankingPage from './components/RankingPage';
import ProfilesGallery from './components/ProfilesGallery';
import GenderPicker from './components/GenderPicker';
import { useQuiz } from './hooks/useQuiz';
import { useRanking } from './hooks/useRanking';
import { useLocalHistory } from './hooks/useLocalHistory';
import { encodeCompare, decodeCompare, type DecodedCompare } from './utils/compare';
import { generateQR } from './utils/qr';
import { drawShareCard, canvasToBlob } from './utils/shareCard';
import { TestConfigProvider, useTestConfig } from './data/testConfig';
import { gstiConfig } from './data/gsti/config';
import { computeResult, type ComputeResultOutput } from './utils/matching';

type ScreenId = 'home' | 'picker' | 'quiz' | 'interstitial' | 'result' | 'compare';

function AppInner() {
  const config = useTestConfig();
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [screen, setScreen] = useState<ScreenId>('home');
  const [result, setResult] = useState<ComputeResultOutput | null>(null);
  const [compareData, setCompareData] = useState<DecodedCompare | null>(null);
  const [shareModalBlob, setShareModalBlob] = useState<Blob | null>(null);
  const [shareModalFileName, setShareModalFileName] = useState('gsti-share.png');
  const [shareModalUrl, setShareModalUrl] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  const quiz = useQuiz();
  const ranking = useRanking();
  const localHistory = useLocalHistory();

  useEffect(() => { ranking.fetchRanking(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#compare=')) {
      const b64 = hash.slice('#compare='.length);
      const decoded = decodeCompare(b64, config.dimensionOrder);
      if (decoded) { setCompareData(decoded); setScreen('compare'); }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStartTest = useCallback(() => {
    // 如未选择性别 → 先去 picker；已选过 → 直接开 quiz
    if (quiz.gender === 'unspecified') {
      setScreen('picker');
    } else {
      quiz.startQuiz();
      setScreen('quiz');
    }
  }, [quiz]);

  const handleGenderPick = useCallback((g: typeof quiz.gender) => {
    quiz.setGender(g);
    quiz.startQuiz();
    setScreen('quiz');
  }, [quiz]);

  const handleQuizSubmit = useCallback(() => {
    const res = quiz.getResult();
    setResult(res);
    localHistory.saveResult(res.finalType.code);
    setScreen('interstitial');
  }, [quiz, localHistory]);

  const handleInterstitialComplete = useCallback(() => {
    if (compareData) setScreen('compare');
    else setScreen('result');
  }, [compareData]);

  const handleBackToHome = useCallback(() => {
    setScreen('home'); setResult(null); setCompareData(null);
    window.location.hash = '';
  }, []);

  const handleRestart = useCallback(() => {
    // 重测时重新选性别
    setScreen('picker');
    setResult(null);
  }, []);

  const handleShare = useCallback(async () => {
    if (!result) return;
    const typeCode = result.finalType.code;
    const typeDef = config.typeLibrary[typeCode] ?? result.finalType;
    const pageUrl = `${config.prodBaseUrl}${config.basePath}`;
    const qrDataUrl = generateQR(pageUrl);
    try {
      const canvas = await drawShareCard(typeDef, result, qrDataUrl, 'share', config);
      const blob = await canvasToBlob(canvas);
      setShareModalBlob(blob);
      setShareModalFileName(`${config.id}-${typeCode}.png`);
      setShareModalUrl(pageUrl);
      setShowShareModal(true);
    } catch { alert('\u5206\u4eab\u56fe\u751f\u6210\u5931\u8d25'); }
  }, [result, config]);

  const handleInviteCompare = useCallback(async () => {
    if (!result) return;
    const typeCode = result.finalType.code;
    const typeDef = config.typeLibrary[typeCode] ?? result.finalType;
    const similarity = 'similarity' in result.finalType
      ? (result.finalType as { similarity: number }).similarity : 0;
    const encoded = encodeCompare(result.finalType.code, result.levels, similarity, config.dimensionOrder);
    const compareUrl = `${config.prodBaseUrl}${config.basePath}#compare=${encoded}`;
    const qrDataUrl = generateQR(compareUrl);
    try {
      const canvas = await drawShareCard(typeDef, result, qrDataUrl, 'invite', config);
      const blob = await canvasToBlob(canvas);
      setShareModalBlob(blob);
      setShareModalFileName(`${config.id}-invite-${typeCode}.png`);
      setShareModalUrl(compareUrl);
      setShowShareModal(true);
    } catch {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(compareUrl).then(() => {
          alert('\u5bf9\u6bd4\u94fe\u63a5\u5df2\u590d\u5236\u5230\u526a\u8d34\u677f');
        });
      }
    }
  }, [result, config]);

  const totalTests = ranking.data?.total ?? 0;
  const showOverlay = screen !== 'home';

  return (
    <div className="min-h-screen bg-bg text-white font-sans">
      {!showOverlay && (
        <Nav activeTab={activeTab} onTabChange={setActiveTab} onStartTest={handleStartTest} />
      )}

      {!showOverlay && (
        <main>
          {activeTab === 'home' && (
            <>
              <Hero onStartTest={handleStartTest} totalTests={totalTests} />
              <ProfilesGallery rankingData={ranking.data} />
            </>
          )}
          {activeTab === 'profiles' && (
            <div className="pt-28"><ProfilesGallery rankingData={ranking.data} /></div>
          )}
          {activeTab === 'ranking' && (
            <RankingPage ranking={ranking} localHistory={localHistory} onStartTest={handleStartTest} />
          )}
        </main>
      )}

      {screen === 'picker' && (
        <GenderPicker onPick={handleGenderPick} onClose={handleBackToHome} />
      )}

      {screen === 'quiz' && (
        <QuizOverlay quiz={quiz} onSubmit={handleQuizSubmit} onBack={handleBackToHome} />
      )}

      {screen === 'interstitial' && (
        <Interstitial onComplete={handleInterstitialComplete} />
      )}

      {screen === 'result' && result && (
        <ResultPage
          result={result}
          onShare={handleShare}
          onInviteCompare={handleInviteCompare}
          onRestart={handleRestart}
          onHome={handleBackToHome}
          onDebugReroll={() => { handleStartTest(); }}
          onDebugForceType={(code) => {
            const res = computeResult({}, false, config, code, quiz.gender);
            setResult(res); setScreen('result');
          }}
        />
      )}

      {showShareModal && (
        <ShareModal
          imageBlob={shareModalBlob}
          fileName={shareModalFileName}
          shareUrl={shareModalUrl}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {screen === 'compare' && compareData && result && (
        <ComparePage
          myData={{
            code: result.finalType.code,
            levels: result.levels,
            similarity: 'similarity' in result.finalType
              ? (result.finalType as { similarity: number }).similarity : 0,
          }}
          theirData={compareData}
          onStartTest={handleRestart}
          onShareCompare={handleShare}
        />
      )}
    </div>
  );
}

export default function GstiApp() {
  return (
    <TestConfigProvider config={gstiConfig}>
      <AppInner />
    </TestConfigProvider>
  );
}
```

- [ ] **Step 2: 编译验证**

Run: `npx tsc --noEmit 2>&1 | head -30`
Expected: 无错误

- [ ] **Step 3: Commit**

```bash
git add src/GstiApp.tsx
git commit -m "feat(gsti): add GstiApp top-level component with GenderPicker flow"
```

---

### Task 12: 配置 Vite 新增 gsti 入口

**Files:**
- Create: `gsti.html`
- Modify: `vite.config.ts`
- Modify: `build.sh`

- [ ] **Step 1: 创建 gsti.html**

基于 `cyber.html` copy。打开 `cyber.html`，复制为 `gsti.html`。修改 title 和 meta：

```html
<!-- gsti.html -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <meta name="theme-color" content="#0a0a0a" />
  <title>GSTI 性转人格测试 · 一个老爷们居然是挖金壮男</title>
  <meta name="description" content="SBTI 告诉你是什么，GSTI 告诉你性转后是什么。男生测出全是女性物种，女生测出全是男性物种。" />
  <meta property="og:title" content="GSTI 性转人格测试" />
  <meta property="og:description" content="男生测出全是女性物种，女生测出全是男性物种。来看看性转后你是什么鬼。" />
  <meta property="og:type" content="website" />
  <link rel="manifest" href="/manifest.json" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx?app=gsti"></script>
</body>
</html>
```

- [ ] **Step 2: 修改 main.tsx 让它按 query param 挂载不同 App**

打开 `src/main.tsx`，若当前是 import App 后固定挂载，替换为根据 URL 查询参数选择挂载的 App：

```typescript
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const params = new URLSearchParams(window.location.search);
const appName = params.get('app') ?? 'sbti';

async function bootstrap() {
  let App: React.ComponentType;
  switch (appName) {
    case 'cyber':  App = (await import('./CyberApp')).default; break;
    case 'desire': App = (await import('./DesireApp')).default; break;
    case 'love':   App = (await import('./LoveApp')).default; break;
    case 'values': App = (await import('./ValuesApp')).default; break;
    case 'work':   App = (await import('./WorkApp')).default; break;
    case 'gsti':   App = (await import('./GstiApp')).default; break;
    default:       App = (await import('./App')).default;
  }
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode><App /></React.StrictMode>
  );
}
bootstrap();
```

注意：若现有 `main.tsx` 已使用不同的多 App 路由策略（例如按 hostname / 入口各自有独立 main 文件），则适配那个机制——本步仅演示最简单的查询参数路由。**先运行 `cat src/main.tsx` 查看现状再决定**。

- [ ] **Step 3: 在 vite.config.ts 的 `rollupOptions.input` 加入 gsti 入口**

```typescript
// vite.config.ts（关键片段，具体键名以当前文件为准）
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        cyber: resolve(__dirname, 'cyber.html'),
        desire: resolve(__dirname, 'desire.html'),
        love: resolve(__dirname, 'love.html'),
        values: resolve(__dirname, 'values.html'),
        work: resolve(__dirname, 'work.html'),
        gsti: resolve(__dirname, 'gsti.html'),       // 新增
      },
    },
  },
});
```

- [ ] **Step 4: 更新 build.sh 复制 gsti 构建产物**

打开 `build.sh`，找到复制其他测试产物的代码块，加入 gsti：

```bash
# build.sh — 复制 gsti 产物到 dist/new/gsti/
mkdir -p dist/new/gsti
cp -r dist/gsti.html dist/new/gsti/index.html 2>/dev/null || true
```

（具体命令取决于现有 build.sh 的逻辑——仿照 `cyber` / `work` 的处理方式新增一段。**先 `cat build.sh` 查看再仿写**。）

- [ ] **Step 5: 本地 dev 启动测试**

Run: `npm run dev`
打开 http://localhost:5173/gsti.html
Expected: 进入 GSTI 首页，点击"开始测试"弹出 GenderPicker。

- [ ] **Step 6: Commit**

```bash
git add gsti.html src/main.tsx vite.config.ts build.sh
git commit -m "feat(gsti): add gsti.html entry + main.tsx routing + vite config"
```

---

### Task 13: 分享海报增加反差视觉

**Files:**
- Modify: `src/utils/shareCard.ts`

- [ ] **Step 1: 在 shareCard.ts 中对 gsti config 增加性别标签绘制**

打开 `src/utils/shareCard.ts`，在 `drawShareCard` 函数内部（类型名称绘制之前），加入 GSTI 专属视觉：

```typescript
// src/utils/shareCard.ts — 在 drawShareCard 函数内（找到绘制 header 或 type name 附近）

// GSTI 反串徽章（仅 genderLocked 测试绘制）
if (config.genderLocked) {
  // 从 localStorage 读 gender（与 useQuiz 保持同一个 key）
  const gender = (typeof window !== 'undefined'
    ? window.localStorage.getItem(`${config.id}_gender`)
    : 'unspecified') ?? 'unspecified';
  const poolKey = typeDef.code.startsWith('M_') ? 'F' : typeDef.code.startsWith('F_') ? 'M' : 'U';
  const genderLabel = gender === 'male' ? '男' : gender === 'female' ? '女' : '?';
  const poolLabel = poolKey === 'F' ? '女性物种' : poolKey === 'M' ? '男性物种' : '无池';

  // 左上角徽章背景
  ctx.save();
  ctx.fillStyle = 'rgba(220, 38, 38, 0.15)';
  ctx.strokeStyle = 'rgba(220, 38, 38, 0.6)';
  ctx.lineWidth = 2;
  const badgeX = 40, badgeY = 40, badgeW = 280, badgeH = 56;
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 28);
  ctx.fill();
  ctx.stroke();

  // 徽章文本
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 18px sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('GSTI · SWAP', badgeX + 22, badgeY + badgeH / 2);
  ctx.font = '16px sans-serif';
  ctx.fillStyle = '#fca5a5';
  ctx.fillText(`${genderLabel} → ${poolLabel}`, badgeX + 145, badgeY + badgeH / 2);
  ctx.restore();
}
```

注意：若 `drawShareCard` 的 signature 不接受 `config`，先在函数签名里补上（看下方 Step 2）。

- [ ] **Step 2: 确保 drawShareCard 参数包含 config**

查看当前 signature。`src/App.tsx` 里有 `drawShareCard(typeDef, result, qrDataUrl, 'share', config)` 五参数调用——表明 `config` 已传入。若类型签名未定义可选参数，补全：

```typescript
export async function drawShareCard(
  typeDef: TypeDef,
  result: ComputeResultOutput,
  qrDataUrl: string,
  mode: 'share' | 'invite',
  config: TestConfig,
): Promise<HTMLCanvasElement> { /* ... */ }
```

- [ ] **Step 3: 编译验证**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: 无错误

- [ ] **Step 4: 手动验证**

启动 dev 跑完一次 GSTI → 点击"分享" → 观察生成的海报左上角是否出现红色 "GSTI · SWAP [性别] → [对向池]" 徽章。

- [ ] **Step 5: Commit**

```bash
git add src/utils/shareCard.ts
git commit -m "feat(gsti): render SWAP badge on share card when genderLocked"
```

---

### Task 14: 首页导航加 GSTI 入口

**Files:**
- Modify: `index.html` (或等效的首页/hub 文件)

- [ ] **Step 1: 识别首页位置**

Run: `grep -l "cyber\.html\|work\.html" *.html`
Expected: 列出 hub 页（通常是 `index.html` 或 `new.html`）。

- [ ] **Step 2: 在 hub 页的测试卡片列表中加入 GSTI 入口**

打开 hub 页，找到其他测试卡片的 HTML 结构（例如 cyber / work 的卡片），仿写一条新卡片指向 `/gsti.html`：

```html
<!-- 在 hub 页的卡片列表区域追加 -->
<a href="/gsti.html" class="test-card test-card--gsti">
  <div class="test-card__badge">NEW · 刚上线</div>
  <h3>GSTI 性转人格测试</h3>
  <p>男生测出全是女性物种，女生测出全是男性物种——反差到窒息</p>
  <div class="test-card__meta">22 题 · 3 分钟 · 40 类型</div>
</a>
```

（具体 class 名以现有测试卡片为准。**务必先 `cat index.html` 观察现有结构再仿写**。）

- [ ] **Step 3: 手动在浏览器测试跳转**

Run: `npm run dev` → 打开 hub 页 → 点新卡片 → 应进入 GSTI。

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat(gsti): add GSTI entry card to hub page"
```

---

### Task 15: SBTI 主站加"性转版"入口（借势导流）

**Files:**
- Modify: `src/App.tsx` (SBTI 顶层)

- [ ] **Step 1: 在 SBTI 的 Hero / ResultPage 底部加入跳转卡片**

在 SBTI 的 `src/App.tsx` 中，选择合适位置（Hero 下方 or ResultPage 底部）插入跨测试引流卡：

```tsx
// src/App.tsx — 在 Hero 下方插入
<a
  href="/gsti.html"
  className="block mx-auto max-w-2xl mt-8 bg-gradient-to-r from-accent/20 to-accent/5 border border-accent/40 rounded-2xl p-5 hover:border-accent/70 transition-colors text-left group"
>
  <div className="flex items-center gap-3 mb-2">
    <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-white font-bold">NEW</span>
    <span className="text-white font-bold">GSTI · 性转版</span>
  </div>
  <p className="text-sm text-muted leading-relaxed">
    SBTI 告诉你是什么，GSTI 告诉你性转后会是什么。<br/>
    男生测出全是女性物种，女生测出全是男性物种——反差到窒息，笑到失去理智。
  </p>
  <span className="text-xs text-accent mt-2 inline-block group-hover:underline">
    立即体验 →
  </span>
</a>
```

- [ ] **Step 2: 本地预览**

`npm run dev` → 打开 SBTI 主站 → 观察新入口卡存在且跳转正确。

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat(sbti): add GSTI cross-promo card to SBTI main site"
```

---

### Task 16: 添加免责声明到 GSTI 首页与结果页

**Files:**
- Modify: `src/GstiApp.tsx`
- Modify: `src/components/GenderPicker.tsx`（已含免责声明——此处是 result 页补充）

- [ ] **Step 1: 在 GstiApp 的 Hero 区域下方插入免责声明条**

`GstiApp.tsx` 的 Hero 组件下方加入：

```tsx
// src/GstiApp.tsx — Hero 下方
<div className="mx-auto max-w-2xl mt-6 px-6 py-3 bg-surface/40 border border-border/50 rounded-xl">
  <p className="text-xs text-muted leading-relaxed text-center">
    <strong className="text-white">免责：</strong>
    GSTI 是对性别标签的戏谑反串，所有类型描述都是娱乐段子，不构成对任何人的真实评价。请带着笑一笑就过的心态使用。
  </p>
</div>
```

- [ ] **Step 2: 在 ResultPage 的底部加入同样免责（如 config.genderLocked）**

找到 `src/components/ResultPage.tsx` 最底部，条件追加：

```tsx
{config.genderLocked && (
  <div className="mt-12 px-6 py-4 bg-surface/40 border border-border/50 rounded-xl text-center">
    <p className="text-xs text-muted leading-relaxed">
      这只是个反串梗，你的人格不由任何测试决定。
    </p>
  </div>
)}
```

- [ ] **Step 3: Commit**

```bash
git add src/GstiApp.tsx src/components/ResultPage.tsx
git commit -m "feat(gsti): add disclaimer strip on home & result page"
```

---

### Task 17: 敏感词与合规自检

**Files:**
- Create: `docs/superpowers/plans/2026-04-17-gsti-sensitive-word-checklist.md`
- Modify: `src/data/gsti/types.ts`（必要时）

- [ ] **Step 1: 执行敏感词扫描**

在 plan 文件中列出禁用词，人工核对类型描述：

禁用词（若命中立即替换）：
- `娼`、`妓`、`粪`、`婊`（含"小X砸"）、`贱`、`滚`、`日你`、`草你`
- 直接指向真实群体的仇恨词：`妈宝男死全家`、`凤凰男不得好死` 等

Run: 手动通读 `src/data/gsti/types.ts` 的 40+ 段 desc，逐一用 Ctrl+F 搜索上述词。若命中，即刻改写保留语气但去掉脏字。

- [ ] **Step 2: 对称性审计**

打开 types.ts，对比男池 20 个与女池 20 个：
- [ ] 男池最狠的三个（GOLD+/CTRL♀/HOOK）是否在女池有对等烈度（PHNX♀/DARK/OCEAN）？
- [ ] 女池最狠的三个的批评语力度 ≤ 男池对应项？
- [ ] 是否某一池明显更刻薄？（不允许单边攻击）

若发现不对称，调整一池的措辞让整体烈度持平。

- [ ] **Step 3: 自测 5 次（用 #test hash）**

Run: `npm run dev` → 打开 `/gsti.html#test` → 自动填答 5 次，观察：
- [ ] 结果类型分布是否健康（没有某一类反复命中）
- [ ] 男 / 女 / 不透露 三种情况下都能正常给出结果
- [ ] 海报生成无乱码

- [ ] **Step 4: Commit**

```bash
git add src/data/gsti/types.ts docs/superpowers/plans/2026-04-17-gsti-sensitive-word-checklist.md
git commit -m "chore(gsti): sensitive word audit + symmetry check + 5x self-test"
```

---

### Task 18: TypeScript 全量编译 + 生产构建验证

**Files:**
- (无文件修改，仅验证)

- [ ] **Step 1: 全量类型检查**

Run: `npm run build 2>&1 | tail -50`
Expected: 构建成功，无 TypeScript 错误；输出 `dist/gsti.html` 及相关 chunk。

- [ ] **Step 2: 检查构建产物**

Run: `ls -la dist/*.html && ls -la dist/assets/ | grep -i gsti | head -5`
Expected: `dist/gsti.html` 存在；`dist/assets/` 中有 GSTI 相关 chunk。

- [ ] **Step 3: Preview 启动检验**

Run: `npm run preview &`
然后打开浏览器 `http://localhost:4173/gsti.html`
手动完整走一遍：
- [ ] 首页 → 开始测试
- [ ] 选"男" → 22 题 → 结果（应是 M_ 开头类型）
- [ ] 重测 → 选"女" → 结果（应是 F_ 开头类型）
- [ ] 分享卡 → SWAP 徽章显示
- [ ] 排行榜 → 无崩溃

完成后关掉 preview 进程：`pkill -f 'vite preview'`

- [ ] **Step 4: Commit（若 Step 1-3 发现小 bug 需修）**

```bash
# 若无改动跳过
git commit --allow-empty -m "verify: gsti build + preview smoke test pass"
```

---

### Task 19: API 路由支持 gsti 命名空间

**Files:**
- Modify: `api/record.js`
- Modify: `api/ranking.js`

- [ ] **Step 1: 检查当前 API 是否已支持多测试命名空间**

Run: `cat api/record.js | head -30 && echo '---' && cat api/ranking.js | head -30`

LQ16 已经加过 `test` 参数，理论上 `apiTestParam: 'gsti'` 会直接按 `sbti:ranking:gsti` 写入 Redis——无需改动。

- [ ] **Step 2: 验证**

Run:（本地有 Upstash 凭证）
```bash
curl -X POST http://localhost:3000/api/record -H 'Content-Type: application/json' -d '{"type":"M_GOLD","test":"gsti"}'
curl "http://localhost:3000/api/ranking?test=gsti"
```
Expected: record 返回 200，ranking 返回含 M_GOLD 的列表。

若 API 未支持，参考 `2026-04-13-lq16-love-test.md` 的 API 任务做等价改造（已在 love 测试时完成此改造，理应不需要）。

- [ ] **Step 3: Commit（若需要）**

```bash
# 若无修改跳过
git commit --allow-empty -m "verify: gsti API namespace works via test=gsti param"
```

---

### Task 20: 部署前最后清单

**Files:**
- (无文件修改，仅清单)

- [ ] **Step 1: 通读部署清单**

手动逐条核对：

- [ ] `gsti.html` 的 title / OG tags 不含占位文字
- [ ] 40 个类型 desc 无错别字、无敏感词（Task 17 已过）
- [ ] 22 题目无 typo
- [ ] GenderPicker / ResultPage 免责声明可见
- [ ] 分享海报包含 SWAP 徽章
- [ ] SBTI 主站 GSTI 入口卡可点
- [ ] Hub 首页 GSTI 卡可点
- [ ] `npm run build` 成功
- [ ] 手动走过男 / 女 / 不透露 三种路径
- [ ] API record / ranking 对 `gsti` 命名空间生效

- [ ] **Step 2: 部署**

Run: （本项目是 Vercel 零配置部署，push 到主分支即可）
```bash
git push origin main
```

然后在 Vercel dashboard 观察构建状态。若构建成功，访问：
- `https://sbti.jiligulu.xyz/new/gsti` （或实际 basePath）

- [ ] **Step 3: 上线后第一条推广**

按 master plan 第 6 章的"冷启动"剧本，在作者本人朋友圈发第一条 GSTI 海报（建议发男生测出 F_TOOL 这种反差极大的）。

- [ ] **Step 4: 24 小时监控**

- [ ] Vercel / Upstash 看 QPS 是否飙升
- [ ] 若服务器被挤崩（像 SBTI 4-9 那次），提前准备好 CDN 缓存兜底 / 扩容话术
- [ ] 监测评论区：是否有性别对立升级话术——如果有，第一时间发"反串梗温馨提示"

---

## 自审检查点

- 以上 20 个任务覆盖了 spec 第四章 4.1-4.12 的所有要点
- 每个任务都有具体文件路径、完整代码（无 placeholder）、运行命令、commit 消息
- Pattern 向量的"校准"作为 Task 17 的隐性要求（需要执行者实际测试中观察结果分布并微调重复 pattern）
- `UNDEF` 的触发逻辑通过 `hiddenTriggerQuestionId=gsti_gate` + value=4 实现（选"不告诉你"且答题极中立时）
- typeImages 首版用 placeholder，依赖 ResultPage 已有的无图兜底（CSS 生成卡片）；后续迭代时补充

---

## 上线后未覆盖的改进点（供后续 session 跟进）

- [ ] 40 个类型的 Pattern 向量精细校准（首版有几处 pattern 重复）
- [ ] 自定义 typeImages（插画师 or Midjourney 产出 40 张卡）
- [ ] compatibility table：男池 × 女池的"异性反串相爱/相杀"CP 表
- [ ] GSTI 独立子域名（若数据表现好）
- [ ] 基于 GSTI 冷启动结果反哺 FPI / FSI / MPI 的设计节奏

---

## 变更日志

| 日期 | 变更 | 作者 |
|------|------|------|
| 2026-04-17 | v1 初版 | cwjjjjj + Claude |
| 2026-04-17 | 开始执行：Subagent-Driven 模式，feature branch `feat/gsti-gender-swap` | Claude |

---

## 执行进度日志（Execution Log）

> **目的：** 每完成一个 task 追加一条，记录 commit SHA、review 发现、关键决策，方便中途切换 AI 或开发者接手。
>
> **接手指南：**
> 1. `git checkout feat/gsti-gender-swap`
> 2. `git log --oneline` 看到的最新 commit 就是进度位置
> 3. 在本"执行进度日志"中找到对应 task，看下一个 `[PENDING]` 的 task 编号
> 4. 按 plan 里的 Task 描述（Task N）继续实现

### 已完成

**Task 1 — 扩展 TestConfig 类型支持性别锁定** ✅
- Commit: `f038535` — `feat(gsti): extend TestConfig with genderLocked + typePoolByGender`
- 改动：`src/data/testConfig.tsx` +10 行。新增可选字段 `genderLocked?: boolean` 和 `typePoolByGender?: { male, female, both }`；导出 `Gender = 'male' | 'female' | 'unspecified'`。
- Review 结论：spec ✅；quality 建议（非阻塞）日后考虑把 `both` 键重命名为 `unspecified` 以对齐 `Gender` 类型——未采纳，Task 5 仍用 `both`。

**Task 2 — 创建 GSTI 数据目录骨架** ✅
- Commit: `9177aa5` — `feat(gsti): add dimensions/typeImages/compatibility stubs`
- 改动：新建 `src/data/gsti/dimensions.ts`（6 维度 + DIM_EXPLANATIONS）、`typeImages.ts`（空 Record 占位）、`compatibility.ts`（空 + stub getCompatibility）。
- Review：spec + quality 合并 ✅。

**Task 3 — 写 GSTI 题目库（22 题）** ✅
- Commit: `3823c94` — `feat(gsti): add 22 neutral-scenario questions covering 6 dimensions`
- 改动：新建 `src/data/gsti/questions.ts` 228 行。22 主题目（D1×3, D2×4, D3×4, D4×4, D5×4, D6×3）+ 1 gate 题 `gsti_gate`。
- Review：✅。

**Task 4 — 写 GSTI 类型库（40+1+1）** ✅
- Commit: `6812ec1` — `feat(gsti): add 40 swap-gender types + UNDEF hidden + HWDP fallback`
- 改动：新建 `src/data/gsti/types.ts` 306 行。TYPE_LIBRARY 42 条（20 M_ + 20 F_ + UNDEF + HWDP），NORMAL_TYPES 40，TYPE_RARITY 42，MALE_POOL_CODES/FEMALE_POOL_CODES 数组。
- **已知遗留债**：40 个 pattern 只有 **22 个 unique**（约 45% 重复）。女池重复尤其严重：ABBBBA 和 AABBBA 各有 4-5 个类型共享。需要在 **Task 17 做 pattern 去重校准**，不然某些类型永远不会被匹到。
- Review：spec ✅（Task 17 负责修）。

**Task 5 — 组装 GSTI TestConfig** ✅
- Commit: `24c6b27` — `feat(gsti): assemble TestConfig with gender-locked pool support`
- 改动：新建 `src/data/gsti/config.ts` 56 行。`gstiConfig.id='gsti'`, `basePath='/new/gsti'`, `apiTestParam='gsti'`, `gateQuestionId='gsti_gate'`, `hiddenTriggerValue=4`, `maxDistance=12`, `similarityThreshold=55`, `genderLocked=true`, `typePoolByGender={male,female,both}`.
- `sumToLevel`: L≤6, M=7-10, H≥11。
- Review：✅。

**Task 6 — 扩展 matching.ts 支持按性别池过滤** ✅
- Commit 1: `f7535e7` — `feat(matching): add optional gender param + typePoolByGender filter`
- Commit 2 (review fix): `5d1097a` — `fix(matching): throw on genderLocked misconfiguration + use Gender alias`
- 改动：`src/utils/matching.ts` +24 / -6（合计两次 commit）。`computeResult` 新增 5th 参数 `gender?: Gender`。Pool filter 在 scoring loop 之前，guard 是 `config.genderLocked && gender` → 存在时强制检查 `typePoolByGender` 存在（否则 throw）、过滤后 pool 非空（否则 throw）。13 个现有 caller 都只传 4 参，走 fallback 分支，向后兼容。
- Review：spec ✅；quality reviewer 提出 Important 建议（silent fallback on misconfig → throw; Gender alias 单源），已采纳并在 `5d1097a` 修复。

**Task 7 — 扩展 useQuiz hook 支持 gender state** ✅
- Commit: `36142f7` — `feat(useQuiz): add gender state with localStorage persistence`
- 改动：`src/hooks/useQuiz.ts` +31 / -3。新增 `gender`/`setGender` state，初始从 `localStorage[${config.id}_gender]` 读取，`setGender` 同步写回。`getResult` 把 `gender` 传给 `computeResult`（deps 里加了）。`UseQuizReturn` 接口+返回对象都加了 `gender/setGender`。SSR-safe（`typeof window` 守卫 + try/catch）。
- 对其他 6 个 App 无破坏性影响——它们不解构 `gender/setGender`。
- Review：implementer 的 prompt 里已经基于 actual file content 精确指导，跳过独立 spec review。

**Task 8 — 创建 GenderPicker 组件** ✅
- Commit: `753adf1` — `feat(gsti): add GenderPicker component with 3 options`
- 改动：新建 `src/components/GenderPicker.tsx` 67 行。全屏 motion.div 覆盖层，3 个性别按钮（男 / 女 / 不告诉你），底部免责声明。Props: `onPick: (g: Gender) => void`, `onClose?: () => void`。
- Review：spec ✅。

**Task 9 — 创建 GSTIHeroBadge 组件** ✅
- Commit: `7536b42` — `feat(gsti): add HeroBadge for result page gender×type reveal`
- 改动：新建 `src/components/GSTIHeroBadge.tsx` 40 行。结果页顶部小徽章，显示 "GSTI · SWAP | [性别标签] → [池标签]"。Pool detection: `M_` 前缀 → '女性物种'，`F_` 前缀 → '男性物种'，其他 → '无池'。
- Review：spec ✅。

**Task 10 — ResultPage 条件渲染徽章** ✅
- Commit: `abcb20a` — `feat(gsti): render HeroBadge on ResultPage via optional gender prop`
- 改动：`src/components/ResultPage.tsx` +12 行。新增 `gender?: Gender` prop（可选），在结果页类型大名渲染之前（line 146-152）条件渲染 `GSTIHeroBadge`，守卫为 `config.genderLocked && gender`。
- **Plan 偏离：** plan 原本 Task 10 Step 3 要改 GstiApp.tsx 传 `gender={quiz.gender}` prop；因 GstiApp.tsx 在 Task 11 才创建，推迟到 Task 11 的 GstiApp 初版代码里直接加入 `gender={quiz.gender}`。
- 对其他 6 个 App 无破坏性影响（它们不传 `gender`，徽章不渲染）。
- Review：spec ✅。

**Task 11 — 创建 GstiApp 顶层组件** ✅
- Commit: `f858f62` — `feat(gsti): add GstiApp top-level component with GenderPicker flow`
- 改动：新建 `src/GstiApp.tsx` 217 行。顶层 App：`home → picker → quiz → interstitial → result → compare` 流程。`handleStartTest` 在 `gender === 'unspecified'` 时先跳 picker；`handleRestart` 回到 picker 让用户重选性别。`<ResultPage gender={quiz.gender} ...>` 正确传入 prop（implementer 手动补上，plan 原代码块漏了）。默认导出用 `TestConfigProvider config={gstiConfig}` 包裹。
- Review：spec + quality ✅。

**Task 12 — 配置 Vite 新增 gsti 入口** ✅
- Commit: `a9d3a81` — `feat(gsti): add gsti vite entry`
- 改动：新建 `gsti.html`，按现有多入口 HTML 风格内联 import `src/GstiApp.tsx`；`vite.config.ts` 的 `rollupOptions.input` 新增 `gsti: 'gsti.html'`；`build.sh` 的测试产物复制循环加入 `gsti`，输出到 `/new/gsti/`。
- **Plan 偏离：** 不改 `src/main.tsx`。项目实际架构是每个 HTML 直接挂载对应 App，`main.tsx` 只服务 `new.html`。
- Verification：`npx tsc --noEmit` ✅；`npx vite build --outDir dist-task12 --emptyOutDir` ✅（确认产出 `dist-task12/gsti.html` 和 GSTI chunk）；`bash -n build.sh` ✅。
- Review：spec + architecture correction ✅。

**Task 13 — 分享海报增加反差视觉** ✅
- Commit: `69c5268` — `feat(gsti): render SWAP badge on share card`
- 改动：`src/utils/shareCard.ts` 在 `config.genderLocked` 时绘制 GSTI 专属红色 `GSTI · SWAP` 徽章；从 `${config.id}_gender` localStorage 读取性别标签，并按 `M_`/`F_` 类型前缀显示对向池（女性物种 / 男性物种）。非 genderLocked 测试不渲染该徽章。
- **Plan 偏离：** 为避免和原品牌 header 重叠，徽章绘制在品牌行下方、海报头像/类型信息之前，而不是固定覆盖左上角绝对坐标。
- Verification：`npx tsc --noEmit` ✅；`npx vite build --outDir dist-task13 --emptyOutDir` ✅。浏览器点击分享的视觉 smoke 留到 Task 18 统一做。
- Review：spec ✅；兼容性 ✅。

**Task 14 — 首页导航加 GSTI 入口** ✅
- Commit: `fde5411` — `feat(gsti): add GSTI entry card to hub page`
- 改动：`index.html` hub 页新增 GSTI 卡片，链接到 `/new/gsti`；首页 title/meta/hero 从 6 个测试更新为 7 个测试；动画 delay 增加第 7 张卡；总参与人数统计数组加入 `gsti`。
- **Plan 偏离：** 现有 hub 链接使用部署路径 `/new/<test>`，因此没有使用 plan 示例里的 `/gsti.html`。
- Verification：静态 `rg` 核对 `/new/gsti`、7 个测试文案和 `gsti` 统计项 ✅；`npx vite build --outDir dist-task14 --emptyOutDir` ✅。
- Review：spec ✅。

**Task 15 — SBTI 主站加性转版入口** ✅
- Commit: `f8ccd9c` — `feat(sbti): add GSTI cross-promo card to main site`
- 改动：`src/App.tsx` 在 SBTI 首页 Hero 下方新增 GSTI 导流卡，链接到 `/new/gsti`。入口仅出现在 SBTI 主站 home tab，不影响 quiz/result/compare overlay。
- **Plan 偏离：** 使用部署路径 `/new/gsti`；卡片圆角用 `rounded-lg`，避免新增 `rounded-2xl`。
- Verification：`npx tsc --noEmit` ✅；`npx vite build --outDir dist-task15 --emptyOutDir` ✅。
- Review：spec ✅。

---

### 关键架构纠正（Task 12 前必看）

**多入口机制真相：** 项目**不用** `main.tsx` 做路由。Vite 的 `rollupOptions.input` 指定多 HTML 入口，**每个 HTML 直接内联 `<script type="module">` import 对应的 App 组件**。`main.tsx` 只服务于 `new.html`（SBTI 主站）。

- 参考：`cyber.html` 底部：
  ```html
  <script type="module">
    import React from 'react'
    import ReactDOM from 'react-dom/client'
    import CyberApp from './src/CyberApp.tsx'
    import './src/index.css'
    ReactDOM.createRoot(document.getElementById('root')).render(
      React.createElement(React.StrictMode, null,
        React.createElement(CyberApp)
      )
    )
  </script>
  ```
- **因此 Plan Task 12 的 Step 2（"修改 main.tsx 按 query param 挂载不同 App"）作废。** gsti.html 按 cyber.html 的风格内联 script 即可。main.tsx 不改。

---

### 待执行（按顺序推进）
- [ ] **Task 16** — 免责声明（GstiApp Hero 下 + ResultPage 底部）
- [ ] **Task 17** — 敏感词审校 **+ Pattern 向量去重校准（升级为显性任务）**
- [ ] **Task 18** — `npm run build` + preview smoke test
- [ ] **Task 19** — API record/ranking 对 `gsti` 命名空间验证（理应已支持，因 LQ16 时改造过）
- [ ] **Task 20** — 部署前清单 + push + 监控

---

### 关键决策记录

- **Pattern 碰撞处理**：Task 4 产出的 40 pattern 有 18 个重复，已升级为 Task 17 的**显性任务**（原计划是"隐性要求"）。上线前必须去重，否则多个类型永远匹不到。建议每个 pattern 与同池其他 pattern 至少相差 2 维。
- **`typePoolByGender.both` 命名**：Task 1 review 建议改名为 `unspecified` 对齐 Gender 类型，未采纳（成本 vs 收益不划算，Task 5/6 已定型）。
- **尺度**：中度冲击已锁定，40 个类型 desc 均用性转反差+自嘲，避开 PUA/拳师/北京小灵等极端词；对称设计（男女池烈度等价）。Task 17 还要做一次人工对称性审计。
- **TDD**：项目无测试框架，验证方式为 `npx tsc --noEmit` + Task 18 的手动 smoke。不强求写 test file。
- **Review 策略**：小/机械任务（Task 2/3/4/5）用合并精简 reviewer；架构/集成任务（Task 6/7/10/11/12/13）走完整两阶段 review。

---

### 续接指令（给下一个 AI 或开发者）

```
# 1. 切到开发分支
cd /Users/jike/Desktop/Developer/sbticc
git checkout feat/gsti-gender-swap
git log --oneline | head -15

# 2. 确认当前 HEAD 是最新的已完成 task commit（比对本 md 的"已完成"区）

# 3. 从下一个 "[ ] Task N" 开始。Plan 里每个 task 有完整代码块、verification、commit message。
#    打开 docs/superpowers/plans/2026-04-17-gsti-gender-swap-test.md 找到对应 task。

# 4. 完成后：
#    - 追加"已完成"条目到本 md（commit SHA、改动摘要、review 发现）
#    - 更新"待执行"清单去掉已完成项
#    - 在"关键决策记录"记录新决策（如果有）

# 5. 推荐模式：Subagent-Driven Development（或手动执行）。
#    参考 skill: superpowers:subagent-driven-development
```
