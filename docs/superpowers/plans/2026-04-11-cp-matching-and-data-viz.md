# CP 配对系统 + 数据可视化 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增人格 CP 配对玩法（全量配对矩阵 + CP 卡片分享）和数据可视化增强（稀有度百分位描述 + 分布图表 + 数据向分享卡片），为多平台发帖提供差异化素材。

**Architecture:** 纯前端实现，无需新 API。CP 配对基于已有 COMPATIBILITY 表扩展为 29×29 全量矩阵（算法生成兜底配对）。数据可视化复用 `/api/ranking` 已有接口。所有新 UI 嵌入现有 tab 和结果页，不新增页面路由。

**Tech Stack:** Vanilla JS (ES6+), Canvas API (图表 + 分享卡片), 现有 CSS 变量体系

---

### Task 1: CP 配对矩阵算法

**Files:**
- Modify: `main.js:1940-1988` (COMPATIBILITY 区域之后)

- [ ] **Step 1: 实现全量 CP 配对生成函数**

在 `getCompatibility()` 函数之后（约 line 1988），添加 `generateCPMatrix()` 函数。该函数基于已有 COMPATIBILITY 手写配对 + NORMAL_TYPES 维度向量自动生成所有 29×29 组合的配对关系：

```javascript
/* ===== CP 配对矩阵 ===== */
var CP_LABELS = {
    soulmate: { icon: '\uD83D\uDC95', label: '天生一对', color: '#c62828', bg: '#fce4ec', border: '#f8bbd0' },
    rival:    { icon: '\u2694\uFE0F', label: '欢喜冤家', color: '#b8860b', bg: '#fff8e1', border: '#ffe082' },
    mirror:   { icon: '\uD83E\uDE9E', label: '同类相遇', color: '#283593', bg: '#e8eaf6', border: '#c5cae9' },
    normal:   { icon: '\uD83E\uDD1D', label: '普通关系', color: '#4d6a53', bg: '#edf6ef', border: '#dbe8dd' }
};

function getCPScore(codeA, codeB) {
    if (codeA === codeB) return { type: 'mirror', score: 100, say: '同类相遇，要么惺惺相惜，要么互相嫌弃' };

    // Check hand-written compatibility first
    var key1 = codeA + '+' + codeB;
    var key2 = codeB + '+' + codeA;
    var manual = (COMPATIBILITY && COMPATIBILITY[key1]) || (COMPATIBILITY && COMPATIBILITY[key2]);

    // Calculate vector similarity
    var patternA = null, patternB = null;
    NORMAL_TYPES.forEach(function (t) {
        if (t.code === codeA) patternA = parsePattern(t.pattern).map(levelNum);
        if (t.code === codeB) patternB = parsePattern(t.pattern).map(levelNum);
    });

    var score = 50; // default for types without patterns (DRUNK, HHHH)
    if (patternA && patternB) {
        var dist = 0;
        for (var i = 0; i < patternA.length; i++) dist += Math.abs(patternA[i] - patternB[i]);
        score = Math.max(0, Math.round((1 - dist / 30) * 100));
    }

    if (manual) {
        return { type: manual.type, score: score, say: manual.say };
    }

    // Auto-generate relationship type based on score
    var type, say;
    if (score >= 75) {
        type = 'soulmate';
        say = (TYPE_LIBRARY[codeA] || {}).cn + '和' + (TYPE_LIBRARY[codeB] || {}).cn + '，维度高度重合的灵魂搭档';
    } else if (score <= 30) {
        type = 'rival';
        say = (TYPE_LIBRARY[codeA] || {}).cn + '和' + (TYPE_LIBRARY[codeB] || {}).cn + '，性格光谱的两端';
    } else {
        type = 'normal';
        say = '普通关系，相安无事';
    }
    return { type: type, score: score, say: say };
}
```

- [ ] **Step 2: 验证函数工作正常**

在浏览器控制台测试：
```javascript
console.log(getCPScore('CTRL', 'OJBK'));  // Expected: { type: "rival", score: <number>, say: "拿捏者使出浑身解数..." }
console.log(getCPScore('CTRL', 'CTRL'));  // Expected: { type: "mirror", score: 100, say: "同类..." }
console.log(getCPScore('BOSS', 'GOGO')); // Expected: auto-generated based on vector distance
```

