// server/routes/signupRoutes.js
const express = require("express");
const router = express.Router();
const repo = require("../repositories/signupRepository");

// 建立報名 POST /api/signup
router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone, status } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: "name, email, phone 為必填" });
    }

    const result = await repo.createParticipant({ name, email, phone, status });

    res.status(201).json({
      message: "報名成功",
      _id: result.insertedId
    });
  } catch (err) {
    if (err.code === 11000) {
      // email 重複
      return res
        .status(400)
        .json({ error: "此 email 已完成報名，請勿重複送出。" });
    }
    next(err);
  }
});

// 分頁查詢 GET /api/signup?page=1&limit=5
router.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "10", 10);
    const skip = (page - 1) * limit;

    const { items, total } = await repo.listParticipants(skip, limit);

    res.json({
      data: items,
      total,
      page,
      limit
    });
  } catch (err) {
    next(err);
  }
});

// 更新 phone / status PATCH /api/signup/:id
router.patch("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const { phone, status } = req.body;

    if (phone === undefined && status === undefined) {
      return res.status(400).json({ error: "至少需要 phone 或 status 其中一個欄位" });
    }

    const updated = await repo.updateParticipant(id, { phone, status });

    if (!updated) {
      return res.status(404).json({ error: "找不到該報名資料" });
    }

    res.json({
      message: "更新成功",
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

// 刪除 DELETE /api/signup/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    const ok = await repo.deleteParticipant(id);
    if (!ok) {
      return res.status(404).json({ error: "找不到該報名資料" });
    }

    res.json({ message: "刪除成功" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
