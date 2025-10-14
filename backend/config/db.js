require("dotenv").config();
const mysql = require("mysql2/promise");
const asyncWrap = require('../middlewares/asyncWrapper');

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
    
    // await conn.query(`DROP TABLE IF EXISTS qr_codes`);
    await conn.query(`DROP TABLE IF EXISTS dishes`);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS qr_codes (
        table_number INT  PRIMARY KEY,
        url VARCHAR(255),
        file_path VARCHAR(255),
        hash_table VARCHAR(255) 
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS dishes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        description VARCHAR(255),
        price DECIMAL(10, 2),
        is_available BOOLEAN 
       )
    `);
    // await conn.query(`DROP TABLE IF EXISTS orders`);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS orders (
        table_number INT PRIMARY KEY,
        total_time INT,
        items JSON,
        ended_at TIMESTAMP 
      )
    `);

    await conn.query(`insert into dishes (name, description, price, is_available) values
    ('Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and basil', 8.99, true),
    ('Caesar Salad', 'Crisp romaine lettuce with Caesar dressing, croutons, and Parmesan cheese', 6.49, true),
    ('Spaghetti Carbonara', 'Pasta with eggs, cheese, pancetta, and pepper', 10.99, true),
    ('Grilled Chicken Sandwich', 'Chicken breast with lettuce, tomato, and mayo on a toasted bun', 7.99, true),
    ('Chocolate Lava Cake', 'Warm chocolate cake with a gooey center, served with vanilla ice cream', 5.49, true)
    `);
    
    console.log("✅ Database initialized successfully!");
  } catch (err) {
    console.error("❌ Database initialization failed:", err);
  } finally {
    conn.release();
  }
}

module.exports = { pool, initDB };
