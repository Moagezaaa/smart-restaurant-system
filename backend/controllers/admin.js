const jwt = require('jsonwebtoken');
const asyncWrap = require('../middlewares/asyncWrapper');
const httpStatusText = require('../utils/httpStatusText');
require("dotenv").config();
const login = asyncWrap(async (req, res, next) => {
    const { email, password } = req.body;
    if(process.env.ADMIN_EMAIL !== email || process.env.ADMIN_PASSWORD !== password){
       return res.status(401).json({ status: httpStatusText.ERROR, message: 'Invalid email or password' });
    }
    const token = jwt.sign(
  { email: process.env.ADMIN_EMAIL, name: "Admin" },process.env.JWT_SECRET, { expiresIn: '1d' }
);

    res.status(200).json({ status: httpStatusText.SUCCESS, data: 'Login successful', token });
});
module.exports = { login };