- [ ] **Step 3: Commit**

```bash
git add main.js
git commit -m "feat: add CP matching matrix algorithm with auto-generation for all 29 types"
```

---

### Task 2: 结果页 CP 配对推荐

**Files:**
- Modify: `main.js:1147-1177` (`renderResult` 中的相性展示部分)
- Modify: `main.css` (新增 CP 推荐样式)

- [ ] **Step 1: 扩展结果页相性展示，显示 TOP3 最佳搭档和 TOP3 冤家**

替换 `renderResult()` 中的相性展示逻辑（约 line 1147-1176），改用 `getCPScore` 全量计算：

```javascript
    // 相性展示 - 全量 CP 配对
    var compatBox = document.getElementById('compatResultBox');
    var compatList = document.getElementById('compatResultList');
    var myCode = type.code;
    var allCPs = [];
    var allCodes = Object.keys(TYPE_LIBRARY).filter(function (c) { return c !== myCode && c !== 'HHHH'; });
    allCodes.forEach(function (otherCode) {
        var cp = getCPScore(myCode, otherCode);
        allCPs.push({ code: otherCode, type: cp.type, score: cp.score, say: cp.say });
    });
    allCPs.sort(function (a, b) { return b.score - a.score; });

    var topSoulmates = allCPs.slice(0, 3);
    var topRivals = allCPs.slice(-3).reverse();

    compatBox.style.display = '';
    var html = '<div class="cp-section"><h4>💕 最佳搭档 TOP3</h4>';
    topSoulmates.forEach(function (s, i) {
        var lib = TYPE_LIBRARY[s.code] || {};
        html += '<div class="compat-result-item soulmate">' +
            '<span class="cp-rank">' + (i + 1) + '</span> ' +
            s.code + '（' + (lib.cn || '') + '）' +
            '<span class="cp-score">' + s.score + '%</span>' +
            '<div class="cp-say">' + s.say + '</div></div>';
    });
    html += '</div><div class="cp-section"><h4>⚔️ 最大冤家 TOP3</h4>';
    topRivals.forEach(function (r, i) {
        var lib = TYPE_LIBRARY[r.code] || {};
        html += '<div class="compat-result-item rival">' +
            '<span class="cp-rank">' + (i + 1) + '</span> ' +
            r.code + '（' + (lib.cn || '') + '）' +
            '<span class="cp-score">' + r.score + '%</span>' +
            '<div class="cp-say">' + r.say + '</div></div>';
    });
    html += '</div>';
    compatList.innerHTML = html;
```

- [ ] **Step 2: 添加 CP 推荐样式**

在 `main.css` 末尾追加：

```css
/* CP 配对推荐 */
.cp-section { margin-bottom: 16px; }
.cp-section h4 { font-size: 16px; margin-bottom: 10px; color: var(--text); }
.cp-rank {
    display: inline-block;
    width: 22px; height: 22px;
    background: var(--accent);
    color: #fff;
    border-radius: 50%;
    text-align: center;
    line-height: 22px;
    font-size: 12px;
    font-weight: bold;
    margin-right: 6px;
}
.cp-score {
    float: right;
    font-weight: bold;
    color: var(--accent);
    font-size: 14px;
}
.cp-say {
    font-size: 13px;
    color: var(--muted);
    margin-top: 4px;
    padding-left: 28px;
}
```

- [ ] **Step 3: 在浏览器中测试**

打开网站 → 完成测试 → 检查结果页：
- 应显示"最佳搭档 TOP3"和"最大冤家 TOP3"
- 每个条目有排名圆圈、人格代码、中文名、匹配度百分比、描述

- [ ] **Step 4: Commit**

```bash
git add main.js main.css
git commit -m "feat: show TOP3 soulmates and rivals on result page with CP scores"
```

---

### Task 3: CP 配对查询器（人格相性 Tab 增强）

**Files:**
- Modify: `index.html:73-79` (tab-compat 区域)
- Modify: `main.js` (添加 CP 查询器渲染逻辑)
- Modify: `main.css` (查询器样式)

- [ ] **Step 1: 在人格相性 Tab 添加 CP 查询器 HTML**

在 `index.html` 的 `tab-compat` 面板中，在已有的 compat-gallery 之前插入查询器：

