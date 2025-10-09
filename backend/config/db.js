require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function initDB() {
  const conn = await pool.getConnection();
  try {
    await conn.query(`DROP TABLE IF EXISTS qr_codes`);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS qr_codes (
        table_number INT  PRIMARY KEY,
        url VARCHAR(255),
        file_path VARCHAR(255)
      )
    `);
    console.log("✅ Database initialized successfully!");
  } catch (err) {
    console.error("❌ Database initialization failed:", err);
  } finally {
    conn.release();
  }
}

module.exports = { pool, initDB };
