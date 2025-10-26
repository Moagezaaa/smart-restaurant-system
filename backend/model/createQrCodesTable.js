const { pool } = require("../config/db");
const asyncWrap = require("../middlewares/asyncWrapper");

const createQrCodesTable = asyncWrap(async () => {
  const conn = await pool.getConnection();

  await conn.query(`
    CREATE TABLE IF NOT EXISTS qr_codes (
      table_number INT PRIMARY KEY,
      url VARCHAR(255),
      file_path VARCHAR(255),
      hash_table VARCHAR(255)
    )
  `);

  console.log("✅ qr_codes table created successfully!");
  conn.release();
});

module.exports = { createQrCodesTable };
