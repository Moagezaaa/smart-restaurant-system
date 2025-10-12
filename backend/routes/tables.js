const express = require("express");
const router = express.Router();

router.get("/:id", (req, res) => {
  const tableId = req.params.id;
  res.send(`🍽️ Welcome! This is Table ${tableId}. Place your order here.`);
});

module.exports = router;
