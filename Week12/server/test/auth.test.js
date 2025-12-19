import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod;

describe("auth", () => {
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

  it("signup/login returns token", async () => {
    const { app } = await import("../app.js");

    await request(app)
      .post("/auth/signup")
      .send({ email: "student@test.com", password: "123456", role: "student" })
      .expect(201);

    const login = await request(app)
      .post("/auth/login")
      .send({ email: "student@test.com", password: "123456" })
      .expect(200);

    expect(typeof login.body.token).toBe("string");
    expect(login.body.user.email).toBe("student@test.com");
  });
});
