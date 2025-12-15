# Week09 Lab：報名 API + 測試流程

## 專案目標
將 Week07 的註冊表單串接 Node.js API，並提供可重複測試的腳本（Postman / REST Client）


## 資料夾結構

```text
Week09_Lab/
  client/
    signup_form.html
    signup_form.js
  server/
    app.js
    routes/
      signup.js
    package.json
    .env
  tests/
    api.http(VS Code REST Client)
    signup_collection.json(Postman 匯出)
  README.md
```

## 如何啟動後端
cd Week09_Lab/server
npm install
npm run dev
.env設定
**.env 範例（放在 server/.env）：**
PORT=3000
ALLOWED_ORIGIN=http://127.0.0.1:5500


## 如何啟動前端
Live Server開signup_form.html


## API 端點文件與測試方式
postman
## POST /api/signup
**功能：** 新增一筆報名資料並驗證欄位。  
 成功：回傳 201 Created  
 失敗（驗證錯誤）：回傳 400 Bad Request + errors

**Request body 範例：**
{
  "name": "Postman 測試",
  "email": "postman@example.com",
  "phone": "0911222333",
  "course": "Web 前端入門",
  "agree": true
}
**成功回應**
{
  "message": "報名成功",
  "data": {
    "id": 1,
    "name": "Postman 測試",
    "email": "postman@example.com",
    "phone": "0911222333",
    "course": "Web 前端入門",
    "agree": true,
    "createdAt": "2025-11-20T15:01:32.414Z"
  },
  "total": 1
}
**失敗回應**
{
  "message": "驗證失敗",
  "errors": {
    "name": "姓名必填",
    "email": "Email 格式不正確",
    "phone": "手機必填",
    "course": "請選擇課程",
    "agree": "請勾選同意條款"
  }
}
## GET /api/signup
**Response 範例**
{
  "total": 1,
  "data": [
    {
      "id": 1,
      "name": "Postman 測試",
      "email": "postman@example.com",
      "phone": "0911222333",
      "course": "Web 前端入門",
      "agree": true,
      "createdAt": "2025-11-20T15:01:32.414Z"
    }
  ]
}

