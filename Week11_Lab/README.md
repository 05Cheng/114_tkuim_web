# Week11 Lab：報名資料庫 + Docker + MongoDB

## 專案目標
在 Week07 / Week09 報名 API 的基礎上，加入 **MongoDB 資料庫** 與 **Docker**：
- 使用 Docker 啟動 MongoDB。
- 使用 Node.js + Express 建立 CRUD + 分頁 API。
- 對 email 建立唯一索引，避免重複報名。
- 提供 REST Client / Postman 測試腳本。


## 資料夾結構

Week11_Lab/
  docker/
    docker-compose.yml
    mongo-init.js
    mongo-data/              # docker 啟動後自動產生
  server/
    app.js
    db.js
    routes/
      signupRoutes.js
    repositories/
      signupRepository.js
    package.json
    package-lock.json
    .env
  tests/
    api.http                 # VS Code REST Client
  README.md

---

## 如何啟動資料庫 (Docker)

cd Week11_Lab/docker
docker compose up -d
docker ps      # 確認有 week11-mongo 在跑

## 如何啟動後端
cd Week11_Lab/server
npm install
npm run dev

## .env
PORT=3000
ALLOWED_ORIGIN=http://localhost:5173

MONGODB_URI=mongodb://root:rootpassword@localhost:27017/week11?authSource=admin
MONGODB_DB_NAME=week11

## API 端點文件與測試方式
VS Code REST Client：使用 tests/api.http。
Postman：可照同樣的 URL / body 自行建立 Collection。

## POST /api/signup
成功：回傳 201 Created
失敗（驗證錯誤）：回傳 400 Bad Request + error
失敗（email 重複）：回傳 400 Bad Request + 友善錯誤訊息
## 成功
{
  "message": "報名成功",
  "_id": "692f0956688571dc78cdc735"
}

## 驗證失敗
{
  "error": "name, email, phone 為必填"
}
## 重複 email
{
  "error": "此 email 已完成報名，請勿重複送出。"
}

## GET /api/signup?page=1&limit=5
分頁查詢報名清單，並回傳 data + total + page + limit。
page：第幾頁（預設 1）
limit：每頁幾筆（預設 10）

## PATCH /api/signup/:id
**功能**
更新指定報名資料的 phone 或 status（至少要有一個欄位）。
**成功**：
回傳 200 OK + 更新後資料
**失敗**：
id 格式錯誤 → 500（BSONError）
找不到該筆資料 → 404
## DELETE /api/signup/:id
**功能**
刪除指定的報名資料。
**成功**：
回傳 200 OK
**失敗**：
找不到該筆 → 404 Not Found

## 測試流程
1.先用 POST /api/signup 建立一筆報名，取得 _id
2.再用同一個 email 測試「重複 email 400 錯誤」
3.用 GET /api/signup?page=1&limit=5 檢查清單與分頁資訊
4.把第一步拿到的 _id 貼到 PATCH /api/signup/:id，修改 phone / status
5.最後用 DELETE /api/signup/:id 刪除該筆，並再用 GET 確認資料已刪除
