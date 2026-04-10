# SBTI Monetization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add ad system (Monetag), paywall with Stripe + Chinese payment QR, and watermarked share images to monetize SBTI personality test.

**Architecture:** Monetag SDK handles ads globally (interstitial + banners). Stripe Checkout handles overseas payments via two new Vercel serverless endpoints (`/api/create-checkout`, `/api/verify`). Chinese users see a payment QR code modal with trust-based unlock. The result page splits into free (basic type info) and paid (dimension explanations, ad-free, clean share image) tiers. Share images get a watermark with site URL for free users.

**Tech Stack:** Vanilla JS (no framework), Vercel serverless functions, Stripe Node SDK, Monetag ad SDK (script tag), Upstash Redis (existing)

---

### Task 1: Add Monetag Ad SDK and Containers

**Files:**
- Modify: `index.html`
- Modify: `main.css`

- [ ] **Step 1: Add Monetag SDK script to index.html**

Add the Monetag SDK script tag in `<head>`, right after the qrcode-generator script. The `MONETAG_SITE_ID` is a placeholder — replace with real ID after registering on Monetag.

In `index.html`, after line 9 (`<script src="https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js" defer></script>`), add:

```html
<!-- Monetag Ads -->
<script src="https://alwingulla.com/88/tag.min.js" data-zone="MONETAG_SITE_ID" async></script>
```

- [ ] **Step 2: Add banner ad container to result page**

In `index.html`, inside the `<section id="result">`, after the `<div class="note-box">` block (after line 136 `</div>`) and before the `<details class="author-box">`, add:

```html
<div id="adBannerResult" class="ad-banner-container"></div>
```

- [ ] **Step 3: Add banner ad container to ranking list**

In `index.html`, after the `<div id="rankingList" class="ranking-list"></div>` (line 73), add:

```html
<div id="adBannerRanking" class="ad-banner-container" style="margin-top:16px;"></div>
```

- [ ] **Step 4: Add ad container styles to main.css**

Append to the end of `main.css`:

```css
/* ===== Monetag Ad Containers ===== */
.ad-banner-container {
  width: 100%;
  min-height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 18px 0;
  background: #f0f4f0;
  border-radius: 12px;
  overflow: hidden;
}

.ad-interstitial-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0,0,0,0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.ad-interstitial-overlay .ad-countdown {
  font-size: 18px;
  margin-top: 20px;
  opacity: 0.8;
}

.ad-interstitial-overlay .ad-skip-btn {
  margin-top: 16px;
  padding: 10px 28px;
  background: var(--accent-strong, #4d6a53);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  display: none;
}
```

- [ ] **Step 5: Commit**

```bash
git add index.html main.css
git commit -m "feat: add Monetag ad SDK and ad container elements"
```

---

### Task 2: Implement Interstitial Ad on Result Submission

**Files:**
- Modify: `main.js`

The interstitial shows a 5-second countdown overlay between submitting answers and seeing results. After countdown, the overlay disappears and results render.

- [ ] **Step 1: Add interstitial overlay HTML creation to main.js**

In `main.js`, find the line `document.getElementById('submitBtn').addEventListener('click', renderResult);` (line 1004). Replace it with the interstitial flow:

```js
document.getElementById('submitBtn').addEventListener('click', function () {
    showInterstitialThenResult();
});
```

- [ ] **Step 2: Add showInterstitialThenResult function**

Insert this function before the `submitBtn` event listener (before line 1004):

```js
function showInterstitialThenResult() {
    var overlay = document.createElement('div');
    overlay.className = 'ad-interstitial-overlay';
    overlay.innerHTML =
        '<div style="font-size:22px;font-weight:600;margin-bottom:12px;">Loading result...</div>' +
        '<div id="adInterstitialSlot" style="width:300px;height:250px;background:#222;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#666;">AD</div>' +
        '<div class="ad-countdown" id="adCountdown">5s</div>' +
        '<button class="ad-skip-btn" id="adSkipBtn">show result</button>';
    document.body.appendChild(overlay);

    var seconds = 5;
    var countdownEl = overlay.querySelector('#adCountdown');
    var skipBtn = overlay.querySelector('#adSkipBtn');

    var timer = setInterval(function () {
        seconds--;
        countdownEl.textContent = seconds + 's';
        if (seconds <= 0) {
            clearInterval(timer);
            skipBtn.style.display = '';
        }
    }, 1000);

    skipBtn.addEventListener('click', function () {
        overlay.remove();
        renderResult();
    });
}
```

