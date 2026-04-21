# DogTI · 狗狗人格测试 — 设计稿

**日期**：2026-04-21
**来源**：https://dogti.pages.dev/ （12 题短版 MBTI，16 种狗狗人格）
**定位**：作为一个新的独立测试加入多测试平台，与现有 72 题严肃 MBTI 并列。

## 1. 目标

把 DogTI 原站的题目 / 结果 / 视觉资产搬进本项目，复用平台现有基础设施（`TestConfig` 框架、排行榜、本地历史、分享卡片、对比页），让它在 `/dogti` 可访问，并在首页与其他测试并列。

## 2. 非目标（YAGNI）

- 不做 A/T 亚型（DogTI 只有 16 种，不做 32 亚种）
- 不做支付解锁（DogTI 作为免费娱乐内容）
- 不做隐藏类型、Gate 题、Drink 题
- 不还原源站的像素字体 / 复古视觉 — 走平台统一视觉
- 不做 16×16 手写 compatibility 矩阵 — 用现有 MBTI 字母距离通用逻辑

## 3. 测试元信息

| 字段 | 值 |
|------|----|
| `id` | `dogti` |
| 路径 | `/dogti` |
| 名称 | `DogTI 狗狗人格测试` |
| Tagline | `12 题测出你是什么狗 · 16 种狗狗人格` |
| Emoji | 🐕 |
| 题数 | 12 |
| 维度数 | 4（EI / SN / TF / JP） |
| 结果数 | 16（四字母 MBTI 码） |

## 4. 题目与结果数据

### 题目

12 道题直接从源站复制（见 `/tmp/dogti.html` 第 686–795 行）。每题 3 个选项（A/B/C），每个选项独立对应一个维度字母。

**关键数据特点**：**选项级 `dim`**（而非题级）。例如题 1：
```
A. "直接冲上去..."  dim: E
B. "在旁边观望..."  dim: I
C. "绕开走..."     dim: I
```

### 结果库

16 个 MBTI 四字母码 → 16 种狗狗人格（源站 `results` 对象，`/tmp/dogti.html` 第 800–929 行）：

| 码 | 狗名 | 副标题 |
|---|------|-------|
| ENTJ | 气场先到三步的杜宾 | 不用担心，我来搞定 |
| ENTP | 把所有人都绕晕了的边牧 | 智商在线但没有刹车 |
| ENFJ | 比你更担心你的金毛 | 全场情绪承包商 |
| ENFP | 什么都想闻一口的比格 | 人间好奇心漩涡 |
| ESTJ | 把所有人都管住了的德牧 | 靠谱是我最高荣誉 |
| ESTP | 说好散步结果跑丢的哈士奇 | 人形随机事件发生器 |
| ESFJ | 拒绝不了任何人的拉布拉多 | 有求必应的宇宙中心 |
| ESFP | 出门必须好看的泰迪 | 天生要被看见 |
| INTJ | 假装冷静的柴犬 | 我不孤僻，我在筛选 |
| INTP | 想到一半就忘了的阿拉斯加 | 大型行走发呆装置 |
| INFJ | 永远在笑但只有自己知道为什么的萨摩耶 | 微笑刺客 |
| INFP | 你不懂的马尔济斯 | 精神世界建筑师 |
| ISTJ | 没做完不能睡觉的柯基 | 腿短但执行力无限 |
| ISTP | 不需要你担心的松狮 | 沉默系解题高手 |
| ISFJ | 记住你不喜欢香菜的比熊 | 世界上最细心的人 |
| ISFP | 急不起来的腊肠 | 慢节奏生活家 |

每种结果包含：`subname`（副标题）、`quote`（一句话宣言）、`traits`（4 条短语）、`desc`（一段描述）、`dog`（英文标识 → 对应 PNG）。

### 图片资产

16 张像素狗狗 PNG 已从源站下载到 `/tmp/dogti_imgs/`（命名：`杜宾.png`、`边牧.png` 等 16 张，每张 14–23 KB）。实施时复制到 `src/data/dogti/images/`。

## 5. 架构：接入现有 `TestConfig` 框架

### 5.1 扩展点 — `QuestionOption.dim`

