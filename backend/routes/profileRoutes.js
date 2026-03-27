import express from "express";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

router.get("/profiles/me/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const profileRes = await pool.query(
      "SELECT * FROM profiles WHERE user_id = $1",
      [userId],
    );

    if (profileRes.rows.length === 0) {
      return res.json(null);
    }

    const profileId = profileRes.rows[0].id;

    const skills = await pool.query(
      "SELECT * FROM skills WHERE profile_id = $1",
      [profileId],
    );
    const experiences = await pool.query(
      "SELECT * FROM experiences WHERE profile_id = $1",
      [profileId],
    );
    const projects = await pool.query(
      "SELECT * FROM projects WHERE profile_id = $1",
      [profileId],
    );
    const education = await pool.query(
      "SELECT * FROM education WHERE profile_id = $1",
      [profileId],
    );

    res.json({
      ...profileRes.rows[0],
      skills: skills.rows,
      experiences: experiences.rows,
      projects: projects.rows,
      education: education.rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/profiles/autosave", async (req, res) => {
  const { userId, summary, skills, experiences, projects, education } =
    req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let profileRes = await client.query(
      "SELECT id FROM profiles WHERE user_id = $1",
      [userId],
    );
    let profileId;

    if (profileRes.rows.length === 0) {
      const newProfile = await client.query(
        "INSERT INTO profiles (user_id, summary) VALUES ($1, $2) RETURNING id",
        [userId, summary],
      );
      profileId = newProfile.rows[0].id;
    } else {
      profileId = profileRes.rows[0].id;
      await client.query(
        "UPDATE profiles SET summary = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
        [summary, profileId],
      );
    }

    await client.query("DELETE FROM skills WHERE profile_id = $1", [profileId]);
    await client.query("DELETE FROM experiences WHERE profile_id = $1", [
      profileId,
    ]);
    await client.query("DELETE FROM projects WHERE profile_id = $1", [
      profileId,
    ]);
    await client.query("DELETE FROM education WHERE profile_id = $1", [
      profileId,
    ]);

    if (skills && skills.length > 0) {
      for (const skill of skills) {
        await client.query(
          "INSERT INTO skills (profile_id, skill_name) VALUES ($1, $2)",
          [profileId, skill.skill_name || skill],
        );
      }
    }

    if (experiences && experiences.length > 0) {
      for (const exp of experiences) {
        await client.query(
          "INSERT INTO experiences (profile_id, job_title, company, description) VALUES ($1, $2, $3, $4)",
          [profileId, exp.job_title, exp.company, exp.description],
        );
      }
    }

    if (projects && projects.length > 0) {
      for (const proj of projects) {
        await client.query(
          "INSERT INTO projects (profile_id, project_name, description, link) VALUES ($1, $2, $3, $4)",
          [profileId, proj.project_name, proj.description, proj.link],
        );
      }
    }

    if (education && education.length > 0) {
      for (const edu of education) {
        await client.query(
          "INSERT INTO education (profile_id, institution, degree) VALUES ($1, $2, $3)",
          [profileId, edu.institution, edu.degree],
        );
      }
    }

    await client.query("COMMIT");
    res.json({ success: true, profileId });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

router.post("/profiles", async (req, res) => {
  const { userId, summary, skills, experiences } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const profileRes = await client.query(
      "INSERT INTO profiles (user_id, summary) VALUES ($1, $2) RETURNING id",
      [userId, summary],
    );
    const profileId = profileRes.rows[0].id;

    if (skills && skills.length > 0) {
      for (const skill of skills) {
        await client.query(
          "INSERT INTO skills (profile_id, skill_name) VALUES ($1, $2)",
          [profileId, skill],
        );
      }
    }

    if (experiences && experiences.length > 0) {
      for (const exp of experiences) {
        await client.query(
          "INSERT INTO experiences (profile_id, job_title, company, description) VALUES ($1, $2, $3, $4)",
          [profileId, exp.job_title, exp.company, exp.description],
        );
      }
    }

    await client.query("COMMIT");
    res.json({ success: true, profileId });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

export default router;
