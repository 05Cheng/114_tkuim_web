import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod;

async function signupAndLogin(app, email, role) {
  await request(app)
    .post("/auth/signup")
    .send({ email, password: "123456", role })
    .expect(201);

  const r = await request(app)
    .post("/auth/login")
    .send({ email, password: "123456" })
    .expect(200);

  return r.body.token;
}

describe("signup authz", () => {
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongod.getUri();
    process.env.MONGODB_DB_NAME = "testdb";
    process.env.JWT_SECRET = "test_secret";
    process.env.JWT_EXPIRES_IN = "1d";

    const { connectDB } = await import("../db.js");
    await connectDB();
  });

  afterAll(async () => {
    const { closeDB } = await import("../db.js");
    await closeDB();
    if (mongod) await mongod.stop();
  });

  it("unauthorized without token", async () => {
    const { app } = await import("../app.js");
    await request(app).get("/api/signup").expect(401);
  });

  it("student sees own; admin sees all; delete rules", async () => {
    const { app } = await import("../app.js");

    const t1 = await signupAndLogin(app, "s1@test.com", "student");
    const t2 = await signupAndLogin(app, "s2@test.com", "student");
    const ta = await signupAndLogin(app, "admin@test.com", "admin");

    const a = await request(app)
      .post("/api/signup")
      .set("Authorization", `Bearer ${t1}`)
      .send({ name: "A", email: "a@test.com", phone: "1" })
      .expect(201);

    const b = await request(app)
      .post("/api/signup")
      .set("Authorization", `Bearer ${t2}`)
      .send({ name: "B", email: "b@test.com", phone: "2" })
      .expect(201);

    const aId = a.body._id;
    const bId = b.body._id;

    const s1List = await request(app)
      .get("/api/signup")
      .set("Authorization", `Bearer ${t1}`)
      .expect(200);

    expect(s1List.body.length).toBe(1);
    expect(s1List.body[0]._id).toBe(aId);

    const adminList = await request(app)
      .get("/api/signup")
      .set("Authorization", `Bearer ${ta}`)
      .expect(200);

    expect(adminList.body.length).toBe(2);

    await request(app)
      .delete(`/api/signup/${bId}`)
      .set("Authorization", `Bearer ${t1}`)
      .expect(403);

    await request(app)
      .delete(`/api/signup/${aId}`)
      .set("Authorization", `Bearer ${t1}`)
      .expect(200);

    await request(app)
      .delete(`/api/signup/${bId}`)
      .set("Authorization", `Bearer ${ta}`)
      .expect(200);

    const { getDB } = await import("../db.js");
    const u = await getDB().collection("users").findOne({ email: "s1@test.com" });
    expect(u.passwordHash).not.toBe("123456");
    expect(typeof u.passwordHash).toBe("string");
  });
});
