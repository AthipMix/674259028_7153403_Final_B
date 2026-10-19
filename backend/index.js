import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import newsRouter from "./router/newsRouter.js";

dotenv.config();

const PORT = process.env.BACKEND_PORT;
const app = express();

app.use(cors());
app.use(express.json());

// News API
app.use("/api/news", newsRouter);

// Connect to database
connectDB();

// Home route
app.get("/", (req, res) => {
  return res
    .status(200)
    .send("<h1>Welcome to RESTful API News Management App</h1>");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Backend Error:", err);
  return res.status(err.status || 500).json({
    message: err.message || "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});
