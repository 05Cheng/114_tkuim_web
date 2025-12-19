import { ObjectId } from "mongodb";
import { getDB } from "../db.js";

export function signupsCol() {
  return getDB().collection("signups");
}

export async function createSignup({ name, email, phone, ownerId }) {
  const doc = { name, email, phone, ownerId, createdAt: new Date() };
  const r = await signupsCol().insertOne(doc);
  return { ...doc, _id: r.insertedId };
}

export async function listAll() {
  return signupsCol().find({}).sort({ createdAt: -1 }).toArray();
}

export async function listByOwner(ownerId) {
  return signupsCol().find({ ownerId }).sort({ createdAt: -1 }).toArray();
}

export async function findById(id) {
  return signupsCol().findOne({ _id: new ObjectId(id) });
}

export async function deleteById(id) {
  const r = await signupsCol().deleteOne({ _id: new ObjectId(id) });
  return r.deletedCount === 1;
}
