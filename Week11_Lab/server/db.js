// server/db.js
const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;

const client = new MongoClient(uri);
let db = null;

async function connectDB() {
  if (db) return db; // 已連線就直接用舊的

  await client.connect();
  db = client.db(dbName);
  console.log("[DB] Connected to MongoDB:", uri, "db =", dbName);
  return db;
}

function getDB() {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB() first.");
  }
  return db;
}

// 關閉程式時順便關掉連線（非必要但比較乾淨）
process.on("SIGINT", async () => {
  if (client) {
    await client.close();
    console.log("\n[DB] Connection closed");
  }
  process.exit(0);
});

module.exports = { connectDB, getDB, ObjectId };
