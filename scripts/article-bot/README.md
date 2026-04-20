# Article Bot

Daily cron：7 AM 本地时间，launchd 触发 headless Claude Code，写 + push 一篇带研究引用的文章，开 draft PR。

## Install

```bash
bash scripts/article-bot/install.sh
```

拷贝 plist 到 `~/Library/LaunchAgents/`，用 launchctl 加载。
下次触发：明天 7 AM（或 Mac 唤醒后的第一次机会）。

## Dry-run（手动跑一次，不开 PR）

```bash
DRY_RUN=1 bash scripts/article-bot/run.sh
```

会输出将传给 claude 的 prompt，不实际执行。

## 立即手动触发（真实执行）

```bash
bash scripts/article-bot/run.sh
# 或
launchctl start com.jiligulu.article-bot
```

## 日志

- stdout → `~/Library/Logs/jiligulu-article-bot.log`
- stderr → `~/Library/Logs/jiligulu-article-bot.err`

```bash
tail -f ~/Library/Logs/jiligulu-article-bot.log
```

## Uninstall

```bash
bash scripts/article-bot/install.sh --uninstall
```

## 检查任务状态

```bash
# 看是否已加载
launchctl list | grep jiligulu

# 看 plist 在不在
ls -l ~/Library/LaunchAgents/com.jiligulu.article-bot.plist
```

## 话题池管理

- 源文件：`content/articles/topic-queue.md`
- bot 会挑第一个 `-` 开头的话题
- 写完后改成 `+ (已写于 YYYY-MM-DD)`
- 跳过标记为 `! (跳过于 YYYY-MM-DD)`
- 队列耗尽时会开一个 "queue empty" PR 提醒补

## 质量期待

每天早上你应该能看到：
- GitHub 上一个 `auto-article` label 的 draft PR
- 里面有：新文章 `.md`、更新后的 topic-queue.md
- 看一眼内容，满意就 merge，有问题就关闭或手改再 merge

**不 merge 就不上线**——draft PR 不触发 Vercel 部署。

## Troubleshoot

- **PR 没出现** → 检查 `gh auth status`、logs
- **claude 命令找不到** → `which claude`，确认在 PATH 里（launchd 可能需要显式 PATH）
- **git push 401** → GitHub token 过期，`gh auth login`
- **Mac 一直休眠** → launchd 在唤醒后会跑一次。但连续休眠 >24h 会跳过。考虑切 GitHub Actions 云端 cron（方案 B，见 spec）
