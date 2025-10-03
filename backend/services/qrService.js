const fs = require("fs");
const QRCode = require("qrcode");
const { pool } = require("../config/db");

async function generateQRCodes(count, localIP) {
  const folder = "./qrs";
  if (!fs.existsSync(folder)) fs.mkdirSync(folder);

  for (let i = 1; i <= count; i++) {
    const url = `http://${localIP}:3000/table/${i}`;
    const filePath = `${folder}/table_${i}.png`;

    await QRCode.toFile(filePath, url);
    await pool.query(
      "INSERT INTO qr_codes (table_number, url, file_path) VALUES (?, ?, ?)",
      [i, url, filePath]
    );

    console.log(`✅ Table ${i}: ${url}`);
  }
}

module.exports = { generateQRCodes };
