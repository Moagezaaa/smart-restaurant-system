const express = require("express");
const { pool, initDB } = require("./config/db");
const { getLocalIP } = require("./utils/network");
const { generateQRCodes } = require("./services/qrService");
const { makeZip } = require("./services/zipService");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());
const admin = require("./routes/admin");
const dishes = require("./routes/dishes");
const tables = require("./routes/tables");
app.use("/api/admin", admin);
app.use("/api/dishes", dishes);
app.use("/table", tables);

app.get("/", (req, res) => {
  res.send("Welcome to the Restaurant API");
});

(async () => {
  await initDB();
  const totalCodes = 10;
  const localIP = getLocalIP();

  await generateQRCodes(totalCodes, localIP);
  makeZip();

  app.listen(process.env.PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://${localIP}:${process.env.PORT}`);
  });
})();
