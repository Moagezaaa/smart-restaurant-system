const { pool } = require("../config/db");
const asyncWrap = require("../middlewares/asyncWrapper");

const createOrdersTable = asyncWrap(async () => {
  const conn = await pool.getConnection();
  // await conn.query(` DROP TABLE IF EXISTS orders`);
  await conn.query(`
    CREATE TABLE IF NOT EXISTS orders (
      table_number INT PRIMARY KEY,
      total_time INT,
      items JSON,
      ended_at TIMESTAMP
    )
  `);

  console.log("✅ orders table created successfully!");
  conn.release();
});

module.exports = { createOrdersTable };
