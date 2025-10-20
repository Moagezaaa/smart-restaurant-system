const jwt = require('jsonwebtoken');
const asyncWrap = require('./asyncWrapper');
const httpStatusText = require('../utils/httpStatusText');
const client = require('../config/redis');
require('dotenv').config();

const authMiddleware = asyncWrap(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ status: httpStatusText.ERROR, message: 'No token provided'});
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const redisToken = await client.get(`token:${decoded.email}`);
    if (!redisToken || redisToken !== token) {
        return res.status(401).json({  status: httpStatusText.ERROR,  message: 'Token expired or invalid'});
    }
    await client.expire(`token:${decoded.email}`, 86400);
    req.user = decoded;
    next();
});

module.exports = authMiddleware;
