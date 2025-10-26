const fs = require("fs");
const QRCode = require("qrcode");
const { pool } = require("../config/db");
const crypto = require("crypto");

async function generateQRCodes(count, localIP) {
  const folder = "./qrs";
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }

  // Clear old QR codes from DB before generating new ones
  await pool.query("DELETE FROM qr_codes");

  for (let i = 1; i <= count; i++) {
    // Create sha256 hash from the table number
    const hash_table = crypto
      .createHash("sha256")
      .update(i.toString())
      .digest("hex");

    // URL points to redirect route on backend
    const url = `http://${localIP}:3000/table/redirect/${hash_table}`;

    const filePath = `${folder}/table_${i}.png`;
    await QRCode.toFile(filePath, url);

    // Insert record into DB with the redirect URL & hash
    await pool.query(
      "INSERT INTO qr_codes (table_number, url, file_path, hash_table) VALUES (?, ?, ?, ?)",
      [i, url, filePath, hash_table],
    );

    console.log(`✅ Table ${i}: ${url}`);
  }

  console.log("🎉 All QR codes generated successfully!");
}

module.exports = { generateQRCodes };
