import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { createSignup, listAll, listByOwner, findById, deleteById } from "../repositories/signupRepo.js";

const router = express.Router();

router.use(authMiddleware);

// GET：登入後才能查，student 只能看自己的，admin 看全部
router.get("/", async (req, res) => {
  const { id, role } = req.user;
  const rows = role === "admin" ? await listAll() : await listByOwner(id);
  return res.json(rows.map(x => ({ ...x, _id: String(x._id) })));
});

// POST：登入者才能新增，ownerId 記錄建立者
router.post("/", async (req, res) => {
  const { name, email, phone } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: "name/email required" });

  const created = await createSignup({
    name,
    email,
    phone: phone || "",
    ownerId: req.user.id
  });

  return res.status(201).json({ ...created, _id: String(created._id) });
});

// DELETE：只有 owner 或 admin 能刪
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  const doc = await findById(id);
  if (!doc) return res.status(404).json({ error: "not found" });

  const isAdmin = req.user.role === "admin";
  const isOwner = doc.ownerId === req.user.id;

  if (!isAdmin && !isOwner) return res.status(403).json({ error: "forbidden" });

  const ok = await deleteById(id);
  return res.json({ ok });
});

export default router;