```html
    <!-- Tab: 人格相性 -->
    <div id="tab-compat" class="tab-panel">
      <div class="card" style="margin-top:22px; padding:22px;">
        <h2 style="font-size:clamp(20px,3.5vw,28px); margin-bottom:6px; text-align:center;">CP 配对查询</h2>
        <p style="text-align:center; color:var(--muted); font-size:13px; margin-bottom:18px;">选两个人格，看看他们的 CP 值</p>
        <div class="cp-query">
          <select id="cpSelectA" class="cp-select">
            <option value="">选择人格A</option>
          </select>
          <span class="cp-query-vs">×</span>
          <select id="cpSelectB" class="cp-select">
            <option value="">选择人格B</option>
          </select>
          <button id="cpQueryBtn" class="btn-primary cp-query-btn">查看配对</button>
        </div>
        <div id="cpResult" class="cp-result-box" style="display:none;"></div>
      </div>
      <div class="compat-gallery card" style="margin-top:22px; padding:22px;">
```

- [ ] **Step 2: 添加 CP 查询器的 JS 逻辑**

在 `main.js` 的相性表渲染 IIFE（约 line 1990-2017）之后添加：

```javascript
/* ===== CP 查询器 ===== */
(function () {
    var selectA = document.getElementById('cpSelectA');
    var selectB = document.getElementById('cpSelectB');
    var btn = document.getElementById('cpQueryBtn');
    var resultBox = document.getElementById('cpResult');
    if (!selectA || !selectB) return;

    // Populate selects
    Object.values(TYPE_LIBRARY).forEach(function (t) {
        if (t.code === 'HHHH') return;
        var optA = document.createElement('option');
        optA.value = t.code;
        optA.textContent = t.code + '（' + t.cn + '）';
        selectA.appendChild(optA);
        selectB.appendChild(optA.cloneNode(true));
    });

    btn.addEventListener('click', function () {
        var a = selectA.value;
        var b = selectB.value;
        if (!a || !b) { resultBox.style.display = 'none'; return; }
        var cp = getCPScore(a, b);
        var lab = CP_LABELS[cp.type];
        var libA = TYPE_LIBRARY[a] || {};
        var libB = TYPE_LIBRARY[b] || {};
        resultBox.style.display = '';
        resultBox.innerHTML =
            '<div class="cp-result-header">' +
                '<div class="cp-result-pair">' +
                    '<span class="cp-result-code">' + a + '</span>' +
                    '<span class="cp-result-vs">×</span>' +
                    '<span class="cp-result-code">' + b + '</span>' +
                '</div>' +
                '<div class="cp-result-score">' + cp.score + '%</div>' +
            '</div>' +
            '<span class="compat-badge" style="background:' + lab.bg + ';color:' + lab.color + ';border:1px solid ' + lab.border + ';">' +
                lab.icon + ' ' + lab.label + '</span>' +
            '<div class="cp-result-say">' + cp.say + '</div>' +
            '<button class="btn-secondary cp-share-btn" id="cpShareBtn">生成 CP 卡片</button>';

        // Bind share button
        document.getElementById('cpShareBtn').addEventListener('click', function () {
            generateCPCard(a, b, cp);
        });
    });
})();
```

- [ ] **Step 3: 添加查询器样式**

在 `main.css` 末尾追加：

```css
/* CP 查询器 */
.cp-query {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
}
.cp-select {
    padding: 10px 14px;
    border: 1.5px solid var(--border);
    border-radius: 10px;
    background: var(--bg);
    font-size: 15px;
    color: var(--text);
    min-width: 140px;
}
.cp-query-vs {
    font-size: 20px;
    font-weight: bold;
    color: var(--muted);
}
.cp-query-btn { padding: 10px 20px; }
.cp-result-box {
    margin-top: 18px;
    padding: 20px;
    background: var(--bg);
    border-radius: 14px;
    border: 1.5px solid var(--border);
    text-align: center;
}
.cp-result-header {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-bottom: 14px;
}
.cp-result-pair { display: flex; align-items: center; gap: 10px; }
.cp-result-code { font-size: 22px; font-weight: bold; color: var(--text); }
.cp-result-vs { font-size: 18px; color: var(--muted); }
.cp-result-score { font-size: 36px; font-weight: bold; color: var(--accent); }
.cp-result-say { font-size: 14px; color: var(--muted); margin: 12px 0; }
.cp-share-btn { margin-top: 12px; }
```

