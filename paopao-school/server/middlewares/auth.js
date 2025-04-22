const jwt = require('jsonwebtoken');
const { secret } = require('../config');

module.exports = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ code: 4010, message: '未授权' });
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ code: 4010, message: '无效令牌' });
    }
};