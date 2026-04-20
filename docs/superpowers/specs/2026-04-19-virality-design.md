---
name: 病毒性机制（Phase B）
description: 通用分享卡 + 揭晓式稀有度 + Hook 矩阵 —— 不做平台专属优化，不做分享解锁，靠 UX 心理钩子自然驱动
type: design-spec
status: approved
author: cwjjjjj + Claude
created: 2026-04-19
---

# Phase B · 病毒性机制 · Design Spec

## 战略选型（已决）

| 维度 | 选择 |
|------|------|
| 目标平台 | 通用（d）——X/Twitter/微博/Telegram 等靠 OG + 分享卡 + 复制链接；不做微信/小红书专属 |
| 胁迫度 | b 自由分享——零 gating、不扣留内容，全靠 UX 设计让用户"忍不住想截图" |
| 范围深度 | 大——含揭晓式稀有度动画 + 大号百分位 + Hook 矩阵 |

## 目标 & 非目标

**目标**
- 让测完结果的用户有"想 show 一下"的强冲动
- 让分享到 X/微博/Telegram 的链接预览卡就是醒目的"某人测出了 X 类型"（per-type OG）
- 即使不分享，也通过 Hook 矩阵把人留在我们的 10 个测试里，做第二个、第三个

**非目标**
- 分享解锁（破坏品牌语调）
- 平台专属优化（微信小程序/小红书话题 tag/公众号接入）
- 支付/付费系统接入（独立于病毒性）
- 更换 React 版本 / 迁移框架

---

## 三块核心设计

### 块 1：揭晓式稀有度（Reveal Moment）

**目标**：把结果页打开的第一秒从"普通页面加载"变成"打开盲盒的仪式感"。

**流程**：
1. 用户点"提交并查看结果"（已有）
2. Interstitial vignette 广告（已有）
3. Interstitial 关闭 → 进入 **Reveal Overlay**（新）：
   - 全屏深色背景
   - 中心大字倒数/滚动动画：`"你属于..."`
   - 1.5s 后揭晓：超大百分位数字 + tier 徽章 + 类型名称
   - 例：`"前 3.2% 稀有"` 大字 + `"稀世"` 徽章发光
   - 2s 后自动淡出进入完整 ResultPage

**稀有度等级划分**（基于 `/api/ranking` 实时数据）：
| Tier | 条件 | 视觉 |
|------|------|------|
| 稀世 | 前 5% | 金色发光 + 放射特效 |
| 罕见 | 5%~15% | 红色发光 |
| 少见 | 15%~40% | 银色 |
| 普通 | 40%~100% | 白色，不强调 |

**技术**：
- 新增 `src/components/RevealOverlay.tsx`
- 从 `/api/ranking?test=<id>` 拿到 `{ CODE: count }` map
- 前端计算：`percentile = (自己类型在榜单中的排名 / 总人数) * 100`
- framer-motion 控制进出场
- 如果 ranking API 失败，降级为不带百分位的简化揭晓（"恭喜你测出 XX"）

**降级**：本地有 `typeRarity` 理论稀有度表（`Record<code, 1-5 星>`），如果 API 失败用理论星级作为 fallback。

### 块 2：稀有度徽章在 ResultPage 永久存在

Reveal 过场结束后，ResultPage 本身也要有稀有度数据。不能只在揭晓时出现一次。

**位置**：TypeCard 正下方，badge 形式。例：
```
[TypeCard: M_GOLD / 挖金壮男 / 徽章]
[🔥 前 3.2% 稀有 · 稀世]  ← 新增
[解读文字...]
```

**点击行为**：点击徽章 → 弹出 modal 展示详细排名（"全站共有 X 次测试，你这个类型出现了 Y 次"）。

**技术**：
- 新增 `src/components/RarityBadge.tsx`
- 接收 `percentile: number, tier: 'legendary'|'rare'|'uncommon'|'common'`
- 放在 `ResultPage.tsx` 的 TypeCard 下方

### 块 3：Hook 矩阵（留存 + 裂变）

**位置**：ResultPage 底部，在所有解读完之后，在 "再测/回首页" 按钮之上。

**四个模块**（横排 2×2 或堆叠）：

**H1：邀请 TA 对比**
- 大按钮 `生成对比邀请链接`
- 点击生成 `#compare=<base64>` URL
- 展示：QR 码 + 短链 + "Copy" 按钮
- 复制链接自动加 `?s=compare`（UTM）
- 新朋友点开：先看到分享者的雷达图 + 类型，底部大 CTA `"想知道你和 TA 的相性？先测一下"`

