import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import authRoutes from "./routes/authRoutes.js";
import signupRoutes from "./routes/signupRoutes.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Week12 server OK"));

app.use("/auth", authRoutes);
app.use("/api/signup", signupRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "internal error" });
});

const isDirectRun = process.argv[1] && process.argv[1].endsWith("/app.js");
if (isDirectRun) {
  await connectDB();
  const port = Number(process.env.PORT || 3000);
  app.listen(port, () => console.log(`http://localhost:${port}`));
}
