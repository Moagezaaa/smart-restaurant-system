const fs = require("fs");
const QRCode = require("qrcode");
const { pool } = require("../config/db");
const crypto = require("crypto"); 

async function generateQRCodes(count, localIP) {
  const folder = "./qrs";
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);

  for (let i = 1; i <= count; i++) {
    const hash_table = crypto.createHash("sha256").update(i.toString()).digest("hex");

    const url = `http://${localIP}:3000/table/${hash_table}`;
    const filePath = `${folder}/table_${i}.png`;
    await QRCode.toFile(filePath, url);

    await pool.query(
      "INSERT INTO qr_codes (table_number, url, file_path, hash_table) VALUES (?, ?, ?, ?)",
      [i, url, filePath, hash_table]
    );

    console.log(`✅ Table ${i}: ${url}`);
  }

  console.log("🎉 All QR codes generated successfully!");
}
}

module.exports = { generateQRCodes };