- [ ] **Step 3: Verify interstitial works**

Open `index.html` in browser, complete the test (or use `#test` debug mode). On submit, a 5-second overlay should appear. After countdown, a "show result" button appears. Clicking it shows the result.

- [ ] **Step 4: Commit**

```bash
git add main.js
git commit -m "feat: add 5-second interstitial ad overlay before results"
```

---

### Task 3: Build Paywall UI — Blur Overlay on Dimension Explanations

**Files:**
- Modify: `main.js`
- Modify: `main.css`
- Modify: `index.html`

Free users see the dimension names and L/M/H scores, but the text explanations are blurred. A pay button appears over the blurred area.

- [ ] **Step 1: Add paywall container to result page HTML**

In `index.html`, find the `<div class="dim-box">` block (line 123-126). Replace it with:

```html
<div class="dim-box">
  <h3>fifteen dimension scores</h3>
  <div id="dimList" class="dim-list"></div>
  <div id="paywallOverlay" class="paywall-overlay">
    <div class="paywall-blur"></div>
    <div class="paywall-cta">
      <div class="paywall-lock">&#128274;</div>
      <div class="paywall-title">unlock full report</div>
      <div class="paywall-desc">15-dimension deep analysis + ad-free + HD share image</div>
      <button id="paywallBtn" class="btn-primary paywall-btn">&#165;1.99 / $0.99 unlock</button>
      <button id="paywallAlreadyPaid" class="btn-secondary paywall-already-paid">already paid</button>
    </div>
  </div>
</div>
```

Wait — the existing HTML already has the dim-box with Chinese text. Let me use the exact existing markup. Replace lines 123-126:

```html
<div class="dim-box" style="position:relative;">
  <h3>十五维度评分</h3>
  <div id="dimList" class="dim-list"></div>
  <div id="paywallOverlay" class="paywall-overlay">
    <div class="paywall-blur"></div>
    <div class="paywall-cta">
      <div class="paywall-lock">&#128274;</div>
      <div class="paywall-title" id="paywallTitle">解锁完整报告</div>
      <div class="paywall-desc" id="paywallDesc">15维度深度解析 + 去广告 + 高清分享图</div>
      <button id="paywallBtn" class="btn-primary paywall-btn">&#165;1.99 / $0.99 解锁</button>
      <button id="paywallAlreadyPaid" class="btn-secondary paywall-already-paid">我已支付</button>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Add paywall CSS styles**

Append to `main.css`:

```css
/* ===== Paywall Overlay ===== */
.paywall-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.paywall-overlay.unlocked {
  display: none;
}

.paywall-blur {
  position: absolute;
  inset: 0;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  background: rgba(246, 250, 246, 0.6);
  border-radius: 12px;
}

.paywall-cta {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 28px 24px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  max-width: 320px;
  width: 90%;
}

.paywall-lock {
  font-size: 36px;
  margin-bottom: 8px;
}

.paywall-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--fg, #1a2e1c);
  margin-bottom: 6px;
}

