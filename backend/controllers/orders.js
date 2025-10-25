const { pool } = require("../config/db");
const asyncWrap = require("../middlewares/asyncWrapper");
const validateOrders = require("../utils/validateOrders");

const createOrder = asyncWrap(async (req, res) => {
  const { table_number, total_price,items } = req.body;
  if (!table_number || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Invalid order data" });
  }
  if (!validateOrders.validateTableNumber(table_number)) {
    return res.status(400).json({ error: "Invalid table number" });
  }
  if (!validateOrders.validateItems(items)) {
    return res.status(400).json({ error: "Invalid item(s) data" });
  }

  let total_time = 0, lastTime = 0;
  for (let item of items) {
    total_time += item.preparation_time * item.quantity;
  }

  const findOrder = await pool.query("SELECT * FROM orders WHERE table_number = ?", [table_number]);
  if (findOrder[0].length > 0) {
    return res.status(400).json({ error: "An active order already exists for this table" });
  }

  const now = new Date();
  const [result] = await pool.query("SELECT ended_at FROM orders");
  for (let row of result) {
    lastTime = Math.max(lastTime, Math.max(0, Math.ceil((new Date(row.ended_at) - now) / 60000)));
  }
  total_time += lastTime;
  const ended_at = new Date(now.getTime() + total_time * 60000);

  await pool.query(
    `INSERT INTO orders (table_number, total_time, items, ended_at) VALUES (?, ?, ?, ?)`,
    [table_number, total_time, JSON.stringify(items), ended_at]
  );

  res.status(201).json({ message: "Order created successfully", total_time, ended_at });
});

const deleteOrder = asyncWrap(async (req, res) => {
  const { table_number } = req.body;
  if (!validateOrders.validateTableNumber(table_number)) {
    return res.status(400).json({ error: "Invalid table number" });
  }
  const [result] = await pool.query("DELETE FROM orders WHERE table_number = ?", [table_number]);
  if (result.affectedRows === 0) {
    return res.status(404).json({ error: "Order not found" });
  }
  res.status(200).json({ message: "Order deleted successfully" });
});

const gettableOrders = asyncWrap(async (req, res) => {
  const { table_number } = req.body;
  if (!validateOrders.validateTableNumber(table_number)) {
    return res.status(400).json({ error: "Invalid table number" });
  }
  const [orders] = await pool.query("SELECT items FROM orders WHERE table_number = ?", [table_number]);
  res.status(200).json(orders);
});

module.exports = {
  createOrder,
  deleteOrder,
  gettableOrders
};
