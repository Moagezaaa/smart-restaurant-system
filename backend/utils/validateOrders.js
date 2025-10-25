function validateTableNumber (table_number) {
  if (!table_number || isNaN(table_number) || table_number < 1|| table_number > 10) {
    return false;
  }
  return true;
}
function validateItems (items) {
  if (!Array.isArray(items) || items.length === 0) {
    return false;
  }
  for (let item of items) {
    if (!item.name || !item.quantity || !item.preparation_time) {
      return false;
    }
  }
  return true;
}
module.exports = {
  validateTableNumber,
  validateItems
}