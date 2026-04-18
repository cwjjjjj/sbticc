---
name: ChatHub 批量生图 Handoff
description: 接手指令——用 chrome-devtools-mcp 连接用户已开 remote debugging 的 Chrome，通过 ChatHub 批量生成 10 个测试所有类型的插画卡。
type: handoff
status: ready
author: cwjjjjj + Claude
created: 2026-04-18
---

# ChatHub 批量生图·Handoff

## 背景

GSTI / FPI / FSI / MPI 四个新测试已全部上线（见 `git log origin/main` 开头）。除 SBTI 外，**所有测试的类型图片都是空占位**，结果页/分享卡/排行榜都靠 CSS 生成卡兜底。用户希望用 ChatHub 的 Image Generator 批量生成真插画替换占位。

## 环境就绪状态

### 用户端已完成
- ✅ 启用 Chrome 的 remote debugging（`chrome://inspect/#remote-debugging`）
- ✅ 已登录 `https://app.chathub.gg/image-generator`（**无限额度**）
- ✅ 已在 `~/.claude.json` 的 `mcpServers` 加入 `chrome-devtools`（使用 `--autoConnect`，Chrome 144+）

### 接手 AI 需要做
- 重启 Claude Code 会话（之前会话为配置 MCP 已结束）
- 重启后 `mcp__chrome_devtools__*` 一套工具应该可用
- 运行 `mcp__chrome_devtools__list_pages` 或类似工具，确认能看到用户已打开的 ChatHub tab

## ChatHub 操作流程（需实地验证一次）

**已知信息（用户描述 + 截图）**：
- URL: `https://app.chathub.gg/image-generator`
- 顶部标题 "Image Generator"
- 中间 textarea：`Describe the image you want to create...`（最多 2000 字）
- 下方左：模型选择下拉（默认 Nano Banana 2）
- 下方中：Size 下拉（默认 Auto size；需改成 1:1 Square）
- 下方右：Generate 按钮

**可选模型（11 个）**：
| 模型 | 特点 | 推荐 |
|------|------|------|
| Nano Banana 2 | Google 最新 Imagen | 中等 |
| Nano Banana Pro | Google 顶级 | ⭐ 首选 |
| Imagen 4 | Google | 备选 |
| Seedream 4.5 | 字节跳动，中国面孔最强 | ⭐⭐ 首选 |
| FLUX.2 | SD 系最新 | 备选 |
| Qwen-Image | 阿里，擅长中文 | 备选 |
| Z Image | - | ? |
| Fast SDXL | 快速但粗糙 | 跳过 |
| GPT Image 1.5 | DALL-E 继任 | 备选 |
| Recraft V3 | 矢量/设计向 | 适合 UI 元素 |

**推荐测试对比**：用一条 prompt 分别跑 Seedream 4.5 / Nano Banana Pro / FLUX.2，挑最好的那个批量跑 ~100 张。

## 批量生图流程

### 1. 打开 ChatHub tab（浏览器已登录）
```
mcp__chrome_devtools__list_pages
# 找到 chathub.gg 的 tab，get_page_by_url 或类似
```

### 2. 挑一个模型做测试对比
用 `M_GOLD` 挖金壮男的 prompt 跑 3 次（3 个模型），让用户看截图投票。Prompt 在 `docs/superpowers/assets/2026-04-18-gsti-type-images-prompts.md` 第 3 条。

### 3. 批量循环
伪代码：
```
for each prompt in [GSTI prompts, FPI prompts, FSI prompts, MPI prompts]:
    1. click prompt textarea
    2. clear previous content
    3. type the prompt
    4. click Generate
    5. wait for image to appear（一般 15-60 秒）
    6. right-click image → save as `src/data/<test>/images/<CODE>.png`
       （或者用 chrome-devtools-mcp 的 download 能力）
    7. 记录进度到本 handoff md 的"生图日志"区
    8. 继续下一张
```

### 4. 图片存档约定

| 测试 | 目录 | 命名 |
|------|------|------|
| GSTI | `src/data/gsti/images/` | `M_GOLD.png` / `F_PHNX.png` / `UNDEF.png` / `HWDP.png`（42 张） |
| FPI | `src/data/fpi/images/` | `FILTR.png` / `9PIC!.png` / `0POST.png` / `FEED?.png`（22 张，**注意特殊字符**） |
| FSI | `src/data/fsi/images/` | `COPYX.png` / `BOSSY.png` / `FAMX?.png`（20 张） |
| MPI | `src/data/mpi/images/` | `LIVE!.png` / `2HAND.png` / `ZERO$.png` / `MIXDR.png`（20 张） |

