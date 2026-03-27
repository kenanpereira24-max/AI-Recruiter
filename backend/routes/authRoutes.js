import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

router.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role",
      [email, hashedPassword, role || "candidate"],
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" },
    );
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user) return res.status(404).json({ error: "User not found" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" },
    );
    res.json({
      user: { id: user.id, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
