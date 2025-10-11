const { pool } = require("../config/db");
async function nameExcit(name) {
    const [rows] = await pool.query("SELECT id FROM dishes WHERE name = ?", [name]);
    if (rows.length > 0) {
        return true
    }
    return false
}

function validateName(name) {
    if (!name || typeof name !== 'string' || !name.trim()) {
        return false
    }
    return true
}
function validateDescription(description) {
    if (!description || typeof description !== 'string' || !description.trim()) {
        return false
    }
    return true
}
function validatePrice(price) {
    if (price == null || isNaN(price) || price <= 0) {
        return false
    }
    return true
}
function validatePage(page) {
    if (page == null || isNaN(page) || page < 1) {
        return false
    }
    return true
}
function validateLimit(limit) {
    if (limit == null || isNaN(limit) || limit < 1) {
        return false
    }
    return true
}
module.exports = {
    nameExcit,
    validateName,
    validateDescription,
    validatePrice,
    validatePage,
    validateLimit
};