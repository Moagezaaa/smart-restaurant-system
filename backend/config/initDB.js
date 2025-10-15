const { createQrCodesTable } = require("../model/createQrCodesTable");
const { createDishesTable } = require("../model/createDishesTable");
const { createOrdersTable } = require("../model/createOrdersTable");

async function initDB() {
  console.log("🚀 Initializing model...");
  await createQrCodesTable();
  await createDishesTable();
  await createOrdersTable();
  console.log("✅ All tables created successfully!");
}

module.exports = { initDB };
