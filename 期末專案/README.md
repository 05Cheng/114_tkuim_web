# ShopLite 期末專題（Full-Stack Web CRUD + MongoDB）

## 1. 專題主題與目標
本專題為「購物商品 + 訂單管理系統」，包含前後端整合與 MongoDB 資料庫，提供完整 CRUD 操作，並以前端介面呈現。

### 核心功能（CRUD）
#### 商品 Products（後台管理）
- Create：新增商品
- Read：商品列表 / 單一商品
- Update：編輯商品
- Delete：刪除商品

#### 訂單 Orders（前台建立 + 後台管理）
- Create：結帳建立訂單
- Read：訂單列表 / 訂單詳情
- Update：更新訂單狀態（pending/paid/shipped/cancelled）
- Delete：刪除訂單（或 soft delete/取消）


---

## 2. 技術選型與原因
- Frontend：React + Vite + TailwindCSS  
  - 元件化開發、快速建立 UI、支援 RWD
- Backend：Node.js + Express  
  - RESTful API 架構清晰、易於擴展與維護
- Database：MongoDB（Docker）  
  - 文件型資料庫適合商品/訂單結構（含 items array）

---

## 3. 專案目錄結構

```text
期末專案/
frontend/
client/
src/
public/
package.json
backend/
server/
src/
controllers/
models/
routes/
app.js
package.json
docs/
api-spec.md
architecture.png
flowchart.png
README.md
.gitignore
```
---

## 4. 執行方式
### 4.2 啟動後端 Backend
```bash
cd backend/server
npm install
npm run dev
```
### 4.3 啟動前端 Frontend
```bash
cd frontend/client
npm install
npm run dev
```
---