**问题**：现有 `Question` 模型在题级别带 `dim`（整道题打同一个维度分），DogTI 每个选项各打一个维度。

**最小侵入改动**：给 `QuestionOption` 加可选字段：

```ts
export interface QuestionOption {
  label: string;
  value: number;
  dim?: string;  // 新增：选项级维度覆盖（优先于题级 dim）
}
```

**matching.ts 打分分支**：读选项时，若 `option.dim` 存在则用它，否则回退到 `question.dim`。

**useQuiz.ts 答案结构**：保持 `answers[qId] = selectedValue` 不变；matching 读取 `questions[qId].options[selectedValue].dim || questions[qId].dim`。

**其他 11 个现存测试的影响**：零 — 它们都不设 `option.dim`，走原有题级 dim 分支。

### 5.2 题目编码

每题 3 个选项，编码成 `value: 0/1/2`，`label` 为原文文本，`dim` 字段编选项对应的维度字母（E/I/S/N/T/F/J/P 之一）。

题级 `dim` 字段留空字符串（只有 option.dim 生效）。

### 5.3 评分与类型解析

复用 MBTI config 的 `sumToLevelByDim` + `directTypeResolver` 模式：

```ts
sumToLevelByDim: (score, dim) => {
  if (dim === 'EI') return score >= 0 ? 'E' : 'I';
  if (dim === 'SN') return score >= 0 ? 'S' : 'N';
  if (dim === 'TF') return score >= 0 ? 'T' : 'F';
  if (dim === 'JP') return score >= 0 ? 'J' : 'P';
  return undefined;
},
directTypeResolver: (levels) =>
  `${levels.EI}${levels.SN}${levels.TF}${levels.JP}`,
```

**打分规则**：每次选中某选项，给该选项的 dim 的"正字母一端"+1，"负字母一端"-1。具体：
- E/S/T/J 侧为正（+1）
- I/N/F/P 侧为负（-1）

（注意：上面 `sumToLevelByDim` 的阈值 `score >= 0` 与此约定对应；原站是简单 count 比较，我们用"代数和 ≥ 0"等价实现。）

**`fallbackTypeCode`**：`INTJ`（万一匹配不到时的兜底 — 跟 MBTI config 一致）。

### 5.4 题目数值平衡性

原站数据中维度不是均匀的（比如 `T` 维只出现 2 次，`J` 维 4 次）。这不是问题 —— 平局打破规则保持和源站一致：代数和 ≥ 0 时偏向 E/S/T/J（与源站 `count.E >= count.I ? "E" : "I"` 等价）。

## 6. 文件结构

```
src/data/dogti/
  config.ts          TestConfig 实例
  dimensions.ts      4 维元信息 + 每维正反两端的解释
  questions.ts       12 题 + 选项级 dim
  types.ts           16 个 MAIN_TYPES → TYPE_LIBRARY / NORMAL_TYPES / TYPE_RARITY
  typeImages.ts      16 种狗狗图片引用
  content.ts         16 × { quote, traits[], desc } 结构化内容
  images/
    杜宾.png ... 腊肠.png   （16 张）

src/DogtiApp.tsx     复制 MbtiApp.tsx，把 mbtiConfig 换成 dogtiConfig
dogti.html           入口 HTML，参照 mbti.html

vite.config.ts       rollupOptions.input 加 dogti: 'dogti.html'
vercel.json          rewrites 加 /dogti、/dogti/(.*) 两条；redirects 加 /new/dogti
src/data/allTests.ts 追加一条 DogTI 记录

api/record.js        VALID_TYPES_BY_TEST.dogti = 16 个四字母码 Set
api/ranking.js       MOCK_TYPES_BY_TEST.dogti = 16 个四字母码数组
```

## 7. UI 复用策略

DogTI 走跟 MBTI 一样的组件链：
- `QuizOverlay` — 复用，无改动
- `Interstitial` — 复用
- `MbtiResultPage` — 复用（它读 `TestConfig` 里的字段，不绑死在 mbti 上）
- `ComparePage` / `ShareModal` / `RankingPage` — 复用
- `MbtiDimensionBars` — 复用（4 维度可视化正好适配）
- `MbtiShareCardView` — 复用（由 `captureMbtiShareCard` 使用）