- [ ] **Step 4: 在浏览器中测试**

打开网站 → 人格相性 Tab → 选择两个人格 → 点击查看配对：
- 应显示配对分数、关系类型徽章、描述文字、生成CP卡片按钮
- 选择已有手动配对（如 CTRL + OJBK）时应优先使用手写描述

- [ ] **Step 5: Commit**

```bash
git add index.html main.js main.css
git commit -m "feat: add CP matching query tool in compatibility tab"
```

---

### Task 4: CP 配对分享卡片

**Files:**
- Modify: `main.js` (添加 `generateCPCard` 函数)

- [ ] **Step 1: 实现 CP 配对卡片 Canvas 绘制**

在 CP 查询器 IIFE 之后添加：

```javascript
/* ===== CP 配对分享卡片 ===== */
function generateCPCard(codeA, codeB, cp) {
    var W = 840, H = 520;
    var canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    var ctx = canvas.getContext('2d');
    var lab = CP_LABELS[cp.type];
    var libA = TYPE_LIBRARY[codeA] || {};
    var libB = TYPE_LIBRARY[codeB] || {};

    // Background
    ctx.fillStyle = '#faf6f0';
    ctx.fillRect(0, 0, W, H);

    // Brand
    ctx.font = 'bold 14px -apple-system, sans-serif';
    ctx.fillStyle = '#ccc';
    ctx.textAlign = 'center';
    ctx.fillText('SBTI CP \u914D\u5BF9', W / 2, 36);

    // Left person
    ctx.font = 'bold 48px -apple-system, sans-serif';
    ctx.fillStyle = '#1a1a1a';
    ctx.fillText(codeA, W * 0.25, 110);
    ctx.font = '20px -apple-system, sans-serif';
    ctx.fillStyle = '#888';
    ctx.fillText(libA.cn || '', W * 0.25, 140);

    // VS
    ctx.font = 'bold 36px -apple-system, sans-serif';
    ctx.fillStyle = '#ddd';
    ctx.fillText('VS', W / 2, 115);

    // Right person
    ctx.font = 'bold 48px -apple-system, sans-serif';
    ctx.fillStyle = '#1a1a1a';
    ctx.fillText(codeB, W * 0.75, 110);
    ctx.font = '20px -apple-system, sans-serif';
    ctx.fillStyle = '#888';
    ctx.fillText(libB.cn || '', W * 0.75, 140);

    // Score circle
    ctx.beginPath();
    ctx.arc(W / 2, 230, 60, 0, Math.PI * 2);
    ctx.fillStyle = lab.bg;
    ctx.fill();
    ctx.strokeStyle = lab.border;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.font = 'bold 40px -apple-system, sans-serif';
    ctx.fillStyle = lab.color;
    ctx.fillText(cp.score + '%', W / 2, 245);

    // Badge
    ctx.font = 'bold 20px -apple-system, sans-serif';
    ctx.fillStyle = lab.color;
    ctx.fillText(lab.icon + ' ' + lab.label, W / 2, 320);

    // Say
    ctx.font = '16px -apple-system, sans-serif';
    ctx.fillStyle = '#666';
    var sayText = cp.say || '';
    wrapText(ctx, sayText, 60, 360, W - 120, 24);

    // Footer
    ctx.strokeStyle = '#e8e3db';
    ctx.beginPath();
    ctx.moveTo(40, 430);
    ctx.lineTo(W - 40, 430);
    ctx.stroke();

    ctx.font = '13px -apple-system, sans-serif';
    ctx.fillStyle = '#bbb';
    ctx.textAlign = 'left';
    ctx.fillText('\u626b\u7801\u6765\u6d4b\u4f60\u7684\u4eba\u683c', 40, 470);
    ctx.fillText('sbti.jiligulu.xyz', 40, 490);

    var qrSrc = generateQR(PROD_BASE_URL);
    loadImage(qrSrc).then(function (qrImg) {
        if (qrImg) ctx.drawImage(qrImg, W - 40 - 80, 445, 80, 80);

        canvasToBlob(canvas, function (blob) {
            if (!blob) { alert('\u751f\u6210\u5931\u8d25'); return; }
            currentBlob = blob;
            document.getElementById('sharePreview').src = URL.createObjectURL(blob);
            document.getElementById('shareNativeBtn').style.display = (navigator.share && navigator.canShare) ? '' : 'none';
            document.getElementById('shareModal').classList.add('active');
        });
    });
}
```

