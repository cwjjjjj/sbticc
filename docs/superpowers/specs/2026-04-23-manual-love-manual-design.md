---
title: 我的使用说明书 — 测试设计文档
date: 2026-04-23
status: approved
---

# 我的使用说明书

**ID**: `manual`  
**路径**: `/manual`  
**主题**: 生成你在亲密关系中的操作手册——6个维度，16种类型，可分享给伴侣。

## 6 维度

| 代码 | 名称 | A 极 | B 极 |
|------|------|------|------|
| D1 | 亲密需求 | H 黏（高频陪伴） | L 疏（需要空间） |
| D2 | 焦虑体质 | A 暗涌（高焦虑） | S 稳定（情绪稳） |
| D3 | 情绪表达 | O 说出来 | I 藏起来 |
| D4 | 投入节奏 | F 快热 | C 慢热 |
| D5 | 安全感频道 | V 需要言语确认 | B 看行动说话 |
| D6 | 冲突修复 | T 主动谈 | W 等待/回避 |

计分：每维度 4 题，值 1–4，总分 4–16；≤10 → A，>10 → B

## 16 种类型

| 代码 | 模式 | 中文名 |
|------|------|--------|
| BOOM | AAAAAA | 易燃易爆炸 |
| LEAK | AAAAAB | 防水不防泪 |
| CORE | AABABA | 内核过热 |
| MUTE | AABBBB | 永久静音 |
| SAFE | ABAABA | 全天候稳定 |
| PING | ABABAA | 缓慢充能中 |
| DARK | ABBABA | 深层运行 |
| HOLD | ABBBBB | 静默储蓄 |
| GLTH | BAAAAA | 信号时好时坏 |
| HALT | BABABA | 过热保护已开启 |
| GOST | BABBBB | 随时离线 |
| DRFT | BAAAAB | 草稿箱已满 |
| FREE | BBAABA | 断网照常运行 |
| FLOW | BBABAA | 优雅输出 |
| LONE | BBBBBA | 独立运行中 |
| VOID | BBBBBB | 真·孤岛系统 |

隐藏类型：CRASH（系统崩溃中）— 触发条件：特殊问题选值 4

## 题目结构

- 24 道常规题（每维度 4 题）+ 1 道特殊触发题
- 匹配参数：maxDistance=12，similarityThreshold=60，fallback=SAFE
