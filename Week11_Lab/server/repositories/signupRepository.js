// server/repositories/signupRepository.js
const { connectDB, ObjectId } = require("../db");

async function getCollection() {
  const db = await connectDB();
  return db.collection("participants");
}

// 建立報名
async function createParticipant(data) {
  const col = await getCollection();
  const result = await col.insertOne({
    name: data.name,
    email: data.email,
    phone: data.phone,
    status: data.status || "pending",
    createdAt: new Date()
  });
  return result;
}

// 分頁查詢
async function listParticipants(skip, limit) {
  const col = await getCollection();

  const cursor = col
    .find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const items = await cursor.toArray();
  const total = await col.countDocuments();

  return { items, total };
}

// 更新 phone / status
async function updateParticipant(id, update) {
    const col = await getCollection();
    const _id = new ObjectId(id);
  
    const set = {};
    if (update.phone !== undefined) set.phone = update.phone;
    if (update.status !== undefined) set.status = update.status;
  
    // 在新版 mongodb driver 中，findOneAndUpdate 直接回傳「更新後的文件」或 null
    const doc = await col.findOneAndUpdate(
      { _id },
      { $set: set },
      { returnDocument: "after" }
    );
  
    // doc 可能是 null（找不到資料），讓上層 route 去判斷
    return doc;
  }
  

// 刪除
async function deleteParticipant(id) {
  const col = await getCollection();
  const _id = new ObjectId(id);
  const result = await col.deleteOne({ _id });
  return result.deletedCount === 1;
}

module.exports = {
  createParticipant,
  listParticipants,
  updateParticipant,
  deleteParticipant
};