- [ ] **Step 2: 在浏览器中测试**

人格相性 Tab → 选择 CTRL × OJBK → 查看配对 → 点击"生成 CP 卡片"：
- 应弹出分享弹窗
- 卡片包含：品牌标题、两个人格代码+中文名、VS、分数圆圈、关系徽章、描述、二维码

- [ ] **Step 3: Commit**

```bash
git add main.js
git commit -m "feat: add CP matching share card generation with Canvas"
```

---

### Task 5: 数据可视化 - 稀有度百分位描述

**Files:**
- Modify: `main.js:1112-1178` (renderResult 函数)
- Modify: `main.css` (百分位徽章样式)

- [ ] **Step 1: 在结果页添加稀有度百分位描述**

在 `renderResult()` 函数中，`renderDimList(result)` 之后（约 line 1145），插入稀有度描述渲染：

```javascript
    // 稀有度百分位描述
    var rarityEl = document.getElementById('rarityBadgeResult');
    if (rarityEl) {
        var rarity = TYPE_RARITY[type.code];
        if (rarity) {
            var percentile = 0;
            var sortedTypes = Object.entries(TYPE_RARITY)
                .filter(function (e) { return e[0] !== 'DRUNK' && e[0] !== 'HHHH'; })
                .sort(function (a, b) { return a[1].pct - b[1].pct; });
            for (var ri = 0; ri < sortedTypes.length; ri++) {
                if (sortedTypes[ri][0] === type.code) {
                    percentile = Math.round(((ri + 1) / sortedTypes.length) * 100);
                    break;
                }
            }
            var rarityMsg;
            if (rarity.pct === 0) rarityMsg = '\uD83C\uDF7A \u9690\u85CF\u4EBA\u683C\uFF0C\u53EA\u6709\u89E6\u53D1\u5F69\u86CB\u624D\u80FD\u83B7\u5F97';
            else if (percentile <= 10) rarityMsg = '\uD83D\uDC8E \u4F60\u6BD4 ' + (100 - percentile) + '% \u7684\u4EBA\u66F4\u7A00\u6709\uFF0C\u5C5E\u4E8E\u6781\u7A00\u7269\u79CD';
            else if (percentile <= 30) rarityMsg = '\u2B50 \u4F60\u6BD4 ' + (100 - percentile) + '% \u7684\u4EBA\u66F4\u7A00\u6709\uFF0C\u76F8\u5F53\u5C11\u89C1';
            else if (percentile <= 60) rarityMsg = '\u2728 \u4F60\u7684\u4EBA\u683C\u7A00\u6709\u5EA6\u9002\u4E2D\uFF0C\u4E0D\u591A\u4E5F\u4E0D\u5C11';
            else rarityMsg = '\uD83C\uDF3F \u4F60\u7684\u4EBA\u683C\u6BD4\u8F83\u5E38\u89C1\uFF0C\u6709\u5F88\u591A\u540C\u7C7B';
            rarityEl.textContent = rarityMsg;
            rarityEl.style.display = '';
        } else {
            rarityEl.style.display = 'none';
        }
    }
```

- [ ] **Step 2: 在 index.html 结果页添加稀有度徽章元素**

在 `index.html` 的 `matchBadge` 之后（约 line 176-177 之间）添加：

```html
                <div class="rarity-badge-result" id="rarityBadgeResult" style="display:none;"></div>
```

- [ ] **Step 3: 添加样式**

在 `main.css` 末尾追加：

```css
/* 结果页稀有度百分位 */
.rarity-badge-result {
    margin-top: 10px;
    padding: 8px 16px;
    background: linear-gradient(135deg, #fce4ec, #ede7f6);
    border-radius: 20px;
    font-size: 14px;
    color: #6a1b9a;
    text-align: center;
    font-weight: 500;
}
```

- [ ] **Step 4: 在浏览器中测试**

完成测试 → 结果页应在匹配度下方显示稀有度百分位描述，如"💎 你比 92% 的人更稀有，属于极稀物种"

- [ ] **Step 5: Commit**

