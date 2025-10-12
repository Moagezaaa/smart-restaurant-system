const { pool } = require("../config/db");
const asyncWrap = require("../middlewares/asyncWrapper");
const httpStatusText = require("../utils/httpStatusText");
const validateDishes = require("../utils/validateDishes");

const getAllDishes = asyncWrap(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM dishes");
  res.status(200).json({ status: httpStatusText.SUCCESS, data: rows });
});

const getAvailableDishes = asyncWrap(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM dishes where is_available=?", [
    true,
  ]);
  res.status(200).json({ status: httpStatusText.SUCCESS, data: rows });
});

const getNotAvailableDishes = asyncWrap(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM dishes where is_available=?", [
    false,
  ]);
  res.status(200).json({ status: httpStatusText.SUCCESS, data: rows });
});

const addDish = asyncWrap(async (req, res) => {
  const { name, description, price, is_available } = req.body;
  if (await validateDishes.nameExcit(name)) {
    return res.status(400).json({
      status: httpStatusText.FAIL,
      message: "Dish name already exists",
    });
  }
  if (!validateDishes.validateName(name)) {
    return res
      .status(400)
      .json({ status: httpStatusText.FAIL, message: "Invalid dish name" });
  }
  if (!validateDishes.validateDescription(description)) {
    return res.status(400).json({
      status: httpStatusText.FAIL,
      message: "Invalid dish description",
    });
  }
  if (!validateDishes.validatePrice(price)) {
    return res
      .status(400)
      .json({ status: httpStatusText.FAIL, message: "Invalid dish price" });
  }
  await pool.query(
    "INSERT INTO dishes (name, description, price, is_available) VALUES (?, ?, ?, coalesce(?, true))",
    [name, description, price, is_available],
  );
  res.status(201).json({
    status: httpStatusText.SUCCESS,
    message: "Dish added successfully",
  });
});

const deleteDish = asyncWrap(async (req, res) => {
  const { name } = req.body;
  if (!validateDishes.validateName(name)) {
    return res
      .status(400)
      .json({ status: httpStatusText.FAIL, message: "Invalid dish name" });
  }
  if (!(await validateDishes.nameExcit(name))) {
    return res.status(400).json({
      status: httpStatusText.FAIL,
      message: "Dish name does not exist",
    });
  }
  await pool.query("DELETE FROM dishes WHERE name = ?", [name]);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Dish deleted successfully",
  });
});

const Available = asyncWrap(async (req, res) => {
  const { name } = req.body;
  if (!validateDishes.validateName(name)) {
    return res
      .status(400)
      .json({ status: httpStatusText.FAIL, message: "Invalid dish name" });
  }
  if (!(await validateDishes.nameExcit(name))) {
    return res.status(400).json({
      status: httpStatusText.FAIL,
      message: "Dish name does not exist",
    });
  }
  await pool.query("UPDATE dishes SET is_available=? WHERE name=?", [
    true,
    name,
  ]);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Dish availability updated successfully",
  });
});

const NotAvailable = asyncWrap(async (req, res) => {
  const { name } = req.body;
  if (!validateDishes.validateName(name)) {
    return res
      .status(400)
      .json({ status: httpStatusText.FAIL, message: "Invalid dish name" });
  }
  if (!(await validateDishes.nameExcit(name))) {
    return res.status(400).json({
      status: httpStatusText.FAIL,
      message: "Dish name does not exist",
    });
  }
  await pool.query("UPDATE dishes SET is_available=? WHERE name=?", [
    false,
    name,
  ]);
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
