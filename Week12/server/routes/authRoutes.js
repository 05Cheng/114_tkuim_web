import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../repositories/userRepo.js";

const router = express.Router();

function signToken(user) {
  const expiresIn = process.env.JWT_EXPIRES_IN || "1d";
  return jwt.sign(
    { email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { subject: String(user._id), expiresIn }
  );
}

router.post("/signup", async (req, res) => {
  const { email, password, role } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "email/password required" });

  const safeRole = role === "admin" ? "admin" : "student";

  const exists = await findUserByEmail(email);
  if (exists) return res.status(409).json({ error: "email already exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser({ email, passwordHash, role: safeRole });

  return res.status(201).json({
    id: String(user._id),
    email: user.email,
    role: user.role
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "email/password required" });

  const user = await findUserByEmail(email);
  if (!user) return res.status(401).json({ error: "invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "invalid credentials" });

  const token = signToken(user);
  return res.json({
    token,
    user: { id: String(user._id), email: user.email, role: user.role }
  });
});

export default router;