```bash
git add main.js main.css index.html
git commit -m "feat: add rarity percentile badge on result page"
```

---

### Task 6: 数据可视化 - 全站分布图表

**Files:**
- Modify: `main.js:1399-1451` (renderRanking 函数区域)
- Modify: `index.html:83-104` (tab-ranking 区域)
- Modify: `main.css` (图表样式)

- [ ] **Step 1: 在排行榜 Tab 添加分布图表容器**

在 `index.html` 的 `rankingContent` div 内，`rankingList` 之前（约 line 102）插入：

```html
          <div class="dist-chart-box">
            <h3 style="font-size:16px; margin-bottom:12px; text-align:center;">人格分布图</h3>
            <canvas id="distChart" width="760" height="300" style="width:100%; max-width:760px; margin:0 auto; display:block;"></canvas>
          </div>
```

- [ ] **Step 2: 实现分布图表绘制函数**

在 `renderRanking()` 函数中（约 line 1437，在 `rankingList.innerHTML = ...` 赋值之后），添加分布图表绘制：

```javascript
            // Draw distribution chart
            drawDistChart(data.list, data.total);
```

然后在 `renderRanking` 函数之前添加绘制函数：

```javascript
function drawDistChart(list, total) {
    var canvas = document.getElementById('distChart');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W = canvas.width, H = canvas.height;
    var pad = { top: 10, right: 20, bottom: 60, left: 20 };
    var chartW = W - pad.left - pad.right;
    var chartH = H - pad.top - pad.bottom;

    ctx.clearRect(0, 0, W, H);

    if (!list || list.length === 0) return;

    var maxCount = list[0].count;
    var barW = Math.floor(chartW / list.length) - 4;
    var barGap = 4;

    list.forEach(function (item, i) {
        var barH = Math.max(2, (item.count / maxCount) * chartH);
        var x = pad.left + i * (barW + barGap);
        var y = pad.top + chartH - barH;

        // Bar color based on rarity
        var rarity = TYPE_RARITY[item.code];
        var colors = ['#c8dccb', '#a5d6a7', '#ffe082', '#f8bbd0', '#ce93d8'];
        ctx.fillStyle = rarity ? colors[rarity.stars - 1] : '#c8dccb';
        ctx.beginPath();
        ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
        ctx.fill();

        // Percentage label on top
        var pct = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0';
        ctx.font = '10px -apple-system, sans-serif';
        ctx.fillStyle = '#999';
        ctx.textAlign = 'center';
        ctx.fillText(pct + '%', x + barW / 2, y - 4);

        // Type code label at bottom
        ctx.save();
        ctx.translate(x + barW / 2, pad.top + chartH + 8);
        ctx.rotate(Math.PI / 4);
        ctx.font = '11px -apple-system, sans-serif';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'left';
        ctx.fillText(item.code, 0, 0);
        ctx.restore();
    });
}
```

- [ ] **Step 3: 添加图表容器样式**

在 `main.css` 末尾追加：

```css
/* 分布图表 */
.dist-chart-box {
    margin-bottom: 22px;
    padding: 16px 0;
    border-bottom: 1px solid var(--border);
}
```

- [ ] **Step 4: 在浏览器中测试**

打开网站 → 全站排行 Tab：
- 应在排行列表上方显示柱状分布图
- 柱子颜色按稀有度着色（绿→黄→粉→紫）
- 每个柱子上方有百分比，下方有类型代码（旋转45度）

- [ ] **Step 5: Commit**

```bash
git add main.js main.css index.html
git commit -m "feat: add personality distribution bar chart on ranking tab"
```

---

### Task 7: 数据可视化 - 稀有度分享卡片增强

**Files:**
- Modify: `main.js:1685-1853` (drawShareCard 函数)

- [ ] **Step 1: 在分享卡片中加入稀有度信息**

在 `drawShareCard()` 函数中，Match badge 绘制之后（约 line 1779 之后），添加稀有度标签：

