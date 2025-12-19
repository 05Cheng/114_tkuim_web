# Week12 – Auth / Authorization API（JWT + MongoDB）

## 專案說明
本專案為 Week12 作業，實作使用 **Node.js + Express + MongoDB** 的後端 API，包含：

- 使用者註冊 / 登入（JWT）
- 角色權限（student / admin）
- signup 資料的建立與刪除（權限控管）
- bcrypt 密碼雜湊（無明碼密碼）
- Docker MongoDB
- 自動化測試（Vitest + Supertest + Mongo Memory Server）
- 手動測試（tests/api.http）

---

## 專案結構
```text
Week12/
├─ .gitignore
├─ README.md
├─ client/
│  ├─ index.html
│  └─ main.js
├─ docker/
│  └─ docker-compose.yml
├─ server/
│  ├─ .env
│  ├─ app.js
│  ├─ db.js
│  ├─ middleware/
│  │  └─ auth.js
│  ├─ repositories/
│  │  ├─ signupRepo.js
│  │  └─ userRepo.js
│  ├─ routes/
│  │  ├─ authRoutes.js
│  │  └─ signupRoutes.js
│  ├─ test/
│  │  ├─ auth.test.js
│  │  └─ signup.authz.test.js
│  ├─ package.json
│  └─ package-lock.json
└─ tests/
   └─ api.http
```
---

## 環境需求
- Node.js 
- Docker / Docker Compose
- MongoDB Compass（檢查資料用）

---

## 安裝與啟動

### 1.啟動 MongoDB（Docker）
```bash
cd docker
docker compose up -d
docker ps
```
### 2.設定 .env
```env
PORT=3000
JWT_SECRET=your_jwt_secret
MONGODB_URI=mongodb://localhost:27017/week12
```
.env 已加入 .gitignore，不會被 commit
### 3.啟動後端
```bash
cd server
npm install
npm run dev
```
---

## API 測試

### 自動化測試
```bash
 cd server
 npm test
 ```
 - 測試內容包含：
 - 登入 / JWT 驗證
 - 權限控管（student / admin）
 - signup 存取限制 這樣可以上傳了嗎
