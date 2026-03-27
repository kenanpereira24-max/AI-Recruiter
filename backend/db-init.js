import pg from "pg";
import bcrypt from "bcrypt";

const { Client } = pg;
const connectionString =
  "postgresql://neondb_owner:npg_1VPXD9YBOLNk@ep-lively-math-a9k48lkv-pooler.gwc.azure.neon.tech/neondb?sslmode=require&channel_binding=require";

const client = new Client({ connectionString });

const setupDatabase = async () => {
  try {
    await client.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('candidate', 'recruiter')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        summary TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS experiences (
        id SERIAL PRIMARY KEY,
        profile_id INTEGER REFERENCES profiles(id) ON DELETE CASCADE,
        job_title VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        start_date DATE,
        end_date DATE,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        profile_id INTEGER REFERENCES profiles(id) ON DELETE CASCADE,
        skill_name VARCHAR(100) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        profile_id INTEGER REFERENCES profiles(id) ON DELETE CASCADE,
        project_name VARCHAR(255) NOT NULL,
        description TEXT,
        link VARCHAR(255)
      );
    `);

    const hashedPassword = await bcrypt.hash("HireMe@2025!", 10);

    await client.query(`
      INSERT INTO users (email, password, role)
      VALUES ('hire-me@anshumat.org', '${hashedPassword}', 'candidate')
      ON CONFLICT (email) DO NOTHING;
    `);

    console.log("Database setup complete.");
  } catch (error) {
    console.error(error);
  } finally {
    await client.end();
  }
};

setupDatabase();