```javascript
            // Rarity badge on share card
            var rarity = TYPE_RARITY[type.code];
            if (rarity) {
                infoY += 14;
                var starStr = rarity.stars <= 4 ? '\u2605'.repeat(rarity.stars) : '\uD83D\uDC8E';
                if (type.code === 'DRUNK') starStr = '\uD83C\uDF7A';
                var rarityText = starStr + ' ' + rarity.label + ' ' + rarity.pct + '%';
                ctx.font = '14px -apple-system, sans-serif';
                var rw = ctx.measureText(rarityText).width;
                var rarityColors = {
                    1: { bg: '#edf6ef', color: '#6a786f' },
                    2: { bg: '#e8f0ea', color: '#4d6a53' },
                    3: { bg: '#fff8e1', color: '#b8860b' },
                    4: { bg: '#fce4ec', color: '#c62828' },
                    5: { bg: '#ede7f6', color: '#6a1b9a' }
                };
                var rc = rarityColors[rarity.stars];
                ctx.fillStyle = rc.bg;
                ctx.beginPath();
                ctx.roundRect(infoX, infoY, rw + 20, 28, 14);
                ctx.fill();
                ctx.fillStyle = rc.color;
                ctx.fillText(rarityText, infoX + 10, infoY + 19);
            }
```

- [ ] **Step 2: 在浏览器中测试**

完成测试 → 生成分享图 → 分享卡片中应显示稀有度标签（如"★★★★ 稀有 1.714%"），在 MATCH 徽章下方

- [ ] **Step 3: Commit**

```bash
git add main.js
git commit -m "feat: add rarity badge to share card image"
```

---

### Task 8: 结果页"邀请好友测 CP"引导优化

**Files:**
- Modify: `index.html:226-233` (result-actions 区域)
- Modify: `main.css` (引导样式)

- [ ] **Step 1: 在结果页操作按钮区添加 CP 引导文案**

在 `index.html` 的 `result-actions` div 内（约 line 226），在按钮行之前插入引导文案：

```html
          <div class="result-actions">
            <div class="cp-invite-hint" id="cpInviteHint">
              <p>🔥 想知道你和朋友的 CP 值吗？分享邀请链接，对方测完直接看对比！</p>
            </div>
            <div style="display:flex; gap:12px; flex-wrap:wrap;">
```

- [ ] **Step 2: 添加引导样式**

在 `main.css` 末尾追加：

```css
/* CP 邀请引导 */
.cp-invite-hint {
    margin-bottom: 14px;
    padding: 12px 16px;
    background: linear-gradient(135deg, #fce4ec, #fff8e1);
    border-radius: 12px;
    text-align: center;
}
.cp-invite-hint p {
    margin: 0;
    font-size: 14px;
    color: #c62828;
    font-weight: 500;
}
```

- [ ] **Step 3: 在浏览器中测试**

完成测试 → 结果页操作区上方应显示粉黄渐变的引导条："🔥 想知道你和朋友的 CP 值吗？..."

- [ ] **Step 4: Commit**

```bash
git add index.html main.css
git commit -m "feat: add CP invite call-to-action hint on result page"
```

---

### Task 9: 全局功能验证与清理

**Files:**
- 所有修改过的文件

- [ ] **Step 1: 全流程测试**

按以下路径测试所有新功能：

1. 首页 → 开始测试 → 完成 31 题 → 跳过广告 → 结果页
   - 验证：稀有度百分位描述显示正确
   - 验证：CP 配对 TOP3 搭档/冤家显示正确
   - 验证：CP 邀请引导条显示
2. 结果页 → 生成分享图
   - 验证：分享卡片包含稀有度徽章
3. 结果页 → 邀请好友对比 → 生成邀请图
   - 验证：邀请图正常生成
4. 人格相性 Tab → CP 查询器
   - 验证：选择两个人格后显示配对结果
   - 验证：点击"生成 CP 卡片"弹出分享弹窗
   - 验证：手写配对（如 CTRL+OJBK）优先使用手写描述
5. 全站排行 Tab
   - 验证：分布图表正确渲染
   - 验证：颜色按稀有度分级
6. 使用 #test debug 模式切换不同人格验证

- [ ] **Step 2: 检查控制台是否有 JS 错误**

打开 DevTools → Console，完整走一遍上述流程，确保无报错。

- [ ] **Step 3: 移动端响应式验证**

使用 Chrome DevTools 的设备模拟器，测试 iPhone SE (375px) 和 iPad (768px) 下：
- CP 查询器的两个 select 应换行显示
- 分布图表应自适应宽度
- CP 配对推荐列表应正常显示

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: final verification and cleanup for CP matching and data viz features"
```
