import { MongoClient } from "mongodb";

let client;
let db;

export async function connectDB() {
  if (db) return db;

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "week12";
  if (!uri) throw new Error("Missing MONGODB_URI");

  client = new MongoClient(uri);
  await client.connect();

  db = client.db(dbName);

  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  await db.collection("signups").createIndex({ ownerId: 1 });

  return db;
}

export function getDB() {
  if (!db) throw new Error("DB not connected. Call connectDB() first.");
  return db;
}

export async function closeDB() {
  if (client) await client.close();
  client = null;
  db = null;
}
