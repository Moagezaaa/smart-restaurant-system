const { pool } = require("../config/db");
const asyncWrap = require("../middlewares/asyncWrapper");

const createDishesTable = asyncWrap(async () => {
  const conn = await pool.getConnection();

  // await conn.query(`DROP TABLE IF EXISTS dishes`);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS dishes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      description VARCHAR(255),
      price DECIMAL(10,2),
      is_available BOOLEAN,
      image VARCHAR(255)
    )
  `);

  console.log("✅ dishes table created and data inserted!");
  conn.release();
});

module.exports = { createDishesTable };
