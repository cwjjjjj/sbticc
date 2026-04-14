# SBTI 暗黑重设计 + React 技术栈迁移

**日期**: 2026-04-12
**范围**: 整站前端重构（后端 API 不动）

## 目标

1. 解决首屏空、缺社交证明、视觉调性与"毒舌测试"不匹配的问题
2. 技术栈从 Vanilla JS 迁移到 React 生态
3. 全站统一暗黑视觉风格

## 目标用户

从 B站/小红书社交分享链接进入的用户，已对"人格测试"有兴趣，需要首屏立即传达"好玩"和"很多人在玩"的信号。

## 技术栈

| 类别 | 选型 |
|------|------|
| 构建工具 | Vite |
| 框架 | React 18+ |
| 样式 | Tailwind CSS + Emotion CSS |
| 动画 | Framer Motion |
| 部署 | Vercel（保持现有配置） |
| 后端 | 现有 Vercel Serverless Functions（不改动） |

## 视觉方向

**极简暗黑 + 挑衅文案**

- 主背景: `#080808` 纯黑
- 表面色: `#111111` / `#1a1a1a`
- 边框: `#222222`
- 主强调色: `#ff3b3b`（红）
- 辅助强调色: `#ffaa00`（暖橙）
- 字体: JetBrains Mono（品牌/数据） + Noto Sans SC（正文）
- 噪点纹理覆盖全局
- 微光晕（radial gradient）作为氛围装饰

## 页面设计

### 1. 导航栏

- 固定顶部，暗黑毛玻璃（`backdrop-filter: blur(20px)`）
- 品牌: `S[B]TI`，B 字红色高亮
- Tab 切换: 首页 / 人格介绍 / 人格相性 / 全站排行
- 右侧 CTA: "开始测试" 红色按钮
- 移动端隐藏 tab 文字，保留品牌和 CTA

### 2. 首页 Hero

- 绿色脉冲圆点 + "已有 X 人完成审判" 徽章（数据从 /api/ranking 获取）
- 巨大 `SBTI` 标题（JetBrains Mono, clamp(72px, 12vw, 140px)）
- 红橙渐变分割线
- "MBTI 已经过时。**这个会骂你。**"
- "31 道题 / 15 个维度 / 29 种人格 / 每一种都不太客气"
- 三项统计: 人已测试 | 种人格 | 道毒题
- 白色 CTA 按钮 "开始测试"
- "不敢？那就算了。" 挑衅副文案
- 实时动态 ticker: "刚刚有人测出了 [TYPE] [CN] · X秒前"
  - 数据来源：取排行榜数据中的随机类型模拟，或基于 localStorage 最近结果

### 3. 人格卡片预览（首页下方）

- 横向滚动卡片列表
- 每张卡片: 类型代码（彩色）+ 中文名 + 稀有度标签 + 占比
- 每种人格一个独特颜色
- Framer Motion: 卡片入场 stagger 动画 + hover 上浮

### 4. 测试流程（全屏覆盖）

- 全屏暗色沉浸式
- 顶部渐变进度条（红→橙）+ 数字进度
- 单题模式，选项卡片式
- 选项 hover 高亮边框，选中红色边框 + 红色背景透明度
- 选完自动延迟 300ms 后 Framer Motion 滑入下一题
- 上一题/下一题导航按钮
- 提交按钮（最后一题答完后显示）

### 5. 结果页

- 人格海报图 + 类型信息（代码、中文名、匹配度）
- "该人格的简单解读" 描述区
- 15 维度评分条（L/M/H 三级，颜色区分）
- 相性关系列表（灵魂伴侣 💕 / 欢喜冤家 ⚔️）
- 操作按钮: 生成分享图 / 邀请好友对比 / 重新测试 / 回到首页
- 友情提示区
- 作者的话（可折叠）
- Framer Motion: 各区域 stagger 入场动画

### 6. 分享图生成

- Canvas 直绘方式保持不变（已有的 drawShareCard 逻辑）
- 分享图视觉更新为暗色主题
- 分享弹窗: 预览 + 保存图片 / 复制链接 / 分享给好友

### 7. 排行榜

- 统计卡片: 总测试次数 / 已解锁人格
- 排行列表: 排名（金银铜色）+ 类型代码 + 中文名 + 占比条 + 次数
- 我的测试记录（localStorage）: 本地统计 + 历史列表

### 8. 人格相性表

- 卡片网格展示所有相性关系
- 分类标签: 天生一对 💕 / 欢喜冤家 ⚔️

### 9. 双人对比

- VS 视图: 两人头像 + 类型信息
- Canvas 雷达图叠加（保持现有绘制逻辑）
- 相似度大数字展示
- 相性评语
- URL hash 编码的对比链接分享

