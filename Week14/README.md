# Week14 UI Demo

一個結合「課程平台概念」、「串流式介面」與「未來科技感」的前端 UI 示範專案。  
本專案以純 HTML / CSS / JavaScript 實作，展示玻璃擬態（Glassmorphism）風格、卡片式模組面板，以及簡單的互動狀態切換。

---

##  專案特色

  - 灰白玻璃＋藍綠漸層背景
  - 卡片式模組面板（Dashboard）
  - 首頁 / 控制面板雙頁導覽
  - 浮動動畫效果（模擬反重力 UI）
  - 系統狀態 ON / OFF 切換（JavaScript）
  - 基本 RWD，支援桌機與行動裝置

---

##  專案結構

Week14/
├─ index.html        # 首頁（Hero 介面）
├─ dashboard.html    # 控制面板（模組卡片）
├─ style.css         # 全站樣式（Glass UI + Layout）
├─ script.js         # 互動邏輯（狀態切換）
├─ README.md         # 專案說明文件
└─ todo.md           # 開發與功能檢查清單

---

## 頁面說明

- **1.首頁（index.html）**
  - 顯示專案簡介文字
  - 提供「進入系統」按鈕
  - 採用 Hero 置中版型與玻璃背景
  - 導覽列可切換至控制面板

- **2.控制面板（dashboard.html）**
  - 以卡片（Card）方式呈現模組功能
  - 目前包含：
    - 課程系統（iClass 風格）
    - 內容串流（Netflix 風格）
    - 反重力 UI（動畫效果）
    - 系統狀態（ON / OFF 切換）
  - 點擊「切換」按鈕可改變系統狀態文字

- **3.設計說明**
  - 色彩主題：藍綠漸層背景搭配半透明白色玻璃卡片
  - 設計風格：Glassmorphism（玻璃擬態）
  - 動畫效果：使用 CSS @keyframes 製作上下漂浮
  - 字體：系統預設字體（system-ui）

- **4.使用技術**
  - HTML5
  - CSS3
  - Flexbox
  - Grid
  - CSS Variables
  - Backdrop-filter
  - JavaScript（Vanilla JS）

---

## 使用方式

1. 將所有檔案放在同一個資料夾（Week14）
2. 使用瀏覽器開啟 `index.html`
3. 點擊「進入系統」可進入控制面板
4. 在控制面板測試系統狀態切換功能