const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");
const asyncWrap = require("../middlewares/asyncWrapper");

// Redirect route: /redirect/:hash
router.get(
  "/redirect/:hash",
  asyncWrap(async (req, res) => {
    const { hash } = req.params;

    const [rows] = await pool.query(
      "SELECT table_number FROM qr_codes WHERE hash_table = ?",
      [hash],
    );

    if (rows.length === 0) {
      return res.status(404).send("Table not found");
    }

    res.redirect(`http://localhost:5173/?hash=${hash}`);
  }),
);

// Get table number route: /get/:hash
router.get(
  "/get/:hash",
  asyncWrap(async (req, res) => {
    const { hash } = req.params;

    const [rows] = await pool.query(
      "SELECT table_number FROM qr_codes WHERE hash_table = ?",
      [hash],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Table not found" });
    }

    res.json({ tableNumber: rows[0].table_number });
  }),
);

module.exports = router;
