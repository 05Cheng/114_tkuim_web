// server/app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db");
const signupRoutes = require("./routes/signupRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "*"
  })
);
app.use(express.json());

// 啟動時先測試連線 Mongo
connectDB().catch((err) => {
  console.error("MongoDB 連線失敗：", err);
  process.exit(1);
});

// 掛上報名 API
app.use("/api/signup", signupRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// 統一錯誤處理
app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === 11000) {
    return res
      .status(400)
      .json({ error: "此 email 已完成報名，請勿重複送出。" });
  }
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
