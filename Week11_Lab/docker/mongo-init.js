// 在 container 啟動時自動執行
db = db.getSiblingDB("week11");
db.createUser({
  user: "week11_user",
  pwd: "week11_pass",
  roles: [{ role: "readWrite", db: "week11" }],
});

db.createCollection("participants");

// 將 email 設成唯一索引
db.participants.createIndex({ email: 1 }, { unique: true });
