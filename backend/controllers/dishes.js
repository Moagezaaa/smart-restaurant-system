const fs = require("fs");
const path = require("path");
const { pool } = require("../config/db");
const asyncWrap = require("../middlewares/asyncWrapper");
const httpStatusText = require("../utils/httpStatusText");
const validateDishes = require("../utils/validateDishes");

const buildImageUrl = (req, imageName) =>
  imageName ? `${req.protocol}://${req.get("host")}/pictures/${imageName}` : null;
const getAllDishes = asyncWrap(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM dishes");
  const data = rows.map((dish) => ({
    ...dish,
    image_url: buildImageUrl(req, dish.image),
  }));
  res.status(200).json({ status: httpStatusText.SUCCESS, data });
});
const getAvailableDishes = asyncWrap(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM dishes WHERE is_available = ?", [true]);
  const data = rows.map((dish) => ({
    ...dish,
    image_url: buildImageUrl(req, dish.image),
  }));
  res.status(200).json({ status: httpStatusText.SUCCESS, data });
});
const getNotAvailableDishes = asyncWrap(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM dishes WHERE is_available = ?", [false]);
  const data = rows.map((dish) => ({
    ...dish,
    image_url: buildImageUrl(req, dish.image),
  }));
  res.status(200).json({ status: httpStatusText.SUCCESS, data });
});

const addDish = asyncWrap(async (req, res) => {
  const { name, description, price, is_available } = req.body;
  const image = req.file ? req.file.filename : null;

  if (await validateDishes.nameExcit(name)) {
    return res.status(400).json({
      status: httpStatusText.FAIL,
      message: "Dish name already exists",
    });
  }

  if (!validateDishes.validateName(name))
    return res.status(400).json({ status: httpStatusText.FAIL, message: "Invalid dish name" });

  if (!validateDishes.validateDescription(description))
    return res.status(400).json({ status: httpStatusText.FAIL, message: "Invalid dish description" });

  if (!validateDishes.validatePrice(price))
    return res.status(400).json({ status: httpStatusText.FAIL, message: "Invalid dish price" });

  await pool.query(
    "INSERT INTO dishes (name, description, price, is_available, image) VALUES (?, ?, ?, COALESCE(?, true), ?)",
    [name, description, price, is_available, image]
  );

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    message: "Dish added successfully",
  });
});

const deleteDish = asyncWrap(async (req, res) => {
  const { name } = req.body;

  if (!validateDishes.validateName(name))
    return res.status(400).json({ status: httpStatusText.FAIL, message: "Invalid dish name" });

  const [rows] = await pool.query("SELECT image FROM dishes WHERE name = ?", [name]);
  if (rows.length === 0)
    return res.status(400).json({ status: httpStatusText.FAIL, message: "Dish name does not exist" });

  const imageName = rows[0].image;
  if (imageName) {
    const imagePath = path.join(__dirname, "../pictures", imageName);
    fs.unlink(imagePath, (err) => {
      if (err) console.warn("⚠️ Failed to delete image:", err.message);
      else console.log(`🗑️ Deleted image: ${imageName}`);
    });
  }
  await pool.query("DELETE FROM dishes WHERE name = ?", [name]);

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Dish and its image deleted successfully",
  });
});

const Available = asyncWrap(async (req, res) => {
  const { name } = req.body;
  if (!validateDishes.validateName(name))
    return res.status(400).json({ status: httpStatusText.FAIL, message: "Invalid dish name" });

  if (!(await validateDishes.nameExcit(name)))
    return res.status(400).json({ status: httpStatusText.FAIL, message: "Dish name does not exist" });

  await pool.query("UPDATE dishes SET is_available = ? WHERE name = ?", [true, name]);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Dish availability updated successfully",
  });
});

const NotAvailable = asyncWrap(async (req, res) => {
  const { name } = req.body;
  if (!validateDishes.validateName(name))
    return res.status(400).json({ status: httpStatusText.FAIL, message: "Invalid dish name" });

  if (!(await validateDishes.nameExcit(name)))
    return res.status(400).json({ status: httpStatusText.FAIL, message: "Dish name does not exist" });

  await pool.query("UPDATE dishes SET is_available = ? WHERE name = ?", [false, name]);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Dish availability updated successfully",
  });
});

module.exports = {
  getAllDishes,
  getAvailableDishes,
  getNotAvailableDishes,
  addDish,
  deleteDish,
  Available,
  NotAvailable,
};
