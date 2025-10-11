const express = require("express");
const { pool, initDB } = require("./config/db");
const { getLocalIP } = require("./utils/network");
const { generateQRCodes } = require("./services/qrService");
const { makeZip } = require("./services/zipService");
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors());
const dishes = require("./routes/dishes");
app.use("/api/dishes", dishes);
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
