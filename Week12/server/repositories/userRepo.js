import { getDB } from "../db.js";

export function usersCol() {
  return getDB().collection("users");
}

export async function createUser({ email, passwordHash, role }) {
  const doc = { email, passwordHash, role, createdAt: new Date() };
  const r = await usersCol().insertOne(doc);
  return { ...doc, _id: r.insertedId };
}

export async function findUserByEmail(email) {
  return usersCol().findOne({ email });
}
