const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "appuser",
  password: "AppUser@1234",
  database: "myappdb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function initDB() {
  const sql = `
    CREATE TABLE IF NOT EXISTS qr_codes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      table_number INT,
      url VARCHAR(255),
      file_path VARCHAR(255)
    )
  `;
  const conn = await pool.getConnection();
  await conn.query(sql);
  conn.release();
}

module.exports = { pool, initDB };
