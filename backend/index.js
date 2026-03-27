import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { generateProfileInfo } from "./services/aiService.js";
import profileRoutes from "./routes/profileRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", profileRoutes);

app.post("/api/ai/parse", async (req, res) => {
  try {
    const { text } = req.body;
    const structuredData = await generateProfileInfo(text);
    res.json(structuredData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

process.on("uncaughtException", (err) => {
  console.error(err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error(reason);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