## 动画规范（Framer Motion）

| 场景 | 动画 |
|------|------|
| 页面入场 | 元素 fadeInUp，stagger 间距 0.1s |
| 题目切换 | 当前题滑出 + 下一题滑入（水平方向） |
| 选项选中 | scale 微弹 + 边框颜色过渡 |
| 结果揭晓 | 类型代码放大入场 + 信息逐行 stagger |
| 卡片 hover | translateY(-4px) + 顶部强调条 opacity |
| 进度条 | width 弹性过渡 |
| Ticker | 淡入淡出循环 |

## 需要完整迁移的功能清单

1. 测试题目渲染 + 答案收集
2. 题目随机打乱 + 特殊题目插入
3. DRUNK 隐藏人格触发机制
4. 结果向量计算 + 匹配排名
5. 低匹配度兜底（HHHH）
6. 15 维度评分展示 + 解读文案
7. 相性关系展示
8. 分享图 Canvas 直绘 + 下载/原生分享
9. 对比功能（编码/解码/雷达图/URL 分享）
10. 排行榜 API 调用 + 渲染
11. 本地测试历史（localStorage）
12. 人格一览画廊 + 稀有度切换（理论/真实）
13. 相性表画廊
14. 付费墙逻辑（Stripe + 中文 QR，当前已注释但需保留代码）
15. 插页广告（5s 倒计时，当前启用）
16. Monetag 广告脚本集成
17. Debug 工具栏（test 域名）
18. `#test` 路由自动填充
19. `#compare=` 路由对比页面
20. 旧域名跳转
21. vConsole（test 域名）
22. Vercel Analytics + Speed Insights
23. 彩蛋/easter egg 机制

## 项目结构（React）

```
src/
├── main.tsx                 # 入口
├── App.tsx                  # 路由 + 全局布局
├── theme/
│   ├── tokens.ts            # 颜色、字体等设计 token
│   └── global.ts            # Emotion 全局样式
├── data/
│   ├── dimensions.ts        # dimensionMeta, dimensionOrder, DIM_EXPLANATIONS
│   ├── questions.ts         # questions, specialQuestions
│   ├── types.ts             # TYPE_LIBRARY, NORMAL_TYPES, TYPE_RARITY
│   ├── typeImages.ts        # TYPE_IMAGES (base64), SHARE_IMAGES
│   └── compatibility.ts     # COMPATIBILITY
├── hooks/
│   ├── useQuiz.ts           # 答题状态管理
│   ├── useResult.ts         # 结果计算
│   ├── useRanking.ts        # 排行榜数据获取
│   └── useLocalHistory.ts   # localStorage 历史记录
├── utils/
│   ├── matching.ts          # 向量匹配算法
│   ├── compare.ts           # CompareUtil 编码/解码
│   ├── shareCard.ts         # Canvas 分享图绘制
│   └── qr.ts                # QR 生成
├── components/
│   ├── Nav.tsx
│   ├── Hero.tsx
│   ├── TypeCardsPreview.tsx
│   ├── Quiz/
│   │   ├── QuizOverlay.tsx
│   │   ├── QuestionCard.tsx
│   │   └── ProgressBar.tsx
│   ├── Result/
│   │   ├── ResultPage.tsx
│   │   ├── DimList.tsx
│   │   ├── CompatResult.tsx
│   │   └── ShareModal.tsx
│   ├── Ranking/
│   │   ├── RankingPage.tsx
│   │   └── LocalHistory.tsx
│   ├── Profiles/
│   │   └── ProfilesGallery.tsx
│   ├── Compat/
│   │   └── CompatTable.tsx
│   ├── Compare/
│   │   ├── ComparePage.tsx
│   │   └── RadarChart.tsx
│   └── common/
│       ├── Ticker.tsx
│       └── Interstitial.tsx
└── index.css                # Tailwind 入口
```

## 不改动的部分

- `api/record.js` — Redis 记录
- `api/ranking.js` — 排行榜查询
- `api/create-checkout.js` — Stripe 支付
- `api/verify.js` — 支付验证
- `images/` 目录 — 人格图片资源
- `sw.js` — Monetag service worker

## 实施流程

1. 新建 `feat/dark-react-redesign` 分支
2. Vite + React + Tailwind + Emotion + Framer Motion 项目搭建
3. 数据层迁移（types, questions, dimensions 等）
4. 逐页面实现: 首页 → 测试流程 → 结果页 → 排行榜 → 对比 → 分享
5. 每个页面完成后用 Playwright 自测功能
6. 全部完成后用户终检
7. 用户确认后推送部署