.paywall-desc {
  font-size: 14px;
  color: var(--muted, #6a786f);
  margin-bottom: 18px;
  line-height: 1.5;
}

.paywall-btn {
  width: 100%;
  font-size: 17px;
  padding: 12px 0;
  margin-bottom: 10px;
}

.paywall-already-paid {
  width: 100%;
  font-size: 14px;
  padding: 8px 0;
}

/* Hide ads when paid */
.paid-mode .ad-banner-container,
.paid-mode .ad-interstitial-overlay {
  display: none !important;
}
```

- [ ] **Step 3: Add paywall state management to main.js**

At the top of `main.js` (after line 688, the `dimensionOrder` declaration), add the paywall state:

```js
/* ===== Paywall State ===== */
var isPaid = false;

function unlockPaywall() {
    isPaid = true;
    var overlay = document.getElementById('paywallOverlay');
    if (overlay) overlay.classList.add('unlocked');
    document.body.classList.add('paid-mode');
    // Hide all ad containers
    document.querySelectorAll('.ad-banner-container').forEach(function(el) {
        el.style.display = 'none';
    });
}

function checkPaidFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var sessionId = params.get('session_id');
    if (params.get('paid') === '1' && sessionId) {
        fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId })
        })
        .then(function(r) { return r.json(); })
        .then(function(data) {
            if (data.paid) unlockPaywall();
        })
        .catch(function() {});
    }
}
```

- [ ] **Step 4: Commit**

```bash
git add index.html main.css main.js
git commit -m "feat: add paywall blur overlay on dimension explanations"
```

---

### Task 4: Create Stripe Checkout API Endpoint

**Files:**
- Create: `api/create-checkout.js`
- Modify: `package.json`

- [ ] **Step 1: Install stripe dependency**

```bash
npm install stripe
```

- [ ] **Step 2: Create api/create-checkout.js**

```js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  var origin = req.headers.origin || req.headers.referer || 'https://sbti.jiligulu.xyz';
  origin = origin.replace(/\/$/, '');

  try {
    var session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      }],
      success_url: origin + '?paid=1&session_id={CHECKOUT_SESSION_ID}#result-paid',
      cancel_url: origin + '#result-cancelled',
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add api/create-checkout.js package.json package-lock.json
git commit -m "feat: add Stripe Checkout session creation endpoint"
```

---

### Task 5: Create Stripe Payment Verification Endpoint

**Files:**
- Create: `api/verify.js`

- [ ] **Step 1: Create api/verify.js**

```js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  var sessionId = req.body && req.body.session_id;
  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({ error: 'Missing session_id' });
  }

  try {
    var session = await stripe.checkout.sessions.retrieve(sessionId);
    var paid = session.payment_status === 'paid';
    res.status(200).json({ paid: paid });
  } catch (err) {
    res.status(400).json({ paid: false, error: 'Invalid session' });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add api/verify.js
git commit -m "feat: add Stripe payment verification endpoint"
```

---

### Task 6: Implement Frontend Payment Flow

**Files:**
- Modify: `main.js`

Clicking the paywall button detects language: Chinese users see a QR code modal for 面包多/爱发电, others redirect to Stripe Checkout.

- [ ] **Step 1: Add payment flow functions to main.js**

Insert after the `checkPaidFromUrl` function (added in Task 3):

```js
function isChineseUser() {
    var lang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    return lang.startsWith('zh');
}

function startPayment() {
    if (isChineseUser()) {
        showChinesePaymentModal();
    } else {
        startStripeCheckout();
    }
}

function startStripeCheckout() {
    var btn = document.getElementById('paywallBtn');
    btn.disabled = true;
    btn.textContent = 'redirecting...';

    fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
        if (data.url) {
            window.location.href = data.url;
        } else {
            btn.disabled = false;
            btn.textContent = '\u00A51.99 / $0.99 \u89E3\u9501';
            alert('Payment service unavailable, please try again');
        }
    })
    .catch(function() {
        btn.disabled = false;
        btn.textContent = '\u00A51.99 / $0.99 \u89E3\u9501';
        alert('Network error, please try again');
    });
}

