# SBTI 多端迁移设计文档

## 概述

将现有 SBTI 人格测试项目（纯 HTML/CSS/JS）迁移到 Taro 跨端框架，支持 H5（优先）和微信小程序。后端 API 保持不动。

## 技术栈

- **框架**: Taro 3.x + React 18 + TypeScript
- **样式**: Tailwind CSS + `weapp-tailwindcss` 插件（不使用 Emotion，小程序不兼容）
- **包管理**: pnpm workspace (Monorepo)
- **编译目标**: H5 + weapp（微信小程序）
- **不使用 UI 库**，基于 Tailwind 手写组件

## 项目结构

```
sbti/
├── packages/
│   ├── api/              # 现有 Vercel Functions（不动）
│   │   ├── ranking.js    # 排行榜接口
│   │   ├── record.js     # 提交测试结果接口
│   │   └── seed.js       # 种子数据接口
│   └── taro-app/         # Taro 前端项目
│       ├── src/
│       │   ├── app.tsx
│       │   ├── app.config.ts
│       │   ├── pages/
│       │   │   ├── home/index.tsx        # 首页 + 人格一览
│       │   │   ├── profiles/index.tsx    # 人格介绍
│       │   │   ├── compat/index.tsx      # 人格相性
│       │   │   ├── ranking/index.tsx     # 全站排行 + 本地历史
│       │   │   ├── test/index.tsx        # 逐题答题
│       │   │   └── result/index.tsx      # 结果 + 分享图
│       │   ├── components/               # 公共组件
│       │   │   ├── PersonalityCard/      # 人格卡片
│       │   │   ├── QuestionCard/         # 答题卡
│       │   │   ├── CompatMatrix/         # 相性矩阵
│       │   │   └── ShareCanvas/          # 分享图绘制
│       │   ├── constants/                # 静态数据
│       │   │   ├── questions.ts          # 测试题目
│       │   │   ├── personalities.ts      # 27种人格定义
│       │   │   └── compatibility.ts      # 相性矩阵数据
│       │   ├── utils/
│       │   │   ├── request.ts            # Taro.request 封装
│       │   │   ├── storage.ts            # Taro.setStorage 封装
│       │   │   └── share.ts              # 分享图 Canvas 绘制
│       │   ├── hooks/
│       │   │   ├── useTest.ts            # 测试流程逻辑
│       │   │   └── useRanking.ts         # 排行榜数据
│       │   └── assets/                   # 图片资源（27个人格头像）
│       ├── tailwind.config.ts
│       ├── postcss.config.js
│       └── tsconfig.json
├── pnpm-workspace.yaml
└── package.json
```

## 页面设计

### TabBar 页面（4个）

| 页面 | 路径 | 功能 |
|-----|------|------|
| 首页 | `/pages/home/index` | Hero 区域 + 开始测试按钮 + 人格一览网格（含稀有度切换） |
| 人格介绍 | `/pages/profiles/index` | 27种人格卡片展示，点击查看详情 |
| 人格相性 | `/pages/compat/index` | 相性矩阵表，支持筛选 |
| 全站排行 | `/pages/ranking/index` | 排行榜（API）+ 本地测试历史（Storage） |

### 普通页面（2个）

| 页面 | 路径 | 功能 |
|-----|------|------|
| 测试流程 | `/pages/test/index` | 逐题展示，上/下一题导航，进度条 |
| 测试结果 | `/pages/result/index` | 结果展示 + Canvas 分享图 + 分享/保存 |

## 跨端差异处理

| 功能 | H5 | 微信小程序 |
|-----|-----|----------|
| 分享图生成 | Taro Canvas API 绘制 | 同左（统一方案） |
| 二维码 | Canvas 绘制 | 小程序码 / Canvas 绘制 |
| 本地存储 | `Taro.setStorageSync` / `getStorageSync` | 同左（API 统一） |
| 分享 | 复制链接 + 保存图片到相册 | 微信原生转发（`onShareAppMessage`）+ 保存图片 |
| API 调用 | `Taro.request`，baseURL 通过环境变量配置 | 同左，需在小程序后台配置域名白名单 |
| 调试模式 | 域名判断自动激活 | 通过编译环境变量控制 |

## 数据层

- **状态管理**: React `useState` + `useContext`，不引入 Redux
- **API 请求**: 统一 `request.ts` 封装
  - H5: baseURL 为当前域名 `/api/`
  - 小程序: baseURL 为线上域名 `https://sbti.fancc.de5.net/api/`
- **静态数据**: 从现有 `main.js` 提取题目、人格定义、相性矩阵为 TypeScript 常量文件
- **本地历史**: `Taro.setStorage` / `Taro.getStorage` 统一封装

## 后端

保持现有 Vercel Functions 不变：

- `api/record.js` — POST 提交测试结果，写入 Upstash Redis
- `api/ranking.js` — GET 获取排行榜数据
- `api/seed.js` — 种子/模拟数据

Monorepo 中 `packages/api/` 目录即为现有 API 代码的迁移位置。

## 迁移策略

1. 搭建 Monorepo 骨架 + Taro 项目初始化 + Tailwind 配置
2. 从 `main.js` 提取静态数据为 TypeScript 常量
3. 逐页面迁移（按依赖顺序）：
   - 首页（入口 + 人格一览）
   - 测试流程（答题逻辑）
   - 测试结果（结果计算 + 分享图）
   - 全站排行（API 对接 + 本地历史）
   - 人格介绍（卡片展示）
   - 人格相性（矩阵表）
4. H5 端验证全部功能
5. 编译微信小程序，处理跨端差异
6. 样式精调，确保两端视觉一致