**视觉风格**：保持平台统一 —— 不引入源站的像素字体 / 复古绿框 / 对话气泡等特效。狗狗 PNG 本身的像素风会自然出现在结果头像位置。

**`intro` / `desc` 映射**：
- `TypeDef.cn` = 狗狗长名字（"气场先到三步的杜宾"）
- `TypeDef.intro` = `subname` + `quote`（如"不用担心，我来搞定 — 不是我控制欲强，是你们动作太慢。"）
- `TypeDef.desc` = `desc`（源站的段落描述）
- `traits[]` 在结果页以标签形式展示（复用 MbtiResultPage 现有标签区域；若组件不支持则塞进 desc 底部）

## 8. 兼容性（compatibility）

简化方案：按 MBTI 字母距离生成 —— 4 字母全相反 → 冤家；3 个相同 → 灵魂伴侣；2 个相同 → 镜像；其他 → 普通。

**实现**：`getCompatibility(a, b)` 按字母位比较，输出 `{ type, say }`。文案用 16×4=64 条短语池（或用一份通用模板如"XX 和 YY 是绝配"）。

MVP 实现：直接把 `compatibility.ts` 的 `COMPATIBILITY` 设为空对象 `{}`，`getCompatibility` 按字母距离返回固定模板文案。不手写人物对人物的口水话。

## 9. 后端改动

### `api/record.js`

`VALID_TYPES_BY_TEST` 新增：
```js
'dogti': new Set([
  'INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP',
  'ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP',
]),
```

### `api/ranking.js`

`MOCK_TYPES_BY_TEST.dogti` 同上 16 个码。

### Redis key 前缀

按现有约定 `test ? ${test}:` : 'sbti:'`，DogTI 自动用 `dogti:ranking`、`dogti:total` — 无需额外改动。

## 10. 路由与构建

### `vite.config.ts`

```ts
rollupOptions: {
  input: {
    ...既有,
    dogti: 'dogti.html',
  },
}
```

### `vercel.json`

Redirects 加：`{ "source": "/new/dogti", "destination": "/dogti", "permanent": true }`

Rewrites 加：
```json
{ "source": "/dogti", "destination": "/new/dogti/index.html" },
{ "source": "/dogti/(.*)", "destination": "/new/dogti/index.html" }
```

### `allTests.ts`

追加：
```ts
{
  id: 'dogti',
  name: 'DogTI 狗狗人格测试',
  tagline: '12 题测出你是什么狗 · 16 种狗狗人格',
  path: '/dogti',
  emoji: '🐕',
},
```

## 11. 测试与验收

- `pnpm dev` 打开 `/dogti`，完成 12 题，检查结果页正确显示狗狗长名字 + 狗狗 PNG + desc + traits
- 用 `#test` 调试模式（若 MbtiApp 支持）自动填答案
- 检查排行榜页 `/dogti` 能正确列出 16 个狗狗类型
- 分享卡片截图包含狗狗 PNG
- `/compare` 页能对比两个 DogTI 结果
- 首页能看到 DogTI 卡片并能跳转
- 手工验证源站的每题映射与本项目一致（抽查 3 题 × 3 选项 = 9 个映射）

## 12. 风险与注意事项

- **`QuestionOption.dim` 扩展**需要同时改 `testConfig.tsx`、`matching.ts`、可能还有 `useQuiz.ts`。需要仔细检查现有 11 个测试不受影响 — 写实施计划时明确这一步。
- **文件名含中文**：`src/data/dogti/images/杜宾.png` 等。Vite 需要能正确处理 — 参照现有做法（若现有项目没有中文文件名前例，可改用拼音 `doberman.png` 等英文标识，和 `dog` 字段统一）。**默认采用英文标识**更稳妥。
- **`MbtiResultPage` 是否真的通用**：名字带 "Mbti" 前缀，需要看看它内部是否硬编码 MBTI 字段。如果有硬编码，实施时用 `MbtiResultPage` 复制一份改造，或直接复用 `ResultPage`（通用版）。实施计划里需要先读代码确认。
- **`sumToLevelByDim` 边界**：score=0 时归属"正字母一端"（E/S/T/J），这与源站 `>=` 语义一致。