**H2：你可能也想测**
- 推荐 2 个相关测试（基于当前测试，硬编规则）
  - SBTI → GSTI（性转版）+ 任一低完成率的测试
  - 情感类（love/desire） → work + mpi
  - 社交类（cyber/fpi） → values + fsi
- 每个推荐卡：emoji + 测试名 + 一句 tagline + 按钮

**H3：同款人格的人还在看**
- 基于 ranking 数据 + 硬编映射
- "测出 M_GOLD 的人，也常测出：BOSS (打工人鉴定)、2HAND (消费人格)"
- 这是 cross-test 漏斗，把一个测试的完成者导到其他测试

**H4：结果保存**（新增）
- "保存到 [localStorage] 本地历史" 默认已有
- 加一条："**你已测了 N 个测试**"——展示历史条数 + "继续测下一个？"
- 心理：进度感 + 已投入感（沉没成本）让用户完成更多测试

**技术**：
- 新增 `src/components/HookMatrix.tsx`
- 接收 `{ testId, typeCode, onInviteCompare, localHistoryCount, ranking }`
- 组合 4 个子组件

---

## 分享卡 v2（通用 OG-friendly）

**现状**：canvas 生成 840px 宽图，含类型卡、维度、QR 码、品牌。

**v2 新增**：
- 顶部大字显示 **百分位**（例："前 3.2% 稀有 · 稀世"）
- 保留原有类型信息
- QR 码指向 `/types/<testId>/<CODE>`（Phase 2 的类型详情页），而非测试首页——这样扫码者直接看到类型的"是什么人"解读
- 水印保留（免费用户）

**OG Meta 增强**：
- 每个类型详情页 `/types/<testId>/<CODE>` 的 OG meta 从"测试级别"改成"类型级别"
- 新增 `scripts/gen-og-types.mts` 在构建时生成 ~236 张 per-type OG 图（仿 Phase 1 的 Satori 流程）
- 图内容：大字类型中文名 + "在 XX 测试里只有 Y% 人是这个" + 品牌
- 保存到 `public/images/og-types/<testId>/<CODE>.png`（或简化为统一命名）
- `gen-type-pages.mts` 更新 OG meta 指向新图

---

## 分享链接 UTM

当前分享链接：`https://test.jiligulu.xyz/sbti#result=...`

v2：
- 分享按钮触发时，根据来源（目前只有 Native Share API，未来可能加 X/微博按钮）拼接 `?s=<source>`
- Source 标签：`share`（通用）/ `compare`（邀请对比链接）/ `nativex`（Native Share Web API 调起的分享）
- 服务端不消费这个参数，纯前端分析用

---

## 成功指标（日后观察）

| 指标 | 基线 | 目标 |
|------|------|------|
| 分享 CTA 点击率（完成结果的用户中） | ~? | +30% |
| Compare 邀请链接产生率 | ~0 | 10% 完成用户 |
| 人均测试数（localStorage history） | ~? | +40% |
| 每日新会话中"来自 ?s=" 的占比 | 0 | 5%+ |

## 风险

- **Reveal Overlay 遮挡屏幕截图**：如果 overlay 还在动画期用户就截图，会截到倒计时状态。对策：overlay 动画完成后 1s 内保持静止大百分位文字，方便截图。
- **稀有度 API 失败时体验**：降级为理论稀有度 + 不带百分位的揭晓。
- **per-type OG 生成 ~236 张构建慢**：Satori 每张 ~1-2s，总共 ~4-8 分钟。Vercel 构建上限 45 分钟，buffer 够。实际可只在缺失时生成（与 og-test-level 同策略）。
- **localStorage 历史读取限制**：历史跨测试域名（10 个测试都在 test.jiligulu.xyz，同源没问题）。

## 实施分相

**B.1 核心（本次 ship）**：
- Reveal Overlay 组件
- Ranking API 接入 + 稀有度计算 hook
- RarityBadge 组件
- HookMatrix 组件（H1 + H2 + H4；H3 延后）
- shareCard v2（加入百分位）
- UTM 基础框架
- ResultPage 集成以上所有

**B.2 加强（后续）**：
- per-type OG 图生成 pipeline（~236 张）
- Hook H3（cross-test 推荐，需要更多数据支撑）
- Compare landing page 的 "teaser UX"（点进去先看 partner 的 card）
- 分析埋点（把 UTM 参数上报到某个地方）

## 变更日志

| 日期 | 变更 | 作者 |
|------|------|------|
| 2026-04-19 | v1 初版 | cwjjjjj + Claude |