function showChinesePaymentModal() {
    var modal = document.createElement('div');
    modal.className = 'share-modal active';
    modal.id = 'paymentModal';
    modal.innerHTML =
        '<div class="share-modal-content">' +
            '<div class="share-modal-header">' +
                '<h3>\u626B\u7801\u652F\u4ED8 \u00A51.99</h3>' +
                '<button class="share-modal-close" id="payModalClose">&times;</button>' +
            '</div>' +
            '<div class="share-modal-body" style="text-align:center;padding:24px;">' +
                '<p style="color:var(--muted);margin-bottom:16px;">\u8BF7\u7528\u5FAE\u4FE1\u626B\u7801\u652F\u4ED8\uFF08\u9762\u5305\u591A / \u7231\u53D1\u7535\uFF09</p>' +
                '<div id="paymentQRPlaceholder" style="width:200px;height:200px;margin:0 auto;background:#f0f4f0;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#999;font-size:14px;">payment QR code<br>(configure after registration)</div>' +
                '<p style="margin-top:16px;font-size:13px;color:var(--muted);">\u652F\u4ED8\u540E\u70B9\u51FB\u4E0B\u65B9\u6309\u94AE</p>' +
            '</div>' +
            '<div class="share-modal-actions">' +
                '<button class="btn-primary" id="payConfirmBtn">\u6211\u5DF2\u652F\u4ED8\uFF0C\u89E3\u9501\u62A5\u544A</button>' +
            '</div>' +
        '</div>';
    document.body.appendChild(modal);

    document.getElementById('payModalClose').addEventListener('click', function() {
        modal.remove();
    });
    modal.addEventListener('click', function(e) {
        if (e.target === modal) modal.remove();
    });
    document.getElementById('payConfirmBtn').addEventListener('click', function() {
        modal.remove();
        unlockPaywall();
    });
}
```

- [ ] **Step 2: Wire up paywall buttons**

Find the end of the `main.js` file and add before the closing of the last IIFE (or at the end of file):

```js
/* ===== Paywall Button Handlers ===== */
(function () {
    var paywallBtn = document.getElementById('paywallBtn');
    var alreadyPaidBtn = document.getElementById('paywallAlreadyPaid');

    if (paywallBtn) {
        paywallBtn.addEventListener('click', startPayment);
    }
    if (alreadyPaidBtn) {
        alreadyPaidBtn.addEventListener('click', function () {
            if (isChineseUser()) {
                unlockPaywall();
            } else {
                checkPaidFromUrl();
            }
        });
    }

    // Auto-check payment on page load (for Stripe redirect back)
    checkPaidFromUrl();
})();
```

- [ ] **Step 3: Test the payment flow**

1. Open in browser, complete test, see result with blurred dimensions
2. Click paywall button — if browser language is Chinese, a QR modal should appear
3. Click "我已支付" in the modal — blur should disappear, ads should hide
4. For non-Chinese: the button should try to call `/api/create-checkout` (will fail locally without Stripe keys, which is expected)

- [ ] **Step 4: Commit**

```bash
git add main.js
git commit -m "feat: add payment flow with language detection and Chinese QR modal"
```

---

### Task 7: Add Watermark to Free User Share Images

**Files:**
- Modify: `main.js`
- Modify: `main.css`

Free users' share images get a text watermark "SBTI人格测试 → sbti.jiligulu.xyz". Paid users get clean images without the watermark.

- [ ] **Step 1: Add watermark element to share card HTML**

In `index.html`, find the share card footer (line 219-222). Replace:

```html
<div class="share-card-footer">
  <div class="share-card-cta">扫码来测<br>你是什么人格</div>
  <div class="share-card-qr" id="shareCardQR"></div>
</div>
```

with:

```html
<div id="shareCardWatermark" class="share-card-watermark">SBTI人格测试 → sbti.jiligulu.xyz</div>
<div class="share-card-footer">
  <div class="share-card-cta">扫码来测<br>你是什么人格</div>
  <div class="share-card-qr" id="shareCardQR"></div>
</div>
```

- [ ] **Step 2: Add watermark CSS**

Append to `main.css`:

```css
/* ===== Share Card Watermark ===== */
.share-card-watermark {
  text-align: center;
  font-size: 12px;
  color: #999;
  padding: 8px 0 0;
  letter-spacing: 0.5px;
}