**特殊字符文件名**：`!`, `?`, `$`, `+`, `-` 在 macOS/Linux 能用但要 quote。推荐用**双重映射**：文件名用 safe 形式（`FILTR` / `_9PIC` / `ZERO_DOLLAR`），然后在 typeImages.ts 里做 `'0POST' → 0POST.png` 映射。

或者统一清洗：把 `!`→`X`，`?`→`Q`，`$`→`S`，`+`→`P`，保持 typeImages.ts 的 key 还是原 code。

### 5. 接入步骤（每个测试生完图后）

```typescript
// src/data/gsti/typeImages.ts
import m_gold from './images/M_GOLD.png';
import m_huby from './images/M_HUBY.png';
// ... 所有 import（写脚本批量生成这些 import 行）

export const TYPE_IMAGES: Record<string, string> = {
  M_GOLD: m_gold,
  M_HUBY: m_huby,
  // ...
};

export const SHARE_IMAGES: Record<string, string> = { ...TYPE_IMAGES };
```

然后：
- `npx tsc --noEmit` 确认编译过
- `bash build.sh` 验证打包能 copy PNG
- `git add src/data/<test>/images/ src/data/<test>/typeImages.ts`
- `git commit -m "feat(<test>): add <N> type images"`
- 推到 main 测试 Vercel 部署

## Prompts 文件总清单

四份 MJ/ChatHub prompts 文件，每个测试独立：

| 测试 | Prompts 文件 | 张数 | 调性 |
|------|-------------|------|------|
| GSTI | `docs/superpowers/assets/2026-04-18-gsti-type-images-prompts.md` | 42 | 辛辣反串 / 深红 |
| FPI | `docs/superpowers/assets/2026-04-18-fpi-type-images-prompts.md` | 22 | 社交媒体 / 蓝绿 |
| FSI | `docs/superpowers/assets/2026-04-18-fsi-type-images-prompts.md` | 20 | 温柔家庭 / 暖琥珀 |
| MPI | `docs/superpowers/assets/2026-04-18-mpi-type-images-prompts.md` | 20 | 金色发票 / 消费主义 |

**总计：104 张图**。按每张 30-60 秒 + 2 秒下载 = 60-90 分钟批处理（如果能完全自动化）。

## 剩余测试（暂不生图）

以下测试**不在本次生图范围**，等 GSTI/FPI/FSI/MPI 生完再决定：
- **SBTI** — 已有 base64 内嵌图（`src/data/typeImages.ts`），质量 OK，暂不替换
- **Cyber / Desire / Love / Values / Work** — 5 个旧测试 typeImages 也是空占位，但优先级低；等 4 个新测试上图后看需求

若后续要做这 5 个，需要先为它们写 prompts 文件（类似本次 FPI/FSI/MPI 的做法）。

## 风险与注意事项

### 版权 / 合规
- **不要生成真实品牌 logo** —— 尤其是 MPI（避免 淘宝/京东/shein 等识别度高的品牌）
- **不要生成真实名人脸** —— MJ/Imagen 可能会无意 match 到名人
- **尊重隐私** —— 图里不应出现真实可识别的用户信息
- **性别对立话题（GSTI）** —— 已有免责声明；图片本身也要避免性别贬低，保持"反串梗"荒诞感而非恶意

### 文件名 cross-platform
- `?` `!` `$` 在 Windows NTFS 非法。即使 Vercel 部署是 Linux，开发机若用 Windows 会翻车。
- **强烈推荐**：生图时用 safe 文件名，typeImages.ts 里做 key → path 映射。

### Vite build 资源复制
- Vite 默认会处理 `import './images/foo.png'` 的 asset pipeline，但要确认 `build.sh` 的产物里有这些 PNG（可能在 `dist/assets/` 里以 hash 文件名存在）。
- 测试方法：build 后 `ls dist/assets/ | grep -i m_gold` 看是否有 hash 后的对应文件。

## 生图日志（接手者每批次更新）

> 每生完一批图就在此追加一条记录，方便下次接手或追溯。

| 日期 | 测试 | 张数 | 模型 | Commit | 备注 |
|------|------|------|------|--------|------|
| - | - | - | - | - | 待开始 |

## 接手 AI 的第一条指令模板

```
Read docs/superpowers/assets/2026-04-18-chathub-image-gen-handoff.md
然后按 "批量生图流程" 的 4 步推进。先做对比测试（3 个模型），
把 3 张测试图的截图给用户看，等他选定一个模型。之后开始 GSTI 42 张的批量。
每生 10 张图 commit 一次。
```

## 变更日志

| 日期 | 变更 | 作者 |
|------|------|------|
| 2026-04-18 | v1 初版 handoff | cwjjjjj + Claude |
