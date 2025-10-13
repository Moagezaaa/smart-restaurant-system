const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");
const asyncWrap = require("../middlewares/asyncWrapper");

router.get("/:id", asyncWrap(async (req, res) => {
  const tableId = req.params.id;
  const [find_table] = await pool.query( "SELECT table_number FROM qr_codes WHERE hash_table = ?",  [tableId]);

  if (find_table.length === 0) {
    return res.status(404).json({ error: "Table not found" });
  }

  res.send(`🍽️ Welcome! This is Table ${find_table[0].table_number}. Place your order here.`);
}));

module.exports = router;