.share-card-watermark.hidden {
  display: none;
}
```

- [ ] **Step 3: Toggle watermark visibility based on paid status**

In `main.js`, find the `populateShareCard` function (line 1211). At the end of the function, before the closing `}`, add:

```js
        // Watermark: hide for paid users
        var watermark = document.getElementById('shareCardWatermark');
        if (watermark) {
            watermark.classList.toggle('hidden', isPaid);
        }
```

- [ ] **Step 4: Commit**

```bash
git add index.html main.css main.js
git commit -m "feat: add watermark to free user share images"
```

---

### Task 8: Add Ranking Feed Ads and Localize Paywall Text

**Files:**
- Modify: `main.js`

- [ ] **Step 1: Add ad injection to ranking list**

In `main.js`, find the `renderRanking` function (line 1131). After `listEl.innerHTML = data.list.map(...)` block (around line 1169), add ad injection:

```js
            // Insert ad banner in ranking feed
            var adSlot = document.getElementById('adBannerRanking');
            if (adSlot && !document.body.classList.contains('paid-mode')) {
                adSlot.style.display = '';
            }
```

- [ ] **Step 2: Localize paywall text based on user language**

In the paywall button handler IIFE (added in Task 6), add localization at the start:

```js
    // Localize paywall text
    if (!isChineseUser()) {
        var titleEl = document.getElementById('paywallTitle');
        var descEl = document.getElementById('paywallDesc');
        var btnEl = document.getElementById('paywallBtn');
        var alreadyEl = document.getElementById('paywallAlreadyPaid');
        if (titleEl) titleEl.textContent = 'Unlock Full Report';
        if (descEl) descEl.textContent = '15-dimension deep analysis + ad-free + HD share image';
        if (btnEl) btnEl.textContent = '$0.99 Unlock';
        if (alreadyEl) alreadyEl.textContent = 'I already paid';
    }
```

- [ ] **Step 3: Commit**

```bash
git add main.js
git commit -m "feat: add ranking feed ads and localize paywall for English users"
```

---

### Task 9: Final Integration and Verify

**Files:**
- Modify: `main.js`

- [ ] **Step 1: Ensure renderResult resets paywall state for new tests**

In `main.js`, at the top of the `renderResult` function (line 925), add:

```js
    // Reset paywall for new test (unless already paid in this session)
    if (!isPaid) {
        var overlay = document.getElementById('paywallOverlay');
        if (overlay) overlay.classList.remove('unlocked');
    }
```

- [ ] **Step 2: Skip interstitial for paid users**

In the `showInterstitialThenResult` function (added in Task 2), add a paid check at the top:

```js
function showInterstitialThenResult() {
    if (isPaid) {
        renderResult();
        return;
    }
    // ... rest of existing interstitial code
```

- [ ] **Step 3: Full manual test**

1. Open `index.html` in browser (or local server)
2. Complete quiz → should see 5s interstitial → then result with blurred dims
3. Click paywall button → Chinese: QR modal / English: Stripe redirect attempt
4. Click "我已支付" → dims unblur, ads hide
5. Generate share image → should have watermark text at bottom
6. Restart test → if not paid, paywall reappears; if paid, stays unlocked
7. Check ranking tab → ad banner visible at bottom

- [ ] **Step 4: Commit**

```bash
git add main.js
git commit -m "feat: integrate paywall with interstitial and result flow"
```

---

### Task 10: Update Environment Documentation

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Update CLAUDE.md with new env vars and files**

Add to the Environment Variables section:

```
- `STRIPE_SECRET_KEY` — Stripe API secret key
- `STRIPE_PRICE_ID` — Stripe Price object ID for the $0.99 product
```

Add to the file layout table:

```
| api/create-checkout.js | POST — creates Stripe Checkout session, returns redirect URL |
| api/verify.js | POST — verifies Stripe session payment status |
```

- [ ] **Step 2: Commit all remaining changes**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md with new API endpoints and env vars"
```
