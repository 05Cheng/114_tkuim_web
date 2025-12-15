# Week14 Demo — TODO

## 0) 專案結構確認
- [ ] 確認檔案存在
  - [ ] `index.html`
  - [ ] `dashboard.html`
  - [ ] `style.css`
  - [ ] `script.js`
- [ ] 確認兩個 HTML 不要黏在同一個檔案裡（每個檔案只保留一個 `<!DOCTYPE html>`）

---

## 1) 修正 HTML/CSS class 對應（現在是主要問題來源）
### Header / Nav
- [ ] 目前 HTML 是 `<nav>...</nav>`，但 CSS 是 `.nav`
  - [ ] 方案 A（改 HTML）：`<nav class="nav"> ... </nav>`
  - [ ] 方案 B（改 CSS）：把 `.nav` 改成 `header nav`

### Container / Wrap
- [ ] `dashboard.html` 用的是 `<main class="container">`，但 CSS 沒有 `.container`
  - [ ] 在 CSS 新增 `.container { max-width:1100px; margin:0 auto; padding:22px 18px 40px; }`
  - [ ] 或直接把 HTML `container` 改成 `wrap`

### Cards Grid
- [ ] `dashboard.html` 用 `.card-grid`，但 CSS 用 `.grid`
  - [ ] 方案 A：HTML 改成 `<div class="grid">`
  - [ ] 方案 B：CSS 新增 `.card-grid { ...同 .grid... }`

### Hero 區塊
- [ ] `index.html` 用 `.hero-text`，CSS 用 `.hero-left`
  - [ ] 方案 A：把 HTML 的 `.hero-text` 改成 `.hero-left`
  - [ ] 方案 B：CSS 改為支援 `.hero-text`

---

## 2) 首頁「分開一點」(標題/描述/按鈕間距)
- [ ] 在 CSS 加入（放最下面，避免被蓋掉）：
  - [ ] `.hero-text { display:flex; flex-direction:column; gap:22px; align-items:flex-start; }`
  - [ ] `.hero-text p { margin:0; line-height:2.0~2.2; }`
  - [ ] (如果之後加 h1) `.hero-text h1 { margin:0; line-height:1.15; }`

---

## 3) 灰白玻璃主題統一（已做，但要確保全站一致）
- [ ] 把卡片、按鈕、navbar、footer 的邊框/底色全部改用變數
  - [ ] 卡片：`background: var(--glass); border: 1px solid var(--line);`
  - [ ] navbar：`background: rgba(10,10,12,.45); border-bottom: 1px solid var(--line-soft);`
  - [ ] 按鈕：`.btn, button { background: rgba(255,255,255,.10); border:1px solid var(--line); }`

---

## 4) Dashboard 卡片內容與按鈕一致化
- [ ] 將 dashboard 裡的 `<button>` 套用 `.btn`
  - [ ] 做法：HTML 改 `<button class="btn" ...>`
  - [ ] 或 CSS 加 `button { ...同 .btn... }`
- [ ] 讓「系統狀態」卡片內的文字排版更整齊
  - [ ] `#statusText { margin-top:8px; }`
  - [ ] `button { margin-top:10px; }`

---

## 5) 互動功能（script.js）
- [ ] `toggleGravity()` 切換：
  - [ ] `Gravity: OFF` ↔ `Gravity: ON`
  - [ ] 切換小圓點狀態（如果有 dot UI）
  - [ ] 可選：切換整體動畫強度（例如加/移除 `float` class）

---

## 6) 版面與可讀性微調（加分項）
- [ ] footer 連結 style 統一（`a` 顏色 / hover）
- [ ] hero 區塊增加適當 padding
- [ ] card hover 微動效（透明度/上移 2px）
- [ ] RWD：小螢幕時 dashboard 卡片間距加大

---

## 7) 交付檢查
- [ ] `index.html` → 點「進入系統」能正確到 `dashboard.html`
- [ ] `dashboard.html` → 點「返回首頁」能回到 `index.html`
- [ ] Chrome / Safari 都正常顯示（無重疊、間距正常）