---

# 附录：CaTI · 猫猫人格测试（同步交付）

**定位**：DogTI 的姐妹款 — 同样 12 题 MBTI 映射 16 种猫咪品种。结构与 DogTI 完全镜像，内容自创（参考 DogTI 风格 — 精准一句话、4 条 traits、一段描述）。

## A1. 测试元信息

| 字段 | 值 |
|------|----|
| `id` | `cati` |
| 路径 | `/cati` |
| 名称 | `CaTI 猫猫人格测试` |
| Tagline | `12 题测出你是什么猫 · 16 种猫咪人格` |
| Emoji | 🐈 |

## A2. 16 种猫咪品种映射

| MBTI | 猫名 | 副标题（草案） |
|------|------|---------------|
| ENTJ | 全家都归我管的缅因猫 | 体型最大所以我来管 |
| ENTP | 跳上桌子推倒所有东西的孟加拉豹猫 | 好奇心驱动的破坏王 |
| ENFJ | 认得所有家人情绪的布偶猫 | 贴心到有点操心 |
| ENFP | 谁都不想放过的阿比西尼亚 | 兴趣三分钟但有十七件事 |
| ESTJ | 规矩比你还多的俄罗斯蓝猫 | 一切都要按时按点 |
| ESTP | 从窗户跳出去追鸟的暹罗猫 | 动静比体型大一百倍 |
| ESFJ | 客人来了就蹭腿的金渐层 | 宇宙社交中心 |
| ESFP | 自带补光灯的波斯猫 | 出场就要成为焦点 |
| INTJ | 冷眼观察你的英国短毛猫 | 没有意见只是已经做好决定 |
| INTP | 思考了三个小时没动的苏格兰折耳 | 大脑常开走神模式 |
| INFJ | 永远在高处看你的奶牛猫 | 沉默型人类观察员 |
| INFP | 活在自己宇宙的银渐层 | 梦比现实清晰 |
| ISTJ | 每顿饭准时出现的美国短毛猫 | 作息比你规律一百倍 |
| ISTP | 一个人拆家高手的狸花猫 | 话少但手上有事 |
| ISFJ | 记得每个习惯的虎斑橘猫 | 默默守着你的一切 |
| ISFP | 躺在阳光里就满足的异短 | 生活没别的事更重要了 |

**每种猫的内容字段**（sub name / quote / 4 traits / desc）由我在实施时按 DogTI 风格撰写 — 保持"精准自嘲、一句话戳中、口语化"的调性。

## A3. 图片策略

**用户没提供猫咪像素画**。MVP 方案：
- 不画图，结果头像位置用一个大 emoji（🐱🐈🐈‍⬛ 等 16 种猫脸组合）+ 配色渐变背景
- `typeImages.ts` 导出空字符串或 emoji 字符串 — `MbtiResultPage` 里图片为空时回退到 emoji 渲染（实施时根据组件实际行为调整）
- 后续可替换为真图，不影响现有结构

## A4. 题目

12 题完全新写，围绕**猫的典型行为**：对陌生人的反应、猎捕冲动、午睡偏好、吃饭挑食、被摸的态度、纸箱执念等。每题 3 选项、每选项对应一个 MBTI 维度字母，结构与 DogTI 一致。

## A5. 实施差异（相对 DogTI）

| 项 | DogTI | CaTI |
|----|-------|------|
| 题目 | 照抄源站 12 题 | 新写 12 题（猫主题） |
| 图片 | 16 张像素 PNG | emoji 占位 |
| 其他 | - | 其余完全镜像（数据结构、组件复用、路由、API 白名单） |

## A6. 文件结构（镜像）

```
src/data/cati/
  config.ts
  dimensions.ts
  questions.ts
  types.ts
  typeImages.ts    （emoji 字符串）
  content.ts
  compatibility.ts

src/CaTIApp.tsx
cati.html
```

构建/路由/API 改动同步追加 `cati` 条目。

