const express = require("express");
const { pool } = require("../config/db");

const router = express.Router();

router.get("/table/:id", (req, res) => {
  const tableId = req.params.id;
  res.send(`🍽️ Welcome! This is Table ${tableId}. Place your order here.`);
});

router.get("/tables", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM qr_codes");
  res.json(rows);
});

module.exports = router;
