# ShopLite API 規格文件（API Spec）

Base URL：
- http://localhost:3001

## 統一回應格式（必備）
### Success
```json
{
  "success": true,
  "message": "OK",
  "data": {}
}

{
  "success": false,
  "message": "Error message",
  "data": null
}

{
  "success": true,
  "message": "OK",
  "data": { "time": "ISO time" }
}

{
  "_id": "ObjectId",
  "name": "iPhone Case",
  "price": 299,
  "stock": 20,
  "description": "Durable case",
  "createdAt": "2026-01-03T00:00:00.000Z",
  "updatedAt": "2026-01-03T00:00:00.000Z"
}

{
  "name": "iPhone Case",
  "price": 299,
  "stock": 20,
  "description": "Durable case"
}

{
  "success": true,
  "message": "Created",
  "data": {
    "_id": "xxx",
    "name": "iPhone Case",
    "price": 299,
    "stock": 20,
    "description": "Durable case"
  }
}

{
  "success": true,
  "message": "OK",
  "data": [
    { "_id": "xxx", "name": "A", "price": 10, "stock": 3, "description": "..." }
  ]
}

{
  "success": true,
  "message": "OK",
  "data": { "_id": "xxx", "name": "A", "price": 10, "stock": 3, "description": "..." }
}

{
  "name": "New Name",
  "price": 199,
  "stock": 99,
  "description": "Updated"
}

{
  "success": true,
  "message": "Updated",
  "data": { "_id": "xxx", "name": "New Name", "price": 199, "stock": 99, "description": "Updated" }
}

{
  "success": true,
  "message": "Deleted",
  "data": { "id": "xxx" }
}

{
  "_id": "ObjectId",
  "customer": { "name": "王小明", "phone": "0912xxxxxx", "address": "台北市..." },
  "items": [
    { "productId": "xxx", "name": "A", "price": 100, "qty": 2 }
  ],
  "total": 200,
  "status": "pending",
  "createdAt": "2026-01-03T00:00:00.000Z",
  "updatedAt": "2026-01-03T00:00:00.000Z"
}

{
  "customer": { "name": "王小明", "phone": "0912xxxxxx", "address": "台北市..." },
  "items": [
    { "productId": "xxx", "name": "A", "price": 100, "qty": 2 }
  ],
  "total": 200
}

{
  "success": true,
  "message": "Created",
  "data": { "_id": "ooo", "status": "pending", "total": 200 }
}

{
  "success": true,
  "message": "OK",
  "data": [
    { "_id": "ooo", "customer": { "name": "王小明" }, "total": 200, "status": "pending" }
  ]
}

{
  "success": true,
  "message": "OK",
  "data": {
    "_id": "ooo",
    "customer": { "name": "王小明", "phone": "0912...", "address": "..." },
    "items": [{ "name": "A", "price": 100, "qty": 2 }],
    "total": 200,
    "status": "pending"
  }
}

{ "status": "paid" }

{
  "success": true,
  "message": "Updated",
  "data": { "_id": "ooo", "status": "paid" }
}

{
  "success": true,
  "message": "Deleted",
  "data": { "id": "ooo" }
}


---

## ✅ 寫完確認有內容
```bash
wc -l docs/api-spec.md
head -n 10 docs/api-spec.md

