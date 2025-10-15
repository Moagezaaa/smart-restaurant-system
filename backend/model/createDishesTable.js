const { pool } = require("../config/db");
const asyncWrap = require("../middlewares/asyncWrapper");

const createDishesTable = asyncWrap(async () => {
  const conn = await pool.getConnection();

  await conn.query(`
    CREATE TABLE IF NOT EXISTS dishes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      description VARCHAR(255),
      price DECIMAL(10,2),
      is_available BOOLEAN
    )
  `);

  await conn.query(`
    INSERT INTO dishes (name, description, price, is_available) VALUES
    ('Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and basil', 8.99, true),
    ('Caesar Salad', 'Crisp romaine lettuce with Caesar dressing, croutons, and Parmesan cheese', 6.49, true),
    ('Spaghetti Carbonara', 'Pasta with eggs, cheese, pancetta, and pepper', 10.99, true),
    ('Grilled Chicken Sandwich', 'Chicken breast with lettuce, tomato, and mayo on a toasted bun', 7.99, true),
    ('Chocolate Lava Cake', 'Warm chocolate cake with gooey center, served with vanilla ice cream', 5.49, true)
  `);

  console.log("✅ dishes table created and data inserted!");

  conn.release();
});

module.exports = { createDishesTable };
