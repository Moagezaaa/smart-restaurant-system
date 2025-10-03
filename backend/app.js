const express = require("express");
const { pool, initDB } = require("./config/db");
const { getLocalIP } = require("./utils/network");
const { generateQRCodes } = require("./services/qrService");
const { makeZip } = require("./services/zipService");

const app = express();

app.get("/table/:id", (req, res) => {
  const tableId = req.params.id;
  res.send(`🍽️ Welcome! This is Table ${tableId}. Place your order here.`);
});

app.get("/tables", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM qr_codes");
  res.json(rows);
});

(async () => {
  await initDB();

  const totalCodes = 10;
  const localIP = getLocalIP();

  await generateQRCodes(totalCodes, localIP);
  makeZip();

  app.listen(3000, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://${localIP}:3000`);
  });
})();
