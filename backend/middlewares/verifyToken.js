const jwt = require('jsonwebtoken');
const httpStatusText = require('../utils/httpStatusText');
module.exports = (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    if (!authHeader) {
     return res.status(401).json({ status: httpStatusText.ERROR, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const currentUser = jwt.verify(token, process.env.JWT_SECRET);
        req.currentUser = currentUser;
        next();

    } catch (err) {
        return res.status(401).json({ status: httpStatusText.ERROR, message: 'Invalid token' });
    }

}