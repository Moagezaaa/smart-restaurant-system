const jwt = require('jsonwebtoken');
const asyncWrap = require('../middlewares/asyncWrapper');
const httpStatusText = require('../utils/httpStatusText');
const client = require('../config/redis');
require("dotenv").config();

const login = asyncWrap(async (req, res, next) => {
  const { email, password } = req.body;
  if (process.env.ADMIN_EMAIL !== email || process.env.ADMIN_PASSWORD !== password) {
    return res.status(401).json({ status: httpStatusText.ERROR, message: 'Invalid email or password' });
  }
  const token = jwt.sign( { email: process.env.ADMIN_EMAIL, name: "Admin" }, process.env.JWT_SECRET, { expiresIn: '1d' } );
  await client.set(`token:${email}`, token, { EX: 86400 });
  res.status(200).json({ status: httpStatusText.SUCCESS,  data: 'Login successful',  token });
});

const logout = asyncWrap(async (req, res, next) => {
  const { email } = req.user;
  await client.del(`token:${email}`);

  res.status(200).json({ status: httpStatusText.SUCCESS, data: 'Logout successful' });
});

module.exports = { login, logout };
